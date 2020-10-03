const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpackMerge = require('webpack-merge');
const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);


/**
 * If we don't copy the plugin in this project when
 * using it like this, we get a very strange error regarding
 *
 * > \cwebp-bin\\vendor\\cwebp.exe
 *
 * It seems it's trying to use it from the root `node_modules`
 * but there's no `vendor` subfolder there and it fails.
 *
 * TODO: find a proper/better solution than this 👇
 */
fs.copyFileSync('../plugin.js', 'plugin.js');
const ImageminWebpWebpackPlugin = require('./plugin');

module.exports = ({ mode }) =>
    webpackMerge(
        {
            mode,
            entry: './src/index.js',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: 'babel-loader'
                    },
                    {
                        test: /\.(jpeg|jpg|png|gif|svg)$/i,
                        loader: 'file-loader',

                        options: {
                            name: '[name].[ext]?[hash]',
                            outputPath: 'assets/'
                        }
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: 'index.html',
                    inject: 'body',
                    minify: {
                        html5: true,
                        removeComments: true,
                        collapseWhitespace: true
                    }
                }),
                new CopyWebpackPlugin({
                    patterns: [{
                        from: 'src/assets/',
                        to: 'assets/'
                    }]
                }),
                new ImageminWebpWebpackPlugin({
                    detailedLogs: true,
                    overrideExtension: true,
                    config: [{
                        test: /\.(jpe?g|png|gif)/,
                        options: {
                          quality:  75
                        }
                    }],
                })
            ]
        },
        modeConfig(mode)
    );
