var Shapes = (function () {
    'use strict';

    Object.prototype.inherits = function(parent) {
        this.prototype = Object.create(parent.prototype);
        this.prototype.constructor = this;
    };

    var Shape = (function () {
        function Shape(ctx, x, y, color) {
            this.setCtx(ctx);
            this.setX(x);
            this.setY(y);
            this.setColor(color);
        }

        Shape.prototype._type = 'Shape';

        Shape.prototype.getType = function() {
            return this._type;
        };

        Shape.prototype.getCtx = function() {
            return this._ctx;
        };

        Shape.prototype.setCtx = function(ctx) {
            if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) {
                throw new Error('Invalid canvas context');
            }

            this._ctx = ctx;
        };

        Shape.prototype.getX = function() {
            return this._x;
        };

        Shape.prototype.setX = function(x) {
            if (typeof(x) != 'number') {
                throw new Error('X must be a number');
            }

            this._x = x;
        };

        Shape.prototype.getY = function() {
            return this._y;
        };

        Shape.prototype.setY = function(y) {
            if (typeof(y) != 'number') {
                throw new Error('Y must be a number');
            }

            this._y = y;
        };

        Shape.prototype.getColor = function() {
            return this._color;
        };

        Shape.prototype.setColor = function(color) {
            if (!color || !color.match(/\b[0-9a-fA-F]{6}\b/g)) {
                throw new Error('You must enter a color in hexadecimal format');
            }

            this._color = color;
        };
        
        Shape.prototype.toString = function () {
            return this._type + ' - X: ' + this._x + ', Y: ' + this._y + ', Color: ' + this._color.toUpperCase();
        };

        Shape.prototype.getJsonProperties = function () {
            return ['type', 'color', 'x', 'y'];
        };

        Shape.prototype.toJSON = function () {
            var _this = this,
                jsonObject = {};

            this.getJsonProperties().forEach(function (prop) {
                jsonObject[prop] = _this['_' + prop];
            });

            return JSON.stringify(jsonObject);
        };

        Shape.prototype.move = function (newX, newY) {
            this.setX(newX);
            this.setY(newY);
        };
        
        return Shape;
    }());
    
    var Circle = (function () {
        function Circle(ctx, x, y, color, radius) {
            Shape.apply(this, arguments);
            this.setRadius(radius);
        }

        Circle.inherits(Shape);

        Circle.prototype._type = 'Circle';

        Circle.prototype.getRadius = function() {
            return this._radius;
        };

        Circle.prototype.setRadius = function(radius) {
            if (typeof(radius) != 'number' || radius <= 0) {
                throw new Error('The radius must be a positive number');
            }

            this._radius = radius;
        };

        Circle.prototype.draw = function () {
            this._ctx.beginPath();
            this._ctx.arc(this._x, this._y, this._radius, 0, 2 * Math.PI);
            this._ctx.fillStyle = this._color;
            this._ctx.fill();
        };

        Circle.prototype.drawContour = function (color) {
            this._ctx.beginPath();
            this._ctx.arc(this._x, this._y, this._radius, 0, 2 * Math.PI);
            this._ctx.strokeStyle = color;
            this._ctx.lineWidth = 3;
            this._ctx.stroke();
        };

        Circle.prototype.toString = function () {
            return Shape.prototype.toString.call(this) + ', Radius: ' + this._radius;
        };

        Circle.prototype.getJsonProperties = function () {
            return Shape.prototype.getJsonProperties.call(this).concat(['radius']);
        };

        Circle.prototype.contains = function (x, y) {
            return (x - this._x) * (x - this._x) + (y - this._y) * (y - this._y) <= this._radius * this._radius + 1;
        };
        
        return Circle;
    }());
    
    var Rectangle = (function () {
        function Rectangle(ctx, x, y, color, width, height) {
            Shape.apply(this, arguments);
            this.setWidth(width);
            this.setHeight(height);
        }
        
        Rectangle.inherits(Shape);

        Rectangle.prototype._type = 'Rectangle';

        Rectangle.prototype.getWidth = function() {
            return this._width;
        };

        Rectangle.prototype.setWidth = function(width) {
            if (typeof(width) != 'number' || width <= 0) {
                throw new Error('The width must be a positive number');
            }

            this._width = width;
        };

        Rectangle.prototype.getHeight = function() {
            return this._height;
        };

        Rectangle.prototype.setHeight = function(height) {
            if (typeof(height) != 'number' || height <= 0) {
                throw new Error('The height must be a positive number');
            }

            this._height = height;
        };
        
        Rectangle.prototype.draw = function () {
            this._ctx.beginPath();
            this._ctx.fillStyle = this._color;
            this._ctx.fillRect(this._x, this._y, this._width, this._height);
        };

        Rectangle.prototype.drawContour = function (color) {
            this._ctx.beginPath();
            this._ctx.strokeStyle = color;
            this._ctx.lineWidth = 3;
            this._ctx.strokeRect(this._x, this._y, this._width, this._height);
        };

        Rectangle.prototype.toString = function () {
            return Shape.prototype.toString.call(this) + ', Width: ' + this._width + ', Height: ' + this._height;
        };

        Rectangle.prototype.getJsonProperties = function () {
            return Shape.prototype.getJsonProperties.call(this).concat(['width', 'height']);
        };

        Rectangle.prototype.contains = function (x, y) {
            return x >= this._x && y >= this._y && x <= this._x + this._width && y <= this._y + this._height;
        };

        return Rectangle;
    }());
    
    var Triangle = (function () {
        function Triangle(ctx, x, y, color, x2, y2, x3, y3) {
            Shape.apply(this, arguments);
            this.setX2(x2);
            this.setY2(y2);
            this.setX3(x3);
            this.setY3(y3);
        }

        Triangle.inherits(Shape);

        Triangle.prototype._type = 'Triangle';

        Triangle.prototype.getX2 = function() {
            return this._x2;
        };

        Triangle.prototype.setX2 = function(x2) {
            if (typeof(x2) != 'number') {
                throw new Error('X2 must be a number');
            }

            this._x2 = x2;
        };

        Triangle.prototype.getY2 = function() {
            return this._y2;
        };

        Triangle.prototype.setY2 = function(y2) {
            if (typeof(y2) != 'number') {
                throw new Error('Y2 must be a number');
            }

            this._y2 = y2;
        };

        Triangle.prototype.getX3 = function() {
            return this._x3;
        };

        Triangle.prototype.setX3 = function(x3) {
            if (typeof(x3) != 'number') {
                throw new Error('X3 must be a number');
            }

            this._x3 = x3;
        };

        Triangle.prototype.getY3 = function() {
            return this._y3;
        };

        Triangle.prototype.setY3 = function(y3) {
            if (typeof(y3) != 'number') {
                throw new Error('Y3 must be a number');
            }

            this._y3 = y3;
        };

        Triangle.prototype.draw = function () {
            this._ctx.beginPath();
            this._ctx.moveTo(this._x, this._y);
            this._ctx.lineTo(this._x2, this._y2);
            this._ctx.lineTo(this._x3, this._y3);
            this._ctx.lineTo(this._x, this._y);
            this._ctx.fillStyle = this._color;
            this._ctx.fill();
        };

        Triangle.prototype.drawContour = function (color) {
            this._ctx.beginPath();
            this._ctx.lineWidth = 3;
            this._ctx.moveTo(this._x, this._y);
            this._ctx.lineTo(this._x2, this._y2);
            this._ctx.lineTo(this._x3, this._y3);
            this._ctx.lineTo(this._x, this._y);
            this._ctx.strokeStyle = color;
            this._ctx.stroke();
        };
        
        Triangle.prototype.toString = function () {
            return Shape.prototype.toString.call(this) + ', X2: ' + this._x2 + ', Y2: ' + this._y2 +
                ', X3: ' + this._x3 + ', Y3: ' + this._y3;
        };

        Triangle.prototype.getJsonProperties = function () {
            return Shape.prototype.getJsonProperties.call(this).concat(['x2', 'y2', 'x3', 'y3']);
        };

        Triangle.prototype.getSign = function (x1, y1, x2, y2, x3, y3) {
            return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
        };

        Triangle.prototype.contains = function (x, y) {
            var b1 = this.getSign(x, y, this._x, this._y, this._x2, this._y2) < 0,
                b2 = this.getSign(x, y, this._x2, this._y2, this._x3, this._y3) < 0,
                b3 = this.getSign(x, y, this._x3, this._y3, this._x, this._y) < 0;

            return b1 === b2 && b2 === b3;
        };

        Triangle.prototype.move = function (newX, newY) {
            this.setX2(this._x2 - (this._x - newX));
            this.setY2(this._y2 - (this._y - newY));
            this.setX3(this._x3 - (this._x - newX));
            this.setY3(this._y3 - (this._y - newY));
            this.setX(newX);
            this.setY(newY);
        };
        
        return Triangle;
    }());
    
    var Segment = (function () {
        function Segment(ctx, x, y, color, x2, y2) {
            Shape.apply(this, arguments);
            this.setX2(x2);
            this.setY2(y2);
        }

        Segment.inherits(Shape);

        Segment.prototype._type = 'Segment';

        Segment.prototype.getX2 = function() {
            return this._x2;
        };

        Segment.prototype.setX2 = function(x2) {
            if (typeof(x2) != 'number') {
                throw new Error('X2 must be a number');
            }

            this._x2 = x2;
        };

        Segment.prototype.getY2 = function() {
            return this._y2;
        };

        Segment.prototype.setY2 = function(y2) {
            if (typeof(y2) != 'number') {
                throw new Error('Y2 must be a number');
            }

            this._y2 = y2;
        };
        
        Segment.prototype.draw = function () {
            this._ctx.beginPath();
            this._ctx.moveTo(this._x, this._y);
            this._ctx.lineTo(this._x2, this._y2);
            this._ctx.strokeStyle = this._color;
            this._ctx.lineWidth = 2;
            this._ctx.stroke();
        };

        Segment.prototype.drawContour = function (color) {
            this._ctx.beginPath();
            this._ctx.strokeStyle = color;
            this._ctx.lineWidth = 3;
            this._ctx.moveTo(this._x, this._y);
            this._ctx.lineTo(this._x2, this._y2);
            this._ctx.stroke();
        };

        Segment.prototype.toString = function () {
            return Shape.prototype.toString.call(this) + ', X2: ' + this._x2 + ', Y2: ' + this._y2;
        };

        Segment.prototype.getJsonProperties = function () {
            return Shape.prototype.getJsonProperties.call(this).concat(['x2', 'y2']);
        };

        Segment.prototype.getDistance = function (x1, y1, x2, y2) {
            var xs = (x2 - x1) * (x2 - x1),
                ys = (y2 - y1) * (y2 - y1);

            return Math.sqrt(xs + ys);
        };

        Segment.prototype.contains = function (x, y) {
            var distSum = this.getDistance(this._x, this._y, x, y) + this.getDistance(this._x2, this._y2, x, y),
                dist = this.getDistance(this._x, this._y, this._x2, this._y2);

            return distSum >= dist - 1 && distSum <= dist + 1;
        };

        Segment.prototype.move = function (newX, newY) {
            this.setX2(this._x2 - (this._x - newX));
            this.setY2(this._y2 - (this._y - newY));
            this.setX(newX);
            this.setY(newY);
        };
        
        return Segment;
    }());
    
    var Point = (function () {
        function Point(ctx, x, y, color) {
            Shape.apply(this, arguments);
        }
        
        Point.inherits(Shape);

        Point.prototype._type = 'Point';
        
        Point.prototype.draw = function () {
            this._ctx.beginPath();
            this._ctx.strokeStyle = this._color;
            this._ctx.lineWidth = 2;
            this._ctx.strokeRect(this._x, this._y, 1, 1);
        };

        Point.prototype.drawContour = function (color) {
            this._ctx.beginPath();
            this._ctx.strokeStyle = color;
            this._ctx.lineWidth = 3;
            this._ctx.strokeRect(this._x, this._y, 1, 1);
        };

        Point.prototype.contains = function (x, y) {
            return x >= this._x - 3 && y >= this._y - 3 && x <= this._x + 3 && y <= this._y + 3;
        };
        
        return Point;
    }());

    var CreateShapeFromJSON = function (obj, ctx) {
        obj = JSON.parse(obj);
        switch (obj.type) {
            case 'Circle':
                return new Circle(ctx, obj.x, obj.y, obj.color, obj.radius);
            case 'Rectangle':
                return new Rectangle(ctx, obj.x, obj.y, obj.color, obj.width, obj.height);
            case 'Triangle':
                return new Triangle(ctx, obj.x, obj.y, obj.color, obj.x2, obj.y2, obj.x3, obj.y3);
            case 'Segment':
                return new Segment(ctx, obj.x, obj.y, obj.color, obj.x2, obj.y2);
            case 'Point':
                return new Point(ctx, obj.x, obj.y, obj.color);
        }
    };
    
    return {
        Circle: Circle,
        Rectangle: Rectangle,
        Triangle: Triangle,
        Segment: Segment,
        Point: Point,
        FromJSON: CreateShapeFromJSON
    };
})();
