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
        b.setPosition(0,this.getContentSize().height+10);
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
       this.onColide = killOnColide;
   },
   onEnter:function(){
       this.scene = this.getParent().getParent().getParent().getParent();
   },
   onColideSpecial:function(other){
        this.removeFromParent();
   }

});

var Slime = cc.Sprite.extend({
    ctor:function(d){
        this._super();
        this.initWithFile("ccbResources/StorStein.png");
        this.update = Platform.update;
        this.scheduleUpdate();
       this.onColide = killOnColide;
    },
   onEnter:function(){
       this.scene = this.getParent().getParent().getParent();
   }
})

var killOnColide = function(other){
  if(other == this.scene.player){
        this.scene.trigger( {action:"die"});
        var f = new cc.BuilderReader.load("eksplosjon.ccbi");
        f.animationManager.runAnimationsForSequenceNamed("Default Timeline")
        replaceNode(other, f);

  }
  if(this.onColideSpecial){
            this.onColideSpecial(other);
        }
 
};