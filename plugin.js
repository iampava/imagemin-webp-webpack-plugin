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
        detailedLogs = false,
        strict = true
    } = {}) {
        this.config = config;
        this.detailedLogs = detailedLogs;
        this.strict = strict;
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('ImageminWebpWebpackPlugin', (compilation, cb) => {
            let assetNames = Object.keys(compilation.assets);
            let path = compilation.options.output.path;
            let nrOfImagesFailed = 0;

            Promise.all(assetNames.map(name => {
                for (let i = 0; i < this.config.length; i++) {
                    if (this.config[i].test.test(name)) {
                        let outputFolder = name
                            .split('/')
                            .slice(0, -1)
                            .join('/');

                        return imagemin([`${path}/${name}`], `${path}/${outputFolder}`, {
                            plugins: [webp(this.config[i].options)]
                        }).then(resp => {
                            let path = resp[0].path;
                            if (path.indexOf(".webp") === path.length - 5 && path.length >= 5) {
                                let stats = fs.statSync(path);
                                let savedKB = Math.round((compilation.assets[name].size() - stats.size) / 1000);

                                if (this.detailedLogs) {
                                    console.log('\x1b[32m%s\x1b[0m', `${savedKB} KB saved from ${path}`);
                                }

                                return savedKB;
                            } else {
                                throw new Error(`ImageminWebpWebpackPlugin: "${name}" wasn't converted, most likely because the conversion would result in a bigger file!`);
                            }
                        }).catch(err => {
                            nrOfImagesFailed++;

                            if (this.strict) {
                                compilation.errors.push(err);
                            } else if (this.detailedLogs) {
                                compilation.warnings.push(err);
                            }

                            return 0;
                        });
                    }
                }
                return Promise.resolve(0);
            })).then(savedKBArr => {
                let totalKBSaved = savedKBArr.reduce((acc, cur) => acc + cur, 0);

                console.log(
                    '\x1b[32m%s\x1b[0m',
                    `imagemin-webp-webpack-plugin: ${Math.floor(totalKBSaved / 100) / 10} MB saved`
                );
                if (nrOfImagesFailed > 0) {
                    console.log(
                        '\x1b[31m%s\x1b[0m',
                        `imagemin-webp-webpack-plugin: ${nrOfImagesFailed} images failed to convert to webp`
                    );
                }
                cb();
            });
        });
    }
}

module.exports = ImageminWebpWebpackPlugin;