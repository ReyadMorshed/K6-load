const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/main.ts", // Explicitly point to your main file
  output: {
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs",
    filename: "main.js",
  },
  resolve: {
    extensions: [".ts", ".js"], // Look for .ts files
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    k6: "commonjs k6",
    "k6/http": "commonjs k6/http",
  }, // Explicitly mark k6 modules as external
};
