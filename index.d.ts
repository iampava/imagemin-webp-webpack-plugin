import { Options as WebpOptions } from 'imagemin-webp';

export type WebpConfig = {
    test: RegExp
    options: WebpOptions
}

export type ImageminWebpWebpackPluginOptions = {
    config?: WebpConfig[];
    overrideExtension?: boolean;
    detailedLogs?: boolean;
    silent?: boolean;
    strict?: boolean;
}

export class ImageminWebpWebpackPlugin {
    public constructor(options?: ImageminWebpWebpackPluginOptions);

    public apply(...args: any[]): void;
}

export default ImageminWebpWebpackPlugin;
