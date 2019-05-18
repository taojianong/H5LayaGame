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

        Laya.init(1136, 640, Laya.WebGL);
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