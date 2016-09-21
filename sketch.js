var playing = true;
var rainbow_mode = true;
var perspective_mode = false;

function setup() {
  createCanvas(800, 400);
  background(51);
  
  strk = createCheckbox('No Stroke');
  rbwm = createCheckbox('Rainbow mode');
  
  button = createButton('Reset (R)');
  button.mousePressed(reset);
  button2 = createButton('Pause/Play (P)');
  button2.mousePressed(pause_play);
  button3 = createButton('Save canvas (S)');
  button3.mousePressed(canvas_save);
  button4 = createButton('Clear canvas (C)');
  button4.mousePressed(clear_canvas);
  button5 = createButton('Change color gradient (G)');
  button5.mousePressed(change_color);
  
}

function clear_canvas() {
  background(0);
}

function change_color() {
  noiseSeed(12345*random());
}

function canvas_save() {
  saveCanvas('myCanvas', 'png');
}

function reset() {
    location.reload();
    seedRandom();
    seedNoise();
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

var triangles = [];

var colorGradientFrequency = 0.01;

var perspective_x = 0;
var perspective_y = 1;

function movingTriangle(mx,my) {
    this.active = true;
    this.moves = 0;
  
    this.pos = createVector(mx,my);
    this.angle = random(100);
    this.length = random(25,75);
    
    this.prevPos = this.pos.copy();
    this.prevAngle = this.angle;
    
    this.move = function() {
      this.prevPos = this.pos.copy();
      this.prevAngle = this.angle;
      this.pos.x += 5*random(1);
      this.pos.y += 0*random(1);
      this.angle += TWO_PI/60;
      
      if (perspective_mode) {
        var aux = map(perspective_y*this.pos.y + perspective_x*this.pos.x,0,perspective_y*height + perspective_x*width,sqrt(15),sqrt(100));
        this.length = aux*aux;
      }
      
      if (this.pos.x>1.35*width || this.pos.y>1.35*height) {
        this.active = false;
      }
      
      this.moves++;
    }
    
    this.nr1 = noise(0);
    this.ng1 = noise(100);
    this.nb1 = noise(200);
    
    this.nr2 = noise(10);
    this.ng2 = noise(110);
    this.nb2 = noise(210);
    
    this.nr3 = 5*noise(5);
    this.ng3= 5*noise(15);
    this.nb3= 5*noise(25);
    
    if (rbwm.checked()) {
        noiseSeed(12345*random());
    }
    
    this.show = function () {
      
      var t_color = 0.7
      var max_alpha = 155;
      var t_ralpha = 0.2;
      
      var red = this.nr1*t_color + (1-t_color)*(sin(this.nr2 + this.nr3*noise(colorGradientFrequency*frameCount))+1)/2;
      var green =  this.ng1*t_color + (1-t_color)*(sin(this.ng2 + this.ng3*noise(colorGradientFrequency*frameCount + 250))+1)/2;
      var blue = this.nb1*t_color + (1-t_color)*(sin(this.nb2 + this.nb3*noise(colorGradientFrequency*frameCount + 500))+1)/2;
      
      var c = color(255*red,255*green,255*blue,max_alpha*((1-t_ralpha) + t_ralpha*random()));
      
      fill(c);
      if(strk.checked()){
        noStroke();
      } else {
        stroke(0,0,0,30);
      }
      beginShape();
      vertex(this.pos.x,this.pos.y);
      vertex(this.pos.x + this.length*cos(this.prevAngle),this.pos.y + this.length*sin(this.prevAngle));
      vertex(this.pos.x + this.length*cos(this.angle),this.pos.y + this.length*sin(this.angle));
      endShape(CLOSE);
    }
}

var curI = 0;
var MOD = 100;

function draw() {
  //background(0,15);

  
  if (mouseIsPressed && mouseX>=0 && mouseY >=0 && mouseX < width && mouseY < height && (triangles.length<MOD || !triangles[triangles.length -1].active )) {
    triangles[min(MOD-1,triangles.length)] = new movingTriangle(mouseX,mouseY);
  }
  
  triangles.sort(function(a, b) {
      return parseFloat(a.pos.x) - parseFloat(b.pos.x);
  });
  
  for(var i = 0; i<min(triangles.length,MOD); i++){
    if(triangles[i].moves>0) triangles[i].show();
    if(triangles[i].active) triangles[i].move();
  }
}
