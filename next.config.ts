import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fotos de productos subidas desde el admin al Storage de Supabase.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
