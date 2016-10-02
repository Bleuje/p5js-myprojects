var cnv;

var wid = 16000;
var hei = 9000;

var scaler = 25;

var cp_radius = 600;
var angle_diff_max = 18;
var pod_rad = 400;
var slow_down_coeff = 0.75;

var background_grey = 220; 
var myMap,myCar;

function setup() {
    cnv = createCanvas(wid/scaler,hei/scaler);
    cnv.parent('canvas');
    background(background_grey);
    smooth(5)
    
    //console.log(0);
    
    myMap = new gameMap();
    myMap.addcps();
    
    //console.log(1);
    
    myCar = new car(myMap,random(1000,wid-1000),random(1000,hei-1000),random(PI*12));
    
    //console.log(2);
    buttonPlay = createButton('Pause/Play (P)');
    buttonPlay.parent('buttons');
    buttonPlay.mousePressed(pause_play);
    
    sliderSlowMotionT = createP('Slow motion');
    sliderSlowMotionT.parent('buttons');
    sliderSlowMotion = createSlider(1,20,5,1);
    sliderSlowMotion.parent('buttons');
    
    showAngleDecision = createCheckbox('Show angle choice');
    showAngleDecision.parent('buttons');
    showThrustDecision = createCheckbox('Show thurst choice');
    showThrustDecision.parent('buttons');
    
    sliderFadeT = createP('Background fade');
    sliderFadeT.parent('buttons');
    sliderFade = createSlider(0,255,255-50,1);
    sliderFade.parent('buttons');
    
    infoclickT = createP('Click to change the position of the last checkpoint');
    infoclickT.parent('buttons');
}

var playing = true;

var midsteps = 5;
var curmidstep = 0;

function pause_play() {
    if (playing) {
        noLoop();
        playing = false;
    } else {
        loop();
        playing = true;
    }
}

function keyTyped() {
    if (key === 'p') {
        pause_play();
    }
}

function mousePressed() {
    if (mouseX>=0&&mouseY>=0&&mouseX<width&&mouseY<height) {
        myMap.cps[2].pos.x = mouseX*scaler;
        myMap.cps[2].pos.y = mouseY*scaler;
    }
}

/*
var mxfrm = 50;
var frcnt = 0;*/

function draw() {
    background(background_grey,255-sliderFade.value());
    frameRate(60);
   myMap.show();
   myCar.gatherChoice();
   myCar.show(curmidstep/midsteps);
   if (curmidstep%midsteps === 0) {
    myCar.move();
    curmidstep=0;
    midsteps=sliderSlowMotion.value();
   }
   curmidstep = (curmidstep + 1) % midsteps;
}