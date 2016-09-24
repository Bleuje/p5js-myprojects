function Rectangle(pos_seed) {
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.rectangleOffset = random(10);
  this.h = this.rectangleOffset;
  this.h2 = 0;
  
  this.initial_position = function(pos_seed) {
    this.minx = width*noise(1000*pos_seed + 0.5*random());
    this.miny = height*noise(2000*pos_seed + 0.5*random());
    this.maxx = this.minx + 25*noise(123*pos_seed );
    this.maxy = this.miny + 25*noise(1234*pos_seed );
  }
  
  this.initial_position(pos_seed);
  
  this.offp = random(10000);

  this.update = function() {
    this.vel.add(this.acc);
    this.vel.mult(speedSlider.value());
    var my_rd = random(10);
    if (my_rd*my_rd>freezeSlider.value()) {
        if (this.vel.x <= this.vel.y && this.vel.x <= -this.vel.y){
          this.maxx = this.minx;
          this.minx -= this.vel.mag();
      } else if (this.vel.x >= this.vel.y && this.vel.x >= -this.vel.y) {
          this.minx = this.maxx;
          this.maxx += this.vel.mag();
      } else if (this.vel.y <= this.vel.x && this.vel.y <= -this.vel.x) {
          this.maxy = this.miny;
          this.miny -= this.vel.mag();
      } else if (this.vel.y >= this.vel.x && this.vel.y >= -this.vel.x) {
          this.miny = this.maxy;
          this.maxy += this.vel.mag();
      }
    }
    
    
    this.pos = createVector((this.minx+this.maxx)/2,(this.miny+this.maxy)/2);
    
    
    
    this.acc.mult(0);
    
    var noise0 = noise(0);
    
    this.start_red = brightSlider.value()*noise(12345*noise0+ redoSlider.value());
    this.start_green = brightSlider.value()*noise(1234*noise0 + greenoSlider.value())
    this.start_blue = brightSlider.value()*noise(2123*noise0 + blueoSlider.value());
    this.amp_red = noise(3333*noise0 + 3*redoSlider.value())*contrastSlider.value();
    this.amp_green = noise(2222*noise0 + 3*greenoSlider.value())*contrastSlider.value();
    this.amp_blue = noise(1111*noise0 + 3*blueoSlider.value())*contrastSlider.value();
  }

  this.follow = function(vectors) {
    var x = floor((this.minx + this.maxx)/(2*scl));
    var y = floor((this.miny + this.maxy)/(2*scl));
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force);
  }

  this.applyForce = function(force) {
    var pos = createVector((this.minx+this.maxx)/2,(this.miny+this.maxy)/2);
    this.acc.add(force);
    
    this.acc.x += xbiasSlider.value();
    this.acc.y += ybiasSlider.value();
    
    var swirlb = createVector(-(sbiasYSlider.value() - (this.miny+this.maxy)/2) - sbiasRSlider.value()*(sbiasXSlider.value()- (this.minx+this.maxx)/2),sbiasXSlider.value()- (this.minx+this.maxx)/2 - sbiasRSlider.value()*(sbiasYSlider.value() - (this.miny+this.maxy)/2));
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
    
    if (color_mode === 'Normal') {
      
      this.h2 = this.h2 + colorGradientSlider.value();
      this.h = this.rectangleOffset*particleColorOffsetSlider.value() + this.h2;
      
      var param = (sin(0.01*redSlider.value()*this.h + redoSlider.value())+1)/2;
      var param2 = (sin(0.01*greenSlider.value()*this.h + greenoSlider.value())+1)/2;
      var param3 = (sin(0.01*blueSlider.value()*this.h + blueoSlider.value())+1)/2;
    
    
        var freq,myred,mygreen,myblue;
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
      fill(myred, mygreen, myblue, myalpha);

    } else {
      var auxxx = myGrad.getColor(this.h);
      stroke(auxxx[0], auxxx[1], auxxx[2], myalpha);
    }
    
    stroke(box2Slider.value(),boxSlider.value());
    strokeWeight(penstrokeSlider.value());
    
    rect(this.minx, this.miny, this.maxx - this.minx, this.maxy - this.miny);
  }

  this.edges = function() {
    
    if (bounce) {
      if (this.pos.x > width) {
        this.vel.x *= -0.5;
      }
      if (this.pos.x < 0) {
        this.vel.x *= -0.5;
      }
      if (this.pos.y > height) {
        this.vel.y *= -0.5;
      }
      if (this.pos.y < 0) {
        this.vel.y *= -0.5;
      }
    } else {
      if (this.minx > width) {
        this.minx -= 1.1*width;
        this.maxx -= 1.1*width;
      }
      if (this.maxx < 0) {
        this.minx += 1.1*width;
        this.maxx += 1.1*width;
      }
      if (this.miny > height) {
        this.miny -= 1.1*height;
        this.maxy -= 1.1*height;
      }
      if (this.maxy < 0) {
        this.miny += 1.1*height;
        this.maxy += 1.1*height;
      }
    }

  }

}
