const { merge } = require("webpack-merge");
const { webpackBaseRules } = require("./webpack.base");
const singleSpaDefaults = require('webpack-config-single-spa-react-ts');
const path = require("path");
const { ProvidePlugin } = require("webpack");
const Dotenv = require("dotenv-webpack");
const ManifestPlugin = require("webpack-assets-manifest");

const buildEnv =
  process.env.CUSTOM_ENV ||
  (process.env.NODE_ENV === "production" ? "production" : "development");

module.exports = (webpackConfigEnv, argv) => {

    const defaultConfig = singleSpaDefaults({
      orgName: 'essnextgen',
      projectName: 'home-ui',
      orgPackagesAsExternal: true,
      webpackConfigEnv,
      argv,
      rootDirectoryLevel: 1,
      disableHtmlGeneration: false
    })
    delete defaultConfig.externals;
    const config = merge(defaultConfig, {
        module: {
            rules: webpackBaseRules,
        },
        output:{
            path: path.resolve(__dirname, "../../dist/singlespa"),
            filename: "[name].[contenthash].js"
        },
        entry: "./src/singleSpa/index.tsx",
        externals:["@essnextgen/ui-kit","react", "react-dom", "single-spa"],
        mode: "production",
        plugins:[
            new ProvidePlugin({
                React: "react"
            }),
            new Dotenv({
                path: `./.env.${buildEnv}`,
                systemvars: true
            }),
             new ManifestPlugin({
                output: 'mfe-manifest.json',
                publicPath: true
        })
        ]
    });
    
    return config;
  }
