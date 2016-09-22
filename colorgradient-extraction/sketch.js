var playing = true;
var rainbow_mode = true;
var perspective_mode = false;

function preload()
{
  // load image
  img1 = loadImage("imgsamples/red-flowers.jpg");
  img2 = loadImage("imgsamples/starry-night.jpg");
}

var dictionary = {};

function setup() {
  dictionary["Red flowers"] = img1;
  dictionary["Starry night"] = img2;
  
  var cnv = createCanvas(800, 400);
  cnv.parent('canvas');
  background(51);
  
  var button = createButton('Reset');
  button.mousePressed(reset);
  button.parent('line1');
  
  sel = createSelect();
  sel.option("Red flowers");
  sel.option("Starry night");
  sel.changed(mySelectEvent);
  sel.parent('pic-choice');
}

function mySelectEvent() {
  var item = sel.value();
  img = dictionary[item];
  image(img,0,0,width,height);
}

function reset() {
    location.reload();
}


function draw() {

}
