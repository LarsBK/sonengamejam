var Trigger = cc.Node.extend({
   ctor:function(e) {
       this.t =e
       this._rect = new cc.Rect(0,0,10,20)//todo fix
   },
   onColide:function(other){
      
      if(other == this.getParent().player){
       this.getParent().trigger(this.t);
      }
   }
});

var Lava = cc.Layer.extend({
   onColide:function(other){
      if(other == this.getParent().player){
         this.getParent().trigger({action:"die"})
      }
   },
   update:function(dt){
      this.setSizeY( 10*dt)
   }
})
