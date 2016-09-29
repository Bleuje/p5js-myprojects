var cnv;

var myRay = [];

var max_rays = 40;

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
    fadeS = createSlider(0,12,4,1);
    fadeS.parent('buttons');
    
    maxT = createP('Maximum particles');
    maxT.parent('buttons');
    maxS = createSlider(5,100,max_rays,1);
    maxS.parent('buttons');
    
    freqT = createP('Frequency of apparition');
    freqT.parent('buttons');
    freqS = createSlider(0.005,0.2,0.03,0.005);
    freqS.parent('buttons');
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
}