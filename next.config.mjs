/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      unoptimized: true
    },
    trailingSlash: true,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // 为客户端添加Electron polyfill
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
          electron: false
        }
      }
      return config
    }
  }
  
  export default nextConfig