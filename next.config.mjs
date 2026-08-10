/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Placeholder images (used for products without a real photo yet)
      { protocol: "https", hostname: "placehold.co" },
      // Product photos uploaded via the admin dashboard, hosted in
      // Supabase Storage — any *.supabase.co project subdomain
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
