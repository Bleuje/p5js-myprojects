var inc = 0.01;
var scl = 20;
var cols, rows;

var NB_PARTICLES = 250;

var zoff = 0;

var fr;

var particles = [];
var rectangles = [];

var GRAD = [];

var flowfield;

var WID = 800;
var HEI = 500;

var speedSlide,incSlider,forceNoiseSlider,forceMagSlider,brightSlider;
var button,button2,button3,button4,button5,button6,button7;
var redoSlider,blueoSlider,greenoSlider;

var defsel = 'line';
var bounce = false;
var color_noise = false;
var field_mode = 0;
var panels_are_there = true;

var playing = true;

var mode = 0;

var capture;

var color_mode = 'Normal';

function setup() {
  var cnv = createCanvas(max(50,windowWidth-225), HEI);
  cnv.style("border:1px solid #000000;");
  //var x = (windowWidth - width) / 2;
  //var y = (windowHeight - height) / 2;
  cnv.parent('canvas');
  cnv.style('z-index: 1')
  background(255);
  colorMode(RGB, 255);
  cols = floor(width / scl);
  rows = floor(height / scl);

  flowfield = new Array(cols * rows);
  
  var pseed = random();
  
  if (mode === 1) {
    for (var i = 0; i < NB_PARTICLES; i++) {
      rectangles[i] = new Rectangle(pseed);
    }
  } else {
    for (var i = 0; i < NB_PARTICLES; i++) {
      particles[i] = new Particle(pseed);
    }
  }
  background(255);
  
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
  button6 = createButton('New set of particles (N)');
  button6.mousePressed(new_particles);
  button6.parent('buttons');
  button7 = createButton('Rectangle mode On/Off (M)');
  button7.mousePressed(change_mode);
  button7.parent('buttons');
  
  button8 = createButton('Show/hide panels of parameters (X)');
  button8.mousePressed(disp_panels);
  button8.parent('buttons2');
  
  //div1.hide();
  
  part1 = createP('<h3>Physics</h3>');
  part1.parent('physics');

  
  part2 = createP('<h3>Interaction</h3>');
  part2.parent('interaction');
  
  part3 = createP('<h3>Drawing style</h3>');
  part3.parent('pen-colors');
  
  part4 = createP('<h3>Rectangle mode settings</h3>');
  part4.parent('rectangle-mode');
  
  part5 = createP('<h3>Custom color gradient</h3>');
  part5.parent('gradient');
  
  bounceCbox = createCheckbox('Border bounce',false);
  bounceCbox.parent('physics');
  bounceCbox.changed(myCheckedEvent);
  psel5 = createP('<strong>Field type :</strong>')
  psel5.parent('physics');
  sel5 = createSelect();
  sel5.parent('physics');
  sel5.option('Basic');
  sel5.option('Moving torus in 3D');
  sel5.changed(mySelectEvent5);
  
  
  psel = createP('<strong>Pen style :</strong>')
  psel.parent('pen-colors');
  sel = createSelect();
  sel.parent('pen-colors');
  sel.option('line');
  sel.option('circle');
  sel.option('square');
  sel.option('empty circle');
  sel.option('empty square');
  sel.changed(mySelectEvent);
  
  pp7a = createP('Pen size : ');
  pp7a.parent('pen-colors');
  penSizeSlider = createSlider(sqrt(5), sqrt(300), sqrt(40.0), 0.1);
  penSizeSlider.parent('pen-colors');
  pp7c = createP('Pen size noise : ');
  pp7c.parent('pen-colors');
  penNoiseSlider = createSlider(0, 1, 1, 0.01);
  penNoiseSlider.parent('pen-colors');
  
  stylestroke = createP('Stroke weight : ');
  stylestroke.parent('pen-colors');
  stylestroke.hide();
  penstrokeSlider = createSlider(1, 10, 1, 1);
  penstrokeSlider.parent('pen-colors');
  penstrokeSlider.hide();
  
  
  pp1 = createP('Speed : ');
  pp1.parent('physics');
  speedSlider = createSlider(0, 0.98, 0.7,0.02);
  speedSlider.parent('physics');
  pp2 = createP('Space size : ');
  pp2.parent('physics');
  incSlider = createSlider(0, sqrt(0.3), sqrt(inc),0.00001);
  incSlider.parent('physics');
  pp3 = createP('Force noise : ');
  pp3.parent('physics');
  forceNoiseSlider = createSlider(0, 10, 2.0, 0.1);
  forceNoiseSlider.parent('physics');
  pp4 = createP('Force field magnitude : ');
  pp4.parent('physics');
  forceMagSlider = createSlider(0, 10, 2.0, 0.1);
  forceMagSlider.parent('physics');
  pp5 = createP('Force field change rate : ');
  pp5.parent('physics');
  fieldChangeRateSlider = createSlider(0, sqrt(0.002), sqrt(0.00008), 0.0000001);
  fieldChangeRateSlider.parent('physics');
  pp6 = createP('Color gradient frequency : ');
  pp6.parent('pen-colors');
  colorGradientSlider = createSlider(0, sqrt(50), 1.0, 0.01);
  colorGradientSlider.parent('pen-colors');
  pp6bis = createP('Blend mode : ');
  pp6bis.parent('pen-colors');
  sel2 = createSelect();
  sel2.parent('pen-colors');
  sel2.option('BLEND (default)');
  sel2.option('ADD');
  sel2.option('DARKEST');
  sel2.option('LIGHTEST');
  sel2.option('DIFFERENCE');
  sel2.option('EXCLUSION');
  sel2.option('MULTIPLY');
  sel2.option('SCREEN');
  sel2.option('OVERLAY');
  sel2.option('DODGE');
  sel2.option('BURN');
  sel2.changed(mySelectEvent2);
  
  pp6bis = createP('Filter : ');
  pp6bis.parent('pen-colors');
  sel4 = createSelect();
  sel4.parent('pen-colors');
  sel4.option('NONE');
  sel4.option('GRAY');
  sel4.option('BLUR');
  sel4.option('DILATE');
  sel4.option('ERODE');
  sel4.changed(mySelectEvent4);
  
  console.log('test1');

  pp7b = createP('Color alpha : ');
  pp7b.parent('pen-colors');
  alphaSlider = createSlider(0, 1, 1, 0.001);
  alphaSlider.parent('pen-colors');
  p5_ = createP('Background fade : ');
  p5_.parent('pen-colors');
  fade1Slider = createSlider(0, 1, 0, 0.01);
  fade1Slider.parent('pen-colors');
  fade2Slider = createSlider(0, 255, 255, 1);
  fade2Slider.parent('pen-colors');
  pp8 = createP('Color contrast : ');
  pp8.parent('pen-colors');
  contrastSlider = createSlider(10, 300, 130, 1);
  contrastSlider.parent('pen-colors');
  pp8bis = createP('Color brightness : ');
  pp8bis.parent('pen-colors');
  brightSlider = createSlider(10, 275, 150, 1);
  brightSlider.parent('pen-colors');
  pp10 = createP('Particle color offset : ');
  pp10.parent('pen-colors');
  particleColorOffsetSlider = createSlider(0.1, 25, 1, 0.01);
  particleColorOffsetSlider.parent('pen-colors');
  noiseCbox = createCheckbox('Color noise',false);
  noiseCbox.parent('pen-colors');
  noiseCbox.changed(myCheckedEvent2);
  pp10bis = createP('Synchronized color noise : ');
  pp10bis.parent('pen-colors');
  colornoiseSlider = createSlider(0, 100, 0, 0.01);
  colornoiseSlider.parent('pen-colors');
  pp10t = createP('Noise \"frequency\" : ');
  pp10t.parent('pen-colors');
  noisefreqSlider = createSlider(0, 1, 0.2, 0.01);
  noisefreqSlider.parent('pen-colors');
  
  console.log('test2');
  
  pp11 = createP('X and Y bias : ');
  pp11.parent('physics');
  xbiasSlider = createSlider(-10, 10, 0, 0.1);
  xbiasSlider.parent('physics');
  ybiasSlider = createSlider(-10, 10, 0, 0.1);
  ybiasSlider.parent('physics');
  pp12 = createP('Swirl bias : ');
  pp12.parent('physics');
  sbiasSlider = createSlider(-5, 5, 0, 0.1);
  sbiasSlider.parent('physics');
  pp12 = createP('Swirl bias xy position, radius : ');
  pp12.parent('physics');
  sbiasXSlider = createSlider(0, width, width/2, 1);
  sbiasXSlider.parent('physics');
  sbiasYSlider = createSlider(0, height, height/2, 1);
  sbiasYSlider.parent('physics');
  sbiasRSlider = createSlider(-5.0, 5.0, -0.3, 0.01);
  sbiasRSlider.parent('physics');
  
  buttonbias = createButton('Remove bias');
  buttonbias.parent('physics');
  buttonbias.mousePressed(remove_bias);
  
  fr = createP('');
  fr.parent("buttons")
  
  console.log('test3');
  
  
  nbp = createP('Current number of particles : ' + NB_PARTICLES);
  nbp.parent('interaction');
  nbp2 = createP('Number of particles in the next set : ');
  nbp2.parent('interaction');
  particleNumberSlider = createSlider(1, sqrt(sqrt(3000)), sqrt(sqrt(250)), 0.01);
  particleNumberSlider.parent('interaction');
  
  /*
  psel3 = createP('<strong>Color mode :</strong>')
  psel3.position(710,520);
  sel3 = createSelect();
  sel3.position(710, 540);
  sel3.option('Normal');
  sel3.option('Capture');
  sel3.changed(mySelectEvent3);*/
  
  console.log('test31');
  
  p2 = createP('Mouse-click attraction/repulsion :');
  p2.parent('interaction');
  mouseSlider = createSlider(-5, 5, -1.4, 0.01);
  mouseSlider.parent('interaction');
  p2 = createP('Mouse-click swirl :');
  p2.parent('interaction');
  mouseSwirlSlider = createSlider(-4, 4, 0, 0.01);
  mouseSwirlSlider.parent('interaction');
  p3 = createP('Color offsets : ');
  p3.parent('pen-colors');
  redoSlider = createSlider(0, 5, 5*noise(10000), 0.01);
  redoSlider.parent('pen-colors');
  greenoSlider = createSlider(0, 5, 5*noise(20000), 0.01);
  greenoSlider.parent('pen-colors');
  blueoSlider = createSlider(0, 5, 5*noise(30000), 0.01);
  blueoSlider.parent('pen-colors');
  p3bis = createP('Specialized noise intensity : ');
  p3bis.parent('pen-colors');
  rednSlider = createSlider(0, 100, 0, 0.01);
  rednSlider.parent('pen-colors');
  greennSlider = createSlider(0, 100, 0, 0.01);
  greennSlider.parent('pen-colors');
  bluenSlider = createSlider(0, 100, 0, 0.01);
  bluenSlider.parent('pen-colors');
  p4 = createP('Color oscillation frequencies : ');
  p4bis = createP('(Align them or set them to 0 to get simpler color gradients)');
  p4.parent('pen-colors');
  p4bis.parent('pen-colors');
  redSlider = createSlider(0, 20, 3, 1);
  redSlider.parent('pen-colors');
  greenSlider = createSlider(0, 20, 3, 1);
  greenSlider.parent('pen-colors');
  blueSlider = createSlider(0, 20, 3, 1);
  blueSlider.parent('pen-colors');
  
  console.log('test32');
  
  p6 = createP('Maximum frame rate : ' + 40);
  p6.parent('interaction');
  framerateSlider = createSlider(1, 60, 40, 1);
  framerateSlider.parent('interaction');
  
  console.log('test321');
  
  p8 = createP('Rectangle stroke : ');
  p8.parent('rectangle-mode');
  
  console.log('test322');
  
  boxSlider = createSlider(0, 255, 50, 1);
  boxSlider.parent('rectangle-mode');
  box2Slider = createSlider(0, 255, 0, 1);
  box2Slider.parent('rectangle-mode');
  
  console.log('test323');
  
  p9 = createP('Freeze ratio : ');
  p9.parent('rectangle-mode');
  freezeSlider = createSlider(0, 100, 50, 1);
  freezeSlider.parent('rectangle-mode');
  
  console.log('test4');
  
  filterframe = createP('Filter every ' + 30 + ' frames : ');
  filterframe.parent('pen-colors');
  filterframe.hide();
  
  filterframeSlider = createSlider(1, 100, 30, 1);
  filterframeSlider.parent('pen-colors');
  filterframeSlider.hide();
  
    colornoiseSlider.hide();
    noisefreqSlider.hide();
    rednSlider.hide();
    greennSlider.hide();
    bluenSlider.hide();
    p3bis.hide();
    pp10t.hide();
    pp10bis.hide();
    
    disp_panels();
  
  console.log('test');
  
}

function mySelectEvent() {
  defsel = sel.value();
  if (defsel === 'empty square' || defsel === 'empty circle') {
    penstrokeSlider.show();
    stylestroke.show();
  } else {
    penstrokeSlider.hide();
    stylestroke.hide();
  }
}

function mySelectEvent2() {
  var choice = sel2.value();
  if (choice === 'BLEND (default)') {
    blendMode(BLEND);
  } else if (choice === 'ADD') {
    blendMode(ADD);
  } else if (choice === 'DARKEST') {
    blendMode(DARKEST);
  } else if (choice === 'LIGHTEST') {
    blendMode(LIGHTEST);
  } else if (choice === 'DIFFERENCE') {
    blendMode(DIFFERENCE);
  } else if (choice === 'EXCLUSION') {
    blendMode(EXCLUSION);
  } else if (choice === 'MULTIPLY') {
    blendMode(MULTIPLY);
  } else if (choice === 'SCREEN') {
    blendMode(SCREEN);
  } else if (choice === 'OVERLAY') {
    blendMode(OVERLAY);
  } else if (choice === 'DODGE') {
    blendMode(DODGE);
  } else if (choice === 'BURN') {
    blendMode(BURN);
  }
}

var dilate_unused = true;

function mySelectEvent4() {
  var choice = sel4.value();
  if (choice === 'NONE') {
    filterframe.hide();
    filterframeSlider.hide();
  } else if (choice === 'GRAY') {
    filter(GRAY);
    filterframe.hide();
    filterframeSlider.hide();
  } else if (choice === 'DILATE') {
    filterframe.show();
    filterframeSlider.show();
    if(frameCount%filterframeSlider.value() === 0)  {filter(DILATE);}
  } else if (choice === 'BLUR') {
    filterframe.show();
    filterframeSlider.show();
    if(frameCount%filterframeSlider.value() === 0) filter(BLUR,1);
  } else if (choice === 'ERODE') {
    filterframe.show();
    filterframeSlider.show();
    if(frameCount%filterframeSlider.value() === 0) filter(ERODE);
  }
}

function mySelectEvent5() {
  var choice = sel5.value();
  if (choice === 'Moving torus in 3D') {
    field_mode = 1;
  } else if (choice === 'Basic') {
    field_mode = 0;
  }
}

var capture;
/*
function mySelectEvent3() {
  var choice = sel3.value();
  if (choice === 'Normal') {
    color_mode = 'Normal';
    capture.remove();
  } else if (choice === 'Capture') {
    color_mode = 'Capture';
    capture = createCapture(VIDEO);
    capture.size(320, 240);
    image(capture, 0, 0, 320, 240);
    loadPixels();
    GRAD = new ColorG(1);
  }
}
*/
function clear_canvas() {
  blendMode(BLEND);
  background(fade2Slider.value());
  blendMode(curMode);
}

function change_color() {
  noiseSeed(12345*random());/*
  redoSlider = createSlider(0, 5, 5*noise(10000), 0.01);
  greenoSlider = createSlider(0, 5, 5*noise(20000), 0.01);
  blueoSlider = createSlider(0, 10, 5*noise(30000), 0.01);*/
  redoSlider.value(5*noise(10000));
  greenoSlider.value(5*noise(20000));
  blueoSlider.value(5*noise(30000));
}

function new_particles() {
  for(var i = NB_PARTICLES-1;i>=0;i--){
    particles.pop();
  }
  for(var i = NB_PARTICLES-1;i>=0;i--){
    rectangles.pop();
  }
  NB_PARTICLES = int(particleNumberSlider.value()*particleNumberSlider.value()*particleNumberSlider.value()*particleNumberSlider.value());
  var pseed = random();
  if (mode === 0) {
    for(var i = 0;i<NB_PARTICLES;i++){
      particles[i] = new Particle(pseed);
    }
  } else {
    for(var i = 0;i<NB_PARTICLES;i++){
      rectangles[i] = new Rectangle(pseed);
    }
  }
}

function remove_bias() {
  xbiasSlider.value(0);
  ybiasSlider.value(0);
  sbiasSlider.value(0);
  sbiasXSlider.value(width/2);
  sbiasYSlider.value(height/2);
  sbiasRSlider.value(-0.3);
}

function myCheckedEvent() {
  if (this.checked()) {
    bounce = true;
    console.log("Checking!");
  } else {
    bounce = false;
    console.log("Unchecking!");
  }
}

function myCheckedEvent2() {
  if (this.checked()) {
    color_noise = true;
    colornoiseSlider.show();
    noisefreqSlider.show();
    rednSlider.show();
    greennSlider.show();
    bluenSlider.show();
    p3bis.show();
    pp10t.show();
    pp10bis.show();
    console.log("Checking!");
  } else {
    color_noise = false;
    colornoiseSlider.hide();
    noisefreqSlider.hide();
    rednSlider.hide();
    greennSlider.hide();
    bluenSlider.hide();
    p3bis.hide();
    pp10t.hide();
    pp10bis.hide();
    console.log("Unchecking!");
  }
}

function reset() {
    location.reload();
    seedRandom();
    seedNoise();
}

function disp_panels() {
  if (panels_are_there) {
    document.getElementById('physics').style.display = 'none';
    document.getElementById('interaction').style.display = 'none';
    document.getElementById('pen-colors').style.display = 'none';
    document.getElementById('rectangle-mode').style.display = 'none';
    document.getElementById('void').style.display = 'block';
  } else {
    document.getElementById('physics').style.display = 'block';
    document.getElementById('interaction').style.display = 'block';
    document.getElementById('pen-colors').style.display = 'block';
    document.getElementById('rectangle-mode').style.display = 'block';
    document.getElementById('void').style.display = 'none';
  }
  panels_are_there = !panels_are_there;
}

function change_mode() {
    mode = (mode + 1) % 2;
    new_particles();
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
  } else if (key === 'n') {
    new_particles();
  } else if (key === 'm') {
    change_mode();
  } else if (key === 'x') {
    disp_panels();
  }
}

function canvas_save() {
  saveCanvas('myCanvas', 'png');
}

var z_xoff = 0;
var z_yoff = 0;
var z_zoff = 0;


function draw() {
  /*
  if(color_mode === 'Capture'){
    image(capture, 0, 0, 320, 240);
    loadPixels();
    GRAD = new ColorG(1);
  }*/
  
  blendMode(BLEND);
  
  var aux = fade1Slider.value();
  background(fade2Slider.value(),255*aux*aux*aux);
  
  mySelectEvent2();
  
  if (field_mode === 0) {
    var yoff = 0;
    for (var y = 0; y < rows; y++) {
      var xoff = 0;
      for (var x = 0; x < cols; x++) {
        var index = x + y * cols;
        var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
        var v = p5.Vector.fromAngle(angle);
        v.setMag(forceMagSlider.value());
        flowfield[index] = v;
        xoff += incSlider.value()*incSlider.value();
      }
      yoff += incSlider.value()*incSlider.value();
  
      zoff += fieldChangeRateSlider.value()*fieldChangeRateSlider.value();
  
    }
  } else {  
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var index = x + y * cols;
        
        var t = x/cols;
        var t2 = y/rows;
        var radius_x = 0.6*incSlider.value()*cols/(2*PI);
        var radius_y = 0.5*incSlider.value()*rows/(2*PI);
        var r = radius_x + radius_y*cos(2*PI*t2);
        var xx = r*cos(2*PI*t);
        var yy = r*sin(2*PI*t);
        var zz = radius_y*sin(2*PI*t2);
  
        var angle = noise(xx + z_xoff, yy + z_yoff, zz + z_zoff) * TWO_PI * 4;
        var v = p5.Vector.fromAngle(angle);
        v.setMag(forceMagSlider.value());
        flowfield[index] = v;
      }
      //zoff += fieldChangeRateSlider.value()*fieldChangeRateSlider.value();
      z_xoff += 2*random()*fieldChangeRateSlider.value()*fieldChangeRateSlider.value();
      z_yoff += 2*random()*fieldChangeRateSlider.value()*fieldChangeRateSlider.value();
      z_zoff += 2*random()*fieldChangeRateSlider.value()*fieldChangeRateSlider.value();
    }
  }

  if (mode === 0) {
    for (var i = 0; i < particles.length; i++) {
      particles[i].follow(flowfield);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }
  } else {
    for (var i = 0; i < rectangles.length; i++) {
      rectangles[i].follow(flowfield);
      rectangles[i].update();
      rectangles[i].edges();
      rectangles[i].show();
    }
  }
  
  mySelectEvent4();
  
  frameRate(framerateSlider.value());

  fr.html("FPS : " + floor(frameRate()));
  p6.html('Max frame rate : ' + framerateSlider.value());
  
  nbp.html('Current number of particles : ' + NB_PARTICLES);
  nbp2.html('Number of particles in the next set : ' + int(particleNumberSlider.value()*particleNumberSlider.value()*particleNumberSlider.value()*particleNumberSlider.value()));

  filterframe.html('Filter every ' + filterframeSlider.value() + ' frames : ');
}
