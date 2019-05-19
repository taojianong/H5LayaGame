import GameClient from "./GameClient";
import PanelRegister from "./fairui/PanelRegister";
// import BaseSprite from "./fairui/view/component/BaseSprite";
// import Global from "./Global";
class Main {

	constructor() {

		// Laya.init(1136, 640, Laya.WebGL);
        // laya.utils.Stat.show(0, 0);
        // //设置适配模式
        // Laya.stage.scaleMode = "showall";
        // Laya.stage.alignH = "left";
        // Laya.stage.alignV = "top";
        // //设置横竖屏
        // Laya.stage.screenMode = "horizontal";//Global.screenMode;//

        //根据IDE设置初始化引擎		
		if (window["Laya3D"]){
            Laya3D.init(1136, 640);
        }else{
            Laya.init(1136, 640, Laya["WebGL"]);
        } 
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = "showall";//Global.scaleMode;
		Laya.stage.screenMode = "horizontal";//Global.screenMode;
		//兼容微信不支持加载scene后缀场景
		//Laya.URL.exportSceneToJson = Global.exportSceneToJson;
		
		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		//Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));

		Laya.loader.load([
		{ url: "res/fairui/common_atlas0.png", type: Laya.Loader.IMAGE },
		{ url: "res/fairui/common.map", type: Laya.Loader.BUFFER }
		], Laya.Handler.create(this, this.onLoaded));

		// let gameClient:GameClient = new GameClient();
		// gameClient.init();
		// Laya.stage.addChild( gameClient );
	}

	onLoaded():void{

		Laya.stage.addChild(fairygui.GRoot.inst.displayObject);

		// let container:BaseSprite = new BaseSprite();//这里换成BaseSprite就会出问题！
		let container:fairygui.GComponent = new fairygui.GComponent();
		fairygui.GRoot.inst.addChild( container );

		fairygui.UIConfig.packageFileExtension = "map";
		fairygui.UIPackage.addPackage( "res/fairui/common" );
		
		// PanelRegister.registerClass( "common" , "BaseSprite" , BaseSprite );

		let obj: fairygui.GObject = fairygui.UIPackage.createObject( "common" , "UIGMView" );
		let comp:any = obj.asCom;
		container.addChild( comp );


		// FairyUIManager.init( Laya.stage );

		// Laya.stage.addChild( new GameClient() );
	}

	// onConfigLoaded(): void {
	// 	//加载IDE指定的场景
	// 	GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
	// }
}
//激活启动类
new Main();
