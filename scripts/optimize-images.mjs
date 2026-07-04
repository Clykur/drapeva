#!/usr/bin/env node
/**
 * optimize-images.mjs
 * ────────────────────────────────────────────────────────────────────────────
 * Compresses PNG/JPG/JPEG/WebP images under frontend/public/ using sharp.
 *
 * Strategy
 * ──────────
 * 1. PNG  → re-encoded PNG  (quality 75, compressionLevel 9, palette mode)
 *           + a sibling .webp (quality 75) for modern browsers
 * 2. JPEG → re-encoded JPEG (quality 75, progressive)
 *           + a sibling .webp
 * 3. WebP → re-encoded WebP (quality 75) in-place
 *
 * Files already < 50 KB are skipped (already small enough).
 *
 * Usage
 * ──────
 *   node scripts/optimize-images.mjs              # from repo root
 *   node scripts/optimize-images.mjs --dry-run    # preview only
 *
 * Inside Docker the image-optimizer stage calls this automatically.
 *
 * Dependencies
 * ─────────────
 *   sharp  (listed as devDependency in root package.json)
 * ────────────────────────────────────────────────────────────────────────────
 */

import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);

// ── Config ────────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const INPUT_DIR = path.join(ROOT, "frontend", "public");
const SKIP_BELOW = 50 * 1024; // skip files < 50 KB (already small)
const DRY_RUN = process.argv.includes("--dry-run");

const PNG_OPTIONS = { quality: 75, compressionLevel: 9 };
const JPEG_OPTIONS = { quality: 75, progressive: true, mozjpeg: true };
const WEBP_OPTIONS = { quality: 75, effort: 6 };

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function walkDir(dir, result = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, result);
    } else if (/\.(png|jpe?g|webp)$/i.test(entry.name)) {
      result.push(full);
    }
  }
  return result;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  // Dynamically import sharp so the script gives a clear error if missing
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("❌  sharp is not installed. Run: npm install --save-dev sharp");
    process.exit(1);
  }

  const files = walkDir(INPUT_DIR);

  if (files.length === 0) {
    console.log("ℹ️   No images found under", INPUT_DIR);
    return;
  }

  console.log(
    `\n🖼️   Image optimiser — ${DRY_RUN ? "[DRY RUN] " : ""}processing ${files.length} file(s)\n`,
  );
  console.log(
    " File".padEnd(60) +
      "Before".padStart(10) +
      "After".padStart(10) +
      "Saved".padStart(10) +
      "  WebP",
  );
  console.log("─".repeat(94));

  let totalBefore = 0;
  let totalAfter = 0;
  let skipped = 0;

  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase();
    const beforeSize = fs.statSync(filePath).size;
    const rel = path.relative(ROOT, filePath);

    if (beforeSize < SKIP_BELOW) {
      console.log(` ${rel.padEnd(59)} ${fmtBytes(beforeSize).padStart(9)}   — skipped (< 50 KB)`);
      skipped++;
      continue;
    }

    totalBefore += beforeSize;

    if (DRY_RUN) {
      console.log(` ${rel.padEnd(59)} ${fmtBytes(beforeSize).padStart(9)}   (dry-run)`);
      continue;
    }

    try {
      const image = sharp(filePath);
      const webpPath = filePath.replace(/\.(png|jpe?g|webp)$/i, ".webp");

      // ── Write optimised original format ─────────────────────
      let outBuffer;
      if (ext === ".png") {
        outBuffer = await image.png(PNG_OPTIONS).toBuffer();
      } else if (ext === ".jpg" || ext === ".jpeg") {
        outBuffer = await image.jpeg(JPEG_OPTIONS).toBuffer();
      } else {
        outBuffer = await image.webp(WEBP_OPTIONS).toBuffer();
      }

      fs.writeFileSync(filePath, outBuffer);
      const afterSize = outBuffer.length;
      totalAfter += afterSize;

      // ── Write WebP companion (only for PNG and JPEG) ─────────
      let wroteWebp = false;
      if (ext !== ".webp") {
        const webpBuffer = await sharp(filePath).webp(WEBP_OPTIONS).toBuffer();
        fs.writeFileSync(webpPath, webpBuffer);
        wroteWebp = true;
      }

      const saved = beforeSize - afterSize;
      const pct = ((saved / beforeSize) * 100).toFixed(1);
      const label = `${rel} (-${pct}%)`;

      console.log(
        ` ${label.padEnd(59)}` +
          fmtBytes(beforeSize).padStart(10) +
          fmtBytes(afterSize).padStart(10) +
          fmtBytes(saved).padStart(10) +
          (wroteWebp ? "  ✓" : ""),
      );
    } catch (err) {
      console.error(` ⚠️  Failed to process ${rel}: ${err.message}`);
    }
  }

  if (!DRY_RUN && totalBefore > 0) {
    const saved = totalBefore - totalAfter;
    const pct = ((saved / totalBefore) * 100).toFixed(1);
    console.log("─".repeat(94));
    console.log(
      ` ${"TOTAL".padEnd(59)}` +
        fmtBytes(totalBefore).padStart(10) +
        fmtBytes(totalAfter).padStart(10) +
        fmtBytes(saved).padStart(10),
    );
    console.log(
      `\n✅  Saved ${fmtBytes(saved)} (${pct}%) across ${files.length - skipped} file(s). ${skipped} skipped.\n`,
    );
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
