var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FairyUIManager_1 = require("./fairui/manager/FairyUIManager");
var PanelRegister_1 = require("./fairui/PanelRegister");
var EButton_1 = require("./fairui/view/component/EButton");
var LoadSourceManager_1 = require("./com/load/LoadSourceManager");
var UrlUtils_1 = require("./com/load/utils/UrlUtils");
/**
 * 游戏主客户端
 * @author clong 2019.5.18
 */
var GameClient = /** @class */ (function (_super) {
    __extends(GameClient, _super);
    function GameClient() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    GameClient.prototype.init = function () {
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
        // Laya.loader.load([
        // 	{ url: "res/fairui/common_atlas0.png", type: Laya.Loader.IMAGE },
        // 	{ url: "res/fairui/common.map", type: Laya.Loader.BUFFER }
        //     ], Laya.Handler.create(this, this.onLoaded));
        var urls = UrlUtils_1.default.getFairyGroup("common");
        LoadSourceManager_1.default.loadGroup("common", urls, Laya.Handler.create(this, this.onLoaded));
    };
    GameClient.prototype.onLoaded = function () {
        // fairygui.UIPackage.addPackage("res/fairui/common");		
        // fairygui.UIConfig.defaultFont = "Microsoft YaHei";
        // fairygui.UIConfig.verticalScrollBar = "ui://Basic/ScrollBar_VT";
        // fairygui.UIConfig.horizontalScrollBar = "ui://Basic/ScrollBar_HZ";
        // fairygui.UIConfig.popupMenu = "ui://Basic/PopupMenu";
        PanelRegister_1.default.registerClass("common", "EButton", EButton_1.default);
        FairyUIManager_1.default.init(Laya.stage);
    };
    return GameClient;
}(Laya.Sprite));
exports.default = GameClient;
},{"./com/load/LoadSourceManager":5,"./com/load/utils/UrlUtils":11,"./fairui/PanelRegister":15,"./fairui/manager/FairyUIManager":16,"./fairui/view/component/EButton":19}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameClient_1 = require("./GameClient");
var LoadSourceManager_1 = require("./com/load/LoadSourceManager");
var EventManager_1 = require("./com/manager/EventManager");
var Log_1 = require("./com/log/Log");
/**
 * 全局参数
 * @author clong 2019.5.18
 */
var Global = /** @class */ (function () {
    function Global() {
    }
    /**
     * 全局初始化
     */
    Global.init = function () {
        Log_1.default.init();
        EventManager_1.default.init();
        LoadSourceManager_1.default.init();
        Laya.stage.addChild(new GameClient_1.default());
    };
    /**
     * 判断对象是否为对应类或接口
     */
    Global.is = function (target, cls) {
        if (!target) {
            return false;
        }
        return Laya["__typeof"](target, cls);
    };
    Global.width = 640;
    Global.height = 1136;
    Global.scaleMode = "fixedwidth";
    Global.screenMode = "none"; //horizontal
    Global.alignV = "top";
    Global.alignH = "left";
    Global.debug = false;
    Global.stat = false;
    Global.physicsDebug = false;
    Global.exportSceneToJson = true;
    return Global;
}());
exports.default = Global;
},{"./GameClient":1,"./com/load/LoadSourceManager":5,"./com/log/Log":12,"./com/manager/EventManager":14}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("./Global");
var Main = /** @class */ (function () {
    function Main() {
        Laya.init(1136, 640, Laya.WebGL);
        // Laya.init( Global.width , Global.height , Laya.WebGL);
        laya.utils.Stat.show(0, 0);
        //设置适配模式
        Laya.stage.scaleMode = "showall";
        Laya.stage.alignH = "left";
        Laya.stage.alignV = "top";
        //设置横竖屏
        Laya.stage.screenMode = Global_1.default.screenMode; // "horizontal";
        //根据IDE设置初始化引擎		
        if (window["Laya3D"]) {
            Laya3D.init(Global_1.default.width, Global_1.default.height);
        }
        else {
            Laya.init(Global_1.default.width, Global_1.default.height, Laya["WebGL"]);
        }
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.scaleMode = Global_1.default.scaleMode;
        Laya.stage.screenMode = Global_1.default.screenMode;
        //兼容微信不支持加载scene后缀场景
        //Laya.URL.exportSceneToJson = Global.exportSceneToJson;
        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if (Global_1.default.debug || Laya.Utils.getQueryString("debug") == "true")
            Laya.enableDebugPanel();
        if (Global_1.default.physicsDebug && Laya["PhysicsDebugDraw"])
            Laya["PhysicsDebugDraw"].enable();
        if (Global_1.default.stat)
            Laya.Stat.show();
        Laya.alertGlobalError = true;
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    }
    Main.prototype.onVersionLoaded = function () {
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        //Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        Global_1.default.init();
    };
    Main.prototype.onConfigLoaded = function () {
        //加载IDE指定的场景
        //GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    };
    return Main;
}());
//激活启动类
new Main();
},{"./Global":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventManager_1 = require("../manager/EventManager");
/**
 * 事件池
 * @author clong 2019.4.20
 */
var EventPool = /** @class */ (function () {
    function EventPool() {
        //----------------------------------------------------
        this._eventObjList = null;
        this._eventObjList = [];
    }
    EventPool.create = function () {
        var obj = EventPool.pool.shift();
        if (obj == null) {
            obj = new EventPool();
        }
        return obj;
    };
    EventPool.recover = function (obj) {
        if (obj != null && EventPool.pool.indexOf(obj) == -1) {
            EventPool.pool.push(obj);
        }
    };
    /**
     * 添加事件监听
     * @param type 		事件类型
     * @param listener 	事件方法
     * @param target	事件对象
     * @param thisObj
     */
    EventPool.prototype.addListener = function (type, listener, target, thisObj) {
        if (target === void 0) { target = null; }
        if (!this.hasEventListener(type, listener, target, thisObj)) {
            var obj = EventObj.create(type, listener, target, thisObj);
            this._eventObjList.push(obj);
            EventManager_1.default.addEventListener(type, listener, thisObj, target);
        }
    };
    /**
     * 移除事件监听
     * @param type 		事件类型
     * @param listener 	事件方法
     * @param target	事件对象
     * @param thisObj
     */
    EventPool.prototype.removeListener = function (type, listener, target, thisObj) {
        if (target === void 0) { target = null; }
        var obj = null;
        for (var i = 0; i < this._eventObjList.length; i++) {
            obj = this._eventObjList[i];
            if (obj && obj.type == type && obj.listener == listener && obj.thisObj == thisObj) {
                this._eventObjList.splice(i, 1);
                break;
            }
        }
        EventManager_1.default.removeEventListener(type, listener, thisObj, target);
    };
    /**
     * 移除池里所有事件监听,保持的对象不从列表里移除
     */
    EventPool.prototype.removeAllListener = function () {
        var obj = null;
        for (var i = 0; i < this._eventObjList.length; i++) {
            obj = this._eventObjList[i];
            if (obj) {
                EventManager_1.default.removeEventListener(obj.type, obj.listener, obj.thisObj, obj.target);
            }
        }
    };
    /**
     * 重新监听所有事件
     */
    EventPool.prototype.relistenerAll = function () {
        var obj = null;
        for (var i = 0; i < this._eventObjList.length; i++) {
            obj = this._eventObjList[i];
            if (obj) {
                EventManager_1.default.addEventListener(obj.type, obj.listener, obj.thisObj, obj.target);
            }
        }
    };
    /**
     * 是否有某个监听
     * @param type 		事件类型
     * @param listener 	事件方法
     * @param target	事件对象
     * @param thisObj
     */
    EventPool.prototype.hasEventListener = function (type, listener, target, thisObj) {
        if (target === void 0) { target = null; }
        var obj = null;
        for (var _i = 0, _a = this._eventObjList; _i < _a.length; _i++) {
            obj = _a[_i];
            if (obj && obj.type == type && obj.listener == listener) {
                if (target == null) {
                    return obj.thisObj == thisObj;
                }
                else {
                    return obj.target == target && obj.thisObj == thisObj;
                }
            }
        }
        return false;
    };
    /**
     * 释放资源
     */
    EventPool.prototype.dispose = function () {
        while (this._eventObjList && this._eventObjList.length > 0) {
            var obj = this._eventObjList.shift();
            if (obj) {
                EventManager_1.default.removeEventListener(obj.type, obj.listener, obj.thisObj, obj.target);
                obj.recover();
            }
        }
        this._eventObjList = [];
        EventPool.recover(this);
    };
    EventPool.pool = [];
    return EventPool;
}());
exports.default = EventPool;
},{"../manager/EventManager":14}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Resource_1 = require("./resource/Resource");
var LoaderEvent_1 = require("./event/LoaderEvent");
var GroupResource_1 = require("./resource/GroupResource");
var LoadUtils_1 = require("./utils/LoadUtils");
var TxtResource_1 = require("./resource/TxtResource");
var EventManager_1 = require("../manager/EventManager");
var Log_1 = require("../log/Log");
/**
 * 加载资源管理
 * @author clong 2019.5.18
 */
var LoadSourceManager = /** @class */ (function () {
    function LoadSourceManager() {
    }
    /**
     * 初始化
     */
    LoadSourceManager.init = function () {
        LoadSourceManager.loadMap = new Laya.WeakObject();
        LoadSourceManager.groupMap = new Laya.WeakObject();
        EventManager_1.default.addEventListener(LoaderEvent_1.default.LOAD_SINGLE_COMPLETE, this.loadSingleComplete, this);
        EventManager_1.default.addEventListener(LoaderEvent_1.default.LOAD_GROUP_COMPLETE, this.loadGroupComplete, this);
        Laya.timer.loop(10000, this, this.checkRes); //检测资源是否回收,暂定10秒钟回收一次
    };
    /**
     * 加载单个资源完成
     */
    LoadSourceManager.loadSingleComplete = function (source) {
        var res = typeof source === "string" ? this.getRes(source) : source;
        if (res != null) {
            var groupRes = null;
            for (var key in this.groupMap) {
                groupRes = this.groupMap.get(key);
                if (groupRes && groupRes.hasUrl(res.url) && groupRes.isLoaded()) {
                    EventManager_1.default.dispatchEvent(LoaderEvent_1.default.LOAD_GROUP_COMPLETE, groupRes);
                    break;
                }
            }
        }
    };
    /**
     * 加载组资源完成
     * @param groupName
     */
    LoadSourceManager.loadGroupComplete = function (source) {
        var groupRes = typeof source === "string" ? this.getRes(source) : source;
        if (groupRes != null) {
            if (groupRes.complete != null) {
                groupRes.complete.run();
            }
        }
    };
    /**
     * 加载组资源
     * @param groupName 资源组名字,常规不带符号的字符串，字母+数组
     * @param urllist 资源地址列表
     */
    LoadSourceManager.loadGroup = function (groupName, urllist, complete, progress) {
        if (groupName === void 0) { groupName = ""; }
        if (complete === void 0) { complete = null; }
        if (progress === void 0) { progress = null; }
        if (!groupName)
            return;
        var grouplist = this.loadMap.get(groupName);
        if (grouplist == null) {
            grouplist = [];
            if (urllist != null && urllist.length > 0) {
                for (var i = 0; i < urllist.length; i++) {
                    var url = urllist[i];
                    var res = this.loadMap.get(url) || LoadSourceManager.create(url);
                    grouplist.push(res);
                    this.loadMap.set(res.url, res);
                }
            }
            var groupRes = LoadSourceManager.create(grouplist, complete, progress);
            groupRes.load();
            this.groupMap.set(groupName, groupRes);
        }
        else {
            Laya.Log.print("已经有该资源组了！");
        }
    };
    LoadSourceManager.create = function (url, complete, progress, error) {
        if (complete === void 0) { complete = null; }
        if (progress === void 0) { progress = null; }
        if (error === void 0) { error = null; }
        var res = null;
        var ext = typeof url === "string" ? LoadUtils_1.default.getFileExt(url) : "";
        if (url instanceof Array) {
            res = Laya.Pool.getItemByClass(GroupResource_1.default.KEY, GroupResource_1.default);
            res.type = Resource_1.default.TYPE_GROUP;
        }
        else if (ext == "png" || ext == "jpg" || ext == "bmp") {
            res = Laya.Pool.getItemByClass(Resource_1.default.KEY, Resource_1.default);
            res.type = Laya.Loader.IMAGE;
        }
        else if (ext == "txt" || ext == "json") {
            res = Laya.Pool.getItemByClass(TxtResource_1.default.KEY, TxtResource_1.default);
            res.type = Laya.Loader.TEXT;
        }
        else { //二进制
            res = Laya.Pool.getItemByClass(Resource_1.default.KEY, Resource_1.default);
            res.type = Laya.Loader.BUFFER;
        }
        if (res) {
            res.create(url, complete, progress, error);
        }
        return res;
    };
    /**
     * 加载资源
     * @param source 资源
     */
    LoadSourceManager.load = function (source, complete, error) {
        if (complete === void 0) { complete = null; }
        if (error === void 0) { error = null; }
        if (!source) {
            return;
        }
        var res = null;
        if (typeof source === "string") {
            res = this.loadMap.get(source);
            if (res != null) {
                return;
            }
            res = LoadSourceManager.create(source, complete, error);
        }
        else if (source instanceof Resource_1.default) {
            res = source;
        }
        if (res == null) {
            return;
        }
        if (res.getRes(false) != null) { //资源已加载完成
            return;
        }
        res.load();
        this.loadMap.set(res.url, res);
        var isBreak = false;
        for (var key in this.loadMap) {
            res = this.loadMap.get(key);
            if (res) {
                isBreak = true;
                break;
            }
        }
        if (isBreak) {
            Laya.timer.loop(1000, this, this.checkRes);
        }
        else {
            Laya.timer.clear(this, this.checkRes);
        }
    };
    /**
     * 检测资源是否可回收
     */
    LoadSourceManager.checkRes = function () {
        var res;
        for (var url in this.loadMap) {
            res = this.loadMap.get(url);
            if (res && res.canGc()) {
                res.recover();
                this.loadMap.del(url);
            }
        }
        //检测组资源 TODO
    };
    /**
     * 获取资源数据
     * @param url 资源地址,或者组资源名
     */
    LoadSourceManager.getRes = function (url) {
        return this.loadMap.get(url) || this.groupMap.get(url);
    };
    /**
     * 获取资源
     * @param url 资源地址
     * @param isCount 是否计数
     */
    LoadSourceManager.getSource = function (url, isCount) {
        if (isCount === void 0) { isCount = false; }
        var res = this.loadMap.get(url);
        return res && res.getRes(isCount);
    };
    /**
     * 释放资源
     */
    LoadSourceManager.destroyRes = function (url) {
    };
    /**加载资源管理 */
    LoadSourceManager.loadMap = null;
    /**资源组字典 */
    LoadSourceManager.groupMap = null;
    return LoadSourceManager;
}());
exports.default = LoadSourceManager;
/**
 * 纯粹加载资源管理
 */
var LoaderManager = /** @class */ (function () {
    function LoaderManager() {
    }
    /**
     * 加载资源
     * @param source 资源地址或Resource
     */
    LoaderManager.load = function (source) {
        var res = typeof source === "string" ? LoadSourceManager.getRes(source) : source;
        if (res) {
            if (this.loadingList.length < this.LOAD_LIMIT) {
                if (this.loadingList.indexOf(res) != -1) {
                    //资源正在加载
                    return;
                }
                this.loadingList.push(res);
                Log_1.default.log(this, "开始加载资源 url: " + res.url, Log_1.default.TYPE_LOAD); //打印日志
                Laya.loader.load([{ url: res.url, type: res.type }], Laya.Handler.create(this, this.onLoaded, [res], true), res.progress);
            }
            else if (this.readyLoadList.indexOf(res) == -1) {
                this.readyLoadList.push(res);
                //这里根据优先级排序
                // this.readyLoadList = this.readyLoadList.sort();
            }
        }
    };
    LoaderManager.onLoaded = function (res) {
        res.loadComplete();
        //从加载列表移除
        var index = this.loadingList.indexOf(res);
        if (index != -1) {
            this.loadingList.splice(index, 1);
        }
        Log_1.default.log(this, "加载资源 url：" + res.url + "完成。", Log_1.default.TYPE_LOAD);
        EventManager_1.default.dispatchEvent(LoaderEvent_1.default.LOAD_SINGLE_COMPLETE, res);
        this.loadNext();
    };
    LoaderManager.loadNext = function () {
        var res = this.readyLoadList.shift();
        if (res != null) {
            this.load(res);
        }
    };
    /**加载队列上限 */
    LoaderManager.LOAD_LIMIT = 5;
    /**
     * 准备加载列表
     */
    LoaderManager.readyLoadList = [];
    /**正在加载的列表 */
    LoaderManager.loadingList = [];
    return LoaderManager;
}());
exports.LoaderManager = LoaderManager;
},{"../log/Log":12,"../manager/EventManager":14,"./event/LoaderEvent":6,"./resource/GroupResource":7,"./resource/Resource":8,"./resource/TxtResource":9,"./utils/LoadUtils":10}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 加载事件
 * @author clong 2019.5.18
 */
var LoaderEvent = /** @class */ (function () {
    function LoaderEvent() {
    }
    /**加载单个资源完成 */
    LoaderEvent.LOAD_SINGLE_COMPLETE = "LoaderEvent.loadSingleComplete";
    /**加载组资源完成 */
    LoaderEvent.LOAD_GROUP_COMPLETE = "LoaderEvent.loadGroupComplete";
    return LoaderEvent;
}());
exports.default = LoaderEvent;
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Resource_1 = require("./Resource");
var LoadSourceManager_1 = require("../LoadSourceManager");
/**
 * 组资源
 * @author clong 2019.5.18
 */
var GroupResource = /** @class */ (function (_super) {
    __extends(GroupResource, _super);
    function GroupResource() {
        var _this = _super.call(this) || this;
        _this._list = null;
        return _this;
    }
    GroupResource.prototype.create = function (url, complete, progress, error) {
        if (url === void 0) { url = null; }
        if (complete === void 0) { complete = null; }
        if (progress === void 0) { progress = null; }
        if (error === void 0) { error = null; }
        // this.url = url;
        this._list = url;
        this._complete = complete;
        this._progress = progress;
        this._error = error;
    };
    GroupResource.prototype.load = function () {
        if (this._list && this._list.length > 0) {
            var isBreak = false;
            var res = void 0;
            for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                res = _a[_i];
                if (res && res.getRes(false) == null) {
                    LoadSourceManager_1.LoaderManager.load(res.url);
                    if (!isBreak) {
                        isBreak = true;
                    }
                }
            }
            if (!isBreak && this._complete != null) {
                this._complete.run();
            }
        }
    };
    /**
     * 资源组是否加载完成
     */
    GroupResource.prototype.isLoaded = function () {
        if (this._list && this._list.length > 0) {
            var res = void 0;
            for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
                res = _a[_i];
                if (res && res.getRes(false) == null) {
                    return false;
                }
            }
        }
        else {
            return false;
        }
        return true;
    };
    /**
     * 是否有对应地址资源
     * @param url 资源地址
     */
    GroupResource.prototype.hasUrl = function (url) {
        var res;
        for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
            res = _a[_i];
            if (res && res.url == url) {
                return true;
            }
        }
        return false;
    };
    /**
     * 资源是否已加载
     * @param url 资源地址
     */
    GroupResource.prototype.hasLoaded = function (url) {
        var res;
        for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
            res = _a[_i];
            if (res && res.url == url && res.getRes(false) != null) {
                return true;
            }
        }
        return false;
    };
    GroupResource.KEY = "GroupResource";
    return GroupResource;
}(Resource_1.default));
exports.default = GroupResource;
},{"../LoadSourceManager":5,"./Resource":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoadSourceManager_1 = require("../LoadSourceManager");
/**
 * 资源基类
 * @author clong 2019.5.18
 */
var Resource = /** @class */ (function () {
    function Resource(url, complete, error) {
        if (url === void 0) { url = ""; }
        if (complete === void 0) { complete = null; }
        if (error === void 0) { error = null; }
        //-----------------------------------
        /**资源名字 */
        this.name = "";
        /**加载地址 */
        this.url = "";
        /**资源类型 */
        this.type = "";
        /**下载优先级 */
        this.priority = 0;
        /**加载完成事件 */
        this._complete = null;
        /**进度事件 */
        this._progress = null;
        /**错误事件 */
        this._error = null;
        /**资源数据 */
        this._data = null;
        /**使用计数 */
        this._useCount = 0;
        /**回收时间 */
        this._gcTime = 0;
        this.create(url, complete, error);
    }
    // public static create( url:any , complete:Laya.Handler = null , progress:Laya.Handler = null , error:Laya.Handler = null ):any{
    //     let res:Resource = null;
    //     let ext:string = LoadUtils.getFileExt( url );
    //     if( ext == "png" || ext == "jpg" || ext == "bmp" ){
    //         res = Laya.Pool.getItemByClass( Resource.KEY , Resource );
    //         res.type = Laya.Loader.IMAGE;
    //     }else if( ext == "txt" || ext == "json" ){
    //         res = Laya.Pool.getItemByClass( TxtResource.KEY , TxtResource );
    //         res.type = Laya.Loader.TEXT;
    //     }else if( url instanceof Array){
    //         res = Laya.Pool.getItemByClass( GroupResource.KEY , GroupResource );
    //         res.type = Resource.TYPE_GROUP;
    //     }
    //     if(res){
    //         res.create( url , complete , progress , error );
    //     }
    //     return res;
    // }
    /**
     * 回收资源
     * @param res
     */
    Resource.recover = function (res) {
        if (res) {
            res.clear();
            Laya.Pool.recover(typeof res, res);
        }
    };
    Resource.prototype.create = function (url, complete, progress, error) {
        if (url === void 0) { url = ""; }
        if (complete === void 0) { complete = null; }
        if (progress === void 0) { progress = null; }
        if (error === void 0) { error = null; }
        this.url = url;
        this._complete = complete;
        this._progress = progress;
        this._error = error;
    };
    Resource.prototype.load = function () {
        // Laya.loader.load([
        // 	{ url: "res/fairui/common_atlas0.png", type: Laya.Loader.IMAGE },
        // 	{ url: "res/fairui/common.map", type: Laya.Loader.BUFFER }
        //     ], Laya.Handler.create(this, this.onLoaded));
        LoadSourceManager_1.LoaderManager.load(this.url);
    };
    Resource.prototype.recover = function () {
        if (this._useCount <= 0) {
            Resource.recover(this);
        }
    };
    Resource.prototype.loadComplete = function () {
        this._data = Laya.loader.getRes(this.url);
        this._useCount = 0;
        if (this._complete != null) {
            this._complete.run();
        }
    };
    /**
     * 获取资源
     * @param isCount 是否计数
     */
    Resource.prototype.getRes = function (isCount) {
        if (isCount === void 0) { isCount = true; }
        if (isCount) {
            this._useCount++;
            this._gcTime = Laya.timer.currFrame + Resource.GC_GAPTIME;
        }
        return this._data;
    };
    Object.defineProperty(Resource.prototype, "useCount", {
        get: function () {
            return this._useCount;
        },
        enumerable: true,
        configurable: true
    });
    /**是否可回收 */
    Resource.prototype.canGc = function () {
        return Laya.timer.currFrame > this._gcTime && this._useCount <= 0;
    };
    Resource.prototype.isLoaded = function () {
        return this._data != null;
    };
    Resource.prototype.check = function () {
        if (this.canGc()) {
            this.recover();
        }
    };
    Object.defineProperty(Resource.prototype, "complete", {
        get: function () {
            return this._complete;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "progress", {
        get: function () {
            return this._progress;
        },
        enumerable: true,
        configurable: true
    });
    Resource.prototype.clear = function () {
        if (this._complete != null) {
            this._complete.recover();
        }
        if (this._progress != null) {
            this._progress.recover();
        }
        if (this._error != null) {
            this._error.recover();
        }
        this._complete = null;
        this._progress = null;
        this._error = null;
        this._data = null;
        this.url = "";
        this._gcTime = 0;
    };
    Resource.prototype.dispose = function () {
        if (this._useCount > 0) {
            this._useCount--;
        }
    };
    Resource.KEY = "Resource";
    /**回收间隔时间，毫秒 */
    Resource.GC_GAPTIME = 10000;
    /**图片资源 */
    Resource.TYPE_IMAGE = "image";
    /**文本资源 */
    Resource.TPYE_TEXT = "text";
    /**二进制资源 */
    Resource.TYPE_BIN = "bin";
    /**组资源 */
    Resource.TYPE_GROUP = "group";
    return Resource;
}());
exports.default = Resource;
},{"../LoadSourceManager":5}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Resource_1 = require("./Resource");
/**
 * 文本资源
 * @author clong 2019.5.18
 */
var TxtResource = /** @class */ (function (_super) {
    __extends(TxtResource, _super);
    function TxtResource() {
        return _super.call(this) || this;
    }
    TxtResource.KEY = "TxtResource";
    return TxtResource;
}(Resource_1.default));
exports.default = TxtResource;
},{"./Resource":8}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 加载工具
 * @author clong 2019.5.18
 */
var LoadUtils = /** @class */ (function () {
    function LoadUtils() {
    }
    /**
     * 获得文件后缀名
     * @param url 文件路径
     * @return <b>String</b> 文件后缀名
     */
    LoadUtils.getFileExt = function (url) {
        //切掉路径后面的参数
        var ext = url.indexOf("?") > -1 ? url.substring(0, url.indexOf("?")) : url;
        //截取后缀
        var last = ext.substring(ext.lastIndexOf("/"));
        return last.lastIndexOf(".") == -1 ? "" : last.substring(last.lastIndexOf(".") + 1).toLowerCase();
    };
    return LoadUtils;
}());
exports.default = LoadUtils;
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 资源地址管理类
 * @author clong 2019.5.18
 */
var UrlUtils = /** @class */ (function () {
    function UrlUtils() {
    }
    /**
     * 获取fairygui资源组
     * @param name
     */
    UrlUtils.getFairyGroup = function (name) {
        return [UrlUtils.FAIRUI + name + "_atlas0.png", UrlUtils.FAIRUI + name + ".map"];
    };
    UrlUtils.RES = "res/";
    /**fairygui发布资源目录 */
    UrlUtils.FAIRUI = UrlUtils.RES + "fairui/";
    return UrlUtils;
}());
exports.default = UrlUtils;
},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogVo_1 = require("./LogVo");
/**
 * 日志系统
 * @author clong 2019.5.25
 */
var Log = /** @class */ (function () {
    function Log() {
    }
    Log.init = function () {
        this.logMap = new Laya.WeakObject();
        this.noshowLogTypeList = [];
    };
    /**
     * 显示日志
     * @param thisObject
     * @param text 日志文本
     * @param type 日志类型
     * @param level 日志等级
     */
    Log.log = function (thisObject, text, type, level) {
        if (type === void 0) { type = ""; }
        if (level === void 0) { level = 0; }
        if (type == "") {
            type = Log.TYPE_DEBUG;
        }
        if (type && this.noshowLogTypeList.indexOf(type) != -1) {
            return;
        }
        var logVo = new LogVo_1.default(Log.keyIndex, text, thisObject, type, level);
        console.log(logVo.toString());
        this.logMap.set(logVo.key, logVo);
        Log.keyIndex++;
    };
    /**
     * 显示错误日志
     * @param thisObject
     * @param args
     */
    Log.error = function (thisObject, text, type, level) {
        if (type === void 0) { type = ""; }
        if (level === void 0) { level = 0; }
        if (type && this.noshowLogTypeList.indexOf(type) != -1) {
            return;
        }
        var logVo = new LogVo_1.default(Log.keyIndex, text, thisObject, type, level);
        console.error(logVo.toString());
        this.logMap.set(logVo.key, logVo);
        Log.keyIndex++;
    };
    Log.logMap = null;
    Log.keyIndex = 0;
    /**普通调试日志 */
    Log.TYPE_DEBUG = "debug";
    /**加载相关日志 */
    Log.TYPE_LOAD = "load";
    /**不需要显示日志类型的列表 */
    Log.noshowLogTypeList = null;
    return Log;
}());
exports.default = Log;
},{"./LogVo":13}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 日志数据
 * @author clong 2019.5.25
 */
var LogVo = /** @class */ (function () {
    function LogVo(key, text, thisObject, type, level) {
        if (type === void 0) { type = ""; }
        if (level === void 0) { level = 0; }
        /**日志等级 */
        this.level = 0;
        this.key = key;
        this.text = text;
        this.thisObject = thisObject;
        this.type = type;
        this.level = level;
    }
    LogVo.prototype.toString = function () {
        var clsName = this.thisObject ? this.thisObject.name : "";
        return "[" + this.type + "]" + "[" + clsName + "]" + this.text + "    " + new Date().toTimeString() + "";
    };
    return LogVo;
}());
exports.default = LogVo;
},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Log_1 = require("../log/Log");
/**
 * 事件管理类
 * @author clong 2019.5.18
 */
var EventManager = /** @class */ (function () {
    function EventManager() {
    }
    EventManager.init = function () {
        this._eventDict = new Laya.WeakObject();
        this._targetMap = new Laya.WeakObject();
    };
    /**
     * 触发全局事件
     * @param type 事件类型
     * @param args 事件参数
     */
    EventManager.dispatchEvent = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var funcList = EventManager._eventDict.get(type);
        if (funcList) {
            var list = funcList.concat();
            var length_1 = list.length;
            if (length_1 > 0) {
                for (var i = 0; i < length_1; i++) {
                    try {
                        Log_1.default.log(this, "调度事件: " + type); //调度事件出错.
                        list[i][0].apply(list[i][1], args);
                    }
                    catch (e) {
                        Log_1.default.error(this, "调度事件出错." + e.toString()); //调度事件出错.
                    }
                }
            }
        }
    };
    /**
     * 添加事件方法
     * @param type 事件类型
     * @param listener 事件方法
     * @param thisObject
     * @param target 监听事件对象，为空则监听全局事件
     */
    EventManager.addEventListener = function (type, listener, thisObject, target) {
        if (target === void 0) { target = null; }
        var funcList = null;
        if (target == null) {
            funcList = EventManager._eventDict.get(type);
            if (!funcList) {
                funcList = new Array();
                EventManager._eventDict.set(type, funcList);
            }
            if (!EventManager.hasEventListener(type, listener, thisObject)) {
                funcList.push([listener, thisObject]);
            }
        }
        else {
            funcList = EventManager.getListenerList(target);
            if (!EventManager.hasListenerOf(type, listener, target)) { //如果没有监听该事件，避免重复监听
                var obj = new Object();
                obj["type"] = type;
                obj["listener"] = listener;
                obj["thisObject"] = thisObject;
                funcList = funcList || [];
                funcList.push(obj);
                // target.addEventListener(type, listener, thisObject);
                target.on(type, thisObject, listener);
            }
        }
    };
    /**
     * 移除事件监听
     * @param type 事件类型
     * @param listener 事件方法
     * @param thisObject
     * @param target 监听事件对象，为空则监听全局事件
     */
    EventManager.removeEventListener = function (type, listener, thisObject, target) {
        if (target === void 0) { target = null; }
        var funcList = null;
        if (target == null) { //全局事件
            funcList = EventManager._eventDict.get(type);
            if (funcList) {
                var length_2 = funcList.length;
                for (var i = 0; i < length_2; i++) {
                    if (funcList[i][0] == listener && funcList[i][1] == thisObject) {
                        funcList.splice(i, 1);
                        if (funcList.length == 0) {
                            EventManager._eventDict.set(type, null);
                            EventManager._eventDict.del(type);
                        }
                        break;
                    }
                }
            }
        }
        else {
            funcList = EventManager.getListenerList(target);
            var obj;
            if (funcList != null) {
                funcList.forEach(function (obj) {
                    if (obj.type == type && obj.listener == listener) {
                        funcList.splice(funcList.indexOf(obj), 1);
                        return;
                    }
                });
            }
            // target.removeEventListener(type, listener, thisObject);
            target.off(type, thisObject, listener);
        }
    };
    /**
     * 监听事件列表
     * @param target 事件对象
     **/
    EventManager.getListenerList = function (target) {
        var funcList = null;
        if (target) {
            funcList = EventManager._targetMap.get(target);
            if (funcList == null) {
                funcList = [];
                EventManager._targetMap.set(target, funcList);
            }
        }
        return funcList;
    };
    /**
     * 移除所有监听事件
     * @param target 为空则移除所有全局事件，否则移除对应的对象的所有事件
     */
    EventManager.removeAllListeners = function (target) {
        if (target === void 0) { target = null; }
        if (target == null) {
            EventManager.removeAllEventListener();
        }
        else {
            var list = EventManager.getListenerList(target);
            var obj;
            while (list && list.length > 0) {
                obj = list.shift();
                if (obj) {
                    this.removeEventListener(obj["type"], obj["listener"], obj["thisObject"]);
                }
            }
        }
    };
    /**
     * 移除所有全局事件
     */
    EventManager.removeAllEventListener = function () {
        // for (let forinlet__ in EventManager._eventDict.map) {
        // 	let type = EventManager._eventDict.map[forinlet__][0];
        // 	EventManager.removeEventListeners(type);
        // }
        for (var key in EventManager._eventDict) {
            var type = EventManager._eventDict[key];
            EventManager.removeEventListeners(type);
        }
    };
    /**
     * 移除所有对应类型事件监听
     * @param type 事件类型
     * @param
     */
    EventManager.removeEventListeners = function (type) {
        if (type === void 0) { type = null; }
        if (type != null) {
            if (EventManager._eventDict.get(type) != null) {
                EventManager._eventDict.set(type, null);
                EventManager._eventDict.del(type);
            }
        }
        else {
            EventManager.removeAllEventListener();
        }
    };
    /**
     * 是否有对应事件的监听事件
     * @param	type      	事件类型
     * @param	listener  	事件方法
     * @param 	target		监听对象
     * @param 	thisObject
     * @return
     */
    EventManager.hasListenerOf = function (type, listener, target, thisObject) {
        if (listener === void 0) { listener = null; }
        if (target === void 0) { target = null; }
        if (thisObject === void 0) { thisObject = null; }
        if (target == null) {
            var funcList = EventManager._targetMap.get(target);
            var obj;
            for (var _i = 0, funcList_1 = funcList; _i < funcList_1.length; _i++) {
                obj = funcList_1[_i];
                if (obj && obj["type"] == type && (obj["listener"] == listener || listener == null)) {
                    return true;
                }
            }
        }
        else {
            return EventManager.hasEventListener(type, listener, thisObject);
        }
        return false;
    };
    /**
     * 是否有对应的全局监听事件
     * @param	type      	事件类型
     * @param	listener  	事件方法
     * @param 	thisObject
     * @return
     */
    EventManager.hasEventListener = function (type, listener, thisObject) {
        if (listener === void 0) { listener = null; }
        if (thisObject === void 0) { thisObject = null; }
        var bool = false;
        var funcList = EventManager._eventDict.get(type);
        if (!funcList || funcList.length == 0) {
            bool = false;
        }
        else {
            if (listener == null) {
                bool = true;
            }
            else {
                funcList.forEach(function (element) {
                    if (element[0] == listener && element[1] == thisObject) {
                        bool = true;
                        return bool;
                    }
                });
            }
        }
        return bool;
    };
    EventManager._eventDict = null;
    EventManager._targetMap = null;
    return EventManager;
}());
exports.default = EventManager;
},{"../log/Log":12}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 面板注册 clong 2019.5.18
 */
var PanelRegister = /** @class */ (function () {
    function PanelRegister() {
    }
    /**
     * 注册组件类与fairygui编辑器中类对应
     * @param pkgName 包名
     * @param resName 资源名
     * @param cls	  对应包中类名
     */
    PanelRegister.registerClass = function (pkgName, resName, cls) {
        if (pkgName && !fairygui.UIPackage.getById("res/fairui/" + pkgName)) {
            fairygui.UIPackage.addPackage("res/fairui/" + pkgName);
        }
        var url = fairygui.UIPackage.getItemURL(pkgName, resName);
        fairygui.UIObjectFactory.setPackageItemExtension(url, cls);
    };
    /**
     * 创建自定义fairygui组件，必须用此方式,与以上方法对应使用,不能直接使用new cls()的方式创建一个绑定fairygui的类！
     * @param pkgName 包名
     * @param resName 资源名
     */
    PanelRegister.createGObject = function (pkgName, resName) {
        return fairygui.UIPackage.createObjectFromURL(fairygui.UIPackage.getItemURL(pkgName, resName));
    };
    return PanelRegister;
}());
exports.default = PanelRegister;
},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSprite_1 = require("../view/component/BaseSprite");
/**
 * Fairygui管理
 * @author clong 2019.5.18
 */
var FairyUIManager = /** @class */ (function () {
    function FairyUIManager() {
    }
    FairyUIManager.init = function (container) {
        if (!this.parent) {
            FairyUIManager.mainLayer = new BaseSprite_1.default();
            FairyUIManager.windowLayer = new BaseSprite_1.default();
            FairyUIManager.promptLayer = new BaseSprite_1.default();
            FairyUIManager.topLayer = new BaseSprite_1.default();
            FairyUIManager.alertLayer = new BaseSprite_1.default();
            FairyUIManager.tipLayer = new BaseSprite_1.default();
            FairyUIManager.guideLayer = new BaseSprite_1.default();
        }
        else {
            this.parent.removeChild(fairygui.GRoot.inst.displayObject);
        }
        container.addChild(fairygui.GRoot.inst.displayObject);
        this.parent = container;
        fairygui.GRoot.inst.addChild(FairyUIManager.mainLayer);
        fairygui.GRoot.inst.addChild(FairyUIManager.windowLayer);
        fairygui.GRoot.inst.addChild(FairyUIManager.promptLayer);
        fairygui.GRoot.inst.addChild(FairyUIManager.alertLayer);
        fairygui.GRoot.inst.addChild(FairyUIManager.topLayer);
        fairygui.GRoot.inst.addChild(FairyUIManager.tipLayer);
        fairygui.GRoot.inst.addChild(FairyUIManager.guideLayer);
    };
    FairyUIManager.getInstance = function () {
        return this.instance = this.instance || new FairyUIManager();
    };
    /**装载 */
    FairyUIManager.parent = null;
    /**tip层 */
    FairyUIManager.tipLayer = null;
    /**引导层 */
    FairyUIManager.guideLayer = null;
    return FairyUIManager;
}());
exports.default = FairyUIManager;
},{"../view/component/BaseSprite":18}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 基于fairygui.GButton的基类按钮
 * @author clong 2019.5.18
 */
var BaseButton = /** @class */ (function (_super) {
    __extends(BaseButton, _super);
    function BaseButton() {
        return _super.call(this) || this;
    }
    return BaseButton;
}(fairygui.GButton));
exports.default = BaseButton;
},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Global_1 = require("../../../Global");
var EventPool_1 = require("../../../com/events/EventPool");
/**
 * fairygui原件基类
 * @author clong 2019.5.18
 */
var BaseSprite = /** @class */ (function (_super) {
    __extends(BaseSprite, _super);
    function BaseSprite(comp) {
        if (comp === void 0) { comp = null; }
        var _this = _super.call(this) || this;
        /**数据 */
        _this._data = null;
        /**是否变灰 */
        _this._isGray = false;
        /**
         * 用传入的fairyui.GComponent转化为BaseSprite
         */
        _this.ower = null;
        _this._currentState = "";
        //事件缓存池
        _this.m_eventPool = null;
        //组件缓存池
        _this.m_componentDic = null;
        _this.ower = comp;
        _this.m_eventPool = EventPool_1.default.create();
        _this.m_componentDic = new Laya.WeakObject();
        return _this;
    }
    BaseSprite.prototype.constructFromXML = function (xml) {
        _super.prototype.constructFromXML.call(this, xml);
        this.initController();
    };
    /**初始化控制器 */
    BaseSprite.prototype.initController = function () {
        this._buttonController = this.getController("button");
        this._iconLoader = this.getChild("icon");
    };
    Object.defineProperty(BaseSprite.prototype, "currentState", {
        /**当前状态 */
        get: function () {
            return this._currentState;
        },
        set: function (value) {
            this._currentState = value;
            if (this._buttonController) {
                this._buttonController.selectedPage = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 是否包含全局坐标点
     * @param gx 全局X坐标
     * @param gy 全局Y坐标
     */
    BaseSprite.prototype.containsGlobalPoint = function (gx, gy) {
        var lp = this.globalToLocal(gx, gy);
        var bounds = new Laya.Rectangle(0, 0, this.width, this.height);
        return bounds.contains(lp.x, lp.y);
    };
    BaseSprite.prototype.addChild = function (child) {
        if (Global_1.default.is(child, "IComponent")) {
            this.addComponent(child);
        }
        return _super.prototype.addChild.call(this, child);
    };
    BaseSprite.prototype.addChildAt = function (child, index) {
        if (Global_1.default.is(child, "IComponent")) {
            this.addComponent(child);
        }
        return _super.prototype.addChildAt.call(this, child, index);
    };
    /**
     * 获取条目
     * @param name 组件名字
     */
    BaseSprite.prototype.getElement = function (name, container) {
        if (container === void 0) { container = null; }
        container = container || this;
        return container.getChild(name);
    };
    /**
     * 是否包含某个对象
     */
    BaseSprite.prototype.contains = function (child) {
        return this.getChildIndex(child) != -1;
    };
    /**
     * 添加Laya原生元件
     * @param child Laya原生显示对象
     */
    BaseSprite.prototype.addEgretChild = function (child) {
        this._container.addChild(child);
    };
    /**添加Laya原生元件
     * @param child Laya原生显示对象
     */
    BaseSprite.prototype.addEgretChildAt = function (child, index) {
        this._container.addChildAt(child, index);
    };
    /**
     * 移除Laya原生元件
     */
    BaseSprite.prototype.removeEgretChild = function (child) {
        if (child && this._container.contains(child)) {
            this._container.removeChild(child);
        }
        else if (child && child.parent != null) {
            child.parent.removeChild(child);
        }
    };
    Object.defineProperty(BaseSprite.prototype, "touchEnabled", {
        get: function () {
            return this._container.mouseEnabled;
        },
        set: function (value) {
            this._container.mouseEnabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseSprite.prototype, "touchChildren", {
        get: function () {
            return this._container.mouseThrough;
        },
        set: function (value) {
            this._container.mouseThrough = value;
        },
        enumerable: true,
        configurable: true
    });
    //-------------------------------------------------------
    BaseSprite.prototype.addEventListener = function (type, listener, thisObject, args) {
        if (args === void 0) { args = null; }
        this.on(type, thisObject, listener, args);
    };
    BaseSprite.prototype.removeEventListener = function (type, listener, thisObject) {
        this.off(type, thisObject, listener);
    };
    /**
     * 增加监听事件函数
     */
    BaseSprite.prototype.addAllListener = function () {
        if (this.m_eventPool != null) {
            this.m_eventPool.relistenerAll();
            for (var key in this.m_componentDic) {
                var data = this.m_componentDic.get(key);
                if (Global_1.default.is(data, "IComponent")) {
                    data.addAllListener();
                }
            }
        }
    };
    /**
     * 移除监听事件函数
     */
    BaseSprite.prototype.removeAllListener = function () {
        if (this.m_eventPool != null) {
            this.m_eventPool.removeAllListener();
            for (var key in this.m_componentDic) {
                var data = this.m_componentDic.get(key);
                if (Global_1.default.is(data, "IComponent")) {
                    data.removeAllListener();
                }
            }
        }
    };
    /**
     * 添加事件监听
     */
    BaseSprite.prototype.addGameListener = function (type, listener, thisObject, target) {
        if (this.m_eventPool != null) {
            this.m_eventPool.addListener(type, listener, target, thisObject);
        }
    };
    /**
     * 移除事件监听
     */
    BaseSprite.prototype.removeGameListener = function (type, listener, thisObject, target) {
        if (this.m_eventPool != null) {
            this.m_eventPool.removeListener(type, listener, target, thisObject);
        }
    };
    /**
     * 添加组件
     */
    BaseSprite.prototype.addComponent = function (component) {
        if (component) {
            var hashCode = component.getHashCode();
            this.m_componentDic.set(hashCode, component);
        }
        return component;
    };
    /**
     * 移除组件
     */
    BaseSprite.prototype.removeComponent = function (component) {
        if (component != null) {
            var hashCode = component.getHashCode();
            this.m_componentDic.del(hashCode);
        }
    };
    /**
     * 移除所有组件
     */
    BaseSprite.prototype.removeAllComponent = function () {
        for (var key in this.m_componentDic) {
            this.m_componentDic.del(key);
        }
        // this.m_componentDic.reset();
    };
    /**
     * 重置界面
     */
    BaseSprite.prototype.clear = function () {
        if (this.m_eventPool != null) {
            this.m_eventPool.removeAllListener();
        }
        for (var key in this.m_componentDic) {
            var data = this.m_componentDic.get(key);
            if (Global_1.default.is(data, "IComponent")) {
                data.clear();
            }
        }
    };
    BaseSprite.prototype.destroyComponent = function () {
        for (var key in this.m_componentDic) {
            var data = this.m_componentDic.get(key);
            if (Global_1.default.is(data, "IComponent")) {
                data.dispose();
            }
        }
    };
    /**
     * 获取唯一hashCode
     */
    BaseSprite.prototype.getHashCode = function () {
        return this["$_GID"] = this["$_GID"] || Laya.Utils.getGID();
    };
    Object.defineProperty(BaseSprite.prototype, "isDisposed", {
        get: function () {
            return this["_disposed"];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 释放所有资源
     */
    BaseSprite.prototype.dispose = function () {
        if (this["_disposed"]) { //fairygui 中的私有属性
            return;
        }
        _super.prototype.dispose.call(this);
        this.clear();
        if (this.m_eventPool) {
            this.m_eventPool.dispose();
        }
        this.m_componentDic = null;
        this.m_eventPool = null;
        if (this.parent != null) {
            this.parent.removeChild(this, true);
        }
    };
    return BaseSprite;
}(fairygui.GComponent));
exports.default = BaseSprite;
},{"../../../Global":2,"../../../com/events/EventPool":4}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseButton_1 = require("./BaseButton");
/**
 * 封装fairygui按钮
 * @author clong 2019.5.18
 */
var EButton = /** @class */ (function (_super) {
    __extends(EButton, _super);
    function EButton() {
        return _super.call(this) || this;
    }
    return EButton;
}(BaseButton_1.default));
exports.default = EButton;
},{"./BaseButton":17}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L015V29ybGQvbGF5YS9MYXlhQWlySURFX2JldGEvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0dhbWVDbGllbnQudHMiLCJzcmMvR2xvYmFsLnRzIiwic3JjL01haW4udHMiLCJzcmMvY29tL2V2ZW50cy9FdmVudFBvb2wudHMiLCJzcmMvY29tL2xvYWQvTG9hZFNvdXJjZU1hbmFnZXIudHMiLCJzcmMvY29tL2xvYWQvZXZlbnQvTG9hZGVyRXZlbnQudHMiLCJzcmMvY29tL2xvYWQvcmVzb3VyY2UvR3JvdXBSZXNvdXJjZS50cyIsInNyYy9jb20vbG9hZC9yZXNvdXJjZS9SZXNvdXJjZS50cyIsInNyYy9jb20vbG9hZC9yZXNvdXJjZS9UeHRSZXNvdXJjZS50cyIsInNyYy9jb20vbG9hZC91dGlscy9Mb2FkVXRpbHMudHMiLCJzcmMvY29tL2xvYWQvdXRpbHMvVXJsVXRpbHMudHMiLCJzcmMvY29tL2xvZy9Mb2cudHMiLCJzcmMvY29tL2xvZy9Mb2dWby50cyIsInNyYy9jb20vbWFuYWdlci9FdmVudE1hbmFnZXIudHMiLCJzcmMvZmFpcnVpL1BhbmVsUmVnaXN0ZXIudHMiLCJzcmMvZmFpcnVpL21hbmFnZXIvRmFpcnlVSU1hbmFnZXIudHMiLCJzcmMvZmFpcnVpL3ZpZXcvY29tcG9uZW50L0Jhc2VCdXR0b24udHMiLCJzcmMvZmFpcnVpL3ZpZXcvY29tcG9uZW50L0Jhc2VTcHJpdGUudHMiLCJzcmMvZmFpcnVpL3ZpZXcvY29tcG9uZW50L0VCdXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVkEsa0VBQTZEO0FBQzdELHdEQUFtRDtBQUNuRCwyREFBc0Q7QUFDdEQsa0VBQWdGO0FBQ2hGLHNEQUFpRDtBQUVqRDs7O0dBR0c7QUFDSDtJQUF3Qyw4QkFBVztJQUUvQztRQUFB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SSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEUsQ0FBQztJQUVELHNCQUFXLGtDQUFVO2FBQXJCO1lBQ0ksT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0IsQ0FBQzs7O09BQUE7SUFFRDs7T0FFRztJQUNJLDRCQUFPLEdBQWQ7UUFFSSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBQyxFQUFFLGlCQUFpQjtZQUNyQyxPQUFPO1NBQ1Y7UUFFRCxpQkFBTSxPQUFPLFdBQUUsQ0FBQztRQUVoQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFYixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUM5QjtRQUNELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBRXhCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUU7WUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3ZDO0lBQ0wsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0FwVEEsQUFvVEMsQ0FwVHVDLFFBQVEsQ0FBQyxVQUFVLEdBb1QxRDs7Ozs7QUMzVEQsMkNBQXNDO0FBQ3RDOzs7R0FHRztBQUNIO0lBQXFDLDJCQUFVO0lBRTNDO2VBQ0ksaUJBQU87SUFDWCxDQUFDO0lBQ0wsY0FBQztBQUFELENBTEEsQUFLQyxDQUxvQyxvQkFBVSxHQUs5QyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgRmFpcnlVSU1hbmFnZXIgZnJvbSBcIi4vZmFpcnVpL21hbmFnZXIvRmFpcnlVSU1hbmFnZXJcIjtcclxuaW1wb3J0IFBhbmVsUmVnaXN0ZXIgZnJvbSBcIi4vZmFpcnVpL1BhbmVsUmVnaXN0ZXJcIjtcclxuaW1wb3J0IEVCdXR0b24gZnJvbSBcIi4vZmFpcnVpL3ZpZXcvY29tcG9uZW50L0VCdXR0b25cIjtcclxuaW1wb3J0IExvYWRTb3VyY2VNYW5hZ2VyLCB7IExvYWRlck1hbmFnZXIgfSBmcm9tIFwiLi9jb20vbG9hZC9Mb2FkU291cmNlTWFuYWdlclwiO1xyXG5pbXBvcnQgVXJsVXRpbHMgZnJvbSBcIi4vY29tL2xvYWQvdXRpbHMvVXJsVXRpbHNcIjtcclxuXHJcbi8qKlxyXG4gKiDmuLjmiI/kuLvlrqLmiLfnq69cclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDbGllbnQgZXh0ZW5kcyBMYXlhLlNwcml0ZSB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBzdXBlcigpOyBcclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXQoKTp2b2lke1xyXG5cclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKGZhaXJ5Z3VpLkdSb290Lmluc3QuZGlzcGxheU9iamVjdCk7XHJcblxyXG4gICAgICAgIC8vIExheWEubG9hZGVyLmxvYWQoW1xyXG5cdFx0Ly8gXHR7IHVybDogXCJyZXMvZmFpcnVpL2NvbW1vbl9hdGxhczAucG5nXCIsIHR5cGU6IExheWEuTG9hZGVyLklNQUdFIH0sXHJcblx0XHQvLyBcdHsgdXJsOiBcInJlcy9mYWlydWkvY29tbW9uLm1hcFwiLCB0eXBlOiBMYXlhLkxvYWRlci5CVUZGRVIgfVxyXG4gICAgICAgIC8vICAgICBdLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Mb2FkZWQpKTtcclxuICAgICAgICBsZXQgdXJsczpBcnJheTxzdHJpbmc+ID0gVXJsVXRpbHMuZ2V0RmFpcnlHcm91cCggXCJjb21tb25cIiApO1xyXG4gICAgICAgIExvYWRTb3VyY2VNYW5hZ2VyLmxvYWRHcm91cCggXCJjb21tb25cIiAsIHVybHMgLCBMYXlhLkhhbmRsZXIuY3JlYXRlKCB0aGlzICwgdGhpcy5vbkxvYWRlZCApICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkxvYWRlZCgpOnZvaWR7XHJcblxyXG5cdFx0Ly8gZmFpcnlndWkuVUlQYWNrYWdlLmFkZFBhY2thZ2UoXCJyZXMvZmFpcnVpL2NvbW1vblwiKTtcdFx0XHJcbiAgICAgICAgLy8gZmFpcnlndWkuVUlDb25maWcuZGVmYXVsdEZvbnQgPSBcIk1pY3Jvc29mdCBZYUhlaVwiO1xyXG4gICAgICAgIC8vIGZhaXJ5Z3VpLlVJQ29uZmlnLnZlcnRpY2FsU2Nyb2xsQmFyID0gXCJ1aTovL0Jhc2ljL1Njcm9sbEJhcl9WVFwiO1xyXG4gICAgICAgIC8vIGZhaXJ5Z3VpLlVJQ29uZmlnLmhvcml6b250YWxTY3JvbGxCYXIgPSBcInVpOi8vQmFzaWMvU2Nyb2xsQmFyX0haXCI7XHJcbiAgICAgICAgLy8gZmFpcnlndWkuVUlDb25maWcucG9wdXBNZW51ID0gXCJ1aTovL0Jhc2ljL1BvcHVwTWVudVwiO1xyXG5cclxuICAgICAgICBcclxuICAgICAgICBQYW5lbFJlZ2lzdGVyLnJlZ2lzdGVyQ2xhc3MoXCJjb21tb25cIiwgXCJFQnV0dG9uXCIsIEVCdXR0b24gKTtcclxuICAgICAgICBcclxuICAgICAgICBGYWlyeVVJTWFuYWdlci5pbml0KCBMYXlhLnN0YWdlICk7XHJcblx0fVxyXG59IiwiaW1wb3J0IEdhbWVDbGllbnQgZnJvbSBcIi4vR2FtZUNsaWVudFwiO1xyXG5pbXBvcnQgTG9hZFNvdXJjZU1hbmFnZXIgZnJvbSBcIi4vY29tL2xvYWQvTG9hZFNvdXJjZU1hbmFnZXJcIjtcclxuaW1wb3J0IEV2ZW50TWFuYWdlciBmcm9tIFwiLi9jb20vbWFuYWdlci9FdmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IExvZyBmcm9tIFwiLi9jb20vbG9nL0xvZ1wiO1xyXG5cclxuLyoqXHJcbiAqIOWFqOWxgOWPguaVsFxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2xvYmFsIHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHdpZHRoOm51bWJlcj02NDA7XHJcbiAgICBwdWJsaWMgc3RhdGljIGhlaWdodDpudW1iZXI9MTEzNjtcclxuICAgIHB1YmxpYyBzdGF0aWMgc2NhbGVNb2RlOnN0cmluZz1cImZpeGVkd2lkdGhcIjtcclxuICAgIHB1YmxpYyBzdGF0aWMgc2NyZWVuTW9kZTpzdHJpbmc9XCJub25lXCI7Ly9ob3Jpem9udGFsXHJcbiAgICBwdWJsaWMgc3RhdGljIGFsaWduVjpzdHJpbmc9XCJ0b3BcIjtcclxuICAgIHB1YmxpYyBzdGF0aWMgYWxpZ25IOnN0cmluZz1cImxlZnRcIjtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBwdWJsaWMgc3RhdGljIHN0YXQ6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcGh5c2ljc0RlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBwdWJsaWMgc3RhdGljIGV4cG9ydFNjZW5lVG9Kc29uOmJvb2xlYW49dHJ1ZTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7IFxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWFqOWxgOWIneWni+WMllxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXQoKTp2b2lke1xyXG5cclxuICAgICAgICBMb2cuaW5pdCgpO1xyXG4gICAgICAgIEV2ZW50TWFuYWdlci5pbml0KCk7XHJcbiAgICAgICAgTG9hZFNvdXJjZU1hbmFnZXIuaW5pdCgpO1xyXG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoIG5ldyBHYW1lQ2xpZW50KCkgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuXHQgKiDliKTmlq3lr7nosaHmmK/lkKbkuLrlr7nlupTnsbvmiJbmjqXlj6NcclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIGlzKCB0YXJnZXQ6YW55ICwgY2xzOmFueSApOmJvb2xlYW57XHJcblxyXG4gICAgICAgIGlmKCAhdGFyZ2V0ICl7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblx0XHRyZXR1cm4gTGF5YVtcIl9fdHlwZW9mXCJdKCB0YXJnZXQgLCBjbHMgKTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgR2xvYmFsIGZyb20gXCIuL0dsb2JhbFwiO1xyXG5jbGFzcyBNYWluIHtcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblxyXG5cdFx0TGF5YS5pbml0KDExMzYsIDY0MCwgTGF5YS5XZWJHTCk7XHJcblx0XHQvLyBMYXlhLmluaXQoIEdsb2JhbC53aWR0aCAsIEdsb2JhbC5oZWlnaHQgLCBMYXlhLldlYkdMKTtcclxuICAgICAgICBsYXlhLnV0aWxzLlN0YXQuc2hvdygwLCAwKTtcclxuICAgICAgICAvL+iuvue9rumAgumFjeaooeW8j1xyXG4gICAgICAgIExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gXCJzaG93YWxsXCI7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5hbGlnbkggPSBcImxlZnRcIjtcclxuICAgICAgICBMYXlhLnN0YWdlLmFsaWduViA9IFwidG9wXCI7XHJcbiAgICAgICAgLy/orr7nva7mqKrnq5blsY9cclxuICAgICAgICBMYXlhLnN0YWdlLnNjcmVlbk1vZGUgPSBHbG9iYWwuc2NyZWVuTW9kZTsvLyBcImhvcml6b250YWxcIjtcclxuXHJcbiAgICAgICAgLy/moLnmja5JREXorr7nva7liJ3lp4vljJblvJXmk45cdFx0XHJcblx0XHRpZiAod2luZG93W1wiTGF5YTNEXCJdKXtcclxuICAgICAgICAgICAgTGF5YTNELmluaXQoR2xvYmFsLndpZHRoLCBHbG9iYWwuaGVpZ2h0KTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgTGF5YS5pbml0KEdsb2JhbC53aWR0aCwgR2xvYmFsLmhlaWdodCwgTGF5YVtcIldlYkdMXCJdKTtcclxuICAgICAgICB9IFxyXG5cdFx0TGF5YVtcIlBoeXNpY3NcIl0gJiYgTGF5YVtcIlBoeXNpY3NcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhW1wiRGVidWdQYW5lbFwiXSAmJiBMYXlhW1wiRGVidWdQYW5lbFwiXS5lbmFibGUoKTtcclxuXHRcdExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gR2xvYmFsLnNjYWxlTW9kZTtcclxuXHRcdExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IEdsb2JhbC5zY3JlZW5Nb2RlO1xyXG5cdFx0Ly/lhbzlrrnlvq7kv6HkuI3mlK/mjIHliqDovb1zY2VuZeWQjue8gOWcuuaZr1xyXG4gICAgICAgIC8vTGF5YS5VUkwuZXhwb3J0U2NlbmVUb0pzb24gPSBHbG9iYWwuZXhwb3J0U2NlbmVUb0pzb247XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXHJcblx0XHRpZiAoR2xvYmFsLmRlYnVnIHx8IExheWEuVXRpbHMuZ2V0UXVlcnlTdHJpbmcoXCJkZWJ1Z1wiKSA9PSBcInRydWVcIikgTGF5YS5lbmFibGVEZWJ1Z1BhbmVsKCk7XHJcblx0XHRpZiAoR2xvYmFsLnBoeXNpY3NEZWJ1ZyAmJiBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXSkgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0uZW5hYmxlKCk7XHJcblx0XHRpZiAoR2xvYmFsLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XHJcblx0XHRMYXlhLmFsZXJ0R2xvYmFsRXJyb3IgPSB0cnVlO1xyXG5cclxuXHRcdC8v5r+A5rS76LWE5rqQ54mI5pys5o6n5Yi277yMdmVyc2lvbi5qc29u55SxSURF5Y+R5biD5Yqf6IO96Ieq5Yqo55Sf5oiQ77yM5aaC5p6c5rKh5pyJ5Lmf5LiN5b2x5ZON5ZCO57ut5rWB56iLXHJcblx0XHRMYXlhLlJlc291cmNlVmVyc2lvbi5lbmFibGUoXCJ2ZXJzaW9uLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uVmVyc2lvbkxvYWRlZCksIExheWEuUmVzb3VyY2VWZXJzaW9uLkZJTEVOQU1FX1ZFUlNJT04pO1xyXG5cdH1cclxuXHJcblx0b25WZXJzaW9uTG9hZGVkKCk6IHZvaWQge1xyXG5cdFx0Ly/mv4DmtLvlpKflsI/lm77mmKDlsITvvIzliqDovb3lsI/lm77nmoTml7blgJnvvIzlpoLmnpzlj5HnjrDlsI/lm77lnKjlpKflm77lkIjpm4bph4zpnaLvvIzliJnkvJjlhYjliqDovb3lpKflm77lkIjpm4bvvIzogIzkuI3mmK/lsI/lm75cclxuXHRcdC8vTGF5YS5BdGxhc0luZm9NYW5hZ2VyLmVuYWJsZShcImZpbGVjb25maWcuanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Db25maWdMb2FkZWQpKTtcclxuXHJcblx0XHRcclxuXHRcdEdsb2JhbC5pbml0KClcclxuXHR9XHJcblxyXG5cdG9uQ29uZmlnTG9hZGVkKCk6IHZvaWQge1xyXG5cdFx0Ly/liqDovb1JREXmjIflrprnmoTlnLrmma9cclxuXHRcdC8vR2FtZUNvbmZpZy5zdGFydFNjZW5lICYmIExheWEuU2NlbmUub3BlbihHYW1lQ29uZmlnLnN0YXJ0U2NlbmUpO1xyXG5cdH1cclxufVxyXG4vL+a/gOa0u+WQr+WKqOexu1xyXG5uZXcgTWFpbigpO1xyXG4iLCJpbXBvcnQgRXZlbnRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2VyL0V2ZW50TWFuYWdlclwiO1xuXG4vKipcbiAqIOS6i+S7tuaxoFxuICogQGF1dGhvciBjbG9uZyAyMDE5LjQuMjBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRQb29sIHtcblxuXHRwcml2YXRlIHN0YXRpYyBwb29sOkFycmF5PEV2ZW50UG9vbD4gPSBbXTtcblxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKCk6RXZlbnRQb29se1xuXG4gICAgICAgIGxldCBvYmo6RXZlbnRQb29sID0gRXZlbnRQb29sLnBvb2wuc2hpZnQoKTtcbiAgICAgICAgaWYoIG9iaiA9PSBudWxsICl7XG4gICAgICAgICAgICBvYmogPSBuZXcgRXZlbnRQb29sKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHJlY292ZXIoIG9iajpFdmVudFBvb2wgKTp2b2lke1xuXG4gICAgICAgIGlmKCBvYmogIT0gbnVsbCAmJiBFdmVudFBvb2wucG9vbC5pbmRleE9mKCBvYmogKSA9PSAtMSApe1xuICAgICAgICAgICAgRXZlbnRQb29sLnBvb2wucHVzaCggb2JqICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwcml2YXRlIF9ldmVudE9iakxpc3Q6QXJyYXk8RXZlbnRPYmo+ID0gbnVsbDtcblxuXHRwdWJsaWMgY29uc3RydWN0b3IoKSB7XG5cblx0XHR0aGlzLl9ldmVudE9iakxpc3QgPSBbXTtcblx0fVxuXG5cdC8qKlxuXHQgKiDmt7vliqDkuovku7bnm5HlkKxcblx0ICogQHBhcmFtIHR5cGUgXHRcdOS6i+S7tuexu+Wei1xuXHQgKiBAcGFyYW0gbGlzdGVuZXIgXHTkuovku7bmlrnms5Vcblx0ICogQHBhcmFtIHRhcmdldFx05LqL5Lu25a+56LGhXG5cdCAqIEBwYXJhbSB0aGlzT2JqXG5cdCAqL1xuXHRwdWJsaWMgYWRkTGlzdGVuZXIoIHR5cGU6c3RyaW5nICwgbGlzdGVuZXI6RnVuY3Rpb24gLCB0YXJnZXQ6TGF5YS5FdmVudERpc3BhdGNoZXIgPSBudWxsICwgdGhpc09iajphbnkgKTp2b2lke1xuXG5cdFx0aWYoICF0aGlzLmhhc0V2ZW50TGlzdGVuZXIodHlwZSxsaXN0ZW5lcix0YXJnZXQsdGhpc09iaikgKXtcblx0XHRcdGxldCBvYmo6RXZlbnRPYmogPSBFdmVudE9iai5jcmVhdGUoIHR5cGUgLCBsaXN0ZW5lciAsIHRhcmdldCAsIHRoaXNPYmogKTtcblx0XHRcdHRoaXMuX2V2ZW50T2JqTGlzdC5wdXNoKCBvYmogKTtcblx0XHRcdEV2ZW50TWFuYWdlci5hZGRFdmVudExpc3RlbmVyKCB0eXBlICwgbGlzdGVuZXIgLCB0aGlzT2JqICwgdGFyZ2V0ICk7XHRcdFx0XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIOenu+mZpOS6i+S7tuebkeWQrFxuXHQgKiBAcGFyYW0gdHlwZSBcdFx05LqL5Lu257G75Z6LXG5cdCAqIEBwYXJhbSBsaXN0ZW5lciBcdOS6i+S7tuaWueazlVxuXHQgKiBAcGFyYW0gdGFyZ2V0XHTkuovku7blr7nosaFcblx0ICogQHBhcmFtIHRoaXNPYmpcdFxuXHQgKi9cblx0cHVibGljIHJlbW92ZUxpc3RlbmVyKCB0eXBlOnN0cmluZyAsIGxpc3RlbmVyOkZ1bmN0aW9uICwgdGFyZ2V0OkxheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCAsIHRoaXNPYmo6YW55ICk6dm9pZHtcblxuXHRcdGxldCBvYmo6RXZlbnRPYmogPSBudWxsO1xuXHRcdGZvciggbGV0IGk9MDtpPHRoaXMuX2V2ZW50T2JqTGlzdC5sZW5ndGg7aSsrICl7XG5cdFx0XHRvYmogPSB0aGlzLl9ldmVudE9iakxpc3RbaV07XG5cdFx0XHRpZiggb2JqICYmIG9iai50eXBlID09IHR5cGUgJiYgb2JqLmxpc3RlbmVyID09IGxpc3RlbmVyICYmIG9iai50aGlzT2JqID09IHRoaXNPYmogKXtcblx0XHRcdFx0dGhpcy5fZXZlbnRPYmpMaXN0LnNwbGljZShpLDEpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0RXZlbnRNYW5hZ2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGUgLCBsaXN0ZW5lciAsIHRoaXNPYmogLCB0YXJnZXQgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiDnp7vpmaTmsaDph4zmiYDmnInkuovku7bnm5HlkKws5L+d5oyB55qE5a+56LGh5LiN5LuO5YiX6KGo6YeM56e76ZmkXG5cdCAqL1xuXHRwdWJsaWMgcmVtb3ZlQWxsTGlzdGVuZXIoKTp2b2lke1xuXG5cdFx0bGV0IG9iajpFdmVudE9iaiA9IG51bGw7XG5cdFx0Zm9yKCBsZXQgaT0wO2k8dGhpcy5fZXZlbnRPYmpMaXN0Lmxlbmd0aDtpKysgKXtcblx0XHRcdG9iaiA9IHRoaXMuX2V2ZW50T2JqTGlzdFtpXTtcblx0XHRcdGlmKCBvYmogKXtcblx0XHRcdFx0RXZlbnRNYW5hZ2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoIG9iai50eXBlICwgb2JqLmxpc3RlbmVyICwgb2JqLnRoaXNPYmogLCBvYmoudGFyZ2V0ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIOmHjeaWsOebkeWQrOaJgOacieS6i+S7tlxuXHQgKi9cblx0cHVibGljIHJlbGlzdGVuZXJBbGwoKTp2b2lke1xuXG5cdFx0bGV0IG9iajpFdmVudE9iaiA9IG51bGw7XG5cdFx0Zm9yKCBsZXQgaT0wO2k8dGhpcy5fZXZlbnRPYmpMaXN0Lmxlbmd0aDtpKysgKXtcblx0XHRcdG9iaiA9IHRoaXMuX2V2ZW50T2JqTGlzdFtpXTtcblx0XHRcdGlmKCBvYmogKXtcblx0XHRcdFx0RXZlbnRNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoIG9iai50eXBlICwgb2JqLmxpc3RlbmVyICwgb2JqLnRoaXNPYmogLCBvYmoudGFyZ2V0ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIOaYr+WQpuacieafkOS4quebkeWQrFxuXHQgKiBAcGFyYW0gdHlwZSBcdFx05LqL5Lu257G75Z6LXG5cdCAqIEBwYXJhbSBsaXN0ZW5lciBcdOS6i+S7tuaWueazlVxuXHQgKiBAcGFyYW0gdGFyZ2V0XHTkuovku7blr7nosaFcblx0ICogQHBhcmFtIHRoaXNPYmpcdFxuXHQgKi9cblx0cHVibGljIGhhc0V2ZW50TGlzdGVuZXIoIHR5cGU6c3RyaW5nICwgbGlzdGVuZXI6RnVuY3Rpb24gLCB0YXJnZXQ6TGF5YS5FdmVudERpc3BhdGNoZXIgPSBudWxsICwgdGhpc09iajphbnkgKTpib29sZWFue1xuXG5cdFx0bGV0IG9iajpFdmVudE9iaiA9IG51bGw7XG5cdFx0Zm9yKCBvYmogb2YgdGhpcy5fZXZlbnRPYmpMaXN0ICl7XG5cdFx0XHRpZiggb2JqICYmIG9iai50eXBlID09IHR5cGUgJiYgb2JqLmxpc3RlbmVyID09IGxpc3RlbmVyICl7XG5cdFx0XHRcdGlmKCB0YXJnZXQgPT0gbnVsbCApe1xuXHRcdFx0XHRcdHJldHVybiBvYmoudGhpc09iaiA9PSB0aGlzT2JqO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRyZXR1cm4gb2JqLnRhcmdldCA9PSB0YXJnZXQgJiYgb2JqLnRoaXNPYmogPT0gdGhpc09iajtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICog6YeK5pS+6LWE5rqQXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpOnZvaWR7XG5cblx0XHR3aGlsZSggdGhpcy5fZXZlbnRPYmpMaXN0ICYmIHRoaXMuX2V2ZW50T2JqTGlzdC5sZW5ndGggPiAwICl7XG5cdFx0XHRsZXQgb2JqOkV2ZW50T2JqID0gdGhpcy5fZXZlbnRPYmpMaXN0LnNoaWZ0KCk7XG5cdFx0XHRpZiggb2JqICl7XG5cdFx0XHRcdEV2ZW50TWFuYWdlci5yZW1vdmVFdmVudExpc3RlbmVyKCBvYmoudHlwZSAsIG9iai5saXN0ZW5lciAsIG9iai50aGlzT2JqICwgb2JqLnRhcmdldCApO1xuXHRcdFx0XHRvYmoucmVjb3ZlcigpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLl9ldmVudE9iakxpc3QgPSBbXTtcblxuXHRcdEV2ZW50UG9vbC5yZWNvdmVyKCB0aGlzICk7XG5cdH1cbn0iLCJpbXBvcnQgUmVzb3VyY2UgZnJvbSBcIi4vcmVzb3VyY2UvUmVzb3VyY2VcIjtcclxuaW1wb3J0IExvYWRlckV2ZW50IGZyb20gXCIuL2V2ZW50L0xvYWRlckV2ZW50XCI7XHJcbmltcG9ydCBHcm91cFJlc291cmNlIGZyb20gXCIuL3Jlc291cmNlL0dyb3VwUmVzb3VyY2VcIjtcclxuaW1wb3J0IExvYWRVdGlscyBmcm9tIFwiLi91dGlscy9Mb2FkVXRpbHNcIjtcclxuaW1wb3J0IFR4dFJlc291cmNlIGZyb20gXCIuL3Jlc291cmNlL1R4dFJlc291cmNlXCI7XHJcbmltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXIvRXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCBMb2cgZnJvbSBcIi4uL2xvZy9Mb2dcIjtcclxuXHJcbi8qKlxyXG4gKiDliqDovb3otYTmupDnrqHnkIZcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRTb3VyY2VNYW5hZ2VyIHtcclxuXHJcbiAgICAvKirliqDovb3otYTmupDnrqHnkIYgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGxvYWRNYXA6TGF5YS5XZWFrT2JqZWN0ID0gbnVsbDtcclxuICAgIC8qKui1hOa6kOe7hOWtl+WFuCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ3JvdXBNYXA6TGF5YS5XZWFrT2JqZWN0ID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMllxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXQoKTp2b2lke1xyXG5cclxuICAgICAgICBMb2FkU291cmNlTWFuYWdlci5sb2FkTWFwID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG4gICAgICAgIExvYWRTb3VyY2VNYW5hZ2VyLmdyb3VwTWFwID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG5cclxuICAgICAgICBFdmVudE1hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lciggTG9hZGVyRXZlbnQuTE9BRF9TSU5HTEVfQ09NUExFVEUgLCB0aGlzLmxvYWRTaW5nbGVDb21wbGV0ZSAsIHRoaXMgKTtcclxuICAgICAgICBFdmVudE1hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lciggTG9hZGVyRXZlbnQuTE9BRF9HUk9VUF9DT01QTEVURSAsIHRoaXMubG9hZEdyb3VwQ29tcGxldGUgLCB0aGlzICk7XHJcblxyXG4gICAgICAgIExheWEudGltZXIubG9vcCggMTAwMDAgLCB0aGlzICwgdGhpcy5jaGVja1JlcyApOy8v5qOA5rWL6LWE5rqQ5piv5ZCm5Zue5pS2LOaaguWumjEw56eS6ZKf5Zue5pS25LiA5qyhXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3ljZXkuKrotYTmupDlrozmiJBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9hZFNpbmdsZUNvbXBsZXRlKCBzb3VyY2U6c3RyaW5nfFJlc291cmNlICk6dm9pZHtcclxuXHJcbiAgICAgICAgbGV0IHJlczpSZXNvdXJjZSA9IHR5cGVvZiBzb3VyY2UgPT09IFwic3RyaW5nXCIgPyB0aGlzLmdldFJlcyggc291cmNlICkgOiBzb3VyY2U7XHJcbiAgICAgICAgaWYoIHJlcyAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIGxldCBncm91cFJlczpHcm91cFJlc291cmNlID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yKCBsZXQga2V5IGluIHRoaXMuZ3JvdXBNYXAgKXtcclxuICAgICAgICAgICAgICAgIGdyb3VwUmVzID0gdGhpcy5ncm91cE1hcC5nZXQoIGtleSApO1xyXG4gICAgICAgICAgICAgICAgaWYoIGdyb3VwUmVzICYmIGdyb3VwUmVzLmhhc1VybCggcmVzLnVybCApICYmIGdyb3VwUmVzLmlzTG9hZGVkKCkgKXtcclxuICAgICAgICAgICAgICAgICAgICBFdmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudCggTG9hZGVyRXZlbnQuTE9BRF9HUk9VUF9DT01QTEVURSAsIGdyb3VwUmVzICk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3nu4TotYTmupDlrozmiJBcclxuICAgICAqIEBwYXJhbSBncm91cE5hbWUgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGxvYWRHcm91cENvbXBsZXRlKCBzb3VyY2U6c3RyaW5nIHwgR3JvdXBSZXNvdXJjZSApOnZvaWR7XHJcblxyXG4gICAgICAgIGxldCBncm91cFJlczpHcm91cFJlc291cmNlID0gdHlwZW9mIHNvdXJjZSA9PT0gXCJzdHJpbmdcIiA/ICA8R3JvdXBSZXNvdXJjZT50aGlzLmdldFJlcyggc291cmNlICkgOiBzb3VyY2U7XHJcbiAgICAgICAgaWYoIGdyb3VwUmVzICE9IG51bGwgKXtcclxuICAgICAgICAgICAgaWYoIGdyb3VwUmVzLmNvbXBsZXRlICE9IG51bGwgKXtcclxuICAgICAgICAgICAgICAgIGdyb3VwUmVzLmNvbXBsZXRlLnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L2957uE6LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gZ3JvdXBOYW1lIOi1hOa6kOe7hOWQjeWtlyzluLjop4TkuI3luKbnrKblj7fnmoTlrZfnrKbkuLLvvIzlrZfmr40r5pWw57uEXHJcbiAgICAgKiBAcGFyYW0gdXJsbGlzdCDotYTmupDlnLDlnYDliJfooahcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkR3JvdXAoIGdyb3VwTmFtZTpzdHJpbmcgPSBcIlwiICwgdXJsbGlzdDpBcnJheTxzdHJpbmc+ICwgY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbCAsIHByb2dyZXNzOkxheWEuSGFuZGxlciA9IG51bGwgKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggIWdyb3VwTmFtZSApIHJldHVybjtcclxuICAgICAgICBsZXQgZ3JvdXBsaXN0OkFycmF5PFJlc291cmNlPiA9IHRoaXMubG9hZE1hcC5nZXQoIGdyb3VwTmFtZSApO1xyXG4gICAgICAgIGlmKCBncm91cGxpc3QgPT0gbnVsbCApe1xyXG4gICAgICAgICAgICBncm91cGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgaWYoIHVybGxpc3QgIT0gbnVsbCAmJiB1cmxsaXN0Lmxlbmd0aCA+IDAgKXtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8dXJsbGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdXJsOnN0cmluZyA9IHVybGxpc3RbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlczpSZXNvdXJjZSA9IHRoaXMubG9hZE1hcC5nZXQoIHVybCApIHx8IExvYWRTb3VyY2VNYW5hZ2VyLmNyZWF0ZSggdXJsICk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBsaXN0LnB1c2goIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZE1hcC5zZXQoIHJlcy51cmwgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGdyb3VwUmVzOkdyb3VwUmVzb3VyY2UgPSBMb2FkU291cmNlTWFuYWdlci5jcmVhdGUoIGdyb3VwbGlzdCAsIGNvbXBsZXRlICwgcHJvZ3Jlc3MgICk7XHJcbiAgICAgICAgICAgIGdyb3VwUmVzLmxvYWQoKTtcclxuICAgICAgICAgICAgdGhpcy5ncm91cE1hcC5zZXQoIGdyb3VwTmFtZSAsIGdyb3VwUmVzICk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIExheWEuTG9nLnByaW50KCBcIuW3sue7j+acieivpei1hOa6kOe7hOS6hu+8gVwiICk7XHJcbiAgICAgICAgfVxyXG4gICAgfXB1YmxpYyBzdGF0aWMgY3JlYXRlKCB1cmw6YW55ICwgY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbCAsIHByb2dyZXNzOkxheWEuSGFuZGxlciA9IG51bGwgLCBlcnJvcjpMYXlhLkhhbmRsZXIgPSBudWxsICk6YW55e1xyXG5cclxuICAgICAgICBsZXQgcmVzOlJlc291cmNlID0gbnVsbDtcclxuICAgICAgICBsZXQgZXh0OnN0cmluZyA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBMb2FkVXRpbHMuZ2V0RmlsZUV4dCggdXJsICkgOiBcIlwiO1xyXG4gICAgICAgIGlmKCB1cmwgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgICAgIHJlcyA9IExheWEuUG9vbC5nZXRJdGVtQnlDbGFzcyggR3JvdXBSZXNvdXJjZS5LRVkgLCBHcm91cFJlc291cmNlICk7XHJcbiAgICAgICAgICAgIHJlcy50eXBlID0gUmVzb3VyY2UuVFlQRV9HUk9VUDtcclxuICAgICAgICB9ZWxzZSBpZiggZXh0ID09IFwicG5nXCIgfHwgZXh0ID09IFwianBnXCIgfHwgZXh0ID09IFwiYm1wXCIgKXtcclxuICAgICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKCBSZXNvdXJjZS5LRVkgLCBSZXNvdXJjZSApO1xyXG4gICAgICAgICAgICByZXMudHlwZSA9IExheWEuTG9hZGVyLklNQUdFO1xyXG4gICAgICAgIH1lbHNlIGlmKCBleHQgPT0gXCJ0eHRcIiB8fCBleHQgPT0gXCJqc29uXCIgKXtcclxuICAgICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKCBUeHRSZXNvdXJjZS5LRVkgLCBUeHRSZXNvdXJjZSApO1xyXG4gICAgICAgICAgICByZXMudHlwZSA9IExheWEuTG9hZGVyLlRFWFQ7XHJcbiAgICAgICAgfWVsc2V7Ly/kuozov5vliLZcclxuICAgICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKCBSZXNvdXJjZS5LRVkgLCBSZXNvdXJjZSApO1xyXG4gICAgICAgICAgICByZXMudHlwZSA9IExheWEuTG9hZGVyLkJVRkZFUjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYocmVzKXtcclxuICAgICAgICAgICAgcmVzLmNyZWF0ZSggdXJsICwgY29tcGxldGUgLCBwcm9ncmVzcyAsIGVycm9yICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWKoOi9vei1hOa6kFxyXG4gICAgICogQHBhcmFtIHNvdXJjZSDotYTmupBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKCBzb3VyY2U6c3RyaW5nfFJlc291cmNlICwgY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbCAsIGVycm9yOkxheWEuSGFuZGxlciA9IG51bGwgICk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoICFzb3VyY2UgKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVzOlJlc291cmNlID0gbnVsbDtcclxuICAgICAgICBpZiggdHlwZW9mIHNvdXJjZSA9PT0gXCJzdHJpbmdcIiApe1xyXG4gICAgICAgICAgICByZXMgPSB0aGlzLmxvYWRNYXAuZ2V0KCBzb3VyY2UgKTtcclxuICAgICAgICAgICAgaWYoIHJlcyAhPSBudWxsICl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzID0gTG9hZFNvdXJjZU1hbmFnZXIuY3JlYXRlKCBzb3VyY2UgLCBjb21wbGV0ZSAsIGVycm9yICk7XHJcbiAgICAgICAgfWVsc2UgaWYoIHNvdXJjZSBpbnN0YW5jZW9mIFJlc291cmNlICl7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJlcyA9IHNvdXJjZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIHJlcyA9PSBudWxsICl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHJlcy5nZXRSZXMoZmFsc2UpICE9IG51bGwgKXsvL+i1hOa6kOW3suWKoOi9veWujOaIkFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcy5sb2FkKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkTWFwLnNldCggcmVzLnVybCAsIHJlcyApO1xyXG4gICAgICAgIGxldCBpc0JyZWFrOmJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBmb3IoIGxldCBrZXkgaW4gdGhpcy5sb2FkTWFwICl7XHJcbiAgICAgICAgICAgIHJlcyA9IHRoaXMubG9hZE1hcC5nZXQoIGtleSApO1xyXG4gICAgICAgICAgICBpZiggcmVzICl7XHJcbiAgICAgICAgICAgICAgICBpc0JyZWFrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCBpc0JyZWFrICl7XHJcbiAgICAgICAgICAgIExheWEudGltZXIubG9vcCggMTAwMCAsIHRoaXMgLCB0aGlzLmNoZWNrUmVzICk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIExheWEudGltZXIuY2xlYXIoIHRoaXMgLCB0aGlzLmNoZWNrUmVzICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qOA5rWL6LWE5rqQ5piv5ZCm5Y+v5Zue5pS2XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGNoZWNrUmVzKCk6dm9pZHtcclxuXHJcbiAgICAgICAgbGV0IHJlczpSZXNvdXJjZTtcclxuICAgICAgICBmb3IoIGxldCB1cmwgaW4gdGhpcy5sb2FkTWFwICl7XHJcbiAgICAgICAgICAgIHJlcyA9IHRoaXMubG9hZE1hcC5nZXQoIHVybCApO1xyXG4gICAgICAgICAgICBpZiggcmVzICYmIHJlcy5jYW5HYygpICl7XHJcbiAgICAgICAgICAgICAgICByZXMucmVjb3ZlcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkTWFwLmRlbCggdXJsICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5qOA5rWL57uE6LWE5rqQIFRPRE9cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlui1hOa6kOaVsOaNrlxyXG4gICAgICogQHBhcmFtIHVybCDotYTmupDlnLDlnYAs5oiW6ICF57uE6LWE5rqQ5ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UmVzKCB1cmw6c3RyaW5nICk6UmVzb3VyY2V8R3JvdXBSZXNvdXJjZXtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZE1hcC5nZXQoIHVybCApIHx8IHRoaXMuZ3JvdXBNYXAuZ2V0KCB1cmwgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlui1hOa6kFxyXG4gICAgICogQHBhcmFtIHVybCDotYTmupDlnLDlnYBcclxuICAgICAqIEBwYXJhbSBpc0NvdW50IOaYr+WQpuiuoeaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFNvdXJjZSggdXJsOnN0cmluZyAsIGlzQ291bnQ6Ym9vbGVhbiA9IGZhbHNlICk6YW55e1xyXG5cclxuICAgICAgICBsZXQgcmVzOlJlc291cmNlID0gdGhpcy5sb2FkTWFwLmdldCggdXJsICk7XHJcbiAgICAgICAgcmV0dXJuIHJlcyAmJiByZXMuZ2V0UmVzKCBpc0NvdW50ICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDph4rmlL7otYTmupBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBkZXN0cm95UmVzKCB1cmw6c3RyaW5nICk6dm9pZHtcclxuXHJcblxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog57qv57K55Yqg6L296LWE5rqQ566h55CGXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTG9hZGVyTWFuYWdlcntcclxuXHJcbiAgICAvKirliqDovb3pmJ/liJfkuIrpmZAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgTE9BRF9MSU1JVDpudW1iZXIgPSA1O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YeG5aSH5Yqg6L295YiX6KGoXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWR5TG9hZExpc3Q6QXJyYXk8UmVzb3VyY2U+ID0gW107XHJcblxyXG4gICAgLyoq5q2j5Zyo5Yqg6L2955qE5YiX6KGoICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2FkaW5nTGlzdDpBcnJheTxSZXNvdXJjZT4gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWKoOi9vei1hOa6kFxyXG4gICAgICogQHBhcmFtIHNvdXJjZSDotYTmupDlnLDlnYDmiJZSZXNvdXJjZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWQoIHNvdXJjZTpzdHJpbmcgfCBSZXNvdXJjZSApOnZvaWR7XHJcblxyXG4gICAgICAgIGxldCByZXM6UmVzb3VyY2UgPSB0eXBlb2Ygc291cmNlID09PSBcInN0cmluZ1wiID8gTG9hZFNvdXJjZU1hbmFnZXIuZ2V0UmVzKCBzb3VyY2UgKSA6IHNvdXJjZTtcclxuICAgICAgICBpZiggcmVzICl7XHJcbiAgICAgICAgICAgIGlmKCB0aGlzLmxvYWRpbmdMaXN0Lmxlbmd0aCA8IHRoaXMuTE9BRF9MSU1JVCApe1xyXG4gICAgICAgICAgICAgICAgaWYoIHRoaXMubG9hZGluZ0xpc3QuaW5kZXhPZiggcmVzICkgIT0gLTEgKXtcclxuICAgICAgICAgICAgICAgICAgICAvL+i1hOa6kOato+WcqOWKoOi9vVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZ0xpc3QucHVzaCggcmVzICk7XHJcbiAgICAgICAgICAgICAgICBMb2cubG9nKCB0aGlzICwgXCLlvIDlp4vliqDovb3otYTmupAgdXJsOiBcIisgcmVzLnVybCAsIExvZy5UWVBFX0xPQUQgKTsvL+aJk+WNsOaXpeW/l1xyXG4gICAgICAgICAgICAgICAgTGF5YS5sb2FkZXIubG9hZCggW3t1cmw6cmVzLnVybCx0eXBlOnJlcy50eXBlfV0gLCBMYXlhLkhhbmRsZXIuY3JlYXRlKCB0aGlzICwgdGhpcy5vbkxvYWRlZCAsIFtyZXNdICwgdHJ1ZSAgKSAgLCByZXMucHJvZ3Jlc3MgICk7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmKCB0aGlzLnJlYWR5TG9hZExpc3QuaW5kZXhPZiggcmVzICkgPT0gLTEgKXtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVhZHlMb2FkTGlzdC5wdXNoKCByZXMgKTtcclxuICAgICAgICAgICAgICAgIC8v6L+Z6YeM5qC55o2u5LyY5YWI57qn5o6S5bqPXHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLnJlYWR5TG9hZExpc3QgPSB0aGlzLnJlYWR5TG9hZExpc3Quc29ydCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgb25Mb2FkZWQoIHJlczpSZXNvdXJjZSApOnZvaWR7XHJcblxyXG4gICAgICAgIHJlcy5sb2FkQ29tcGxldGUoKTtcclxuICAgICAgICAvL+S7juWKoOi9veWIl+ihqOenu+mZpFxyXG4gICAgICAgIGxldCBpbmRleDpudW1iZXIgPSB0aGlzLmxvYWRpbmdMaXN0LmluZGV4T2YoIHJlcyApO1xyXG4gICAgICAgIGlmKCBpbmRleCAhPSAtMSApe1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdMaXN0LnNwbGljZSggaW5kZXggLCAxICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIExvZy5sb2coIHRoaXMgLCBcIuWKoOi9vei1hOa6kCB1cmzvvJpcIiArIHJlcy51cmwgKyBcIuWujOaIkOOAglwiICwgTG9nLlRZUEVfTE9BRCApO1xyXG4gICAgICAgIEV2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KCBMb2FkZXJFdmVudC5MT0FEX1NJTkdMRV9DT01QTEVURSAsIHJlcyApO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWROZXh0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9hZE5leHQoKTp2b2lke1xyXG5cclxuICAgICAgICBsZXQgcmVzOlJlc291cmNlID0gdGhpcy5yZWFkeUxvYWRMaXN0LnNoaWZ0KCk7XHJcbiAgICAgICAgaWYoIHJlcyAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZCggcmVzICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSAgICBcclxufSIsIi8qKlxyXG4gKiDliqDovb3kuovku7ZcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRlckV2ZW50ICB7XHJcbiAgICBcclxuICAgIC8qKuWKoOi9veWNleS4qui1hOa6kOWujOaIkCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBMT0FEX1NJTkdMRV9DT01QTEVURTpzdHJpbmcgPSBcIkxvYWRlckV2ZW50LmxvYWRTaW5nbGVDb21wbGV0ZVwiO1xyXG4gICAgLyoq5Yqg6L2957uE6LWE5rqQ5a6M5oiQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExPQURfR1JPVVBfQ09NUExFVEU6c3RyaW5nID0gXCJMb2FkZXJFdmVudC5sb2FkR3JvdXBDb21wbGV0ZVwiO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvciggICl7XHJcblxyXG5cclxuICAgIH1cclxufSIsImltcG9ydCBSZXNvdXJjZSBmcm9tIFwiLi9SZXNvdXJjZVwiO1xyXG5pbXBvcnQgeyBMb2FkZXJNYW5hZ2VyIH0gZnJvbSBcIi4uL0xvYWRTb3VyY2VNYW5hZ2VyXCI7XHJcbmltcG9ydCBMb2cgZnJvbSBcIi4uLy4uL2xvZy9Mb2dcIjtcclxuXHJcbi8qKlxyXG4gKiDnu4TotYTmupBcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyb3VwUmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgS0VZOnN0cmluZyA9IFwiR3JvdXBSZXNvdXJjZVwiO1xyXG5cclxuICAgIHByaXZhdGUgX2xpc3Q6QXJyYXk8UmVzb3VyY2U+ID0gbnVsbDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7IFxyXG5cclxuICAgICAgICBzdXBlcigpOyBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlKCB1cmw6QXJyYXk8UmVzb3VyY2U+ID0gbnVsbCAsIGNvbXBsZXRlOkxheWEuSGFuZGxlciA9IG51bGwgLCBwcm9ncmVzczpMYXlhLkhhbmRsZXIgPSBudWxsICwgZXJyb3I6TGF5YS5IYW5kbGVyID0gbnVsbCAgKTp2b2lke1xyXG5cclxuICAgICAgICAvLyB0aGlzLnVybCA9IHVybDtcclxuICAgICAgICB0aGlzLl9saXN0ID0gdXJsO1xyXG4gICAgICAgIHRoaXMuX2NvbXBsZXRlID0gY29tcGxldGU7XHJcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3MgPSBwcm9ncmVzcztcclxuICAgICAgICB0aGlzLl9lcnJvciA9IGVycm9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb2FkKCk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuX2xpc3QgJiYgdGhpcy5fbGlzdC5sZW5ndGggPiAwICl7XHJcbiAgICAgICAgICAgIGxldCBpc0JyZWFrOmJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IHJlczpSZXNvdXJjZTtcclxuICAgICAgICAgICAgZm9yKCByZXMgb2YgdGhpcy5fbGlzdCApe1xyXG4gICAgICAgICAgICAgICAgaWYoIHJlcyAmJiByZXMuZ2V0UmVzKCBmYWxzZSApID09IG51bGwgKXsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIExvYWRlck1hbmFnZXIubG9hZCggcmVzLnVybCApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFpc0JyZWFrKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNCcmVhayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKCFpc0JyZWFrICYmIHRoaXMuX2NvbXBsZXRlICE9IG51bGwgKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlLnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6LWE5rqQ57uE5piv5ZCm5Yqg6L295a6M5oiQXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpc0xvYWRlZCgpOmJvb2xlYW57XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLl9saXN0ICYmIHRoaXMuX2xpc3QubGVuZ3RoID4gMCApe1xyXG4gICAgICAgICAgICBsZXQgcmVzOlJlc291cmNlO1xyXG4gICAgICAgICAgICBmb3IoIHJlcyBvZiB0aGlzLl9saXN0ICl7XHJcbiAgICAgICAgICAgICAgICBpZiggcmVzICYmIHJlcy5nZXRSZXMoIGZhbHNlICkgPT0gbnVsbCApe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaYr+WQpuacieWvueW6lOWcsOWdgOi1hOa6kFxyXG4gICAgICogQHBhcmFtIHVybCDotYTmupDlnLDlnYBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGhhc1VybCggdXJsOnN0cmluZyApOmJvb2xlYW57XHJcblxyXG4gICAgICAgIGxldCByZXM6UmVzb3VyY2U7XHJcbiAgICAgICAgZm9yKCByZXMgb2YgdGhpcy5fbGlzdCApe1xyXG4gICAgICAgICAgICBpZiggcmVzICYmIHJlcy51cmwgPT0gdXJsICl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDotYTmupDmmK/lkKblt7LliqDovb1cclxuICAgICAqIEBwYXJhbSB1cmwg6LWE5rqQ5Zyw5Z2AXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBoYXNMb2FkZWQoIHVybDpzdHJpbmcgKTpib29sZWFue1xyXG5cclxuICAgICAgICBsZXQgcmVzOlJlc291cmNlO1xyXG4gICAgICAgIGZvciggcmVzIG9mIHRoaXMuX2xpc3QgKXtcclxuICAgICAgICAgICAgaWYoIHJlcyAmJiByZXMudXJsID09IHVybCAmJiByZXMuZ2V0UmVzKCBmYWxzZSApICE9IG51bGwgKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufSIsImltcG9ydCBMb2FkVXRpbHMgZnJvbSBcIi4uL3V0aWxzL0xvYWRVdGlsc1wiO1xyXG5pbXBvcnQgeyBMb2FkZXJNYW5hZ2VyIH0gZnJvbSBcIi4uL0xvYWRTb3VyY2VNYW5hZ2VyXCI7XHJcblxyXG4vKipcclxuICog6LWE5rqQ5Z+657G7XHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElSZXNvdXJjZSB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBLRVk6c3RyaW5nID0gXCJSZXNvdXJjZVwiO1xyXG5cclxuICAgIC8qKuWbnuaUtumXtOmalOaXtumXtO+8jOavq+enkiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBHQ19HQVBUSU1FOm51bWJlciA9IDEwMDAwO1xyXG5cclxuICAgIC8qKuWbvueJh+i1hOa6kCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUWVBFX0lNQUdFOnN0cmluZyA9IFwiaW1hZ2VcIjtcclxuICAgIC8qKuaWh+acrOi1hOa6kCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUUFlFX1RFWFQ6c3RyaW5nID0gXCJ0ZXh0XCI7XHJcbiAgICAvKirkuozov5vliLbotYTmupAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVFlQRV9CSU46c3RyaW5nID0gXCJiaW5cIjtcclxuICAgIC8qKue7hOi1hOa6kCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUWVBFX0dST1VQOnN0cmluZyA9IFwiZ3JvdXBcIjtcclxuXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGNyZWF0ZSggdXJsOmFueSAsIGNvbXBsZXRlOkxheWEuSGFuZGxlciA9IG51bGwgLCBwcm9ncmVzczpMYXlhLkhhbmRsZXIgPSBudWxsICwgZXJyb3I6TGF5YS5IYW5kbGVyID0gbnVsbCApOmFueXtcclxuXHJcbiAgICAvLyAgICAgbGV0IHJlczpSZXNvdXJjZSA9IG51bGw7XHJcbiAgICAvLyAgICAgbGV0IGV4dDpzdHJpbmcgPSBMb2FkVXRpbHMuZ2V0RmlsZUV4dCggdXJsICk7XHJcbiAgICAvLyAgICAgaWYoIGV4dCA9PSBcInBuZ1wiIHx8IGV4dCA9PSBcImpwZ1wiIHx8IGV4dCA9PSBcImJtcFwiICl7XHJcbiAgICAvLyAgICAgICAgIHJlcyA9IExheWEuUG9vbC5nZXRJdGVtQnlDbGFzcyggUmVzb3VyY2UuS0VZICwgUmVzb3VyY2UgKTtcclxuICAgIC8vICAgICAgICAgcmVzLnR5cGUgPSBMYXlhLkxvYWRlci5JTUFHRTtcclxuICAgIC8vICAgICB9ZWxzZSBpZiggZXh0ID09IFwidHh0XCIgfHwgZXh0ID09IFwianNvblwiICl7XHJcbiAgICAvLyAgICAgICAgIHJlcyA9IExheWEuUG9vbC5nZXRJdGVtQnlDbGFzcyggVHh0UmVzb3VyY2UuS0VZICwgVHh0UmVzb3VyY2UgKTtcclxuICAgIC8vICAgICAgICAgcmVzLnR5cGUgPSBMYXlhLkxvYWRlci5URVhUO1xyXG4gICAgLy8gICAgIH1lbHNlIGlmKCB1cmwgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAvLyAgICAgICAgIHJlcyA9IExheWEuUG9vbC5nZXRJdGVtQnlDbGFzcyggR3JvdXBSZXNvdXJjZS5LRVkgLCBHcm91cFJlc291cmNlICk7XHJcbiAgICAvLyAgICAgICAgIHJlcy50eXBlID0gUmVzb3VyY2UuVFlQRV9HUk9VUDtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgaWYocmVzKXtcclxuICAgIC8vICAgICAgICAgcmVzLmNyZWF0ZSggdXJsICwgY29tcGxldGUgLCBwcm9ncmVzcyAsIGVycm9yICk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIHJldHVybiByZXM7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlm57mlLbotYTmupBcclxuICAgICAqIEBwYXJhbSByZXMgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVjb3ZlciggcmVzOlJlc291cmNlICk6dm9pZHtcclxuICAgICAgICBcclxuICAgICAgICBpZiggcmVzICl7XHJcbiAgICAgICAgICAgIHJlcy5jbGVhcigpO1xyXG4gICAgICAgICAgICBMYXlhLlBvb2wucmVjb3ZlciggdHlwZW9mIHJlcyAsIHJlcyApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgLyoq6LWE5rqQ5ZCN5a2XICovXHJcbiAgICBwdWJsaWMgbmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgLyoq5Yqg6L295Zyw5Z2AICovXHJcbiAgICBwdWJsaWMgdXJsOnN0cmluZyA9IFwiXCI7XHJcbiAgICAvKirotYTmupDnsbvlnosgKi9cclxuICAgIHB1YmxpYyB0eXBlOnN0cmluZyA9IFwiXCI7XHJcbiAgICAvKirkuIvovb3kvJjlhYjnuqcgKi9cclxuICAgIHB1YmxpYyBwcmlvcml0eTpudW1iZXIgPSAwO1xyXG4gICAgLyoq5Yqg6L295a6M5oiQ5LqL5Lu2ICovXHJcbiAgICBwcm90ZWN0ZWQgX2NvbXBsZXRlOkxheWEuSGFuZGxlciA9IG51bGw7XHJcbiAgICAvKirov5vluqbkuovku7YgKi9cclxuICAgIHByb3RlY3RlZCBfcHJvZ3Jlc3M6TGF5YS5IYW5kbGVyID0gbnVsbDtcclxuICAgIC8qKumUmeivr+S6i+S7tiAqL1xyXG4gICAgcHJvdGVjdGVkIF9lcnJvcjpMYXlhLkhhbmRsZXIgPSBudWxsO1xyXG4gICAgLyoq6LWE5rqQ5pWw5o2uICovXHJcbiAgICBwcm90ZWN0ZWQgX2RhdGE6YW55ID0gbnVsbDtcclxuICAgIC8qKuS9v+eUqOiuoeaVsCAqL1xyXG4gICAgcHJvdGVjdGVkIF91c2VDb3VudDpudW1iZXIgPSAwO1xyXG4gICAgLyoq5Zue5pS25pe26Ze0ICovXHJcbiAgICBwcm90ZWN0ZWQgX2djVGltZTpudW1iZXIgPSAwO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvciggdXJsOnN0cmluZyA9IFwiXCIgLCBjb21wbGV0ZTpMYXlhLkhhbmRsZXIgPSBudWxsICwgZXJyb3I6TGF5YS5IYW5kbGVyID0gbnVsbCApIHsgXHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlKCB1cmwgLCBjb21wbGV0ZSAsIGVycm9yICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZSggdXJsOmFueSA9IFwiXCIgLCBjb21wbGV0ZTpMYXlhLkhhbmRsZXIgPSBudWxsICwgcHJvZ3Jlc3M6TGF5YS5IYW5kbGVyID0gbnVsbCAsIGVycm9yOkxheWEuSGFuZGxlciA9IG51bGwgICk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5fY29tcGxldGUgPSBjb21wbGV0ZTtcclxuICAgICAgICB0aGlzLl9wcm9ncmVzcyA9IHByb2dyZXNzO1xyXG4gICAgICAgIHRoaXMuX2Vycm9yID0gZXJyb3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvYWQoKTp2b2lke1xyXG5cclxuICAgICAgICAvLyBMYXlhLmxvYWRlci5sb2FkKFtcclxuXHRcdC8vIFx0eyB1cmw6IFwicmVzL2ZhaXJ1aS9jb21tb25fYXRsYXMwLnBuZ1wiLCB0eXBlOiBMYXlhLkxvYWRlci5JTUFHRSB9LFxyXG5cdFx0Ly8gXHR7IHVybDogXCJyZXMvZmFpcnVpL2NvbW1vbi5tYXBcIiwgdHlwZTogTGF5YS5Mb2FkZXIuQlVGRkVSIH1cclxuICAgICAgICAvLyAgICAgXSwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uTG9hZGVkKSk7XHJcblxyXG4gICAgICAgIExvYWRlck1hbmFnZXIubG9hZCggdGhpcy51cmwgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVjb3ZlcigpOnZvaWR7XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLl91c2VDb3VudCA8PSAwICl7XHJcbiAgICAgICAgICAgIFJlc291cmNlLnJlY292ZXIoIHRoaXMgKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9hZENvbXBsZXRlKCk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IExheWEubG9hZGVyLmdldFJlcyggdGhpcy51cmwgKTtcclxuICAgICAgICB0aGlzLl91c2VDb3VudCA9IDA7XHJcbiAgICAgICAgaWYoIHRoaXMuX2NvbXBsZXRlICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUucnVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W6LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gaXNDb3VudCDmmK/lkKborqHmlbBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFJlcyggaXNDb3VudDpib29sZWFuID0gdHJ1ZSApOmFueXtcclxuXHJcbiAgICAgICAgaWYoIGlzQ291bnQgKXtcclxuICAgICAgICAgICAgdGhpcy5fdXNlQ291bnQrKztcclxuICAgICAgICAgICAgdGhpcy5fZ2NUaW1lID0gTGF5YS50aW1lci5jdXJyRnJhbWUgKyBSZXNvdXJjZS5HQ19HQVBUSU1FO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdXNlQ291bnQoKTpudW1iZXJ7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl91c2VDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICAvKirmmK/lkKblj6/lm57mlLYgKi9cclxuICAgIHB1YmxpYyBjYW5HYygpOmJvb2xlYW57XHJcblxyXG4gICAgICAgIHJldHVybiBMYXlhLnRpbWVyLmN1cnJGcmFtZSA+IHRoaXMuX2djVGltZSAmJiB0aGlzLl91c2VDb3VudCA8PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc0xvYWRlZCgpOmJvb2xlYW57XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhICE9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNoZWNrKCk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuY2FuR2MoKSApe1xyXG4gICAgICAgICAgICB0aGlzLnJlY292ZXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjb21wbGV0ZSgpOkxheWEuSGFuZGxlcntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBsZXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcHJvZ3Jlc3MoKTpMYXlhLkhhbmRsZXJ7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9ncmVzcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXIoKTp2b2lke1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCB0aGlzLl9jb21wbGV0ZSAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlLnJlY292ZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMuX3Byb2dyZXNzICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5fcHJvZ3Jlc3MucmVjb3ZlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5fZXJyb3IgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLl9lcnJvci5yZWNvdmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NvbXBsZXRlID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9wcm9ncmVzcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fZXJyb3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2RhdGEgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudXJsID0gXCJcIjtcclxuICAgICAgICB0aGlzLl9nY1RpbWUgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwb3NlKCk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuX3VzZUNvdW50ID4gMCApe1xyXG4gICAgICAgICAgICB0aGlzLl91c2VDb3VudC0tO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgUmVzb3VyY2UgZnJvbSBcIi4vUmVzb3VyY2VcIjtcclxuXHJcbi8qKlxyXG4gKiDmlofmnKzotYTmupBcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFR4dFJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2UgeyAgICBcclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBLRVk6c3RyaW5nID0gXCJUeHRSZXNvdXJjZVwiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkgeyBcclxuICAgICAgICBzdXBlcigpOyBcclxuICAgIH1cclxuXHJcblxyXG59IiwiLyoqXHJcbiAqIOWKoOi9veW3peWFt1xyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZFV0aWxze1xyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIOiOt+W+l+aWh+S7tuWQjue8gOWQjVxyXG4gICAgICogQHBhcmFtIHVybCDmlofku7bot6/lvoRcclxuICAgICAqIEByZXR1cm4gPGI+U3RyaW5nPC9iPiDmlofku7blkI7nvIDlkI1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRGaWxlRXh0KHVybDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAvL+WIh+aOiei3r+W+hOWQjumdoueahOWPguaVsFxyXG4gICAgICAgIGxldCBleHQ6IHN0cmluZyA9IHVybC5pbmRleE9mKFwiP1wiKSA+IC0xID8gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIj9cIikpIDogdXJsO1xyXG4gICAgICAgIC8v5oiq5Y+W5ZCO57yAXHJcbiAgICAgICAgbGV0IGxhc3Q6IHN0cmluZyA9IGV4dC5zdWJzdHJpbmcoZXh0Lmxhc3RJbmRleE9mKFwiL1wiKSk7XHJcbiAgICAgICAgcmV0dXJuIGxhc3QubGFzdEluZGV4T2YoXCIuXCIpID09IC0xID8gXCJcIiA6IGxhc3Quc3Vic3RyaW5nKGxhc3QubGFzdEluZGV4T2YoXCIuXCIpICsgMSkudG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxufSIsIi8qKlxyXG4gKiDotYTmupDlnLDlnYDnrqHnkIbnsbtcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVybFV0aWxzIHtcclxuICAgIFxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUkVTOnN0cmluZyA9IFwicmVzL1wiO1xyXG4gICAgLyoqZmFpcnlndWnlj5HluIPotYTmupDnm67lvZUgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgRkFJUlVJOnN0cmluZyA9IFVybFV0aWxzLlJFUyArIFwiZmFpcnVpL1wiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+WZmFpcnlndWnotYTmupDnu4RcclxuICAgICAqIEBwYXJhbSBuYW1lIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEZhaXJ5R3JvdXAoIG5hbWU6c3RyaW5nICk6QXJyYXk8c3RyaW5nPntcclxuXHJcbiAgICAgICAgcmV0dXJuIFsgVXJsVXRpbHMuRkFJUlVJICsgbmFtZSArIFwiX2F0bGFzMC5wbmdcIiAsIFVybFV0aWxzLkZBSVJVSSArIG5hbWUgKyBcIi5tYXBcIiBdO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IExvZ1ZvIGZyb20gXCIuL0xvZ1ZvXCI7XHJcblxyXG4vKipcclxuICog5pel5b+X57O757ufIFxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4yNVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nIHtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2dNYXA6IExheWEuV2Vha09iamVjdCA9IG51bGw7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBrZXlJbmRleDpudW1iZXIgPSAwO1xyXG5cclxuICAgIC8qKuaZrumAmuiwg+ivleaXpeW/lyAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUWVBFX0RFQlVHOnN0cmluZyA9IFwiZGVidWdcIjtcclxuICAgIC8qKuWKoOi9veebuOWFs+aXpeW/lyAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUWVBFX0xPQUQ6c3RyaW5nID0gXCJsb2FkXCI7XHJcblxyXG4gICAgLyoq5LiN6ZyA6KaB5pi+56S65pel5b+X57G75Z6L55qE5YiX6KGoICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG5vc2hvd0xvZ1R5cGVMaXN0OkFycmF5PHN0cmluZz4gPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdCgpOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMubG9nTWFwID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG4gICAgICAgIHRoaXMubm9zaG93TG9nVHlwZUxpc3QgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaYvuekuuaXpeW/l1xyXG4gICAgICogQHBhcmFtIHRoaXNPYmplY3QgXHJcbiAgICAgKiBAcGFyYW0gdGV4dCDml6Xlv5fmlofmnKxcclxuICAgICAqIEBwYXJhbSB0eXBlIOaXpeW/l+exu+Wei1xyXG4gICAgICogQHBhcmFtIGxldmVsIOaXpeW/l+etiee6p1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvZyggdGhpc09iamVjdDphbnkgLCB0ZXh0OnN0cmluZyAsIHR5cGU6c3RyaW5nPVwiXCIgLCBsZXZlbDpudW1iZXIgPTAgKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggdHlwZSA9PSBcIlwiKXtcclxuICAgICAgICAgICAgdHlwZSA9IExvZy5UWVBFX0RFQlVHO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdHlwZSAmJiB0aGlzLm5vc2hvd0xvZ1R5cGVMaXN0LmluZGV4T2YodHlwZSkgIT0gLTEgKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbG9nVm86TG9nVm8gPSBuZXcgTG9nVm8oIExvZy5rZXlJbmRleCAsIHRleHQgLCB0aGlzT2JqZWN0ICwgdHlwZSAsIGxldmVsICk7ICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyggbG9nVm8udG9TdHJpbmcoKSApO1xyXG4gICAgICAgIHRoaXMubG9nTWFwLnNldCggbG9nVm8ua2V5ICwgbG9nVm8gKTtcclxuICAgICAgICBMb2cua2V5SW5kZXgrKztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaYvuekuumUmeivr+aXpeW/l1xyXG4gICAgICogQHBhcmFtIHRoaXNPYmplY3QgXHJcbiAgICAgKiBAcGFyYW0gYXJncyBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBlcnJvciggdGhpc09iamVjdDphbnkgLCB0ZXh0OnN0cmluZyAsIHR5cGU6c3RyaW5nPVwiXCIgLCBsZXZlbDpudW1iZXIgPTAgKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggdHlwZSAmJiB0aGlzLm5vc2hvd0xvZ1R5cGVMaXN0LmluZGV4T2YodHlwZSkgIT0gLTEgKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbG9nVm86TG9nVm8gPSBuZXcgTG9nVm8oIExvZy5rZXlJbmRleCAsIHRleHQgLCB0aGlzT2JqZWN0ICwgdHlwZSAsIGxldmVsICk7ICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmVycm9yKCBsb2dWby50b1N0cmluZygpICk7XHJcbiAgICAgICAgdGhpcy5sb2dNYXAuc2V0KCBsb2dWby5rZXkgLCBsb2dWbyApO1xyXG4gICAgICAgIExvZy5rZXlJbmRleCsrO1xyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIOaXpeW/l+aVsOaNrlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4yNVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nVm8ge1xyXG5cclxuICAgIHB1YmxpYyBrZXk6YW55O1xyXG4gICAgLyoq5pel5b+X57G75Z6LICovXHJcbiAgICBwdWJsaWMgdHlwZTpzdHJpbmc7XHJcbiAgICAvKirml6Xlv5fmj4/ov7AgKi9cclxuICAgIHB1YmxpYyB0ZXh0OnN0cmluZztcclxuICAgIC8qKnRoaXNPYmplY3Qg5a+56LGhICovXHJcbiAgICBwdWJsaWMgdGhpc09iamVjdDphbnk7XHJcbiAgICAvKirml6Xlv5fnrYnnuqcgKi9cclxuICAgIHB1YmxpYyBsZXZlbDpudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCBrZXk6YW55ICwgdGV4dDpzdHJpbmcgLCB0aGlzT2JqZWN0OmFueSAsIHR5cGU6c3RyaW5nID0gXCJcIiAsIGxldmVsOm51bWJlciA9IDAgKSB7XHJcblxyXG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy50aGlzT2JqZWN0ID0gdGhpc09iamVjdDtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMubGV2ZWwgPSBsZXZlbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTpzdHJpbmd7XHJcblxyXG4gICAgICAgIHZhciBjbHNOYW1lOiBhbnkgPSB0aGlzLnRoaXNPYmplY3QgPyB0aGlzLnRoaXNPYmplY3QubmFtZSA6IFwiXCI7XHJcblxyXG4gICAgICAgIHJldHVybiBcIltcIiArIHRoaXMudHlwZSArIFwiXVwiICsgXCJbXCIgKyBjbHNOYW1lICsgXCJdXCIgKyB0aGlzLnRleHQgKyBcIiAgICBcIiArIG5ldyBEYXRlKCkudG9UaW1lU3RyaW5nKCkgKyBcIlwiIDtcclxuICAgIH1cclxufSIsImltcG9ydCBMb2cgZnJvbSBcIi4uL2xvZy9Mb2dcIjtcclxuXHJcbi8qKlxyXG4gKiDkuovku7bnrqHnkIbnsbtcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50TWFuYWdlciB7XHJcblxyXG5cdHByaXZhdGUgc3RhdGljIF9ldmVudERpY3Q6IExheWEuV2Vha09iamVjdCA9IG51bGw7XHJcblxyXG5cdHByaXZhdGUgc3RhdGljIF90YXJnZXRNYXA6IExheWEuV2Vha09iamVjdCA9IG51bGw7XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgaW5pdCgpOiB2b2lke1xyXG5cclxuXHRcdHRoaXMuX2V2ZW50RGljdCA9IG5ldyBMYXlhLldlYWtPYmplY3QoKTtcclxuXHRcdHRoaXMuX3RhcmdldE1hcCA9IG5ldyBMYXlhLldlYWtPYmplY3QoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOinpuWPkeWFqOWxgOS6i+S7tlxyXG5cdCAqIEBwYXJhbSB0eXBlIOS6i+S7tuexu+Wei1xyXG5cdCAqIEBwYXJhbSBhcmdzIOS6i+S7tuWPguaVsFxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgZGlzcGF0Y2hFdmVudCggdHlwZTogc3RyaW5nLCAuLi5hcmdzICk6dm9pZCB7XHJcblxyXG5cdFx0bGV0IGZ1bmNMaXN0OiBBcnJheTxhbnk+ID0gRXZlbnRNYW5hZ2VyLl9ldmVudERpY3QuZ2V0KHR5cGUpO1xyXG5cdFx0aWYgKGZ1bmNMaXN0KSB7XHJcblx0XHRcdGxldCBsaXN0OiBBcnJheTxhbnk+ID0gZnVuY0xpc3QuY29uY2F0KCk7XHJcblx0XHRcdGxldCBsZW5ndGg6IG51bWJlciA9IGxpc3QubGVuZ3RoO1xyXG5cdFx0XHRpZiAobGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0TG9nLmxvZyggdGhpcyAsIFwi6LCD5bqm5LqL5Lu2OiBcIiArIHR5cGUpOy8v6LCD5bqm5LqL5Lu25Ye66ZSZLlxyXG5cdFx0XHRcdFx0XHRsaXN0W2ldWzBdLmFwcGx5KGxpc3RbaV1bMV0sIGFyZ3MpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdFx0TG9nLmVycm9yKCB0aGlzICwgXCLosIPluqbkuovku7blh7rplJkuXCIrZS50b1N0cmluZygpICk7Ly/osIPluqbkuovku7blh7rplJkuXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDmt7vliqDkuovku7bmlrnms5VcclxuXHQgKiBAcGFyYW0gdHlwZSDkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW0gbGlzdGVuZXIg5LqL5Lu25pa55rOVXHJcblx0ICogQHBhcmFtIHRoaXNPYmplY3RcclxuXHQgKiBAcGFyYW0gdGFyZ2V0IOebkeWQrOS6i+S7tuWvueixoe+8jOS4uuepuuWImeebkeWQrOWFqOWxgOS6i+S7tlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgYWRkRXZlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiwgdGhpc09iamVjdDogYW55LCB0YXJnZXQ6IExheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCk6IHZvaWQge1xyXG5cclxuXHRcdGxldCBmdW5jTGlzdDogQXJyYXk8YW55PiA9IG51bGw7XHJcblx0XHRpZiAodGFyZ2V0ID09IG51bGwpIHtcclxuXHRcdFx0ZnVuY0xpc3QgPSA8YW55PkV2ZW50TWFuYWdlci5fZXZlbnREaWN0LmdldCh0eXBlKTtcclxuXHRcdFx0aWYgKCFmdW5jTGlzdCkge1xyXG5cdFx0XHRcdGZ1bmNMaXN0ID0gbmV3IEFycmF5PGFueT4oKTtcclxuXHRcdFx0XHRFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5zZXQodHlwZSwgZnVuY0xpc3QpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghRXZlbnRNYW5hZ2VyLmhhc0V2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHRoaXNPYmplY3QpKSB7XHJcblx0XHRcdFx0ZnVuY0xpc3QucHVzaChbbGlzdGVuZXIsIHRoaXNPYmplY3RdKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZnVuY0xpc3QgPSBFdmVudE1hbmFnZXIuZ2V0TGlzdGVuZXJMaXN0KCB0YXJnZXQgKTtcclxuXHRcdFx0aWYoICFFdmVudE1hbmFnZXIuaGFzTGlzdGVuZXJPZiggdHlwZSAsIGxpc3RlbmVyICwgdGFyZ2V0ICkgKXsgLy/lpoLmnpzmsqHmnInnm5HlkKzor6Xkuovku7bvvIzpgb/lhY3ph43lpI3nm5HlkKxcclxuXHRcdFx0XHR2YXIgb2JqOiBPYmplY3QgPSBuZXcgT2JqZWN0KCk7XHJcblx0XHRcdFx0b2JqW1widHlwZVwiXSA9IHR5cGU7XHJcblx0XHRcdFx0b2JqW1wibGlzdGVuZXJcIl0gPSBsaXN0ZW5lcjtcclxuXHRcdFx0XHRvYmpbXCJ0aGlzT2JqZWN0XCJdID0gdGhpc09iamVjdDtcclxuXHRcdFx0XHRmdW5jTGlzdCA9IGZ1bmNMaXN0IHx8IFtdO1xyXG5cdFx0XHRcdGZ1bmNMaXN0LnB1c2gob2JqKTtcclxuXHRcdFx0XHQvLyB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdGhpc09iamVjdCk7XHJcblx0XHRcdFx0dGFyZ2V0Lm9uKCB0eXBlICwgdGhpc09iamVjdCAsIGxpc3RlbmVyICk7XHJcblx0XHRcdH1cdFx0XHRcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOenu+mZpOS6i+S7tuebkeWQrFxyXG5cdCAqIEBwYXJhbSB0eXBlIOS6i+S7tuexu+Wei1xyXG5cdCAqIEBwYXJhbSBsaXN0ZW5lciDkuovku7bmlrnms5VcclxuXHQgKiBAcGFyYW0gdGhpc09iamVjdFxyXG5cdCAqIEBwYXJhbSB0YXJnZXQg55uR5ZCs5LqL5Lu25a+56LGh77yM5Li656m65YiZ55uR5ZCs5YWo5bGA5LqL5Lu2IFxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiwgdGhpc09iamVjdDogYW55LCB0YXJnZXQ6IExheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCk6IHZvaWQge1xyXG5cdFx0XHJcblx0XHRsZXQgZnVuY0xpc3Q6IEFycmF5PGFueT4gPSBudWxsO1xyXG5cdFx0aWYoIHRhcmdldCA9PSBudWxsICl7IC8v5YWo5bGA5LqL5Lu2XHJcblx0XHRcdGZ1bmNMaXN0ID0gPGFueT5FdmVudE1hbmFnZXIuX2V2ZW50RGljdC5nZXQodHlwZSk7XHJcblx0XHRcdGlmIChmdW5jTGlzdCkge1xyXG5cdFx0XHRcdGxldCBsZW5ndGg6IG51bWJlciA9IGZ1bmNMaXN0Lmxlbmd0aDtcclxuXHRcdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChmdW5jTGlzdFtpXVswXSA9PSBsaXN0ZW5lciAmJiBmdW5jTGlzdFtpXVsxXSA9PSB0aGlzT2JqZWN0KSB7XHJcblx0XHRcdFx0XHRcdGZ1bmNMaXN0LnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRcdFx0aWYgKGZ1bmNMaXN0Lmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0RXZlbnRNYW5hZ2VyLl9ldmVudERpY3Quc2V0KHR5cGUsIG51bGwpO1xyXG5cdFx0XHRcdFx0XHRcdEV2ZW50TWFuYWdlci5fZXZlbnREaWN0LmRlbCh0eXBlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRmdW5jTGlzdCA9IEV2ZW50TWFuYWdlci5nZXRMaXN0ZW5lckxpc3QoIHRhcmdldCApO1xyXG5cdFx0XHR2YXIgb2JqOiBPYmplY3Q7XHJcbiAgICAgICAgICAgIGlmIChmdW5jTGlzdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jTGlzdC5mb3JFYWNoKChvYmopID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLnR5cGUgPT0gdHlwZSAmJiBvYmoubGlzdGVuZXIgPT0gbGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY0xpc3Quc3BsaWNlKGZ1bmNMaXN0LmluZGV4T2Yob2JqKSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cdFx0XHQvLyB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdGhpc09iamVjdCk7XHJcblx0XHRcdHRhcmdldC5vZmYoIHR5cGUgLCB0aGlzT2JqZWN0ICwgbGlzdGVuZXIgKTtcclxuXHRcdH1cdFx0XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDnm5HlkKzkuovku7bliJfooahcclxuXHQgKiBAcGFyYW0gdGFyZ2V0IOS6i+S7tuWvueixoVxyXG5cdCAqKi9cclxuXHRwdWJsaWMgc3RhdGljIGdldExpc3RlbmVyTGlzdCggdGFyZ2V0OkxheWEuRXZlbnREaXNwYXRjaGVyICk6IEFycmF5PE9iamVjdD4ge1xyXG5cclxuXHRcdGxldCBmdW5jTGlzdDpBcnJheTxPYmplY3Q+ID0gbnVsbDtcclxuXHRcdGlmKCB0YXJnZXQgKXtcclxuXHRcdFx0ZnVuY0xpc3QgPSBFdmVudE1hbmFnZXIuX3RhcmdldE1hcC5nZXQodGFyZ2V0KTtcclxuXHRcdFx0aWYgKGZ1bmNMaXN0ID09IG51bGwpIHtcclxuXHRcdFx0XHRmdW5jTGlzdCA9IFtdO1xyXG5cdFx0XHRcdEV2ZW50TWFuYWdlci5fdGFyZ2V0TWFwLnNldCh0YXJnZXQsIGZ1bmNMaXN0KTtcclxuXHRcdFx0fVxyXG5cdFx0fVx0XHRcclxuXHRcdHJldHVybiBmdW5jTGlzdDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOenu+mZpOaJgOacieebkeWQrOS6i+S7tlxyXG5cdCAqIEBwYXJhbSB0YXJnZXQg5Li656m65YiZ56e76Zmk5omA5pyJ5YWo5bGA5LqL5Lu277yM5ZCm5YiZ56e76Zmk5a+55bqU55qE5a+56LGh55qE5omA5pyJ5LqL5Lu2XHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyByZW1vdmVBbGxMaXN0ZW5lcnMoIHRhcmdldDpMYXlhLkV2ZW50RGlzcGF0Y2hlciA9IG51bGwgKTp2b2lke1xyXG5cclxuXHRcdGlmKCB0YXJnZXQgPT0gbnVsbCApe1xyXG5cdFx0XHRFdmVudE1hbmFnZXIucmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcigpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxldCBsaXN0OkFycmF5PE9iamVjdD4gPSBFdmVudE1hbmFnZXIuZ2V0TGlzdGVuZXJMaXN0KCB0YXJnZXQgKTtcclxuXHRcdFx0dmFyIG9iajogT2JqZWN0O1xyXG4gICAgICAgICAgICB3aGlsZSAobGlzdCAmJiBsaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG9iaiA9IGxpc3Quc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIob2JqW1widHlwZVwiXSwgb2JqW1wibGlzdGVuZXJcIl0sIG9ialtcInRoaXNPYmplY3RcIl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDnp7vpmaTmiYDmnInlhajlsYDkuovku7ZcclxuXHQgKi9cclxuXHRwcml2YXRlIHN0YXRpYyByZW1vdmVBbGxFdmVudExpc3RlbmVyKCkge1xyXG5cdFx0Ly8gZm9yIChsZXQgZm9yaW5sZXRfXyBpbiBFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5tYXApIHtcclxuXHRcdC8vIFx0bGV0IHR5cGUgPSBFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5tYXBbZm9yaW5sZXRfX11bMF07XHJcblx0XHQvLyBcdEV2ZW50TWFuYWdlci5yZW1vdmVFdmVudExpc3RlbmVycyh0eXBlKTtcclxuXHRcdC8vIH1cclxuXHRcdGZvciggbGV0IGtleSBpbiBFdmVudE1hbmFnZXIuX2V2ZW50RGljdCApe1xyXG5cdFx0XHRsZXQgdHlwZTphbnkgPSBFdmVudE1hbmFnZXIuX2V2ZW50RGljdFsga2V5IF07XHJcblx0XHRcdEV2ZW50TWFuYWdlci5yZW1vdmVFdmVudExpc3RlbmVycyggdHlwZSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog56e76Zmk5omA5pyJ5a+55bqU57G75Z6L5LqL5Lu255uR5ZCsXHJcblx0ICogQHBhcmFtIHR5cGUg5LqL5Lu257G75Z6LXHJcblx0ICogQHBhcmFtIFxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoIHR5cGU6IHN0cmluZyA9IG51bGwgKSB7XHJcblx0XHRpZiAodHlwZSAhPSBudWxsKSB7XHJcblx0XHRcdGlmIChFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5nZXQodHlwZSkgIT0gbnVsbCkge1xyXG5cdFx0XHRcdEV2ZW50TWFuYWdlci5fZXZlbnREaWN0LnNldCh0eXBlLCBudWxsKTtcclxuXHRcdFx0XHRFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5kZWwodHlwZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRFdmVudE1hbmFnZXIucmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcigpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog5piv5ZCm5pyJ5a+55bqU5LqL5Lu255qE55uR5ZCs5LqL5Lu2XHJcblx0ICogQHBhcmFtXHR0eXBlICAgICAgXHTkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW1cdGxpc3RlbmVyICBcdOS6i+S7tuaWueazlVxyXG5cdCAqIEBwYXJhbSBcdHRhcmdldFx0XHTnm5HlkKzlr7nosaFcclxuXHQgKiBAcGFyYW0gXHR0aGlzT2JqZWN0XHJcblx0ICogQHJldHVyblxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgaGFzTGlzdGVuZXJPZih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiA9IG51bGwsIHRhcmdldDogTGF5YS5FdmVudERpc3BhdGNoZXIgPSBudWxsLCB0aGlzT2JqZWN0OiBhbnkgPSBudWxsKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKSB7XHJcblx0XHRcdGxldCBmdW5jTGlzdDogQXJyYXk8YW55PiA9IEV2ZW50TWFuYWdlci5fdGFyZ2V0TWFwLmdldCh0YXJnZXQpO1xyXG5cdFx0XHR2YXIgb2JqOiBPYmplY3Q7XHJcblx0XHRcdGZvciAob2JqIG9mIGZ1bmNMaXN0KSB7XHJcblx0XHRcdFx0aWYgKG9iaiAmJiBvYmpbXCJ0eXBlXCJdID09IHR5cGUgJiYgKG9ialtcImxpc3RlbmVyXCJdID09IGxpc3RlbmVyIHx8IGxpc3RlbmVyID09IG51bGwpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBFdmVudE1hbmFnZXIuaGFzRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdGhpc09iamVjdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog5piv5ZCm5pyJ5a+55bqU55qE5YWo5bGA55uR5ZCs5LqL5Lu2XHJcblx0ICogQHBhcmFtXHR0eXBlICAgICAgXHTkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW1cdGxpc3RlbmVyICBcdOS6i+S7tuaWueazlVxyXG5cdCAqIEBwYXJhbSBcdHRoaXNPYmplY3RcclxuXHQgKiBAcmV0dXJuXHJcblx0ICovXHJcblx0cHJpdmF0ZSBzdGF0aWMgaGFzRXZlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiA9IG51bGwsIHRoaXNPYmplY3Q6IGFueSA9IG51bGwpOiBib29sZWFuIHtcclxuXHRcdGxldCBib29sOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHRsZXQgZnVuY0xpc3Q6IEFycmF5PGFueT4gPSA8YW55PkV2ZW50TWFuYWdlci5fZXZlbnREaWN0LmdldCh0eXBlKTtcclxuXHRcdGlmICghZnVuY0xpc3QgfHwgZnVuY0xpc3QubGVuZ3RoID09IDApIHtcclxuXHRcdFx0Ym9vbCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmIChsaXN0ZW5lciA9PSBudWxsKSB7XHJcblx0XHRcdFx0Ym9vbCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0ZnVuY0xpc3QuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuXHRcdFx0XHRcdGlmIChlbGVtZW50WzBdID09IGxpc3RlbmVyICYmIGVsZW1lbnRbMV0gPT0gdGhpc09iamVjdCkge1xyXG5cdFx0XHRcdFx0XHRib29sID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGJvb2w7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBib29sO1xyXG5cdH1cclxufSIsIi8qKlxyXG4gKiDpnaLmnb/ms6jlhowgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbFJlZ2lzdGVyIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5rOo5YaM57uE5Lu257G75LiOZmFpcnlndWnnvJbovpHlmajkuK3nsbvlr7nlupRcclxuICAgICAqIEBwYXJhbSBwa2dOYW1lIOWMheWQjVxyXG4gICAgICogQHBhcmFtIHJlc05hbWUg6LWE5rqQ5ZCNXHJcbiAgICAgKiBAcGFyYW0gY2xzXHQgIOWvueW6lOWMheS4reexu+WQjVx0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJDbGFzcyhwa2dOYW1lOiBzdHJpbmcsIHJlc05hbWU6IHN0cmluZywgY2xzOiBhbnkpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKHBrZ05hbWUgJiYgIWZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRCeUlkKFwicmVzL2ZhaXJ1aS9cIitwa2dOYW1lKSkge1xyXG4gICAgICAgICAgICBmYWlyeWd1aS5VSVBhY2thZ2UuYWRkUGFja2FnZShcInJlcy9mYWlydWkvXCIrcGtnTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB1cmw6IHN0cmluZyA9IGZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRJdGVtVVJMKHBrZ05hbWUsIHJlc05hbWUpO1xyXG4gICAgICAgIGZhaXJ5Z3VpLlVJT2JqZWN0RmFjdG9yeS5zZXRQYWNrYWdlSXRlbUV4dGVuc2lvbih1cmwsIGNscyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7roh6rlrprkuYlmYWlyeWd1aee7hOS7tu+8jOW/hemhu+eUqOatpOaWueW8jyzkuI7ku6XkuIrmlrnms5Xlr7nlupTkvb/nlKgs5LiN6IO955u05o6l5L2/55SobmV3IGNscygp55qE5pa55byP5Yib5bu65LiA5Liq57uR5a6aZmFpcnlndWnnmoTnsbvvvIFcclxuICAgICAqIEBwYXJhbSBwa2dOYW1lIOWMheWQjVxyXG4gICAgICogQHBhcmFtIHJlc05hbWUg6LWE5rqQ5ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlR09iamVjdChwa2dOYW1lOiBzdHJpbmcsIHJlc05hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIGZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3RGcm9tVVJMKGZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRJdGVtVVJMKHBrZ05hbWUsIHJlc05hbWUpKTtcclxuICAgIH1cclxufSIsImltcG9ydCBQYW5lbFJlZ2lzdGVyIGZyb20gXCIuLi9QYW5lbFJlZ2lzdGVyXCI7XHJcbmltcG9ydCBFQnV0dG9uIGZyb20gXCIuLi92aWV3L2NvbXBvbmVudC9FQnV0dG9uXCI7XHJcbmltcG9ydCBCYXNlU3ByaXRlIGZyb20gXCIuLi92aWV3L2NvbXBvbmVudC9CYXNlU3ByaXRlXCI7XHJcblxyXG4vKipcclxuICogRmFpcnlndWnnrqHnkIZcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZhaXJ5VUlNYW5hZ2VyIHtcclxuXHJcbiAgICAvKiroo4Xovb0gKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHBhcmVudDogTGF5YS5TcHJpdGUgPSBudWxsO1xyXG5cclxuICAgIC8qKuS4u+eVjOmdouWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBtYWluTGF5ZXI6IEJhc2VTcHJpdGU7XHJcbiAgICAvKirnlYzpnaLlsYIgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgd2luZG93TGF5ZXI6IEJhc2VTcHJpdGU7XHJcbiAgICAvKiogKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcHJvbXB0TGF5ZXI6IEJhc2VTcHJpdGU7XHJcbiAgICAvKirlvLnmoYblsYIgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYWxlcnRMYXllcjogQmFzZVNwcml0ZTtcclxuICAgIC8qKumhtuWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0b3BMYXllcjogQmFzZVNwcml0ZTtcclxuICAgIC8qKnRpcOWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0aXBMYXllcjogQmFzZVNwcml0ZSA9IG51bGw7XHJcbiAgICAvKirlvJXlr7zlsYIgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ3VpZGVMYXllcjogQmFzZVNwcml0ZSA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdCggY29udGFpbmVyOkxheWEuU3ByaXRlICk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiggIXRoaXMucGFyZW50ICl7XHRcdFx0XHRcclxuICAgICAgICAgICAgRmFpcnlVSU1hbmFnZXIubWFpbkxheWVyID0gbmV3IEJhc2VTcHJpdGUoKTtcclxuICAgICAgICAgICAgRmFpcnlVSU1hbmFnZXIud2luZG93TGF5ZXIgPSBuZXcgQmFzZVNwcml0ZSgpO1xyXG4gICAgICAgICAgICBGYWlyeVVJTWFuYWdlci5wcm9tcHRMYXllciA9IG5ldyBCYXNlU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIEZhaXJ5VUlNYW5hZ2VyLnRvcExheWVyID0gbmV3IEJhc2VTcHJpdGUoKTtcclxuICAgICAgICAgICAgRmFpcnlVSU1hbmFnZXIuYWxlcnRMYXllciA9IG5ldyBCYXNlU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIEZhaXJ5VUlNYW5hZ2VyLnRpcExheWVyID0gbmV3IEJhc2VTcHJpdGUoKTtcclxuICAgICAgICAgICAgRmFpcnlVSU1hbmFnZXIuZ3VpZGVMYXllciA9IG5ldyBCYXNlU3ByaXRlKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKCBmYWlyeWd1aS5HUm9vdC5pbnN0LmRpc3BsYXlPYmplY3QgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGFpbmVyLmFkZENoaWxkKGZhaXJ5Z3VpLkdSb290Lmluc3QuZGlzcGxheU9iamVjdCk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBjb250YWluZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZChGYWlyeVVJTWFuYWdlci5tYWluTGF5ZXIpO1xyXG4gICAgICAgIGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoRmFpcnlVSU1hbmFnZXIud2luZG93TGF5ZXIpO1xyXG4gICAgICAgIGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoRmFpcnlVSU1hbmFnZXIucHJvbXB0TGF5ZXIpO1xyXG4gICAgICAgIGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoRmFpcnlVSU1hbmFnZXIuYWxlcnRMYXllcik7XHJcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZChGYWlyeVVJTWFuYWdlci50b3BMYXllcik7XHRcdFx0XHJcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZChGYWlyeVVJTWFuYWdlci50aXBMYXllcik7XHJcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZChGYWlyeVVJTWFuYWdlci5ndWlkZUxheWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogRmFpcnlVSU1hbmFnZXI7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IEZhaXJ5VUlNYW5hZ2VyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2UgfHwgbmV3IEZhaXJ5VUlNYW5hZ2VyKCk7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICog5Z+65LqOZmFpcnlndWkuR0J1dHRvbueahOWfuuexu+aMiemSrlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUJ1dHRvbiBleHRlbmRzIGZhaXJ5Z3VpLkdCdXR0b24ge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgXHJcbiAgICAgICAgc3VwZXIoKTsgXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgR2xvYmFsIGZyb20gXCIuLi8uLi8uLi9HbG9iYWxcIjtcclxuaW1wb3J0IEV2ZW50UG9vbCBmcm9tIFwiLi4vLi4vLi4vY29tL2V2ZW50cy9FdmVudFBvb2xcIjtcclxuXHJcbi8qKlxyXG4gKiBmYWlyeWd1aeWOn+S7tuWfuuexu1xyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVNwcml0ZSBleHRlbmRzIGZhaXJ5Z3VpLkdDb21wb25lbnQgaW1wbGVtZW50cyBJQ29tcG9uZW50e1xyXG5cclxuICAgIC8qKuaVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIF9kYXRhOiBhbnkgPSBudWxsO1xyXG4gICAgLyoq5piv5ZCm5Y+Y54GwICovXHJcbiAgICBwcm90ZWN0ZWQgX2lzR3JheTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLyoqXHJcbiAgICAgKiDnlKjkvKDlhaXnmoRmYWlyeXVpLkdDb21wb25lbnTovazljJbkuLpCYXNlU3ByaXRlXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBvd2VyOiBmYWlyeWd1aS5HQ29tcG9uZW50ID0gbnVsbDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2ljb25Mb2FkZXI6ZmFpcnlndWkuR0xvYWRlcjtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2N1cnJlbnRTdGF0ZTpzdHJpbmcgPSBcIlwiO1xyXG5cclxuXHRwcm90ZWN0ZWQgX2J1dHRvbkNvbnRyb2xsZXI6ZmFpcnlndWkuQ29udHJvbGxlcjtcclxuXHJcbiAgICAvL+S6i+S7tue8k+WtmOaxoFxyXG4gICAgcHJvdGVjdGVkIG1fZXZlbnRQb29sOiBFdmVudFBvb2wgPSBudWxsO1xyXG4gICAgLy/nu4Tku7bnvJPlrZjmsaBcclxuXHRwcm90ZWN0ZWQgbV9jb21wb25lbnREaWM6IExheWEuV2Vha09iamVjdCA9IG51bGw7XHJcbiAgICAgICAgXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29tcDogZmFpcnlndWkuR0NvbXBvbmVudCA9IG51bGwpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vd2VyID0gY29tcDtcclxuXHJcbiAgICAgICAgdGhpcy5tX2V2ZW50UG9vbCA9IEV2ZW50UG9vbC5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RGcm9tWE1MKHhtbDogYW55KTogdm9pZCB7XHJcblxyXG4gICAgICAgIHN1cGVyLmNvbnN0cnVjdEZyb21YTUwoeG1sKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0Q29udHJvbGxlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWIneWni+WMluaOp+WItuWZqCAqL1xyXG4gICAgcHJvdGVjdGVkIGluaXRDb250cm9sbGVyKCk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5fYnV0dG9uQ29udHJvbGxlciA9IHRoaXMuZ2V0Q29udHJvbGxlcihcImJ1dHRvblwiKTtcclxuICAgICAgICB0aGlzLl9pY29uTG9hZGVyID0gPGZhaXJ5Z3VpLkdMb2FkZXI+dGhpcy5nZXRDaGlsZChcImljb25cIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBjdXJyZW50U3RhdGUodmFsdWU6IHN0cmluZykge1xyXG5cdFx0XHRcclxuICAgICAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuX2J1dHRvbkNvbnRyb2xsZXIgKXtcclxuICAgICAgICAgICAgdGhpcy5fYnV0dG9uQ29udHJvbGxlci5zZWxlY3RlZFBhZ2UgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKirlvZPliY3nirbmgIEgKi9cclxuICAgIHB1YmxpYyBnZXQgY3VycmVudFN0YXRlKCk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50U3RhdGU7XHJcbiAgICB9XHRcdFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5YyF5ZCr5YWo5bGA5Z2Q5qCH54K5XHJcbiAgICAgKiBAcGFyYW0gZ3gg5YWo5bGAWOWdkOagh1xyXG4gICAgICogQHBhcmFtIGd5IOWFqOWxgFnlnZDmoIdcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnRhaW5zR2xvYmFsUG9pbnQoZ3g6IG51bWJlciwgZ3k6IG51bWJlcik6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICBsZXQgbHA6IExheWEuUG9pbnQgPSB0aGlzLmdsb2JhbFRvTG9jYWwoZ3gsIGd5KTtcclxuICAgICAgICBsZXQgYm91bmRzOiBMYXlhLlJlY3RhbmdsZSA9IG5ldyBMYXlhLlJlY3RhbmdsZSgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgcmV0dXJuIGJvdW5kcy5jb250YWlucyhscC54LCBscC55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2hpbGQoY2hpbGQ6IGZhaXJ5Z3VpLkdPYmplY3QpOiBmYWlyeWd1aS5HT2JqZWN0IHtcclxuXHJcbiAgICAgICAgaWYgKCBHbG9iYWwuaXMoIGNoaWxkICwgXCJJQ29tcG9uZW50XCIgKSApIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoPGFueT5jaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdXBlci5hZGRDaGlsZChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENoaWxkQXQoY2hpbGQ6IGZhaXJ5Z3VpLkdPYmplY3QsIGluZGV4OiBudW1iZXIpOiBmYWlyeWd1aS5HT2JqZWN0IHtcclxuXHJcbiAgICAgICAgaWYgKCBHbG9iYWwuaXMoIGNoaWxkICwgXCJJQ29tcG9uZW50XCIgKSApIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoPGFueT5jaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdXBlci5hZGRDaGlsZEF0KGNoaWxkLCBpbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmnaHnm65cclxuICAgICAqIEBwYXJhbSBuYW1lIOe7hOS7tuWQjeWtl1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RWxlbWVudChuYW1lOiBzdHJpbmcsIGNvbnRhaW5lcjogZmFpcnlndWkuR0NvbXBvbmVudCA9IG51bGwpOiBhbnkge1xyXG5cclxuICAgICAgICBjb250YWluZXIgPSBjb250YWluZXIgfHwgdGhpcztcclxuICAgICAgICByZXR1cm4gY29udGFpbmVyLmdldENoaWxkKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5YyF5ZCr5p+Q5Liq5a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb250YWlucyhjaGlsZDogZmFpcnlndWkuR09iamVjdCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZEluZGV4KGNoaWxkKSAhPSAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoExheWHljp/nlJ/lhYPku7ZcclxuICAgICAqIEBwYXJhbSBjaGlsZCBMYXlh5Y6f55Sf5pi+56S65a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRFZ3JldENoaWxkKGNoaWxkOiBMYXlhLk5vZGUpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmFkZENoaWxkKGNoaWxkKTtcclxuICAgIH1cclxuICAgIC8qKua3u+WKoExheWHljp/nlJ/lhYPku7ZcclxuICAgICAqIEBwYXJhbSBjaGlsZCBMYXlh5Y6f55Sf5pi+56S65a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRFZ3JldENoaWxkQXQoY2hpbGQ6IExheWEuTm9kZSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hZGRDaGlsZEF0KGNoaWxkLCBpbmRleCk7ICAgICAgICBcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog56e76ZmkTGF5YeWOn+eUn+WFg+S7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlRWdyZXRDaGlsZChjaGlsZDogTGF5YS5Ob2RlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmIChjaGlsZCAmJiB0aGlzLl9jb250YWluZXIuY29udGFpbnMoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZW1vdmVDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZCAmJiBjaGlsZC5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHRvdWNoRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXIubW91c2VFbmFibGVkID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0b3VjaEVuYWJsZWQoKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250YWluZXIubW91c2VFbmFibGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdG91Y2hDaGlsZHJlbih2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXIubW91c2VUaHJvdWdoID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0b3VjaENoaWxkcmVuKCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGFpbmVyLm1vdXNlVGhyb3VnaDtcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICBwdWJsaWMgYWRkRXZlbnRMaXN0ZW5lciggdHlwZTpzdHJpbmcgLCBsaXN0ZW5lcjpGdW5jdGlvbiAsIHRoaXNPYmplY3Q6YW55ICwgYXJnczpBcnJheTxhbnk+ID0gbnVsbCApOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMub24oIHR5cGUgLCB0aGlzT2JqZWN0ICwgbGlzdGVuZXIgLCBhcmdzIClcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZTpzdHJpbmcgLCBsaXN0ZW5lcjpGdW5jdGlvbiAsIHRoaXNPYmplY3Q6YW55ICk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5vZmYoIHR5cGUgLCB0aGlzT2JqZWN0ICwgbGlzdGVuZXIgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWinuWKoOebkeWQrOS6i+S7tuWHveaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkQWxsTGlzdGVuZXIoKTp2b2lkIHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLnJlbGlzdGVuZXJBbGwoKTtcclxuICAgICAgICAgICAgZm9yKCBsZXQga2V5IGluIHRoaXMubV9jb21wb25lbnREaWMgKXtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhOmFueSA9IHRoaXMubV9jb21wb25lbnREaWMuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgICAgIGlmKCBHbG9iYWwuaXMoIGRhdGEgLCBcIklDb21wb25lbnRcIiApKXtcclxuICAgICAgICAgICAgICAgICAgICAoPElDb21wb25lbnQ+ZGF0YSkuYWRkQWxsTGlzdGVuZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cdFx0XHRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOebkeWQrOS6i+S7tuWHveaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQWxsTGlzdGVuZXIoKTp2b2lkIHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YTphbnkgPSB0aGlzLm1fY29tcG9uZW50RGljLmdldCgga2V5ICk7XHJcbiAgICAgICAgICAgICAgICBpZiggR2xvYmFsLmlzKCBkYXRhICwgXCJJQ29tcG9uZW50XCIgKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgKDxJQ29tcG9uZW50PmRhdGEpLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHRcdFx0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDkuovku7bnm5HlkKxcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEdhbWVMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiwgdGhpc09iamVjdDogYW55ICwgdGFyZ2V0PzogYW55KSB7XHJcbiAgICAgICAgaWYoIHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLmFkZExpc3RlbmVyKCB0eXBlICwgbGlzdGVuZXIgLCB0YXJnZXQgLCB0aGlzT2JqZWN0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5LqL5Lu255uR5ZCsXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVHYW1lTGlzdGVuZXIodHlwZTogc3RyaW5nLCBsaXN0ZW5lcjogRnVuY3Rpb24sIHRoaXNPYmplY3Q6IGFueSAsIHRhcmdldD86IGFueSkge1xyXG4gICAgICAgIGlmKCB0aGlzLm1fZXZlbnRQb29sICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5tX2V2ZW50UG9vbC5yZW1vdmVMaXN0ZW5lciggdHlwZSAsIGxpc3RlbmVyICwgdGFyZ2V0ICwgdGhpc09iamVjdCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOe7hOS7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkQ29tcG9uZW50KGNvbXBvbmVudDogSUNvbXBvbmVudCk6IGFueSB7XHJcblxyXG4gICAgICAgIGlmKCBjb21wb25lbnQgKXtcclxuICAgICAgICAgICAgbGV0IGhhc2hDb2RlOm51bWJlciA9IGNvbXBvbmVudC5nZXRIYXNoQ29kZSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljLnNldCggaGFzaENvZGUgLCBjb21wb25lbnQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOe7hOS7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudDogSUNvbXBvbmVudCk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiggY29tcG9uZW50ICE9IG51bGwgKXtcclxuICAgICAgICAgICAgbGV0IGhhc2hDb2RlOm51bWJlciA9IGNvbXBvbmVudC5nZXRIYXNoQ29kZSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljLmRlbCggaGFzaENvZGUgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5omA5pyJ57uE5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVBbGxDb21wb25lbnQoKTp2b2lke1xyXG5cclxuICAgICAgICBmb3IobGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgIHRoaXMubV9jb21wb25lbnREaWMuZGVsKCBrZXkgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdGhpcy5tX2NvbXBvbmVudERpYy5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YeN572u55WM6Z2iXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOmFueSA9IHRoaXMubV9jb21wb25lbnREaWMuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgaWYoIEdsb2JhbC5pcyggZGF0YSAsIFwiSUNvbXBvbmVudFwiICkgKXtcclxuICAgICAgICAgICAgICAgICg8SUNvbXBvbmVudD5kYXRhKS5jbGVhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBkZXN0cm95Q29tcG9uZW50KCk6IHZvaWQge1xyXG4gICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOmFueSA9IHRoaXMubV9jb21wb25lbnREaWMuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgaWYoIEdsb2JhbC5pcyggZGF0YSAsIFwiSUNvbXBvbmVudFwiICkgKXtcclxuICAgICAgICAgICAgICAgICg8SUNvbXBvbmVudD5kYXRhKS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bllK/kuIBoYXNoQ29kZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0SGFzaENvZGUoKTogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXNbXCIkX0dJRFwiXSA9IHRoaXNbXCIkX0dJRFwiXSB8fCBMYXlhLlV0aWxzLmdldEdJRCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNEaXNwb3NlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpc1tcIl9kaXNwb3NlZFwiXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHiuaUvuaJgOaciei1hOa6kFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpOnZvaWR7XHJcblxyXG4gICAgICAgIGlmICh0aGlzW1wiX2Rpc3Bvc2VkXCJdKXsgLy9mYWlyeWd1aSDkuK3nmoTnp4HmnInlsZ7mgKdcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuZGlzcG9zZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1fZXZlbnRQb29sKSB7XHJcbiAgICAgICAgICAgIHRoaXMubV9ldmVudFBvb2wuZGlzcG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljID0gbnVsbDtcclxuICAgICAgICB0aGlzLm1fZXZlbnRQb29sID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJhc2VCdXR0b24gZnJvbSBcIi4vQmFzZUJ1dHRvblwiO1xyXG4vKipcclxuICog5bCB6KOFZmFpcnlndWnmjInpkq5cclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVCdXR0b24gZXh0ZW5kcyBCYXNlQnV0dG9uIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59Il19
