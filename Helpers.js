var static_collide_func = function(other) {
    if((other.getPosition().y - other._rect.size.height/2) > this.getPosition().y + this.rect.size.height/2
        || (other.getPosition().y + other._rect.size.height/2) < this.getPosition().y - this.rect.size.height/2 ){
        other.speed.y = 0;
        return true;
    }
        
    if((other.getPosition().x + other._rect.size.width/2) > this.getPosition().x - this.rect.size.width/2 
        || (other.getPosition().x - other._rect.size.width/2) < this.getPosition().x + this.rect.size.width/2 ){
        other.speed.x = 0;
        return true;
    }
    
    return false;
};