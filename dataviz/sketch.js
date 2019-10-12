var cnv;

var array = [];

var n = 12;

let img;

var all_data;

//const fs = require(['fs']);
//const papa = require('papaparse');
//const file = fs.createReadStream('data.csv');

function preload() {
  //img = loadImage("https://cdn0.iconfinder.com/data/icons/kitchen-colored-3/48/Household_Kitchen_Artboard_120-512.png");
  img = loadImage("https://i.ibb.co/XLvW3GJ/salt3.png");
  


}

const margin = 50;

const posmin = 100;
const posmax = 50;

var valmin = 50;
var valmax = 350;

function initialize(item){
    removeEvent();
    if(item=="nitrate"){
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            array[i] = new algae(random(100,300),x);
        }
    } else if(item=="suspension"){
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new particles(random(50,350),x,"suspension");
            array[i] = test;
        }
    } else if(item=="oxygene"){
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new particles(random(50,350),x,"oxygene");
            array[i] = test;
        }
    } else if(item=="chlorophyll"){
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new algae(random(50,350),x,"chlorophyll");
            array[i] = test;
        }
    } else if(item=="ph"){
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new phrectangle(random(50,350),x);
            array[i] = test;
        }
    } else if(item=="salinité"){
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new salt(random(50,350),x);
            array[i] = test;
        }
    } else if(item=="temperature"){
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new temperature_value(random(50,350),x);
            array[i] = test;
        }
    }
}

function setup() {
    /*
    papa.parse(file, {
    worker: true, // Don't bog down the main thread if its a big file
    step: function(result) {
        // do stuff with result
        data = result.data;
    },
    complete: function(results, file) {
        console.log('parsing complete read', count, 'records.'); 
    }
});
    */
    Papa.parse("data.csv", {
  header: true,
  download: true,
  dynamicTyping: true,
  complete: function(results) {
    console.log("Finished.",results);
    all_data = results;
  }
});

    
    
    background(240);
    sel = createSelect();
    sel.parent("canvas");
    //sel.position(10, 10);
    sel.option("nitrate");
    sel.option("suspension");
    sel.option("oxygene");
    sel.option("chlorophyll");
    sel.option("ph");
    sel.option("salinité");
    sel.option("temperature");
    sel.changed(mySelectEvent);
    
    cnv = createCanvas(1000,600);
    cnv.parent('canvas');
    
    
    checkbox = createCheckbox('Montrer la courbe', false);
    checkbox.parent("canvas");
    checkbox.changed(myCheckedEvent);
    
    checkbox2 = createCheckbox('Montrer toute la courbe', false);
    checkbox2.parent("canvas");
    checkbox2.changed(myCheckedEvent2);
    
    initialize("nitrate");
}

let show_curve = false;
let show_all_curve = false;

function myCheckedEvent() {
  if (this.checked()) {
    console.log('Checking!');
    show_curve = true;
  } else {
    console.log('Unchecking!');
    show_curve = false;
    checkbox2.checked(false);
    show_all_curve = false;
  }
}

function myCheckedEvent2() {
  if (this.checked()) {
    console.log('Checking!');
    show_all_curve = true;
    show_curve = true;
    checkbox.checked(true);
  } else {
    console.log('Unchecking!');
    show_all_curve = false;
  }
}

function keyTyped() {
    if(key === 's') {

    }
    if(key === 'g') {

    }
}

function removeEvent() {
    while (array.length) {
        array.pop();
    }
}

months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juillet", "Aout", "Sept", "Oct", "Nov", "Déc"]

function unit(){
    
}

function draw() {
    //background(30,50,180);
    background(240);
    
    
    
    for(var i=0;i<array.length;i++){
        array[i].show();
    }
    
    if(show_curve){
        drawCurve();
    }
    
    if(item=="temperature"){
        draw_thermometer();
    }
    
    textSize(15);
    fill(15);
    noStroke();
    
    for(let i=0;i<12;i++){
        text(months[i],map(i,0,n-1,margin,cnv.width-margin)-10,cnv.height-15);
    }
    
    text(valmax,10,posmax);
    
    text(valmin,10,cnv.height-posmin);
}

function transform(v){
    return map(v,valmin,valmax,cnv.height-posmin,posmax);
}

function drawCurve(){
    stroke(35,100);
    noFill();
    strokeWeight(2.0);
    
    //beginShape();
    for(let i=0;i<n-1;i++){
        let x1 = map(i,0,n-1,margin,cnv.width-margin);
        let x2 = map(i+1,0,n-1,margin,cnv.width-margin);
        let y1 = transform(array[i].h);
        let y2 = transform(array[i+1].h);
        let activation = constrain(map(mouseX-(x1+x2)/2+0.75*mouseWidth,0,mouseWidth,0,1),0,1);
        if(show_all_curve){
            activation = 1;
        }
        
        stroke(35,100*activation);
        
        if(item=="temperature"){
            //console.log("Here!\n");
            let from = color(50, 50, 50, 200*activation);
            let to = color(255,50,0,200*activation);
            let h = (array[i].h+array[i+1].h)/2;
            let inter = lerpColor(from,to,1.2*h/cnv.height);
            //console.log(inter);
            stroke(inter);
        }
        
        line(x1,y1,x2,y2);
        
        //vertex(x,y);
    }
    //endShape();
    
    strokeWeight(4.0);
    stroke(15);
    
    for(let i=0;i<n;i++){
        let x = map(i,0,n-1,margin,cnv.width-margin);
        let y = transform(array[i].h);
        
        let activation = constrain(map(mouseX-x+0.75*mouseWidth,0,mouseWidth,0,1),0,1);
        if(show_all_curve){
            activation = 1;
        }
        stroke(15,255*activation);
        
        point(x,y);
    }
}

var item = "nitrate";

function mySelectEvent() {
  item = sel.value();
  initialize(item);
}

function draw_thermometer(){
    push();
    
    translate(mouseX,0);
    
    fill(255);
    noStroke();

    let radius = 10;
    
    ellipse(0,cnv.height-50,2.5*radius,2.5*radius);
    
    stroke(255);
    strokeWeight(9.0);
    
    line(0,50,0,cnv.height-50);
    
    let nb = 20;
    
    stroke(15);
    strokeWeight(1.0);
    
    for(let i=0;i<nb;i++){
        let y = map(i,0,nb-1,100,cnv.height-100);
        line(-6,y,0,y);
    }
    
    let ind = 0.9999*constrain(map(mouseX,margin,cnv.width-margin,0,n-1),0,n-1);
    let ind2 = floor(ind);
    let interp = ind - ind2;
    let y1 = transform(array[ind2].h);
    let y2 = transform(array[ind2+1].h);
    
    let y = lerp(y1,y2,interp);
    
    stroke(240,0,0);
    strokeWeight(4.0);
    
    line(0,cnv.height-50,0,y);
    
    fill(240,0,0);
    noStroke();
    
    ellipse(0,cnv.height-50,1.5*radius,1.5*radius);
    
    pop();
}
