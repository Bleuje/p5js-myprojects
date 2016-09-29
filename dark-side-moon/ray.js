var elw = 1;
var step = 0.005;

function draw_line1(t,p) {
    var x = lerp(0,0.39,t);
    var y = lerp(0.6,0.45,t);
    fill(255,50);
    stroke(255,50);
    ellipse(x*width,y*height,elw,elw);
    console.log(x,y);
}

function draw_line2(t,p) {
    var x = lerp(0.39,0.005+lerp(0.59,0.65,p),t);
    var y = lerp(0.45,lerp(0.40,0.50,p),t);
    fill(255,75*(1-t)*(1-t));
    stroke(255,75*(1-t)*(1-t));
    ellipse(x*width,y*height,elw,elw);
}

function draw_line3(t,p) {
    var x = lerp(0.005+lerp(0.59,0.65,p),1,t);
    var y = lerp(lerp(0.40,0.50,p),lerp(0.45,0.62,p),t);
    colorMode(HSB,255);
    var c = color(lerp(0,0.8,p)*255,255,255,200);
    fill(c);
    stroke(c);
    ellipse(x*width,y*height,elw,elw);
}

function ray() {
    this.param1 = random();
    this.time = 0;
    
    this.move = function() {
        this.time += step;
        if (this.time>1) {
            this.time = 0;
            this.param1 = random();
        }
    }
    
    this.show = function() {
        if(this.time < 1/3) {
            draw_line1(3*this.time,this.param1);
        } else if(this.time < 2/3) {
            draw_line2(3*(this.time-1/3),this.param1);
        } else {
            draw_line3(3*(this.time-2/3),this.param1);
        }
    }
    
}