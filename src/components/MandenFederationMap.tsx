import { useEffect, useState } from "react";
import { MapPin, ZoomIn, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import ImageLightbox from "@/components/ImageLightbox";
import { DEFAULT_FEDERATION_MAP } from "@/lib/federation-map";
import { useI18n } from "@/lib/i18n";

type MandenFederationMapProps = {
  mapSrc?: string;
  hoverImages?: string[];
};

const MAP_LABELS = {
  en: [
    "Djoliba (Niger River)",
    "Sankarani River through Niani",
    "Selengue dam on the Sankarani",
    "Niani · Tombouctou · Hamana · Banantou · Bambalata",
    "Modern Mali, Guinea, and Senegal shapes — without country names",
  ],
  fr: [
    "Djoliba (fleuve Niger)",
    "Fleuve Sankarani traversant Niani",
    "Barrage de Selengue sur le Sankarani",
    "Niani · Tombouctou · Hamana · Banantou · Bambalata",
    "Formes du Mali, de la Guinée et du Sénégal — sans noms de pays",
  ],
};

// ─── Hotspot data ─────────────────────────────────────────────────────────────
// left / top are % of the map image width & height.
// Change these numbers to fine-tune each pin position.
const HOTSPOTS = [
  {
    id: "hamana",
    left: 14.2,  // ← X position (% from left edge) — tweak to move left/right
    top:  55.5,  // ← Y position (% from top edge) — tweak to move up/down
    url: "/history",
    image: "/images/maps/hamana-thumbnail.png",
    name: { en: "Hamana", fr: "Hamana" },
    description: {
      en: "Famed Manden heartland along the Sankarani. Rich in oral history and living traditions.",
      fr: "Foyer historique du Manden le long du Sankarani. Riche en traditions orales et vivantes.",
    },
  },
  {
    id: "niani",
    left: 26.5,  // ← X position (% from left edge) — tweak to move left/right
    top:  63.5,  // ← Y position (% from top edge) — tweak to move up/down
    url: "/niani",
    image: "/images/maps/niani-thumbnail.png",
    name: { en: "Niani", fr: "Niani" },
    description: {
      en: "The historic capital of the Manden Empire. Center of culture, heritage, and Niani TV.",
      fr: "La capitale historique de l'Empire Manden. Centre culturel, patrimonial et de Niani TV.",
    },
  },
  {
    id: "tombouctou",
    left: 50.8,  // ← X position (% from left edge) — tweak to move left/right
    top:  30.5,  // ← Y position (% from top edge) — tweak to move up/down
    url: "/tombouctou",
    image: "/images/maps/tombouctou-thumbnail.png",
    name: { en: "Tombouctou", fr: "Tombouctou" },
    description: {
      en: "Ancient city of 333 saints. A world-famous pillar of trade, Islamic scholarship, and culture.",
      fr: "Ville antique des 333 saints. Un pilier mondial du commerce, du savoir et de la culture.",
    },
  },
];

// ─── Individual pin component with React hover state ─────────────────────────
function HotspotPin({
  hotspot,
  lang,
  customImage,
}: {
  hotspot: (typeof HOTSPOTS)[number];
  lang: string;
  customImage?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const cityName = lang === "fr" ? hotspot.name.fr : hotspot.name.en;
  const cityDesc = lang === "fr" ? hotspot.description.fr : hotspot.description.en;
  const displayImage = customImage || hotspot.image;

  return (
    <div
      style={{
        position: "absolute",
        left: `${hotspot.left}%`,
        top: `${hotspot.top}%`,
        width: "7%",
        aspectRatio: "1 / 1",
        transform: "translate(-50%, -50%)",
        pointerEvents: "auto",
        zIndex: 20,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to={hotspot.url}
        title={cityName}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: hovered ? "2px solid rgba(217,165,32,0.65)" : "2px solid transparent",
          background: hovered ? "rgba(217,165,32,0.12)" : "transparent",
          boxShadow: hovered ? "0 0 20px rgba(217,165,32,0.5)" : "none",
          transition: "all 0.25s ease",
          position: "relative",
          textDecoration: "none",
        }}
      >
        {/* Pulsing dot */}
        <span style={{ position: "relative", display: "flex", width: 14, height: 14 }}>
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "rgba(217,165,32,0.7)",
              animation: "mapPing 1.4s cubic-bezier(0,0,0.2,1) infinite",
            }}
          />
          <span
            style={{
              position: "relative",
              display: "block",
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#d4a520",
              border: "1.5px solid rgba(0,0,0,0.4)",
              boxShadow: "0 1px 6px rgba(0,0,0,0.6)",
            }}
          />
        </span>

        {/* Popup card */}
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 14px)",
            left: "50%",
            transform: hovered
              ? "translateX(-50%) translateY(0) scale(1)"
              : "translateX(-50%) translateY(10px) scale(0.88)",
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? "auto" : "none",
            transition: "opacity 0.25s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
            width: 220,
            borderRadius: 16,
            background: "rgba(14,11,4,0.97)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(217,165,32,0.3)",
            boxShadow: "0 28px 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)",
            padding: 10,
            zIndex: 50,
          }}
        >
          {/* City image */}
          <img
            src={displayImage}
            alt={cityName}
            style={{
              width: "100%",
              height: 90,
              objectFit: "cover",
              borderRadius: 10,
              display: "block",
              marginBottom: 8,
              border: "1px solid rgba(217,165,32,0.2)",
            }}
          />

          {/* City name */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#d4a520",
              letterSpacing: "0.07em",
            }}
          >
            {cityName}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.55,
              marginTop: 4,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {cityDesc}
          </div>

          {/* Explore footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 8,
              paddingTop: 7,
              borderTop: "1px solid rgba(217,165,32,0.15)",
              fontSize: 9,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.13em",
              color: "rgba(217,165,32,0.75)",
            }}
          >
            <span>{lang === "fr" ? "Explorer" : "Explore"}</span>
            <ArrowRight style={{ width: 11, height: 11 }} />
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function MandenFederationMap({ mapSrc, hoverImages }: MandenFederationMapProps) {
  const { lang } = useI18n();
  const [activeSrc, setActiveSrc] = useState(mapSrc?.trim() || DEFAULT_FEDERATION_MAP);
  const [failed, setFailed] = useState(false);
  const labels = lang === "fr" ? MAP_LABELS.fr : MAP_LABELS.en;

  useEffect(() => {
    setActiveSrc(mapSrc?.trim() || DEFAULT_FEDERATION_MAP);
    setFailed(false);
  }, [mapSrc]);

  function handleError() {
    if (activeSrc !== DEFAULT_FEDERATION_MAP) {
      setActiveSrc(DEFAULT_FEDERATION_MAP);
      return;
    }
    setFailed(true);
  }

  if (failed) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-gold/25 bg-black/20 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              {lang === "fr" ? "Carte médiévale du Manden" : "Medieval map of Manden"}
            </p>
            <p className="text-sm leading-7 text-muted-foreground">
              {lang === "fr"
                ? "Téléversez la carte dans Admin → Perspectives Globales, ou ajoutez public/images/maps/manden-federation-map.jpg"
                : "Upload the map in Admin → Global Perspectives, or add public/images/maps/manden-federation-map.jpg"}
            </p>
            <ul className="space-y-1.5 text-xs leading-6 text-foreground/70">
              {labels.map((label) => (
                <li key={label} className="flex gap-2">
                  <span className="text-gold">•</span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold/70">
          {lang === "fr" ? "Carte de la Fédération" : "Federation map"}
        </p>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <ZoomIn className="h-3.5 w-3.5" />
          {lang === "fr" ? "Cliquez pour agrandir" : "Click to enlarge"}
        </span>
      </div>

      {/* Keyframe for pulsing ring — inline so it works without Tailwind */}
      <style>{`
        @keyframes mapPing {
          75%, 100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>

      {/* Outer wrapper: position:relative for % hotspot coords.
          NO overflow:hidden — allows popups to escape above the map. */}
      <div style={{ position: "relative", width: "100%" }}>

        {/* Image container: overflow:hidden only here for rounded corners */}
        <div
          style={{
            overflow: "hidden",
            borderRadius: "1.25rem",
            border: "1px solid rgba(217,165,32,0.15)",
            background: "rgba(0,0,0,0.3)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          }}
        >
          <ImageLightbox
            src={activeSrc}
            alt={lang === "fr" ? "Carte médiévale du Manden" : "Medieval map of Manden"}
            className="w-full h-auto block object-contain"
            onError={handleError}
          />
        </div>

        {/* Hotspot pins layer — pointer-events:none on wrapper,
            each pin enables its own pointer-events */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {HOTSPOTS.map((hotspot, index) => (
            <HotspotPin
              key={hotspot.id}
              hotspot={hotspot}
              lang={lang}
              customImage={hoverImages?.[index]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
