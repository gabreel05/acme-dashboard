/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['knex'],
  },
  output: 'standalone',
};

module.exports = nextConfig;
