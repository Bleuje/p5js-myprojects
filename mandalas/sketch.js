var ESZ = 3;
var COPIES = 20;
var RRR = 255;
var GGG = 255;
var BBB = 255;
var TRANSP = 70;

var prevx = 0;
var prevy = 0;

var lining = false;

function setup() {
  var cnv = createCanvas(600, 600);
  //cnv.style('width: 100%;margin: 0;justify-content: center;')
  cnv.parent('canvas');
  background(0);
  noStroke();
  
  button = createButton('Reset (R)');
  button.mousePressed(reset);
  button.parent('buttons');
  button3 = createButton('Save canvas (S)');
  button3.mousePressed(canvas_save);
  button3.parent('buttons');
  button4 = createButton('Clear canvas (C)');
  button4.mousePressed(clear_canvas);
  button4.parent('buttons');
  
  copiesText = createP('Number of copies');
  copiesText.parent('settings');
  sCOPIES = createSlider(1,40,COPIES,1);
  sCOPIES.parent('settings');
  sizeText = createP('Pen size');
  sizeText.parent('settings');
  sESZ = createSlider(1,25,ESZ,1);
  sESZ.parent('settings');
  trText = createP('Pen alpha');
  trText.parent('settings');
  sTRANSP = createSlider(0,255,TRANSP,1);
  sTRANSP.parent('settings');
  colorText = createP('Color');
  colorText.parent('settings');
  sRRR = createSlider(0,255,RRR,1);
  sRRR.parent('settings');
  sGGG = createSlider(0,255,GGG,1);
  sGGG.parent('settings');
  sBBB = createSlider(0,255,BBB,1);
  sBBB.parent('settings');
}

function clear_canvas() {
  background(0);
}

function canvas_save() {
  saveCanvas('myCanvas', 'png');
}

function reset() {
    location.reload();
    seedRandom();
    seedNoise();
}

function keyTyped() {
  if (key === 'r') {
    reset();
  } else if (key === 'c') {
    clear_canvas();
  } else if (key === 's') {
    canvas_save();
  }
}


function draw_point() {
    var c = color(sRRR.value(),sGGG.value(),sBBB.value(),sTRANSP.value());
    translate(-width/2,-height/2);
    mx2 = mouseX - width/2;
    my2 = mouseY - height/2;
    noStroke();
    fill(c);
    for(var i=0;i<sCOPIES.value();i++){
      var theta = i*TWO_PI/sCOPIES.value();
      var xp = mx2*cos(theta) - my2*sin(theta);
      var yp = mx2*sin(theta) + my2*cos(theta);
      ellipse(xp+width,yp+height,sESZ.value());
    }
    prevx = mx2;
    prevy = my2;
}

function draw_line() {
    if (!lining) {
        draw_point();
        lining = true;
    } else {
      var c = color(sRRR.value(),sGGG.value(),sBBB.value(),sTRANSP.value());
      translate(-width/2,-height/2);
      mx2 = mouseX - width/2;
      my2 = mouseY - height/2;
      fill(c);
      strokeWeight(sESZ.value());
      stroke(c);
      for(var i=0;i<sCOPIES.value();i++){
        var theta = i*TWO_PI/sCOPIES.value();
        var xp = mx2*cos(theta) - my2*sin(theta);
        var yp = mx2*sin(theta) + my2*cos(theta);
        var xp2 = prevx*cos(theta) - prevy*sin(theta);
        var yp2 = prevx*sin(theta) + prevy*cos(theta);
        line(xp2+width,yp2+height,xp+width,yp+height);
      }
      prevx = mx2;
      prevy = my2;
    }
}


function draw() {
    if (mouseIsPressed) {
        //draw_point();
        draw_line();
    } else {
      lining = false;
    }
}
