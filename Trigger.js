var Trigger = cc.Node.extend({
   ctor:function(e) {
       this.t =e
       this._rect = new cc.Rect(0,0,10,20)//todo fix
   },
   onColide:function(other){
       this.getParent().trigger(this.t);
   }
});
