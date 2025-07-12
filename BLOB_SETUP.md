# 🚀 Vercel Blob Setup Guide

## Step 1: Create Vercel Blob Store

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Storage** tab
4. Click **Create** → **Blob**
5. Give your store a name (e.g., "wedding-photos")
6. Click **Create**

## Step 2: Get Your Token

1. After creating the store, you'll see a token
2. Copy the `BLOB_READ_WRITE_TOKEN`
3. Create a `.env.local` file in your project root
4. Add the token:
   \`\`\`
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here
   \`\`\`

## Step 3: Verify Setup

Run the setup check:
\`\`\`bash
npm run setup-blob
\`\`\`

## Step 4: Upload Images

1. Place your wedding photos in `/public/assets/`
2. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
3. Run the upload script:
   \`\`\`bash
   npm run upload-images
   \`\`\`

## Step 5: Update Your Code

1. Copy the generated array from the console
2. Replace the `weddingPhotos` array in `lib/blob-images.ts`
3. Your images will now load from Vercel Blob CDN! 🎉

## Troubleshooting

### Token Issues
- Make sure the token starts with `vercel_blob_rw_`
- Restart your dev server after adding the token
- Check the token hasn't expired

### Upload Issues
- Ensure images are in `/public/assets/`
- Check file formats are supported
- Verify internet connection

### Need Help?
Run `npm run check-env` to verify your environment setup.
