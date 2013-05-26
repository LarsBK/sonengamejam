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
        this.onColide = static_collide_func;
        console.log(this)
    },
    
    ________type: "PLATFORM!",
    time: 0,
    speed: {x: 0, y: 0},
    
    update:function(dt)
    {
        this.time += dt;
        var sin = Math.sin(this.time)/2+0.5;
        
        var newpos = { x: 0, y: 0};
        
        newpos.x = (this.endpos.x-this.startpos.x)*sin+this.startpos.x;
        newpos.y = (this.endpos.y-this.startpos.y)*sin+this.startpos.y;
        
        this.speed = { x: (newpos.x-this.position.x)/dt, y: (newpos.y-this.position.y)/dt};
        
        this.position = newpos;
        
        this.setPosition(this.position)
    },
});