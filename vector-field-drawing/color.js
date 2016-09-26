function transitionSA(delta,temperature){
    var comp = min(1.0,exp(-delta/temperature));
    return (random() < comp);
}

function colorGrad(n) {
  this.complexity = n;
  this.colors = [];
  
  this.ellipseMethod = function() {
    for(var i = 0; i < this.complexity; i++){
      var theta = i*TWO_PI/this.complexity;
      
      var x = 0.8*width/2*cos(theta)+width/2;
      var y = 0.8*height/2*sin(theta)+height/2
      
      var c = get(x,y);
      
      this.colors[i] = [c[0],c[1],c[2]];
      
    }
  }
  
  this.samplingMethod = function() {
    for(var i = 0; i < this.complexity; i++){
      var c = get(random(width),random(height));
      
      this.colors[i] = [c[0],c[1],c[2]];
    }
  }
  
  this.cost = function(k) {
    var myVector = createVector(this.colors[k][0], this.colors[k][1], this.colors[k][2]);
    var myVector1 = myVector.copy();
    var myVector2 = myVector.copy();
    myVector1.sub(createVector(this.colors[(k+1)%this.complexity][0], this.colors[(k+1)%this.complexity][1], this.colors[(k+1)%this.complexity][2]));
    myVector2.sub(createVector(this.colors[(k-1+this.complexity)%this.complexity][0], this.colors[(k-1+this.complexity)%this.complexity][1], this.colors[(k-1+this.complexity)%this.complexity][2]));
    return [myVector2.mag(),myVector1.mag()]
  }
  
  this.optimizeOrder = function(optiSteps) {
    console.log("I'm here");
    for(var i = 0; i < optiSteps; i++){
      var pos1 = floor(random(this.complexity));
      var pos2 = floor(random(this.complexity));
      
      var cost_before;
      var cost_difference;
      if (pos1 === pos2) {
        cost_difference = 0;
      } else {
          var arr1 = this.cost(pos1);
          var arr2 = this.cost(pos2);
          cost_before = arr1[0] + arr1[1] + arr2[0] + arr2[1];
          
          var aux = this.colors[pos1];
          this.colors[pos1] = this.colors[pos2];
          this.colors[pos2] = aux;
          
          arr1 = this.cost(pos1);
          arr2 = this.cost(pos2);
          cost_after = arr1[0] + arr1[1] + arr2[0] + arr2[1];
          
          cost_difference = cost_after - cost_before;
          
          if (cost_difference>0) {
            var aux = this.colors[pos1];
            this.colors[pos1] = this.colors[pos2];
            this.colors[pos2] = aux;
          }
      }
    }
  }
  
  this.optimizeOrderSA = function(optiSteps,temperature) {
    console.log("I'm here");
    for(var i = 0; i < optiSteps; i++){
      var pos1 = floor(random(this.complexity));
      var pos2 = floor(random(this.complexity));
      
      var cost_before;
      var cost_difference;
      if (pos1 === pos2) {
        cost_difference = 0;
      } else {
          var arr1 = this.cost(pos1);
          var arr2 = this.cost(pos2);
          cost_before = arr1[0] + arr1[1] + arr2[0] + arr2[1];
          
          var aux = this.colors[pos1];
          this.colors[pos1] = this.colors[pos2];
          this.colors[pos2] = aux;
          
          arr1 = this.cost(pos1);
          arr2 = this.cost(pos2);
          cost_after = arr1[0] + arr1[1] + arr2[0] + arr2[1];
          
          var cost_difference = cost_after - cost_before;
          
          if (!transitionSA(cost_difference,temperature)) {
            var aux = this.colors[pos1];
            this.colors[pos1] = this.colors[pos2];
            this.colors[pos2] = aux;
          }
      }
    }
  }
  
  this.getColor = function(t) {
    var ind = (t-floor(t))*this.complexity;
    //console.log('pas bug',t);
    var r = lerp(this.colors[floor(ind)][0],this.colors[floor(ind+1)%this.complexity][0],ind-floor(ind));
    var g = lerp(this.colors[floor(ind)][1],this.colors[floor(ind+1)%this.complexity][1],ind-floor(ind));
    var b = lerp(this.colors[floor(ind)][2],this.colors[floor(ind+1)%this.complexity][2],ind-floor(ind));
    return [r,g,b,255];
  }
  
  this.visu = function(w){
    for(var i=0; i<this.complexity; i++){
      var t = i/this.complexity;
      fill(this.getColor(t));
      //console.log(this.getColor(t));
      var y = t*height;
      noStroke();
      rect(width-w,y,w,height/this.complexity);
    }
  }
  
  this.blur = function(steps){
    var cmpl = this.complexity;
    for(var k=0;k<steps;k++){
      var colors2 = [];
      for(var i=0; i<cmpl; i++){
        colors2[i] = this.colors[i];
      }
      for(var i=0; i<cmpl; i++){
        for(var j=0;j<3;j++){
          this.colors[i][j] = (1*colors2[(i-1+cmpl)%cmpl][j] + 2*colors2[i][j] + 1*colors2[(i+1)%cmpl][j])/4;
        }
      }
    }
  }
}