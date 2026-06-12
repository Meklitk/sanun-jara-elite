export const DEFAULT_FEDERATION_MAP = "/images/maps/manden-federation-map.jpg";

export function resolveFederationMapSrc(featuredImage?: string, images?: string[]) {
  const fromFeatured = featuredImage?.trim();
  if (fromFeatured) return fromFeatured;

  const fromGallery = images?.find((url) => url?.trim())?.trim();
  if (fromGallery) return fromGallery;

  return DEFAULT_FEDERATION_MAP;
}
