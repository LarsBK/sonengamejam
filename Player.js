var Player = cc.Sprite.extend({
    ctor:function() {
           this._super();
           //this.initWithFile("ccbResources/PlaceChar.png")
           this.spr = cc.BuilderReader.load("Player.ccbi")
           this.addChild(this.spr)
           this.spr.setPosition(0,-32)
           console.log(this)
           console.log(this.spr)
           this._rect = this.spr._rect;
           this.spr.animationManager.runAnimationsForSequenceNamed("stand")
           //this.spr.animationManager.runAnimations();
           this.speed = {x:0, y:0};
           this.accel = {x:0, y:0};
           this.jumpTime = 0;
           this.brake = true;
           console.log(this.speed)
           
    },
    onKeyDown : function(key){
        switch(key) {
            case cc.KEY.d:
                this.accel.x = 600;
                this.brake = false;
                this.spr.setScaleX(1)
                this.spr.animationManager.runAnimationsForSequenceNamed("gaa")
                break;
            case cc.KEY.a:
                this.spr.setScaleX(-1)
                this.spr.animationManager.runAnimationsForSequenceNamed("gaa")
                this.accel.x = -600;
                this.brake = false;
                break;
            case cc.KEY.s:
                this.spr.animationManager.runAnimationsForSequenceNamed("dukk")
                break;
            case cc.KEY.space:
                this.spr.animationManager.runAnimationsForSequenceNamed("jump")
                this.jump = true;
                break;
                
        }
    },
    
    onKeyUp : function(key) {
        switch(key) {
            case cc.KEY.space:
                this.jump = false;
                this.jumpTime = 0;
           this.spr.animationManager.runAnimationsForSequenceNamed("stand")
                break;
            case cc.KEY.d:
                this.accel.x = 0;
           this.spr.animationManager.runAnimationsForSequenceNamed("stand")
                this.brake = true;
                break;
            case cc.KEY.a:
                this.accel.x = 0;
           this.spr.animationManager.runAnimationsForSequenceNamed("stand")
                this.brake = true;
                break;
            case cc.KEY.s:
                this.spr.animationManager.runAnimationsForSequenceNamed("stand")
                break;
        }
    },
    
    update:function(dt){
            if(this.jumpTime > 0){
                this.speed.y = 400;
                this.jumpTime -= dt;
            }
    },
    
    onColide : function(other){
        if(this.brake){
            if(Math.abs(this.speed.x) < 10){
                this.speed.x = 0;
            }
            if("speed" in other){
                this.speed.x = other.speed.x;
                this.speed.y = other.speed.y;
            }else{
                this.accel.x = -2*this.speed.x;
            }
        
        }
        if(this.jump){
            //this.speed.y = 2200;
            this.jumpTime = 0.5;
            this.jump = false;
            return true;
        }
        return false;
    }
})