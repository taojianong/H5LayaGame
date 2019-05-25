/**
 * 日志数据
 * @author clong 2019.5.25
 */
export default class LogVo {

    public key:any;
    /**日志类型 */
    public type:string;
    /**日志描述 */
    public text:string;
    /**thisObject 对象 */
    public thisObject:any;
    /**日志等级 */
    public level:number = 0;

    constructor( key:any , text:string , thisObject:any , type:string = "" , level:number = 0 ) {

        this.key = key;
        this.text = text;
        this.thisObject = thisObject;
        this.type = type;
        this.level = level;
    }

    public toString():string{

        var clsName: any = this.thisObject ? this.thisObject.name : "";

        return "[" + this.type + "]" + "[" + clsName + "]" + this.text + "    " + new Date().toTimeString() + "" ;
    }
}