var Player = cc.Sprite.extend({
    ctor:function() {
           this._super();
           this.initWithFile("PlaceChar.png")
           this.speed = {x:0, y:0};
           this.accel = {x:0, y:0};
           this.brake = true;
           console.log(this.speed)
           
    },
    onKeyDown : function(key){
        switch(key) {
            case cc.KEY.d:
                this.accel.x = 600;
                this.brake = false;
                break;
            case cc.KEY.a:
                this.accel.x = -600;
                this.brake = false;
                break;
            case cc.KEY.space:
                this.jump = true;
                break;
                
        }
    },
    
    onKeyUp : function(key) {
        switch(key) {
            case cc.KEY.space:
                this.jump = false;
                break;
            case cc.KEY.d:
                this.accel.x = 0;
                this.brake = true;
                break;
            case cc.KEY.a:
                this.accel.x = 0;
                this.brake = true;
                break;
        }
    },
    
    onColide : function(other){
        if(this.brake){
            if(Math.abs(this.speed.x) < 10){
                this.speed.x = 0;
            }            this.accel.x = -2*this.speed.x;
            //this.accel.y = -0.5*this.speed.y;
        
        }
        if(this.jump){
            this.speed.y = 1200;
            this.jump = false;
            return true;
        }
        return false;
    }
})