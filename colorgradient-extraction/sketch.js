var playing = true;

var myGrad;
var custom_image;

var nsampling = 200;

var application = 1;

var selected_picture = true;

function preload()
{
  // load image
  img1 = loadImage("imgsamples/red-flowers.jpg");
  img2 = loadImage("imgsamples/starry-night.jpg");
  img3 = loadImage("imgsamples/persistence-of-memory.jpg");
}

var dictionary = {};
var dictionary2 = {};

var cnv;

function setup() {
  dictionary["Coquelicots"] = img1;
  dictionary["Starry night"] = img2;
  dictionary["Persistence of memory"] = img3;
  dictionary2["Webcam"] = 1;
  dictionary2["Random walks"] = 0;
  
  cnv = createCanvas(200,200);
  cnv.parent("canvas")
  background(51);
  
  var button = createButton('Reset page');
  button.mousePressed(reset);
  button.parent('line2');
  
  sel = createSelect();
  sel.option('Select a picture');
  sel.option("Coquelicots");
  sel.option("Starry night");
  sel.option("Persistence of memory");
  sel.changed(mySelectEvent);
  sel.parent('pic-choice');
  inpt = createP('</br> Or use your own picture : ');
  inpt.parent('pic-choice');
  inp = createFileInput(gotFile);
  inp.parent('pic-choice');
  inpt2 = createP('</br> </br>');
  inpt2.parent('pic-choice');
  
  sel2 = createSelect();
  sel2.option('Select an application');
  sel2.option('Webcam');
  sel2.option('Random walks');
  sel2.changed(mySelectEvent2);
  sel2.parent('pic-choice');
  
  launch = createButton('Push here to use an ellipse to find a color gradient from the picture and use it in the chosen application');
  launch.mousePressed(ellipseEvent);
  launch.parent('launch');

}

var img;

function gotFile(file) {
  
  if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
    alert('This is not recognized as an image');
  } else {
    img = createImg(file.data).hide();
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

function mySelectEvent2() {
  var item = sel2.value();
  if (item != 'Select an application'){
    application = dictionary2[item];
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

var capture;

var cnv3;



function ellipseEvent() {
  if(!choice_done) {
    sel.hide();
    sel2.hide();
    inpt.hide();inpt2.hide();
    inp.hide();
    launch.hide();
    
    myGrad = new colorGrad(nsampling);
    myGrad.circleMethod();
    //myGrad.draw(100,25,200,50);
    
    app = createP('<h3>Application :</h3>');
    app.parent('canvas2');
    
    if (application === 0) {
      cnv3 = createCanvas(500,500);
      cnv3.parent('canvas2');
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
    } else if (application === 1) {
        capture = createCapture(VIDEO);
        cnv3 = createCanvas(320,240);
        cnv3.parent('canvas2');
        capture.parent('canvas2');
        capture.size(width/3, height/3);
        image(capture,0,0,width,height);
        
        button = createButton('Draw from video capture');
        button.mousePressed(drawCapt);
        button.parent('buttons');
        
        button3 = createButton('Save canvas (S)');
        button3.mousePressed(canvas_save);
        button3.parent('buttons');
        
        resolt = createP('Resolution');
        resolt.parent('col3');
        resol = createSlider(1,20,10,1);
        resol.parent('col3');
        
        gloopt = createP('Gradient loops');
        gloopt.parent('col3');
        gloop = createSlider(0.5,10,3,0.1);
        gloop.parent('col3');
        
        
        choice_done = true;
    }
    
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
    //console.log('pas bug',t);
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

function drawCapt() {
    cury = 0;
    image(capture,0,0,width,height);
}

var test = 0;

var cury = 0;

var lines = 1;

var stepSize = 10;

function applyGrad() {
    //capture.loadPixels();
    noStroke();
    
    if (cury<height) {
        var k = 0;
        while (k<lines) {
            for (var x=0; x<width; x+=resol.value()) {
              //var i = y * width + x;
              //var brightness = pixels[i*4] / 255;
              
              var co = get(x,cury);
              
              var moy = (co[0]+co[1]+co[2])/(255*3);
              
              
              //console.log('pas bug',pixels[i*4]);
              var c = myGrad.getColor(gloop.value()*moy);
              fill(c);
              rect(x, cury, resol.value(), resol.value());
            }
            cury += resol.value();
            k++;
        }
    }

    
    //capture.updatePixels();
}

var firstcapt = 0;

function draw() {
  
  if (application === 0) {
    if (choice_done) {
      for(var i = 0; i<NB_BALLS;i++){
        balls[i].move();
        balls[i].show();
      }
      //console.log(balls[0].pos.x,balls[0].pos.y);
      //ellipse(balls[0].pos.x,balls[0].pos.y,5,5);
    }
  } else if (choice_done && application === 1) {
    if(firstcapt ===0){
      cury = 0;
      image(capture,0,0,width,height);
      firstcapt++;
    }
    applyGrad();
    resolt.html('Resolution (squares size) : ' + resol.value());
    gloopt.html('Gradient loops : ' + gloop.value());
  }
}