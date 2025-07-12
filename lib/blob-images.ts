// Vercel Blob URLs for wedding photos
// Run the upload script to generate these URLs
export const weddingPhotos = [
  {
    id: 1,
    src: "https://your-blob-url.public.blob.vercel-storage.com/wedding-photos/1.jpg",
    thumbnail: "https://your-blob-url.public.blob.vercel-storage.com/wedding-photos/1.jpg",
    alt: "웨딩 사진 1",
    width: 800,
    height: 600,
  },
  {
    id: 2,
    src: "https://your-blob-url.public.blob.vercel-storage.com/wedding-photos/2.jpg",
    thumbnail: "https://your-blob-url.public.blob.vercel-storage.com/wedding-photos/2.jpg",
    alt: "웨딩 사진 2",
    width: 800,
    height: 600,
  },
  // Add more photos here after running the upload script
]

// Helper function to get optimized image URL with query parameters
export function getOptimizedImageUrl(
  baseUrl: string,
  options?: {
    width?: number
    height?: number
    quality?: number
  },
) {
  if (!options) return baseUrl

  const params = new URLSearchParams()
  if (options.width) params.set("w", options.width.toString())
  if (options.height) params.set("h", options.height.toString())
  if (options.quality) params.set("q", options.quality.toString())

  return `${baseUrl}?${params.toString()}`
}
