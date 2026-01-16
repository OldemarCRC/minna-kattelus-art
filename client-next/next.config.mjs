import { fileURLToPath } from 'node:url';
import path from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';

// Reconstruimos __dirname para que funcione en módulos ES (.mjs)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Forzamos a Turbopack a usar client-next como raíz
  // Esto elimina el aviso de los múltiples package-lock.json
  turbopack: {
    root: __dirname,
  },

  // 2. Permitir que Next.js acceda a carpetas fuera de 'src' si es necesario
  experimental: {
    externalDir: true,
  },

  // 3. Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.10.45',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },

  // 5. Evitar errores si intentas usar librerías de Node en el cliente
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
