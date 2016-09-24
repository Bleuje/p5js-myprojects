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