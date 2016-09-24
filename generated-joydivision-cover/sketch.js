var cnv;

var lines = [];

function setup() {
  cnv = createCanvas(400,400);
  cnv.parent('canvas');
  
  button = createButton('New cover');
  button.parent('buttons');
  button.class('btn btn-default')
  button.mousePressed(new_cover);
  
  noiseDetail(3);
  
  new_cover();
  
}

function new_cover() {
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
}


function draw() {
  
}