const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpackMerge = require('webpack-merge');
const ImageminWebpWebpackPlugin = require('../plugin');

const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);

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
                new CopyWebpackPlugin([
                    {
                        from: 'src/assets/',
                        to: 'assets/'
                    }
                ]),
                new ImageminWebpWebpackPlugin({
                    detailedLogs: true,
                    overrideExtension: true
                })
            ]
        },
        modeConfig(mode)
    );
