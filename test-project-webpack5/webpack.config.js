const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { merge: webpackMerge } = require('webpack-merge');
const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);

const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');

module.exports = (env, { mode }) =>
    webpackMerge(
        {
            mode,
            entry: './src/index.js',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: 'babel-loader'
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
