import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import multer from "multer";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { connectDb } from "./db.js";
import { Admin } from "./models/Admin.js";
import { Media } from "./models/Media.js";
import { Content } from "./models/Content.js";
import { requireAdmin, signAdminToken } from "./auth.js";
import { seedAdminIfNeeded, seedPagesIfNeeded, ensureDefaultPages } from "./seed.js";

dotenv.config();

const PORT = Number(process.env.PORT || 5050);
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

const app = express();

//
// ✅ BULLETPROOF CORS (manual — no duplicates)
//
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

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
// ✅ Health
//
app.get("/api/health", (_req, res) => res.json({ ok: true }));

//
// ✅ Auth
//
app.post("/api/login", async (req, res) => {
  const schema = z.object({
    username: z.string(),
    password: z.string()
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body" });

  const admin = await Admin.findOne({ username: parsed.data.username });
  if (!admin) return res.status(401).json({ error: "invalid_credentials" });

  const ok = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });

  const token = signAdminToken({ adminId: admin._id.toString() }, JWT_SECRET);
  res.json({ token });
});

//
// ✅ Upload
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

    return res.json({ media });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "upload_failed" });
  }
});

//
// ✅ CONTENT APIs
//
app.get("/api/content", async (_req, res) => {
  const content = await Content.find({ isPublished: true }).sort({ order: 1 }).lean();
  res.json({ content });
});

app.get("/api/content/all", async (_req, res) => {
  const content = await Content.find().sort({ order: 1 }).lean();
  res.json({ content });
});

app.get("/api/content/:slug", async (req, res) => {
  const item = await Content.findOne({ slug: req.params.slug, isPublished: true }).lean();
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
  const item = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  if (!item) return res.status(404).json({ error: "not_found" });
  res.json({ content: item });
});

app.delete("/api/content/:id", requireAdmin(JWT_SECRET), async (_req, res) => {
  res.json({ ok: true });
});

//
// ✅ START SERVER
//
async function main() {
  await connectDb(MONGODB_URI);

  await seedAdminIfNeeded({
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin1234"
  });

  await seedPagesIfNeeded();
  await ensureDefaultPages();

  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
}

main().catch(console.error);