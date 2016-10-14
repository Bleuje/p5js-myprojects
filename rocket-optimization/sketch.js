//start position, gravity, air slow down

var cnv;

var wid = 600;
var hei = 600;

var pi_ = 3.141592;

var START_X = wid/2;
var START_Y = hei;
var START_VX = 0;
var START_VY = 0;
var START_ANGLE = pi_/2;

var GENOME_SIZE = 250;

var DAMPING = 0.95;
var GRAVITY = 0.05;

var MAX_ACCELERATION = 0.5;
var MAX_ANGLE_CHANGE = pi_/8;
var MUT_ANGLE = pi_/20;
var MUT_ACC = 0.02;

var TIME_GROUP_SIZE = 1;

var myRocket;
var currentRockets = [];
var NB_ROCKETS = 200;


var NB_ROUNDS = 1000;
var round_time = 0;
var gen = 0;

function Genome() {
    this.array = [];
    
    this.random = function() {
        for(var i=0;i<GENOME_SIZE;i++){
            this.array[i] = [MAX_ANGLE_CHANGE*(random(2)-1)/2,random(MAX_ACCELERATION)];
        }
    }
    
    this.random();
    
    this.mutate = function(k) {
        for(var j=0;j<k;j++){
            var i = floor(random(GENOME_SIZE));
            this.array[i] = [min(MAX_ANGLE_CHANGE,max(-MAX_ANGLE_CHANGE,this.array[i][0] + MUT_ANGLE*(random(2)-1))),
                             min(MAX_ACCELERATION,max(0,this.array[i][1] + MUT_ACC*(random(2)-1)))];
        }
        //return this;
    }
    
    this.mutateSmall = function(k) {
        for(var j=0;j<k;j++){
            var i = floor(random(GENOME_SIZE));
            var j = floor(random(2));
            if (j === 0) {
                this.array[i][j] = min(MAX_ANGLE_CHANGE,max(-MAX_ANGLE_CHANGE,this.array[i][0] + MUT_ANGLE*(random(2)-1)));
            } else {
                this.array[i][j] = min(MAX_ACCELERATION,max(0,this.array[i][1] + MUT_ACC*(random(2)-1)));
            }
        }
        //return this;
    }
    
    this.crossover = function(other){
        for(var i=0;i<GENOME_SIZE;i++){
            if (random()>0.5) {
                this.array[i] = other.array[i];
            }
        }
    }
}

function crash(x,y) {
    var crash1 = myTarget2.dist(x,y)<myTarget2.halfRadius/2;
    return crash1||(x<0||x>width||y<0||y>height);
}

function reached(x,y) {
    var r1 = myTarget.dist(x,y)<myTarget.halfRadius/2;
    return r1;
}

function Rocket(genome_){
    this.x = ssx.value();
    this.y = ssy.value();
    
    this.angle = ssa.value();
    
    this.vx = ssvx.value();
    this.vy = ssvy.value();
    
    this.time = 0;
    
    this.crashed = false;
    this.targetReached = false;
    this.whenReached = 10000;
    this.minDist = 10000;
    this.distSum = 0;
    
    this.genome = new Genome();
    
    for(var i=0;i<GENOME_SIZE;i++){
        for(var j=0;j<2;j++){
            this.genome.array[i][j] = genome_.array[i][j];
        }
    }
    
    this.reset = function() {
        this.time = 0;
        
        this.x = ssx.value();
        this.y = ssy.value();
        
        this.angle = ssa.value();
        
        this.vx = ssvx.value();
        this.vy = ssvy.value();
    }
    
    this.move = function(){
        if(!this.crashed && !this.reached){
            this.x += this.vx;
            this.y += this.vy;
            
            this.vx *= sd.value();
            this.vy *= sd.value();
            
            var i = min(floor(this.time/TIME_GROUP_SIZE),GENOME_SIZE-1);
            var angle2 = this.genome.array[i][0];
            this.vx += cos(this.angle + angle2)*this.genome.array[i][1];
            this.vy += sin(this.angle + angle2)*this.genome.array[i][1];
            
            this.vy += sg.value();
            
            this.angle += angle2;
            
            this.time++;
            
            var distT = myTarget.dist(this.x,this.y);
            
            this.minDist = min(distT,this.minDist);
            this.distSum += distT;
        }
        
        if (crash(this.x,this.y)) {
            this.crashed = true;
        }
        if (reached(this.x,this.y)) {
            this.targetReached = true;
            this.whenReached = this.time;
            this.crashed = false;
        }
        
    }
    
    this.show = function(){
        
        strokeWeight(1);
        if (!this.crashed && !this.targetReached) {
            var size = 10;
        
            stroke(0,100);
            fill(255,200);
            beginShape();
            vertex(this.x + size*cos(this.angle + pi_/8),this.y + size*sin(this.angle + pi_/8));
            vertex(this.x + size*cos(this.angle + pi_ - pi_/8),this.y + size*sin(this.angle + pi_ - pi_/8));
            vertex(this.x + size*cos(this.angle + pi_ + pi_/8),this.y + size*sin(this.angle + pi_ + pi_/8));
            vertex(this.x + size*cos(this.angle - pi_/8),this.y + size*sin(this.angle - pi_/8));
            endShape(CLOSE);
        }
    }
    
    this.eval_ = 10000;
    this.evaluate = function() {
        var fst = (!this.targetReached)*(this.minDist + 0.2*this.distSum/this.time) - this.time;
        this.eval_ = fst + 500*this.crashed + this.targetReached*(this.whenReached - 10000);
    }
    
}

function Target(x_,y_,r,c) {
    this.x = x_;
    this.y = y_;
    
    this.halfRadius = r;
    
    this.dist = function (x_,y_) {
        return Math.sqrt((this.x-x_)*(this.x-x_) + (this.y-y_)*(this.y-y_));
    }
    
    this.show = function (){
        noFill();
        fill(100,100);
        stroke(c);
        strokeWeight(2);
        ellipse(this.x,this.y,this.halfRadius,this.halfRadius);
    }
}

var c1,c2,c3;

function setup() {
    cnv = createCanvas(wid,hei);
    cnv.parent("canvas");
    
    background(51);
    
    c1 = color(20,200,20);
    myTarget = new Target(50,50,20,c1);
    c2 = color(200,20,20);
    myTarget2 = new Target(150,150,230,c2);
    c3 = color(20,20,200);
    myTarget3 = new Target(START_X,START_Y,10,c3);
    
    bt1 = createButton('Reset rockets');
    bt1.parent('buttons');
    bt1.mousePressed(new_rockets);
    
    pr1 = createP('Number of rockets after reset :');
    pr1.parent('buttons');
    sr1 = createSlider(10,500,NB_ROCKETS,1);
    sr1.parent('buttons');
    
    p1 = createP('<h4>Geometric stuff :</h4>');
    p1.parent('buttons');
    
    pt = createP('Target x y size :');
    stx = createSlider(0,width,myTarget.x,1);
    sty = createSlider(0,height,myTarget.y,1);
    str = createSlider(2,400,myTarget.halfRadius,1);
    pt.parent('buttons');
    stx.parent('buttons');
    sty.parent('buttons');
    str.parent('buttons');
    
    po = createP('Obstacle x y size :');
    sox = createSlider(0,width,myTarget2.x,1);
    soy = createSlider(0,height,myTarget2.y,1);
    sor = createSlider(2,400,myTarget2.halfRadius,1);
    po.parent('buttons');
    sox.parent('buttons');
    soy.parent('buttons');
    sor.parent('buttons');
    
    ps = createP('Start x y, vx vy, angle :');
    ssx = createSlider(0,width,width/2,1);
    ssy = createSlider(0,height,height,1);
    ssvx = createSlider(-10,10,0,0.01);
    ssvy = createSlider(-10,10,0,0.01);
    ssa = createSlider(-pi_,pi_,-pi_/2,0.01);
    ps.parent('buttons');
    ssx.parent('buttons');
    ssy.parent('buttons');
    ssvx.parent('buttons');
    ssvy.parent('buttons');
    ssa.parent('buttons');
    
    p2 = createP('<h4>Physics parameters</h4>');
    p2.parent('buttons');
    pg = createP('Gravity :');
    pg.parent('buttons');
    sg = createSlider(0,0.2,GRAVITY,0.001);
    sg.parent('buttons');
    pd = createP('Damping :');
    pd.parent('buttons');
    sd = createSlider(0.8,1.0,DAMPING,0.001);
    sd.parent('buttons');
    
    new_rockets();
}

function new_rockets() {
    gen = 0;
    
    for(var i=currentRockets.length-1;i>=0;i--){
        currentRockets.splice(i);
    }
    
    NB_ROCKETS = sr1.value();
    
    for(var i=0;i<NB_ROCKETS;i++){
        var g = new Genome();
        currentRockets[i] = new Rocket(g);
    }
    
    round_time = 0;
}

function updateTarget() {
    myTarget = new Target(stx.value(),sty.value(),str.value(),c1);
}

function updateTarget2() {
    myTarget2 = new Target(sox.value(),soy.value(),sor.value(),c2);
}

function updateStart() {
    myTarget3 = new Target(ssx.value(),ssy.value(),20,c3);
}


function draw() {
    background(51,200);
    
    updateTarget();
    updateTarget2();
    updateStart();
    
    noFill();
    var crect = color(200,20,20);
    stroke(crect);
    strokeWeight(4);
    rect(0,0,width-1,height-1);
    
    myTarget.show();
    myTarget2.show();
    myTarget3.show();
    
    if (round_time < TIME_GROUP_SIZE*GENOME_SIZE) {
        for(var i=0;i<NB_ROCKETS;i++){
            currentRockets[i].move();
            currentRockets[i].show();
        }
        round_time++;
    } else {
        for(var i=0;i<NB_ROCKETS;i++){
            currentRockets[i].evaluate();
        }
        currentRockets.sort(function(a, b) {
            return parseFloat(a.eval_) - parseFloat(b.eval_);
        });
        console.log(currentRockets[0].eval_);
        for(var i=3*NB_ROCKETS/4;i<NB_ROCKETS;i++){
            var g = currentRockets[i-3*NB_ROCKETS/4].genome;
            currentRockets[i] = new Rocket(g);
            //currentRockets[i].genome.crossover(currentRockets[floor(random(NB_ROCKETS/3))].genome);
            currentRockets[i].genome.mutateSmall(1);
        }
        for(var i=2;i<NB_ROCKETS/2;i++){
            currentRockets[i] = new Rocket(currentRockets[i].genome);
            currentRockets[i].genome.mutate(1);
        }
        for(var i=NB_ROCKETS/2;i<3*NB_ROCKETS/4;i++){
            currentRockets[i] = new Rocket(currentRockets[i%(NB_ROCKETS/10)].genome);
            currentRockets[i].genome.mutate(1);
        }
        for(var i=0;i<NB_ROCKETS;i++){
            currentRockets[i] = new Rocket(currentRockets[i].genome);
        }
        round_time = 0;
        gen++;
        if (NB_ROUNDS === gen) {
            noLoop();
        }
    }
}