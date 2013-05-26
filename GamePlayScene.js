var CCBGamePlayScene = cc.Scene.extend({
    static_body_list: [],
    dynamic_body_list: [],
    
    ctor:function() {
        this._super();

        

        var maplist = [];//"map03.tmx", "map04.tmx"];
        
        for(var i = 1; i < 16; i++){
            maplist.push("lvl" + i + ".tmx")
        }
        
        this.rooms = createLayout("map02.tmx", "map01.tmx", maplist); //maplist);
        //this.loadMap("LevelOne.tmx");
        //this.loadMap("level2.tmx")
        this.currentmap = null;
        
        
        this.changeMap(this.rooms[0])
        
        //var plat = new Platform("ccbResources/metalplatform.png", {x: 0, y: 20}, {x: 0, y: 300});
        //this.static_body_list.push(plat);
        //this.currentmap.addChild(plat);
        
        //this.gpLayer.addChild( cc.BuilderReader.load("Alarmlys.ccbi"))
        

        
        this.scheduleUpdate();
        

        //this.static_body_list.push(this.lava)
        
    },
    
    addPlayer:function(){
        var p = new Player();
        p.setPosition(60,80);
        this.player = p;
    },
    
    changeMap:function(map){
        if("gpLayer" in this) this.gpLayer.removeAllChildren();
        this.removeAllChildren();
        
        //HUD
        var node = cc.BuilderReader.load("gameplayscene.ccbi");
        this.addChild(node, 1, "hud");
        node.setKeyboardEnabled(true);
        node.onKeyDown = function(key) {this.getParent().onKeyDown(key);};
        node.onKeyUp = function(key) { this.getParent().onKeyUp(key);};
        
        //Gameplay layer
        this.gpLayer = cc.Layer.create();
        
        console.log("IMPORTANT:")
        console.log(this.gpLayer)
        
        this.addChild(this.gpLayer, 0, "gp")
        if(this.currentmap == null){
            this.addPlayer();
            //this.gpLayer.addChild(this.player, -10);
        }
        
        
        this.gpLayer.addChild(this.player, -10, "Playa") 

        console.log("changing to map " + map)
        this.currentmap = map;
        this.static_body_list = map.static_bodies;
        this.dynamic_body_list = [];
        this.dynamic_body_list.push(this.player);
        
        //Map
        this.gpLayer.addChild(map, 0, "map")
        
        //Follow
        var follow = cc.Follow.create(this.player, new cc.Rect(0,0, this.currentmap._contentSize.width, this.currentmap._contentSize.height))
        this.gpLayer.runAction(follow)
        this.roomLabel = "Floor: " + map.location.y + " Room: " + map.location.x;
        this.setPosition(cc.p(0,0));  
        
    },
    
    teleportTo:function(from, dir){
        console.log("teleport")
        var m = this.currentmap.exits[dir];
        var y = from.getPosition().y - m.to.trigger.getPosition().y;
        //this.lava.setPosition(0, this.lava.getPosition().y + y)
        
        var px = m.to.trigger.getPosition().x;
        var py = m.to.trigger.getPosition().y;
        
        switch(dir)
        {
            case "east":
                px += m.to.trigger.getContentSize().width + 10;
                break;
            case "west":
                px -= m.to.trigger.getContentSize().width + 10;
                break;
            case "north":
                this.player.speed = {x: this.player.speed.x, y: this.player.speed.y + 100 };
                break;
            case "south":
                break;
            default:
                ENOSUCHCASEEXCEPTION;
        }

        console.log("STart")
        console.log(this.player._position)
        this.player.setPosition(px, this.player.getPosition().y);
            //m.to.trigger.getPosition().y);
        //this.player.setPosition(100,100);
        console.log(this.player._position)
        this.changeMap(m.map)
        
        console.log(this.player._position)
        this.player.visit();
        console.log("END")
        
        this.lava = new Lava();
        this.lava.setPosition(0,-100)
        this.gpLayer.addChild(this.lava, 5, "lava")
        this.static_body_list.push(this.lava)
        this.lava.changeWidth(this.currentmap.getContentSize().width)
        this.isTeleporting = false;
    },
    
    trigger:function(t, trigger){
        console.log("trigger! ")
        console.log(t)
        if(t.action=="die"){
            console.log("game over")
            cc.Director.getInstance().popScene()
            
        }
        if(t.action=="teleport"){
            if(this.isTeleporting)
                return;
            this.isTeleporting = true;
            var th = this;
            this.scheduleOnce(function(){th.teleportTo(trigger, t.direction)}, 0);
            return false;
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
                    //console.log(b)
                }
                redo = false;
                
                var nextpos = {x:b.getPosition().x + b.speed.x*dt, y: b.getPosition().y + b.speed.y*dt};

                var nextrect = new cc.Rect( nextpos.x - b._rect.size.width/2,
                    nextpos.y - b._rect.size.height/2, b._rect.size.width, b._rect.size.height);
        
                for(var j = 0; j < this.dynamic_body_list.length; j++){
                    //console.log(this.static_body_list[j])
                    var s = this.dynamic_body_list[j]
                    if(s == b){
                        continue;
                    }
                    var re;
                    if("_rect" in s) {
                        re = new cc.Rect(s.getPosition().x ,s.getPosition().y,
                        s._rect.width, s._rect.height);
                    } else {
                        re = new cc.Rect(s.getPosition().x, s.getPosition().y,
                        s.getContentSize().width, s.getContentSize().height);
                    }
                    //console.log(re)
                    if(cc.rectIntersectsRect(nextrect, re)){
                        if("onColide" in b){
                            redo = redo || b.onColide(s);
                        }
                       if("onColide" in s){
                            redo = redo || s.onColide(b);
                        }
                    }
                }
        
                for(var j = 0; j < this.static_body_list.length; j++){
                    //console.log(s)
                    var s = this.static_body_list[j]
                    var re;
                    if("_rect" in s) {
                        re = new cc.Rect(s.getPosition().x ,s.getPosition().y,
                        s._rect.width, s._rect.height);
                    } else {
                        re = new cc.Rect(s.getPosition().x, s.getPosition().y,
                        s.getContentSize().width, s.getContentSize().height);
                    }
                    //console.log(re)
                    if(cc.rectIntersectsRect(nextrect, re)){
                        if("onColide" in b){
                            redo = redo || b.onColide(s);
                        }
                       if("onColide" in s){
                            redo = redo || s.onColide(b);
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
