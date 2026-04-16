import express from "express";
import cors from "cors";
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

const PORT = Number(process.env.PORT || 5050);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sanun_jara_elite";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:8080";

const app = express();
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json({ limit: "2mb" }));

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
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max for PDFs
});

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

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/login", async (req, res) => {
  const schema = z.object({
    username: z.string().min(1),
    password: z.string().min(1)
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body" });

  const admin = await Admin.findOne({ username: parsed.data.username });
  if (!admin) return res.status(401).json({ error: "invalid_credentials" });

  const ok = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });

  const token = signAdminToken({ adminId: admin._id.toString() }, JWT_SECRET);
  return res.json({ token });
});

app.get("/api/pages", async (_req, res) => {
  const pages = sortPagesByNavOrder(await Page.find().lean());
  return res.json({ pages });
});

app.put("/api/pages/:id", requireAdmin(JWT_SECRET), async (req, res) => {
  const schema = z.object({
    key: z.string().min(1).optional(),
    title: z
      .object({ en: z.string().optional(), fr: z.string().optional().nullable() })
      .partial()
      .optional(),
    content: z
      .object({ en: z.string().optional(), fr: z.string().optional().nullable() })
      .partial()
      .optional(),
    images: z.array(z.string()).optional(),
    links: z
      .array(
        z.object({
          label: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          url: z.string().optional()
        })
      )
      .optional(),
    timeline: z
      .array(
        z.object({
          year: z.string().optional(),
          title: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          notes: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          image: z.string().optional(),
          url: z.string().optional()
        })
      )
      .optional(),
    governance: z
      .object({
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
        branches: z
          .array(
            z.object({
              name: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
              powers: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
              selection: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
              url: z.string().optional()
            })
          )
          .optional(),
        phone: z.string().optional()
      })
      .partial()
      .optional(),
    media: z
      .array(
        z.object({
          url: z.string(),
          title: z.string().optional(),
          type: z.enum(["video", "audio", "document"]),
          category: z.enum(["djelis", "donsos", "journalists", "other"]).optional()
        })
      )
      .optional(),
    directory: z
      .object({
        countries: z
          .array(
            z.object({
              name: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
              description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional()
            })
          )
          .optional(),
        organizations: z
          .array(
            z.object({
              name: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
              description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional()
            })
          )
          .optional()
      })
      .partial()
      .optional(),
    utilityCards: z
      .array(
        z.object({
          id: z.string(),
          title: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          url: z.string().optional()
        })
      )
      .optional(),
    institutions: z
      .array(
        z.object({
          id: z.string(),
          name: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          images: z.array(z.string()).optional(),
          videos: z.array(z.string()).optional()
        })
      )
      .optional(),
    architecturalProjects: z
      .array(
        z.object({
          id: z.string(),
          name: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
          conceptImages: z.array(z.string()).optional(),
          workImages: z.array(z.string()).optional()
        })
      )
      .optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    console.error("Validation error:", parsed.error.errors);
    return res.status(400).json({ error: "invalid_body", details: parsed.error.errors });
  }

  console.log("Updating page:", req.params.id, "with data keys:", Object.keys(parsed.data));
  
  const page = await Page.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true }).lean();
  if (!page) return res.status(404).json({ error: "not_found" });
  
  console.log("Page updated successfully. Has architecturalProjects:", !!page.architecturalProjects);
  return res.json({ page });
});

app.post("/api/admin/ensure-pages", requireAdmin(JWT_SECRET), async (_req, res) => {
  await ensureDefaultPages();
  const pages = sortPagesByNavOrder(await Page.find().lean());
  return res.json({ ok: true, pages });
});

app.post("/api/upload", requireAdmin(JWT_SECRET), upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "missing_file" });

  const url = `/uploads/${file.filename}`;
  const media = await Media.create({
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    path: file.filename,
    url
  });
  return res.json({ media });
});

// Content API endpoints (for dynamic content types like Religion, Civilization, etc.)
app.get("/api/content", async (_req, res) => {
  const content = await Content.find({ isPublished: true }).sort({ order: 1, slug: 1 }).lean();
  return res.json({ content });
});

app.get("/api/content/all", async (_req, res) => {
  const content = await Content.find().sort({ order: 1, slug: 1 }).lean();
  return res.json({ content });
});

app.get("/api/content/:slug", async (req, res) => {
  const item = await Content.findOne({ slug: req.params.slug, isPublished: true }).lean();
  if (!item) return res.status(404).json({ error: "not_found" });
  return res.json({ content: item });
});

app.post("/api/content", requireAdmin(JWT_SECRET), async (req, res) => {
  const schema = z.object({
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    title: z.object({ en: z.string().optional(), fr: z.string().optional() }).optional(),
    content: z.object({ en: z.string().optional(), fr: z.string().optional() }).optional(),
    icon: z.string().optional(),
    order: z.number().optional(),
    images: z.array(z.string()).optional(),
    links: z.array(
      z.object({
        label: z.object({ en: z.string().optional(), fr: z.string().optional() }).optional(),
        url: z.string().optional()
      })
    ).optional(),
    isPublished: z.boolean().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body", details: parsed.error.flatten() });

  const existing = await Content.findOne({ slug: parsed.data.slug }).lean();
  if (existing) return res.status(409).json({ error: "slug_exists" });

  const item = await Content.create(parsed.data);
  return res.status(201).json({ content: item });
});

app.put("/api/content/:id", requireAdmin(JWT_SECRET), async (req, res) => {
  const schema = z.object({
    title: z.object({ en: z.string().optional(), fr: z.string().optional() }).optional(),
    content: z.object({ en: z.string().optional(), fr: z.string().optional() }).optional(),
    icon: z.string().optional(),
    order: z.number().optional(),
    images: z.array(z.string()).optional(),
    links: z.array(
      z.object({
        label: z.object({ en: z.string().optional(), fr: z.string().optional() }).optional(),
        url: z.string().optional()
      })
    ).optional(),
    isPublished: z.boolean().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body" });

  const item = await Content.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true }).lean();
  if (!item) return res.status(404).json({ error: "not_found" });
  return res.json({ content: item });
});

app.delete("/api/content/:id", requireAdmin(JWT_SECRET), async (req, res) => {
  const item = await Content.findByIdAndDelete(req.params.id).lean();
  if (!item) return res.status(404).json({ error: "not_found" });
  return res.json({ ok: true });
});

async function main() {
  await connectDb(MONGODB_URI);
  await seedAdminIfNeeded({
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin1234"
  });
  await seedPagesIfNeeded();
  await ensureDefaultPages();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

