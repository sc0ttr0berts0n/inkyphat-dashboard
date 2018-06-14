// jshint esversion: 6

var Jimp = require('jimp');
var chalk = require('chalk');

Jimp.read(
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/9f/9faea87fb8a60a831a97fda9dd5c6f6bd73a7fb6_full.jpg'
).then(function(image) {
    image.cover(32, 32);
    for (let y = 0; y < 32; y++) {
        let line = '';
        for (let x = 0; x < 32; x++) {
            rgba = Jimp.intToRGBA(image.getPixelColor(x, y));
            line += chalk.bgRgb(rgba.r, rgba.g, rgba.b)('  ');
        }
        console.log(line);
        line = '';
    }
});
