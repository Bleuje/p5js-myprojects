
function salt(height,xpos,type) {
    this.h = height;
    this.x = xpos;
    
    this.seed = random(10,1000);
    
    this.show = function(){
        if(mouseY<=cnv.height&&mouseY>=0){
            noiseDetail(1, 0.5);
            noiseSeed(this.seed);
            smooth();
            
            let H = this.h*constrain(map(mouseX-this.x+0.75*mouseWidth,0,mouseWidth,0,1),0,1);
            let activation = constrain(map(mouseX-this.x+0.75*mouseWidth,0,mouseWidth,0,1),0,1);
            
            noStroke();
            fill(245);
            strokeWeight(1.0);
            
            let h2 = 100;
            
            push();
            translate(this.x,0.8*cnv.height-150*activation+160);
            let value = map(this.h,valmin,valmax,0.18,0.5);
            scale(value*activation);
            image(img,-img.width/2,-img.height/2);
            pop();
            
        }
    }
}