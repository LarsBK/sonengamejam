var Turret = cc.Sprite.extend({
    ctor:function(d){
        this.initWithFile("")
        this.setPosition(d.x,d.y);
    } 
});