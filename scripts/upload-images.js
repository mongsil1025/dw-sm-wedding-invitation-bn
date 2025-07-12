import { put } from "@vercel/blob"
import { readdir, readFile } from "fs/promises"
import { join } from "path"

async function uploadImages() {
  try {
    const assetsDir = join(process.cwd(), "public", "assets")
    const files = await readdir(assetsDir)

    // Filter for image files
    const imageFiles = files.filter((file) => file.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/i))

    console.log(`Found ${imageFiles.length} images to upload...`)

    const uploadedImages = []

    for (const file of imageFiles) {
      console.log(`Uploading ${file}...`)

      const filePath = join(assetsDir, file)
      const fileBuffer = await readFile(filePath)

      // Upload to Vercel Blob
      const blob = await put(`wedding-photos/${file}`, fileBuffer, {
        access: "public",
        addRandomSuffix: false, // Keep original filename
      })

      uploadedImages.push({
        filename: file,
        url: blob.url,
        downloadUrl: blob.downloadUrl,
      })

      console.log(`✅ Uploaded: ${file} -> ${blob.url}`)
    }

    // Output the results for easy copying
    console.log("\n📋 Copy this array to replace galleryPhotos in your component:")
    console.log(
      JSON.stringify(
        uploadedImages.map((img, index) => ({
          id: index + 1,
          src: img.url,
          thumbnail: img.url,
          alt: `웨딩 사진 ${index + 1}`,
          width: 800, // You may want to adjust these based on your actual image dimensions
          height: 600,
        })),
        null,
        2,
      ),
    )
  } catch (error) {
    console.error("Error uploading images:", error)
  }
}

uploadImages()
