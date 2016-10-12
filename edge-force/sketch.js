var cnv;

var wid = 400;
var hei = 300;

function object() {
    this.x = random(width);
    this.y = random(height);
    
    this.offset = random(1);
    
    this.v = createVector(random(s0.value())-s0.value()/2,random(s0.value())-s0.value()/2);
    
    this.force = function(x_,y_){
        //how close it is from the edges, rescaled between 0 and 1 (when it's in the canvas);
        var proximity = 1 - min(min(width-x_,x_),min(height-y_,y_))/max(width,height);
        
        var t = Math.pow(proximity,s2.value());
        
        var factor = s1.value()*s1.value();
        
        var fx = factor*t*(width/2 - x_) + s1bis.value()*(noise(1000*this.offset + frameCount*s1bisb.value())-0.5);
        var fy = factor*t*(height/2 - y_) + s1bis.value()*(noise(2000*this.offset + frameCount*s1bisb.value())-0.5);
        
        return createVector(fx,fy);
    }
    
    this.move = function() {
        this.x += this.v.x;
        this.y += this.v.y;
        
        this.v.add(this.force(this.x,this.y));
    }
    
    this.show = function() {
        fill(255);
        stroke(0,50);
        ellipse(this.x,this.y,s5.value(),s5.value());
    }
}

var objects = [];
var NB_OBJECTS = 50;
var background_transparency = 50;

function setup() {
    cnv = createCanvas(wid,hei);
    cnv.parent("canvas");
    
    background(51);
    
    b1 = createButton('New balls');
    b1.parent("buttons");
    b1.mousePressed(b1fun);
    
    p00 = createP('Number of balls in the next set :');
    p00.parent('buttons');
    s00 = createSlider(1,200,NB_OBJECTS,1);
    s00.parent("buttons");
    
    p0 = createP('Initial ball speed :');
    p0.parent('buttons');
    s0 = createSlider(0,20,4,0.01);
    s0.parent("buttons");
    
    p1 = createP('Force intensity :');
    p1.parent('buttons');
    s1 = createSlider(0,0.1,0.03,0.001);
    s1.parent("buttons");
    
    p1bis = createP('Force noise intensity :');
    p1bis.parent('buttons');
    s1bis = createSlider(0,0.4,0.1,0.001);
    s1bis.parent("buttons");
    
    p1bisb = createP('Noise frequency :');
    p1bisb.parent('buttons');
    s1bisb = createSlider(0,0.2,0.01,0.001);
    s1bisb.parent("buttons");
    
    p2 = createP('Force field "mostly-on-the-edge" parameter" :');
    p2.parent('buttons');
    s2 = createSlider(0.5,40,3,0.001);
    s2.parent("buttons");
    
    c1 = createCheckbox('Plot interpolation map');
    c1.parent("buttons");
    
    p1 = createP('Plot step :');
    p1.parent('buttons');
    s3 = createSlider(10,20,15,1);
    s3.parent("buttons");
    
    p4 = createP('Transparency :');
    p4.parent('buttons');
    s4 = createSlider(10,255,255-51,1);
    s4.parent("buttons");
    
    p5 = createP('Ball radius :');
    p5.parent('buttons');
    s5 = createSlider(1,30,5,1);
    s5.parent("buttons");
    
    for(var i=0;i<NB_OBJECTS;i++){
        objects[i] = new object();
    }
}

function b1fun() {
    for(var i=objects.length-1;i>=0;i--){
        objects.splice(i);
    }
    NB_OBJECTS = s00.value();
    for(var i=0;i<NB_OBJECTS;i++){
        objects[i] = new object();
    }
}

function plotInterpolation(b_transparency) {
    
    var step_size = s3.value();
    
    for(var i=0;i<width/step_size;i++){
        for(var j=0;j<height/step_size;j++){
            
            var x_ = (i+0.5)*step_size;
            var y_ = (j+0.5)*step_size;
            
            var proximity = 1 - min(min(width-x_,x_),min(height-y_,y_))/max(width,height);
        
            var t = Math.pow(proximity,s2.value());
            
            fill(255*t,b_transparency);
            noStroke();
            rect(i*step_size,j*step_size,step_size,step_size);
        }
    }
}

function draw() {
    if (c1.checked()) {
        plotInterpolation(255-s4.value());
    }else{
        background(51,255-s4.value());
    }
    for(var i=0;i<NB_OBJECTS;i++){
        objects[i].show();
        objects[i].move();
    }
}