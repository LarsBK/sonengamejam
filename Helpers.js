var static_collide_func = function(other) {
    if((other.getPosition().y - other._rect.size.height/2) > this.getPosition().y + this._rect.size.height/2
        || (other.getPosition().y + other._rect.size.height/2) < this.getPosition().y - this._rect.size.height/2 ){
        
        //if("speed" in this)
        //{
            //other.speed.y += this.speed.y;
            //other.speed.x += this.speed.x;
        //}
        //else
            other.speed.y = 0;
        return true;
    }
        
    if((other.getPosition().x + other._rect.size.width/2) > this.getPosition().x - this._rect.size.width/2 
        || (other.getPosition().x - other._rect.size.width/2) < this.getPosition().x + this._rect.size.width/2 ){
        other.speed.x = ("speed" in this) ? this.speed.x : 0;
        return true;
    }
    
    return false;
};

var replaceNode = function(from, to){
    to.setPosition(from.getPosition());
    to.setScaleX( from._rect.width / to.getContentSize().width);
    to.setScaleY( from._rect.height / to.getContentSize().height);
    var p = from.getParent();
    p.removeChild(from)
    p.addChild(to, from.getZOrder())
};

var createLayout = function(start, end, rest){
    var rooms = [];
    var first = new MapClass(start)
    rooms.push(first);
    first.location = {x:0, y:0};
    var newFloor = false;
    var floor = 0;
    var added = false;
    //TODO check end added
     
    while(true){
        if(floor > 10 || rest.length == 0){
            rest.push(end);
        }
        for(var i = 0; i < rooms.length; i++){
            var rom = rooms[i];
            console.log("Adding to room " + i)
            if("west" in rom.exits && (! ("map" in rom.exits))){
                var nmap = rest[Math.floor(Math.random()*rest.length)];
                var omap = new MapClass(nmap);
                if("east" in omap.exits){
                omap.location = {x:rom.location.x-1, y:floor};
                omap.addChild(cc.LayerColor.create( new cc.c4b(25*floor, 25*floor, 25*omap.location.x, 255)), -2)
                rom.exits["west"].map = omap;
                rooms.push(omap);
                added = true;
                }
            }
            if("east" in rom.exits && (! ("map" in rom.exits))){
                var nmap = rest[Math.floor(Math.random()*rest.length)];
                var omap = new MapClass(nmap);
                if("west" in omap.exits){
                omap.location = {x:rom.location.x+1, y:floor};
                rom.exits["east"].map = omap;
                rooms.push(omap);
                added = true;
                }
            }
            if("down" in rom.exits && (! ("map" in rom.exits))){
                var nmap = rest[Math.floor(Math.random()*rest.length)];
                var omap = new MapClass(nmap);
                if("up" in omap.exits){
                omap.location = {x:rom.location.x, y:floor-1};
                rom.exits["down"].map = omap;
                rooms.push(omap);
                added = true;
                }
            }
            if(rom.location.y < floor || newFloor == true){
                if("up" in rom.exits && (! ("map" in rom.exits))){
                    var nmap = rest[Math.floor(Math.random()*rest.length)];
                    var omap = new MapClass(nmap);
                if("down" in omap.exits){
                    omap.location = {x:rom.location.x, y:floor+1};
                    rom.exits["up"].map = omap;
                    rooms.push(omap);
                    added = true;
                }
                }    
            }
            

        }
        if(newFloor == true && added == false){
            break;
        }
        newFloor = true;
        floor++;

    }
    return rooms;
    
}