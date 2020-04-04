module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  output: {
    path: __dirname,
    filename: "index.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
