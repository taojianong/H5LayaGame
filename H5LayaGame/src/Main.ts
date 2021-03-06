import Global from "./Global";
class Main {

	constructor() {

		Laya.init(1136, 640, Laya.WebGL);
		// Laya.init( Global.width , Global.height , Laya.WebGL);
        laya.utils.Stat.show(0, 0);
        //设置适配模式
        Laya.stage.scaleMode = "showall";
        Laya.stage.alignH = "left";
        Laya.stage.alignV = "top";
        //设置横竖屏
        Laya.stage.screenMode = Global.screenMode;// "horizontal";

        //根据IDE设置初始化引擎		
		if (window["Laya3D"]){
            Laya3D.init(Global.width, Global.height);
        }else{
            Laya.init(Global.width, Global.height, Laya["WebGL"]);
        } 
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = Global.scaleMode;
		Laya.stage.screenMode = Global.screenMode;
		//兼容微信不支持加载scene后缀场景
        //Laya.URL.exportSceneToJson = Global.exportSceneToJson;
        
        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (Global.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (Global.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (Global.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		//Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));

		
		Global.init()
	}

	onConfigLoaded(): void {
		//加载IDE指定的场景
		//GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
	}
}
//激活启动类
new Main();
