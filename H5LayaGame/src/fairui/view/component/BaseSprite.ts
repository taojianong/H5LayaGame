import Global from "../../../Global";
import EventPool from "../../../com/events/EventPool";

/**
 * fairygui原件基类
 * @author clong 2019.5.18
 */
export default class BaseSprite extends fairygui.GComponent implements IComponent{

    /**数据 */
    protected _data: any = null;
    /**是否变灰 */
    protected _isGray: boolean = false;
    /**
     * 用传入的fairyui.GComponent转化为BaseSprite
     */
    protected ower: fairygui.GComponent = null;

    protected _iconLoader:fairygui.GLoader;

    protected _currentState:string = "";

	protected _buttonController:fairygui.Controller;

    //事件缓存池
    protected m_eventPool: EventPool = null;
    //组件缓存池
	protected m_componentDic: Laya.WeakObject = null;
        
    public constructor(comp: fairygui.GComponent = null) {

        super();

        this.ower = comp;

        this.m_eventPool = EventPool.create();
        this.m_componentDic = new Laya.WeakObject();
    }

    protected constructFromXML(xml: any): void {

        super.constructFromXML(xml);

        this.initController();
    }

    /**初始化控制器 */
    protected initController():void{

        this._buttonController = this.getController("button");
        this._iconLoader = <fairygui.GLoader>this.getChild("icon");
    }

    public set currentState(value: string) {
			
        this._currentState = value;

        if( this._buttonController ){
            this._buttonController.selectedPage = value;
        }
    }
    /**当前状态 */
    public get currentState(): string {

        return this._currentState;
    }		

    /**
     * 是否包含全局坐标点
     * @param gx 全局X坐标
     * @param gy 全局Y坐标
     */
    public containsGlobalPoint(gx: number, gy: number): boolean {

        let lp: Laya.Point = this.globalToLocal(gx, gy);
        let bounds: Laya.Rectangle = new Laya.Rectangle(0, 0, this.width, this.height);
        return bounds.contains(lp.x, lp.y);
    }

    public addChild(child: fairygui.GObject): fairygui.GObject {

        if ( Global.is( child , "IComponent" ) ) {
            this.addComponent(<any>child);
        }
        return super.addChild(child);
    }

    public addChildAt(child: fairygui.GObject, index: number): fairygui.GObject {

        if ( Global.is( child , "IComponent" ) ) {
            this.addComponent(<any>child);
        }
        return super.addChildAt(child, index);
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

    //-------------------------------------------------------

    public addEventListener( type:string , listener:Function , thisObject:any , args:Array<any> = null ):void{

        this.on( type , thisObject , listener , args )
    }

    public removeEventListener( type:string , listener:Function , thisObject:any ):void{

        this.off( type , thisObject , listener );
    }

    /**
     * 增加监听事件函数
     */
    public addAllListener():void {

        if( this.m_eventPool != null ){
            this.m_eventPool.relistenerAll();
            for( let key in this.m_componentDic ){
                let data:any = this.m_componentDic.get( key );
                if( Global.is( data , "IComponent" )){
                    (<IComponent>data).addAllListener();
                }
            }
        }			
    }

    /**
     * 移除监听事件函数
     */
    public removeAllListener():void {

        if( this.m_eventPool != null ){
            this.m_eventPool.removeAllListener();
            for( let key in this.m_componentDic ){
                let data:any = this.m_componentDic.get( key );
                if( Global.is( data , "IComponent" )){
                    (<IComponent>data).removeAllListener();
                }
            }
        }			
    }

    /**
     * 添加事件监听
     */
    public addGameListener(type: string, listener: Function, thisObject: any , target?: any) {
        if( this.m_eventPool != null ){
            this.m_eventPool.addListener( type , listener , target , thisObject );
        }
    }

    /**
     * 移除事件监听
     */
    public removeGameListener(type: string, listener: Function, thisObject: any , target?: any) {
        if( this.m_eventPool != null ){
            this.m_eventPool.removeListener( type , listener , target , thisObject );
        }
    }

    /**
     * 添加组件
     */
    public addComponent(component: IComponent): any {

        if( component ){
            let hashCode:number = component.getHashCode();
            this.m_componentDic.set( hashCode , component );
        }
        return component;
    }

    /**
     * 移除组件
     */
    public removeComponent(component: IComponent): void {

        if( component != null ){
            let hashCode:number = component.getHashCode();
            this.m_componentDic.del( hashCode  );
        }
    }

    /**
     * 移除所有组件
     */
    public removeAllComponent():void{

        for(let key in this.m_componentDic ){
            this.m_componentDic.del( key );
        }
        // this.m_componentDic.reset();
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
            if( Global.is( data , "IComponent" ) ){
                (<IComponent>data).clear();
            }
        }
    }

    protected destroyComponent(): void {
        for( let key in this.m_componentDic ){
            let data:any = this.m_componentDic.get( key );
            if( Global.is( data , "IComponent" ) ){
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

    /**
     * 释放所有资源
     */
    public dispose():void{

        if (this["_disposed"]){ //fairygui 中的私有属性
            return;
        }

        super.dispose();

        this.clear();

        if (this.m_eventPool) {
            this.m_eventPool.dispose();
        }
        this.m_componentDic = null;
        this.m_eventPool = null;

        if (this.parent != null) {
            this.parent.removeChild(this, true);
        }
    }
}