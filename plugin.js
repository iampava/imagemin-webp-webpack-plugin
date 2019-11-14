const imagemin = require('imagemin');
const webp = require('imagemin-webp');

const GREEN = '\x1b[32m%s\x1b[0m';
const RED = '\x1b[31m%s\x1b[0m';

class ImageminWebpWebpackPlugin {
    constructor({
        config = [
            {
                test: /\.(jpe?g|png)/,
                options: {
                    quality: 75
                }
            }
        ],
        overrideExtension = true,
        detailedLogs = false,
        strict = true,
        silent = false
    } = {}) {
        this.config = config;
        this.detailedLogs = detailedLogs;
        this.strict = strict;
        this.overrideExtension = overrideExtension;
        this.silent = silent;
    }

    apply(compiler) {
        const onEmit = (compilation, cb) => {
            let assetNames = Object.keys(compilation.assets);
            let nrOfImagesFailed = 0;

            if (this.silent && this.detailedLogs) {
                compilation.warnings.push(new Error(`ImageminWebpWebpackPlugin: both the 'silent' and 'detailedLogs' options are true. Overriding 'detailedLogs' and disabling all console output.`));
            }

            Promise.all(
                assetNames.map(name => {
                    for (let i = 0; i < this.config.length; i++) {
                        if (this.config[i].test.test(name)) {
                            let outputName = name;
                            if (this.overrideExtension) {
                                outputName = outputName
                                    .split('.')
                                    .slice(0, -1)
                                    .join('.');
                            }
                            outputName = `${outputName}.webp`;

                            let currentAsset = compilation.assets[name];

                            return imagemin
                                .buffer(currentAsset.source(), {
                                    plugins: [webp(this.config[i].options)]
                                })
                                .then(buffer => {
                                    let savedKB = (currentAsset.size() - buffer.length) / 1000;

                                    if (this.detailedLogs && !this.silent) {
                                        console.log(GREEN, `${savedKB.toFixed(1)} KB saved from '${name}'`);
                                    }
                                    compilation.assets[outputName] = {
                                        source: () => buffer,
                                        size: () => buffer.length
                                    };

                                    return savedKB;
                                })
                                .catch(err => {
                                    let customErr = new Error(`ImageminWebpWebpackPlugin: "${name}" wasn't converted!`);

                                    nrOfImagesFailed++;

                                    if (this.strict) {
                                        compilation.errors.push(err, customErr);
                                    } else if (this.detailedLogs) {
                                        compilation.warnings.push(err, customErr);
                                    }

                                    return 0;
                                });
                        }
                    }
                    return Promise.resolve(0);
                })
            ).then(savedKBArr => {
                if (!this.silent) {
                    let totalKBSaved = savedKBArr.reduce((acc, cur) => acc + cur, 0);

                    if (totalKBSaved < 100) {
                        console.log(GREEN, `imagemin-webp-webpack-plugin: ${Math.floor(totalKBSaved)} KB saved`);
                    } else {
                        console.log(GREEN, `imagemin-webp-webpack-plugin: ${Math.floor(totalKBSaved / 100) / 10} MB saved`);
                    }

                    if (nrOfImagesFailed > 0) {
                        console.log(RED, `imagemin-webp-webpack-plugin: ${nrOfImagesFailed} images failed to convert to webp`);
                    }
                }

                cb();
            });
        };

        if (compiler.hooks) {
            // webpack 4.x
            compiler.hooks.emit.tapAsync('ImageminWebpWebpackPlugin', onEmit);
        } else {
            // older versions
            compiler.plugin('emit', onEmit);
        }
    }
}

module.exports = ImageminWebpWebpackPlugin;
