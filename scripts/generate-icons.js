/**
 * Script de génération d'icônes PWA
 * Prérequis : npm install sharp --save-dev
 * Usage     : node scripts/generate-icons.js
 * Source    : public/icon-source.png (doit être ≥ 512×512)
 */

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC  = join(ROOT, 'public', 'icon-source.png');
const DEST = join(ROOT, 'public', 'icons');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

if (!existsSync(SRC)) {
  console.error('❌ Fichier source introuvable : public/icon-source.png');
  console.error('   Placez une image PNG ≥ 512×512 à cet emplacement.');
  process.exit(1);
}

if (!existsSync(DEST)) mkdirSync(DEST, { recursive: true });

for (const size of sizes) {
  const out = join(DEST, `icon-${size}x${size}.png`);
  await sharp(SRC).resize(size, size).png().toFile(out);
  console.log(`✅ Généré : public/icons/icon-${size}x${size}.png`);
}

// Apple touch icon (180×180)
await sharp(SRC).resize(180, 180).png().toFile(join(ROOT, 'public', 'apple-touch-icon.png'));
console.log('✅ Généré : public/apple-touch-icon.png');

console.log('\n🎉 Toutes les icônes ont été générées !');
