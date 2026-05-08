/**
 * NexaCare Logo Setup Script
 * Run this once after placing the nexacare-logos/ folder in the project root.
 *
 * Usage:
 *   node scripts/setup-logos.js
 *
 * Expects these source files in nexacare-logos/:
 *   logo_SOURCE_fulllogo_transparent.png
 *   logo_SOURCE_icononly_transparent.png
 *   logo_favicon_32x32.png
 *   logo_favicon_64x64.png
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC = path.resolve(__dirname, "../nexacare-logos");
const LOGO_DEST = path.resolve(__dirname, "../public/images/logo");
const PUBLIC = path.resolve(__dirname, "../public");

const REQUIRED = [
  "logo_SOURCE_fulllogo_transparent.png",
  "logo_SOURCE_icononly_transparent.png",
  "logo_favicon_32x32.png",
  "logo_favicon_64x64.png",
];

async function main() {
  // Check source folder exists
  if (!fs.existsSync(SRC)) {
    console.error(
      "\n❌  nexacare-logos/ folder not found in project root.\n" +
        "    Place the logo folder there and re-run this script.\n"
    );
    process.exit(1);
  }

  // Check all required files present
  const missing = REQUIRED.filter((f) => !fs.existsSync(path.join(SRC, f)));
  if (missing.length) {
    console.error("\n❌  Missing files in nexacare-logos/:");
    missing.forEach((f) => console.error(`    - ${f}`));
    process.exit(1);
  }

  // Create destination directory
  fs.mkdirSync(LOGO_DEST, { recursive: true });

  // Copy all four source files
  for (const file of REQUIRED) {
    fs.copyFileSync(path.join(SRC, file), path.join(LOGO_DEST, file));
    console.log(`✓  Copied  public/images/logo/${file}`);
  }

  // Copy favicons to public/ root
  fs.copyFileSync(
    path.join(SRC, "logo_favicon_32x32.png"),
    path.join(PUBLIC, "favicon-32x32.png")
  );
  console.log("✓  Copied  public/favicon-32x32.png");

  fs.copyFileSync(
    path.join(SRC, "logo_favicon_64x64.png"),
    path.join(PUBLIC, "favicon-64x64.png")
  );
  console.log("✓  Copied  public/favicon-64x64.png");

  // Generate 180×180 apple-touch-icon from the 64px favicon
  await sharp(path.join(SRC, "logo_favicon_64x64.png"))
    .resize(180, 180, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(path.join(PUBLIC, "apple-touch-icon.png"));
  console.log("✓  Generated public/apple-touch-icon.png  (180×180)");

  // Remove old generated SVG favicon (replaced by real files)
  const oldSvg = path.join(PUBLIC, "favicon.svg");
  if (fs.existsSync(oldSvg)) {
    fs.unlinkSync(oldSvg);
    console.log("✓  Removed  public/favicon.svg  (replaced by real assets)");
  }

  // Remove old generated 16px favicon (not needed — 32px is the minimum)
  const old16 = path.join(PUBLIC, "favicon-16x16.png");
  if (fs.existsSync(old16)) {
    fs.unlinkSync(old16);
    console.log("✓  Removed  public/favicon-16x16.png  (replaced by real assets)");
  }

  console.log("\n✅  Logo setup complete. Run `npm run build` to verify.\n");
}

main().catch((err) => {
  console.error("\n❌  Setup failed:", err.message);
  process.exit(1);
});
