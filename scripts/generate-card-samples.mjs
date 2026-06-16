import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../public/images/cards");

function wrap(body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0806"/>
      <stop offset="55%" stop-color="#14100a"/>
      <stop offset="100%" stop-color="#1f180f"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f5cd56"/>
      <stop offset="100%" stop-color="#a67c00"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#d4a843" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#d4a843" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bg)"/>
  <ellipse cx="400" cy="220" rx="320" ry="180" fill="url(#glow)"/>
  <rect x="24" y="24" width="752" height="452" rx="28" fill="none" stroke="#d4a843" stroke-opacity="0.22" stroke-width="2"/>
  ${body}
</svg>`;
}

/** Simple cartoon person helper */
function person(x, y, scale, skin, robe, pose) {
  const s = scale;
  if (pose === "bow") {
    return `
      <g transform="translate(${x},${y}) scale(${s})">
        <ellipse cx="0" cy="95" rx="55" ry="12" fill="#000" opacity="0.35"/>
        <path d="M-15 40 Q-40 70 -55 95 L-35 98 Q-20 75 5 55 Z" fill="${robe}"/>
        <circle cx="25" cy="18" r="22" fill="${skin}"/>
        <path d="M5 38 L45 38 L50 95 L0 95 Z" fill="${robe}"/>
        <path d="M-5 45 L-25 75" stroke="${skin}" stroke-width="8" stroke-linecap="round"/>
        <path d="M15 42 L5 58" stroke="${skin}" stroke-width="7" stroke-linecap="round"/>
        <ellipse cx="55" cy="88" rx="18" ry="8" fill="#3d2914"/>
      </g>`;
  }
  if (pose === "stand") {
    return `
      <g transform="translate(${x},${y}) scale(${s})">
        <ellipse cx="0" cy="110" rx="40" ry="10" fill="#000" opacity="0.35"/>
        <path d="M-18 42 L18 42 L22 108 L-22 108 Z" fill="${robe}"/>
        <circle cx="0" cy="18" r="20" fill="${skin}"/>
        <path d="M-22 48 L-38 85" stroke="${skin}" stroke-width="7" stroke-linecap="round"/>
        <path d="M22 48 L38 85" stroke="${skin}" stroke-width="7" stroke-linecap="round"/>
      </g>`;
  }
  return "";
}

const skin = "#6b4423";
const skinLight = "#8d5524";
const goldRobe = "#5c3d1e";
const crimson = "#7f1d1d";

const cards = {
  "affiliation-bowing.svg": `
    ${person(280, 120, 1.4, skin, goldRobe, "bow")}
    <g transform="translate(480,100) scale(1.5)">
      <rect x="-30" y="55" width="60" height="70" rx="8" fill="url(#gold)" opacity="0.9"/>
      <circle cx="0" cy="25" r="28" fill="url(#gold)"/>
      <text x="0" y="32" text-anchor="middle" font-size="22" font-family="Georgia,serif" fill="#1a1008">♛</text>
      <path d="M-50 0 L-35 -25 L-20 0 Z" fill="url(#gold)"/>
      <path d="M50 0 L35 -25 L20 0 Z" fill="url(#gold)"/>
    </g>
    <text x="400" y="420" text-anchor="middle" font-size="20" font-family="Georgia,serif" fill="#d4a843" opacity="0.85">Affiliation</text>`,

  "organization-mansa-musa.svg": `
    <g transform="translate(400,250)">
      <ellipse cx="0" cy="60" rx="120" ry="25" fill="#000" opacity="0.3"/>
      <g transform="translate(0,-30)">
        <circle cx="0" cy="-50" r="38" fill="${skinLight}"/>
        <path d="M-45 -15 L45 -15 L55 80 L-55 80 Z" fill="#1e3a5f"/>
        <path d="M-55 10 L-90 50 L-70 55 L-45 20 Z" fill="#c9a227"/>
        <path d="M55 10 L90 50 L70 55 L45 20 Z" fill="#c9a227"/>
        <circle cx="-55" cy="35" r="14" fill="url(#gold)"/>
        <circle cx="55" cy="35" r="14" fill="url(#gold)"/>
        <rect x="-20" y="-75" width="40" height="18" rx="4" fill="url(#gold)"/>
      </g>
      <text x="0" y="130" text-anchor="middle" font-size="18" font-family="Georgia,serif" fill="#d4a843">Organisation · Mansa Musa</text>
    </g>`,

  "federation-hero.svg": `
    <g transform="translate(400,240)">
      <circle cx="0" cy="0" r="110" fill="none" stroke="url(#gold)" stroke-width="3" opacity="0.5"/>
      <circle cx="0" cy="0" r="75" fill="#1a1408" stroke="#d4a843" stroke-width="2"/>
      <path d="M-40,-20 L0,-55 L40,-20 L25,35 L-25,35 Z" fill="url(#gold)" opacity="0.85"/>
      <circle cx="-70" cy="-40" r="8" fill="#d4a843"/><text x="-70" y="-36" text-anchor="middle" font-size="8" fill="#1a1008">N</text>
      <circle cx="70" cy="20" r="8" fill="#d4a843"/><text x="70" y="24" text-anchor="middle" font-size="7" fill="#1a1008">T</text>
      <circle cx="-50" cy="55" r="8" fill="#d4a843"/><text x="-50" y="59" text-anchor="middle" font-size="7" fill="#1a1008">H</text>
      <text x="0" y="145" text-anchor="middle" font-size="20" font-family="Georgia,serif" fill="#d4a843">Fédération Manden</text>
    </g>`,

  "join-dozo-hunter.svg": `
    <g transform="translate(360,230)">
      <ellipse cx="0" cy="75" rx="70" ry="14" fill="#000" opacity="0.35"/>
      <circle cx="0" cy="-40" r="32" fill="${skin}"/>
      <path d="M-28 -8 L28 -8 L35 70 L-35 70 Z" fill="#4a3728"/>
      <path d="M-10 -8 L10 -8 L8 25 L-8 25 Z" fill="#f5f5dc"/>
      <path d="M-25 15 L-45 5" stroke="${skin}" stroke-width="8" stroke-linecap="round"/>
      <path d="M25 10 L55 -30 L65 -25 L40 20 Z" fill="#3d2914"/>
      <rect x="58" y="-38" width="8" height="55" rx="2" fill="#2a1a0a" transform="rotate(-25 62 -10)"/>
      <text x="0" y="115" text-anchor="middle" font-size="18" font-family="Georgia,serif" fill="#d4a843">Je veux rejoindre</text>
    </g>`,

  "questions.svg": `
    <g transform="translate(400,230)">
      <circle cx="0" cy="0" r="70" fill="#1a1408" stroke="#b91c1c" stroke-width="3"/>
      <text x="0" y="22" text-anchor="middle" font-size="72" font-family="Georgia,serif" fill="#ef4444">?</text>
      ${person(-120, 30, 0.9, skinLight, "#2a2218", "stand")}
      <path d="M-55 50 Q0 20 55 50" fill="none" stroke="#d4a843" stroke-width="2" stroke-dasharray="6 4" opacity="0.6"/>
      <text x="0" y="130" text-anchor="middle" font-size="18" font-family="Georgia,serif" fill="#d4a843">J'ai des questions</text>
    </g>`,

  "entrepreneur.svg": `
    <g transform="translate(400,235)">
      <rect x="-90" y="10" width="180" height="70" rx="12" fill="#1a1408" stroke="url(#gold)" stroke-width="2"/>
      <path d="M-70 45 L-40 25 L-10 50 L20 30 L50 45" fill="none" stroke="#22c55e" stroke-width="3"/>
      <circle cx="50" cy="30" r="12" fill="url(#gold)"/>
      <text x="50" y="35" text-anchor="middle" font-size="14" fill="#1a1008">$</text>
      ${person(-130, 20, 1, skin, "#1e3a2f", "stand")}
      <rect x="60" y="-55" width="55" height="40" rx="6" fill="#2a2218" stroke="#d4a843" stroke-width="1.5"/>
      <text x="87" y="-28" text-anchor="middle" font-size="11" fill="#d4a843">TRADE</text>
      <text x="0" y="115" text-anchor="middle" font-size="18" font-family="Georgia,serif" fill="#d4a843">I Am an Entrepreneur</text>
    </g>`,

  "cotiser.svg": `
    <g transform="translate(400,240)">
      <circle cx="0" cy="0" r="65" fill="url(#gold)"/>
      <text x="0" y="18" text-anchor="middle" font-size="48" font-family="Georgia,serif" fill="#1a1008">◎</text>
      <circle cx="-55" cy="45" r="22" fill="url(#gold)" opacity="0.7"/>
      <circle cx="55" cy="45" r="22" fill="url(#gold)" opacity="0.7"/>
      <circle cx="0" cy="70" r="18" fill="url(#gold)" opacity="0.5"/>
      <text x="0" y="130" text-anchor="middle" font-size="20" font-family="Georgia,serif" fill="#d4a843">Cotiser</text>
    </g>`,

  "niani-institutions.svg": `
    <g transform="translate(400,250)">
      <path d="M-100 40 Q-100 -20 0 -50 Q100 -20 100 40" fill="none" stroke="#d4a843" stroke-width="4"/>
      <rect x="-80" y="30" width="160" height="55" rx="6" fill="#f5e6c8" stroke="#c9a227" stroke-width="2"/>
      <path d="M-60 45 Q0 20 60 45" fill="none" stroke="#8b6914" stroke-width="2"/>
      <path d="M-40 55 L-20 35 M0 58 L0 32 M40 55 L20 35" stroke="#8b6914" stroke-width="1.5"/>
      <path d="M-120 85 L120 85" stroke="${skin}" stroke-width="14" stroke-linecap="round"/>
      <circle cx="130" cy="75" r="16" fill="${skinLight}"/>
      <text x="0" y="125" text-anchor="middle" font-size="18" font-family="Georgia,serif" fill="#d4a843">Institutions</text>
    </g>`,

  "niani-architecture.svg": `
    <g transform="translate(400,260)">
      <ellipse cx="0" cy="50" rx="130" ry="35" fill="#1a1408" stroke="#d4a843" stroke-width="2"/>
      <path d="M-100 50 L0 -80 L100 50 Z" fill="none" stroke="url(#gold)" stroke-width="3"/>
      <path d="M-70 50 Q0 -40 70 50" fill="#2a2218" stroke="#d4a843" stroke-width="1.5"/>
      <rect x="-25" y="10" width="50" height="40" rx="4" fill="#d4a843" opacity="0.3"/>
      <circle cx="0" cy="-55" r="12" fill="url(#gold)"/>
      <text x="0" y="115" text-anchor="middle" font-size="16" font-family="Georgia,serif" fill="#d4a843">Projets architecturaux</text>
    </g>`,

  "niani-tv.svg": `
    <g transform="translate(400,245)">
      <rect x="-100" y="-30" width="120" height="75" rx="8" fill="#2a2218" stroke="#d4a843" stroke-width="2"/>
      <circle cx="-70" cy="5" r="18" fill="#4a7c59"/>
      <rect x="-55" y="-10" width="30" height="22" fill="#1a1008"/>
      <polygon points="-40,15 -25,25 -40,35" fill="#d4a843"/>
      ${person(60, 10, 1.1, skin, "#3d2914", "stand")}
      <rect x="75" y="-20" width="35" height="25" rx="3" fill="#111" stroke="#888" stroke-width="2"/>
      <circle cx="92" cy="-7" r="10" fill="#333"/>
      <text x="0" y="115" text-anchor="middle" font-size="18" font-family="Georgia,serif" fill="#d4a843">Niani TV</text>
    </g>`,

  "niani-cartoons.svg": `
    <g transform="translate(400,240)">
      <circle cx="-50" cy="0" r="45" fill="#f5cd56"/><circle cx="-62" cy="-12" r="6" fill="#1a1008"/><circle cx="-38" cy="-12" r="6" fill="#1a1008"/>
      <path d="M-65 15 Q-50 30 -35 15" fill="none" stroke="#1a1008" stroke-width="2"/>
      <circle cx="50" cy="5" r="40" fill="#d4a843"/><text x="50" y="12" text-anchor="middle" font-size="28" fill="#1a1008">▶</text>
      <text x="0" y="110" text-anchor="middle" font-size="18" font-family="Georgia,serif" fill="#d4a843">Dessins animés</text>
    </g>`,

  "niani-women.svg": `
    <g transform="translate(400,235)">
      ${person(-60, 15, 1.1, skinLight, crimson, "stand")}
      <g transform="translate(60,15) scale(1.1)">
        <ellipse cx="0" cy="110" rx="40" ry="10" fill="#000" opacity="0.35"/>
        <path d="M-20 42 L20 42 L24 108 L-24 108 Z" fill="${crimson}"/>
        <circle cx="0" cy="18" r="20" fill="${skinLight}"/>
        <path d="M-25 5 Q0 -15 25 5" fill="#1a1008"/>
      </g>
      <path d="M-30 60 Q0 45 30 60" fill="none" stroke="#d4a843" stroke-width="2"/>
      <text x="0" y="125" text-anchor="middle" font-size="16" font-family="Georgia,serif" fill="#d4a843">Institution des femmes</text>
    </g>`,

  "academy-nko.svg": `
    <g transform="translate(400,250)">
      <ellipse cx="0" cy="-60" rx="100" ry="55" fill="#2d5a27" opacity="0.8"/>
      <rect x="-15" y="-120" width="30" height="90" fill="#4a3728"/>
      <g transform="translate(-80,30)">${person(0,0,0.85,skin,"#3d2914","stand")}</g>
      <g transform="translate(0,20)">${person(0,0,0.9,skinLight,"#4a3728","stand")}</g>
      <g transform="translate(80,30)">${person(0,0,0.85,skin,"#3d2914","stand")}</g>
      <rect x="-40" y="55" width="80" height="30" rx="4" fill="#f5e6c8" stroke="#c9a227"/>
      <text x="0" y="75" text-anchor="middle" font-size="16" font-family="serif" fill="#1a1008">ߛߞߏ</text>
      <text x="0" y="125" text-anchor="middle" font-size="18" font-family="Georgia,serif" fill="#d4a843">Cours N'ko</text>
    </g>`,

  "academy-history.svg": `
    <g transform="translate(400,245)">
      <rect x="-70" y="-40" width="140" height="90" rx="6" fill="#f5e6c8" stroke="#c9a227" stroke-width="2"/>
      <text x="0" y="-5" text-anchor="middle" font-size="14" fill="#5c3d1e">1236</text>
      <path d="M-50 15 L-30 35 L-10 5 L10 30 L30 10 L50 25" fill="none" stroke="#8b4513" stroke-width="2"/>
      ${person(-130, 25, 0.95, skin, goldRobe, "stand")}
      <text x="0" y="115" text-anchor="middle" font-size="18" font-family="Georgia,serif" fill="#d4a843">Histoire du Manden</text>
    </g>`,

  "academy-others.svg": `
    <g transform="translate(400,240)">
      <rect x="-90" y="-50" width="75" height="95" rx="6" fill="#2a2218" stroke="#d4a843"/>
      <rect x="-5" y="-35" width="75" height="80" rx="6" fill="#1e3a5f" stroke="#d4a843"/>
      <rect x="20" y="-55" width="75" height="100" rx="6" fill="#3d2914" stroke="#d4a843"/>
      <circle cx="-52" cy="-20" r="8" fill="url(#gold)"/>
      <circle cx="32" cy="-5" r="8" fill="url(#gold)"/>
      <circle cx="57" cy="-25" r="8" fill="url(#gold)"/>
      <text x="0" y="115" text-anchor="middle" font-size="18" font-family="Georgia,serif" fill="#d4a843">Autres cours</text>
    </g>`,

  "commerce-market.svg": `
    <g transform="translate(400,245)">
      <path d="M-120 50 L120 50" stroke="#8b6914" stroke-width="4"/>
      <rect x="-40" y="10" width="35" height="40" fill="#c9a227"/>
      ${person(-90, 15, 1, skinLight, "#7c2d12", "stand")}
      <ellipse cx="50" cy="35" rx="25" ry="18" fill="#d4a843"/>
      <path d="M30 20 L70 20 L65 50 L35 50 Z" fill="#5c3d1e"/>
      <text x="0" y="115" text-anchor="middle" font-size="18" font-family="Georgia,serif" fill="#d4a843">Commerce</text>
    </g>`,

  "economy-hero.svg": `
    <g transform="translate(400,240)">
      <circle cx="0" cy="0" r="75" fill="url(#gold)"/>
      <text x="0" y="20" text-anchor="middle" font-size="42" font-family="Georgia,serif" fill="#1a1008">₣</text>
      <path d="M-100 50 L-60 10 L-20 40 L20 0 L60 30 L100 -10" fill="none" stroke="#22c55e" stroke-width="3"/>
      <text x="0" y="120" text-anchor="middle" font-size="20" font-family="Georgia,serif" fill="#d4a843">Économie</text>
    </g>`,
};

fs.mkdirSync(outDir, { recursive: true });

for (const [filename, body] of Object.entries(cards)) {
  fs.writeFileSync(path.join(outDir, filename), wrap(body), "utf8");
  console.log("Wrote", filename);
}

console.log(`\nDone — ${Object.keys(cards).length} sample cartoons in public/images/cards/`);
