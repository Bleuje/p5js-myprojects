var nb_points = 400;

var noiseIntensity = 1.5;

var start_pos = 50;
var end_pos = 350;

var start_posh = 60;
var end_posh = 370;

var gaussian = function(x) {
    return Math.exp(-pow(x-width/2,2)/pow(width/5,2));
}

var sigmoid = function(x) {
    return 1/(1 + Math.exp(-x));
}

var transition = function(x) {
    var t1 = Math.abs(x-width/2)/(width/2);
    var t = 1/(0.1+pow(2.2*t1,5));
    return sigmoid(t-3);
}

var divisionLine = function(t,start_y) {
    this.y = start_y;
    
    this.offset = random(100000);
    
    this.show = function() {
        stroke(255,200);
        fill(0);
        
        this.addedValue = [];
        this.randomArray = [];
        
        for(var i = 0;i<nb_points;i++){
             var myRand = random(noiseIntensity);
             
             var x = i*width/nb_points;
             var myNoise = noise(0.035*x + this.offset,t)+0.47;
             
             var myNoise2 = - 10*pow(myNoise,5);
             
             this.addedValue[i] = myRand + myNoise2;
             this.randomArray[i] = myRand;
        }
        /* OLD
        for(var i = 1;i<nb_points;i++){
        myInterpoler = gaussian(i*width/nb_points);
            line((i-1)*width/nb_points,
                 this.y +  lerp(this.randomArray[i-1],this.addedValue[i-1],gaussian((i-1)*width/nb_points)),
                 i*width/nb_points,
                 this.y +  lerp(this.randomArray[i],this.addedValue[i],gaussian(i*width/nb_points)));
        }
        */
        
        var realY = map(this.y,0,400,start_posh,end_posh);
        
        beginShape();
        //vertex(start_pos,height);
        for(var i = 0;i<nb_points;i++){
            myInterpoler = transition(i*width/nb_points);
            vertex(start_pos + i*(end_pos-start_pos)/nb_points,
                 realY +  lerp(this.randomArray[i],this.addedValue[i],myInterpoler));
        }
        //vertex(end_pos,height);
        endShape();
        noStroke();
        rect(start_pos-1,realY+2,end_pos-start_pos+2,500);
    }
}