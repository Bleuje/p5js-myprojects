var cnv;

var lines = [];

function setup() {
  cnv = createCanvas(400,400);
  cnv.parent('canvas');
  background(0);
  
  noiseDetail(3);
  
  for(var i = 0;i<400/6;i++){
    lines[i] = new divisionLine(0,i*6);
  }

  
  for(var i = 0;i<400/6;i++){
    lines[i].show();
  }
  
  //filter(BLUR,1);
  /*
  for(var i = 0;i<400/6;i++){
    lines[i].show();
  }*/
  
  textSize(45);
  fill(255);
  var myText = text('JOY DIVISION', 50, 40);
  
  textSize(26);
  var myText = text('UNKNOWN PLEASURES', 50, 395);
}


function draw() {
  
}