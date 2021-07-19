module.exports = () => ({
    mode: 'development',
    devtool: 'source-map',
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                }]
            }
        ]
    }
});
