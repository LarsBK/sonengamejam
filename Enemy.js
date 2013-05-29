var Turret = cc.Sprite.extend({
    ctor:function(d){
        this._super();
        this.initWithFile("Zombie.png");
        this.setPosition(d.x,d.y);
        if(d.direction == "west"){
            this.scaleX(-1);
        }
        this.schedule(this.fire, d.interval);
    },
    fire:function(){
        var b = new Missile(0*this.getScaleX());
        b.setPosition(0,this.getContentSize().height+200);
        this.addChild(b);
        this.getParent().getParent().getParent().dynamic_body_list.push(b);
    }
});

var Missile = cc.Sprite.extend({
   ctor:function(spd){
        this._super();
        this.initWithFile("ccbResources/Missile.png")
       if(spd < 0){
           this.setScaleX(-1)
       }
       this.speed = {x:spd, y:0};
       this.accel = {x:0, y:0};
       //this.scene = this.getParent().getParent().getParent().getParent();
       this.onColide = killOnColide;
   }

});

var Slime = cc.Sprite.extend({
    ctor:function(d){
        this._super();
        this.initWithFile("ccbResources/StorStein.png");
        this.update = Platform.update;
        this.scheduleUpdate();
        //this.scene = this.getParent().getParent().getParent();
       this.onColide = killOnColide;
    }
})

var killOnColide = function(other){
  if(other == this.scene.player){
        this.scene.trigger( {action:"die"});
        var f = new cc.BuilderReader.load("eksplosjon.ccbi");
        f.animationManager.runAnimationsForSequenceNamed("Default Timeline")
        replaceNode(this, f)
        this.getParent().removeChild(this);
  }  
};