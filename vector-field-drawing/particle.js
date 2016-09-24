function Particle(pos_seed) {
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.particuleOffset = random(10);
  this.h = this.particuleOffset;
  this.h2 = 0;
  
  this.initial_position = function(pos_seed) {
    this.pos = createVector(width*noise(1000*pos_seed + 0.5*random()), height*noise(2000*pos_seed + 0.5*random()));
    this.prevPos = this.pos.copy();
  }
  
  this.initial_position(pos_seed);
  
  this.offp = random(10000);

  this.prevPos = this.pos.copy();

  this.update = function() {
    this.vel.add(this.acc);
    this.vel.mult(speedSlider.value());
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    var noise0 = noise(0);
    
    this.start_red = brightSlider.value()*noise(12345*noise0+ redoSlider.value());
    this.start_green = brightSlider.value()*noise(1234*noise0 + greenoSlider.value())
    this.start_blue = brightSlider.value()*noise(2123*noise0 + blueoSlider.value());
    this.amp_red = noise(3333*noise0 + 3*redoSlider.value())*contrastSlider.value();
    this.amp_green = noise(2222*noise0 + 3*greenoSlider.value())*contrastSlider.value();
    this.amp_blue = noise(1111*noise0 + 3*blueoSlider.value())*contrastSlider.value();
    
    //this.posSphere = createVector(width/2*sin(PI*this.pos.y/height)*cos(2*PI*this.pos.x/width) + width/2,height/2*cos(PI*this.pos.y/height) + height/2);
  }

  this.follow = function(vectors) {
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force);
  }

  this.applyForce = function(force) {
    var xx = (this.pos.x - width/2)/width;
    var yy = (this.pos.y - height/2)/height;
    this.acc.add(force);
    
    this.acc.x += xbiasSlider.value();
    this.acc.y += ybiasSlider.value();
    
    var swirlb = createVector(-(sbiasYSlider.value() - this.pos.y) - sbiasRSlider.value()*(sbiasXSlider.value()- this.pos.x),sbiasXSlider.value()- this.pos.x - sbiasRSlider.value()*(sbiasYSlider.value() - this.pos.y));
    swirlb.normalize();
    swirlb.mult(sbiasSlider.value()*forceMagSlider.value());
    this.acc.add(swirlb);
    
    this.acc.add(createVector((2*random()-1)*forceNoiseSlider.value(),(2*random()-1)*forceNoiseSlider.value()));
    
    if ((meffectCbox.checked() || panels_are_there === 0) && mouseIsPressed && mouseX>=0 && mouseY>=0 && mouseX<width && mouseY<height) {
        var attraction = createVector(mouseX - this.pos.x,mouseY - this.pos.y);
        attraction.normalize();
        attraction.mult(mouseSlider.value()*forceMagSlider.value());
        this.acc.add(attraction);
        
        var swirl = createVector(-(mouseY - this.pos.y),mouseX - this.pos.x);
        swirl.normalize();
        swirl.mult(mouseSwirlSlider.value()*forceMagSlider.value());
        this.acc.add(swirl);
    }
    
  }

    
  this.show = function() {
    
    var myalpha = alphaSlider.value()*alphaSlider.value()*255;
    var sw = (1-penNoiseSlider.value())*0.5 + penNoiseSlider.value()*noise(20000 + 0.01*frameCount + this.offp);
    
    this.h2 = this.h2 + colorGradientSlider.value()*colorGradientSlider.value();
    var multiplier;
    if (color_mode === 'Normal') {
        multiplier = 1;
    } else {
      multiplier = 2;
    }
    this.h = this.particuleOffset*particleColorOffsetSlider.value()*multiplier + this.h2;
    var freq,myred,mygreen,myblue;
    if (color_mode === 'Normal') {
        var param = (sin(0.01*redSlider.value()*this.h + redoSlider.value())+1)/2;
        var param2 = (sin(0.01*greenSlider.value()*this.h + greenoSlider.value())+1)/2;
        var param3 = (sin(0.01*blueSlider.value()*this.h + blueoSlider.value())+1)/2;

        
        if (color_noise) {
          freq = noisefreqSlider.value()*noisefreqSlider.value();
          myred = this.start_red + this.amp_red*param + colornoiseSlider.value()*(noise(freq*this.h)-0.5) + rednSlider.value()*(noise(freq*this.h + 1478)-0.5);
          mygreen = this.start_green + this.amp_green*param2 + colornoiseSlider.value()*(noise(freq*this.h) - 0.5) + greennSlider.value()*(noise(freq*this.h + 1778)-0.5);
          myblue = this.start_blue + this.amp_blue*param3 + colornoiseSlider.value()*(noise(freq*this.h)-0.5) + bluenSlider.value()*(noise(freq*this.h + 1978)-0.5);
        } else {
          freq = noisefreqSlider.value()*noisefreqSlider.value();
          myred = this.start_red + this.amp_red*param;
          mygreen = this.start_green + this.amp_green*param2;
          myblue = this.start_blue + this.amp_blue*param3;
        }
    } else {
      var auxxx = myGrad.getColor(0.0008*this.h);
      myred = auxxx[0];
      myblue = auxxx[1];
      mygreen = auxxx[2];
    }
    stroke(myred, myblue, mygreen, myalpha);
    
    var aux_sz = penSizeSlider.value();
    
    if (defsel === 'line') {
        strokeWeight(aux_sz*aux_sz*sw*sw*sw);
        line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    } else if (defsel === 'circle') {
        strokeWeight(penstrokeSlider.value());
        var radius = aux_sz*aux_sz*sw*sw*sw;
        fill(myred, mygreen, myblue, myalpha);
        ellipse(this.pos.x, this.pos.y, radius,radius);
    } else if (defsel === 'square') {
        strokeWeight(penstrokeSlider.value());
        var radius = aux_sz*aux_sz*sw*sw*sw;
        fill(myred, mygreen, myblue, myalpha);
        rect(this.pos.x - radius/2, this.pos.y - radius/2, radius,radius);
    } else if (defsel === 'empty circle') {
        strokeWeight(penstrokeSlider.value());
        noFill();
        var radius = aux_sz*aux_sz*sw*sw*sw;
        ellipse(this.pos.x, this.pos.y, radius,radius);
    } else if (defsel === 'empty square') {
        strokeWeight(penstrokeSlider.value());
        noFill();
        var radius = aux_sz*aux_sz*sw*sw*sw;
        rect(this.pos.x - radius/2, this.pos.y - radius/2, radius,radius);
    }
    
    this.updatePrev();
  }

  this.updatePrev = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  this.edges = function() {
    
    if (bounce) {
      if (this.pos.x > width) {
        this.vel.x *= -2;
        this.updatePrev();
      }
      if (this.pos.x < 0) {
        this.vel.x *= -2;
        this.updatePrev();
      }
      if (this.pos.y > height) {
        this.vel.y *= -2;
        this.updatePrev();
      }
      if (this.pos.y < 0) {
        this.vel.y *= -2;
        this.updatePrev();
      }
    } else {
      if (this.pos.x > width) {
        this.pos.x = 0;
        this.updatePrev();
      }
      if (this.pos.x < 0) {
        this.pos.x = width;
        this.updatePrev();
      }
      if (this.pos.y > height) {
        this.pos.y = 0;
        this.updatePrev();
      }
      if (this.pos.y < 0) {
        this.pos.y = height;
        this.updatePrev();
      }
    }

  }

}
