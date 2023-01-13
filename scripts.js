'use strict';

const app = {
    width: 847,
    height: 734,
    segments: 4,
    segLimit: 100,
    canvas: document.getElementById('canvas'),
    fillColor: 'rgba(0,0,205,1)',
    triType: 0,
    triIndex: 0,
    sumTotal: 27
};

const main = () => {
    adjustColor();
    updatePage();
}

const updatePage = () => {
    clearCanvas();
    markActive();
    drawTriangles();
    showResults();
}

const clearCanvas = () => {
    app.canvas.width = app.width;
    app.canvas.height = app.height;
}

const markActive = () => {
    let upsideDown = app.triType >= app.segments;
    let diff = upsideDown && app.segments % 2 !== 0 ? 0.5 : 0;
    let triSize = upsideDown ? 
        app.segments * 1.5 - app.triType - diff :
        app.segments - app.triType;
    let row = 0;
    let place = 0;
    let rowWidth = upsideDown ? app.segments - 1 : app.segments;
    let index = app.triIndex;

    for (let i = 0; i < rowWidth; i++) {
        if (index > i) {
            index -= (i + 1);
            ++row;
        } else {
            place = index;
        }
    }

    let segmentWidth = app.width / app.segments;
    let segmentHeight = app.height / app.segments;

    let topX = (app.segments - row) * segmentWidth / 2 + place * segmentWidth;
    let leftX = topX - triSize * (segmentWidth / 2);
    let rightX = topX + triSize * (segmentWidth / 2);
    let topY = upsideDown ? 
        row * segmentHeight + 2 * segmentHeight * triSize : 
        row * segmentHeight;
    let bottomY = upsideDown ? 
        topY - triSize * segmentHeight : 
        topY + triSize * segmentHeight;

    let ctx = app.canvas.getContext('2d');
    ctx.moveTo(topX, topY);
    ctx.lineTo(rightX, bottomY);
    ctx.lineTo(leftX, bottomY);
    ctx.lineTo(topX, topY);
    ctx.fillStyle = app.fillColor;
    ctx.fill();
}

const drawTriangles = () => {
    let ctx = app.canvas.getContext('2d');
    let segmentWidth = app.width / app.segments;
    let segmentHeight = app.height / app.segments;
    
    for (let i = 0; i < app.segments; i++) {
        ctx.moveTo(Math.floor(segmentWidth * (0.5 * i)), Math.floor(app.height - (segmentHeight * i)));
        ctx.lineTo(Math.floor(app.width - segmentWidth * (0.5 * i)), Math.floor(app.height - (segmentHeight * i)));
        ctx.moveTo(Math.floor(segmentWidth * i), Math.floor(app.height));
        ctx.lineTo(Math.floor((app.width / 2) + (segmentWidth * 0.5 * i)), Math.floor(segmentHeight * i));
        ctx.moveTo(app.width - (segmentWidth * i), app.height);
        ctx.lineTo((app.width / 2) - (segmentWidth * 0.5 * i), segmentHeight * i);
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
}

const showResults = () => {
    let explRow2 = document.getElementById('explRow2');
    let oldExp = document.getElementById('explanation');
    oldExp.remove();
    let newExp = document.createElement('select');
    newExp.id = 'explanation';
    newExp.className = "explDropdown";
    newExp.onchange = setTriType();
    explRow2.appendChild(newExp);
    let total = 0;

    for (let i = 0; i < Math.floor(app.segments * 1.5); i++) {
        let count = 0;
        if (i < app.segments) {
            for (let j = 0; j < (i + 1); j++) {
                count += (j + 1);
            }
        } else  {
            let index = app.segments % 2 === 0 ? 2 * (i - app.segments) + 1 : 2 * (i - app.segments) + 2;
            for (let j = 0; j < index; j++) {
                count += (j + 1);
            }
        }

        total += count;
        let newElem = document.createElement('option');
        newElem.innerText = 'Type ' + (i+1);
        newElem.value = i;
        newExp.appendChild(newElem);

        if (i === app.triType) {
            let explTxt = document.getElementById('explTxt');
            explTxt.value = (app.triIndex + 1) + ' / ' + count;
        }
    }

    newExp.value = app.triType;
    document.getElementById('textSeg').value = app.segments;
    document.getElementById('overlay-no').innerText = total;
    app.sumTotal = total;
}

const adjustColor = () => {
    let inRed = document.getElementById('redRange').value;
    let inGreen = document.getElementById('greenRange').value;
    let inBlue = document.getElementById('blueRange').value;
    let inOpac = document.getElementById('opacRange').value / 10;
    app.fillColor = 'rgba(' + inRed + ',' + inGreen + ',' + inBlue + ',' + inOpac + ')';
    updatePage();
}

const changeSegment = (input) => {
    let value = 0;

    switch (input) {
        case 'plus': value = app.segments + 1; break;
        case 'mins': value = app.segments - 1; break;
        case 'text': value = parseInt(document.getElementById('textSeg').value); break;
    }

    app.segments = typeof(value) == 'number' && value > 0 && value <= app.segLimit ? value : app.segments;
    app.triType = 0;
    app.triIndex = 0;
    updatePage();
}

const setTriIndex = (input) => {
    let explTxt = document.getElementById('explTxt').value;
    let max = parseInt(explTxt.split('/ ')[1] - 1);
    let value = input === 'plus' ? app.triIndex + 1 : app.triIndex - 1;
    app.triIndex = value >= 0 && value <= max ? value : app.triIndex;
    updatePage();
    document.getElementById('explTxt').value = (app.triIndex + 1) + ' / ' + (max + 1);
}

function setTriType () {
    return function (e) {
        e.preventDefault();
        let el = document.getElementById('explanation');
        let input = el != null ? el.value : null;
        app.triType = parseInt(input);
        app.triIndex = 0;
        updatePage();
    }
}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}