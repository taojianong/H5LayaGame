/**
 * 面板注册 clong 2019.5.18
 */
export default class PanelRegister {


    constructor() {

    }

    /**
     * 
     * @param pkgName 是否已注册资源包
     */
    public static hasRegisterClass( pkgName:string ):boolean{

        return pkgName && !fairygui.UIPackage.getById("res/fairui/"+pkgName);
    }

    /**
     * 注册组件类与fairygui编辑器中类对应
     * @param pkgName 包名
     * @param resName 资源名
     * @param cls	  对应包中类名	,为null则只注册资源包
     */
    public static registerClass(pkgName: string, resName: string = "" , cls: any = null ): void {

        if (pkgName && !fairygui.UIPackage.getById("res/fairui/"+pkgName)) {
            fairygui.UIPackage.addPackage("res/fairui/"+pkgName);
        }
        if( cls ){
            let url: string = fairygui.UIPackage.getItemURL(pkgName, resName);
            fairygui.UIObjectFactory.setPackageItemExtension(url, cls);
        }        
    }

    /**
     * 创建自定义fairygui组件，必须用此方式,与以上方法对应使用,不能直接使用new cls()的方式创建一个绑定fairygui的类！
     * @param pkgName 包名
     * @param resName 资源名
     */
    public static createGObject(pkgName: string, resName: string): any {
        return fairygui.UIPackage.createObjectFromURL(fairygui.UIPackage.getItemURL(pkgName, resName));
    }
}