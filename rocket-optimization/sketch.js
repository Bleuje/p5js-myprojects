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

var currentExplosions = [];


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
        
        if (!this.crashed && crash(this.x,this.y)) {
            this.crashed = true;
            var c = color(200,20,20);
            currentExplosions[currentExplosions.length] = new Explosion(this.x,this.y,15);
        }
        if (reached(this.x,this.y)) {
            this.targetReached = true;
            this.whenReached = this.time;
            this.crashed = false;
            
            myTarget.activate();
        }
        
    }
    
    this.show = function(){
        
        strokeWeight(1);
        if (!this.crashed && !this.targetReached) {
            var size = srs.value();
        
            stroke(0,100);
            fill(255,200);
            beginShape();
            vertex(this.x + size*cos(this.angle + pi_/8),this.y + size*sin(this.angle + pi_/8));
            vertex(this.x + size*cos(this.angle + pi_ - pi_/8),this.y + size*sin(this.angle + pi_ - pi_/8));
            vertex(this.x + size*cos(this.angle + pi_ + pi_/8),this.y + size*sin(this.angle + pi_ + pi_/8));
            vertex(this.x + size*cos(this.angle - pi_/8),this.y + size*sin(this.angle - pi_/8));
            vertex(this.x + 1.5*size*cos(this.angle),this.y + 1.5*size*sin(this.angle));
            endShape(CLOSE);
        }
    }
    
    this.eval_ = 10000;
    this.evaluate = function() {
        var fst = (!this.targetReached)*(this.minDist + 0.05*this.distSum/this.time - this.time);
        this.eval_ = fst + 200*this.crashed + this.targetReached*(this.whenReached - 10000);
    }
    
}

function Target(x_,y_,r,c,v) {
    this.x = x_;
    this.y = y_;
    
    this.col = c;
    
    this.halfRadius = r;
    
    this.activated = v;
    
    this.dist = function (x_,y_) {
        return Math.sqrt((this.x-x_)*(this.x-x_) + (this.y-y_)*(this.y-y_));
    }
    
    this.show = function (){
        fill(100,100);
        stroke(this.col);
        strokeWeight(2);
        ellipse(this.x,this.y,this.halfRadius,this.halfRadius);
        
        if(this.activated > 0){
            noStroke();
            fill(20,200,20,min(150,10*this.activated));
            this.activated-=0.5;
            ellipse(this.x,this.y,this.halfRadius,this.halfRadius);
        }
    }
    
    this.activate = function() {
        this.activated=10;
    }
}

function Explosion(x_,y_,r) {
    this.x = x_;
    this.y = y_;
    
    this.halfRadius = r;
    
    this.activated = 10;
    
    this.show = function (){
        if(this.activated > 0){
            fill(200,20,20,5*this.activated);
            stroke(200,20,20,10*this.activated);
            strokeWeight(2);
            ellipse(this.x,this.y,this.halfRadius + 50 - 5*this.activated,this.halfRadius + 50 - 5*this.activated);
            this.activated-=0.2;
        }
    }
}

var c1,c2,c3;

function setup() {
    cnv = createCanvas(wid,hei);
    cnv.parent("canvas");
    
    background(51);
    
    c1 = color(20,200,20);
    myTarget = new Target(50,50,20,c1,0);
    c2 = color(200,20,20);
    myTarget2 = new Target(150,150,230,c2,0);
    c3 = color(20,20,200);
    myTarget3 = new Target(START_X,START_Y,10,c3,0);
    
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
    
    ps = createP('Start x y, vx vy, initial angle :');
    ssx = createSlider(0,width,width/2,1);
    ssy = createSlider(0,height-5,height,1);
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
    
    p3 = createP('<h4>Graphics</h4>');
    p3.parent('buttons');
    pbf = createP('Background fade :');
    pbf.parent('buttons');
    sbf = createSlider(0,255,50,1);
    sbf.parent('buttons');
    prs = createP('Rocket size :');
    prs.parent('buttons');
    srs = createSlider(3,25,7,1);
    srs.parent('buttons');
    
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
    myTarget = new Target(stx.value(),sty.value(),str.value(),c1,myTarget.activated);
}

function updateTarget2() {
    myTarget2 = new Target(sox.value(),soy.value(),sor.value(),c2,myTarget2.activated);
}

function updateStart() {
    myTarget3 = new Target(ssx.value(),ssy.value(),20,c3,myTarget3.activated);
}

function updateExplosions() {
    for(var i=currentExplosions.length-1;i>=0;i--){
        if (currentExplosions[i].activated <= 0) {
            currentExplosions.splice(i,1);
        }
    }
}


function draw() {
    background(51,sbf.value());
    
    updateTarget();
    updateTarget2();
    updateStart();
    updateExplosions();
    
    noFill();
    var crect = color(200,20,20);
    stroke(crect);
    strokeWeight(4);
    rect(1,1,width-1,height-1);
    
    var cline1 = color(200,200,20);
    stroke(cline1);
    strokeWeight(2);
    line(myTarget3.x,myTarget3.y,myTarget3.x + 3*ssvx.value(),myTarget3.y + 3*ssvy.value());
    
    var cline1 = color(20,200,200);
    stroke(cline1);
    strokeWeight(2);
    line(myTarget3.x,myTarget3.y,myTarget3.x + 10*cos(ssa.value()),myTarget3.y + 10*sin(ssa.value()));
    
    myTarget.show();
    myTarget2.show();
    myTarget3.show();
    for(var i=0;i<currentExplosions.length;i++){
        currentExplosions[i].show();
    }
    
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
            currentRockets[i].genome.mutate(floor(random(4))+1);
        }
        for(var i=NB_ROCKETS/2;i<3*NB_ROCKETS/4;i++){
            currentRockets[i] = new Rocket(currentRockets[i%(5)].genome);
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