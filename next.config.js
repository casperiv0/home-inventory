// @ts-check

/**
 * @type {import("next").NextConfig}
 */
module.exports = {
  async redirects() {
    return [
      {
        source: "/logout",
        destination: "/auth/logout",
        permanent: true,
      },
    ];
  },
  experimental: {
    browsersListForSwc: true,
    legacyBrowsers: false,
    images: { allowFutureImage: true },
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  cleanDistDir: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};
