const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { ProvidePlugin } = require("webpack");
const Dotenv = require("dotenv-webpack");

const webpackBaseRules = [
  {
    test: /\.s?(c|a)ss$/i,
    use: [
      "style-loader",
      "css-loader",
      "resolve-url-loader",
      {
        loader: "sass-loader",
        options: {
          additionalData: '@import "./src/scss/index.scss";',
          sourceMap: true
        }
      }
    ]
  },
  {
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: "asset/resource",
    generator: {
      filename: "./assets/images/[hash][ext][query]"
    }
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: "asset/resource",
    generator: {
      filename: "./assets/fonts/[hash][ext][query]"
    }
  },
  {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript"
        ]
      }
    }
  }
];

const webpackBasePlugins = [
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "../../public/index.html"),
    filename: "index.html",
    inject: "body",
    minify: true
  }),
  new ProvidePlugin({
    React: "react"
  }),
  new CopyPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, "../../public"),
        to: path.resolve(__dirname, "../../dist"),
        noErrorOnMissing: true,
        filter: async (resourcePath) => {
          const resourcePathChange = resourcePath.substr(
            resourcePath.indexOf("public")
          );
          const matched = resourcePathChange.match(/(index\.html)$/gi);

          if (matched) {
            return false;
          }

          return true;
        }
      },
      {
        from: path.resolve(__dirname, "../../node_modules/@essnextgen/ui-kit/dist/build/assets/images/spritemap.svg"),
        to: path.resolve(__dirname, "../../public/assets/images/spritemap.svg")
      }
    ]
  })
];

const buildEnv =
  process.env.CUSTOM_ENV ||
  (process.env.NODE_ENV === "production" ? "production" : "development");
webpackBasePlugins.push(
  new Dotenv({
    path: `./.env.${buildEnv}`,
    systemvars: true
  })
);

const webpackDevServerSettings = {
  compress: true,
  hot: true,
  port: process.env.PORT || 3000,
  open: true,
  proxy: {
    "/api": {
      target: "http://openlibrary.org/",
      changeOrigin: true,
      pathRewrite: { "^/api": "" }
    }
  },
  client: {
    overlay: false
  }
};

const baseConfig = {
  mode: "development",
  entry: "./src/index.tsx",
  target: ["web"],
  output: {
    path: path.resolve(__dirname, "../../dist"),
    filename: "[name].[contenthash].js",
    clean: true,
    assetModuleFilename: "assets/[hash][ext][query]",
    publicPath: "/"
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"]
  },
  performance: {
    hints: "warning",
    maxAssetSize: 512000,
    maxEntrypointSize: 512000
  },
  module: {
    rules: webpackBaseRules
  },
  plugins: webpackBasePlugins,
  devServer: webpackDevServerSettings
};

module.exports = {
  baseConfig,
  webpackBaseRules,
  webpackBasePlugins,
  webpackDevServerSettings
};
