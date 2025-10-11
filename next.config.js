/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
   experimental: {
    serverComponentsExternalPackages: ['pdf2json'],
  },

}

module.exports = nextConfig