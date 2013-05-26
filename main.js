// Needed for HTML5
var cocos2dApp = cc.Application.extend({
    config:document['ccConfig'],
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup(this.config['tag'])
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();  
       // cc.Loader.getInstance().onload = function () {
    //        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
      //  };
        //cc.Loader.getInstance().preload(ccb_resources)

    },
    applicationDidFinishLaunching:function () {
        // initialize director
        var director = cc.Director.getInstance();

        // enable High Resource Mode(2x, such as iphone4) and maintains low resource on other devices.
//     director->enableRetinaDisplay(true);

        // turn on display FPS
        director.setDisplayStats(this.config['showFPS']);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / this.config['frameRate']);

        cc.Loader.preload(ccb_resources, function () {
            cc.Director.getInstance().runWithScene(new this.startScene());
        }, this);        //load resources

        return true;
    }
});
var myApp = new cocos2dApp(CCBGamePlayScene);
