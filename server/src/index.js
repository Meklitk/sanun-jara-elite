import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import multer from "multer";
import bcrypt from "bcryptjs";
import { z } from "zod";

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
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

const app = express();

//
// ✅ CORS (MULTIPLE ORIGINS SUPPORT)
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
// ✅ Upload setup
//
const uploadDirAbs = path.resolve(process.cwd(), UPLOAD_DIR);
fs.mkdirSync(uploadDirAbs, { recursive: true });

app.use("/uploads", express.static(uploadDirAbs));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDirAbs),
  filename: (_req, file, cb) => {
    const safeBase = (file.originalname || "upload").replace(/[^\w.\-]+/g, "_");
    const unique = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    cb(null, `${unique}_${safeBase}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

//
// ✅ HEALTH
//
app.get("/api/health", (_req, res) => res.json({ ok: true }));

//
// ✅ AUTH
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
// ✅ UPLOAD
//
app.post("/api/upload", requireAdmin(JWT_SECRET), upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "missing_file" });

    const url = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    const media = await Media.create({
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.filename,
      url
    });

    res.json({ media });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "upload_failed" });
  }
});

//
// ✅ CONTENT APIs
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
    ).optional()
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