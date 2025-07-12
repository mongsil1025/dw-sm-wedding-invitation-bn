import { list } from "@vercel/blob"

async function checkBlobSetup() {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN

    if (!token) {
      console.log("🔧 Vercel Blob Setup Required")
      console.log("=" * 50)
      console.log("1. Go to https://vercel.com/dashboard")
      console.log("2. Select your project")
      console.log("3. Go to Storage tab")
      console.log("4. Click 'Create' → 'Blob'")
      console.log("5. Create a new blob store")
      console.log("6. Copy the token")
      console.log("7. Add to .env.local:")
      console.log("   BLOB_READ_WRITE_TOKEN=your_token_here")
      console.log("8. Restart your dev server")
      console.log("=" * 50)
      return
    }

    console.log("🔍 Checking Blob connection...")

    // Test the connection
    const { blobs } = await list({
      token: token,
      limit: 1,
    })

    console.log("✅ Blob connection successful!")
    console.log(`📊 Current blobs in store: ${blobs.length > 0 ? "Found existing files" : "Empty (ready for upload)"}`)

    if (blobs.length > 0) {
      console.log("📁 Existing files:")
      blobs.forEach((blob) => {
        console.log(`   - ${blob.pathname}`)
      })
    }

    console.log("\n🚀 Ready to upload! Run: npm run upload-images")
  } catch (error) {
    console.error("❌ Blob setup error:", error.message)

    if (error.message.includes("token")) {
      console.log("\n💡 Token issue - please check your BLOB_READ_WRITE_TOKEN")
    } else if (error.message.includes("network")) {
      console.log("\n💡 Network issue - please check your internet connection")
    }
  }
}

checkBlobSetup()
