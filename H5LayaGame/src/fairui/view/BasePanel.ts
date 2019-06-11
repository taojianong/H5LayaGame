import View from "./View";
import EButton from "./component/EButton";
import { FairyUtils } from "../utils/FairyUtils";
import FairyUIManager from "../manager/FairyUIManager";
import PanelVo from "../vo/PanelVo";
import LoadSourceManager from "../../com/load/LoadSourceManager";
import UrlUtils from "../../com/load/utils/UrlUtils";
import PanelRegister from "../PanelRegister";
import { EGList } from "./component/EGList";
import { GameEvent } from "../../com/events/GameEvent";
import { CommonUtils } from "../../com/utils/CommonUtils";

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
    /**是否正在加载 */
    protected isLoad:boolean = false;
    
    /**面板数据 */
    protected _panelVo:PanelVo = null;

    /**
     * 面板基类
     * @param pkgName 包名
     * @param resName 对应面板名字
     */
    public constructor(pkgName: string = "", resName: string = "") {

        super();

        this._panelVo = new PanelVo();
        this._panelVo.pkgName = pkgName;
        this._panelVo.resName = resName;
        this._panelVo.clsName = CommonUtils.getQualifiedClassName( this );// typeof this;
        // this.load();
    }

    protected constructFromXML(xml: any): void {

        super.constructFromXML(xml);

        //FairyUtils.setVar(this, this);
    }

    /**
     * 加载资源
     */
    public load( data:any ):void{

        if( this.view == null && !this.isLoad ){

            this.isLoad = true;
            let urls:Array<string> = UrlUtils.getFairyGroup( this._panelVo.pkgName );
            LoadSourceManager.loadGroup( this._panelVo.pkgName , urls , Laya.Handler.create( this , this.init , [data] , true  ) );
        }else{
            this.init( data );
        }
    }

    /**面板数据 */
    public get panelVo():PanelVo{

        return this._panelVo;
    }

    public initComplete(): boolean {

		//检测初始化是否完成
		if (!this.isInited()) {
			return false;
		}

		if (!this.isOpened) {
			this.isOpened = true;
			this.initUI();
		}

		// this.initData(this.param);
		// this.addAllListener();

		this.isComplyed = true;
		return true;
	}

    public init( data:any ): void {

        super.init( data );

        this.isLoad = false;

        // if( this.view == null ){

        //     this.initUI();
        // }
        
        this.initData(this.param);

        // this.onResize();
    }

    public initUI(): void {

        // if (this.titleBar != null) {
        //     this.btn_close = this.titleBar.btn_close;
        // }
        PanelRegister.registerClass( this._panelVo.pkgName );

        let obj: any = fairygui.UIPackage.createObject( this._panelVo.pkgName, this._panelVo.resName );
        this.view = obj.asCom;
        this.addChild(this.view);

        FairyUtils.setVar(this.view, this);

        let disObj: fairygui.GObject;
        for (let i: number = 0; i < this.view.numChildren; i++) { //objects
            disObj = this.view.getChildAt(i);
            if (disObj.name == "icon" || disObj.name == "title") {
                continue;
            }
            if (disObj.name && disObj.name.indexOf("tab_") == 0 && disObj instanceof fairygui.GGroup) {
                // this[disObj.name] = new fairui.ETab(disObj, this);
                // this.addComponent(this[disObj.name]);
            } else if (disObj.name && disObj.name.indexOf("eglist_") == 0 && disObj instanceof fairygui.GList) {
                this[disObj.name] = new EGList(disObj, this);
                this.addComponent(this[disObj.name]);
            }
        }
    }

    public initData( data:any ):void{

        this.show( data );
    }

    public addAllListener(): void {

        super.addAllListener();
        if (this.btn_close != null) {
            this.addGameListener(Laya.Event.CLICK, this.closeHandler, this , this.btn_close);
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

        FairyUIManager.close( this );
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

        this._data = data;
        if( this.view == null ){
            return;
        }
        this.visible = true; 

        this.addAllListener();

        this.onResize();
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
        if( this._panelVo != null ){
            this._panelVo.dispose();
        }
        this._panelVo = null;
    }
}