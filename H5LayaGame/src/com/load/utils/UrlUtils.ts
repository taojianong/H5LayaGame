/**
 * 资源地址管理类
 * @author clong 2019.5.18
 */
export default class UrlUtils {
    

    public static readonly RES:string = "res/";
    /**fairygui发布资源目录 */
    public static readonly FAIRUI:string = UrlUtils.RES + "fairui/";

    /**
     * 获取fairygui资源组
     * @param name 
     */
    public static getFairyGroup( name:string ):Array<string>{

        return [ UrlUtils.FAIRUI + name + "_atlas0.png" , UrlUtils.FAIRUI + name + ".map" ];
    }
}