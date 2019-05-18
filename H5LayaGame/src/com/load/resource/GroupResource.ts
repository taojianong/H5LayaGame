import Resource from "./Resource";
import { LoaderManager } from "../LoadSourceManager";

/**
 * 组资源
 * @author clong 2019.5.18
 */
export default class GroupResource extends Resource {
    
    public static readonly KEY:string = "GroupResource";

    private _list:Array<Resource> = null;
    
    constructor() { 

        super(); 
    }

    public create( url:Array<Resource> = null , complete:Laya.Handler = null , progress:Laya.Handler = null , error:Laya.Handler = null  ):void{

        // this.url = url;
        this._list = url;
        this._complete = complete;
        this._progress = progress;
        this._error = error;
    }

    public load():void{

        if( this._list && this._list.length > 0 ){
            let isBreak:boolean = false;
            let res:Resource;
            for( res of this._list ){
                if( res && res.getRes( false ) == null ){
                    LoaderManager.load( res.url );
                    if(!isBreak){
                        isBreak = true;
                    }
                }
            }
            if(!isBreak && this._complete != null ){
                this._complete.run();
            }
        }
    }

    /**
     * 资源组是否加载完成
     */
    public isLoaded():boolean{

        if( this._list && this._list.length > 0 ){
            let res:Resource;
            for( res of this._list ){
                if( res && res.getRes( false ) == null ){
                    return false;
                }
            }
        }else{
            return false;
        } 
        return true;
    }

    /**
     * 是否有对应地址资源
     * @param url 资源地址
     */
    public hasUrl( url:string ):boolean{

        let res:Resource;
        for( res of this._list ){
            if( res && res.url == url ){
                return true;
            }
        }
        return false;
    }

    /**
     * 资源是否已加载
     * @param url 资源地址
     */
    public hasLoaded( url:string ):boolean{

        let res:Resource;
        for( res of this._list ){
            if( res && res.url == url && res.getRes( false ) != null ){
                return true;
            }
        }
        return false;
    }
}