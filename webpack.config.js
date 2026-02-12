const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  devtool: isDevelopment ? "eval-source-map" : "source-map",
  entry: "./src/index.tsx",
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    publicPath: "/",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                isDevelopment && require.resolve("react-refresh/babel"),
              ].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        oneOf: [
          {
            test: /\.module\.s[ac]ss$/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  modules: {
                    localIdentName: "[name]__[local]--[hash:base64:5]",
                    exportLocalsConvention: "camelCase",
                  },
                },
              },
              "sass-loader",
            ],
          },
          {
            use: ["style-loader", "css-loader", "sass-loader"],
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new ESLintPlugin({
      extensions: ["ts", "tsx", "js", "jsx"],
      configType: "flat",
      eslintPath: "eslint/use-at-your-own-risk",
    }),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_USE_MOCK": JSON.stringify(
        process.env.REACT_APP_USE_MOCK,
      ),
      "process.env.REACT_APP_API_URL": JSON.stringify(
        process.env.REACT_APP_API_URL,
      ),
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  devServer: {
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 3000,
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
    },
  },
};
