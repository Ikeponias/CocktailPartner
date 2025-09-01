/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/CocktailPartner',
  assetPrefix: '/CocktailPartner/',
  images: {
    unoptimized: true
  },
}

module.exports = nextConfig
