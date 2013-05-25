var Trigger = cc.Node.extend({
   ctor:function(bounds, action, parent) {
       this.parent = parent;
       this.action = action;
       this._rect = bounds.size;
   },
   onColide:function(other){
       this.parent.trigger(action);
   }
});