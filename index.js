// jshint esversion: 6

const Jimp = require('jimp');
const inkyphat = require('inkyphat').getInstance();

const PALETTE = {
    WHITE: 0xffffffff,
    BLACK: 0x000000ff,
    RED: 0xff0000ff
};

console.log('Downloading Image...');
Jimp.read(
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/9f/9faea87fb8a60a831a97fda9dd5c6f6bd73a7fb6_full.jpg'
).then(function(image) {
    console.log('Image Downloaded');
    image.cover(
        inkyphat.getWidth(),
        inkyphat.getHeight(),
        Jimp.VERTICAL_ALIGN_TOP
    );
    // processColor(image, 60);
    processColor(image, 64);
    // writeToFile(image, 'test-image');
    outputToDisplay(image);
});

function outputToDisplay(img) {
    inkyphat
        .init()
        .then(function() {
            // Set Background to White
            inkyphat.drawRect(
                0,
                0,
                inkyphat.getWidth(),
                inkyphat.getHeight(),
                inkyphat.WHITE
            );
            for (let y = 0; y < img.bitmap.height; y++) {
                for (let x = 0; x < img.bitmap.width; x++) {
                    // get color of current cord
                    color = img.getPixelColor(x, y);

                    // mirror the y axis
                    y = Math.abs(y - img.bitmap.height);
                    if (color === PALETTE.RED) {
                        inkyphat.setPixel(x, y, inkyphat.RED);
                    } else if (color === PALETTE.BLACK) {
                        inkyphat.setPixel(x, y, inkyphat.BLACK);
                    } else if (color === PALETTE.WHITE) {
                        inkyphat.setPixel(x, y, inkyphat.WHITE);
                    } else {
                        inkyphat.setPixel(x, y, inkyphat.WHITE);
                    }
                }
            }
            inkyphat.redraw();
        })
        .then(function() {
            // Screen has refreshed.
        });
}

function processColor(image, threshold = 64) {
    console.log('Processing Image...');
    image.background(0xffffffff);
    for (let y = 0; y < image.bitmap.height; y++) {
        for (let x = 0; x < image.bitmap.width; x++) {
            rgba = Jimp.intToRGBA(image.getPixelColor(x, y));
            // determine if should be black or white
            let averageLightness = (rgba.r + rgba.g + rgba.b) / 3;
            if (averageLightness <= threshold) {
                // Handle Color Pixels
                if (rgba.r > rgba.g && rgba.r > rgba.b) {
                    image.setPixelColor(PALETTE.RED, x, y);
                } else {
                    image.setPixelColor(PALETTE.BLACK, x, y);
                }
            } else {
                // Handle White Pixels
                image.setPixelColor(PALETTE.WHITE, x, y);
            }
        }
    }
    console.log('Image Processed');
}

function writeToFile(image, name) {
    let file = name + '.' + image.getExtension();
    image.write(file);
}
