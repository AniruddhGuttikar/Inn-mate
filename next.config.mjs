/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    reactRemoveProperties: {
      properties: ["^data-new-gr-c-s-check-loaded$", "^data-gr-ext-installed$"],
    },
  },
};

export default nextConfig;
