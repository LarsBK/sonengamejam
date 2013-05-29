var TitleScreen = cc.Scene.extend({
    ctor:function(){
        this._super();
        var spr = new cc.Sprite();
        spr.initWithFile("Title.png");
        spr.setPosition(720/2, 240)
        spr.setScale(0.37)
        this.addChild(spr);
        var l = cc.Layer.create();
        l.setKeyboardEnabled(true);
        this.addChild(l);
        //var trans = cc.TransitionSlideInL.create(2, new CCBGamePlayScene());
        l.onKeyDown = function(key) {
            //l.setKeyboardEnabled(false);
            cc.Director.getInstance().pushScene(new CCBGamePlayScene());
            //cc.Director.getInstance().replaceScene(trans)
        };
        console.log("Titlescreen done")
    }
});