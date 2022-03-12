//using file system module 
const fs = require('fs');
// adding canvas to our project
const { createCanvas, loadImage } = require('canvas');
const console = require('console')
//defining size of our canvas (width and height)
const canvas = createCanvas(1000, 1000);
const ctx = canvas.getContext('2d')

const { layers, width, height } = require('./input/config')
const edition = 10;


//writing our image on the file system
const saveLayer = (_canvas, _edition) => {
    fs.writeFileSync(`./output/${_edition}.png`, _canvas.toBuffer('image/png'))
    console.log('this image is done well')
}

// drawing our image on a canvas
const drawLayer = async (_layer, _edition) => {
    let element = _layer.elements[Math.floor(Math.random() * _layer.elements.length)];
    const image = await loadImage(`${_layer.location}${element.fileName}`);
    ctx.drawImage(
        image,
        _layer.position.x,
        _layer.position.y,
        _layer.size.width,
        _layer.size.height
    );
    console.log(`I created the ${_layer.name} layer and choose the element ${element.name}`)
    saveLayer(canvas, _edition);
}


for (let i = 1; i <= edition; i++) {
    layers.forEach((layer) => {
        drawLayer(layer, i)
    });
}
