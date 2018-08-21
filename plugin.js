const imagemin = require('imagemin');
const webp = require('imagemin-webp');
const fs = require('fs');

class ImageminWebpWebpackPlugin {
    constructor({
        config = [{
            test: /\.(jpe?g|png)$/,
            options: {
                quality: 75
            }
        }],
        detailedLogs = false
    } = {}) {
        this.config = config;
        this.detailedLogs = detailedLogs;
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('ImageminWebpWebpackPlugin', (compilation, cb) => {
            let assetNames = Object.keys(compilation.assets);
            let path = compilation.options.output.path;

            Promise.all(
                assetNames.map(
                    name =>
                    new Promise(resolve => {
                        for (let i = 0; i < this.config.length; i++) {
                            if (this.config[i].test.test(name)) {
                                let outputFolder = name
                                    .split('/')
                                    .slice(0, -1)
                                    .join('/');

                                imagemin([`${path}/${name}`], outputFolder, {
                                    plugins: [webp(this.config[i].options)]
                                }).then(([{
                                    data,
                                    path
                                }]) => {
                                    let stats = fs.statSync(path);
                                    let savedKB = Math.round((compilation.assets[name].size() - stats.size) / 1000);

                                    if (this.detailedLogs) {
                                        console.log('\x1b[32m%s\x1b[0m', `${savedKB} KB saved from ${path}`);
                                    }
                                    resolve(savedKB);
                                });
                                return true;
                            }
                        }
                        resolve(0);
                    })
                )
            ).then(savedKB => {
                let totalKBSaved = savedKB.reduce((acc, cur) => acc + cur, 0);
                console.log(
                    '\x1b[32m%s\x1b[0m',
                    `imagemin-webp-webpack-plugin: ${Math.floor(totalKBSaved / 100) / 10} MB saved`
                );
            });
            cb();
        });
    }
}

module.exports = ImageminWebpWebpackPlugin;