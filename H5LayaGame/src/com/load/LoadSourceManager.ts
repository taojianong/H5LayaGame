import Resource from "./resource/Resource";
import LoaderEvent from "./event/LoaderEvent";
import GroupResource from "./resource/GroupResource";
import LoadUtils from "./utils/LoadUtils";
import TxtResource from "./resource/TxtResource";
import EventManager from "../manager/EventManager";
import Log from "../log/Log";

/**
 * 加载资源管理
 * @author clong 2019.5.18
 */
export default class LoadSourceManager {

    /**加载资源管理 */
    private static loadMap: Laya.WeakObject = null;
    /**资源组字典 */
    private static groupMap: Object = null;

    /**
     * 初始化
     */
    public static init(): void {

        LoadSourceManager.loadMap = new Laya.WeakObject();
        LoadSourceManager.groupMap = {};

        EventManager.addEventListener(LoaderEvent.LOAD_SINGLE_COMPLETE, this.loadSingleComplete, this);
        EventManager.addEventListener(LoaderEvent.LOAD_GROUP_COMPLETE, this.loadGroupComplete, this);

        //Laya.timer.loop(10000, this, this.checkRes);//检测资源是否回收,暂定10秒钟回收一次
    }

    /**
     * 加载单个资源完成
     */
    private static loadSingleComplete(source: string | Resource): void {

        let res: Resource = typeof source === "string" ? this.getRes(source) : source;
        if (res != null) {
            let groupRes: GroupResource = null;
            let key:any;
            for ( key in this.groupMap) {
                groupRes = this.groupMap[key];
                if (groupRes && groupRes.hasUrl(res.url) && groupRes.isLoaded()) {                    
                    EventManager.dispatchEvent(LoaderEvent.LOAD_GROUP_COMPLETE, groupRes);
                    break;
                }
            }
        }
    }

    /**
     * 加载组资源完成
     * @param groupName 
     */
    private static loadGroupComplete(source: string | GroupResource): void {

        let groupRes: GroupResource = typeof source === "string" ? <GroupResource>this.getRes(source) : source;
        if (groupRes != null) {
            Log.log( this , "加载资源组["+groupRes.name+"]完成!");
            if (groupRes.complete != null) {
                groupRes.complete.run();
            }
        }
    }

    /**
     * 加载组资源
     * @param groupName 资源组名字,常规不带符号的字符串，字母+数组
     * @param urllist 资源地址列表
     */
    public static loadGroup(groupName: string = "", urllist: Array<string>, complete: Laya.Handler = null, progress: Laya.Handler = null): void {

        if (!groupName) return;
        let grouplist: Array<Resource> = this.loadMap.get(groupName);
        if (grouplist == null) {
            grouplist = [];
            if (urllist != null && urllist.length > 0) {
                for (let i = 0; i < urllist.length; i++) {
                    let url: string = urllist[i];
                    let res: Resource = this.loadMap.get(url) || LoadSourceManager.create(url);
                    grouplist.push(res);
                    this.loadMap.set(res.url, res);
                }
            }

            let groupRes: GroupResource = this.groupMap[ groupName ]; 
            if( groupRes == null ){
                groupRes = LoadSourceManager.create(grouplist, complete, progress);
                groupRes.name = groupName;
                groupRes.load();
                this.groupMap[groupName] = groupRes;
            }else if( complete != null ){
                if( groupRes.isLoaded() ){
                    complete.run();
                }                
            }            
        } else {
            Laya.Log.print("已经有该资源组了！");
        }
    } 

    /**
     * 创建加载资源类
     * @param url
     * @param complete 
     * @param progress 
     * @param error 
     */
    public static create(url: any, complete: Laya.Handler = null, progress: Laya.Handler = null, error: Laya.Handler = null): any {

        let res: Resource = null;
        let ext: string = typeof url === "string" ? LoadUtils.getFileExt(url) : "";
        if (url instanceof Array) {
            res = Laya.Pool.getItemByClass(GroupResource.KEY, GroupResource);
            res.type = Resource.TYPE_GROUP;
        } else if (ext == "png" || ext == "jpg" || ext == "bmp") {
            res = Laya.Pool.getItemByClass(Resource.KEY, Resource);
            res.type = Laya.Loader.IMAGE;
        } else if (ext == "txt" || ext == "json") {
            res = Laya.Pool.getItemByClass(TxtResource.KEY, TxtResource);
            res.type = Laya.Loader.TEXT;
        } else {//二进制资源
            res = Laya.Pool.getItemByClass(Resource.KEY, Resource);
            res.type = Laya.Loader.BUFFER;
        }
        if (res) {
            res.create(url, complete, progress, error);
        }
        return res;
    }

    /**
     * 加载资源
     * @param source 资源
     */
    public static load(source: string | Resource, complete: Laya.Handler = null, error: Laya.Handler = null): void {

        if (!source) {
            return;
        }
        let res: Resource = null;
        if (typeof source === "string") {
            res = this.loadMap.get(source);
            if (res != null) {
                return;
            }
            res = LoadSourceManager.create(source, complete, error);
        } else if (source instanceof Resource) {
            res = source;
        }

        if (res == null) {
            return;
        }
        if (res.getRes(false) != null) {//资源已加载完成
            return;
        }
        res.load();
        this.loadMap.set(res.url, res);
        let isBreak: boolean = false;
        for (let key in this.loadMap) {
            res = this.loadMap.get(key);
            if (res) {
                isBreak = true;
                break;
            }
        }
        if (isBreak) {
            Laya.timer.loop(1000, this, this.checkRes);
        } else {
            Laya.timer.clear(this, this.checkRes);
        }
    }

    /**
     * 检测资源是否可回收
     */
    private static checkRes(): void {

        let res: Resource;
        for (let url in this.loadMap) {
            res = this.loadMap.get(url);
            if (res && res.canGc()) {
                res.recover();
                this.loadMap.del(url);
            }
        }

        //检测组资源 TODO

    }

    /**
     * 获取资源数据
     * @param url 资源地址,或者组资源名
     */
    public static getRes(url: string): Resource | GroupResource {

        return this.loadMap.get(url) || this.groupMap[ url ] != null;
    }

    /**
     * 获取资源
     * @param url 资源地址
     * @param isCount 是否计数
     */
    public static getSource(url: string, isCount: boolean = false): any {

        let res: Resource = this.loadMap.get(url);
        return res && res.getRes(isCount);
    }

    /**
     * 释放资源
     */
    public static destroyRes(url: string): void {


    }
}

/**
 * 纯粹加载资源管理
 */
export class LoaderManager {

    /**加载队列上限 */
    public static LOAD_LIMIT: number = 5;

    /**
     * 准备加载列表
     */
    private static readyLoadList: Array<Resource> = [];

    /**正在加载的列表 */
    private static loadingList: Array<Resource> = [];

    /**
     * 加载资源
     * @param source 资源地址或Resource
     */
    public static load(source: string | Resource): void {

        let res: Resource = typeof source === "string" ? LoadSourceManager.getRes(source) : source;
        if (res) {
            if (this.loadingList.length < this.LOAD_LIMIT) {
                if (this.loadingList.indexOf(res) != -1) {
                    //资源正在加载
                    return;
                }
                this.loadingList.push(res);
                //Log.log(this, "开始加载资源 url: " + res.url, Log.TYPE_LOAD);//打印日志
                Laya.loader.load([{ url: res.url, type: res.type }], Laya.Handler.create(this, this.onLoaded, [res], true), res.progress);
            } else if (this.readyLoadList.indexOf(res) == -1) {
                this.readyLoadList.push(res);
                //这里根据优先级排序
                // this.readyLoadList = this.readyLoadList.sort();
            }
        }
    }

    private static onLoaded(res: Resource): void {

        res.loadComplete();
        //从加载列表移除
        let index: number = this.loadingList.indexOf(res);
        if (index != -1) {
            this.loadingList.splice(index, 1);
        }
        Log.log(this, "加载资源 url：" + res.url + "完成。", Log.TYPE_LOAD);
        EventManager.dispatchEvent(LoaderEvent.LOAD_SINGLE_COMPLETE, res);

        this.loadNext();
    }

    private static loadNext(): void {

        let res: Resource = this.readyLoadList.shift();
        if (res != null) {
            this.load(res);
        }
    }
}