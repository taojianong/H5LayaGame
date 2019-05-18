/**
 * 加载工具
 * @author clong 2019.5.18
 */
export default class LoadUtils{
    
    /**
     * 获得文件后缀名
     * @param url 文件路径
     * @return <b>String</b> 文件后缀名
     */
    public static getFileExt(url: string): string {
        //切掉路径后面的参数
        let ext: string = url.indexOf("?") > -1 ? url.substring(0, url.indexOf("?")) : url;
        //截取后缀
        let last: string = ext.substring(ext.lastIndexOf("/"));
        return last.lastIndexOf(".") == -1 ? "" : last.substring(last.lastIndexOf(".") + 1).toLowerCase();
    }
}