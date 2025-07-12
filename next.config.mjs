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
    domains: ['placeholder.svg'],
    unoptimized: true,
  },
}

export default nextConfig
