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

let metadataList = [];
let attributesList = [];
let dnaList = [];

//writing our image on the file system
const saveImage = (_editionCount) => {
    fs.writeFileSync(`./output/${_editionCount}.png`, canvas.toBuffer('image/png'))
    // console.log('this image is done well')
}

//function for adding our meta data

const addMetaData = (_dna, _edition) => {
    let dateTime = Date.now();
    let tempMetaData = {
        dna: _dna,
        edition: _edition,
        date: dateTime,
        attributes: attributesList,
    };
    metadataList.push(tempMetaData);
    dnaList.push(_dna);
    attributesList = [];
}


//add our attributes function

const addAttributes = (_element) => {
    let selectedElement = _element.layer.selectedElement;
    attributesList.push({
        name: selectedElement.name,
        rarity: selectedElement.rarity,
    })
}
// drawing our image on a canvas
const loadLayerImg = async (_layer) => {
    return new Promise(async (resolve) => {
        const image = await loadImage(
            `${_layer.location}${_layer.selectedElement.fileName}`
        );
        resolve({
            layer: _layer,
            loadedImage: image,
        })
    })



    // console.log(`I created the ${_layer.name} layer and choose the element ${element.name}`)
    saveLayer(canvas, _edition);
}


const drawElement = (_element) => {
    ctx.drawImage(
        _element.loadedImage,
        _element.layer.position.x,
        _element.layer.position.y,
        _element.layer.size.width,
        _element.layer.size.height
    );
    addAttributes(_element)
}

const constructToDna = (_dna, _layers) => {

    let DnaSegment = _dna.toString().match(/.{1,2}/g)
    let mappedDnaToLayers = _layers.map((layer) => {

        let selectedElement = layer.elements[parseInt(DnaSegment) % layer.elements.length]
        return {

            location: layer.location,
            position: layer.position,
            size: layer.size,
            selectedElement: selectedElement

        }
    })

    return mappedDnaToLayers;

}

const isDnaUnique = (dnaList = [], _dna) => {
    let foundDna = dnaList.find((i) => i === _dna);
    return foundDna === undefined ? true : false;

}
const createdDna = (_len) => {
    let randNumber = Math.floor(Number(`1e${_len} `) + Math.random() * Number(`9e${_len} `))
    return randNumber
}
const writeMetaData = (_data) => {
    fs.writeFileSync('./output/_metadata.json', _data)
}

const startCreating = () => {
    writeMetaData("");
    let editionCount = 1;
    while (editionCount <= editionSize) {

        let newDna = createdDna(layers.length * 2 - 1)
        console.log(`DNA List  ${dnaList} `)

        if (isDnaUnique(dnaList, newDna)) {
            console.log(`Created ${newDna} `)
            let results = constructToDna(newDna, layers)
            let loadedElements = [];  //promise array

            results.forEach((layer) => {
                loadedElements.push(loadLayerImg(layer))
            })

            Promise.all(loadedElements).then(elementArray => {
                elementArray.forEach(element => {
                    drawElement(element)
                })
                saveImage(editionCount)
                addMetaData(newDna, editionCount)
                console.log(`Created edition:${editionCount} with dna : ${newDna}`)
            })

            editionCount++
        } else {
            console.log('dna exist')

        }

        // });
    }

    writeMetaData(JSON.stringify(metadataList));
};

startCreating();

