//start position, gravity, air slow down

var cnv;

var wid = 1000;
var hei = 600;

var pi_ = 3.141592;

var DAMPING = 0.995;

var NB_BIRDS = 100;

var REP_DIST = 10;
var ALI_DIST = 150;
var COH_DIST = 250;

function Bird(ind){
    this.id = ind;
    
    this.x = random(width);
    this.y = random(height);
    
    this.vx = random(3);
    this.vy = random(3);
    
    this.findForce = function() {
        var xx = 0;
        var yy = 0;
        
        var cnt = 0;
        var sx = 0;
        var sy = 0;
        for(let i=0;i<NB_BIRDS;i++){
            let curx = birdSet[i].x;
            let cury = birdSet[i].y;
            if (i!=ind && Math.sqrt((curx - this.x)*(curx - this.x) + (cury - this.y)*(cury - this.y))<COH_DIST) {
                sx += curx;
                sy += cury;
                cnt++;
            }
        }
        var v;
        if (cnt>0) {
            sx /= cnt;sx -= this.x;
            sy /= cnt;sy -= this.y;
            v = createVector(sx,sy);
            v.normalize();
        } else {
            v = createVector(0,0);
        }
        v.mult(2);
        var res = v;
        
        cnt = 0;
        sx = 0;
        sy = 0;
        for(let i=0;i<NB_BIRDS;i++){
            let curx = birdSet[i].vx;
            let cury = birdSet[i].vy;
            if (i!=ind && Math.sqrt((curx - this.x)*(curx - this.x) + (cury - this.y)*(cury - this.y)) < ALI_DIST) {
                sx += curx;
                sy += cury;
                cnt++;
            }
        }
        v = createVector(sx,sy);
        if(sx>0||sy>0) v.normalize();
        v.mult(4);
        res.add(v);
        
        cnt = 0;
        sx = 0;
        sy = 0;
        for(let i=0;i<NB_BIRDS;i++){
            let curx = birdSet[i].x;
            let cury = birdSet[i].y;
            if (i!=ind && Math.sqrt((curx - this.x)*(curx - this.x) + (cury - this.y)*(cury - this.y)) < REP_DIST) {
                sx += curx;
                sy += cury;
                cnt++;
            }
        }
        if (cnt>0) {
            sx /= cnt;sx -= this.x;
            sy /= cnt;sy -= this.y;
            v = createVector(-sx,-sy);
            v.normalize();
        } else {
            v = createVector(0,0);
        }
        v.mult(4);
        res.add(v);
        
        res.normalize();
        
        res.mult(0.2);
        
        this.swarmForce =  res;
    }
    
    this.move = function() {
        this.x += this.vx;
        this.y += this.vy;
        
        var toadd = p5.Vector.fromAngle(2*PI*(2*noise(frameCount*0.002 + 123)-1));
        
        this.vx += 0.1*(1.5*this.swarmForce.x + 0.05*toadd.x);
        this.vy += 0.1*(1.5*this.swarmForce.y + 0.05*toadd.y);
        
        this.x = (this.x + width)%width;
        this.y = (this.y + height)%height;
        
        var vectV = createVector(this.vx,this.vy);
        vectV.mult(DAMPING);
        vectV.limit(10);
        
        this.vx = vectV.x;
        this.vy = vectV.y;
    }
    
    this.show = function(){
        strokeWeight(1);
        this.angle = Math.atan2(this.vy,this.vx);
        var size = 7;
        stroke(0,100);
        fill(255,200);
        beginShape();
        vertex(this.x + size*cos(this.angle + pi_ - pi_/8),this.y + size*sin(this.angle + pi_ - pi_/8));
        vertex(this.x + size*cos(this.angle + pi_ + pi_/8),this.y + size*sin(this.angle + pi_ + pi_/8));
        vertex(this.x + 1.5*size*cos(this.angle),this.y + 1.5*size*sin(this.angle));
        endShape(CLOSE);
    }
}


function setup() {
    cnv = createCanvas(wid,hei);
    cnv.parent("canvas");
    
    background(51);
    
    myBird = new Bird();
    
    birdSet = [];
    for(let i=0;i<NB_BIRDS;i++){
        birdSet[i]=new Bird(i);
    }
}

function draw() {
    background(51);
    
    for(let i=0;i<NB_BIRDS;i++){
        birdSet[i].findForce();
    }
    for(let i=0;i<NB_BIRDS;i++){
        birdSet[i].show();
        birdSet[i].move();
    }
}