/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "oaidalleapiprodscus.blob.core.windows.net",
      "ipfs.io",
      "ipfs",
      "i.seadn.io",
      "ipfs://QmTewW2DnYLU3FWs8N4qApHBo6iH9Lv4TaRQMKGJPG2LRo/image.png",
      "ipfs://QmTJct3YJdXjmhfE1rtwhhvhW1L9yhxjDvtaSve2YB5izt/0",
      "images.unsplash.com",
    ],
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
