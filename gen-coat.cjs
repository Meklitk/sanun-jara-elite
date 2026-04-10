const fs = require('fs');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="500" height="600">
  <!-- Laurels background -->
  <g opacity="0.3">
    <path d="M 120,100 Q 80,200 80,350 Q 80,500 120,500" stroke="#DAA520" stroke-width="4" fill="none"/>
    <ellipse cx="90" cy="150" rx="15" ry="25" fill="#DAA520" transform="rotate(-30, 90, 150)"/>
    <ellipse cx="78" cy="200" rx="15" ry="25" fill="#DAA520" transform="rotate(-40, 78, 200)"/>
    <ellipse cx="72" cy="250" rx="15" ry="25" fill="#DAA520" transform="rotate(-50, 72, 250)"/>
    <ellipse cx="70" cy="300" rx="15" ry="25" fill="#DAA520" transform="rotate(-60, 70, 300)"/>
    <ellipse cx="72" cy="350" rx="15" ry="25" fill="#DAA520" transform="rotate(-70, 72, 350)"/>
    <ellipse cx="78" cy="400" rx="15" ry="25" fill="#DAA520" transform="rotate(-80, 78, 400)"/>
    <ellipse cx="90" cy="450" rx="15" ry="25" fill="#DAA520" transform="rotate(-85, 90, 450)"/>
    <path d="M 380,100 Q 420,200 420,350 Q 420,500 380,500" stroke="#DAA520" stroke-width="4" fill="none"/>
    <ellipse cx="410" cy="150" rx="15" ry="25" fill="#DAA520" transform="rotate(30, 410, 150)"/>
    <ellipse cx="422" cy="200" rx="15" ry="25" fill="#DAA520" transform="rotate(40, 422, 200)"/>
    <ellipse cx="428" cy="250" rx="15" ry="25" fill="#DAA520" transform="rotate(50, 428, 250)"/>
    <ellipse cx="430" cy="300" rx="15" ry="25" fill="#DAA520" transform="rotate(60, 430, 300)"/>
    <ellipse cx="428" cy="350" rx="15" ry="25" fill="#DAA520" transform="rotate(70, 428, 350)"/>
    <ellipse cx="422" cy="400" rx="15" ry="25" fill="#DAA520" transform="rotate(80, 422, 400)"/>
    <ellipse cx="410" cy="450" rx="15" ry="25" fill="#DAA520" transform="rotate(85, 410, 450)"/>
  </g>
  
  <!-- Center Shield -->
  <path d="M 250,80 L 310,120 L 310,200 L 250,320 L 190,200 L 190,120 Z" fill="#CC0000" stroke="#FFD700" stroke-width="6"/>
  
  <!-- Shield inner lion head -->
  <g transform="translate(250, 195)">
    <circle cx="0" cy="-5" r="42" fill="#B8860B"/>
    <ellipse cx="0" cy="0" rx="30" ry="34" fill="#DAA520"/>
    <ellipse cx="-12" cy="-10" rx="5" ry="6" fill="#1a1a1a"/>
    <ellipse cx="12" cy="-10" rx="5" ry="6" fill="#1a1a1a"/>
    <circle cx="-11" cy="-11" r="2" fill="#FFD700"/>
    <circle cx="13" cy="-11" r="2" fill="#FFD700"/>
    <ellipse cx="0" cy="5" rx="7" ry="5" fill="#1a1a1a"/>
    <path d="M -12,12 Q 0,18 12,12" stroke="#1a1a1a" stroke-width="2" fill="none"/>
    <g transform="translate(0, -38)">
      <path d="M -16,0 L -16,-12 L -10,-6 L 0,-15 L 10,-6 L 16,-12 L 16,0 Z" fill="#FFD700"/>
      <rect x="-18" y="-1" width="36" height="4" fill="#FFD700" rx="1"/>
      <circle cx="-12" cy="-9" r="2" fill="#CC0000"/>
      <circle cx="0" cy="-13" r="2" fill="#CC0000"/>
      <circle cx="12" cy="-9" r="2" fill="#CC0000"/>
    </g>
  </g>
  
  <!-- Left Supporting Lion -->
  <g transform="translate(130, 280) scale(0.8)">
    <path d="M -20,40 C -25,20 -30,0 -25,-20 C -28,-35 -20,-50 -10,-60 C -15,-70 -5,-80 10,-85 C 25,-80 35,-70 30,-60 C 40,-50 48,-35 45,-20 C 50,0 45,20 40,40 C 35,50 30,55 25,60 L 25,70 C 25,75 20,80 15,80 L 5,80 C 0,80 -5,75 -5,70 L -5,60 C -10,55 -15,50 -20,40 Z" fill="#DAA520"/>
    <path d="M -55,-50 C -60,-65 -45,-80 -30,-85 C -40,-90 -35,-105 0,-105 C 35,-105 40,-90 30,-85 C 45,-80 60,-65 55,-50 C 60,-35 55,-20 50,-10 C 45,-25 35,-35 30,-40 C 25,-45 20,-40 15,-35 C 10,-40 5,-45 0,-40 C -5,-45 -10,-40 -15,-35 C -20,-35 -30,-25 -35,-20 C -40,-15 -50,-5 -55,10 C -60,0 -65,-35 -55,-50 Z" fill="#B8860B" opacity="0.9"/>
    <path d="M 35,30 Q 60,10 50,-20 Q 45,-35 40,-30 Q 45,-25 40,-15 Q 35,5 25,20" stroke="#DAA520" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
  
  <!-- Right Supporting Lion -->
  <g transform="translate(370, 280) scale(-0.8, 0.8)">
    <path d="M -20,40 C -25,20 -30,0 -25,-20 C -28,-35 -20,-50 -10,-60 C -15,-70 -5,-80 10,-85 C 25,-80 35,-70 30,-60 C 40,-50 48,-35 45,-20 C 50,0 45,20 40,40 C 35,50 30,55 25,60 L 25,70 C 25,75 20,80 15,80 L 5,80 C 0,80 -5,75 -5,70 L -5,60 C -10,55 -15,50 -20,40 Z" fill="#DAA520"/>
    <path d="M -55,-50 C -60,-65 -45,-80 -30,-85 C -40,-90 -35,-105 0,-105 C 35,-105 40,-90 30,-85 C 45,-80 60,-65 55,-50 C 60,-35 55,-20 50,-10 C 45,-25 35,-35 30,-40 C 25,-45 20,-40 15,-35 C 10,-40 5,-45 0,-40 C -5,-45 -10,-40 -15,-35 C -20,-35 -30,-25 -35,-20 C -40,-15 -50,-5 -55,10 C -60,0 -65,-35 -55,-50 Z" fill="#B8860B" opacity="0.9"/>
    <path d="M 35,30 Q 60,10 50,-20 Q 45,-35 40,-30 Q 45,-25 40,-15 Q 35,5 25,20" stroke="#DAA520" stroke-width="5" fill="none" stroke-linecap="round"/>
  </g>
  
  <!-- Top banner -->
  <path d="M 150,60 Q 250,30 350,60 Q 340,50 250,40 Q 160,50 150,60 Z" fill="#FFD700"/>
  <text x="250" y="55" font-family="Georgia, serif" font-size="14" fill="#8B0000" text-anchor="middle" font-weight="bold">Confiance · Noblesse</text>
  
  <!-- Bottom banner -->
  <path d="M 150,420 Q 250,450 350,420 Q 340,430 250,440 Q 160,430 150,420 Z" fill="#FFD700"/>
  <text x="250" y="435" font-family="Georgia, serif" font-size="16" fill="#8B0000" text-anchor="middle" font-weight="bold">Persévérance</text>
</svg>`;
fs.writeFileSync('c:/Users/MAKI/Documents/GitHub/sanun-jara-elite/public/images/coat-of-arms-manden.svg', svg);
console.log('done');
