var ESZ = 1;
var COPIES = 40;
var RRR = 255;
var GGG = 255;
var BBB = 255;
var TRANSP = 200;

var BG_color = 0;

var prevx = 0;
var prevy = 0;
var p_prevx = 0;
var p_prevy = 0;

var lining = false;
var lining_base = true;

var particle_mode = false;
var particle_rt = 0.5;
var particle_theta = 0;

function setup() {
  var cnv = createCanvas(600, 600);
  //cnv.style('width: 100%;margin: 0;justify-content: center;')
  cnv.parent('canvas');
  background(BG_color);
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
  button5 = createButton('Invert colors (I)');
  button5.mousePressed(invert_colors);
  button5.parent('buttons');
  button6 = createButton('Point connexion on/off (P)');
  button6.mousePressed(connexion);
  button6.parent('buttons');
  button7 = createButton('Use particle on/off (U)');
  button7.mousePressed(use_particle);
  button7.parent('buttons');
  
  copiesText = createP('Number of copies');
  copiesText.parent('settings');
  sCOPIES = createSlider(1,100,COPIES,1);
  sCOPIES.parent('settings');
  sizeText = createP('Pen size');
  sizeText.parent('settings');
  sESZ = createSlider(0.1,5,ESZ,0.1);
  sESZ.parent('settings');
  trText = createP('Pen alpha');
  trText.parent('settings');
  sTRANSP = createSlider(0,255,TRANSP,1);
  sTRANSP.parent('settings');
  colorText = createP('Color (red,green,blue components)');
  colorText.parent('settings');
  sRRR = createSlider(0,255,RRR,1);
  sRRR.parent('settings');
  sGGG = createSlider(0,255,GGG,1);
  sGGG.parent('settings');
  sBBB = createSlider(0,255,BBB,1);
  sBBB.parent('settings');
  
  sBG_colorText = createP('Background color');
  sBG_colorText.parent('settings');
  sBG_color = createSlider(0,255,BG_color,1);
  sBG_color.parent('settings');
  
  sFadeText = createP('Background fade');
  sFadeText.parent('settings');
  sFade = createSlider(0,255,0,1);
  sFade.parent('settings');
  
  cnvText = createP('Canvas size');
  cnvText.parent('settings');
  cnvSlider = createSlider(250,1000,600,1);
  cnvSlider.parent('settings');
  cnvSlider.changed(cnvChangeEvent);
  
  radText = createP('Radius (min,max,variation frequency)');
  sRtmin = createSlider(-0.5,0.5,-0.25,0.01);
  sRtmax = createSlider(0.25,2,1.5,0.01);
  sRfreq = createSlider(0.0001,0.02,0.01,0.0001);
  radText.parent('psettings');
  sRtmin.parent('psettings');
  sRtmax.parent('psettings');
  sRfreq.parent('psettings');
  
  thetaText = createP('Angle variation (min,max,variation frequency)');
  sThetamin = createSlider(-3,0.5,-1,0.01);
  sThetamax = createSlider(-0.5,3,1,0.01);
  sThetafreq = createSlider(0.0001,0.05,0.01,0.0001);
  thetaText.parent('psettings');
  sThetamin.parent('psettings');
  sThetamax.parent('psettings');
  sThetafreq.parent('psettings');
  
  
}

function cnvChangeEvent() {
    var sz = cnvSlider.value();
    
    cnv = createCanvas(sz,sz);
    cnv.parent('canvas');
    background(sBG_color.value());
    console.log(sz);
}

function clear_canvas() {
  background(sBG_color.value());
}

function canvas_save() {
  saveCanvas('myCanvas', 'png');
}

function invert_colors() {
  filter(INVERT);
}

function connexion() {
  lining_base = !lining_base;
}

function use_particle() {
  particle_mode = !particle_mode;
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
  } else if (key === 'i') {
    invert_colors();
  } else if (key === 'p') {
    connexion();
  } else if (key === 'u') {
    use_particle();
  }
}


function draw_point() {
    if (mouseX>=0 && mouseY>=0 && mouseX<=width && mouseY<=height) {
        var c = color(sRRR.value(),sGGG.value(),sBBB.value(),sTRANSP.value());
        
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
}

function draw_point_particle() {
        var c = color(sRRR.value(),sGGG.value(),sBBB.value(),sTRANSP.value());
        mx2 = width/2*particle_rt*cos(particle_theta);
        my2 = height/2*particle_rt*sin(particle_theta);
        noStroke();
        fill(c);
        for(var i=0;i<sCOPIES.value();i++){
          var theta = i*TWO_PI/sCOPIES.value();
          var xp = mx2*cos(theta) - my2*sin(theta);
          var yp = mx2*sin(theta) + my2*cos(theta);
          ellipse(xp+width,yp+height,sESZ.value());
        }
        p_prevx = mx2;
        p_prevy = my2;
}

function draw_line() {
    if (!lining) {
        draw_point();
        if (mouseX>=0 && mouseY>=0 && mouseX<=width && mouseY<=height) lining = lining_base;
    } else {
      var c = color(sRRR.value(),sGGG.value(),sBBB.value(),sTRANSP.value());
      
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
      
      lining = lining_base;
    }
}

function draw_line_particle() {
    if (!lining_particle) {
        draw_point_particle();
        lining_particle = lining_base;
    } else {
      var c = color(sRRR.value(),sGGG.value(),sBBB.value(),sTRANSP.value());
      
      mx2 = width/2*particle_rt*cos(particle_theta);
      my2 = height/2*particle_rt*sin(particle_theta);
      fill(c);
      strokeWeight(sESZ.value());
      stroke(c);
      for(var i=0;i<sCOPIES.value();i++){
        var theta = i*TWO_PI/sCOPIES.value();
        var xp = mx2*cos(theta) - my2*sin(theta);
        var yp = mx2*sin(theta) + my2*cos(theta);
        var xp2 = p_prevx*cos(theta) - p_prevy*sin(theta);
        var yp2 = p_prevx*sin(theta) + p_prevy*cos(theta);
        line(xp2+width,yp2+height,xp+width,yp+height);
      }
      p_prevx = mx2;
      p_prevy = my2;

      lining_particle = lining_base;
    }
}

function draw() {
    background(sBG_color.value(),(sFade.value()/255.0)*(sFade.value()/255.0)*255);
    translate(-width/2,-height/2);
  
    if (mouseIsPressed) {
        draw_line();
    } else {
      lining = false;
    }
    
    if (particle_mode) {
        draw_line_particle();
    } else {
      lining_particle = false;
    }
    
    particle_rt = lerp(sRtmin.value(),sRtmax.value(),noise(sRfreq.value()*frameCount));
    particle_theta += lerp(sThetamin.value(),sThetamax.value(),noise(sThetafreq.value()*frameCount + 1000))/COPIES;
}
