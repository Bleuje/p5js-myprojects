var cnv;

var myRay = [];

var max_rays = 60;

function drawTriangle() {
    var y_up = height/4;
    var y_down= 3*height/4;
    var x_mid = width/2;
    var x_left = 2*width/10;
    var x_right = 8*width/10;
    
    stroke(255);
    strokeWeight(3);
    
    line(x_left,y_down,x_mid,y_up);
    line(x_mid,y_up,x_right,y_down);
    line(x_right,y_down,x_left,y_down);
}

function setup() {
    cnv = createCanvas(400,400);
    cnv.parent('canvas');
    background(0);
    
    drawTriangle();
    
    myRay[0] = new ray();
    
    fadeT = createP('Background fade');
    fadeT.parent('buttons');
    fadeS = createSlider(0,12,3,1);
    fadeS.parent('buttons');
    
    maxT = createP('Maximum particles');
    maxT.parent('buttons');
    maxS = createSlider(5,120,max_rays,1);
    maxS.parent('buttons');
    
    freqT = createP('Frequency of new ray');
    freqT.parent('buttons');
    freqS = createSlider(0.005,0.2,0.07,0.005);
    freqS.parent('buttons');
    
    button = createButton('Remove rays');
    button.parent('buttons');
    button.mousePressed(removeEvent);
}

var record_mode = 0;

var maxFrames = 120;

var skip = 4;

function keyTyped() {
    if(key === 's') {
        record_mode = maxFrames;
    }
    if(key === 'g') {
        loop();
    }
}

function removeEvent() {
    while (myRay.length) {
        myRay.pop();
    }
}

function draw() {
    for(var i=0;i<myRay.length;i++){
        myRay[i].show();
        myRay[i].move();
    }
    background(0,fadeS.value());
    drawTriangle();
    if (myRay.length<maxS.value() && random()>1-freqS.value()) {
        myRay.push(new ray());
    }
    
    if (record_mode>0 && frameCount%skip === 0) {
        saveCanvas('gif_frame' + (maxFrames - record_mode),'jpg');
        record_mode--;
        if (record_mode%20===0) {
            noLoop();
        }
    }
}