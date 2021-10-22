// dom elements
var elements = {
    canvas: document.querySelector('#canvas'),
    activeToolEl: document.getElementById('active-tool'),
    brushColorBtn: document.getElementById('brush-color'),
    brush: document.getElementById('brush'),
    brushSize: document.getElementById('brush-size'),
    brushSlider: document.getElementById('brush-slider'),
    bucketColorBtn: document.getElementById('bucket-color'),
    eraser: document.getElementById('eraser'),
    clearCanvasBtn: document.getElementById('clear-canvas'),
    saveStorageBtn: document.getElementById('save-storage'),
    loadStorageBtn: document.getElementById('load-storage'),
    clearStorageBtn: document.getElementById('clear-storage'),
    downloadBtn: document.getElementById('download'),
    brushAndEraser: document.querySelectorAll('#brush, #eraser')
};
// Global Variables
var ctx = elements.canvas.getContext('2d');
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
var isMouseDown = false;
var lastX = 0;
var lastY = 0;
// brush
var Brush = /** @class */ (function () {
    function Brush(size, color) {
        this.size = size;
        this.color = color;
        this.mode = 'Brush';
        //
    }
    Object.defineProperty(Brush.prototype, "brushSize", {
        set: function (size) {
            this.size = size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "brushColor", {
        set: function (color) {
            this.color = color;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Brush.prototype, "changeMode", {
        set: function (mode) {
            this.mode = mode;
        },
        enumerable: false,
        configurable: true
    });
    return Brush;
}());
var brush = new Brush(10, elements.brushColorBtn.value);
// functions
var displaySelectedTool = function () {
    return (elements.activeToolEl.textContent = brush.mode);
};
var displayBrushSize = function () {
    return (elements.brushSize.textContent = brush.size.toString());
};
var updateBG = function (color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
};
var updateTool = function (mode) {
    return (brush.mode = elements.activeToolEl.textContent = mode);
};
var saveCanvas = function () {
    return localStorage.setItem('savedCanvas', "" + elements.canvas.toDataURL());
};
var clearCanvas = function () { return localStorage.removeItem('savedCanvas'); };
var retriveCanvas = function () {
    var savedImg = localStorage.getItem('savedCanvas');
    if (!savedImg)
        return;
    var img = new Image();
    img.src = savedImg;
    img.addEventListener('load', function () { return ctx.drawImage(img, 0, 0); });
};
var downloadCanvas = function () {
    var img = elements.canvas.toDataURL();
    elements.downloadBtn.setAttribute('href', img);
    elements.downloadBtn.setAttribute('download', 'your-drawing.png');
};
// ////////////////// the draw func
var draw = function (e) {
    if (!isMouseDown)
        return;
    ctx.strokeStyle =
        brush.mode === 'Brush' ? brush.color : elements.bucketColorBtn.value;
    ctx.lineWidth = brush.size;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    lastX = e.offsetX;
    lastY = e.offsetY;
};
updateBG('#fff');
displaySelectedTool();
displayBrushSize();
// event listeners
// updte brush color
elements.brushColorBtn.addEventListener('change', function () { return (brush.color = elements.brushColorBtn.value); });
// update bg color
elements.bucketColorBtn.addEventListener('input', function () {
    return updateBG(elements.bucketColorBtn.value);
});
// update brush size
elements.brushSlider.addEventListener('input', function () { return ((brush.size = +elements.brushSlider.value), displayBrushSize()); });
// update the selected tool
elements.brushAndEraser.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        var btn = e.target;
        elements.brushAndEraser.forEach(function (btn) {
            return btn.classList.remove('active');
        });
        btn.classList.add('active');
        if (btn.id === 'brush')
            updateTool('Brush');
        else
            updateTool('Eraser');
    });
});
// clear canvas
elements.clearCanvasBtn.addEventListener('click', function () {
    return updateBG("" + elements.bucketColorBtn.value);
});
// save canvas
elements.saveStorageBtn.addEventListener('click', saveCanvas);
// retrieve canvas
elements.loadStorageBtn.addEventListener('click', retriveCanvas);
// delete canvas
elements.clearStorageBtn.addEventListener('click', clearCanvas);
// save canvas to disk
elements.downloadBtn.addEventListener('click', downloadCanvas);
//////////////// the drawing events
elements.canvas.addEventListener('mousedown', function (e) { return ((isMouseDown = true), (lastX = e.offsetX), (lastY = e.offsetY)); });
elements.canvas.addEventListener('mouseup', function () { return (isMouseDown = false); });
elements.canvas.addEventListener('mousemove', draw);
