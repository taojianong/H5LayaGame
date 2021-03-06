import EventPool from "../../../com/events/EventPool";
import { FairyUtils } from "../../utils/FairyUtils";
import { FairyTextureUtils } from "../../utils/FairyTextureUtils";
import Global from "../../../Global";

/**
 * 基于fairygui.GButton的基类按钮
 * @author clong 2019.5.18
 */
export default class BaseButton extends fairygui.GButton implements IComponent,IPool {
    
    /**是否已经释放 */
    public isDispose: boolean = false;

    /**额外数据 */
    protected __data: any = null;

    protected _enabled: boolean = true;
    /**是否初始化 */
    protected isInit: boolean = false;

    protected _currentState: string = "";
    protected _btnController: fairygui.Controller;

    //组件缓存池
    protected m_componentDic: Laya.WeakObject = null;
    //事件缓存池
    protected m_eventPool: EventPool = null;
    
    constructor() { 

        super(); 

        this.m_eventPool = EventPool.create();
        this.m_componentDic = new Laya.WeakObject();
    }

    /**初始创建时的方法，用于继承IPool的类 */
    public create():void{


    }

    protected constructFromXML(xml: any): void {

        super.constructFromXML(xml);

        FairyUtils.setVar(this, this);

        this._btnController = this["_buttonController"];

        this.init(null);
    }

    public IsInited(): boolean {
        return this.isInit;
    }

    public set currentState(value: string) {

        this._currentState = value;

        if (this._btnController) {
            this._btnController.selectedPage = value;
        }
    }
    /**当前状态 */
    public get currentState(): string {

        return this._currentState;
    }

    public show(value: any): void {

        this.__data = value;

        this.addAllListener();
    }

    public hide(): void {

        this.__data = null;

        this.removeAllListener();
    }

    public set enabled(value: boolean) {

        this._enabled = value;
        this.touchable = value;
        if( this._iconObject ){
            this._iconObject.grayed = !value;
        }
    }
    /**
     * 是否可点击,不可点击置灰
     */
    public get enabled(): boolean {

        return this._enabled;
    }

    /**
     * 添加Laya原生元件
     * @param child Laya原生显示对象
     */
    public addLayaChild(child: Laya.Node): void {

        this._container.addChild(child);
    }
    /**添加Laya原生元件
     * @param child Laya原生显示对象
     */
    public addLayaChildAt(child: Laya.Node, index: number): void {
        this._container.addChildAt(child, index);        
    }
    /**
     * 移除Laya原生元件
     */
    public removeLayaChild(child: Laya.Node): void {

        if (child && this._container.contains(child)) {
            this._container.removeChild(child);
        } else if (child && child.parent != null) {
            child.parent.removeChild(child);
        }
    }

    /**
     * 至于顶层
     */
    public toTop(): void {
        if (this.parent != null) {
            if (this.parent.numChildren > 0) {
                this.parent.setChildIndex(this, this.parent.numChildren - 1);
            } else {
                this.parent.setChildIndex(this, 0);
            }
        }
    }

    /**
     * 改变元件深度索引
     * @param index 索引
     */
    public indexTo(index: number): void {

        if (this.parent != null) {
            if (index > (this.parent.numChildren - 1)) {
                index = this.parent.numChildren - 1;
            } else if (index < 0) {
                index = 0;
            }
            this.parent.setChildIndex(this, index);
        }
    }

    /**在父容器中的索引 */
    public getIndex():number{

        return this.parent ? this.parent.getChildIndex( this ) : -1;
    } 

    /**
     * 至于底部 
     */
    public toBottom(): void {

        if (this.parent != null) {
            this.parent.setChildIndex(this, 0);
        }
    }

    /**
     * 获取条目
     * @param name 组件名字
     */
    public getElement(name: string, container: fairygui.GComponent = null): any {

        container = container || this;
        return container.getChild(name);
    }

    /**
     * 是否包含某个对象
     */
    public contains(child: fairygui.GObject): boolean {

        return this.getChildIndex(child) != -1;
    }

    public set touchEnabled(value: boolean) {

        this._container.mouseEnabled = value;
    }

    public get touchEnabled(): boolean {

        return this._container.mouseEnabled;
    }

    public set touchChildren(value: boolean) {

        this._container.mouseThrough = value;
    }

    public get touchChildren(): boolean {

        return this._container.mouseThrough;
    }

    /**
     * 设置FairyGui资源
     * @param pkgName 包名
     * @param resName 资源名
     */
    public setFairySource(pkgName: string, resName: string, disObj: fairygui.GLoader = null): void {

        disObj = disObj || <fairygui.GLoader>this._iconObject;
        let url: string = fairygui.UIPackage.getItemURL(pkgName, resName);
        this.setFairyUrl(url, disObj);
    }

    /**
     * 设置FairyGui资源地址
     * @param url FairyGui资源地址
     */
    public setFairyUrl(url: string, disObj: fairygui.GLoader = null): void {

        if (disObj != null) {
            disObj.url = url;// ? FairyTextureUtils.getTexture(url) : null;
        }
    }

    /**
     * 是否包含全局坐标点
     * @param gx 全局X坐标
     * @param gy 全局Y坐标
     */
    public containsGlobalPoint(gx: number, gy: number): boolean {

        let lp: Laya.Point = this.globalToLocal(gx, gy);
        let bounds: Laya.Rectangle = new Laya.Rectangle(0, 0, this.width, this.height);
        if( this.pivotAsAnchor ){//是否中心点为锚点
            bounds.x = -this.width * 0.5;
            bounds.y = -this.height * 0.5;
        }
        return bounds.contains(lp.x, lp.y);
    }

    /**
     * 像素穿透
     */
    public set pixelHitTest(val: boolean) {
        if( this._iconObject ){
            let loader: fairygui.GLoader = this._iconObject.asLoader;
            if (loader.content instanceof Laya.Bitmap) {
                // loader.content.pixelHitTest = val;
            }
        }            
    }

    //--------------------------------------
    
    //初始化
    public init(param: any): void {
        
        this.initUI();

        this.addAllListener();
    }

    //初始化UI
    public initUI(): void {

    }

    //增加监听事件函数
    public addAllListener():void {

        for( let key in this.m_componentDic ){
            let data:any = this.m_componentDic.get( key );
            if( Global.is( data , "IComponent" )){
                (<IComponent>data).addAllListener();
            }
        }
    }

    //移除监听事件函数
    public removeAllListener():void {

        for( let key in this.m_componentDic ){
            let data:any = this.m_componentDic.get( key );
            if( Global.is( data , "IComponent" )){
                (<IComponent>data).removeAllListener();
            }
        }
    }

    /**
     * 添加事件监听
     */
    public addGameListener(type: string, listener: Function, thisObject: any, target?: any) {
        if( this.m_eventPool != null ){
            this.m_eventPool.addListener( type , listener , target , thisObject );
        }
    }

    /**
     * 移除事件监听
     */
    public removeGameListener(type: string, listener: Function, thisObject: any, target?: any) {
        if( this.m_eventPool != null ){
            this.m_eventPool.removeListener( type , listener , target , thisObject );
        }
    }

    /**
     * 添加组件
     */
    public addComponent(component: IComponent): any {

        if ( component == null || this.m_componentDic.hasOwnProperty( "" + component.getHashCode() ) ) {
            //console.log("已有相同组件");
            return component;
        }

        this.m_componentDic.set( component.getHashCode(), component );
        return component;
    }

    /**
     * 移除组件
     */
    public removeComponent(component: IComponent): void {

        if( component == null ) return;
        var pool: IComponent = this.m_componentDic[component.getHashCode()];
        if (pool == null) return;

        delete this.m_componentDic[component.getHashCode()];
    }

    /**
     * 移除所有组件
     */
    public removeAllComponent():void{

        // this.m_componentDic.reset();
        this.m_componentDic = new Laya.WeakObject();
    }

    /**
     * 重置界面
     */
    public clear(): void {

        if (this.m_eventPool != null) {
            this.m_eventPool.removeAllListener();
        }

        for( let key in this.m_componentDic ){
            let data:any = this.m_componentDic.get( key );
            if( Global.is( data , "IComponent" )){
                (<IComponent>data).clear();
            }
        }
    }

    protected destroyComponent(): void {

        for( let key in this.m_componentDic ){
            let data:any = this.m_componentDic.get( key );
            if( Global.is( data , "IComponent" )){
                (<IComponent>data).dispose();
            }
        }
    }

    /**
     * 获取唯一hashCode
     */
    public getHashCode(): number {

        return this["$_GID"] = this["$_GID"] || Laya.Utils.getGID();
    }

    public get isDisposed(): boolean {
        return this["_disposed"];
    }

    /**回收到池中 */
    public recover():void{

        
    }

    /**
     * 释放所有资源
     */
    public dispose():void{

        if (this["_disposed"])
            return;

        super.dispose();

        this.clear();

        this.__data = null;
        if (this.m_eventPool) {
            this.m_eventPool.dispose();
        }
        this.m_componentDic = null;
        this.m_eventPool = null;
    }
}