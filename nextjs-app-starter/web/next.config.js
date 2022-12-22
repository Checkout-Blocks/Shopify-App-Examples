/** @type {import('next').NextConfig} */

const headers = {
  preventIframe: {
      key: 'Content-Security-Policy',
      value: `frame-ancestors 'none';`
  }
};

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    allowMiddlewareResponseBody: true,
  },
  async headers() {
    return [
      {
        source: '/login',
        headers: [
          headers.preventIframe,
        ],
      },
    ]
  },
}

module.exports = nextConfig
