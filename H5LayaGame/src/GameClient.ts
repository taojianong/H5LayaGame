import FairyUIManager from "./fairui/manager/FairyUIManager";
import PanelRegister from "./fairui/PanelRegister";
import EButton from "./fairui/view/component/EButton";
import LoadSourceManager, { LoaderManager } from "./com/load/LoadSourceManager";
import UrlUtils from "./com/load/utils/UrlUtils";

/**
 * 游戏主客户端
 * @author clong 2019.5.18
 */
export default class GameClient extends Laya.Sprite {
    
    constructor() {

        super(); 

        this.init();
    }

    public init():void{

        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);

        // Laya.loader.load([
		// 	{ url: "res/fairui/common_atlas0.png", type: Laya.Loader.IMAGE },
		// 	{ url: "res/fairui/common.map", type: Laya.Loader.BUFFER }
        //     ], Laya.Handler.create(this, this.onLoaded));
        let urls:Array<string> = UrlUtils.getFairyGroup( "common" );
        LoadSourceManager.loadGroup( "common" , urls , Laya.Handler.create( this , this.onLoaded ) );
    }

    private onLoaded():void{

		// fairygui.UIPackage.addPackage("res/fairui/common");		
        // fairygui.UIConfig.defaultFont = "Microsoft YaHei";
        // fairygui.UIConfig.verticalScrollBar = "ui://Basic/ScrollBar_VT";
        // fairygui.UIConfig.horizontalScrollBar = "ui://Basic/ScrollBar_HZ";
        // fairygui.UIConfig.popupMenu = "ui://Basic/PopupMenu";

        
        PanelRegister.registerClass("common", "EButton", EButton );
        
        FairyUIManager.init( Laya.stage );
	}
}