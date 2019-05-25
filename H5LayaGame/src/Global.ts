import GameClient from "./GameClient";
import LoadSourceManager from "./com/load/LoadSourceManager";
import EventManager from "./com/manager/EventManager";
import Log from "./com/log/Log";

/**
 * 全局参数
 * @author clong 2019.5.18
 */
export default class Global {

    public static width:number=640;
    public static height:number=1136;
    public static scaleMode:string="fixedwidth";
    public static screenMode:string="none";//horizontal
    public static alignV:string="top";
    public static alignH:string="left";

    public static debug:boolean=false;
    public static stat:boolean=false;
    public static physicsDebug:boolean=false;
    public static exportSceneToJson:boolean=true;
    
    constructor() { 

    }

    /**
     * 全局初始化
     */
    public static init():void{

        Log.init();
        EventManager.init();
        LoadSourceManager.init();
        Laya.stage.addChild( new GameClient() );
    }

    /**
	 * 判断对象是否为对应类或接口
	 */
	public static is( target:any , cls:any ):boolean{

        if( !target ){
            return false;
        }
		return Laya["__typeof"]( target , cls );
	}
}