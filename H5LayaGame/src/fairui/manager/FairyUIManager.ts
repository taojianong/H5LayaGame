import PanelRegister from "../PanelRegister";
import EButton from "../view/component/EButton";
import BaseSprite from "../view/component/BaseSprite";
import Log from "../../com/log/Log";
import { BasePanel } from "../view/BasePanel";

/**
 * Fairygui管理
 * @author clong 2019.5.18
 */
export default class FairyUIManager {

    /**装载 */
    private static parent: Laya.Sprite = null;

    /**主界面层 */
    public static mainLayer: BaseSprite;
    /**界面层 */
    public static windowLayer: BaseSprite;
    /** */
    public static promptLayer: BaseSprite;
    /**弹框层 */
    public static alertLayer: BaseSprite;
    /**顶层 */
    public static topLayer: BaseSprite;
    /**tip层 */
    public static tipLayer: BaseSprite = null;
    /**引导层 */
    public static guideLayer: BaseSprite = null;

    constructor() {

    }

    public static init( container:Laya.Sprite ): void {

        if( !this.parent ){				
            FairyUIManager.mainLayer = new BaseSprite();
            FairyUIManager.windowLayer = new BaseSprite();
            FairyUIManager.promptLayer = new BaseSprite();
            FairyUIManager.topLayer = new BaseSprite();
            FairyUIManager.alertLayer = new BaseSprite();
            FairyUIManager.tipLayer = new BaseSprite();
            FairyUIManager.guideLayer = new BaseSprite();
        }else{
            this.parent.removeChild( fairygui.GRoot.inst.displayObject );
        }
        container.addChild(fairygui.GRoot.inst.displayObject);
        this.parent = container;
        
        fairygui.GRoot.inst.addChild(FairyUIManager.mainLayer);
        fairygui.GRoot.inst.addChild(FairyUIManager.windowLayer);
        fairygui.GRoot.inst.addChild(FairyUIManager.promptLayer);
        fairygui.GRoot.inst.addChild(FairyUIManager.alertLayer);
        fairygui.GRoot.inst.addChild(FairyUIManager.topLayer);			
        fairygui.GRoot.inst.addChild(FairyUIManager.tipLayer);
        fairygui.GRoot.inst.addChild(FairyUIManager.guideLayer);
    }

    /**
     * 打开面板
     * @param cls 面板类
     */
    public static open( cls:any ):void{

        if( cls != null ){
            try{
                let view:any = new cls();
                if( view instanceof BasePanel ){
                    view.load();      
                    if( view.panelVo.isNormal ){
                        this.windowLayer.addChild( view );
                    }              
                }
            }catch(e){
                Log.error( this , "实列面板失败！");
            }
        }
    }

    private static instance: FairyUIManager;
    public static getInstance(): FairyUIManager {
        return this.instance = this.instance || new FairyUIManager();
    }
}