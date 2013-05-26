var Trigger = cc.Node.extend({
   ctor:function(e) {
       this._super();
       this.t =e
       this.setPosition(e.x, e.y)
       this._rect = new cc.Rect(0,0,e.width, e.height);
   },
   onColide:function(other){
      console.log("Trigger colide!")
      if(other == this.getParent().getParent().getParent().player){
          console.log("With player!")
           return this.getParent().getParent().getParent().trigger(this.t, this)
      }
   }
});

var Lava = cc.LayerColor.extend({
   ctor:function(){
       this._super()
       this.init(new cc.c4b(100,0,0,255), 1, 1);
       //this._rect = cc.Rect(0,0,this.getContentSize().x, this.getContentSize().y)
      this.scheduleUpdate()
   },
   onColide:function(other){
      if(other == this.getParent().player){
         this.getParent().getParent().trigger({action:"die"})
      }
      
      //if(other.getPosition().y-other.getContentSize().height/2 < this.getPosition().y){
        //  //other.getParent().removeChild(other);
      //} else
      if (! ("REPLACEMENT" in other) ){
          var f = new cc.BuilderReader.load("Flamme.ccbi");
           f.animationManager.runAnimationsForSequenceNamed("Default Timeline")
          f.REPLACEMENT = true;
        replaceNode(other, f)
        this.getParent().getParent().static_body_list.push(f)
      }
    this.getParent().getParent().removeBody(other);
   },
   update:function(dt){
       //this._rect = cc.Rect(0,0,this.getContentSize().x, this.getContentSize().y)
      this.changeHeight(this._contentSize.height + 10*dt)
   }
});
