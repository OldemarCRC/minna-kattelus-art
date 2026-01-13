import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization configuration
  images: {
    domains: ['localhost', '192.168.10.45'],
    // Add your production domain when deployed
    // domains: ['localhost', '192.168.10.45', 'minnakattelus.com'],
  },

  // Disable strict mode in development for better debugging
  reactStrictMode: true,

  // Environment variables available to the browser
  // (NEXT_PUBLIC_ prefix is already available, this is for custom config)
  env: {
    CUSTOM_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default withNextIntl(nextConfig);
