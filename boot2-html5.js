var CCBMainScene = cc.Scene.extend({
    ctor:function () {
        this._super();

        var node = cc.BuilderReader.load("MainScene.ccbi");

        this.addChild(node);
        this.setPosition(cc.p(0, 0));
    }
});

var CCBGamePlayScene = cc.Scene.extend({
    ctor:function() {
        this._super();
        var node = cc.BuilderReader.load("gameplayscene.ccbi")
        this.addChild(node)
        this.setPosition(cc.p(0,0))
    }
})