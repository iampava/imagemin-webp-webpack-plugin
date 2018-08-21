  

# imagemin-webp-webpack-plugin

  

Webpack plugin which converts images to the [WebP](https://developers.google.com/speed/webp/) format while also keeping the original files.


It uses [imagemin](https://www.npmjs.com/package/imagemin) and [imagemin-webp](https://www.npmjs.com/package/imagemin-webp) under the hood.

  
  

## Motivation

  

Although WebP images are not currently supported in all browsers, they are at least 25% smaller than PNG's or JPEG's. So, certain users can get a much better experience.

Check the support tables on [Can I use](https://caniuse.com/#feat=webp)

  

## Installation

  

```bash

$ npm install imagemin-webp-webpack-plugin --save-dev

```

  

## Usage

  

In order to use this plugin, add it to your **webpack config**.

  

```js
const ImageminWebpWebpackPlugin= require("imagemin-web-webpack-plugin");

module.exports = {
    plugins: [new ImageminWebpWebpackPlugin()]
};
```

  
  

## API

  

### ```new ImageminWebpWebpackPlugin( [settings] );```

  

### settings

  

Type: `Object : {config: Array, detailedLogs: boolean}`<br/>

Default:

```
{
  config: [{
    test: /\.(jpe?g|png)$/,
    options: {
      quality:  75
    }
  }],
  detailedLogs: false
}
```

#### config
Type ```Array<Object: {test, options} >```


The main config of the plugin which controls how different file types are converted. Each item in the array is an object with 2 properties:

* **test** - a RegExp selecting just certain images
* **options** -the converting options for the images that pass the above RegExp

⚠ The **options** object is actually the same one from the [imagemin-webp](https://www.npmjs.com/package/imagemin-webp) plugin so check their documentation for the available settings.

#### detailedLogs

Type: `boolean`<br>
Default: `false`

By default the plugin will print the total number of megabytes saved by the webp images compared to the original ones.

This options tells the plugin to also log the size difference per converted image.

<hr/>

<p align="center"> Made with ❤ by <a href="https://iampava.com"> Pava </a></p>
