import { put } from "@vercel/blob"
import { readdir, readFile } from "fs/promises"
import { join } from "path"

async function uploadImages() {
  try {
    // Check if token is available
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      console.error("❌ BLOB_READ_WRITE_TOKEN environment variable is not set!")
      console.log("\n📋 To fix this:")
      console.log("1. Go to your Vercel dashboard")
      console.log("2. Navigate to Storage → Create → Blob")
      console.log("3. Create a new blob store")
      console.log("4. Copy the token and add it to your .env.local file:")
      console.log("   BLOB_READ_WRITE_TOKEN=your_token_here")
      console.log("5. Run this script again")
      return
    }

    const assetsDir = join(process.cwd(), "public", "assets")

    // Check if assets directory exists
    try {
      await readdir(assetsDir)
    } catch (error) {
      console.error("❌ Assets directory not found at:", assetsDir)
      console.log("\n📋 Please ensure you have images in the /public/assets/ directory")
      return
    }

    const files = await readdir(assetsDir)

    // Filter for image files
    const imageFiles = files.filter((file) => file.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/i))

    if (imageFiles.length === 0) {
      console.log("❌ No image files found in /public/assets/")
      console.log("📋 Supported formats: .jpg, .jpeg, .png, .webp")
      return
    }

    console.log(`🔍 Found ${imageFiles.length} images to upload...`)

    const uploadedImages = []

    for (const file of imageFiles) {
      console.log(`📤 Uploading ${file}...`)

      const filePath = join(assetsDir, file)
      const fileBuffer = await readFile(filePath)

      // Upload to Vercel Blob with explicit token
      const blob = await put(`wedding-photos/${file}`, fileBuffer, {
        access: "public",
        addRandomSuffix: false, // Keep original filename
        token: token, // Explicitly pass the token
      })

      uploadedImages.push({
        filename: file,
        url: blob.url,
        downloadUrl: blob.downloadUrl,
      })

      console.log(`✅ Uploaded: ${file}`)
      console.log(`   URL: ${blob.url}`)
    }

    console.log(`\n🎉 Successfully uploaded ${uploadedImages.length} images!`)

    // Generate the array for easy copying
    const galleryArray = uploadedImages.map((img, index) => {
      // Try to determine dimensions from filename or use defaults
      const isPortrait =
        img.filename.toLowerCase().includes("portrait") || img.filename.includes("_p") || index % 3 === 1 // Every 3rd image as portrait for variety

      return {
        id: index + 1,
        src: img.url,
        thumbnail: img.url,
        alt: `웨딩 사진 ${index + 1}`,
        width: isPortrait ? 600 : 800,
        height: isPortrait ? 800 : 600,
      }
    })

    console.log("\n📋 Copy this array to replace the weddingPhotos in lib/blob-images.ts:")
    console.log("=" * 60)
    console.log(JSON.stringify(galleryArray, null, 2))
    console.log("=" * 60)

    // Also save to a file for easy access
    const outputPath = join(process.cwd(), "uploaded-images.json")
    await import("fs/promises").then((fs) => fs.writeFile(outputPath, JSON.stringify(galleryArray, null, 2)))
    console.log(`\n💾 Also saved to: ${outputPath}`)
  } catch (error) {
    console.error("❌ Error uploading images:", error)

    if (error.message.includes("token")) {
      console.log("\n📋 Token issue detected. Please:")
      console.log("1. Check your BLOB_READ_WRITE_TOKEN in .env.local")
      console.log("2. Make sure the token is valid and has write permissions")
      console.log("3. Restart your development server after adding the token")
    }
  }
}

uploadImages()
