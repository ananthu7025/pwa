#!/usr/bin/env node
// generate-icons.js — run with: node generate-icons.js
// Generates placeholder PNG icons using Canvas API simulation via SVG→PNG approach
// In production replace with real icons using sharp or a design tool

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// Generate an SVG icon for each size
sizes.forEach(size => {
  const padding = Math.round(size * 0.15);
  const inner = size - padding * 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="url(#bg)"/>
  <g transform="translate(${padding}, ${padding})">
    <!-- Location pin -->
    <circle cx="${inner/2}" cy="${inner*0.38}" r="${inner*0.22}" fill="white" opacity="0.95"/>
    <path d="M${inner/2} ${inner*0.1} 
             C${inner*0.28} ${inner*0.1} ${inner*0.12} ${inner*0.26} ${inner*0.12} ${inner*0.44}
             C${inner*0.12} ${inner*0.62} ${inner/2} ${inner*0.85} ${inner/2} ${inner*0.85}
             C${inner/2} ${inner*0.85} ${inner*0.88} ${inner*0.62} ${inner*0.88} ${inner*0.44}
             C${inner*0.88} ${inner*0.26} ${inner*0.72} ${inner*0.1} ${inner/2} ${inner*0.1}Z" 
          fill="white" opacity="0.9"/>
    <circle cx="${inner/2}" cy="${inner*0.44}" r="${inner*0.14}" fill="url(#bg)"/>
    <!-- Checkmark at bottom -->
    <path d="M${inner*0.32} ${inner*0.92} L${inner*0.46} ${inner*1.0} L${inner*0.7} ${inner*0.78}" 
          stroke="white" stroke-width="${inner*0.08}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.9"/>
  </g>
</svg>`;

  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg);
  console.log(`✓ Generated icon-${size}x${size}.svg`);
});

console.log('\n✅ SVG icons generated in public/icons/');
console.log('💡 For production, convert SVGs to PNGs using:');
console.log('   npx sharp-cli --input public/icons/*.svg --output public/icons/ --format png');
