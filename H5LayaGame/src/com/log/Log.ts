import LogVo from "./LogVo";

/**
 * 日志系统 
 * @author clong 2019.5.25
 */
export default class Log {

    private static logMap: Laya.WeakObject = null;
    private static keyIndex:number = 0;

    /**普通调试日志 */
    public static readonly TYPE_DEBUG:string = "debug";
    /**加载相关日志 */
    public static readonly TYPE_LOAD:string = "load";

    /**不需要显示日志类型的列表 */
    public static noshowLogTypeList:Array<string> = null;

    public static init():void{

        this.logMap = new Laya.WeakObject();
        this.noshowLogTypeList = [];
    }

    /**
     * 显示日志
     * @param thisObject 
     * @param text 日志文本
     * @param type 日志类型
     * @param level 日志等级
     */
    public static log( thisObject:any , text:string , type:string="" , level:number =0 ):void{

        if( type == ""){
            type = Log.TYPE_DEBUG;
        }
        if( type && this.noshowLogTypeList.indexOf(type) != -1 ){
            return;
        }
        let logVo:LogVo = new LogVo( Log.keyIndex , text , thisObject , type , level );        
        console.log( logVo.toString() );
        this.logMap.set( logVo.key , logVo );
        Log.keyIndex++;
    }

    /**
     * 显示错误日志
     * @param thisObject 
     * @param args 
     */
    public static error( thisObject:any , text:string , type:string="" , level:number =0 ):void{

        if( type == ""){
            type = Log.TYPE_DEBUG;
        }
        if( type && this.noshowLogTypeList.indexOf(type) != -1 ){
            return;
        }
        let logVo:LogVo = new LogVo( Log.keyIndex , text , thisObject , type , level );        
        console.error( logVo.toString() );
        this.logMap.set( logVo.key , logVo );
        Log.keyIndex++;
    }
}