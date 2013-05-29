var changeMap = function(t){
    var gp = cc.Director.getInstance().getRunningScene();
    var m = new MapWrapper(gp.maplist[t]);
    m.load();
    gp.changeMap(m);};

var CCBGamePlayScene = cc.Scene.extend({
    static_body_list: [],
    dynamic_body_list: [],
    maplist:[],
    loadedMaps:[],
    currentmap:null,

    ctor:function() {
        this._super();
        for(var i = 1; i < 16; i++){
            this.maplist.push("lvl" + i + ".tmx")
        }
        this.maplist.push("LevelOne.tmx")
        this.maplist.push("level2.tmx")
        for(var i = 1; i < 5; i++){
            this.maplist.push("map0" + i + ".tmx");
        }
        for(var i = 0; i < this.maplist.length; i++){
            this.loadedMaps.push(new MapClass(this.maplist[i]));
        }
        var m = new MapWrapper(this.loadedMaps);
        m.load();
        this.changeMap(m);
        this.scheduleUpdate();
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
        
        console.log(this.gpLayer)
        
        this.addChild(this.gpLayer, 0, "gp")
        if(this.currentmap == null){
            this.addPlayer();
            //this.gpLayer.addChild(this.player, -10);
        }
        
        this.currentmap = map;
        
        
        this.player.removeFromParent()
        //this.gpLayer.setPosition(this.getContentSize().width,0);

        //Map
        console.log("changing to map " + this.currentmap.map.file)
        this.static_body_list = this.currentmap.static_bodies;
        this.dynamic_body_list = [];
        this.dynamic_body_list.push(this.player);
        this.gpLayer.addChild(this.currentmap, -2, "map")
        this.currentmap.setPosition(0,0);
        console.log("map:")
        console.log(this.currentmap)
        console.log("---")
        this.gpLayer.addChild(this.player, 0, "Playa") 
        
        //Follow
        var follow = cc.Follow.create(this.player, new cc.Rect(0,0, this.currentmap.map._contentSize.width, this.currentmap.map._contentSize.height))
        this.gpLayer.runAction(follow)
        console.log("Floor: " + map.location.y + " Room: " + map.location.x);
        this.setPosition(cc.p(0,0));  
    },
    
    teleportTo:function(from, dir){
        console.log("teleport")
        var m = this.currentmap.exits[dir];
        m.load();
        var odir = oppositeDir(dir);
        var exit = m.map.exits[odir];
        
        var y =  exit.getPosition().y - from.getPosition().y;
        var px = exit.getPosition().x;
        var py = exit.getPosition().y//; - m.to.trigger._rect.height/2;
        
        switch(dir)
        {
            case "east":
                px += exit._rect.width + this.player._rect.width;
                break;
            case "west":
                px -= exit._rect.width + this.player._rect.width;
                break;
            case "up":
                py += exit._rect.height;
                //y -= this.currentmap.map.getContentSize().height;
                this.player.speed.y += 100;
                break;
            case "down":
                //y += this.currentmap.map.getContentSize().height;
                py -= exit._rect.height;
                break;
            default:
                ENOSUCHCASEEXCEPTION;
        }

        console.log(this.player._position)
        this.player.setPosition(px,py);
            //m.to.trigger.getPosition().y);
        //this.player.setPosition(100,100);
        this.changeMap(m)
        
        if(this.lava){
            y += this.lava.getContentSize().height;
        } else {
            y = -100;
        }
        
        this.lava = new Lava();
        this.lava.setPosition(0,0)
        this.lava.changeHeight(y);
        console.log("lava pos: " + y)
        this.gpLayer.addChild(this.lava, 1, "lava")
        this.static_body_list.push(this.lava)
        this.lava.changeWidth(this.currentmap.map.getContentSize().width)
        this.isTeleporting = false;
    },
    
    trigger:function(t, trigger){
        console.log("trigger! ")
        console.log(t)
        if(t.action=="die"){
            console.log("game over")
            this.scheduleOnce(function() {cc.Director.getInstance().popScene()}, 6);
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
