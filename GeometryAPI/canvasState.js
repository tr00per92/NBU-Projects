var CanvasState = (function () {
    'use strict';

    var shapesInfo = document.getElementById('shapesInfo');

    function CanvasState(ctx) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.shapes = [];
        this.selectedShape = null;
        this.valid = false;
        this.dragging = false;
        this.dragoffx = 0;
        this.dragoffy = 0;
        this.selectionColor = 'blue';
        this.interval = 40;

        var _this = this;

        this.canvas.addEventListener('selectstart', function (e) {
            e.preventDefault(); return false;
        }, false);

        this.canvas.addEventListener('mousedown', function (e) {
            var mouse = _this.getMouse(e),
                length = _this.shapes.length;

            for (var i = 0; i < length; i++) {
                if (_this.shapes[i].contains( mouse.x, mouse.y)) {
                    _this.dragoffx =  mouse.x - _this.shapes[i]._x;
                    _this.dragoffy = mouse.y - _this.shapes[i]._y;
                    _this.selectedShape = _this.shapes[i];
                    _this.dragging = true;
                    _this.valid = false;

                    return;
                }
            }

            if (_this.selectedShape) {
                _this.selectedShape = null;
                _this.valid = false;
            }
        });

        this.canvas.addEventListener('mousemove', function(e) {
            if (_this.dragging){
                var mouse = _this.getMouse(e),
                    x = mouse.x - _this.dragoffx,
                    y = mouse.y - _this.dragoffy;

                _this.selectedShape.move(x, y);
                _this.valid = false;
            }
        });

        this.canvas.addEventListener('mouseup', function () {
            _this.dragging = false;
        });

        setInterval(function () {
            _this.draw();
        }, this.interval);
    }

    CanvasState.prototype.draw = function () {
        if (!this.valid) {
            var _this = this;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            shapesInfo.innerHTML = '';

            this.shapes.forEach(function (shape, index) {
                var deleteBtn = document.createElement('button'),
                    infoText = document.createElement('div');

                deleteBtn.type = 'button';
                deleteBtn.innerText = '-';
                deleteBtn.addEventListener('click', function () {
                    _this.removeShape(index);
                });

                infoText.innerText = shape.toString() + ' ';
                infoText.appendChild(deleteBtn);
                shapesInfo.appendChild(infoText);

                shape.draw();
            });

            if (this.selectedShape) {
                this.selectedShape.drawContour(this.selectionColor);
            }

            this.valid = true;
        }
    };

    CanvasState.prototype.getShapes = function () {
        return this.shapes;
    };

    CanvasState.prototype.addShape = function (shape) {
        this.shapes.push(shape);
        this.valid = false;
    };

    CanvasState.prototype.removeShape = function (shapeId) {
        this.shapes.splice(shapeId, 1);
        this.valid = false;
    };

    CanvasState.prototype.clearShapes = function () {
        this.shapes.length = 0;
        this.valid = false;
        this.selectedShape = null;
    };

    CanvasState.prototype.getMouse = function (e) {
        var element = this.canvas,
            offsetX = 12,
            offsetY = 11;

        if (element.offsetParent !== undefined) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while (element = element.offsetParent);
        }

        return {
            x: e.pageX - offsetX,
            y: e.pageY - offsetY
        };
    };

    return CanvasState;
})();
