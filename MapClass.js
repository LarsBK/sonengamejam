var MapClass = cc.TMXTiledMap.extend({
    ctor : function(file){
        this._super();
        console.log("Loading map: " + file)
        this.initWithTMXFile(file);
        this.static_bodies = [];
        this.dynamic_bodies = [];
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
            for(var i = 0; i < triggers.length; i++){
                var o = triggers[i]
                if(triggers[i].type == "trigger"){
                var e = trigger[i];
                console.log(e)
                var t = new Trigger(e)
                this.static_bodies.push(t)
                }else if(triggers[i].type== "platform"){
                  //  var p = new Platform(o.sprite,
                   //     {x:o.
                }
            }
        }
        
        //var obG = this.tiledMap.getObjectGroup()
    }
});
