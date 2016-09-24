var cnv;

var lines = [];

function setup() {
  cnv = createCanvas(400,400);
  cnv.parent('canvas');
  
  button = createButton('Reload page');
  button.parent('buttons');
  button.class('btn btn-default')
  button.mousePressed(reset);
  
  noiseDetail(3);
  
  for(var i = 0;i<400/6;i++){
    lines[i] = new divisionLine(0,i*6);
  }
  
  background(0);
  
  textSize(45);
  fill(255);
  var myText = text('JOY DIVISION', 50, 40);
  textSize(26);
  fill(255,200);
  textSize(45);
  var myText = text('JOY DIVISION', 50, 40);
  filter(ERODE);
  
  textSize(45);
  fill(255);
  textSize(26);
  var myText = text('UNKNOWN PLEASURES', 50, 395);
  //filter(BLUR,1);
  
  for(var i = 0;i<400/6;i++){
    lines[i].show();
  }
  
  //filter(BLUR,1);
  /*
  for(var i = 0;i<400/6;i++){
    lines[i].show();
  }*/
  
}

function reset() {
    location.reload();
    seedRandom();
    seedNoise();
}


function draw() {
  
}