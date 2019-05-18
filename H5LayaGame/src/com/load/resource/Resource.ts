import LoadUtils from "../utils/LoadUtils";
import TxtResource from "./TxtResource";
import GroupResource from "./GroupResource";
import { LoaderManager } from "../LoadSourceManager";

/**
 * 资源基类
 * @author clong 2019.5.18
 */
export default class Resource implements IResource {

    public static readonly KEY:string = "Resource";

    /**回收间隔时间，毫秒 */
    public static readonly GC_GAPTIME:number = 10000;

    /**图片资源 */
    public static readonly TYPE_IMAGE:string = "image";
    /**文本资源 */
    public static readonly TPYE_TEXT:string = "text";
    /**二进制资源 */
    public static readonly TYPE_BIN:string = "bin";
    /**组资源 */
    public static readonly TYPE_GROUP:string = "group";

    public static create( url:any , complete:Laya.Handler = null , progress:Laya.Handler = null , error:Laya.Handler = null ):any{

        let res:Resource = null;
        let ext:string = LoadUtils.getFileExt( url );
        if( ext == "png" || ext == "jpg" || ext == "bmp" ){
            res = Laya.Pool.getItemByClass( Resource.KEY , Resource );
            res.type = Laya.Loader.IMAGE;
        }else if( ext == "txt" || ext == "json" ){
            res = Laya.Pool.getItemByClass( TxtResource.KEY , TxtResource );
            res.type = Laya.Loader.TEXT;
        }else if( url instanceof Array){
            res = Laya.Pool.getItemByClass( GroupResource.KEY , GroupResource );
            res.type = Resource.TYPE_GROUP;
        }
        if(res){
            res.create( url , complete , progress , error );
        }
        return res;
    }

    /**
     * 回收资源
     * @param res 
     */
    public static recover( res:Resource ):void{
        
        if( res ){
            res.clear();
            Laya.Pool.recover( typeof res , res );
        }
    }

    //-----------------------------------

    /**资源名字 */
    public name:string = "";
    /**加载地址 */
    public url:string = "";
    /**资源类型 */
    public type:string = "";
    /**下载优先级 */
    public priority:number = 0;
    /**加载完成事件 */
    protected _complete:Laya.Handler = null;
    /**进度事件 */
    protected _progress:Laya.Handler = null;
    /**错误事件 */
    protected _error:Laya.Handler = null;
    /**资源数据 */
    protected _data:any = null;
    /**使用计数 */
    protected _useCount:number = 0;
    /**回收时间 */
    protected _gcTime:number = 0;
    
    constructor( url:string = "" , complete:Laya.Handler = null , error:Laya.Handler = null ) { 

        this.create( url , complete , error );
    }

    public create( url:any = "" , complete:Laya.Handler = null , progress:Laya.Handler = null , error:Laya.Handler = null  ):void{

        this.url = url;
        this._complete = complete;
        this._progress = progress;
        this._error = error;
    }

    public load():void{

        // Laya.loader.load([
		// 	{ url: "res/fairui/common_atlas0.png", type: Laya.Loader.IMAGE },
		// 	{ url: "res/fairui/common.map", type: Laya.Loader.BUFFER }
        //     ], Laya.Handler.create(this, this.onLoaded));

        LoaderManager.load( this.url );
    }

    public recover():void{

        if( this._useCount <= 0 ){
            Resource.recover( this );
        }        
    }

    public loadComplete():void{

        this._data = Laya.loader.getRes( this.url );
        this._useCount = 0;
        if( this._complete != null ){
            this._complete.run();
        }
    }

    /**
     * 获取资源
     * @param isCount 是否计数
     */
    public getRes( isCount:boolean = true ):any{

        if( isCount ){
            this._useCount++;
            this._gcTime = Laya.timer.currFrame + Resource.GC_GAPTIME;
        }        
        return this._data;
    }

    public get useCount():number{

        return this._useCount;
    }

    /**是否可回收 */
    public canGc():boolean{

        return Laya.timer.currFrame > this._gcTime && this._useCount <= 0;
    }

    public isLoaded():boolean{

        return this._data != null;
    }

    public check():void{

        if( this.canGc() ){
            this.recover();
        }
    }

    public get complete():Laya.Handler{

        return this._complete;
    }

    public get progress():Laya.Handler{

        return this._progress;
    }

    public clear():void{
        
        if( this._complete != null ){
            this._complete.recover();
        }
        if( this._progress != null ){
            this._progress.recover();
        }
        if( this._error != null ){
            this._error.recover();
        }
        this._complete = null;
        this._progress = null;
        this._error = null;
        this._data = null;
        this.url = "";
        this._gcTime = 0;
    }

    public dispose():void{

        if( this._useCount > 0 ){
            this._useCount--;
        }
    }

}