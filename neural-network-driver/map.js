function checkpoint(x_,y_) {
    this.pos = createVector(x_,y_);
    
    this.show = function(id) {
        stroke(100);
        var c = color(255-70*id,50,50);
        fill(c);
        ellipse(this.pos.x/scaler,this.pos.y/scaler,2*cp_radius/scaler,2*cp_radius/scaler);
    }
}

function gameMap() {
    this.cps = [];
    
    this.add_cp = function() {
        this.cps.push(new checkpoint(random(1000,wid-1000),random(1000,hei-1000)))
    }
    
    this.crossing = function (position) {
        return (this.cps[0].pos.dist(position) < cp_radius);
    }
    
    this.addcps = function() {
        this.add_cp();
        this.add_cp();
        this.add_cp();
    }
    
    this.evolve = function () {
        this.cps.shift();
        this.add_cp();
    }
    
    this.show = function() {
        for(i = 0;i<this.cps.length;i++){
            this.cps[i].show(i);
        }
    }
}