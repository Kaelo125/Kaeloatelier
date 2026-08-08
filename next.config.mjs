/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow placeholder images (used until real product photography is added)
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
