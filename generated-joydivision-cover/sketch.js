
var nb_points = 400;

var noiseIntensity = 1.5;

var start_pos = 50;
var end_pos = 350;

var start_posh = 60;
var end_posh = 370;

var gaussian = function(x) {
    return Math.exp(-pow(x-width/2,2)/pow(width/5,2));
}

var sigmoid = function(x) {
    return 1/(1 + Math.exp(-x));
}


var transition = function(x) {
    var t1 = Math.abs(x-width/2)/(width/2);
    var t = 1/(0.1+pow(2.2*t1,5));
    return sigmoid(t-3);
}

var radius = 5;
var lenSlider;

var divisionLine = function(start_y,seed) {
    this.y = start_y;
    
    this.offset = 50*noise(seed + 0.01*start_y);
    this.offset2 = 0.1*start_y + random(0.1);
    
    this.show = function(t) {
        stroke(255,200);
        fill(0);
        
        this.addedValue = [];
        this.randomArray = [];
        
        for(var i = 0;i<nb_points;i++){
             var myRand = random(noiseIntensity);
             
             var x = i*width/nb_points;
          //radius = lenSlider.value()/TWO_PI;
              var myTime = TWO_PI*(0.027*x + seed + this.offset)/lenSlider.value() + t;
            var radius2 = lenSlider.value()/TWO_PI;
             var myNoise = noise(radius2*cos(myTime)+0.2*this.offset2,radius2*sin(myTime)+0.2*this.offset2,this.offset2)+0.58;
             
             var myNoise2 = - 6*pow(myNoise,7);
             
             this.addedValue[i] = myRand + myNoise2;
             this.randomArray[i] = myRand;
        }
        
        var realY = map(this.y,0,400,start_posh,end_posh);
        
        beginShape();
        vertex(start_pos,realY+4);
        for(var i = 0;i<nb_points;i++){
            myInterpoler = transition(i*width/nb_points);
            vertex(start_pos + i*(end_pos-start_pos)/nb_points,
                 realY +  lerp(this.randomArray[i],this.addedValue[i],myInterpoler));
        }
        vertex(end_pos,realY+4);
        endShape(CLOSE);
        noStroke();
        rect(start_pos-1,realY+2,end_pos-start_pos+2,end_posh + 1 - realY);
    }
}

var cnv;

var lines = [];

var button;

var globalTime = 0;
var NUMBER_OF_FRAMES = 30*3;
var globalTimeStep = 0;

function setup() {
  globalTimeStep = - TWO_PI/NUMBER_OF_FRAMES;
  
  cnv = createCanvas(400,400);
  cnv.parent('canvas');
  
  button = createButton('Generate a new cover');
  button.mousePressed(new_cover);
  button.parent('buttons');
  button.class('btn btn-default');
  button.style('border-radius: 0px');
  button2 = createButton('Pause');
  button2.mousePressed(noLoop);
  button2.parent('buttons');
  button2.class('btn btn-default');
  button2.style('border-radius: 0px');
  button3 = createButton('Play (Warning : it is laggy)');
  button3.mousePressed(loop);
  button3.parent('buttons');
  button3.class('btn btn-default');
  button3.style('border-radius: 0px');
  button4 = createButton('Next time step');
  button4.mousePressed(increase_time);
  button4.parent('buttons');
  button4.class('btn btn-default');
  button4.style('border-radius: 0px');
  
  noiseDetail(3);
  
  framesSliderT = createP('Frames per cycle :');
  framesSliderT.parent('buttons');
  framesSlider = createSlider(5,300,NUMBER_OF_FRAMES,1);
  framesSlider.parent('buttons');
  
  lenSliderT = createP('Cycle length :');
  lenSliderT.parent('buttons');
  lenSlider = createSlider(5,100,30,1);
  lenSlider.parent('buttons');
  
  new_cover();
  
  noLoop();
  
}

function new_cover() {
  seed = random(100000);
    for(var i = 0;i<400/6;i++){
    lines[i] = new divisionLine(i*6,seed);
  }
  
  show_cover();
}

function show_cover() {
  background(0);
  
  textSize(45.7);
  fill(255);
  var myText = text('JOY DIVISION', 50, 40);
  
  textSize(26);
  var myText = text('UNKNOWN PLEASURES', 50, 395);
  
  for(var i = 0;i<400/6;i++){
    lines[i].show(globalTime);
  }
}

function increase_time() {
  globalTime -= TWO_PI/framesSlider.value();
  show_cover();
}

var frame_start = -10;
var recording = -1;

function keyTyped() {
    if (key === 's') {
        recording = framesSlider.value();
        console.log('went here1');
    }
}

function draw() {
  increase_time();
  
  if (recording>0) {
    console.log(framesSlider.value() - recording);
    recording--;
  }
}
