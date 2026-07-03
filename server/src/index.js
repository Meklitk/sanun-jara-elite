import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import multer from "multer";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Buffer } from 'buffer';
import { v2 as cloudinary } from 'cloudinary';

import { connectDb } from "./db.js";
import { Admin } from "./models/Admin.js";
import { Page } from "./models/Page.js";
import { Media } from "./models/Media.js";
import { Content } from "./models/Content.js";
import { CardImage } from "./models/CardImage.js";
import { TombouctouGalleryItem } from "./models/TombouctouGalleryItem.js";
import { Submission } from "./models/Submission.js";
import nodemailer from "nodemailer";
import { requireAdmin, signAdminToken } from "./auth.js";
import { seedAdminIfNeeded, seedPagesIfNeeded, ensureDefaultPages } from "./seed.js";
import {
  biographyDocumentExtension,
  biographyPublicUrl,
  deleteBiographyDocuments,
  deleteBiographyPortrait,
  getBiographyAssetBuffer,
  getBiographyDocumentsForSlug,
  isValidBiographySlug,
  listBiographyDocumentFilenames,
  migrateBiographyStoreFromDisk,
  purgeBiographyPortraitFiles,
  readBiographyProfiles,
  saveBiographyAsset,
  upsertBiographyProfile,
} from "./biography-store.js";

dotenv.config();

const PORT = Number(process.env.PORT || 8080);
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
// Use /tmp for uploads which is always writable on Railway
const UPLOAD_DIR = "/tmp";
const IS_RAILWAY = Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_SERVICE_ID);

function resolveContentDir(envKey, localRelativeParts, tmpParts) {
  if (process.env[envKey]) return process.env[envKey];
  const localDir = path.resolve(process.cwd(), ...localRelativeParts);
  if (!IS_RAILWAY) return localDir;
  return path.join("/tmp", "sanunjara", ...tmpParts);
}

// Configure Cloudinary for video storage (bypasses Railway 100MB limit)
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary configured for video uploads");
}

const app = express();

//
// CORS (MULTIPLE ORIGINS SUPPORT)
//
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map(o => o.trim()).filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // 🔥 force clean (avoid proxy duplication)
  res.removeHeader("Access-Control-Allow-Origin");
  res.removeHeader("access-control-allow-origin");

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json({ limit: "5mb" }));

//
// ✅ Upload setup - Store in memory for DB storage
//
const uploadDirAbs = UPLOAD_DIR;
try {
  fs.mkdirSync(uploadDirAbs, { recursive: true });
  console.log("Upload directory:", uploadDirAbs);
} catch (err) {
  console.error("Failed to create upload directory:", err);
}

// Serve video uploads from /tmp/videos
app.use("/uploads/videos", express.static(path.join(uploadDirAbs, 'videos')));

// Memory storage for small files (images, docs) - stored in DB as base64
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Memory storage for videos - piped to Cloudinary
const uploadVideo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("Only video files are allowed"));
  },
});

//
// HEALTH
//
app.get("/api/health", (_req, res) => res.json({ ok: true }));

//
// AUTH
//
app.post("/api/login", async (req, res) => {
  const parsed = z.object({
    username: z.string(),
    password: z.string()
  }).safeParse(req.body);

  if (!parsed.success) return res.status(400).json({ error: "invalid_body" });

  const admin = await Admin.findOne({ username: parsed.data.username });
  if (!admin) return res.status(401).json({ error: "invalid_credentials" });

  const ok = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });

  const token = signAdminToken(
    { adminId: admin._id.toString() },
    JWT_SECRET
  );

  res.json({ token });
});

//
// UPLOAD - Store in MongoDB as Base64 (for images, documents)
//
app.post("/api/upload", requireAdmin(JWT_SECRET), upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "missing_file" });

    // Convert buffer to base64
    const base64Data = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64Data}`;

    const media = await Media.create({
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      data: base64Data,
      url: dataUri
    });

    res.json({ media });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "upload_failed" });
  }
});

//
// BIOGRAPHY FILES — persisted in MongoDB (survives Railway redeploys)
//
const BIOGRAPHIES_DIR = resolveContentDir("BIOGRAPHIES_DIR", ["../public/biographies"], ["biographies"]);

try {
  fs.mkdirSync(BIOGRAPHIES_DIR, { recursive: true });
  console.log("Biographies directory:", BIOGRAPHIES_DIR);
} catch (err) {
  console.error("Failed to create biographies directory:", err);
}

const PROFILES_FILE = path.join(BIOGRAPHIES_DIR, "profiles.json");

const biographyUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const name = file.originalname.toLowerCase();
    const isPdf = file.mimetype === "application/pdf" || name.endsWith(".pdf");
    const isPng = file.mimetype === "image/png" || name.endsWith(".png");
    if (isPdf || isPng) cb(null, true);
    else cb(new Error("Only PDF or PNG files are allowed."));
  },
});

const biographyPortraitUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed."));
  },
});

app.get("/biographies/:filename", async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    if (!filename || filename.includes("..")) {
      return res.status(400).json({ error: "invalid_filename" });
    }

    const asset = await getBiographyAssetBuffer(filename, BIOGRAPHIES_DIR);
    if (!asset || !asset.buffer?.length) return res.status(404).json({ error: "not_found" });

    res.set("Content-Type", asset.mimeType);
    res.set("Content-Length", String(asset.buffer.length));
    res.set("Content-Disposition", `inline; filename="${filename}"`);
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.set("Access-Control-Allow-Origin", "*");
    return res.send(asset.buffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "read_failed" });
  }
});

app.head("/biographies/:filename", async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    if (!filename || filename.includes("..")) {
      return res.status(400).end();
    }

    const asset = await getBiographyAssetBuffer(filename, BIOGRAPHIES_DIR);
    if (!asset) return res.status(404).end();

    res.set("Content-Type", asset.mimeType);
    res.set("Content-Length", String(asset.buffer.length));
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return res.status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

app.get("/api/biography-documents/:slug", async (req, res) => {
  try {
    const slug = String(req.params.slug ?? "").trim();
    if (!isValidBiographySlug(slug)) {
      return res.status(400).json({ error: "invalid_slug" });
    }

    const documents = await getBiographyDocumentsForSlug(slug);
    res.json({ documents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "read_failed" });
  }
});

app.get("/api/admin/biography-files", requireAdmin(JWT_SECRET), async (_req, res) => {
  try {
    const files = await listBiographyDocumentFilenames();
    res.json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "list_failed" });
  }
});

app.post(
  "/api/admin/biography-file",
  requireAdmin(JWT_SECRET),
  biographyUpload.single("file"),
  async (req, res) => {
    try {
      const slug = String(req.body.slug ?? "").trim();
      const lang = String(req.body.lang ?? "").trim();

      if (!slug || !["fr", "en"].includes(lang)) {
        return res.status(400).json({ error: "invalid_params" });
      }
      if (!isValidBiographySlug(slug)) {
        return res.status(400).json({ error: "invalid_slug" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "missing_file" });
      }

      if (!req.file?.buffer?.length) {
        return res.status(400).json({ error: "empty_file" });
      }

      const ext = biographyDocumentExtension(req.file);
      if (!ext) {
        return res.status(400).json({ error: "invalid_file_type" });
      }

      const filename = `${slug}-${lang}${ext}`;
      await deleteBiographyDocuments(slug, lang, BIOGRAPHIES_DIR);
      const asset = await saveBiographyAsset({
        filename,
        slug,
        kind: "document",
        lang,
        mimeType: req.file.mimetype,
        buffer: req.file.buffer,
      });

      res.json({
        ok: true,
        filename,
        url: biographyPublicUrl(filename, asset.updatedAt),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "upload_failed" });
    }
  },
);

app.delete("/api/admin/biography-file", requireAdmin(JWT_SECRET), async (req, res) => {
  try {
    const slug = String(req.body.slug ?? "").trim();
    const lang = String(req.body.lang ?? "").trim();

    if (!slug || !["fr", "en"].includes(lang) || !isValidBiographySlug(slug)) {
      return res.status(400).json({ error: "invalid_params" });
    }

    await deleteBiographyDocuments(slug, lang, BIOGRAPHIES_DIR);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "delete_failed" });
  }
});

app.get("/api/biography-profiles", async (_req, res) => {
  try {
    const profiles = await readBiographyProfiles();
    res.json({ profiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "read_failed" });
  }
});

app.put("/api/admin/biography-profile", requireAdmin(JWT_SECRET), async (req, res) => {
  try {
    const parsed = z
      .object({
        slug: z.string().min(1),
        summary: z.object({
          fr: z.string().optional(),
          en: z.string().optional(),
        }),
      })
      .safeParse(req.body);

    if (!parsed.success) return res.status(400).json({ error: "invalid_body" });
    if (!isValidBiographySlug(parsed.data.slug)) {
      return res.status(400).json({ error: "invalid_slug" });
    }

    const profile = await upsertBiographyProfile(parsed.data.slug, {
      summary: {
        fr: parsed.data.summary.fr ?? "",
        en: parsed.data.summary.en ?? "",
      },
    });

    res.json({ ok: true, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "save_failed" });
  }
});

app.post(
  "/api/admin/biography-portrait",
  requireAdmin(JWT_SECRET),
  biographyPortraitUpload.single("file"),
  async (req, res) => {
    try {
      const slug = String(req.body.slug ?? "").trim();
      if (!slug || !isValidBiographySlug(slug)) {
        return res.status(400).json({ error: "invalid_slug" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "missing_file" });
      }

      if (!req.file?.buffer?.length) {
        return res.status(400).json({ error: "empty_file" });
      }

      const ext = path.extname(req.file.originalname).toLowerCase() || ".jpg";
      const filename = `${slug}-portrait${ext}`;

      await purgeBiographyPortraitFiles(slug, BIOGRAPHIES_DIR);
      const asset = await saveBiographyAsset({
        filename,
        slug,
        kind: "portrait",
        lang: null,
        mimeType: req.file.mimetype,
        buffer: req.file.buffer,
      });

      const portraitUrl = biographyPublicUrl(filename, asset.updatedAt);
      const profile = await upsertBiographyProfile(slug, { portrait: portraitUrl });

      res.json({ ok: true, portrait: portraitUrl, profile });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "upload_failed" });
    }
  },
);

app.delete("/api/admin/biography-portrait", requireAdmin(JWT_SECRET), async (req, res) => {
  try {
    const slug = String(req.body.slug ?? "").trim();
    if (!slug || !isValidBiographySlug(slug)) {
      return res.status(400).json({ error: "invalid_slug" });
    }

    const profile = await deleteBiographyPortrait(slug, BIOGRAPHIES_DIR);
    res.json({ ok: true, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "delete_failed" });
  }
});

//
// CARD ILLUSTRATIONS — saved to public/images/cards/ for section cards
//
const CARDS_DIR = resolveContentDir("CARDS_DIR", ["../public/images/cards"], ["images", "cards"]);

const CARD_IMAGE_FILENAMES = {
  affiliationHero: "affiliation-bowing.svg",
  organizationHero: "organization-mansa-musa.svg",
  federationHero: "federation-hero.svg",
  referenceBureauJoin: "join-dozo-hunter.svg",
  referenceBureauQuestions: "questions.svg",
  referenceBureauEntrepreneur: "entrepreneur.svg",
  referenceBureauCotiser: "cotiser.svg",
  nianiInstitutions: "niani-institutions.svg",
  nianiArchitecture: "niani-architecture.svg",
  nianiTv: "niani-tv.jpg",
  nianiCartoons: "niani-cartoons.svg",
  nianiWomen: "niani-women.svg",
  academyNko: "academy-nko.jpg",
  academyHistory: "academy-history.svg",
  academyOthers: "academy-others.svg",
  commerceMarket: "commerce-market.svg",
  economyHero: "economy-hero.svg",
};

try {
  fs.mkdirSync(CARDS_DIR, { recursive: true });
  console.log("Cards directory:", CARDS_DIR);
} catch (err) {
  console.error("Failed to create cards directory:", err);
}

const cardImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed."));
  },
});

function cloudinaryConfigured() {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
}

function uploadCardImageBuffer(buffer, slot) {
  if (!cloudinaryConfigured()) {
    return Promise.reject(new Error("cloudinary_not_configured"));
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "sanunjara/cards",
        public_id: `card-${slot}`,
        overwrite: true,
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

function uploadTombouctouGalleryBuffer(buffer, publicId) {
  if (!cloudinaryConfigured()) {
    return Promise.reject(new Error("cloudinary_not_configured"));
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "sanunjara/tombouctou-gallery",
        public_id: publicId,
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

async function buildCardImagesPayload() {
  const records = await CardImage.find().lean();
  const bySlot = Object.fromEntries(records.map((record) => [record.slot, record]));

  const files = {};
  const urls = {};

  for (const [slot, filename] of Object.entries(CARD_IMAGE_FILENAMES)) {
    const record = bySlot[slot];
    if (record?.url) {
      files[slot] = true;
      urls[slot] = record.url;
      continue;
    }

    const localPath = path.join(CARDS_DIR, filename);
    if (fs.existsSync(localPath)) {
      files[slot] = true;
      urls[slot] = `/images/cards/${filename}`;
    } else {
      files[slot] = false;
    }
  }

  return { files, urls };
}

app.use("/images/cards", express.static(CARDS_DIR));

app.get("/api/card-images", async (_req, res) => {
  try {
    const payload = await buildCardImagesPayload();
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "list_failed" });
  }
});

app.post(
  "/api/admin/card-image",
  requireAdmin(JWT_SECRET),
  cardImageUpload.single("file"),
  async (req, res) => {
    try {
      const slot = String(req.body.slot ?? "").trim();
      const filename = CARD_IMAGE_FILENAMES[slot];
      if (!filename) {
        return res.status(400).json({ error: "invalid_slot" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "missing_file" });
      }

      let url;
      let cloudinaryPublicId = null;

      if (cloudinaryConfigured()) {
        const result = await uploadCardImageBuffer(req.file.buffer, slot);
        url = result.secure_url;
        cloudinaryPublicId = result.public_id;
      } else {
        fs.writeFileSync(path.join(CARDS_DIR, filename), req.file.buffer);
        url = `/images/cards/${filename}`;
      }

      await CardImage.findOneAndUpdate(
        { slot },
        { url, cloudinaryPublicId },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      res.json({
        ok: true,
        slot,
        filename,
        url,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "upload_failed", message: err.message });
    }
  }
);

app.delete("/api/admin/card-image/:slot", requireAdmin(JWT_SECRET), async (req, res) => {
  try {
    const slot = String(req.params.slot ?? "").trim();
    const filename = CARD_IMAGE_FILENAMES[slot];
    if (!filename) {
      return res.status(400).json({ error: "invalid_slot" });
    }

    const record = await CardImage.findOne({ slot }).lean();
    if (record?.cloudinaryPublicId && cloudinaryConfigured()) {
      try {
        await cloudinary.uploader.destroy(record.cloudinaryPublicId, { resource_type: "image" });
      } catch (destroyErr) {
        console.warn("Cloudinary delete failed for card image:", destroyErr.message);
      }
    }

    const filePath = path.join(CARDS_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await CardImage.deleteOne({ slot });

    res.json({ ok: true, slot, filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "delete_failed" });
  }
});

//
// TOMBOUCTOU GALLERY
//
const MASONRY_SIZES = ["small", "medium", "large", "tall", "wide"];

function parseLocalizedField(raw, fallback = "") {
  if (!raw) return { en: fallback, fr: fallback };
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return {
      en: String(parsed?.en ?? fallback),
      fr: String(parsed?.fr ?? parsed?.en ?? fallback),
    };
  } catch {
    return { en: String(raw), fr: String(raw) };
  }
}

app.get("/api/tombouctou-gallery", async (_req, res) => {
  try {
    const items = await TombouctouGalleryItem.find()
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "list_failed" });
  }
});

app.post(
  "/api/admin/tombouctou-gallery",
  requireAdmin(JWT_SECRET),
  upload.single("file"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: "missing_file" });
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({ error: "invalid_file_type" });
      }

      let url;
      let cloudinaryPublicId = "";

      if (cloudinaryConfigured()) {
        const publicId = `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const result = await uploadTombouctouGalleryBuffer(file.buffer, publicId);
        url = result.secure_url;
        cloudinaryPublicId = result.public_id;

        await Media.create({
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          data: null,
          url,
          cloudinaryPublicId,
        });
      } else {
        const base64Data = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype};base64,${base64Data}`;

        await Media.create({
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          data: base64Data,
          url: dataUri,
        });
        url = dataUri;
      }

      const count = await TombouctouGalleryItem.countDocuments();
      const title = parseLocalizedField(req.body.title, file.originalname.replace(/\.[^.]+$/, ""));
      const caption = parseLocalizedField(req.body.caption);
      const altText = parseLocalizedField(req.body.altText, title.en);
      const size = MASONRY_SIZES.includes(req.body.size) ? req.body.size : "medium";
      const isFeatured = req.body.isFeatured === "true" || req.body.isFeatured === true;

      if (isFeatured) {
        await TombouctouGalleryItem.updateMany({}, { $set: { isFeatured: false } });
      }

      const item = await TombouctouGalleryItem.create({
        url,
        title,
        caption,
        altText,
        displayOrder: count,
        isFeatured: isFeatured || count === 0,
        size,
        cloudinaryPublicId,
      });

      res.json({ item });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "create_failed", message: err.message });
    }
  }
);

app.put("/api/admin/tombouctou-gallery/:id", requireAdmin(JWT_SECRET), async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await TombouctouGalleryItem.findById(id);
    if (!existing) return res.status(404).json({ error: "not_found" });

    const patch = {};
    if (req.body.title !== undefined) patch.title = parseLocalizedField(req.body.title);
    if (req.body.caption !== undefined) patch.caption = parseLocalizedField(req.body.caption);
    if (req.body.altText !== undefined) patch.altText = parseLocalizedField(req.body.altText);
    if (req.body.size !== undefined && MASONRY_SIZES.includes(req.body.size)) {
      patch.size = req.body.size;
    }
    if (req.body.displayOrder !== undefined) {
      patch.displayOrder = Number(req.body.displayOrder);
    }
    if (req.body.isFeatured === true || req.body.isFeatured === "true") {
      await TombouctouGalleryItem.updateMany({}, { $set: { isFeatured: false } });
      patch.isFeatured = true;
    } else if (req.body.isFeatured === false || req.body.isFeatured === "false") {
      patch.isFeatured = false;
    }

    const item = await TombouctouGalleryItem.findByIdAndUpdate(id, patch, { new: true }).lean();
    res.json({ item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "update_failed" });
  }
});

app.put("/api/admin/tombouctou-gallery/reorder", requireAdmin(JWT_SECRET), async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids.map(String) : [];
    if (ids.length === 0) return res.status(400).json({ error: "invalid_ids" });

    const ops = ids.map((id, index) =>
      TombouctouGalleryItem.updateOne({ _id: id }, { $set: { displayOrder: index } })
    );
    await Promise.all(ops);

    const items = await TombouctouGalleryItem.find()
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "reorder_failed" });
  }
});

app.delete("/api/admin/tombouctou-gallery/:id", requireAdmin(JWT_SECRET), async (req, res) => {
  try {
    const { id } = req.params;
    const item = await TombouctouGalleryItem.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ error: "not_found" });

    if (item.cloudinaryPublicId && cloudinaryConfigured()) {
      try {
        await cloudinary.uploader.destroy(item.cloudinaryPublicId, { resource_type: "image" });
      } catch (err) {
        console.error("Cloudinary delete failed:", err);
      }
    }

    const remaining = await TombouctouGalleryItem.find()
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean();

    if (remaining.length > 0 && !remaining.some((r) => r.isFeatured)) {
      await TombouctouGalleryItem.findByIdAndUpdate(remaining[0]._id, { isFeatured: true });
    }

    await Promise.all(
      remaining.map((r, index) =>
        TombouctouGalleryItem.updateOne({ _id: r._id }, { $set: { displayOrder: index } })
      )
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "delete_failed" });
  }
});

//
// UPLOAD VIDEO - streams buffer to Cloudinary
//
app.post("/api/upload-video", requireAdmin(JWT_SECRET), uploadVideo.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "missing_file" });

    console.log("Video upload received:", file.originalname, "size:", file.size);

    if (!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET)) {
      return res.status(500).json({ error: "cloudinary_not_configured", message: "Set CLOUDINARY_* env vars on Railway" });
    }

    // Stream buffer directly to Cloudinary (no disk needed)
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "video", folder: "niani-tv" },
        (error, result) => error ? reject(error) : resolve(result)
      );
      stream.end(file.buffer);
    });

    const media = await Media.create({
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      data: null,
      url: result.secure_url,
    });

    console.log("Video uploaded to Cloudinary:", result.secure_url);
    return res.json({ media });
  } catch (err) {
    console.error("Video upload error:", err);
    res.status(500).json({ error: "upload_failed", message: err.message });
  }
});

//
// CLOUDINARY DIRECT UPLOAD SIGNATURE (bypasses Railway 100MB limit)
// Frontend uploads directly to Cloudinary using this signature
//
app.get("/api/cloudinary-signature", requireAdmin(JWT_SECRET), (_req, res) => {
  if (!CLOUDINARY_API_SECRET) {
    return res.status(500).json({ error: "cloudinary_not_configured" });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = "niani-tv";
  
  // Generate signature for direct upload
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder, resource_type: "video" },
    CLOUDINARY_API_SECRET
  );

  res.json({
    signature,
    timestamp,
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    folder,
    resourceType: "video"
  });
});

//
// SAVE CLOUDINARY VIDEO URL to Database (after direct upload)
//
app.post("/api/save-cloudinary-video", requireAdmin(JWT_SECRET), async (req, res) => {
  try {
    const { url, originalName, publicId, size } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "missing_url" });
    }

    const media = await Media.create({
      originalName: originalName || "video",
      mimeType: "video/mp4",
      size: size || 0,
      data: null,
      url: url,
      cloudinaryPublicId: publicId,
    });

    console.log("Cloudinary video saved to DB:", media._id, "URL:", url);
    res.json({ media });
  } catch (err) {
    console.error("Save cloudinary video error:", err);
    res.status(500).json({ error: "save_failed", message: err.message });
  }
});

//
// SERVE IMAGE from Database (for images stored as base64)
//
app.get("/api/media/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: "not_found" });

    // If stored as base64 data
    if (media.data) {
      const buffer = Buffer.from(media.data, 'base64');
      res.set('Content-Type', media.mimeType);
      res.set('Cache-Control', 'public, max-age=31536000');
      return res.send(buffer);
    }

    // Legacy: redirect to file URL
    res.redirect(media.url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed_to_load_image" });
  }
});

//
// LIST ALL MEDIA
//
app.get("/api/media", async (_req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 }).lean();
    res.json({ media });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed_to_list_media" });
  }
});

//
// CONTENT APIs
//
app.get("/api/content", async (_req, res) => {
  const content = await Content.find({ isPublished: true })
    .sort({ order: 1 })
    .lean();

  res.json({ content });
});

app.get("/api/content/all", async (_req, res) => {
  const content = await Content.find()
    .sort({ order: 1 })
    .lean();

  res.json({ content });
});

app.get("/api/content/:slug", async (req, res) => {
  const item = await Content.findOne({
    slug: req.params.slug,
    isPublished: true
  }).lean();

  if (!item) return res.status(404).json({ error: "not_found" });

  res.json({ content: item });
});

app.post("/api/content", requireAdmin(JWT_SECRET), async (req, res) => {
  const parsed = z.object({
    slug: z.string(),
    title: z.any().optional(),
    content: z.any().optional(),
    images: z.array(z.string()).optional()
  }).safeParse(req.body);

  if (!parsed.success) return res.status(400).json({ error: "invalid_body" });

  const item = await Content.create(parsed.data);
  res.status(201).json({ content: item });
});

app.put("/api/content/:id", requireAdmin(JWT_SECRET), async (req, res) => {
  const item = await Content.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).lean();

  if (!item) return res.status(404).json({ error: "not_found" });

  res.json({ content: item });
});

app.delete("/api/content/:id", requireAdmin(JWT_SECRET), async (req, res) => {
  await Content.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

//
// SUBMISSIONS & EMAIL APIS (for Membership Questionnaire and Contact/Questions forms)
//
async function sendEmailSubmission(sub) {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number((process.env.SMTP_PORT || "587").trim());
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !user || !pass) {
    console.log("ℹ️ SMTP configuration is incomplete. Skipping email sending. Submissions are still saved in DB.");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465 || process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });

    const from = (process.env.SMTP_FROM || "info@sanunjara.com").trim();
    const to = (process.env.SMTP_TO || "info@sanunjara.com").trim();

    let subject = "";
    let html = "";

    if (sub.type === "membership") {
      subject = `New Membership Application from ${sub.name}`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px;">
          <h2 style="color: #d97706; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">Sanun Jara Membership Application</h2>
          <p><strong>Name:</strong> ${sub.name}</p>
          <p><strong>Email:</strong> ${sub.email}</p>
          <p><strong>Phone:</strong> ${sub.phone || 'N/A'}</p>
          <p><strong>Profession:</strong> ${sub.profession || 'N/A'}</p>
          
          <h3 style="color: #d97706; margin-top: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Questionnaire Answers</h3>
          <ol style="padding-left: 20px; line-height: 1.6;">
      `;
      
      if (sub.answers) {
        for (const [qNum, ans] of Object.entries(sub.answers)) {
          html += `<li style="margin-bottom: 15px;"><strong>Question ${qNum}:</strong><br/><span style="color: #334155;">${ans}</span></li>`;
        }
      }
      
      html += `
          </ol>
        </div>
      `;
    } else {
      subject = `New Question/Contact Request from ${sub.name}`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px;">
          <h2 style="color: #b91c1c; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">Sanun Jara Contact Inquiry</h2>
          <p><strong>Name:</strong> ${sub.name}</p>
          <p><strong>Email:</strong> ${sub.email}</p>
          <p><strong>Phone:</strong> ${sub.phone || 'N/A'}</p>
          <div style="margin-top: 20px; background-color: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #ef4444;">
            <strong>Message/Question:</strong><br/>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #334155; margin-top: 5px;">${sub.message}</p>
          </div>
        </div>
      `;
    }

    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    console.log(`✉️ Email successfully sent to ${to} for submission: ${sub._id}`);
  } catch (error) {
    console.error("❌ Failed to send submission email via SMTP:", error);
  }
}

app.post("/api/submissions", async (req, res) => {
  try {
    const parsed = z.object({
      type: z.enum(["membership", "question"]),
      name: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
      profession: z.string().optional(),
      message: z.string().optional(),
      answers: z.any().optional(),
    }).parse(req.body);

    const sub = await Submission.create(parsed);
    
    // Send email asynchronously in the background so the user gets an instant response
    sendEmailSubmission(sub.toObject()).catch((err) => {
      console.error("Error in background email sender:", err);
    });

    res.status(201).json({ ok: true, submission: sub });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "validation_error", details: error.errors });
    }
    console.error("Submission creation failed:", error);
    res.status(500).json({ error: "internal_server_error" });
  }
});

app.get("/api/submissions", requireAdmin(JWT_SECRET), async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 }).lean();
    res.json({ submissions });
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    res.status(500).json({ error: "internal_server_error" });
  }
});

app.delete("/api/submissions/:id", requireAdmin(JWT_SECRET), async (req, res) => {
  try {
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete submission:", error);
    res.status(500).json({ error: "internal_server_error" });
  }
});

// Admin-only: verify SMTP config and send a real test email. Returns the actual
// SMTP error so misconfiguration (wrong password/host/port) can be diagnosed.
app.post("/api/test-email", requireAdmin(JWT_SECRET), async (req, res) => {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number((process.env.SMTP_PORT || "587").trim());
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = (process.env.SMTP_FROM || "info@sanunjara.com").trim();
  const to = (process.env.SMTP_TO || "info@sanunjara.com").trim();

  const missing = [];
  if (!host) missing.push("SMTP_HOST");
  if (!user) missing.push("SMTP_USER");
  if (!pass) missing.push("SMTP_PASS");
  if (missing.length) {
    return res.status(400).json({
      ok: false,
      stage: "config",
      error: `Missing SMTP env vars: ${missing.join(", ")}`,
    });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465 || process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });

  try {
    await transporter.verify();
  } catch (error) {
    console.error("❌ SMTP verify (login) failed:", error);
    return res.status(502).json({
      ok: false,
      stage: "verify",
      host,
      port,
      user,
      error: error?.message || String(error),
      code: error?.code,
    });
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: "Sanun Jara — SMTP test email",
      text: "If you received this, SMTP is configured correctly and form emails will be delivered.",
    });
    console.log(`✉️ Test email sent to ${to}: ${info.messageId}`);
    res.json({ ok: true, messageId: info.messageId, to });
  } catch (error) {
    console.error("❌ SMTP sendMail failed:", error);
    res.status(502).json({
      ok: false,
      stage: "send",
      error: error?.message || String(error),
      code: error?.code,
    });
  }
});

//
// ✅ PAGES APIs (for CMS pages like Niani, History, etc.)
//
const PAGE_ORDER = [
  "introduction",
  "history",
  "governance",
  "global-perspectives",
  "reference-bureau",
  "niani",
  "academy",
  "economy",
  "commerce",
  "culture",
  "resources",
  "tombouctou"
];

function sortPagesByNavOrder(pages) {
  const rank = (key) => {
    const i = PAGE_ORDER.indexOf(key);
    return i === -1 ? PAGE_ORDER.length : i;
  };
  return [...pages].sort((a, b) => rank(a.key) - rank(b.key) || String(a.key).localeCompare(String(b.key)));
}

app.get("/api/pages", async (_req, res) => {
  const pages = sortPagesByNavOrder(await Page.find().lean());
  return res.json({ pages });
});

app.put("/api/pages/:id", requireAdmin(JWT_SECRET), async (req, res) => {
  const schema = z.object({
    key: z.string().min(1).optional(),
    title: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
    content: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
    images: z.array(z.string()).optional(),
    links: z.array(
      z.object({
        label: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        url: z.string().optional()
      })
    ).optional(),
    timeline: z.array(
      z.object({
        year: z.string().optional(),
        title: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        notes: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        content: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        image: z.string().optional(),
        images: z.array(z.string()).optional(),
        url: z.string().optional()
      })
    ).optional(),
    governance: z.object({
      chiefdom: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
      chiefdomUrl: z.string().optional(),
      mandenMansa: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
      mandenMansaUrl: z.string().optional(),
      mandenDjeliba: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
      mandenDjelibaUrl: z.string().optional(),
      mandenMory: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
      mandenMoryUrl: z.string().optional(),
      governmentName: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
      governmentNameUrl: z.string().optional(),
      constitution: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
      constitutionUrl: z.string().optional(),
      governmentType: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
      corruptionIndex: z.string().optional(),
      corruptionSummary: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
      riskIndex: z.string().optional(),
      riskSummary: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
      taxInformation: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
      branches: z.array(
        z.object({
          name: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          powers: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          selection: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          url: z.string().optional()
        })
      ).optional(),
      phone: z.string().optional()
    }).partial().optional(),
    media: z.array(
      z.object({
        url: z.string(),
        title: z.string().optional(),
        type: z.enum(["video", "audio", "document"]),
        category: z.enum(["djelis", "donsos", "journalists", "other"]).optional()
      })
    ).optional(),
    directory: z.object({
      countries: z.array(
        z.object({
          name: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          url: z.string().optional()
        })
      ).optional(),
      organizations: z.array(
        z.object({
          name: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          url: z.string().optional()
        })
      ).optional(),
      affiliations: z.array(
        z.object({
          name: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          url: z.string().optional()
        })
      ).optional()
    }).partial().optional(),
    economy: z.object({
      currency: z.string().optional(),
      tables: z.array(
        z.object({
          id: z.string(),
          title: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          rows: z.array(
            z.object({
              label: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
              value: z.string().optional()
            })
          ).optional()
        })
      ).optional()
    }).partial().optional(),
    utilityCards: z.array(
      z.object({
        id: z.string(),
        title: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        url: z.string().optional()
      })
    ).optional(),
    biographies: z.array(
      z.object({
        slug: z.string(),
        name: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        role: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        kind: z.enum(["person", "institution"]).optional(),
        content: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        images: z.array(z.string()).optional(),
        meta: z.array(
          z.object({
            label: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
            value: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional()
          })
        ).optional()
      })
    ).optional(),
    institutions: z.array(
      z.object({
        id: z.string(),
        name: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        images: z.array(z.string()).optional(),
        videos: z.array(z.string()).optional()
      })
    ).optional(),
    architecturalProjects: z.array(
      z.object({
        id: z.string(),
        name: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        conceptImages: z.array(z.string()).optional(),
        workImages: z.array(z.string()).optional()
      })
    ).optional(),
    nkoAlphabetAudio: z.array(z.string()).optional(),
    featuredImage: z.string().optional()
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    console.error("Validation error:", parsed.error.errors);
    return res.status(400).json({ error: "invalid_body", details: parsed.error.errors });
  }

  console.log("Updating page:", req.params.id, "with data keys:", Object.keys(parsed.data));

  const page = await Page.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true }).lean();
  if (!page) return res.status(404).json({ error: "not_found" });

  console.log("Page updated successfully. Has institutions:", !!page.institutions, "Has projects:", !!page.architecturalProjects);
  return res.json({ page });
});

app.post("/api/admin/ensure-pages", requireAdmin(JWT_SECRET), async (_req, res) => {
  await ensureDefaultPages();
  const pages = sortPagesByNavOrder(await Page.find().lean());
  return res.json({ ok: true, pages });
});

//
// ✅ GLOBAL ERROR HANDLER
//
app.use((err, _req, res, _next) => {
  // Handle multer errors specifically
  if (err instanceof multer.MulterError) {
    console.error("Multer upload error:", err.code, err.message);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "file_too_large", message: "File size exceeds limit" });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ error: "unexpected_file", message: "Unexpected file field" });
    }
    return res.status(400).json({ error: "upload_error", message: err.message });
  }
  
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "internal_server_error", message: err.message });
});

//
// ✅ 404 HANDLER (must be last)
//
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url}`);
  res.status(404).json({ error: "not_found", path: req.url });
});

//
// ✅ START SERVER
//
async function main() {
  const server = app.listen(PORT, () => {
    console.log(`🚀 API running on port ${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} is already in use. Stop the other API process and restart.`);
      process.exit(1);
    }
    throw err;
  });

  try {
    await connectDb(MONGODB_URI);
    await seedAdminIfNeeded({
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "admin1234"
    });
    await seedPagesIfNeeded();
    await ensureDefaultPages();
    await migrateBiographyStoreFromDisk(BIOGRAPHIES_DIR, PROFILES_FILE);
    console.log("✅ DB connected and seeded");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  }
}

main().catch(console.error);