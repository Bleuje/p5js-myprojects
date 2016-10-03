var cnv;

var scaler = 5;

var wid = 300;
var hei = 300;

var cDefault = 3000;
var lDefault = 2000;
var tDefault = 0.000008;
var xDefault = 0.05;
var hDefault = 160;

function state() {
    this.tab = [];
    this.tab2 = [];
    this.cop = [];
    
    this.nbi = floor(wid/scaler);
    this.nbj = floor(hei/scaler);
    
    this.copy1 = function() {
        for(var i=0;i<this.nbi;i++){
            this.tab2[i] = [];
            for(var j=0;j<this.nbj;j++){
                this.tab2[i][j] = this.cop[i][j];
            }
        }
    }
    
    this.copy2 = function() {
        this.cop = [];
        for(var i=0;i<this.nbi;i++){
            this.cop[i] = [];
            for(var j=0;j<this.nbj;j++){
                this.cop[i][j] = this.tab[i][j];
            }
        }
    }
    
    this.randomize = function() {
        for(var i=0;i<this.nbi;i++){
            this.tab[i] = [];
            for(var j=0;j<this.nbj;j++){
                this.tab[i][j] = 100+50*random();
            }
        }
        this.copy2();
        this.copy1();
    }
    
    this.randomize();
    
    this.transform = function(cc,lambda,deltat,deltax) {
        this.copy2();
        for(var i=1;i<this.nbi-1;i++){
            for(var j=1;j<this.nbj-1;j++){
                let res = 2*this.cop[i][j] - this.tab2[i][j] - lambda*deltat*(this.cop[i][j] - this.tab2[i][j]) + cc*cc*deltat*deltat/(deltax*deltax)*(this.cop[i][j-1] - 2*this.cop[i][j] + this.cop[i][j+1] + this.cop[i-1][j] - 2*this.cop[i][j] + this.cop[i+1][j]);
                this.tab[i][j] = res;
            }
        }/*
        for(var i=0;i<hei/scaler;i++){
            this.tab[i][0] = this.tab[i][1];
            this.tab[i][wid/scaler-1] = this.tab[i][wid/scaler-2];
        }
        for(var j=0;j<wid/scaler;j++){
            this.tab[0][j] = this.tab[1][j];
            this.tab[hei/scaler-1][j] = this.tab[hei/scaler-2][j];
        }*/
        /*
        for(var i=0;i<hei/scaler;i++){
            this.tab[i][0] = 125+5*sin(frameCount*0.05);
            this.tab[i][wid/scaler-1] = 125+5*sin(frameCount*0.1);
        }
        for(var j=0;j<wid/scaler;j++){
            this.tab[0][j] = 125+5*sin(frameCount*0.15);
            this.tab[hei/scaler-1][j] = 125+5*sin(frameCount*0.2);
        }*/
        this.copy1();
    }
    
    this.show = function(){
        stroke(0);
        rect(scaler-1,scaler-1,wid - 2*scaler+1,hei - 2*scaler+1);
        noStroke();
        for(var i=1;i<this.nbi-1;i++){
            for(var j=1;j<this.nbj-1;j++){
                var c = color(map(this.tab[i][j],0,255,100,255),map(this.tab[i][j],0,255,120,255),255);
                //fill(this.tab[i][j]);
                fill(c);
                rect(i*scaler,j*scaler,scaler,scaler);
            }
        }
    }
}

function setup() {
    cnv = createCanvas(wid,hei);
    cnv.parent('canvas');
    background(255);
    
    st = new state();
    
    csliderT = createP('Propagation speed (c) : ');
    cslider = createSlider(500,5000,cDefault,1);
    lsliderT = createP('Damping coefficient (lambda) : ');
    lslider = createSlider(150,5000,lDefault,1);
    tsliderT = createP('Time step (Delta_t) : ');
    tslider = createSlider(0.000001,0.000015,tDefault,0.0000001);
    xsliderT = createP('Space step (Delta_x) : ');
    xslider = createSlider(0.03,0.2,xDefault,0.01);
    hsliderT = createP('Added height by click : ');
    hslider = createSlider(30,400,hDefault,1);
    
    csliderT.parent('buttons');
    cslider.parent('buttons');
    lsliderT.parent('buttons');
    lslider.parent('buttons');
    tsliderT.parent('buttons');
    tslider.parent('buttons');
    xsliderT.parent('buttons');
    xslider.parent('buttons');
    hsliderT.parent('buttons');
    hslider.parent('buttons');
    
    rdButton = createButton('Set random height values');
    rdButton.parent('buttons');
    rdButton.mousePressed(rdButtonEvent);
    
    rsButton = createButton('Reset sliders');
    rsButton.parent('buttons');
    rsButton.mousePressed(rsButtonEvent);
}

function mousePressed() {
    if (mouseX>=0&&mouseY>=0&&mouseX<width&&mouseY<height) {
        st.tab[floor(mouseX/scaler)][floor(mouseY/scaler)] += hslider.value();
    }
}

function mouseDragged() {
    if (mouseX>=0&&mouseY>=0&&mouseX<width&&mouseY<height) {
        st.tab[floor(mouseX/scaler)][floor(mouseY/scaler)] += hslider.value();
    }
}

function rdButtonEvent() {
    st.randomize();
}

function rsButtonEvent() {
    cslider.value(cDefault);
    lslider.value(lDefault);
    tslider.value(tDefault);
    xslider.value(xDefault);
}

function draw() {
    st.show();
    st.transform(cslider.value(),lslider.value(),tslider.value(),xslider.value());
    //st.randomize();
}