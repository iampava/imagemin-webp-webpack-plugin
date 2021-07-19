const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => ({
    mode: 'production',
    devtool: false,
    output: {
        filename: 'bundle.[contenthash].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                }]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css'
        })
    ]
});
