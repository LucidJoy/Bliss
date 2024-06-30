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
    ],
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "ipfs.io",
    //     port: "",
    //     pathname: "/ipfs/**",
    //   },
    // ],
  },
};

module.exports = nextConfig;
