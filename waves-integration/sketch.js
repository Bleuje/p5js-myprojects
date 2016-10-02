var cnv;

var scaler = 10;

var wid = 300;
var hei = 300;

function state() {
    this.tab = [];
    this.tab2 = [];
    this.cop = [];
    
    this.copy1 = function() {
        for(var i=0;i<hei/scaler;i++){
            this.tab2[i] = [];
            for(var j=0;j<wid/scaler;j++){
                this.tab2[i][j] = this.cop[i][j];
            }
        }
    }
    
    this.copy2 = function() {
        this.cop = [];
        for(var i=0;i<hei/scaler;i++){
            this.cop[i] = [];
            for(var j=0;j<wid/scaler;j++){
                this.cop[i][j] = this.tab[i][j];
            }
        }
    }
    
    this.randomize = function() {
        for(var i=0;i<hei/scaler;i++){
            this.tab[i] = [];
            for(var j=0;j<wid/scaler;j++){
                this.tab[i][j] = 100+50*random();
            }
        }
        this.copy2();
        this.copy1();
    }
    
    this.randomize();
    
    this.transform = function(cc,lambda,f,deltat,deltax) {
        this.copy2();
        for(var i=1;i<hei/scaler-1;i++){
            for(var j=1;j<wid/scaler-1;j++){
                let res = 2*this.cop[i][j] - this.tab2[i][j] - lambda*deltat*(this.cop[i][j] - this.tab2[i][j]) + cc*cc*deltat*deltat/(deltax*deltax)*(this.cop[i][j-1] - 2*this.cop[i][j] + this.cop[i][j+1] + this.cop[i-1][j] - 2*this.cop[i][j] + this.cop[i+1][j]) + deltat*deltat*f;
                this.tab[i][j] = res;
            }
        }
        for(var i=0;i<hei/scaler;i++){
            this.tab[i][0] = this.tab[i][1];
            this.tab[i][wid/scaler-1] = this.tab[i][wid/scaler-2];
        }
        this.copy1();
    }
    
    this.show = function(){
        //stroke(0,100);
        noStroke();
        for(var i=0;i<hei/scaler;i++){
            for(var j=0;j<wid/scaler;j++){
                var c = color(this.tab[i][j],this.tab[i][j],255);
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
    background(120);
    
    st = new state();
    
    cslider = createSlider(500,2000,1000,1);
    lslider = createSlider(1000,4000,2000,1);
    fslider = createSlider(0,5,1,0.01);
    tslider = createSlider(0.000001,0.00001,0.000005,0.0000001);
    xslider = createSlider(0.01,0.2,0.05,0.01);
    
    cslider.parent('buttons');
    lslider.parent('buttons');
    fslider.parent('buttons');
    tslider.parent('buttons');
    xslider.parent('buttons');
}

function mousePressed() {
    if (mouseX>=0&&mouseY>=0&&mouseX<width&&mouseY<height) {
        st.tab[floor(mouseX/scaler)][floor(mouseY/scaler)] = 200;
    }
}

function draw() {
    st.show();
    st.transform(cslider.value(),lslider.value(),fslider.value(),tslider.value(),xslider.value());
    //st.randomize();
}