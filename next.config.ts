import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const env = process.env.APP_ENV || "dev"

const nextConfig: NextConfig = {
  experimental: {},
  devIndicators:false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "djgxnxoqp5vg26de.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
