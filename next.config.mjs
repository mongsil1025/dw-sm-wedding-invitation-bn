/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_NCP_CLIENT_ID: process.env.NEXT_PUBLIC_NCP_CLIENT_ID,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placeholder.svg', 'pcspa0ki3n93t2jc.public.blob.vercel-storage.com'],
    unoptimized: false, // Enable Next.js image optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
  },
}

export default nextConfig
