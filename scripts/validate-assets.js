import fs from "fs";
import path from "path";

const distDir = process.argv[2] || "dist";
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error(`index.html not found in ${distDir}. Run the build first.`);
  process.exit(1);
}

const html = fs.readFileSync(indexPath, "utf8");
// Capture all /assets/xxxxx references (in src, href, import strings)
const assetRegex = /\/(assets\/[A-Za-z0-9._\-\/]*)/g;
const assets = new Set();
let m;
while ((m = assetRegex.exec(html))) {
  assets.add(m[1]);
}

if (assets.size === 0) {
  console.log("No assets referenced in index.html — nothing to validate.");
  process.exit(0);
}

const missing = [];
for (const asset of assets) {
  const assetPath = path.join(distDir, asset.replace(/^assets\//, "assets/"));
  if (!fs.existsSync(assetPath)) {
    missing.push(asset);
  }
}

if (missing.length > 0) {
  console.error("Missing assets referenced in index.html:");
  missing.forEach((a) => console.error(` - ${a}`));
  process.exit(2);
}

console.log("All referenced assets exist in dist/assets. ✅");
