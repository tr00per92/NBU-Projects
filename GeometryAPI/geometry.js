(function () {
    'use strict';

    var ctx = document.getElementById('myCanvas').getContext('2d'),
        shapeSelector = document.getElementById('shapeSelector'),
        addButton = document.getElementById('addButton'),
        clearButton = document.getElementById('clearButton'),
        saveButton = document.getElementById('saveButton'),
        restoreButton = document.getElementById('restoreButton'),
        exportButton = document.getElementById('exportButton'),
        attributesDiv = document.getElementById('shapeAttributes'),
        xInput = document.getElementById('x'),
        yInput = document.getElementById('y'),
        colorInput = document.getElementById('color'),
        canvasState = new CanvasState(ctx);

    var restoreShapes = function () {
        if (localStorage['shapes']) {
            canvasState.clearShapes();
            JSON.parse(localStorage['shapes']).forEach(function (shape) {
                canvasState.addShape(Shapes.FromJSON(shape, ctx));
            });
        }
    };

    shapeSelector.addEventListener('change', function () {
        var shape = shapeSelector.options[shapeSelector.selectedIndex].value;
        switch (shape) {
            case 'circle':
                attributesDiv.innerHTML =
                    '<label for="r">Radius: </label><input type="number" min="0" max="400" id="r"/>';
                break;
            case 'rectangle':
                attributesDiv.innerHTML =
                    '<label for="width">Width: </label><input type="number" min="0" max="550" id="width"/>' +
                    '<label for="height">Height: </label><input type="number" min="0" max="400" id="height"/>';
                break;
            case 'triangle':
                attributesDiv.innerHTML =
                    '<label for="x2">X2: </label><input type="number" min="0" max="550" id="x2"/>' +
                    '<label for="y2">Y2: </label><input type="number" min="0" max="400" id="y2"/><br>' +
                    '<label for="x3">X3: </label><input type="number" min="0" max="550" id="x3"/>' +
                    '<label for="y3">Y3: </label><input type="number" min="0" max="400" id="y3"/>';
                break;
            case 'segment':
                attributesDiv.innerHTML =
                    '<label for="x2">X2: </label><input type="number" min="0" max="550" id="x2"/>' +
                    '<label for="y2">Y2: </label><input type="number" min="0" max="400" id="y2"/>';
                break;
            default:
                attributesDiv.innerHTML = '';
                break;
        }
    });

    addButton.addEventListener('click', function () {
        var shape = shapeSelector.options[shapeSelector.selectedIndex].value,
            x = Number(xInput.value),
            y = Number(yInput.value),
            color = colorInput.value,
            currentShape, x1, y1, x2, y2;

        switch (shape) {
            case 'circle':
                x1 = Number(document.getElementById('r').value);
                currentShape = new Shapes.Circle(ctx, x, y, color, x1);
                break;
            case 'rectangle':
                x1 = Number(document.getElementById('width').value);
                x2 = Number(document.getElementById('height').value);
                currentShape = new Shapes.Rectangle(ctx, x, y, color, x1, x2);
                break;
            case 'triangle':
                x1 = Number(document.getElementById('x2').value);
                y1 = Number(document.getElementById('y2').value);
                x2 = Number(document.getElementById('x3').value);
                y2 = Number(document.getElementById('y3').value);
                currentShape = new Shapes.Triangle(ctx, x, y, color, x1, y1, x2, y2);
                break;
            case 'segment':
                x1 = Number(document.getElementById('x2').value);
                y1 = Number(document.getElementById('y2').value);
                currentShape = new Shapes.Segment(ctx, x, y, color, x1, y1);
                break;
            case 'point':
                currentShape = new Shapes.Point(ctx, x, y, color);
                break;
            default:
                break;
        }

        canvasState.addShape(currentShape);
    });

    exportButton.addEventListener('click', function () {
        this.href = ctx.canvas.toDataURL('image/png');
    }, false);

    saveButton.addEventListener('click', function () {
        localStorage['shapes'] = JSON.stringify(canvasState.getShapes());
    });

    clearButton.addEventListener('click', function () {
        canvasState.clearShapes();
    });

    restoreButton.addEventListener('click', restoreShapes);

    restoreShapes();
})();
