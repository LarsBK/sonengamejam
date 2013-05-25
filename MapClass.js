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
                var r = new cc.Rect(t.getPosition().x, t.getPosition().y, t._rect.size.width, t._rect.size.height)
                t.rect = r;
                    t.onColide = static_collide_func;
                    this.static_bodies.push(t);
                }
            }
        }
        
        var exitG = this.getObjectGroup("exits");
        if(exitG) {
            var exit = getObjects();
        for(var i = 0; i < exit.length; i++){
            var e = exit[0];
            this.exits[e["direction"]] = e;
        }
        }
        
        //var obG = this.tiledMap.getObjectGroup()
    }
});