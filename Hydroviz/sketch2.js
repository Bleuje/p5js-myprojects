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
    let value = all_data.data[249-11+i][keyWord];
    console.log(val);
    valmin = Math.min(value,valmin);
    valmax = Math.max(value,valmax);
    console.log("valmin",valmin,"valmax",valmax);
  }
  //valmin = mn;
  //valmax = mx;
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
            array[i] = new algae(all_data.data[249-11+i][keyWord],x);
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

    

    checkbox2 = createCheckbox(' Afficher la courbe', false);
    checkbox2.parent("canvas");
    checkbox2.changed(myCheckedEvent2);

    but = createButton("Plus d'infos");
    but.parent("canvas");
    but.mouseClicked(displayInfos);


}

let show_curve = true;
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
  
      if(item=="Température"){
          draw_thermometer();
      }
  
      textSize(15);
      fill(15);
      noStroke();
  
      for(let i=0;i<12;i++){
          text(months[i],map(i,0,n-1,margin,cnv.width-margin)-7,cnv.height-15);
      }
      
      text(valmax,10,posmax);
      
      text(valmin,10,cnv.height-posmin);
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

var item = "Nitrates";

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
