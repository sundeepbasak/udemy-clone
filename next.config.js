/** @type {import('next').NextConfig} */

// const { CronJob } = require("cron");
// const job = new CronJob("* * * * *", async () => {
//   try {
//     console.log("HELLO CRON");
//   } catch (error) {
//     console.error("Error in cron job:", error);
//   }
// });
// job.start();

const nextConfig = {
  experimental: {
    serverActions: true,
    esmExternals:false
  },
  images: {
    domains: [
      "unsplash.com",
      "images.unsplash.com",
      "via.placeholder.com",
      "lms-static-files.s3.amazonaws.com",
      "plus.unsplash.com",
    ],
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
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

  async rewrites() {
    return [
      {
        source: "/videos/:vid",
        destination: "https://player.vimeo.com/video/:vid",
        // headers: [{ key: "Authorization", value: `Bearer ${accessToken}` }],
      },
    ];
  },
};

module.exports = nextConfig;
