
function phrectangle(height,xpos,type) {
    this.h = height;
    this.x = xpos;
    
    this.seed = random(10,1000);
    
    this.show = function(){
        if(mouseY<=cnv.height&&mouseY>=0){
            noiseDetail(1, 0.5);
            noiseSeed(this.seed);
            smooth();
            
            let activation = constrain(map(mouseX-this.x+0.75*mouseWidth,0,mouseWidth,0,1),0,1);
            
            noStroke();
            fill(245);
            strokeWeight(1.0);
            
            let h2 = 200;
            
            push();
            translate(this.x,cnv.height-1.4*h2*activation);
            let value = map(this.h,valmin-0.2,valmax+0.2,0.1,0.9);
            rect(-10,0,20,h2);
            colorMode(HSB);
            let col = color(floor(value*255*0.85),200,200);
            fill(col);
            noStroke();
            rect(-10,0.75*h2,20,0.2*h2);
            stroke(20,40);
            noFill();
            rect(-10,0,20,h2);
            pop();
            
        }
    }
}