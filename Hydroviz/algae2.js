const changerate2 = 0.007;
const noiseAmplitude = 7;
const curveOffset = 11;

const mouseWidth = 60;

function algae(height,xpos,type) {
    this.h = height;
    this.x = xpos;
    
    this.seed = random(10,1000);
    
    this.freq = 0.2*random(0.02,0.04);
    
    this.show = function(){
        if(mouseY<=cnv.height&&mouseY>=0){
            noiseDetail(1, 0.5);
            noiseSeed(this.seed);
            smooth();
            
            let H = this.h*constrain(map(mouseX-this.x+0.75*mouseWidth,0,mouseWidth,0,1),0,1);
            let activation = constrain(map(mouseX-this.x+0.75*mouseWidth,0,mouseWidth,0,1),0,1);
            
            if(type=="chlorophyll"){
                H = 0.4*cnv.height;
            }
            
            let n = 200;
            
            stroke(20,220,20);
            strokeWeight(2.5);
            fill(20,220,20);
            
            if(type == "chlorophyll"){
                let from = color(240, 120, 25);
                let to = color(20,220,20);
                let inter = lerpColor(from,to,1.2*this.h/cnv.height);
                stroke(inter);
                fill(inter);
            }
            
            beginShape();
            for(let i=0;i<=n;i+=3){
                let f = 1.0*i/n;
                let f2 = 1.0;
                if(type == "chlorophyll"){
                    f2 = activation;
                }
                let dx = f*map(noise2.simplex2(this.freq*i,this.seed+changerate2*frameCount),-0.5,0.5,-noiseAmplitude,noiseAmplitude) + f2*15*sin(PI*i/n);
                let y = map(i,0,n,cnv.height,transform(H)+curveOffset);
                vertex(this.x+dx,y);
            }
            for(let i=n;i>=0;i-=3){
                let f = 1.0*i/n;
                let f2 = 1.0;
                if(type == "chlorophyll"){
                    f2 = activation;
                }
                let dx = f*map(noise2.simplex2(this.freq*i,this.seed+changerate2*frameCount),-0.5,0.5,-noiseAmplitude,noiseAmplitude) - f2*15*sin(PI*i/n);
                let y = map(i,0,n,cnv.height,transform(H)+curveOffset);
                vertex(this.x+dx,y);
            }
            endShape();
            
            stroke(75,230,75);
            strokeWeight(2.5);
            noFill();
            
            if(type == "chlorophyll"){
                let from = color(250, 150, 50);
                let to = color(75,230,75);
                let inter = lerpColor(from,to,1.2*this.h/cnv.height);
                stroke(inter);
            }
            
            beginShape();
            for(let i=0;i<=n;i+=3){
                let f = 1.0*i/n;
                let dx = f*map(noise2.simplex2(this.freq*i,this.seed+changerate2*frameCount),-0.5,0.5,-noiseAmplitude,noiseAmplitude) + 0*sin(PI*i/n);
                let y = map(i,0,n,cnv.height,transform(H)+curveOffset);
                vertex(this.x+dx,y);
            }
            endShape();
        }
    }
}