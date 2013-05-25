var Platform = cc.Sprite.extend({
    ctor:function(filename, startpos, endpos)
    {
        this._super();
        this.initWithFile(filename);
        
        this.startpos = startpos;
        this.endpos = endpos;
        this.position = { x: startpos.x, y: startpos.y };
        this.setPosition(this.position);
        this.scheduleUpdate();
    },
    
    time: 0,
    
    update:function(dt)
    {
        this.time += dt;
        var sin = Math.sin(this.time)/2+0.5;
        
        this.position.x = (this.endpos.x-this.startpos.x)*sin+this.startpos.x;
        this.position.y = (this.endpos.y-this.startpos.y)*sin+this.startpos.y;
        
        this.setPosition(this.position)
    },
    
    onColide:function()
    {
        
        
    }
    
});