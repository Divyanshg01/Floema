const path = require("path");

const webpack = require("webpack");

const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const IS_DEVELOPMENT = process.env.NODE_ENV === "dev";

const dirApp = path.join(__dirname, "app");
// const dirImages = path.join(__dirname, "images");
const dirShared = path.join(__dirname, "shared");
const dirStyles = path.join(__dirname, "styles");
// const dirVideos = path.join(__dirname, "videos");
const dirNode = "node_modules";
// console.log(dirApp, dirAssets, dirShared, dirStyles, dirNode);

module.exports = {
    entry: [path.join(dirApp, "index.js"), path.join(dirStyles, "index.scss")],

    resolve: {
        modules: [dirApp, dirShared, dirStyles, dirNode],
    },

    plugins: [
        new webpack.DefinePlugin({
            IS_DEVELOPMENT,
        }),

        new CopyPlugin({
            patterns: [
                {
                    from: "./shared",
                    to: "",
                },
            ],
        }),

        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),

        //
        //  NO IMAGE MINIFER because its plugin has vulnerabilities
        //
        //
        // new ImageMinimizerPlugin({
        //     minimizer: {
        //         implementation: ImageMinimizerPlugin.imageminMinify,
        //         options: {
        //             // plugins: [
        //             //     // interlaced: Interlace gif for progressive rendering.
        //             //     // ["gifsicle", { interlaced: true }],
        //             //     // progressive: Lossless conversion to progressive.
        //             //     // ["jpegtran", { progressive: true }],
        //             //     // optimizationLevel (0-7): The optimization level 0 enables a set of
        //             //     // optimization operations that require minimal effort. There will be
        //             //     // no changes to image attributes like bit depth or color type, and no
        //             //     // recompression of existing IDAT datastreams. The optimization level
        //             //     // 1 enables a single IDAT compression trial. The trial chosen is what
        //             //     //  OptiPNG thinks it’s probably the most effective.
        //             //     // ["optipng", { optimizationLevel: 8 }],
        //             // ],
        //         },
        //     },
        // }),

        new CleanWebpackPlugin(),
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                },
            },

            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "",
                        },
                    },

                    {
                        loader: "css-loader",
                    },

                    {
                        loader: "postcss-loader",
                    },

                    {
                        loader: "sass-loader",
                    },
                ],
            },

            {
                test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
                loader: "file-loader",
                options: {
                    // outputPath : "images",
                    name(file) {
                        return "[hash].[ext]";
                    },
                },
            },
            //
            //     {
            //         test: /\.(png|jpg|gif|jpe?g|svg|woff2?|fnt|webp|mp4)$/,
            //         type: "asset/resource",
            //         generator: {
            //             filename: "[name].[hash].[ext]",
            //         },
            //     },
            //
            //     {
            //         test: /\.(jpe?g|png|gif|svg|webp)$/i,
            //         use: [
            //             {
            //                 loader: ImageMinimizerPlugin.loader,
            //             },
            //         ],
            //     },
            //
            {
                test: /\.(glsl|frag|vert)$/,
                type: "asset/source", // replaced raw-loader
                exclude: /node_modules/,
            },

            {
                test: /\.(glsl|frag|vert)$/,
                loader: "glslify-loader",
                exclude: /node_modules/,
            },
        ],
    },
    //
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
};
