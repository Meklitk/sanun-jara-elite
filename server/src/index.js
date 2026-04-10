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
const upload = multer({ storage });

const PAGE_ORDER = [
  "introduction",
  "history",
  "governance",
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
          description: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional()
        })
      )
      .optional(),
    governance: z
      .object({
        chiefdom: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        mandenMansa: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        mandenDjeliba: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        mandenMory: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        governmentName: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
        constitution: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional(),
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
              selection: z.object({ en: z.string().optional(), fr: z.string().optional().nullable() }).partial().optional()
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
      .optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_body" });

  const page = await Page.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true }).lean();
  if (!page) return res.status(404).json({ error: "not_found" });
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

