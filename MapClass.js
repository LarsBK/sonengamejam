var MapWrapper = cc.Layer.extend({
    ctor:function(maplist, dir, connected){
        this._super();
        this.maplist = maplist;
        this.exits = {};
        this.dynamic_bodies = [];
        this.static_bodies = [];
        this.loaded = false;
        this.setPosition(0,0)
        
        if(connected){
            this.location = {x:connected.location.x,y:connected.location.y};
            this.exits[dir] = connected;
            switch(dir) {
                case "east":
                    this.location.x = connected.location.x-1;
                    break;
                case "west":
                    this.location.x = connected.location.x+1;
                    break;
                case "up":
                    this.location.y = connected.location.y-1;
                    break;
                case "down":
                    this.location.y = connected.location.y+1;
                    break;
            }
            
            var orig = Math.floor(Math.random()*this.maplist.length);
           var tmpMap = null;
            for(var nmap = 0; nmap < this.maplist.length; nmap++){
                tmpMap = (this.maplist[((orig+nmap)%this.maplist.length)]);
                if(dir == null || dir in tmpMap.exits) {
                    this.map = tmpMap
                    break;
                }
            }
            
        } else {
            this.location = {x:5,y:5};
            this.map = this.maplist[0];
        }
    
         this.addChild(cc.LayerColor.create( new cc.c4b(255*Math.random(),
            255*Math.random(),255*Math.random(), 255), this.map.getContentSize().width, this.map.getContentSize().height), -3)
    
        console.log("Map chosen: " + this.map.file)
        if(this.map == null){
            throw NoMapToConnectException;
        }
    },

    
    load:function(){
        //if(this.loaded){
        //    return;
        //}
        this.map.removeFromParent();
        for(var e in this.map.exits){
            if(! (e in this.exits)){
                this.exits[e] = new MapWrapper(this.maplist, oppositeDir(e), this);
            }
        }
        this.addChild(this.map, -1)
        this.map.load();
        this.loaded = true;
        console.log("load done")
    }
});

var MapClass = cc.TMXTiledMap.extend({
    ctor : function(file){
        this.file = file
        this._super();
        this.objects = [];
        this.exits = {};
        console.log("Loading map: " + file)
        this.initWithTMXFile(file);
        
        var triggers = this.getObjectGroup("objects");
        if(triggers) {
            var trigger = triggers.getObjects();
            for(var i = 0; i < trigger.length; i++){
                var o = trigger[i]
                if(o.type == "teleport"){
                    this.exits[o.direction] = {};
                }
                this.objects.push(o);
            }
        } else {
            throw InvalidMapException;
        }
        
    },
        
    load:function(){
        console.log("MapClass.load()")
        //this.setPosition(cc.p(0,0))
        
        for(var x = 0; x < this.getMapSize().width; x++){
            for(var y = 0; y < this.getMapSize().height; y++){
                var t = this.getLayer("Tile Layer 1").getTileAt(new cc.Point(x,y));
                if(t){
                    t.onColide = static_collide_func;
                    this.getParent().static_bodies.push(t);
                }
            }
        }

            for(var i = 0; i < this.objects.length; i++){
                var o = this.objects[i];
                console.log(o)
                switch(o.type){
                    case "teleport":
                        o.action = "teleport"
                        var t = new Trigger(o)
                        this.exits[o.direction] = t;
                        this.getParent().static_bodies.push(t)
                        this.getParent().addChild(t)
                        break;
                    case "platform":
                        var p = new Platform("ccbResources/metalplatform.png",{x:o.x, y:o.y}, {x:o.x+o.width, y:o.y+o.height});
                        this.getParent().static_bodies.push(t);
                        this.getParent().addChild(p);
                        break;
                    /*
                    case "turret":
                        var t = new Turret(o);
                        this.getParent().addChild(t);
                        this.getParent().static_bodies.push(t)
                        break;*/
                    case "slime":
                        var s = new Slime(t);
                        this.getParent().addChild(s);
                        this.getParent().static_bodies.push(t);
                        break;
                }
            }
        
        //var obG = this.tiledMap.getObjectGroup()
    }
});
