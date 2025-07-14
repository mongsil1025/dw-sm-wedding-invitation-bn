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

  // N1081963 파일은 더 높은 품질로 압축
  const fileName = path.parse(file).name;
  const quality = fileName === 'N1081963' ? 95 : 80;

  try {
    await sharp(inputPath)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({
        quality: quality,
        effort: 6  // 더 높은 압축 노력 (0-6, 기본값 4)
      })
      .toFile(outputPath);

    console.log(`✅ ${file} → ${path.basename(outputPath)} (quality: ${quality})`);
  } catch (err) {
    console.error(`❌ ${file} 처리 중 오류 발생:`, err);
  }
});