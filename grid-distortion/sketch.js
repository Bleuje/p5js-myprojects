/**************************************************
 * Spring grid distortion by Etienne Jacob, 2018
 * ************************************************/

var N = 25;

var SP = 50;

var DT = 0.1;

var EPS = 0.00000001;

var DAMPING = 0.95;

var DELTA = 40;

var KGrid = 10.0;

var KClick = 15.0;

function spring_force(ax, ay, bx, by, k) {
    var xx = ax - bx;
    var yy = ay - by;
    
    var d = dist(xx,yy,0,0);
    
    var nx = xx/(d+EPS);
    var ny = yy/(d+EPS);
    
    var f = k*d;
    
    var fx = f*nx;
    var fy = f*ny;
    
    return createVector(fx,fy);
}

class Dot{
  constructor(i, j){
    this.vx = 0;
    this.vy = 0;
    this.k = sKGrid.value();
    
    this.x = map(i, 0, N-1, SP, width-SP);
    this.y = map(j, 0, N-1, SP, height-SP);
    
    this.x0 = this.x;
    this.y0 = this.y;
  }
  
  update(){
    let d = dist(mouseX, mouseY, this.x, this.y);
    let delta = sDelta.value();
    
    let intensity = sKClick.value()*exp(-d*d/(delta*delta));
    //float interp = 15*exp(-d/delta);
    
    let res = createVector(0, 0);
    if(mouseIsPressed){
      res.add(spring_force(mouseX, mouseY, this.x, this.y, intensity));
    }
    res.add(spring_force(this.x0, this.y0, this.x, this.y, this.k));

    this.vx += sDT.value()*res.x;
    this.vy += sDT.value()*res.y;
    
    this.vx *= sDAMPING.value();
    this.vy *= sDAMPING.value();

    this.x += sDT.value()*this.vx;
    this.y += sDT.value()*this.vy;
  }
}

function draw_connection(d1, d2){
  stroke(255,125);
  strokeWeight(2);
  line(d1.x, d1.y, d2.x, d2.y);
}

var array;

function setup() {
  var cnv = createCanvas(600, 600);
  //cnv.style('width: 100%;margin: 0;justify-content: center;');
  cnv.parent('canvas');
  background(0);
  
  dtText = createP('Time step (DT) :');
  dtText.parent('settings');
  sDT = createSlider(0.01,0.4,DT,0.01);
  sDT.parent('settings');
  
  dampingText = createP('Damping ratio :');
  dampingText.parent('settings');
  sDAMPING = createSlider(0.8,1.0,DAMPING,0.01);
  sDAMPING.parent('settings');
  
  deltaText = createP('Delta of influence :');
  deltaText.parent('settings');
  sDelta = createSlider(5,100,DELTA,1);
  sDelta.parent('settings');
  
  kgText = createP('Spring constant k of the grid :');
  kgText.parent('settings');
  sKGrid = createSlider(2,25,KGrid,0.1);
  sKGrid.parent('settings');
  
  kcText = createP('Spring constant k of the click :');
  kcText.parent('settings');
  sKClick = createSlider(2,25,KClick,0.1);
  sKClick.parent('settings');
  
  button = createButton('Reset (R)');
  button.mousePressed(reset);
  button.parent('settings');
  
  
  array = new Array(N);
  for(let i=0;i<N;i++){
    array[i] = new Array(N);
  }
  
  for(let i=0;i<N;i++){
    for(let j=0;j<N;j++){
      array[i][j] = new Dot(i, j);
    }
  }
  
}


function reset() {
    location.reload();
    seedRandom();
    seedNoise();
}

function keyTyped() {
  if (key === 'r') {
    reset();
  }
}


function draw() {
  background(0);
  
  push();
  
  for(let i=0;i<N;i++){
    for(let j=0;j<N;j++){
      array[i][j].update();
    }
  }
  
  for(let i=0;i<N-1;i++){
    for(let j=0;j<N-1;j++){
      let d1 = array[i][j];
      let d2 = array[i+1][j];
      let d3 = array[i][j+1];
      draw_connection(d1, d2);
      draw_connection(d1, d3);
    }
  }
  
  for(let i=0;i<N-1;i++){
      let d1 = array[N-1][i];
      let d2 = array[N-1][i+1];
      let d3 = array[i][N-1];
      let d4 = array[i+1][N-1];
      draw_connection(d1, d2);
      draw_connection(d3, d4);
  }

  pop();
}
