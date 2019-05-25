import View from "./View";
import EButton from "./component/EButton";
import { FairyUtils } from "../utils/FairyUtils";
import FairyUIManager from "../manager/FairyUIManager";

/**
 * 面板基类
 * @author cl 2018.5.18
 */
export class BasePanel extends View {

    protected view: fairygui.GComponent = null;
    /**背景 */
    protected bg: fairygui.GImage | fairygui.GLoader;
    /**标题栏 */
    // protected titleBar: TitleBar;
    /**关闭按钮:取这个名字的按钮,会根据屏幕大小调整位置 */
    protected btn_close: fairygui.GButton | EButton;
    /**传 false 表示不绑定点击遮罩关闭面板事件 */
    protected openTapMask: boolean;
    /**包名 */
    protected _pkgName: string = "";
    /**类名 */
    protected _resName: string = "";

    /**
     * 面板基类
     * @param pkgName 包名
     * @param resName 对应面板名字
     */
    public constructor(pkgName: string = "", resName: string = "") {

        super();

        if (pkgName && !fairygui.UIPackage.getById(pkgName)) {
            fairygui.UIPackage.addPackage(pkgName);
        }
        this._pkgName = pkgName;
        this._resName = resName;

        this.init();
    }

    protected constructFromXML(xml: any): void {

        super.constructFromXML(xml);

        FairyUtils.setVar(this, this);
    }

    public init(): void {

        this.openTapMask = true;

        if (this._pkgName && this._resName) {
            let obj: any = fairygui.UIPackage.createObject(this._pkgName, this._resName);
            this.view = obj.asCom;
            this.addChild(this.view);
        }

        FairyUtils.setVar(this.view, this);

        this.initUI();

        this.onResize();
    }

    public initUI(): void {

        // if (this.titleBar != null) {
        //     this.btn_close = this.titleBar.btn_close;
        // }
    }

    public addAllListener(): void {

        super.addAllListener();
        if (this.btn_close != null) {
            this.addGameListener(Laya.Event.CLICK, this.closeHandler, this.btn_close);
        }
        this.addGameListener(GameEvent.STGAE_RESIZE, this.onResize, this);
    }

    /**
     * 设置标题皮肤
     * @author pkgName 包名
     * @author resName 资源名
     */
    public setTitleSkin(pkgName: string, resName: string): void {

        // if (this.titleBar != null) {
        //     this.titleBar.setTitleSkin(pkgName, resName);
        // }
    }

    /**
     * 获取界面子元件
     */
    public getViewChild(name: string): any {

        return this.view ? this.view.getChild(name) : null;
    }

    /**
    * 渲染列表条目方法
    * @param index  对应条目索引
    * @param obj    渲染对象
    */
    protected renderListItem(index: number, obj: fairygui.GObject): void {

    }

    /**关闭事件 */
    protected closeHandler(): void {

        this.close();
    }

    /**
     * 关闭面板
     */
    public close(isHideGuide: boolean = true): void {

        // FairyUIManager.closePanel(this, this.canDispose);
    }

    /**
     * 界面是否可释放
     */
    private get canDispose(): boolean {

        return true;
    }

    /**点击Mask层,关闭面板 */
    protected tapMask(e: Laya.Event): void {

        this.close();
    }

    /**
     * 显示
     */
    public show(data: any): void {
        this.visible = true;
        // super.show(data);//这句话一定要放在this.visible = true之后执行,不然面板事件注册不了  
        this.initData(data);
    }

    /**
     * 隐藏
     */
    public hide(): void {
        if (this.visible) {
            this.clear();
        }
        this.visible = false;
    }

    /**
     * 转化为对应的类
     */
    public toClass(): any {
        let clsName: string = typeof this;
        return Laya.ClassUtils.getClass(clsName);
    }

    /**
     * 自适应
     */
    public onResize(): void {

    }

    /**
     * 清理数据
     */
    public clear(): void {

        super.clear();
    }

    /**
     * 释放资源,不允许外部直接调用这个方法
     */
    public dispose(): void {

        super.dispose();

        this.view = null;
        this._data = null;
    }
}