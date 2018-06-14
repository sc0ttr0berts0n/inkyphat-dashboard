// jshint esversion: 6

const Jimp = require('jimp');
const inkyphat = require('inkyphat').getInstance();

Jimp.read(
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/9f/9faea87fb8a60a831a97fda9dd5c6f6bd73a7fb6_full.jpg'
).then(function(image) {
    image.cover(256, 256);
    processColor(image, 60);
    writeToFile(image, 'test-image');
});

function processColor(image, threshold = 64) {
    for (let y = 0; y < image.bitmap.height; y++) {
        let line = '';
        for (let x = 0; x < image.bitmap.width; x++) {
            rgba = Jimp.intToRGBA(image.getPixelColor(x, y));
            // determine if should be black or white
            let averageLightness = (rgba.r + rgba.g + rgba.b) / 3;
            if (averageLightness <= threshold) {
                // Handle Color Pixels
                if (rgba.r > rgba.g && rgba.r > rgba.b) {
                    image.setPixelColor(0xff0000ff, x, y);
                } else {
                    image.setPixelColor(0x000000ff, x, y);
                }
            } else {
                // Handle White Pixels
                image.setPixelColor(0xffffffff, x, y);
            }
        }
    }
}

function writeToFile(image, name) {
    let file = name + '.' + image.getExtension();
    image.write(file);
}
