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