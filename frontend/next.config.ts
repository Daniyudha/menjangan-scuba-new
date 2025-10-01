/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Backend lokal (jika menggunakan backend terpisah)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.106',
        port: '8080',
        pathname: '/uploads/**',
      },

      // Backend production
      {
        protocol: 'https',
        hostname: 'api.menjanganscuba.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'menjangan-be.gegacreative.com',
        pathname: '/uploads/**',
      },
      
      // External image sources
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
    // Allow unoptimized images for uploaded content
    unoptimized: true,
  },
};

module.exports = nextConfig;