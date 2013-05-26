var MapClass = cc.TMXTiledMap.extend({
    ctor : function(file){
        this._super();
        console.log("Loading map: " + file)
        this.initWithTMXFile(file);
        this.static_bodies = [];
        this.dynamic_bodies = [];
        this.exits = {};
        //this.setPosition(cc.p(0,0))
        
        for(var x = 0; x < this.getMapSize().width; x++){
            for(var y = 0; y < this.getMapSize().height; y++){
                var t = this.getLayer("Tile Layer 1").getTileAt(new cc.Point(x,y));
                if(t){
                    t.onColide = static_collide_func;
                    this.static_bodies.push(t);
                }
            }
        }
        
        var triggers = this.getObjectGroup("objects");
        if(triggers) {
            var trigger = triggers.getObjects();
            for(var i = 0; i < trigger.length; i++){
                var o = trigger[i]
                console.log(o)
                if(o.type == "teleport"){
                    o.action = "teleport"
                    var t = new Trigger(o)
                    this.exits[o.direction] = {trigger:t};
                    this.static_bodies.push(t)
                    this.addChild(t)
                }else if(o.type== "platform"){
                  var p = new Platform("ccbResources/" + o.sprite,{x:o.x, y:o.y}, {x:o.x+o.width, y:o.y+o.height});
                  this.static_bodies.push(t);
                  this.addChild(p);
                }else if(o.type == "turret"){
                    var t = new Turret(o);
                    this.addChild(t);
                    this.static_bodies.push(t)
                } else if(o.type == "slime"){
                    var s = new Slime(t);
                    this.addChild(t);
                    this.static_bodies.push(t);
                }
            }
        }
        
        //var obG = this.tiledMap.getObjectGroup()
    }
});
