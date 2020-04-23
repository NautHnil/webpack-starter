const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackNotifierPlugin = require('webpack-notifier');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');

// Files
const routes = require("./routes");

module.exports = env => {
  return {
    context: path.resolve(__dirname, "../src"),
    entry: {
      app: "./app.js"
    },
    output: {
      path: path.resolve(__dirname, "../dist"),
      publicPath: "/",
      filename: "assets/js/[name].[hash:7].bundle.js"
    },
    devServer: {
      contentBase: path.resolve(__dirname, "../src")
    },
    resolve: {
      extensions: [".js"],
      alias: {
        source: path.resolve(__dirname, "../src"),
        images: path.resolve(__dirname, "../src/assets/images"),
        fonts: path.resolve(__dirname, "../src/assets/fonts"),
      }
    },

    /**
     * Loaders with configurations
     */
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: "babel-loader"
            }
          ]
        },
        {
          test: /\.pug$/,
          use: [
            {
              loader: "pug-loader"
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            env === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                importLoaders: 1
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            env === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                importLoaders: 1
              }
            },
            "postcss-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.(png|jpe?g|gif|ico|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 3000,
            name: 'assets/images/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 5000,
            name: 'assets/fonts/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(mp4)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/videos/[name].[hash:7].[ext]'
          }
        }
      ]
    },

    /**
     * Use with plugins
     */
    plugins: [
      new MiniCssExtractPlugin({
        filename: "assets/css/[name].[hash:7].bundle.css"
      }),

      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "views/index.pug",
      }),

      ...routes.router(env),
      ...routes.router(env, "blog"),

      new WebpackNotifierPlugin({
        title: 'Webpack Starter'
      }),

      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.$': 'jquery',
        'window.jQuery': 'jquery'
      }),
    ],

    /**
     * Optimization
     */
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
      ],
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          // vendor chunk
          vendor: {
            filename: 'assets/js/vendor.[hash:7].bundle.js',
            // sync + async chunks
            chunks: 'all',
            // import file path containing node_modules
            test: /node_modules/
          }
        }
      }
    }
  }
};
