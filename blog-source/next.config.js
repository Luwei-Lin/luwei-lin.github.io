import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '',
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // @react-pdf/renderer runs React-context code at module init, which
      // crashes during static prerendering. Point it to a no-op stub
      // server-side — all real usage is behind ssr:false dynamic imports.
      config.resolve.alias['@react-pdf/renderer'] = path.join(__dirname, 'lib/pdf-server-stub.js');
    }
    return config;
  },
}

export default nextConfig
