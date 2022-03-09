//using file system module 
const fs = require('fs');

// adding canvas to our project
const { createCanvas, loadImage } = require('canvas');


//defining size of our canvas (width and height)
const canvas = createCanvas(1000, 1000);
const ctx = canvas.getContext('2d')

//writing our image on the file system
const saveLayer = (_canvas) => {
    fs.writeFileSync('./newImage.png', _canvas.toBuffer('image/png'))
    console.log('this image is done well')
}

// drawing our image on a canvas
const drawLayer = async () => {
    const image = await loadImage('./flowers.png');
    ctx.drawImage(image, 0, 0, 1000, 1000);
    console.log('image is drawn')
    saveLayer(canvas);
}

drawLayer();