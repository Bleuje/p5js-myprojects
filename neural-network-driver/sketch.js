var cnv;

var wid = 16000;
var hei = 9000;

var scaler = 25;

var cp_radius = 600;
var angle_diff_max = 18;
var pod_rad = 400;
var slow_down_coeff = 0.75;

var myMap,myCar;

function setup() {
    cnv = createCanvas(wid/scaler,hei/scaler);
    cnv.parent('canvas');
    background(200);
    smooth(5)
    
    //console.log(0);
    
    myMap = new gameMap();
    myMap.addcps();
    
    //console.log(1);
    
    myCar = new car(myMap,random(1000,wid-1000),random(1000,hei-1000),random(PI*12));
    
    //console.log(2);
}

function draw() {
    background(200);
    //console.log(3);
   myMap.show();
   //console.log(4);
   myCar.gatherChoice();
   //console.log(5);
   myCar.show();
   //console.log(6);
   myCar.move();
   //console.log(7);
}