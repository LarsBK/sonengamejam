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
    var done = [];
    //TODO check end added
    while(true){
        if(floor > 10 || rest.length == 0){
            rest.push(end);
            console.log("time for end map")
        }
        while(rooms.length > 0){
            var rom = rooms.pop();
            done.push(rom);
            console.log(rom);
            
            if("west" in rom.exits && (rom.exits["west"].map == null)){
                console.log("west")
                
                var orig = Math.floor(Math.random()*rest.length);
                
                for(var nmap = orig; nmap != Math.abs(((orig-1)%rest.length)); nmap++){
                    var omap = new MapClass(rest[nmap]);
                
                    if("east" in omap.exits) {
                        omap.location = {x:rom.location.x-1, y:floor};
                        omap.addChild(cc.LayerColor.create( new cc.c4b(25*floor, 25*floor, 25*omap.location.x, 255)), -2)
                        connectRooms(rom, "west", omap, "east")
                        rooms.push(omap);
                        added = true;
                    }                 
                }
                if(nmap == Math.abs(((orig-1)%rest.length)))
                        throw new LULZESCEPTION();
            }
            
            if("east" in rom.exits && (rom.exits["east"].map == null)){
                console.log("east")
                
                var orig = Math.floor(Math.random()*rest.length);
                
                for(var nmap = orig; nmap != Math.abs(((orig-1)%rest.length)); nmap++) {
                    var omap = new MapClass(rest[nmap]);
                    
                    if("west" in omap.exits){
                        omap.location = {x:rom.location.x+1, y:floor};
                        connectRooms(rom, "east", omap, "west")
                        rooms.push(omap);
                        added = true;
                    }
                }
                if(nmap == Math.abs(((orig-1)%rest.length)))
                        throw new LULZESCEPTION();
            }
            if("down" in rom.exits && (rom.exits["down"].map == null)){
                console.log("down")
                
                var orig = Math.floor(Math.random()*rest.length);
                
                for(var nmap = orig; nmap != Math.abs(((orig-1)%rest.length)); nmap++) {
                    var omap = new MapClass(rest[nmap]);
                
                    if("up" in omap.exits){
                        omap.location = {x:rom.location.x, y:floor-1};
                        connectRooms(rom, "down", omap, "up")
                        rooms.push(omap);
                        added = true;
                    }
                }
                
                if(nmap == Math.abs(((orig-1)%rest.length)))
                        throw new LULZESCEPTION();
            }
            
            if(rom.location.y < floor || newFloor == true){
                if("up" in rom.exits && (rom.exits["up"].map == null)){
                    console.log("up")
                    var orig = Math.floor(Math.random()*rest.length);
                
                    for(var nmap = orig; nmap != Math.abs(((orig-1)%rest.length)); nmap++) {
                        var omap = new MapClass(rest[nmap]);
                        if("down" in omap.exits){
                            console.log("down")
                            omap.location = {x:rom.location.x, y:floor+1};
                        connectRooms(rom, "up", omap, "down")
                            rooms.push(omap);
                            added = true;
                        }
                    }
                    
                    if(nmap == Math.abs(((orig-1)%rest.length)))
                        throw new LULZESCEPTION();
                }
            }
            

        }
        if(newFloor == true && added == false){
            break;
        }
        newFloor = true;
        added = false;
        floor++;

    }
    return done;
    
}

var connectRooms = function(room1, dir1, room2, dir2){
    room1.exits[dir1].map = room2;
    room1.exits[dir1].to = room2.exits[dir2];
    room2.exits[dir2].map = room1
    room2.exits[dir2].to = room1.exits[dir1];
}