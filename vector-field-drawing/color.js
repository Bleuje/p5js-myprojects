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
  
  this.getColor = function(t) {
    var ind = (t-floor(t))*this.complexity;
    //console.log('pas bug',t);
    var r = lerp(this.colors[floor(ind)][0],this.colors[floor(ind+1)%this.complexity][0],ind-floor(ind));
    var g = lerp(this.colors[floor(ind)][1],this.colors[floor(ind+1)%this.complexity][1],ind-floor(ind));
    var b = lerp(this.colors[floor(ind)][2],this.colors[floor(ind+1)%this.complexity][2],ind-floor(ind));
    return [r,g,b,255];
  }
  
  this.draw = function(x,y,w,h){
    for(var i=x; i<x+w; i++){
      var t = (i-x)/w;
      stroke(this.getColor(t));
      
      line(i,0,i,h);
    }
  }
}