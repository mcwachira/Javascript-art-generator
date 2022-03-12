//using file system module 
const fs = require('fs');

//The process.argv property returns an array containing the command-line arguments passed when the Node.js process was launched.
// The first element will be execPath. See process.argv0 if access to the original value of argv[0] is needed.
// The second element will be the path to the JavaScript file being executed. 
//The remaining elements will be any additional command-line arguments.

const myAgs = process.argv.slice(2)
//importing our config.js
const { layers, width, height } = require('./input/config')

// adding canvas to our project
const { createCanvas, loadImage } = require('canvas');

const console = require('console');
const { json } = require('express/lib/response');
//defining size of our canvas (width and height)
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d')


const edition = myAgs.length > 0 ? Number(myAgs[0]) : 1;

let metadata = [];
let attributes = [];
let hash = [];
let decodedHash = [];

//writing our image on the file system
const saveLayer = (_canvas, _edition) => {
    fs.writeFileSync(`./output/${_edition}.png`, _canvas.toBuffer('image/png'))
    // console.log('this image is done well')
}

//function for adding our meta data

const addMetaData = (_edition) => {
    let dateTime = Date.now();
    let tempMetaData = {
        hash: hash.join(''),
        decodedHash: decodedHash,
        edition: _edition,
        date: dateTime,
        attributes: attributes,
    };
    metadata.push(tempMetaData);
    attributes = [];
    hash = [];
    decodedHash = [];
}


//add our attributes function

const addAttributes = (_element, _layer) => {
    let tempAttr = {
        id: _element.id,
        layer: _layer.name,
        name: _element.name,
        rarity: _element.rarity

    };
    attributes.push(tempAttr);
    hash.push(_layer.id);
    hash.push(_element.id);
    decodedHash.push({ [_layer.id]: _element.id })
}
// drawing our image on a canvas
const drawLayer = async (_layer, _edition) => {
    let element = _layer.elements[Math.floor(Math.random() * _layer.elements.length)];
    addAttributes(element, _layer)
    const image = await loadImage(`${_layer.location}${element.fileName}`);
    ctx.drawImage(
        image,
        _layer.position.x,
        _layer.position.y,
        _layer.size.width,
        _layer.size.height
    );
    // console.log(`I created the ${_layer.name} layer and choose the element ${element.name}`)
    saveLayer(canvas, _edition);
}


for (let i = 1; i <= edition; i++) {
    layers.forEach((layer) => {
        drawLayer(layer, i)
        addMetaData(i)
    });
}

fs.readFile('./output/_metadata.json', (err, data) => {
    if (err) throw err;
    fs.writeFileSync('./output/_metadata.json', JSON.stringify(metadata))
})