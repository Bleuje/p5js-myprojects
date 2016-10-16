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
var record = 100000;

var mut_by_plot = 100;

function Genome(GG) {
    this.array = [];
    if(arguments.length === 1){
        for(var i=0;i<GENOME_SIZE;i++){
            this.array[i] = GG[i];
        }
    }
    
    this.random = function() {
        for(var i=0;i<GENOME_SIZE;i++){
            this.array[i] = [MAX_ANGLE_CHANGE*(random(2)-1)/2,random(MAX_ACCELERATION)];
        }
    }
    
    if(arguments.length === 0) this.random();
    
    this.mutate = function(k) {
        for(var j=0;j<k;j++){
            var i = floor(random(GENOME_SIZE));
            this.array[i] = [min(MAX_ANGLE_CHANGE,max(-MAX_ANGLE_CHANGE,this.array[i][0] + MUT_ANGLE*(random(2)-1))),
                             min(MAX_ACCELERATION,max(0,this.array[i][1] + MUT_ACC*(random(2)-1)))];
        }
        //return this;
    }
    
    this.mutateSmall = function(k) {
        for(var jj=0;jj<k;jj++){
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
    
    this.geval = 1000000;
    
    this.evaluate = function() {
        var g = this;
        var r = new Rocket(g);
        
        r.moveAndEvaluate();
        //if(frameCount % 100 === 0) console.log(r);
        this.geval = r.eval_;
        //if(frameCount % 100 === 0) console.log(this.geval);
        return this.geval;
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
            if(chkexp.checked()) currentExplosions[currentExplosions.length] = new Explosion(this.x,this.y,15);
        }
        if (reached(this.x,this.y)) {
            this.targetReached = true;
            this.whenReached = this.time;
            this.crashed = false;
            
            record = min(record,this.whenReached);
            
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
    
    this.eval_ = 100000;
    this.evaluate = function() {
        var fst = (!this.targetReached)*(this.minDist + 0.05*this.distSum/this.time - this.time);
        this.eval_ = fst + 200*this.crashed + this.targetReached*(this.whenReached - 10000);
    }
    
    this.moveAndEvaluate = function(){
        while (!this.crashed && !this.targetReached && (this.time < TIME_GROUP_SIZE*GENOME_SIZE)) {
            this.move();
        }
        
        this.evaluate();
        
        return this.eval_;
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
            fill(200,100,20,2*this.activated);
            stroke(200,100,20,5*this.activated);
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
    
    popt = createP('<h4>About the optimization :</h4>');
    popt.parent('buttons');
    
    p0 = createP('Record : <em>Didn\'t reach target</em>');
    p0.parent('buttons');
    
    p00 = createP('Temperature : ?');
    p00.parent('buttons');
    
    bt1 = createButton('Reset search');
    bt1.parent('buttons');
    bt1.mousePressed(new_search);
    bt1bis = createButton('Reset temperature');
    bt1bis.parent('buttons');
    bt1bis.mousePressed(new_temper);
    bt11 = createButton('Reset record');
    bt11.parent('buttons');
    bt11.mousePressed(reset_record);
    
    pmut1 = createP('Mutation intensity :');
    pmut1.parent('buttons');
    smut1 = createSlider(1,20,3,1);
    smut1.parent('buttons');
    
    ptemp1 = createP('Maximum temperature :');
    ptemp1.parent('buttons');
    stemp1 = createSlider(1,1000,10,0.01);
    stemp1.parent('buttons');
    
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
    chkexp = createCheckbox('Show Explosions',true);
    chkexp.parent('buttons');
    
    curG = new Genome();
    //console.log('ok1');
    myRocket = new Rocket(curG);
    //console.log('ok2');
    showRocket = new Rocket(curG);
    //console.log('ok3');
    
    evalprev = 100000;
    
    tries = 0;
}

function reset_record() {
    record = 100000;
}

function new_search() {
    curG = new Genome();
    tries = 0;
}

function new_temper() {
    tries = 0;
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

function transition(newe,olde,temperature){
    var proba = min(1,Math.exp((olde-newe)/temperature));
    return random(1)<proba;
}

function temper(k){
    return stemp1.value()/(1+0.1*k);
}

function copyInto(arr1,arr2) {
    for(var i=0;i<arr1.length;i++){
        for(var j = 0;j<2;j++){
            arr2[i][j] = arr1[i][j];
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
    
    if (round_time < TIME_GROUP_SIZE*GENOME_SIZE && !showRocket.crashed && !showRocket.targetReached) {
        copyG = new Genome();
        copyInto(curG.array,copyG.array);
        copyG.geval = curG.geval;
        curG.mutateSmall(smut1.value());
        //console.log('ok4');
        curEval = curG.evaluate();
        //if(frameCount%100 === 0) console.log(curEval);
        
        //console.log('ok5');
        
        temperature = temper(tries);
        tries++;
        if (!transition(curEval,evalprev,temperature)) {
        //if (curEval>evalprev) {
            //console.log('ok55');
            curG = new Genome();
            copyInto(copyG.array,curG.array);
            curG.geval = copyG.geval;
            //console.log('ok6');
        } else {
            if(frameCount%30 === 0) console.log(curEval);
            var saved1 = curG.geval;
            var saved2 = []
            for(var i=0;i<GENOME_SIZE;i++){
                saved2[i] = [];
            }
            copyInto(curG.array,saved2);
            //console.log('ok55');
            //console.log(curG.array);
            curG = new Genome();
            curG.array = saved2;
            curG.geval = saved1;
            //console.log('ok7');
        }
        evalprev = curG.geval;
        
        showRocket.move();
        showRocket.show();
        
        round_time++;
    } else {
        showRocket = new Rocket(curG);
        round_time = 0;
        gen++;
        if (NB_ROUNDS === gen) {
            noLoop();
        }
    }
    p00.html('Temperature : ' + Math.round(10000*temper(tries))/10000);
    if (record<1000) {
        p0.html('Record : ' + record + ' time steps');
    } else {
        p0.html('Record : <em>Didn\'t reach target</em>');
    }
}