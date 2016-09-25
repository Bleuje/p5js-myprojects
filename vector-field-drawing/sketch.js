function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var inc = 0.01;
var scl = 20;
var cols, rows;

var NB_PARTICLES = 250;

var zoff = 0;

var fr;

var particles = [];
var rectangles = [];

var flowfield;

var WID = 800;
var HEI = 400;

var speedSlide,incSlider,forceNoiseSlider,forceMagSlider,brightSlider;
var button,button2,button3,button4,button5,button6,button7;
var redoSlider,blueoSlider,greenoSlider;

var defsel = 'line';
var bounce = false;
var color_noise = false;
var field_mode = getRandomInt(0, 1);
var panels_are_there = 0;

var found_grad = false;

var playing = true;

var mode = 0;

var capture;

var color_mode = 'Normal';

var csize = 0;
var csize_mod = 4;
var bpixels = 250;
var pixelsadd = 100;
//var pixtab = ['800px','900px','1000px','1100px'];
//var pixtab = ['500px','500px','5000px','500px'];

var cnv;

var myGrad;
var nsampling = 200;

function setup() {
  cnv = createCanvas(max(50,windowWidth-bpixels), HEI + csize*pixelsadd);
  cnv.style("border:1px solid #000000;");
  cnv.parent('canvas');
  cnv.style('z-index: 1')
  background(255);
  colorMode(RGB, 255);
  cols = floor(width / scl);
  rows = floor(height / scl);
  
  buttonr = createButton('Change canvas size');
  buttonr.mousePressed(resizec);
  buttonr.style('width:75%')
  buttonr.parent('button3');
  vdp = createP('</br></br>');
  vdp.parent('button3');
  buttonr.class('btn btn-primary');
  //document.getElementById('void').style.height = pixtab[csize];

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
  
  console.log('test104');
  
  button = createButton('Reset [R]');
  button.mousePressed(reset);
  button.parent('buttons');
  button.style('font-size: 1.3em;');
  button.class('btn btn-default');
  button2 = createButton('Pause/Play [P]');
  button2.mousePressed(pause_play);
  button2.parent('buttons');
  button2.style('font-size: 1.3em;');
  button2.class('btn btn-default');
  button3 = createButton('Save canvas [S]');
  button3.mousePressed(canvas_save);
  button3.parent('buttons0');
  button3.class('btn btn-default');
  button4 = createButton('Clear canvas [C]');
  button4.mousePressed(clear_canvas);
  button4.parent('buttons0');
  button4.class('btn btn-default');
  button5 = createButton('Change color gradient [G]');
  button5.mousePressed(change_color);
  button5.parent('buttons0');
  button5.class('btn btn-default');
  button6 = createButton('New set of particles [N]');
  button6.mousePressed(new_particles);
  button6.parent('buttons0');
  button6.class('btn btn-default');
  button7 = createButton('Rectangle mode On/Off [M]');
  button7.mousePressed(change_mode);
  button7.parent('buttons0');
  button7.class('btn btn-default');
  
  console.log('test1041');
  
  button8 = createButton('<strong>Physics</strong> panel [1]');
  button8.mousePressed(disp_panel_phys);
  button8.parent('buttons2');
  button8.class('btn btn-default');
  button9 = createButton('<strong>Drawing style</strong> panel [2]');
  button9.mousePressed(disp_panel_draw);
  button9.parent('buttons2');
  button9.class('btn btn-default');
  button10 = createButton('<strong>Interaction/Misc.</strong> panel [3]');
  button10.mousePressed(disp_panel_inter);
  button10.parent('buttons2');
  button10.class('btn btn-default');
  button11 = createButton('<strong>Rectangle mode</strong> panel [4]');
  button11.mousePressed(disp_panel_rect);
  button11.parent('buttons2');
  button11.class('btn btn-default');
  button12 = createButton('<strong>Color gradient extraction</strong> panel [5]');
  button12.mousePressed(disp_panel_grad);
  button12.parent('buttons2');
  button12.class('btn btn-default');
  button13 = createButton('Hide panels [H]');
  button13.mousePressed(hidepanels);
  button13.parent('buttons2');
  button13.style('background-color: #aaaaaa;border: #000000');
  button13.class('btn btn-primary');
  
  console.log('test1042');
  //div1.hide();
  
  part1 = createP('<h3>Physics</h3>');
  part1.parent('physics1');


  
  part2 = createP('<h3>Miscellaneous</h3>');
  part2.parent('mouse');
    
  p6a = createP('<h4>Performance settings</h4>');
  p6a.parent('performance');
  

  
  part3 = createP('<h3>Drawing style</h3>');
  part3.parent('pen');

  part31 = createP('<h4>Color settings</h4>');
  part31.parent('color1');
  part32 = createP('<h4>Color gradient</h4>');
  part32.parent('color2');
  part32 = createP('<h4>Color noise settings</h4>');
  part32.parent('colorn');
  
  part4 = createP('<h3>Rectangle mode settings</h3>');
  part4.parent('rectangle-mode');
  
    
      console.log('test1043');
  
  part5 = createP('<h3>Custom color gradient</h3>');
  part5.parent('gradient1');
  
  console.log('test103');
  
  pp1a = createP('<h4>Particle settings</h4>');
  pp1a.parent('physics1');
  
  
  inpt = createP('</br> Use your own picture to paint the canvas : ');
  inpt.parent('gradient1');
  inp = createFileInput(gotFile);
  inp.parent('gradient1');
  inpt2 = createP('</br>');
  inpt2.parent('gradient1');
  methodt = createP('Choose a method :');
  methodt.parent('gradient1');
  methods = createSelect();
  methods.option('ellipse');
  methods.option('random sampling');
  methods.parent('gradient1');
  methodt2 = createP('Number of points used : ' + nsampling);
  methodt2.parent('gradient1');
  complSlider = createSlider(5,nsampling*3,nsampling,1);
  complSlider.parent('gradient1');
  complSlider.changed(complSliderEvent);
  buttonellipset = createP('Find a color gradient from the canvas </br> with the chosen method :');
  buttonellipset.parent('gradient1');
    buttonellipse = createButton('Go !');
    buttonellipse.mousePressed(findGradEvent);
  buttonellipse.parent('gradient1');
  
    buttonbackg = createButton('Go back to normal color gradient');
    buttonbackg.mousePressed(backgEvent);
  buttonbackg.parent('gradient1');
  
  optiT = createP('<h4>Color gradient optimization</h4>');
  optiT.parent('opti');
  optiT2 = createP('<em>(My method : Traveling Salesman Problem in RGB space :^) )<em>');
  optiT2.parent('opti');
    buttonoptg = createButton('Optimize order with local search');
    buttonoptg.mousePressed(optimizeEvent);
  buttonoptg.parent('opti');
    transpoSlidert = createP('Number of tried transposition </br> when the button is pushed : ' + 2000);
  transpoSlidert.parent('opti');
  transpoSlidert.changed(transpoSliderEvent);
  transpoSlider = createSlider(100,10000,2000,1);
  transpoSlider.parent('opti');
  
  bounceCbox = createCheckbox('Border bounce',false);
  bounceCbox.parent('physics1');
  bounceCbox.changed(myCheckedEvent);
  
  pp1 = createP('Particle speed : ');
  pp1.parent('physics1');
  speedSlider = createSlider(0, 0.98, 0.7,0.02);
  speedSlider.parent('physics1');
  nbp = createP('Current number of particles : ' + NB_PARTICLES);
  nbp.parent('physics1');
  nbp2 = createP('Number of particles in the next set : ');
  nbp2.parent('physics1');
  particleNumberSlider = createSlider(1, sqrt(sqrt(3000)), sqrt(sqrt(250)), 0.01);
  particleNumberSlider.parent('physics1');
  particleNumberSlider.changed(particleNumberSliderEvent);
  
  psel5a = createP('<h4>Force field settings</h4>');
  psel5a.parent('physicsf');
  
  psel5 = createP('<strong>Field type :</strong>')
  psel5.parent('physicsf');
  sel5 = createSelect();
  sel5.parent('physicsf');
  if (field_mode === 0) {
    sel5.option('Basic');
    sel5.option('Moving torus in 3D');
  } else {
    sel5.option('Moving torus in 3D');
    sel5.option('Basic');
  }
  
  sel5.changed(mySelectEvent5);
  
  console.log('test102');
  
  
  psel = createP('<h4>Pen settings</h4> Pen style :')
  psel.parent('pen');
  sel = createSelect();
  sel.parent('pen');
  sel.option('line');
  sel.option('circle');
  sel.option('square');
  sel.option('empty circle');
  sel.option('empty square');
  sel.changed(mySelectEvent);
  
  pp7a = createP('Pen size : ');
  pp7a.parent('pen');
  penSizeSlider = createSlider(sqrt(5), sqrt(300), sqrt(40.0), 0.1);
  penSizeSlider.parent('pen');
  pp7c = createP('Pen size noise : ');
  pp7c.parent('pen');
  penNoiseSlider = createSlider(0, 1, 1, 0.01);
  penNoiseSlider.parent('pen');
  
  stylestroke = createP('Stroke weight : ');
  stylestroke.parent('pen');
  stylestroke.hide();
  penstrokeSlider = createSlider(1, 10, 1, 1);
  penstrokeSlider.parent('pen');
  penstrokeSlider.hide();
  
  console.log('test101');
  
  pp2 = createP('Space size : ');
  pp2.parent('physicsf');
  incSlider = createSlider(0, sqrt(0.3), sqrt(inc),0.00001);
  incSlider.parent('physicsf');
  pp3 = createP('Force noise : ');
  pp3.parent('physicsf');
  forceNoiseSlider = createSlider(0, 10, 2.0, 0.1);
  forceNoiseSlider.parent('physicsf');
  pp4 = createP('Force field magnitude : ');
  pp4.parent('physicsf');
  forceMagSlider = createSlider(0, 10, 2.0, 0.1);
  forceMagSlider.parent('physicsf');
  pp5 = createP('Force field change rate : ');
  pp5.parent('physicsf');
  fieldChangeRateSlider = createSlider(0, sqrt(0.002), sqrt(0.00008), 0.0000001);
  fieldChangeRateSlider.parent('physicsf');
  pp6 = createP('Color gradient frequency : ');
  pp6.parent('color2');
  colorGradientSlider = createSlider(0, sqrt(50), 1.0, 0.01);
  colorGradientSlider.parent('color2');

  
  console.log('test1');

  pp7b = createP('Color alpha : ');
  pp7b.parent('color1');
  alphaSlider = createSlider(0, 1, 1, 0.001);
  alphaSlider.parent('color1');
  p5_ = createP('Background fade : ');
  p5_.parent('color1');
  fade1Slider = createSlider(0, 1, 0, 0.01);
  fade1Slider.parent('color1');
  fade2Slider = createSlider(0, 255, 255, 1);
  fade2Slider.parent('color1');
  pp8 = createP('Color contrast : ');
  pp8.parent('color1');
  contrastSlider = createSlider(10, 300, 130, 1);
  contrastSlider.parent('color1');
  pp8bis = createP('Color brightness : ');
  pp8bis.parent('color1');
  brightSlider = createSlider(10, 275, 150, 1);
  brightSlider.parent('color1');
  pp10 = createP('Particle color offset : ');
  pp10.parent('color2');
  particleColorOffsetSlider = createSlider(0.1, 25, 1, 0.01);
  particleColorOffsetSlider.parent('color2');
  noiseCbox = createCheckbox('Color noise',false);
  noiseCbox.parent('colorn');
  noiseCbox.changed(myCheckedEvent2);
  pp10bis = createP('Synchronized color noise : ');
  pp10bis.parent('colorn');
  colornoiseSlider = createSlider(0, 100, 0, 0.01);
  colornoiseSlider.parent('colorn');
  pp10t = createP('Noise \"frequency\" : ');
  pp10t.parent('colorn');
  noisefreqSlider = createSlider(0, 1, 0.2, 0.01);
  noisefreqSlider.parent('colorn');
  
  console.log('test2');
  
  pp11a = createP('<h4>Field bias</h4>');
  pp11a.parent('physics2');
  pp11 = createP('X and Y bias : ');
  pp11.parent('physics2');
  xbiasSlider = createSlider(-10, 10, 0, 0.1);
  xbiasSlider.parent('physics2');
  ybiasSlider = createSlider(-10, 10, 0, 0.1);
  ybiasSlider.parent('physics2');
  pp12 = createP('Swirl bias : ');
  pp12.parent('physics2');
  sbiasSlider = createSlider(-5, 5, 0, 0.1);
  sbiasSlider.parent('physics2');
  pp12 = createP('Swirl bias xy position, radius : ');
  pp12.parent('physics2');
  sbiasXSlider = createSlider(0, width, width/2, 1);
  sbiasXSlider.parent('physics2');
  sbiasYSlider = createSlider(0, height, height/2, 1);
  sbiasYSlider.parent('physics2');
  sbiasRSlider = createSlider(-5.0, 5.0, -0.3, 0.01);
  sbiasRSlider.parent('physics2');
  
  buttonbias = createButton('Remove bias');
  buttonbias.parent('physics2');
  buttonbias.mousePressed(remove_bias);
  
  fr = createP('');
  fr.parent("buttons00")
  
  console.log('test31');
  
  p2a = createP('<h4>Mouse-click parameters</h4>');
  p2a.parent('mouse');
  p2 = createP('Mouse-click attraction/repulsion :');
  p2.parent('mouse');
  mouseSlider = createSlider(-5, 5, -1.4, 0.01);
  mouseSlider.parent('mouse');
  p2 = createP('Mouse-click swirl :');
  p2.parent('mouse');
  mouseSwirlSlider = createSlider(-4, 4, 0, 0.01);
  mouseSwirlSlider.parent('mouse');
  p3 = createP('Color offsets : ');
  p3.parent('color2');
  redoSlider = createSlider(0, 5, 5*noise(10000), 0.01);
  redoSlider.parent('color2');
  greenoSlider = createSlider(0, 5, 5*noise(20000), 0.01);
  greenoSlider.parent('color2');
  blueoSlider = createSlider(0, 5, 5*noise(30000), 0.01);
  blueoSlider.parent('color2');
  p3bis = createP('Specialized noise intensity : ');
  p3bis.parent('colorn');
  rednSlider = createSlider(0, 100, 0, 0.01);
  rednSlider.parent('colorn');
  greennSlider = createSlider(0, 100, 0, 0.01);
  greennSlider.parent('colorn');
  bluenSlider = createSlider(0, 100, 0, 0.01);
  bluenSlider.parent('colorn');
  p4 = createP('Color oscillation frequencies : ');
  p4bis = createP('(Align them or set them to 0 to get simpler color gradients)');
  p4.parent('color2');
  p4bis.parent('color2');
  redSlider = createSlider(0, 20, 3, 1);
  redSlider.parent('color2');
  greenSlider = createSlider(0, 20, 3, 1);
  greenSlider.parent('color2');
  blueSlider = createSlider(0, 20, 3, 1);
  blueSlider.parent('color2');
  
  console.log('test32');

  p6 = createP('Maximum frame rate : ' + 40);
  p6.parent('performance');
  framerateSlider = createSlider(1, 60, 40, 1);
  framerateSlider.parent('performance');
  
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
  
  pp6bis = createP('<h4>Effects</h4> ');
  pp6bis.parent('pen');
  pp6bis = createP('Blend mode : ');
  pp6bis.parent('pen');
  sel2 = createSelect();
  sel2.parent('pen');
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
  pp6bis.parent('pen');
  sel4 = createSelect();
  sel4.parent('pen');
  sel4.option('NONE');
  sel4.option('GRAY');
  sel4.option('BLUR');
  sel4.option('DILATE');
  sel4.option('ERODE');
  sel4.changed(mySelectEvent4);
  
  filterframe = createP('Filter every ' + 30 + ' frames : ');
  filterframe.parent('pen');
  filterframe.hide();
  
  filterframeSlider = createSlider(1, 100, 30, 1);
  filterframeSlider.parent('pen');
  filterframeSlider.hide();
  
  meffectCbox = createCheckbox('Effect with panels',false);
  meffectCbox.parent('mouse');
  meffectCbox.changed(myCheckedEvent);
    
    disp_panel_phys();
    disp_panel_phys();
  
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

function resizec() {
  csize = (csize + 1)%csize_mod;
  cnv.remove();
  cnv = createCanvas(max(50,windowWidth-bpixels), HEI + csize*pixelsadd);
  cnv.style("border:1px solid #000000;");
  cnv.parent('canvas');
  cnv.style('z-index: 1');
  cnv.parent('canvas');
  //document.getElementById('void').style.height = pixtab[csize];
  cols = floor(width / scl);
  rows = floor(height / scl);
  background(255);
  //cnv.resize(max(50,windowWidth-225), HEI + csize*200);
}

var capture;

function clear_canvas() {
  blendMode(BLEND);
  background(fade2Slider.value());
  mySelectEvent2();
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
  } else {
    color_noise = false;
  }
}

function reset() {
    location.reload();
    seedRandom();
    seedNoise();
}

function disp_panel_phys() {
  if (panels_are_there===1) {
    document.getElementById('physics').style.display = 'none';
    document.getElementById('interaction').style.display = 'none';
    document.getElementById('pen-colors').style.display = 'none';
    document.getElementById('rectangle-mode').style.display = 'none';
    document.getElementById('gradient').style.display = 'none';
    document.getElementById("buttons2").before = true;
    //document.getElementById('void').style.display = 'block';
    panels_are_there = 0;
  } else {
    document.getElementById('physics').style.display = 'block';
    document.getElementById('interaction').style.display = 'none';
    document.getElementById('pen-colors').style.display = 'none';
    document.getElementById('rectangle-mode').style.display = 'none';
    document.getElementById('gradient').style.display = 'none';
    //document.getElementById('void').style.display = 'none';
    panels_are_there = 1;
  }
}

function disp_panel_draw() {
  if (panels_are_there===2) {
    document.getElementById('physics').style.display = 'none';
    document.getElementById('interaction').style.display = 'none';
    document.getElementById('pen-colors').style.display = 'none';
    document.getElementById('rectangle-mode').style.display = 'none';
    document.getElementById('gradient').style.display = 'none';
    document.getElementById("buttons2").before = true;
    //document.getElementById('void').style.display = 'block';
    panels_are_there = 0;
  } else {
    document.getElementById('physics').style.display = 'none';
    document.getElementById('interaction').style.display = 'none';
    document.getElementById('pen-colors').style.display = 'block';
    document.getElementById('rectangle-mode').style.display = 'none';
    document.getElementById('gradient').style.display = 'none';
    //document.getElementById('void').style.display = 'none';
    panels_are_there = 2;
  }
}

function disp_panel_inter() {
  if (panels_are_there===3) {
    document.getElementById('physics').style.display = 'none';
    document.getElementById('interaction').style.display = 'none';
    document.getElementById('pen-colors').style.display = 'none';
    document.getElementById('rectangle-mode').style.display = 'none';
    document.getElementById('gradient').style.display = 'none';
    document.getElementById("buttons2").before = true;
    //document.getElementById('void').style.display = 'block';
    panels_are_there = 0;
  } else {
    document.getElementById('physics').style.display = 'none';
    document.getElementById('interaction').style.display = 'block';
    document.getElementById('pen-colors').style.display = 'none';
    document.getElementById('rectangle-mode').style.display = 'none';
    document.getElementById('gradient').style.display = 'none';
    //document.getElementById('void').style.display = 'none';
    panels_are_there = 3;
  }
}

function disp_panel_rect() {
  if (panels_are_there===4) {
    document.getElementById('physics').style.display = 'none';
    document.getElementById('interaction').style.display = 'none';
    document.getElementById('pen-colors').style.display = 'none';
    document.getElementById('rectangle-mode').style.display = 'none';
    document.getElementById('gradient').style.display = 'none';
    document.getElementById("buttons2").before = true;
    //document.getElementById('void').style.display = 'block';
    panels_are_there = 0;
  } else {
    document.getElementById('physics').style.display = 'none';
    document.getElementById('interaction').style.display = 'none';
    document.getElementById('pen-colors').style.display = 'none';
    document.getElementById('rectangle-mode').style.display = 'block';
    document.getElementById('gradient').style.display = 'none';
    //document.getElementById('void').style.display = 'none';
    panels_are_there = 4;
  }
}

function disp_panel_grad() {
  if (panels_are_there===5) {
    document.getElementById('physics').style.display = 'none';
    document.getElementById('interaction').style.display = 'none';
    document.getElementById('pen-colors').style.display = 'none';
    document.getElementById('rectangle-mode').style.display = 'none';
    document.getElementById('gradient').style.display = 'none';
    document.getElementById("buttons2").before = true;
    //document.getElementById('void').style.display = 'block';
    panels_are_there = 0;
  } else {
    document.getElementById('physics').style.display = 'none';
    document.getElementById('interaction').style.display = 'none';
    document.getElementById('pen-colors').style.display = 'none';
    document.getElementById('rectangle-mode').style.display = 'none';
    document.getElementById('gradient').style.display = 'block';
    //document.getElementById('void').style.display = 'none';
    panels_are_there = 5;
  }
}

function hidepanels() {
    document.getElementById('physics').style.display = 'none';
    document.getElementById('interaction').style.display = 'none';
    document.getElementById('pen-colors').style.display = 'none';
    document.getElementById('rectangle-mode').style.display = 'none';
    document.getElementById('gradient').style.display = 'none';
    document.getElementById('void').style.display = 'block';
    document.getElementById("buttons2").before = true;
    panels_are_there = 0;
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
  } else if (key === '1') {
    disp_panel_phys();
  } else if (key === '2') {
    disp_panel_draw();
  } else if (key === '3') {
    disp_panel_inter();
  } else if (key === '4') {
    disp_panel_rect();
  } else if (key === '5') {
    disp_panel_grad();
  } else if (key === 'h') {
    hidepanels();
  }
}

function canvas_save() {
  saveCanvas('myCanvas', 'png');
}

var img;

function gotFile(file) {
  
  if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
    alert('This is not recognized as an image');
  } else {
    img = createImg(file.data).hide();
      image(img,0,0,width,height);
  }
}

function findGradEvent() {
  if(methods.value() === 'ellipse') {
    ellipseEvent();
  } else if (methods.value() === 'random sampling') {
    samplingEvent();
  }
    found_grad = true;
}

function ellipseEvent() {
  if(found_grad) {
    myGrad = new colorGrad(complSlider.value());
    myGrad.ellipseMethod();
    color_mode = 'custom';
  }
}

function samplingEvent() {
  if(found_grad) {
    myGrad = new colorGrad(complSlider.value());
    myGrad.samplingMethod();
    color_mode = 'custom';
  }
}

function optimizeEvent() {
  if(found_grad) {
    console.log('I am there');
    myGrad.optimizeOrder(transpoSlider.value());
  }
}

function transpoSliderEvent() {
    transpoSlidert.html('Number of tried transposition </br> when the button is pushed : ' + transpoSlider.value());
}

function particleNumberSliderEvent() {
    nbp2.html('Number of particles in the next set : ' + int(particleNumberSlider.value()*particleNumberSlider.value()*particleNumberSlider.value()*particleNumberSlider.value()));
}

function complSliderEvent() {
    methodt2.html('Number of points used : ' + complSlider.value());
}

function backgEvent() {
    color_mode = 'Normal';
}

var z_xoff = 0;
var z_yoff = 0;
var z_zoff = 0;

var auxaux = 0;

function draw() {

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

  if(auxaux === 0 ||frameCount%10 === 0) {fr.html("FPS : " + floor(frameRate()));auxaux++;}
  p6.html('Maximum frame rate : ' + framerateSlider.value());
  
  nbp.html('Current number of particles : ' + NB_PARTICLES);
  nbp2.html('Number of particles in the next set : ' + int(particleNumberSlider.value()*particleNumberSlider.value()*particleNumberSlider.value()*particleNumberSlider.value()));

  filterframe.html('Filter every ' + filterframeSlider.value() + ' frames : ');
  transpoSlidert.html('Number of tried transposition </br> when the button is pushed : ' + transpoSlider.value());
  methodt2.html('Number of points used : ' + complSlider.value());
}
