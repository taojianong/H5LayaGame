import GameClient from "./GameClient";
import Global from "./Global";
class Main {

	constructor() {

		Global.init();

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		//Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));

		Laya.stage.addChild( new GameClient() );
	}

	// onConfigLoaded(): void {
	// 	//加载IDE指定的场景
	// 	GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
	// }
}
//激活启动类
new Main();
