var cnv;

var wid = 1167;
var hei = 583;

var issX = 0;
var issY = 0;

var url = 'https://api.open-notify.org/iss-now.json';

var img;
function preload() {
  img = loadImage("map.jpg");
}

function setup() {
    cnv = createCanvas(wid,hei);
    cnv.parent('canvas');
    
    image(img, 0, 0);
    
    setInterval(askISS,1000);
}

function askISS(){
    loadJSON(url, gotData, 'jsonp');
}

function gotData(data){
    var lon = Number(data.iss_position.longitude);
    var lat = data.iss_position.latitude;
    issX = (width/360.0) * (180 + lon);
    issY = (height/180.0) * (90 - lat);
    println(issX);
    println(issY);
}

function draw() {
    if(frameCount%10==0){
        image(img, 0, 0);
    
        fill(255);
        ellipse(issX,issY,15,15);
    }
}