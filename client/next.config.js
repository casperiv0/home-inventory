// @ts-check

/**
 * @type {import("next/dist/next-server/server/config-shared").NextConfig}
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
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      };
    }

    return config;
  },
  cleanDistDir: true,
  devIndicators: {
    buildActivity: true,
  },
  optimizeFonts: true,
  compress: true,
};
