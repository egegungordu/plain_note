/** @type {import('next').NextConfig} */
// add lh3.googleusercontent.com to images
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
