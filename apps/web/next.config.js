// @ts-check

/**
 * @type {import("next/dist/server/config-shared").NextConfig}
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
  },
  cleanDistDir: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};
