import fs from "fs";
import path from "path";

import { BiographyAsset } from "./models/BiographyAsset.js";
import { BiographyAssetTombstone } from "./models/BiographyAssetTombstone.js";
import { BiographyProfile } from "./models/BiographyProfile.js";

export function isValidBiographySlug(slug) {
  return /^[a-z0-9-]+$/.test(slug);
}

export function isBiographyDocumentFilename(name) {
  return /-(fr|en)\.(pdf|png)$/i.test(name);
}

export function biographyDocumentExtension(file) {
  const name = file.originalname.toLowerCase();
  if (file.mimetype === "application/pdf" || name.endsWith(".pdf")) return ".pdf";
  if (file.mimetype === "image/png" || name.endsWith(".png")) return ".png";
  return null;
}

function toBuffer(value) {
  if (!value) return Buffer.alloc(0);
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (typeof value === "object" && value.buffer) {
    return Buffer.from(value.buffer);
  }
  return Buffer.from(value);
}

function isRawPdf(buffer) {
  return buffer.length >= 4 && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
}

function isRawPng(buffer) {
  return (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  );
}

export function normalizeBinaryAssetBuffer(buffer) {
  const raw = toBuffer(buffer);
  if (!raw.length) return raw;
  if (isRawPdf(raw) || isRawPng(raw)) return raw;

  let text = raw.toString("utf8").trim();
  if (text.startsWith("data:") && text.includes("base64,")) {
    text = text.slice(text.indexOf("base64,") + 7);
  }
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    text = text.slice(1, -1);
  }

  const compact = text.replace(/\s/g, "");
  if (/^[A-Za-z0-9+/=]+$/.test(compact) && compact.length > 32) {
    try {
      const decoded = Buffer.from(compact, "base64");
      if (decoded.length > 0) return decoded;
    } catch {
      // keep raw bytes
    }
  }

  return raw;
}

function sanitizeMimeType(mimeType, filename) {
  const base = String(mimeType || "").split(";")[0].trim();
  if (base) return base;

  const ext = path.extname(filename).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

export function biographyPublicUrl(filename, updatedAt) {
  const base = `/biographies/${filename}`;
  if (!updatedAt) return base;
  const version = updatedAt instanceof Date ? updatedAt.getTime() : Number(updatedAt);
  return Number.isFinite(version) ? `${base}?v=${version}` : base;
}

export function biographyFilenameFromUrl(url) {
  if (!url) return "";
  return path.basename(String(url).split("?")[0]);
}

function deleteDiskMatches(biographiesDir, matcher) {
  if (!biographiesDir || !fs.existsSync(biographiesDir)) return [];
  const removed = [];
  for (const name of fs.readdirSync(biographiesDir)) {
    if (!matcher(name)) continue;
    try {
      fs.unlinkSync(path.join(biographiesDir, name));
      removed.push(name);
    } catch {
      // ignore missing files
    }
  }
  return removed;
}

async function markBiographyAssetsDeleted(filenames) {
  const unique = [...new Set(filenames.filter(Boolean))];
  if (unique.length === 0) return;

  await Promise.all(
    unique.map((filename) =>
      BiographyAssetTombstone.findOneAndUpdate(
        { filename },
        { filename, deletedAt: new Date() },
        { upsert: true, setDefaultsOnInsert: true },
      ),
    ),
  );
}

function profileToMap(profiles) {
  return Object.fromEntries(
    profiles.map((profile) => [
      profile.slug,
      {
        portrait: profile.portrait || undefined,
        summary: {
          fr: profile.summary?.fr ?? "",
          en: profile.summary?.en ?? "",
        },
      },
    ]),
  );
}

export async function readBiographyProfiles() {
  const profiles = await BiographyProfile.find().lean();
  const entries = await Promise.all(
    profiles.map(async (profile) => {
      let portrait = profile.portrait?.trim() || "";
      if (portrait) {
        const filename = biographyFilenameFromUrl(portrait);
        const asset = await getBiographyAsset(filename);
        if (!asset) {
          portrait = "";
          await BiographyProfile.updateOne({ slug: profile.slug }, { $set: { portrait: "" } });
        } else {
          portrait = biographyPublicUrl(filename, asset.updatedAt);
        }
      }

      return [
        profile.slug,
        {
          portrait: portrait || undefined,
          summary: {
            fr: profile.summary?.fr ?? "",
            en: profile.summary?.en ?? "",
          },
        },
      ];
    }),
  );

  return Object.fromEntries(entries);
}

export async function upsertBiographyProfile(slug, updates) {
  const current = await BiographyProfile.findOne({ slug }).lean();
  const nextSummary = {
    fr: updates.summary?.fr ?? current?.summary?.fr ?? "",
    en: updates.summary?.en ?? current?.summary?.en ?? "",
  };
  const portrait =
    updates.portrait !== undefined ? updates.portrait : current?.portrait ?? "";

  const profile = await BiographyProfile.findOneAndUpdate(
    { slug },
    {
      slug,
      portrait,
      summary: nextSummary,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();

  return {
    portrait: profile.portrait || undefined,
    summary: {
      fr: profile.summary?.fr ?? "",
      en: profile.summary?.en ?? "",
    },
  };
}

export async function listBiographyDocumentFilenames() {
  const assets = await BiographyAsset.find({ kind: "document" }).select("filename").lean();
  return assets.map((asset) => asset.filename);
}

export async function saveBiographyAsset({ filename, slug, kind, lang, mimeType, buffer }) {
  const normalized = normalizeBinaryAssetBuffer(buffer);
  const asset = await BiographyAsset.findOneAndUpdate(
    { filename },
    {
      filename,
      slug,
      kind,
      lang: lang ?? null,
      mimeType: sanitizeMimeType(mimeType, filename),
      data: normalized,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await BiographyAssetTombstone.deleteOne({ filename });

  return asset;
}

export async function deleteBiographyDocuments(slug, lang, biographiesDir) {
  const assets = await BiographyAsset.find({ slug, kind: "document", lang })
    .select("filename")
    .lean();
  await BiographyAsset.deleteMany({ slug, kind: "document", lang });
  const removedFromDisk = deleteDiskMatches(
    biographiesDir,
    (name) => new RegExp(`^${slug}-${lang}\\.(pdf|png)$`, "i").test(name),
  );
  await markBiographyAssetsDeleted([
    ...assets.map((asset) => asset.filename),
    ...removedFromDisk,
  ]);
}

export async function purgeBiographyPortraitFiles(slug, biographiesDir) {
  const assets = await BiographyAsset.find({ slug, kind: "portrait" }).select("filename").lean();
  await BiographyAsset.deleteMany({ slug, kind: "portrait" });
  const removedFromDisk = deleteDiskMatches(
    biographiesDir,
    (name) => new RegExp(`^${slug}-portrait\\.[a-z0-9]+$`, "i").test(name),
  );
  await markBiographyAssetsDeleted([
    ...assets.map((asset) => asset.filename),
    ...removedFromDisk,
  ]);
}

export async function deleteBiographyPortrait(slug, biographiesDir) {
  await purgeBiographyPortraitFiles(slug, biographiesDir);
  const profile = await upsertBiographyProfile(slug, { portrait: "" });
  return profile;
}

export async function getBiographyAsset(filename) {
  return BiographyAsset.findOne({ filename }).lean();
}

export async function getBiographyAssetBuffer(filename, biographiesDir) {
  const asset = await getBiographyAsset(filename);
  if (asset?.data) {
    const buffer = normalizeBinaryAssetBuffer(asset.data);
    return { buffer, mimeType: sanitizeMimeType(asset.mimeType, filename) };
  }

  return null;
}

export async function repairCorruptBiographyAssets() {
  const assets = await BiographyAsset.find().select("filename mimeType data");
  let repaired = 0;

  for (const asset of assets) {
    if (!asset.data) continue;
    const current = toBuffer(asset.data);
    const normalized = normalizeBinaryAssetBuffer(current);
    if (normalized.equals(current)) continue;

    await BiographyAsset.updateOne(
      { _id: asset._id },
      { $set: { data: normalized, mimeType: sanitizeMimeType(asset.mimeType, asset.filename) } },
    );
    repaired += 1;
  }

  if (repaired > 0) {
    console.log(`✅ Repaired ${repaired} biography asset(s) with invalid binary encoding`);
  }
}

async function importProfileFromDisk(profilesFile) {
  if (!fs.existsSync(profilesFile)) return;

  let parsed = {};
  try {
    parsed = JSON.parse(fs.readFileSync(profilesFile, "utf8"));
  } catch {
    return;
  }

  for (const [slug, profile] of Object.entries(parsed)) {
    if (!isValidBiographySlug(slug) || !profile || typeof profile !== "object") continue;
    const existing = await BiographyProfile.findOne({ slug }).lean();
    if (existing) continue;

    await BiographyProfile.create({
      slug,
      portrait: typeof profile.portrait === "string" ? profile.portrait : "",
      summary: {
        fr: profile.summary?.fr ?? "",
        en: profile.summary?.en ?? "",
      },
    });
  }
}

async function importAssetsFromDisk(biographiesDir) {
  if (!fs.existsSync(biographiesDir)) return;

  for (const name of fs.readdirSync(biographiesDir)) {
    if (name === "profiles.json") continue;

    const fullPath = path.join(biographiesDir, name);
    if (!fs.statSync(fullPath).isFile()) continue;

    const existing = await BiographyAsset.findOne({ filename: name }).lean();
    if (existing) continue;

    const tombstone = await BiographyAssetTombstone.findOne({ filename: name }).lean();
    if (tombstone) continue;

    const portraitMatch = name.match(/^([a-z0-9-]+)-portrait(\.[a-z0-9]+)$/i);
    const documentMatch = name.match(/^([a-z0-9-]+)-(fr|en)\.(pdf|png)$/i);
    if (!portraitMatch && !documentMatch) continue;

    const buffer = fs.readFileSync(fullPath);
    const ext = path.extname(name).toLowerCase();
    const mimeType =
      ext === ".pdf"
        ? "application/pdf"
        : ext === ".png"
          ? "image/png"
          : ext === ".jpg" || ext === ".jpeg"
            ? "image/jpeg"
            : ext === ".webp"
              ? "image/webp"
              : "application/octet-stream";

    if (portraitMatch) {
      const slug = portraitMatch[1];
      await saveBiographyAsset({
        filename: name,
        slug,
        kind: "portrait",
        lang: null,
        mimeType,
        buffer,
      });
      const profile = await BiographyProfile.findOne({ slug }).lean();
      if (!profile?.portrait) {
        await upsertBiographyProfile(slug, { portrait: `/biographies/${name}` });
      }
      continue;
    }

    const slug = documentMatch[1];
    const lang = documentMatch[2].toLowerCase();
    await saveBiographyAsset({
      filename: name,
      slug,
      kind: "document",
      lang,
      mimeType,
      buffer,
    });
  }
}

export async function getBiographyDocumentsForSlug(slug) {
  const documents = { fr: null, en: null };
  const assets = await BiographyAsset.find({ slug, kind: "document" }).select("filename lang updatedAt").lean();

  for (const asset of assets) {
    if (asset.lang === "fr" || asset.lang === "en") {
      documents[asset.lang] = biographyPublicUrl(asset.filename, asset.updatedAt);
    }
  }

  return documents;
}

export async function migrateBiographyStoreFromDisk(biographiesDir, profilesFile) {
  await importProfileFromDisk(profilesFile);
  await importAssetsFromDisk(biographiesDir);
  await repairCorruptBiographyAssets();
}
