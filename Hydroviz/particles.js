const noiseAmplitude2 = 13;
const changerate = 0.012;

function bubble(){
    this.sz = random(2,10);
    this.alpha = random(50,200);
    
    this.show = function(f){
        stroke(150,150,255,this.alpha*f);
        strokeWeight(1.5);
        noFill();
        ellipse(0,0,this.sz,this.sz);
    };
}

function particles(height,xpos,type) {
    this.h = height;
    this.x = xpos;
    
    this.seed = random(10,1000);
    
    this.m = floor(map(this.h,valmin,valmax,2,25));
    
    this.bub = [];
    
    if(type=="oxygene"){
        for(let i=0;i<this.m;i++){
            this.bub[i] = new bubble();
        }
    }
    
    this.show = function(){
        if(mouseY<=cnv.height&&mouseY>=0){
            noiseDetail(1, 0.5);
            
            smooth();
            
            let H = this.h*constrain(map(mouseX-this.x+0.75*mouseWidth,0,mouseWidth,0,1),0,1);
            
            stroke(150,75,0,200);
            strokeWeight(4.0);
            
            if(type=="suspension"){
                for(let i=0;i<this.m;i++){
                    noise2.seed(this.seed*i*1.6125);
                    let dx = map(noise2.simplex2(i,0.1*changerate*frameCount),-0.5,0.5,-noiseAmplitude2,noiseAmplitude2);
                    let dy = map(noise2.simplex2(123+i,0.1*changerate*frameCount),-0.5,0.5,-noiseAmplitude2,noiseAmplitude2);
                    let y = transform(H)+dy;
                    point(this.x+dx,y);
                }
            } else if(type=="oxygene"){
                for(let i=0;i<this.m;i++){
                    noise2.seed(this.seed*i*1.6125);
                    let dx = map(noise2.simplex2(i,0.1*changerate*frameCount),-0.5,0.5,-noiseAmplitude2,noiseAmplitude2);
                    let dy = map(noise2.simplex2(123+i,0.1*changerate*frameCount),-0.5,0.5,-noiseAmplitude2,noiseAmplitude2);
                    let y = transform(H)+dy;
                    push();
                    translate(this.x+dx,y);
                    this.bub[i].show(H/(this.h+0.001));
                    pop();
                }
            }
        }
    };
}