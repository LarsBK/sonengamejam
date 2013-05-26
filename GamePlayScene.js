var CCBGamePlayScene = cc.Scene.extend({
    static_body_list: [],
    dynamic_body_list: [],
    
    ctor:function() {
        this._super();
        var node = cc.BuilderReader.load("gameplayscene.ccbi");
        
        var p = new Player();
        p.setPosition(200,350);
        this.player = p;
        
        this.maplist = {};
        this.loadMap("test-map.tmx");
    
        
        this.gpLayer = cc.Layer.create();
        this.addChild(this.gpLayer, 0, "gp")
        this.gpLayer.addChild(this.player);
        this.changeMap(this.maplist["test-map.tmx"])
        
        var plat = new Platform("PlaceChar.png", {x: 60, y: 200}, {x: 300, y: 200});
        this.static_body_list.push(plat);
        this.currentmap.addChild(plat);
        
        this.gpLayer.addChild( cc.BuilderReader.load("Alarmlys.ccbi"))
        
        node.setKeyboardEnabled(true);
        node.onKeyDown = function(key) {this.getParent().onKeyDown(key);};
        node.onKeyUp = function(key) { this.getParent().onKeyUp(key);};
        
        this.addChild(node, 1, "hud");
        this.addChild(cc.LayerColor.create(cc.c4b(180,100,180,255)), -2, "background");
        this.setPosition(cc.p(0,0));  
        this.scheduleUpdate();
        var follow = cc.Follow.create(this.player, new cc.Rect(0,0, this.currentmap._contentSize.width, this.currentmap._contentSize.height))
        this.gpLayer.runAction(follow)
        
    },
    
    loadMap:function(filename)
    {
        var mapclass = new MapClass(filename);
        this.maplist[filename] = mapclass;

    },
    
    changeMap:function(map){
        console.log("changing to map " + map)
        if(this.currentmap){
            this.gpLayer.removeChild(this.currentmap)
        }
        this.static_body_list = map.static_bodies;
        this.dynamic_body_list = [];
        this.dynamic_body_list.push(this.player);
        
        this.gpLayer.addChild(map, 0, "map")
        this.currentmap = map;
        
    },
    
    trigger:function(t){
        console.log(t)
        if(t.action=="die"){
            
        }
    }
    
    onKeyDown : function(key) {
        if(key == cc.KEY.t){
            this.changeMap(this.currentmap);
        }
        this.player.onKeyDown(key);
    },
    
    onKeyUp : function(key) {
        this.player.onKeyUp(key);        
    },
    
    update:function(dt) {
        for(var i = 0; i < this.dynamic_body_list.length; i++){
            var b = this.dynamic_body_list[i];
            var redo = true;
            var it = 10;
            this.handle_gravity(dt, b, b.accel || {x:0, y:0});
            this.handle_air_resistance(dt, b);
            while(redo &&  it-- > 0){
                redo = false;
                
                var nextpos = {x:b.getPosition().x + b.speed.x*dt, y: b.getPosition().y + b.speed.y*dt};

                var nextrect = new cc.Rect( nextpos.x - b._rect.size.width/2,
                    nextpos.y - b._rect.size.height/2, b._rect.size.width, b._rect.size.height);
            
                for(var j = 0; j < this.static_body_list.length; j++){
                    //console.log(this.static_body_list[j])
                    var re = this.static_body_list[j]._rect;
                    re.origin = this.static_body_list[j].getPosition();
                    //console.log(re)
                    if(cc.rectIntersectsRect(nextrect, re)){
                        if("onColide" in b){
                            redo = redo || b.onColide(this.static_body_list[j]);
                        }
                       if("onColide" in this.static_body_list[j]){
                            redo = redo || this.static_body_list[j].onColide(b);
                        }
                    }
                }
            }
            b.setPosition(nextpos)
        }
    },
    
    gravity: { y: -900.0, x: 0 },
    
    absmax:function(a, b) {
        if(Math.abs(a) < Math.abs(b))
            return a;
        else
            return (a < 0) ? -b : b;
    },
    
    handle_air_resistance:function(dt, obj) {
        var speed_x2 = Math.pow(obj.speed.x, 2);
        var speed_y2 = Math.pow(obj.speed.y, 2);
        
        var density = 0.5;
        
        var resistance_y = 0.05*speed_y2*density*dt;
        var resistance_x = Math.min(0.50*speed_x2*density, 100)*dt;
        
        obj.speed.y = (obj.speed.y > 0) ? (obj.speed.y - resistance_y) : (obj.speed.y + resistance_y);
        obj.speed.x = (obj.speed.x > 0) ? (obj.speed.x - resistance_x) : (obj.speed.x + resistance_x);
    },
    
    handle_gravity:function(dt, obj, accel) {
        if("speed" in obj){ 
            obj.speed.y = this.absmax(obj.speed.y+((accel.y + this.gravity.y)*dt), 300);
            obj.speed.x = this.absmax(obj.speed.x+((accel.x + this.gravity.x)*dt), 200);
        }
    }
})
