import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = "public/assets_org";
const outputDir = "public/assets";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter((file) =>
  /\.(jpe?g|png)$/i.test(file)
);

files.forEach(async (file) => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, `${path.parse(file).name}.webp`);

  try {
    await sharp(inputPath)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: 80,
        effort: 6  // 더 높은 압축 노력 (0-6, 기본값 4)
      })
      .toFile(outputPath);

    console.log(`✅ ${file} → ${path.basename(outputPath)}`);
  } catch (err) {
    console.error(`❌ ${file} 처리 중 오류 발생:`, err);
  }
});