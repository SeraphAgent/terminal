/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify'),
      zlib: require.resolve('browserify-zlib'),
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser'),
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      process: 'process/browser',
    };
    return config;
  },
};

module.exports = nextConfig;