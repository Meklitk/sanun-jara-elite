export type FederationRegionCode = "GB" | "F" | "Ma" | "GN" | "N" | "B" | "P" | "DJ" | "CH" | "D" | "HM";

export type FederationRegion = {
  code: FederationRegionCode;
  /** N'Ko letter shown on the public tile (Mansa Diata mapping). */
  nkoChar: string;
  filename: string;
  labelEn: string;
  labelFr: string;
};

/** Manden federation codes → N'Ko letters (per client WhatsApp reference). */
export const FEDERATION_REGIONS: FederationRegion[] = [
  { code: "GB", nkoChar: "ߔ", filename: "GB.jpg", labelEn: "GB", labelFr: "GB" },
  { code: "F", nkoChar: "ߝ", filename: "F.jpg", labelEn: "F", labelFr: "F" },
  { code: "Ma", nkoChar: "ߡ", filename: "Ma.jpg", labelEn: "Ma", labelFr: "Ma" },
  { code: "GN", nkoChar: "ߢ", filename: "GN.jpg", labelEn: "GN", labelFr: "GN" },
  { code: "N", nkoChar: "ߣ", filename: "N.jpg", labelEn: "N", labelFr: "N" },
  { code: "B", nkoChar: "ߒ", filename: "B.jpg", labelEn: "B", labelFr: "B" },
  { code: "P", nkoChar: "ߓ", filename: "P.jpg", labelEn: "P", labelFr: "P" },
  { code: "DJ", nkoChar: "ߜ", filename: "DJ.jpg", labelEn: "DJ", labelFr: "DJ" },
  { code: "CH", nkoChar: "ߘ", filename: "CH.jpg", labelEn: "CH", labelFr: "CH" },
  { code: "D", nkoChar: "ߖ", filename: "D.jpg", labelEn: "D", labelFr: "D" },
  { code: "HM", nkoChar: "ߤ", filename: "HM.jpg", labelEn: "HM", labelFr: "HM" },
];

export function federationRegionUrl(code: FederationRegionCode) {
  const region = FEDERATION_REGIONS.find((entry) => entry.code === code);
  return region ? `/images/maps/regions/${region.filename}` : "";
}

export const FEDERATION_REGION_CODES = FEDERATION_REGIONS.map((r) => r.code);

export function getFederationRegion(code: string) {
  return FEDERATION_REGIONS.find((entry) => entry.code === code);
}
