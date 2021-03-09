// =========================================
// Dependencies
// =========================================
const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

// =========================================
// Webpack Config
// =========================================
const config = {
    entry: {
      app: "./public/assets/js/index.js",
    },
    output: {
      path: __dirname + "/public/dist",
      filename: "bundle.js",
    },
    mode: "development",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
      ],
    },
    plugins: [
      new WebpackPwaManifest({
        fingerprints: false,
        name: "Online-Offline-Budget-Trackers",
        short_name: "BudgetTracker",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        start_url: "/",
        icons: [
          {
            src: path.resolve("public/assets/images/icons/icon-512x512.png"),
            sizes: [192, 512],
            destination: path.join("public", "icons"),
          },
        ],
      }),
    ],
  };
  
// Export config
  module.exports = config;