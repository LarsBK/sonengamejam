var CCBGamePlayScene = cc.Scene.extend({
    static_body_list: [],
    dynamic_body_list: [],
    
    ctor:function() {
        this._super();
        var node = cc.BuilderReader.load("gameplayscene.ccbi");
        this.addChild(node, 1, "hud");
        
        var p = new Player();
        p.setPosition(500,350);
        this.player = p;
        
        //var maplist = ["LevelOne.tmx", "level2.tmx"];
        this.rooms = createLayout("LevelOne.tmx", "level2.tmx", []);
        //this.loadMap("LevelOne.tmx");
        //this.loadMap("level2.tmx")
        
        this.gpLayer = cc.Layer.create();
        this.addChild(this.gpLayer, 0, "gp")
        this.gpLayer.addChild(this.player);
        this.changeMap(this.rooms[0])
        
        //var plat = new Platform("ccbResources/metalplatform.png", {x: 0, y: 20}, {x: 0, y: 300});
        //this.static_body_list.push(plat);
        //this.currentmap.addChild(plat);
        
        //this.gpLayer.addChild( cc.BuilderReader.load("Alarmlys.ccbi"))
        
        node.setKeyboardEnabled(true);
        node.onKeyDown = function(key) {this.getParent().onKeyDown(key);};
        node.onKeyUp = function(key) { this.getParent().onKeyUp(key);};
        
        //this.addChild(cc.LayerColor.create(cc.c4b(180,100,180,255)), -2, "background");
        this.setPosition(cc.p(0,0));  
        this.scheduleUpdate();
        
        this.lava = new Lava();
        this.lava.setPosition(0,-100)
        this.gpLayer.addChild(this.lava, 5, "lava")
        this.lava.changeWidth(this.currentmap.getContentSize().width)
        this.static_body_list.push(this.lava)
        
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
        var follow = cc.Follow.create(this.player, new cc.Rect(0,0, this.currentmap._contentSize.width, this.currentmap._contentSize.height))
        this.gpLayer.runAction(follow)
        this.getChildByTag("hud").roomLabel = "Floor: " + map.location.y + " Room: " + map.location.x;
        
    },
    
    teleportTo:function(from, dir){
        var m = this.currentmap.exits[dir];
        var y = from.getPosition().y - m.to.getPosition().y;
        this.lava.setPosition(0, this.lava.getPosition().y + y)
        
        this.changeMap(m.map)
    },
    
    trigger:function(t, trigger){
        console.log(t)
        if(t.action=="die"){
            console.log("game over")
            cc.Director.getInstance().popScene()
            
        }
        if(t.action=="teleport"){
            this.teleportTo(trigger, t.direction);
        }
    },
    
    onKeyDown : function(key) {
        if(key == cc.KEY.t){
            this.changeMap(this.maplist["level2.tmx"]);
        }
        this.player.onKeyDown(key);
    },
    
    onKeyUp : function(key) {
        this.player.onKeyUp(key);        
    },
    
    removeBody:function(b){
        for(var i = 0; i < this.dynamic_body_list.length; i++){
            if(b == this.dynamic_body_list[i]){
                this.dynamic_body_list.splice(i,1);
                return;
            }
        } 
        for(var i = 0; i < this.static_body_list.length; i++){
            if(b == this.static_body_list[i]){
                this.static_body_list.splice(i,1);
                return;
            }
        }
    },
    
    update:function(dt) {
        for(var i = 0; i < this.dynamic_body_list.length; i++){
            var b = this.dynamic_body_list[i];
            if("update" in b){
                b.update(dt);
            }
            var redo = true;
            var it = 0;
            this.handle_gravity(dt, b, b.accel || {x:0, y:0});
            this.handle_air_resistance(dt, b);
            while(redo &&  it++ < 100){
                if(it > 5){
                    b.speed.y = (it-5)*10;
                    console.log("EJECT!")
                }
                redo = false;
                
                var nextpos = {x:b.getPosition().x + b.speed.x*dt, y: b.getPosition().y + b.speed.y*dt};

                var nextrect = new cc.Rect( nextpos.x - b._rect.size.width/2,
                    nextpos.y - b._rect.size.height/2, b._rect.size.width, b._rect.size.height);
            
                for(var j = 0; j < this.static_body_list.length; j++){
                    //console.log(this.static_body_list[j])
                    var s = this.static_body_list[j]
                    var re;
                    if("_rect" in this.static_body_list[j]) {
                        re = new cc.Rect(this.static_body_list[j].getPosition().x ,this.static_body_list[j].getPosition().y,
                        this.static_body_list[j]._rect.width, this.static_body_list[j]._rect.height);
                    } else {
                        re = new cc.Rect(this.static_body_list[j].getPosition().x, this.static_body_list[j].getPosition().y,
                        this.static_body_list[j].getContentSize().width, this.static_body_list[j].getContentSize().height);
                    }
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
