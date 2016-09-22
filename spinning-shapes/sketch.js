var playing = true;
var rainbow_mode = true;
var perspective_mode = false;

var myDate = new Date();

function setup() {
  var cnv = createCanvas(windowWidth-200, 400);
  cnv.style('width: 100%;margin: 0;display: flex;justify-content: center;')
  cnv.parent('canvas');
  background(0);
  
  button = createButton('Reset (R)');
  button.mousePressed(reset);
  button.parent('buttons');
  button2 = createButton('Pause/Play (P)');
  button2.mousePressed(pause_play);
  button2.parent('buttons');
  button3 = createButton('Save canvas (S)');
  button3.mousePressed(canvas_save);
  button3.parent('buttons');
  button4 = createButton('Clear canvas (C)');
  button4.mousePressed(clear_canvas);
  button4.parent('buttons');
  button5 = createButton('Change color gradient (G)');
  button5.mousePressed(change_color);
  button5.parent('buttons');
  
  strk = createCheckbox('No Stroke');
  strk.parent('buttons');
  rbwm = createCheckbox('Rainbow mode');
  rbwm.parent('buttons');
  
  shapesPerTurnT = createP('Shapes per turn');
  shapesPerTurnT.parent('phys');
  shapesPerTurnS = createSlider(1,120,40,1);
  shapesPerTurnS.parent('phys');
  speedxT = createP('Speed');
  speedxT.parent('phys');
  speedxS = createSlider(1,50,5,1);
  speedxS.parent('phys');
  lenmaxT = createP('Maximum length');
  lenmaxT.parent('phys');
  lenmaxS = createSlider(5,100,75,1);
  lenmaxS.parent('phys');
  lenminT = createP('Minimum length');
  lenminT.parent('phys');
  lenminS = createSlider(5,100,25,1);
  lenminS.parent('phys');
  lennT = createP('Length noise');
  lennT.parent('phys');
  lennS = createSlider(0,1,0,0.01);
  lennS.parent('phys');
  overlapT = createP('Overlap');
  overlapT.parent('phys');
  overlapS = createSlider(0,3,0,0.1);
  overlapS.parent('phys');
  distT = createP('Distance to center');
  distT.parent('phys');
  distS = createSlider(0,50,0,1);
  distS.parent('phys');
  colorGradientFreqT = createP('Color gradient frequency');
  colorGradientFreqT.parent('disp');
  colorGradientFreqS = createSlider(0,0.2,0.01,0.002);
  colorGradientFreqS.parent('disp');
  fadeT = createP('Background fade');
  fadeT.parent('disp');
  fadeS = createSlider(0,255,0,1);
  fadeS.parent('disp');
  cvarT = createP('Color variation');
  cvarT.parent('disp');
  cvarS = createSlider(0,1,0.7,0.01);
  cvarS.parent('disp');
  amaxT = createP('Maximum alpha');
  amaxT.parent('disp');
  amaxS = createSlider(0,255,255,1);
  amaxS.parent('disp');
  arR = createP('Alpha randomness');
  arR.parent('disp');
  arS = createSlider(0,1,0,0.01);
  arS.parent('disp');
  salphaT = createP('Stroke alpha');
  salphaT.parent('disp');
  salphaS = createSlider(0,255,30,1);
  salphaS.parent('disp');
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

function keyTyped() {
  if (key === 'p') {
    pause_play();
  } else if (key === 'r') {
    reset();
  } else if (key === 'c') {
    clear_canvas();
  } else if (key === 's') {
    canvas_save();
  } else if (key === 'g') {
    change_color();
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
    this.length = random(lenminS.value(),lenmaxS.value());
    
    this.prevPos = this.pos.copy();
    this.prevAngle = this.angle;
    
    this.move = function() {
      this.prevPos = this.pos.copy();
      this.prevAngle = this.angle;
      this.pos.x += speedxS.value()*random();
      this.pos.y += 0;
      this.angle += TWO_PI/shapesPerTurnS.value();
      
      if (perspective_mode) {
        var aux = map(perspective_y*this.pos.y + perspective_x*this.pos.x,0,perspective_y*height + perspective_x*width,sqrt(15),sqrt(100));
        this.length = aux*aux;
      }
      
      if (this.pos.x>1.15*width || this.pos.y>1.15*height) {
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
      
      colorGradientFrequency = colorGradientFreqS.value();
      
      var t_color = cvarS.value();
      var max_alpha = amaxS.value();
      var t_ralpha = arS.value();
      
      var red = this.nr1*(1-t_color) + t_color*(sin(this.nr2 + this.nr3*noise(colorGradientFrequency*frameCount))+1)/2;
      var green =  this.ng1*(1-t_color) + t_color*(sin(this.ng2 + this.ng3*noise(colorGradientFrequency*frameCount + 250))+1)/2;
      var blue = this.nb1*(1-t_color) + t_color*(sin(this.nb2 + this.nb3*noise(colorGradientFrequency*frameCount + 500))+1)/2;
      
      var c = color(255*red,255*green,255*blue,max_alpha*((1-t_ralpha) + t_ralpha*random()));
      
      fill(c);
      if(strk.checked()){
        noStroke();
      } else {
        stroke(0,0,0,salphaS.value());
      }
      beginShape();
      vertex(this.pos.x + distS.value()*cos(this.angle),this.pos.y + distS.value()*sin(this.angle));
      
      var curlen = distS.value() + lerp(this.length, this.length*(1+(random()-0.5)*2), lennS.value());
      
      var aback = overlapS.value()*(this.angle - this.prevAngle);
      
      vertex(this.pos.x + curlen*cos(this.prevAngle - aback),this.pos.y + curlen*sin(this.prevAngle - aback));
      vertex(this.pos.x + curlen*cos(this.angle),this.pos.y + curlen*sin(this.angle));
      endShape(CLOSE);
    }
}

var curI = 0;
var MOD = 100;

var latest = myDate.getTime()-1000;

function draw() {
  if(fadeS.value()>0) background(0,fadeS.value());
  
  myDate = new Date();
  
  if (mouseIsPressed && mouseX>=0 && mouseY >=0 && mouseX < width && mouseY < height && (triangles.length<MOD || !triangles[triangles.length -1].active ) && myDate.getTime()>latest+50) {
    triangles[min(MOD-1,triangles.length)] = new movingTriangle(mouseX,mouseY);
    millis(100);
    latest = myDate.getTime();
  }
  
  triangles.sort(function(a, b) {
      return parseFloat(a.pos.x) - parseFloat(b.pos.x);
  });
  
  for(var i = 0; i<min(triangles.length,MOD); i++){
    if(triangles[i].moves>0) triangles[i].show();
    if(triangles[i].active) triangles[i].move();
  }
}
