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


const editionSize = myAgs.length > 0 ? Number(myAgs[0]) : 1;

let metadata = [];
let attributes = [];
let hash = [];
let decodedHash = [];
let dnaList = [];

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
const loadLayerImage = async (_layer) => {


    const image = await loadImage(`${_layer.location}${element.fileName}`);

    // console.log(`I created the ${_layer.name} layer and choose the element ${element.name}`)
    saveLayer(canvas, _edition);
}


const drawElement = (_element) => {
    ctx.drawImage(
        image,
        _layer.position.x,
        _layer.position.y,
        _layer.size.width,
        _layer.size.height
    );
    addAttributes(_element)
}


const isDnaUnique = (dnaList = [], _dna) => {
    let foundDna = dnaList.find((i) => i === _dna);
    return foundDna === undefined ? true : false;

}
const createdDna = (_len) => {
    let randNumber = Math.floor(Number(`1e${_len}`) + Math.random() * Number(`9e${_len}`))
    return randNumber
}
const writeMetaData = () => {
    fs.writeFileSync('./output/_metadata.json', JSON.stringify(metadata))
}

const startCreating = () => {
    let editionCount = 1;
    while (editionCount <= editionSize) {

        let newDna = createdDna(layers.length * 2 - 1)
        console.log(`DNA List  ${dnaList}`)
        if (isDnaUnique(dnaList, newDna)) {
            console.log(`Created ${newDna}`)
            // layers.forEach((layer) => {
            //     drawLayer(layer, i)
            //     addMetaData(i)

            dnaList.push(newDna);
            editionCount++
        } else {
            console.log('dna exist')

        }

        // });




    }

};

startCreating();

writeMetaData();