import fs from "fs";
import path from "path";

import { BiographyAsset } from "./models/BiographyAsset.js";
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
  return profileToMap(profiles);
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
  await BiographyAsset.findOneAndUpdate(
    { filename },
    { filename, slug, kind, lang: lang ?? null, mimeType, data: buffer },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

export async function deleteBiographyDocuments(slug, lang) {
  await BiographyAsset.deleteMany({ slug, kind: "document", lang });
}

export async function deleteBiographyPortrait(slug) {
  await BiographyAsset.deleteMany({ slug, kind: "portrait" });
  const profile = await upsertBiographyProfile(slug, { portrait: "" });
  return profile;
}

export async function getBiographyAsset(filename) {
  return BiographyAsset.findOne({ filename }).lean();
}

export async function getBiographyAssetBuffer(filename, biographiesDir) {
  const asset = await getBiographyAsset(filename);
  if (asset?.data) return { buffer: asset.data, mimeType: asset.mimeType };

  const diskPath = path.join(biographiesDir, filename);
  if (!fs.existsSync(diskPath)) return null;

  const ext = path.extname(filename).toLowerCase();
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

  return { buffer: fs.readFileSync(diskPath), mimeType };
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

export async function getBiographyDocumentsForSlug(slug, biographiesDir) {
  const documents = { fr: null, en: null };
  const assets = await BiographyAsset.find({ slug, kind: "document" }).select("filename lang").lean();

  for (const asset of assets) {
    if (asset.lang === "fr" || asset.lang === "en") {
      documents[asset.lang] = `/biographies/${asset.filename}`;
    }
  }

  for (const lang of ["fr", "en"]) {
    if (documents[lang]) continue;
    for (const ext of [".pdf", ".png"]) {
      const filename = `${slug}-${lang}${ext}`;
      const diskPath = path.join(biographiesDir, filename);
      if (fs.existsSync(diskPath)) {
        documents[lang] = `/biographies/${filename}`;
        break;
      }
    }
  }

  return documents;
}

export async function migrateBiographyStoreFromDisk(biographiesDir, profilesFile) {
  await importProfileFromDisk(profilesFile);
  await importAssetsFromDisk(biographiesDir);
}
