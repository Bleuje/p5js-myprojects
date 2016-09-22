var playing = true;

var myGrad;
var custom_image;

var selected_picture = true;

function preload()
{
  // load image
  img1 = loadImage("imgsamples/red-flowers.jpg");
  img2 = loadImage("imgsamples/starry-night.jpg");
  img3 = loadImage("imgsamples/persistence-of-memory.jpg");
}

var dictionary = {};

var cnv;

function setup() {
  dictionary["Red flowers"] = img1;
  dictionary["Starry night"] = img2;
  dictionary["Persistence of memory"] = img3;
  
  cnv = createCanvas(50,50);
  cnv.parent("canvas")
  background(51);
  
  var button = createButton('Reset page');
  button.mousePressed(reset);
  button.parent('line1');
  
  sel = createSelect();
  sel.option('Select a picture');
  sel.option("Red flowers");
  sel.option("Starry night");
  sel.option("Persistence of memory");
  sel.changed(mySelectEvent);
  sel.parent('pic-choice');
  
  launch = createButton('Use an ellipse to find a color gradient (can take a little time)');
  launch.mousePressed(ellipseEvent);
  launch.parent('launch');
/*
  inp = createFileInput(dropped, gotFile);
  inp.parent('pic-choice');*/
}

var img;

function dropped() {
  image(img, 0, 0, width, height);
  if (selected_picture === false) {
      cnv = createCanvas(img.width, img.height);
      cnv.parent('canvas');
  }
  resizeCanvas(img.width, img.height);
  
  selected_picture = true;
  image(img,0,0,width,height);
}

function gotFile(file) {
  img = createImg(file.data);
}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function myInputEvent(){
  var s = this.value();
  if (checkURL(s)) {
    img = loadImage(s);
    
    if (selected_picture === false) {
        cnv = createCanvas(img.width, img.height);
        cnv.parent('canvas');
    }
    
    resizeCanvas(img.width, img.height);
    
    selected_picture = true;
    image(img,0,0,width,height);
    
  }
}

function mySelectEvent() {
  var item = sel.value();
  if (item != 'Select a picture') {
    
    img = dictionary[item];
    
    if (selected_picture === false) {
        cnv = createCanvas(img.width, img.height);
        cnv.parent('canvas');
    }
    
    resizeCanvas(img.width, img.height);
    
    selected_picture = true;
    image(img,0,0,width,height);
  }
}

var NB_BALLS = 20;

var cnv2;
var balls = [];
var choice_done = false;

function ball() {
    this.pos = createVector(random(width),random(height));
    this.prevPos = this.pos.copy();
    
    this.speedn = random(10000);
    
    this.ball_off = random(0.25);
    
    this.radius = random(7,30); 
    
    this.speed = createVector(random(-5,5),random(-5,5));
    
    this.move = function() {
      this.pos.x = (this.pos.x + this.speed.x + width) % width;
      this.pos.y = (this.pos.y + this.speed.y + height) % height;
      
      this.speed.x += 3*(noise(0.1*frameCount + this.speedn)-0.5);
      this.speed.y += 3*(noise(0.1*frameCount + this.speedn +1000)-0.5);
      
      this.speed.setMag(this.speed.mag()*0.95);
      
    }
    
    this.show = function() {
      var c = myGrad.getColor(0.002*frameCount + this.ball_off);
      
      //console.log(c);
      
      fill(c);
      stroke(c);
      strokeWeight(this.radius);
      
      var ppos = this.prevPos.copy();
      
      if (ppos.sub(this.pos).mag()<min(width,height)/2) {
        line(this.prevPos.x,this.prevPos.y,this.pos.x,this.pos.y);
      }
      
      this.prevPos = this.pos.copy();
      
    }
    
}

function ellipseEvent() {
  if(!choice_done) {
    sel.hide();
    
    myGrad = new colorGrad(100);
    myGrad.circleMethod();
    //myGrad.draw(100,25,200,50);
    
    cnv2 = createCanvas(500,500);
    cnv2.parent('canvas2');
    background(100);
    
    for(var i = 0; i<NB_BALLS;i++){
      balls[i] = new ball();
    }
    
    choice_done = true;
    
    button2 = createButton('Pause/Play (P)');
    button2.mousePressed(pause_play);
    button2.parent('buttons');
    button3 = createButton('Save canvas (S)');
    button3.mousePressed(canvas_save);
    button3.parent('buttons');
    button4 = createButton('Clear canvas (C)');
    button4.mousePressed(clear_canvas);
    button4.parent('buttons');
    
  }
  
}

function clear_canvas() {
  background(100);
}

function canvas_save() {
  saveCanvas('myCanvas', 'png');
}

function pause_play() {
    if (playing) {
        playing = false;
        noLoop();
    } else {
      playing = true;
      loop();
    }
}

function keyTyped() {
  if (key === 'p') {
    pause_play();
  } else if (key === 'c') {
    clear_canvas();
  } else if (key === 's') {
    canvas_save();
  }
}

function reset() {
  location.reload();
}

function colorGrad(n) {
  this.complexity = n;
  this.colors = [];
  
  this.circleMethod = function() {
    for(var i = 0; i < this.complexity; i++){
      var theta = i*TWO_PI/this.complexity;
      
      var x = 0.8*width/2*cos(theta)+width/2;
      var y = 0.8*height/2*sin(theta)+height/2
      
      var c = get(x,y);
      
      this.colors[i] = [c[0],c[1],c[2]];
      
    }
  }
  
  this.getColor = function(t) {
    var ind = (t-floor(t))*this.complexity;
    var r = lerp(this.colors[floor(ind)][0],this.colors[floor(ind+1)%this.complexity][0],ind-floor(ind));
    var g = lerp(this.colors[floor(ind)][1],this.colors[floor(ind+1)%this.complexity][1],ind-floor(ind));
    var b = lerp(this.colors[floor(ind)][2],this.colors[floor(ind+1)%this.complexity][2],ind-floor(ind));
    return [r,g,b,255];
  }
  
  this.draw = function(x,y,w,h){
    for(var i=x; i<x+w; i++){
      var t = (i-x)/w;
      stroke(this.getColor(t));
      
      line(i,0,i,h);
    }
  }
}

var test = 0;

function draw() {
  
  if (choice_done) {
    for(var i = 0; i<NB_BALLS;i++){
      balls[i].move();
      balls[i].show();
    }
    //console.log(balls[0].pos.x,balls[0].pos.y);
    //ellipse(balls[0].pos.x,balls[0].pos.y,5,5);
  }
}