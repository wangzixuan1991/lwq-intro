#!/usr/bin/env tsx
/**
 * Import content from a collector-exported JSON file.
 *
 * Usage:
 *   pnpm import-content <path-to-lwq-content.json>
 *
 * Behavior:
 *   - Overwrites src/data/profile.json from `data.profile` (if present).
 *   - For each known collection (publications/news/projects/talks/awards/teaching/experience/education),
 *     deletes existing JSON files and writes new sequentially-numbered files (001.json, 002.json, ...).
 *   - Decodes any base64 image fields under `data.images` and writes to public/images/.
 *   - Decodes data.cvPdf (data: URL) to public/cv.pdf if present.
 *   - Writes data.preferences and data.theme + data.freeform to public/_collector-meta.json for reference.
 */

import fs from 'node:fs';
import path from 'node:path';

type Bilingual = { zh: string; en: string };

interface ExportPayload {
  profile?: Record<string, unknown>;
  publications?: unknown[];
  news?: unknown[];
  projects?: unknown[];
  talks?: unknown[];
  awards?: unknown[];
  teaching?: unknown[];
  experience?: unknown[];
  education?: unknown[];
  preferences?: Record<string, unknown>;
  theme?: string;
  images?: { avatar?: string; hero?: string; extra?: string[] };
  cvPdf?: string;
  freeform?: string;
}

const ROOT = path.resolve(process.cwd());

function writeJson(rel: string, obj: unknown): void {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
}

function clearDir(rel: string): void {
  const dir = path.join(ROOT, rel);
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('.json')) fs.unlinkSync(path.join(dir, f));
  }
}

function writeCollection(name: string, items: unknown[]): void {
  const dir = `src/content/${name}`;
  clearDir(dir);
  items.forEach((item, i) => {
    const id = String(i + 1).padStart(3, '0');
    writeJson(`${dir}/${id}.json`, item);
  });
  console.log(`  ✓ ${name}: ${items.length} entries`);
}

function decodeDataUrl(url: string): { ext: string; buf: Buffer } | null {
  const m = url.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) return null;
  const mime = m[1];
  const ext = mime === 'image/svg+xml' ? 'svg' : (mime.split('/')[1] || 'bin');
  return { ext, buf: Buffer.from(m[2], 'base64') };
}

function main(): void {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error('Usage: pnpm import-content <path-to-json>');
    process.exit(1);
  }
  if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(raw) as ExportPayload;

  console.log(`Importing from ${jsonPath}`);

  // 1. Profile
  if (data.profile) {
    const existing = JSON.parse(fs.readFileSync('src/data/profile.json', 'utf8'));
    const merged = {
      ...existing,
      ...data.profile,
      // keep existing image/cvPdf paths unless overridden by image extraction below
      heroImage: existing.heroImage,
      avatar: existing.avatar,
      cvPdf: existing.cvPdf,
    };
    writeJson('src/data/profile.json', merged);
    console.log('  ✓ profile.json updated');
  }

  // 2. Collections
  const collections: Array<keyof ExportPayload> = [
    'publications', 'news', 'projects', 'talks', 'awards', 'teaching', 'experience', 'education',
  ];
  for (const k of collections) {
    const list = data[k];
    if (Array.isArray(list)) writeCollection(k, list);
  }

  // 3. Images
  if (data.images) {
    const imgDir = path.join(ROOT, 'public/images');
    fs.mkdirSync(imgDir, { recursive: true });
    const profilePath = path.join(ROOT, 'src/data/profile.json');
    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

    if (data.images.avatar) {
      const dec = decodeDataUrl(data.images.avatar);
      if (dec) {
        const file = `avatar.${dec.ext}`;
        fs.writeFileSync(path.join(imgDir, file), dec.buf);
        profile.avatar = `/lwq-intro/images/${file}`;
        console.log(`  ✓ avatar → public/images/${file}`);
      }
    }
    if (data.images.hero) {
      const dec = decodeDataUrl(data.images.hero);
      if (dec) {
        const file = `hero.${dec.ext}`;
        fs.writeFileSync(path.join(imgDir, file), dec.buf);
        profile.heroImage = `/lwq-intro/images/${file}`;
        console.log(`  ✓ hero → public/images/${file}`);
      }
    }
    if (Array.isArray(data.images.extra)) {
      data.images.extra.forEach((url, i) => {
        const dec = decodeDataUrl(url);
        if (dec) {
          const file = `photo-${String(i + 1).padStart(2, '0')}.${dec.ext}`;
          fs.writeFileSync(path.join(imgDir, file), dec.buf);
          console.log(`  ✓ extra → public/images/${file}`);
        }
      });
    }
    fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2) + '\n');
  }

  // 4. CV PDF
  if (data.cvPdf) {
    const dec = decodeDataUrl(data.cvPdf);
    if (dec) {
      fs.writeFileSync(path.join(ROOT, 'public/cv.pdf'), dec.buf);
      const profilePath = path.join(ROOT, 'src/data/profile.json');
      const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
      profile.cvPdf = '/lwq-intro/cv.pdf';
      fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2) + '\n');
      console.log(`  ✓ cv.pdf → public/cv.pdf`);
    }
  }

  // 5. Meta
  const meta = {
    importedAt: new Date().toISOString(),
    preferences: data.preferences || {},
    theme: data.theme || 'undecided',
    freeform: data.freeform || '',
  };
  writeJson('src/data/_collector-meta.json', meta);
  console.log('  ✓ collector meta saved');

  console.log('\nDone. Run `pnpm build` to verify.');
}

main();
