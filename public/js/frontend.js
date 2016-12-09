var socket = io();

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var buffer = document.getElementById('buffer');
var btx = buffer.getContext('2d');

$(document).ready(function(){
    var w = $('.canvasDiv').width();
    var h = $('.canvasDiv').height();
    buffer.width = w;
    buffer.height = h;
    canvas.width = w;
    canvas.height = h;
});

$(window).resize(function(){
    var w = $('.canvasDiv').width()*0.8;
    var h = $('.canvasDiv').height();
    buffer.width = w;
    buffer.height = h;
    btx.drawImage(canvas, 0, 0);
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(buffer, 0, 0);
});

var drawing = false;
var lastMousePosition;

function setColor(color) {
    ctx.strokeStyle = color;
}

function setThickness(thickness) {
    ctx.lineWidth = thickness;
}

function startLine() {
    setColor();
    ctx.beginPath();
}

function drawLine(prev_coords, new_coords) {
    ctx.moveTo(prev_coords[0],prev_coords[1]);
    ctx.lineTo(new_coords[0], new_coords[1]);
    ctx.stroke();
}


canvas.addEventListener('mousedown', function eventHandler(event) {
    drawing = true;
    mouse_coords = [event.offsetX, event.offsetY];
    lastMousePosition = mouse_coords;
    startLine();
});

canvas.addEventListener('mousemove', function eventHandler(event) {
    if(drawing){
        mouse_coords = [event.offsetX, event.offsetY];
        drawLine(lastMousePosition, mouse_coords);
        socket.emit('draw', [lastMousePosition, mouse_coords]);
        lastMousePosition = mouse_coords;
    }
});

document.addEventListener('mouseup', function eventHandler(event) {
    drawing = false;
});

$('.color').on('click', function(){
    setColor($(this).attr("value"));
});

$('#color-picker').on('change', function() {
    setColor($(this).val());
});

$('.thick').on('click', function(){
    setThickness($(this).attr("value"));
});

$('#thickness-picker').on('change', function (){
    setThickness($(this).val());
});

$('#eraser').on('click', function(){
    setColor('white');
});

socket.on('draw', function (coord_pair){
    drawLine(coord_pair[0], coord_pair[1]);
});
