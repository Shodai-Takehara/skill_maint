/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker環境用にstandaloneモードを使用
  output: process.env.DOCKER_BUILD ? 'standalone' : 'export',
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: { 
    unoptimized: true,
  },
  
  // Docker環境用の設定
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

module.exports = nextConfig;
