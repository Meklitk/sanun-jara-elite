import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import multer from "multer";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Buffer } from 'buffer';

import { connectDb } from "./db.js";
import { Admin } from "./models/Admin.js";
import { Page } from "./models/Page.js";
import { Media } from "./models/Media.js";
import { Content } from "./models/Content.js";
import { requireAdmin, signAdminToken } from "./auth.js";
import { seedAdminIfNeeded, seedPagesIfNeeded, ensureDefaultPages } from "./seed.js";

dotenv.config();

const PORT = Number(process.env.PORT || 8080);
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
// Use /tmp for uploads which is always writable on Railway
const UPLOAD_DIR = "/tmp";

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

// Memory storage for new uploads (stored in DB as base64)
const storage = multer.memoryStorage();

// Memory storage for small files (images, docs) - stored in DB as base64
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for DB storage
});

// Disk storage for large files (videos) - stored on filesystem
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const videoDir = path.join(uploadDirAbs, 'videos');
    try {
      fs.mkdirSync(videoDir, { recursive: true });
      console.log("Video upload directory:", videoDir);
      cb(null, videoDir);
    } catch (err) {
      console.error("Failed to create video directory:", err);
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = 'video-' + uniqueSuffix + ext;
    console.log("Saving video as:", filename);
    cb(null, filename);
  }
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit for videos
  fileFilter: (req, file, cb) => {
    // Accept video files only
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
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
// UPLOAD VIDEO - Store on disk (for large video files)
//
app.post("/api/upload-video", requireAdmin(JWT_SECRET), uploadVideo.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      console.error("Upload video failed: No file received");
      return res.status(400).json({ error: "missing_file" });
    }

    console.log("Video upload received:", file.originalname, "Size:", file.size, "Path:", file.path);

    // Verify file exists on disk
    if (!fs.existsSync(file.path)) {
      console.error("Upload video failed: File not found on disk after upload");
      return res.status(500).json({ error: "upload_failed", message: "File not saved to disk" });
    }

    // Create URL for the uploaded video
    const videoUrl = `/uploads/videos/${file.filename}`;

    // Store metadata in DB (but not the actual file data)
    const media = await Media.create({
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      data: null, // No base64 data for videos (too large)
      url: videoUrl
    });

    console.log("Video uploaded successfully:", media._id, "URL:", videoUrl);
    res.json({ media });
  } catch (err) {
    console.error("Video upload error:", err);
    if (err.message === 'Only video files are allowed') {
      return res.status(400).json({ error: "invalid_file_type", message: "Only video files are allowed" });
    }
    res.status(500).json({ error: "upload_failed", message: err.message });
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
  "resources"
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
          description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional()
        })
      ).optional(),
      organizations: z.array(
        z.object({
          name: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional()
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
        id: z.string(),
        name: z.string().optional(),
        role: z.string().optional(),
        bio: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        image: z.string().optional(),
        url: z.string().optional()
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
  // Start listening first so healthcheck can respond immediately
  app.listen(PORT, () => {
    console.log(`🚀 API running on port ${PORT}`);
  });

  try {
    await connectDb(MONGODB_URI);
    await seedAdminIfNeeded({
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "admin1234"
    });
    await seedPagesIfNeeded();
    await ensureDefaultPages();
    console.log("✅ DB connected and seeded");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  }
}

main().catch(console.error);