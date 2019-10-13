var cnv;

var array = [];

var n = 12;

let img;

var all_data;


let data_loaded = false;

function preload() {
  //img = loadImage("https://cdn0.iconfinder.com/data/icons/kitchen-colored-3/48/Household_Kitchen_Artboard_120-512.png");
  img = loadImage("https://i.ibb.co/XLvW3GJ/salt3.png");
  
      Papa.parse("data.csv", {
        header: true,
        download: true,
        dynamicTyping: true,
        complete: function(results) {
          console.log("Finished.",results);
          all_data = results;
          data_loaded = true;
        }
      });
}

const margin = 50;

const posmin = 100;
const posmax = 50;

var valmin = 50;
var valmax = 350;
/*
function initialize(item){
    removeEvent();
    divTxt = document.getElementById('textInfos');
    divTxt.innerHTML = '';
    if(item=="Nitrates"){
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            array[i] = new algae(random(100,300),x);
        }
    } else if(item=="Matières en suspension"){
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new particles(random(50,350),x,"suspension");
            array[i] = test;
        }
    } else if(item=="Oxygène"){
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new particles(random(50,350),x,"oxygene");
            array[i] = test;
        }
    } else if(item=="Chlorophylle"){
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new algae(random(50,350),x,"chlorophyll");
            array[i] = test;
        }
    } else if(item=="pH"){
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new phrectangle(random(50,350),x);
            array[i] = test;
        }
    } else if(item=="Salinité"){
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new salt(random(50,350),x);
            array[i] = test;
        }
    } else if(item=="Température"){
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new temperature_value(random(50,350),x);
            array[i] = test;
        }
    }
}
*/

function setMinMax(keyWord){
  console.log("valmin",valmin,"valmax",valmax);
  valmin = 100000000;
  valmax = -1;
  for(let i=0;i<n;i++){
    //console.log("all data",all_data);
    //console.log("data",all_data.data);
    let value = all_data.data[249-11+i-arrayOffset][keyWord];
    //console.log(value);
    valmin = Math.min(value,valmin);
    valmax = Math.max(value,valmax);
    //console.log("valmin",valmin,"valmax",valmax);
  }
  //valmin = mn;
  //valmax = mx;
}

var year = 2018;
var arrayOffset = 0;

var K = 10;

meanArray = [];

function setMeanArray(keyWord){
  for(let i=0;i<n;i++){
    let sum = 0;
    for(let j=1;j<=K;j++){
      sum += all_data.data[249-11+i-n*j][keyWord];
    }
    sum = sum/K;
    meanArray[i] = sum;
  }
  for(let i=0;i<n;i++){
    let value = meanArray[i];
    valmin = Math.min(value,valmin);
    valmax = Math.max(value,valmax);
  }
}

function initialize(item){
    removeEvent();
    divTxt = document.getElementById('textInfos');
    divTxt.innerHTML = '';
    if(item=="Nitrates"){
      let keyWord = "nitrates";
        setMinMax(keyWord);
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            array[i] = new algae(all_data.data[249-11+i-arrayOffset][keyWord],x);
        }
        setMeanArray(keyWord);
    } else if(item=="Matières en suspension"){
      let keyWord = "matieres";
        setMinMax(keyWord);
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new particles(all_data.data[249-11+i-arrayOffset][keyWord],x,"suspension");
            array[i] = test;
        }
        setMeanArray(keyWord);
    } else if(item=="Oxygène"){
      let keyWord = "oxygene";
        setMinMax(keyWord);
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new particles(all_data.data[249-11+i-arrayOffset][keyWord],x,"oxygene");
            array[i] = test;
        }
        setMeanArray(keyWord);
    } else if(item=="Chlorophylle"){
      let keyWord = "chlorophylle";
        setMinMax(keyWord);
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new algae(all_data.data[249-11+i-arrayOffset][keyWord],x,"chlorophyll");
            array[i] = test;
        }
        setMeanArray(keyWord);
    } else if(item=="pH"){
      let keyWord = "ph";
        setMinMax(keyWord);
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new phrectangle(all_data.data[249-11+i-arrayOffset][keyWord],x);
            array[i] = test;
        }
        setMeanArray(keyWord);
    } else if(item=="Salinité"){
      let keyWord = "salinite";
        setMinMax(keyWord);
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new salt(all_data.data[249-11+i-arrayOffset][keyWord],x);
            array[i] = test;
        }
        setMeanArray(keyWord);
    } else if(item=="Température"){
      let keyWord = "temperature";
        setMinMax(keyWord);
        for(let i=0;i<n;i++){
            let x = map(i,0,n-1,margin,cnv.width-margin);
            let test = new temperature_value(all_data.data[249-11+i-arrayOffset][keyWord],x);
            array[i] = test;
        }
        setMeanArray(keyWord);
    }
}

function setup() {
  


  
    sel = createSelect();
    sel.parent("selector");

    cnv = createCanvas(1000,500);
    cnv.parent('canvas');
    background('#e0f7fa');


    //sel.position(10, 10);



    sel.option("Nitrates");
    sel.option("Température");
    sel.option("Salinité");
    sel.option("Chlorophylle");
    sel.option("pH");
    sel.option("Oxygène");
    sel.option("Matières en suspension");

    sel.changed(mySelectEvent);
    
    sel2 = createSelect();
    sel2.parent("selector");
    
    sel2.option("2018");
    sel2.option("2017");
    sel2.option("2016");
    sel2.option("2015");
    sel2.option("2014");
    sel2.option("2013");
    sel2.option("2012");
    sel2.option("2011");
    sel2.option("2010");
    sel2.option("2009");
    sel2.option("2008");
    
    sel2.changed(mySelectEvent2);

    

    checkbox2 = createCheckbox(' Afficher la courbe', false);
    checkbox2.parent("canvas");
    checkbox2.changed(myCheckedEvent2);
    
    checkbox3 = createCheckbox(' Afficher la courbe moyenne 2008-2017', false);
    checkbox3.parent("canvas");
    checkbox3.changed(myCheckedEvent3);
    checkbox3.style('color', '#ff0000')

    but = createButton("Plus d'infos");
    but.parent("canvas");
    but.mouseClicked(displayInfos);


}

let show_curve = true;
let show_curve2 = false;
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
  } else {
    console.log('Unchecking!');
    show_all_curve = false;
  }
}

function myCheckedEvent3() {
  if (this.checked()) {
    console.log('Checking!');
    show_curve2 = true;
  } else {
    console.log('Unchecking!');
    show_curve2 = false;
  }
  initialize(sel.value());
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

months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"]

function unit(){
    let str;
    if (item == "Nitrates"){
      str = "(μmol/L)";
  }
  else if (item == "Température") {
    str = "°C";
  }
  else if (item == "Salinité") {
    str = "(μmol/L)";
  }
  else if (item == "pH") {
    str = "";
  }
  else if (item == "Matières en suspension") {
    str = "(mg/L)";
  }
  else if (item == "Oxygène") {
    str = "(mL/L)";
  }
  else if (item == "Chlorophylle") {
    str = "(μg/L)";
  }
  
  return str;
}

var nothingyet = true;

function draw() {
    //background(30,50,180);
    
    
    if(data_loaded&&nothingyet){
      initialize(sel.value()); //fait pleins de choses canvas avant initialize
      nothingyet = false;
    }

    if(!nothingyet){
      background('#e0f7fa');
      
      for(var i=0;i<array.length;i++){
          array[i].show();
      }
  
      if(show_curve){
          drawCurve();
      }
      
      if(show_curve2){
          drawCurve2();
      }
  
      if(item=="Température"){
          draw_thermometer();
      }
  
      textSize(16);
      fill(15);
      noStroke();
  
      for(let i=0;i<12;i++){
          text(months[i],map(i,0,n-1,margin,cnv.width-margin)-25,cnv.height-15);
      }
      
      let str = unit();
      
      //stroke(255);
      let precision = 1000.0;
      let v1 = floor(precision*valmin)/precision;
      let v2 = floor(precision*valmax)/precision;
      
      noStroke();
      fill(255);
      text(v2,12,posmax+2);
      text(v1,12,cnv.height-posmin+2);
      text(str,7,25);
      
      //stroke(0);
      fill(0);
      text(v2,10,posmax);
      text(v1,10,cnv.height-posmin);
      text(str,5,23);
      
      
    }
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

        if(item=="Température"){
            //console.log("Here!\n");
            let from = color(50, 50, 50, 200*activation);
            let to = color(255,50,0,200*activation);
            let h = (array[i].h+array[i+1].h)/2;
            let inter = lerpColor(from,to,1.2*map(h,valmin,valmax,0,1));
            //console.log(inter);
            stroke(inter);
        }

        line(x1,y1,x2,y2);

        //vertex(x,y);
    }
    //endShape();
    
    let precision = 1000.0;
    
    for(let i=0;i<n;i++){
      let x = map(i,0,n-1,margin,cnv.width-margin);
      let y = transform(array[i].h);
      let af = exp(-abs(x-mouseX)/25.0);
      
      fill(0,af*255);
      noStroke();
      
      text(floor(precision*array[i].h)/precision,x+7,y-12);
    }

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

function drawCurve2(){
    stroke(35,35,200);
    noFill();
    strokeWeight(3.0);

    //beginShape();
    for(let i=0;i<n-1;i++){
        let x1 = map(i,0,n-1,margin,cnv.width-margin);
        let x2 = map(i+1,0,n-1,margin,cnv.width-margin);
        let y1 = transform(meanArray[i]);
        let y2 = transform(meanArray[i+1]);
        let activation = constrain(map(mouseX-(x1+x2)/2+0.75*mouseWidth,0,mouseWidth,0,1),0,1);
        if(show_all_curve){
            activation = 1;
        }

        stroke(255,0,0,100*activation);

        if(item=="Température"){
            //console.log("Here!\n");
            let from = color(50, 50, 50, 200*activation);
            let to = color(255,50,0,200*activation);
            let h = (meanArray[i]+meanArray[i+1])/2;
            let inter = lerpColor(from,to,1.2*map(h,valmin,valmax,0,1));
            //console.log(inter);
            stroke(inter);
        }

        line(x1,y1,x2,y2);

        //vertex(x,y);
    }
    //endShape();
    
    let precision = 1000.0;
    
    for(let i=0;i<n;i++){
      let x = map(i,0,n-1,margin,cnv.width-margin);
      let y = transform(meanArray[i]);
      let af = exp(-abs(x-mouseX)/25.0);
      
      fill(255,0,0,af*255);
      noStroke();
      
      text(floor(precision*meanArray[i])/precision,x+7,y+13);
    }

    strokeWeight(4.0);
    stroke(15,15,220);

    for(let i=0;i<n;i++){
        let x = map(i,0,n-1,margin,cnv.width-margin);
        let y = transform(meanArray[i]);
        
        let activation = constrain(map(mouseX-x+0.75*mouseWidth,0,mouseWidth,0,1),0,1);
        if(show_all_curve){
            activation = 1;
        }
        stroke(255,0,0,255*activation);
        
        point(x,y);
    }
}


var item = "Nitrates";

function mySelectEvent() {
  item = sel.value();
  initialize(item);
}

function mySelectEvent2() {
  if(sel2.value()=="2018"){
    year = 2018;
    arrayOffset = 0;
  } else if(sel2.value()=="2017"){
    year = 2017;
    arrayOffset = 12;
  } else if(sel2.value()=="2016"){
    year = 2016;
    arrayOffset = 12*2;
  } else if(sel2.value()=="2015"){
    year = 2015;
    arrayOffset = 12*3;
  } else if(sel2.value()=="2014"){
    year = 2014;
    arrayOffset = 12*4;
  } else if(sel2.value()=="2013"){
    year = 2013;
    arrayOffset = 12*5;
  } else if(sel2.value()=="2012"){
    year = 2012;
    arrayOffset = 12*6;
  } else if(sel2.value()=="2011"){
    year = 2011;
    arrayOffset = 12*7;
  } else if(sel2.value()=="2010"){
    year = 2010;
    arrayOffset = 12*8;
  } else if(sel2.value()=="2009"){
    year = 2009;
    arrayOffset = 12*9;
  } else if(sel2.value()=="2008"){
    year = 2008;
    arrayOffset = 12*10;
  }
  
  initialize(sel.value());
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
    
    line(0,25,0,cnv.height-50);
    
    let nb = 23;
    
    stroke(15);
    strokeWeight(1.0);
    
    for(let i=0;i<nb;i++){
        let y = map(i,0,nb-1,35,cnv.height-100);
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


function displayInfos(){
  divTxt = document.getElementById('textInfos');
  divTxt.innerHTML = '';
  if (item == "Nitrates"){
    txt = createP('Le nitrate (NO3) nourrit les algues qui se développent par photosynthèse. Il est essentiel à la vie de ces organismes du premier échelon de la chaîne alimentaire, mais peut également, en cas de concentration trop élevée, provoquer une surproduction de matière organique. Une trop grande quantité d’algues peut étouffer le milieu car leur décomposition consomme l’oxygène.');
    txt.parent("textInfos");
  }
  else if (item == "Température") {
    txt = createP('La température peut directement modifier la survie des espèces dans leur écosystème. Le réchauffement de l’air provoque le réchauffement de l’eau, qui impacte la production de la faune et la flore marines.');
    txt.parent("textInfos");
  }
  else if (item == "Salinité") {
    txt = createP('La salinité est la concentration en sel dans l’eau de mer. Les poissons se sont adaptés au fil des siècles à leurs milieux : eau douce ou eau salée, et aux variations saisonnières de la salinité, notamment en migrant vers des zones plus propices à leur survie. Cependant, l’évolution pluriannuelle de la salinité peut mener à un bouleversement de l’équilibre du milieu en modifiant la distribution géographique des espèces.');
    txt.parent("textInfos");
  }
  else if (item == "pH") {
    txt = createP('Le pH est l’unité de mesure de l’acidité du milieu. Le milieu marin favorise naturellement la calcification (formation de calcaire). Sans calcaire, plus de coquillages ! Y compris les bivalves comme les coquilles Saint-Jacques. La production de coquilles notamment dans la rade de Brest est un patrimoine culturel et économique à conserver, et il est menacé par les émissions de CO2.');
    txt.parent("textInfos");
  }
  else if (item == "Matières en suspension") {
    txt = createP('La présence de matière en suspension renseigne sur l’état de limpidité des eaux. Les particules sont minérales (sols et sédiments) ou organiques (faune et flore). Sa variabilité dépend de l’érosion des sols, de la remise en suspension des sédiments, et de l’activité biologique du milieu.');
    txt.parent("textInfos");
  }
  else if (item == "Oxygène") {
    txt = createP('L’oxygène est une denrée déterminante dans la vie des espèces marines. En quantité insuffisante, il peut, à terme, entrainer la disparition d’espèces.');
    txt.parent("textInfos");
  }
  else if (item == "Chlorophylle") {
    txt = createP('La chlorophylle est un pigment indispensable pour produire de la matière organique en captant l’énergie solaire. Elle est un indicateur de la quantité d’algues présentes dans le milieu.');
    txt.parent("textInfos");
  }
}
