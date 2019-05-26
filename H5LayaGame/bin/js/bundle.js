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
var UIGMView_1 = require("./fairui/panel/UIGMView");
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
        fairygui.UIConfig.packageFileExtension = "map";
        FairyUIManager_1.default.init(Laya.stage);
        PanelRegister_1.default.registerClass("common", "EButton", EButton_1.default);
        FairyUIManager_1.default.open(UIGMView_1.default);
    };
    return GameClient;
}(Laya.Sprite));
exports.default = GameClient;
},{"./com/load/LoadSourceManager":5,"./com/load/utils/UrlUtils":11,"./fairui/PanelRegister":15,"./fairui/manager/FairyUIManager":16,"./fairui/panel/UIGMView":17,"./fairui/view/component/EButton":24}],2:[function(require,module,exports){
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
        LoadSourceManager.groupMap = {};
        EventManager_1.default.addEventListener(LoaderEvent_1.default.LOAD_SINGLE_COMPLETE, this.loadSingleComplete, this);
        EventManager_1.default.addEventListener(LoaderEvent_1.default.LOAD_GROUP_COMPLETE, this.loadGroupComplete, this);
        //Laya.timer.loop(10000, this, this.checkRes);//检测资源是否回收,暂定10秒钟回收一次
    };
    /**
     * 加载单个资源完成
     */
    LoadSourceManager.loadSingleComplete = function (source) {
        var res = typeof source === "string" ? this.getRes(source) : source;
        if (res != null) {
            var groupRes = null;
            var key = void 0;
            for (key in this.groupMap) {
                groupRes = this.groupMap[key];
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
            Log_1.default.log(this, "加载资源组[" + groupRes.name + "]完成!");
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
            if (this.groupMap[groupName] == null) {
                var groupRes = LoadSourceManager.create(grouplist, complete, progress);
                groupRes.name = groupName;
                groupRes.load();
                this.groupMap[groupName] = groupRes;
            }
            else if (complete != null) {
                complete.run();
            }
        }
        else {
            Laya.Log.print("已经有该资源组了！");
        }
    };
    /**
     * 创建加载资源类
     * @param url
     * @param complete
     * @param progress
     * @param error
     */
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
        else { //二进制资源
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
        return this.loadMap.get(url) || this.groupMap[url] != null;
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
                //Log.log(this, "开始加载资源 url: " + res.url, Log.TYPE_LOAD);//打印日志
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
        if (type == "") {
            type = Log.TYPE_DEBUG;
        }
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
        var funcList = this._eventDict.get(type);
        if (funcList) {
            var list = funcList.concat();
            var length_1 = list.length;
            if (length_1 > 0) {
                for (var i = 0; i < length_1; i++) {
                    try {
                        Log_1.default.log(this, "调度事件: " + type); //调度事件出错.
                        // list[i][0].apply(list[i][1], args);
                        var fun = list[i][0];
                        if (fun != null) {
                            fun.apply(list[i][1], args);
                        }
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
     *
     * @param pkgName 是否已注册资源包
     */
    PanelRegister.hasRegisterClass = function (pkgName) {
        return pkgName && !fairygui.UIPackage.getById("res/fairui/" + pkgName);
    };
    /**
     * 注册组件类与fairygui编辑器中类对应
     * @param pkgName 包名
     * @param resName 资源名
     * @param cls	  对应包中类名	,为null则只注册资源包
     */
    PanelRegister.registerClass = function (pkgName, resName, cls) {
        if (resName === void 0) { resName = ""; }
        if (cls === void 0) { cls = null; }
        if (pkgName && !fairygui.UIPackage.getById("res/fairui/" + pkgName)) {
            fairygui.UIPackage.addPackage("res/fairui/" + pkgName);
        }
        if (cls) {
            var url = fairygui.UIPackage.getItemURL(pkgName, resName);
            fairygui.UIObjectFactory.setPackageItemExtension(url, cls);
        }
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
var Log_1 = require("../../com/log/Log");
var BasePanel_1 = require("../view/BasePanel");
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
    /**
     * 打开面板
     * @param cls 面板类
     */
    FairyUIManager.open = function (cls) {
        if (cls != null) {
            try {
                var view = new cls();
                if (view instanceof BasePanel_1.BasePanel) {
                    view.load();
                    if (view.panelVo.isNormal) {
                        this.windowLayer.addChild(view);
                    }
                }
            }
            catch (e) {
                Log_1.default.error(this, "实列面板失败！");
            }
        }
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
},{"../../com/log/Log":12,"../view/BasePanel":19,"../view/component/BaseSprite":23}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel_1 = require("../view/BasePanel");
var Log_1 = require("../../com/log/Log");
var UIGMView = /** @class */ (function (_super) {
    __extends(UIGMView, _super);
    function UIGMView() {
        return _super.call(this, "common", "UIGMView") || this;
    }
    UIGMView.prototype.addAllListener = function () {
        _super.prototype.addAllListener.call(this);
        this.addGameListener(Laya.Event.CLICK, this.clickPlayBtnHandler, this, this.btn_play);
    };
    UIGMView.prototype.removeAllListener = function () {
        _super.prototype.removeAllListener.call(this);
    };
    UIGMView.prototype.clickPlayBtnHandler = function (e) {
        Log_1.default.log(this, "点击播放按钮");
    };
    return UIGMView;
}(BasePanel_1.BasePanel));
exports.default = UIGMView;
},{"../../com/log/Log":12,"../view/BasePanel":19}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { EGList } from "../view/component/EGList";
/**
 * FairyGUI工具
 * @author cl 2019.5.18
 */
var FairyUtils = /** @class */ (function () {
    function FairyUtils() {
    }
    /**
      * 声明容器对应变量
      * @param parent 		容器
      * @param thisObject 	this对象
      */
    FairyUtils.setVar = function (parent, thisObject) {
        if (parent != null && thisObject != null) {
            var disObj = void 0;
            for (var i = 0; i < parent.numChildren; i++) { //objects
                disObj = parent.getChildAt(i);
                if (disObj.name == "icon" || disObj.name == "title") {
                    continue;
                }
                if (disObj.name && disObj.name.indexOf("tab_") == 0 && disObj instanceof fairygui.GGroup) {
                    // thisObject[disObj.name] = new fairui.ETab(disObj, thisObject);
                    // if (thisObject instanceof BaseSprite) thisObject.addComponent(thisObject[disObj.name]);
                }
                else if (disObj.name && disObj.name.indexOf("eglist_") == 0 && disObj instanceof fairygui.GList) {
                    // thisObject[disObj.name] = new EGList(disObj, thisObject);
                    // if (thisObject instanceof BaseSprite) thisObject.addComponent(thisObject[disObj.name]);
                }
                else {
                    thisObject[disObj.name] = disObj;
                }
            }
            for (var i = 0; i < parent._transitions.length; i++) {
                var transObj = void 0;
                transObj = parent._transitions[i];
                thisObject[transObj.name] = transObj;
            }
        }
    };
    return FairyUtils;
}());
exports.FairyUtils = FairyUtils;
},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var View_1 = require("./View");
var FairyUtils_1 = require("../utils/FairyUtils");
var PanelVo_1 = require("../vo/PanelVo");
var LoadSourceManager_1 = require("../../com/load/LoadSourceManager");
var UrlUtils_1 = require("../../com/load/utils/UrlUtils");
var PanelRegister_1 = require("../PanelRegister");
/**
 * 面板基类
 * @author cl 2018.5.18
 */
var BasePanel = /** @class */ (function (_super) {
    __extends(BasePanel, _super);
    /**
     * 面板基类
     * @param pkgName 包名
     * @param resName 对应面板名字
     */
    function BasePanel(pkgName, resName) {
        if (pkgName === void 0) { pkgName = ""; }
        if (resName === void 0) { resName = ""; }
        var _this = _super.call(this) || this;
        _this.view = null;
        /**传 false 表示不绑定点击遮罩关闭面板事件 */
        // protected openTapMask: boolean;
        // /**包名 */
        // protected _pkgName: string = "";
        // /**类名 */
        // protected _resName: string = "";
        /**面板数据 */
        _this._panelVo = null;
        _this._panelVo = new PanelVo_1.default();
        _this._panelVo.pkgName = pkgName;
        _this._panelVo.resName = resName;
        _this.load();
        return _this;
    }
    BasePanel.prototype.constructFromXML = function (xml) {
        _super.prototype.constructFromXML.call(this, xml);
        //FairyUtils.setVar(this, this);
    };
    /**
     * 加载资源
     */
    BasePanel.prototype.load = function () {
        var urls = UrlUtils_1.default.getFairyGroup("common");
        LoadSourceManager_1.default.loadGroup("common", urls, Laya.Handler.create(this, this.init));
    };
    Object.defineProperty(BasePanel.prototype, "panelVo", {
        /**面板数据 */
        get: function () {
            return this._panelVo;
        },
        enumerable: true,
        configurable: true
    });
    BasePanel.prototype.init = function () {
        // if ( this._panelVo.pkgName && !fairygui.UIPackage.getById(this._panelVo.pkgName)) {
        //     fairygui.UIPackage.addPackage(this._panelVo.pkgName);
        // }
        PanelRegister_1.default.registerClass(this._panelVo.pkgName);
        // this._panelVo.openTapMask = true;
        var obj = fairygui.UIPackage.createObject(this._panelVo.pkgName, this._panelVo.resName);
        this.view = obj.asCom;
        this.addChild(this.view);
        FairyUtils_1.FairyUtils.setVar(this.view, this);
        this.initUI();
        this.onResize();
    };
    BasePanel.prototype.initUI = function () {
        // if (this.titleBar != null) {
        //     this.btn_close = this.titleBar.btn_close;
        // }
    };
    BasePanel.prototype.addAllListener = function () {
        _super.prototype.addAllListener.call(this);
        if (this.btn_close != null) {
            this.addGameListener(Laya.Event.CLICK, this.closeHandler, this.btn_close);
        }
        this.addGameListener(GameEvent.STGAE_RESIZE, this.onResize, this);
    };
    /**
     * 设置标题皮肤
     * @author pkgName 包名
     * @author resName 资源名
     */
    BasePanel.prototype.setTitleSkin = function (pkgName, resName) {
        // if (this.titleBar != null) {
        //     this.titleBar.setTitleSkin(pkgName, resName);
        // }
    };
    /**
     * 获取界面子元件
     */
    BasePanel.prototype.getViewChild = function (name) {
        return this.view ? this.view.getChild(name) : null;
    };
    /**
    * 渲染列表条目方法
    * @param index  对应条目索引
    * @param obj    渲染对象
    */
    BasePanel.prototype.renderListItem = function (index, obj) {
    };
    /**关闭事件 */
    BasePanel.prototype.closeHandler = function () {
        this.close();
    };
    /**
     * 关闭面板
     */
    BasePanel.prototype.close = function (isHideGuide) {
        if (isHideGuide === void 0) { isHideGuide = true; }
        // FairyUIManager.closePanel(this, this.canDispose);
    };
    Object.defineProperty(BasePanel.prototype, "canDispose", {
        /**
         * 界面是否可释放
         */
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    /**点击Mask层,关闭面板 */
    BasePanel.prototype.tapMask = function (e) {
        this.close();
    };
    /**
     * 显示
     */
    BasePanel.prototype.show = function (data) {
        this.visible = true;
        // super.show(data);//这句话一定要放在this.visible = true之后执行,不然面板事件注册不了  
        this.initData(data);
    };
    /**
     * 隐藏
     */
    BasePanel.prototype.hide = function () {
        if (this.visible) {
            this.clear();
        }
        this.visible = false;
    };
    /**
     * 转化为对应的类
     */
    BasePanel.prototype.toClass = function () {
        var clsName = typeof this;
        return Laya.ClassUtils.getClass(clsName);
    };
    /**
     * 自适应
     */
    BasePanel.prototype.onResize = function () {
    };
    /**
     * 清理数据
     */
    BasePanel.prototype.clear = function () {
        _super.prototype.clear.call(this);
    };
    /**
     * 释放资源,不允许外部直接调用这个方法
     */
    BasePanel.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.view = null;
        this._data = null;
        if (this._panelVo != null) {
            this._panelVo.dispose();
        }
        this._panelVo = null;
    };
    return BasePanel;
}(View_1.default));
exports.BasePanel = BasePanel;
},{"../../com/load/LoadSourceManager":5,"../../com/load/utils/UrlUtils":11,"../PanelRegister":15,"../utils/FairyUtils":18,"../vo/PanelVo":25,"./View":21}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSprite_1 = require("./component/BaseSprite");
/**
  * UI显示代理类
  * @author clong 2019.5.18
  */
var UIComponent = /** @class */ (function (_super) {
    __extends(UIComponent, _super);
    function UIComponent() {
        var _this = _super.call(this) || this;
        /**是否打开过界面 */
        _this.isOpened = false;
        /**是否初始化执行结束 */
        _this.isComplyed = false;
        return _this;
    }
    UIComponent.prototype.constructFromXML = function (xml) {
        _super.prototype.constructFromXML.call(this, xml);
        this.init(null);
    };
    UIComponent.prototype.isInited = function () {
        return !this.isComplyed;
    };
    UIComponent.prototype.initComplete = function () {
        //检测初始化是否完成
        if (!this.isInited()) {
            return false;
        }
        if (!this.isOpened) {
            this.isOpened = true;
            this.initUI();
        }
        this.initData(this.param);
        this.addAllListener();
        this.isComplyed = true;
        return true;
    };
    /**
      * 外部不要调用
      */
    UIComponent.prototype.init = function (param) {
        this.param = param;
        this.initComplete();
    };
    /**
      * 初始化UI界面
      */
    UIComponent.prototype.initUI = function () {
    };
    /**
      * 初始化参数
      */
    UIComponent.prototype.initData = function (param) {
        if (param === void 0) { param = null; }
    };
    /**
      * 关闭界面时调用
      */
    UIComponent.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.param = null;
        this.isComplyed = false;
    };
    UIComponent.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.param = null;
    };
    return UIComponent;
}(BaseSprite_1.default));
exports.default = UIComponent;
},{"./component/BaseSprite":23}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UIComponent_1 = require("./UIComponent");
/**
 * View基类
 * @author clong 2019.5.18
 */
var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View() {
        var _this = _super.call(this) || this;
        _this.cls = null;
        //释放时间
        _this.gcTime = 0;
        return _this;
    }
    /**获取当前组件Class类 */
    View.prototype.getCls = function () {
        return this.cls;
    };
    //------------------------------------------------
    /**加载资源 */
    View.prototype.load = function () {
        this.init(null);
    };
    View.prototype.init = function (param) {
        _super.prototype.init.call(this, param);
        this.gcTime = Number.MAX_VALUE;
    };
    //初始化UI
    View.prototype.initUI = function () {
    };
    /**
      * 自适应接口
      */
    View.prototype.onResize = function () {
    };
    /**
      * 是否可回收
      */
    View.prototype.isCanGc = function () {
        return Laya.timer.currFrame > this.gcTime; // Global.timer.currFrame >= this.gcTime;
    };
    /**
      * 重置,每次关闭界面调用
      */
    View.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.gcTime = Laya.timer.currFrame + View.CACHE_TIME;
    };
    /**
      * 销毁，完全销毁对象和资源
      * 接口除了组件你们其它地方不要调用这个接口
      * 只有回收资源的时候会调用一次
      */
    View.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.cls = null;
    };
    /**资源可释放后缓存时间,毫秒 */
    View.CACHE_TIME = 5000;
    return View;
}(UIComponent_1.default));
exports.default = View;
},{"./UIComponent":20}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
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
},{"../../../Global":2,"../../../com/events/EventPool":4}],24:[function(require,module,exports){
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
},{"./BaseButton":22}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 面板数据
 * @author clong 2019.5.26
 */
var PanelVo = /** @class */ (function () {
    function PanelVo() {
        /**面板ID */
        this.id = 0;
        /**面板类型 */
        this.type = 0;
        /**层级 0为默认界面层 */
        this.layer = 0;
        /**传 false 表示不绑定点击遮罩关闭面板事件 */
        this.openTapMask = false;
        /**fairygui 对应包名 */
        this.pkgName = "";
        /**fairygui 对应包资源名 */
        this.resName = "";
    }
    Object.defineProperty(PanelVo.prototype, "isNormal", {
        get: function () {
            return this.type == 0;
        },
        enumerable: true,
        configurable: true
    });
    PanelVo.prototype.dispose = function () {
        this.pkgName = "";
        this.resName = "";
        this.type = 0;
        this.id = 0;
        this.openTapMask = false;
    };
    return PanelVo;
}());
exports.default = PanelVo;
},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L1Byb2dyYW0gRmlsZXMgKHg4NikvTGF5YUFpcklERV8yLjEuMGJldGExL3Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9HYW1lQ2xpZW50LnRzIiwic3JjL0dsb2JhbC50cyIsInNyYy9NYWluLnRzIiwic3JjL2NvbS9ldmVudHMvRXZlbnRQb29sLnRzIiwic3JjL2NvbS9sb2FkL0xvYWRTb3VyY2VNYW5hZ2VyLnRzIiwic3JjL2NvbS9sb2FkL2V2ZW50L0xvYWRlckV2ZW50LnRzIiwic3JjL2NvbS9sb2FkL3Jlc291cmNlL0dyb3VwUmVzb3VyY2UudHMiLCJzcmMvY29tL2xvYWQvcmVzb3VyY2UvUmVzb3VyY2UudHMiLCJzcmMvY29tL2xvYWQvcmVzb3VyY2UvVHh0UmVzb3VyY2UudHMiLCJzcmMvY29tL2xvYWQvdXRpbHMvTG9hZFV0aWxzLnRzIiwic3JjL2NvbS9sb2FkL3V0aWxzL1VybFV0aWxzLnRzIiwic3JjL2NvbS9sb2cvTG9nLnRzIiwic3JjL2NvbS9sb2cvTG9nVm8udHMiLCJzcmMvY29tL21hbmFnZXIvRXZlbnRNYW5hZ2VyLnRzIiwic3JjL2ZhaXJ1aS9QYW5lbFJlZ2lzdGVyLnRzIiwic3JjL2ZhaXJ1aS9tYW5hZ2VyL0ZhaXJ5VUlNYW5hZ2VyLnRzIiwic3JjL2ZhaXJ1aS9wYW5lbC9VSUdNVmlldy50cyIsInNyYy9mYWlydWkvdXRpbHMvRmFpcnlVdGlscy50cyIsInNyYy9mYWlydWkvdmlldy9CYXNlUGFuZWwudHMiLCJzcmMvZmFpcnVpL3ZpZXcvVUlDb21wb25lbnQudHMiLCJzcmMvZmFpcnVpL3ZpZXcvVmlldy50cyIsInNyYy9mYWlydWkvdmlldy9jb21wb25lbnQvQmFzZUJ1dHRvbi50cyIsInNyYy9mYWlydWkvdmlldy9jb21wb25lbnQvQmFzZVNwcml0ZS50cyIsInNyYy9mYWlydWkvdmlldy9jb21wb25lbnQvRUJ1dHRvbi50cyIsInNyYy9mYWlydWkvdm8vUGFu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c0JBQVcsNkJBQVE7YUFBbkI7WUFFSSxPQUFPLElBQUksQ0FBQyxJQUFJLElBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUM7OztPQUFBO0lBRU0seUJBQU8sR0FBZDtRQUVJLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDWixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBQ0wsY0FBQztBQUFELENBakNBLEFBaUNDLElBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEZhaXJ5VUlNYW5hZ2VyIGZyb20gXCIuL2ZhaXJ1aS9tYW5hZ2VyL0ZhaXJ5VUlNYW5hZ2VyXCI7XHJcbmltcG9ydCBQYW5lbFJlZ2lzdGVyIGZyb20gXCIuL2ZhaXJ1aS9QYW5lbFJlZ2lzdGVyXCI7XHJcbmltcG9ydCBFQnV0dG9uIGZyb20gXCIuL2ZhaXJ1aS92aWV3L2NvbXBvbmVudC9FQnV0dG9uXCI7XHJcbmltcG9ydCBMb2FkU291cmNlTWFuYWdlciwgeyBMb2FkZXJNYW5hZ2VyIH0gZnJvbSBcIi4vY29tL2xvYWQvTG9hZFNvdXJjZU1hbmFnZXJcIjtcclxuaW1wb3J0IFVybFV0aWxzIGZyb20gXCIuL2NvbS9sb2FkL3V0aWxzL1VybFV0aWxzXCI7XHJcbmltcG9ydCBVSUdNVmlldyBmcm9tIFwiLi9mYWlydWkvcGFuZWwvVUlHTVZpZXdcIjtcclxuXHJcbi8qKlxyXG4gKiDmuLjmiI/kuLvlrqLmiLfnq69cclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDbGllbnQgZXh0ZW5kcyBMYXlhLlNwcml0ZSB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBzdXBlcigpOyBcclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXQoKTp2b2lke1xyXG5cclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKGZhaXJ5Z3VpLkdSb290Lmluc3QuZGlzcGxheU9iamVjdCk7XHJcblxyXG4gICAgICAgIC8vIExheWEubG9hZGVyLmxvYWQoW1xyXG5cdFx0Ly8gXHR7IHVybDogXCJyZXMvZmFpcnVpL2NvbW1vbl9hdGxhczAucG5nXCIsIHR5cGU6IExheWEuTG9hZGVyLklNQUdFIH0sXHJcblx0XHQvLyBcdHsgdXJsOiBcInJlcy9mYWlydWkvY29tbW9uLm1hcFwiLCB0eXBlOiBMYXlhLkxvYWRlci5CVUZGRVIgfVxyXG4gICAgICAgIC8vICAgICBdLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Mb2FkZWQpKTtcclxuICAgICAgICBsZXQgdXJsczpBcnJheTxzdHJpbmc+ID0gVXJsVXRpbHMuZ2V0RmFpcnlHcm91cCggXCJjb21tb25cIiApO1xyXG4gICAgICAgIExvYWRTb3VyY2VNYW5hZ2VyLmxvYWRHcm91cCggXCJjb21tb25cIiAsIHVybHMgLCBMYXlhLkhhbmRsZXIuY3JlYXRlKCB0aGlzICwgdGhpcy5vbkxvYWRlZCApICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkxvYWRlZCgpOnZvaWR7XHJcblxyXG5cdFx0Ly8gZmFpcnlndWkuVUlQYWNrYWdlLmFkZFBhY2thZ2UoXCJyZXMvZmFpcnVpL2NvbW1vblwiKTtcdFx0XHJcbiAgICAgICAgLy8gZmFpcnlndWkuVUlDb25maWcuZGVmYXVsdEZvbnQgPSBcIk1pY3Jvc29mdCBZYUhlaVwiO1xyXG4gICAgICAgIC8vIGZhaXJ5Z3VpLlVJQ29uZmlnLnZlcnRpY2FsU2Nyb2xsQmFyID0gXCJ1aTovL0Jhc2ljL1Njcm9sbEJhcl9WVFwiO1xyXG4gICAgICAgIC8vIGZhaXJ5Z3VpLlVJQ29uZmlnLmhvcml6b250YWxTY3JvbGxCYXIgPSBcInVpOi8vQmFzaWMvU2Nyb2xsQmFyX0haXCI7XHJcbiAgICAgICAgLy8gZmFpcnlndWkuVUlDb25maWcucG9wdXBNZW51ID0gXCJ1aTovL0Jhc2ljL1BvcHVwTWVudVwiO1xyXG4gICAgICAgIGZhaXJ5Z3VpLlVJQ29uZmlnLnBhY2thZ2VGaWxlRXh0ZW5zaW9uID0gXCJtYXBcIjtcclxuXHJcbiAgICAgICAgRmFpcnlVSU1hbmFnZXIuaW5pdCggTGF5YS5zdGFnZSApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFBhbmVsUmVnaXN0ZXIucmVnaXN0ZXJDbGFzcyhcImNvbW1vblwiLCBcIkVCdXR0b25cIiwgRUJ1dHRvbiApO1xyXG5cclxuICAgICAgICBGYWlyeVVJTWFuYWdlci5vcGVuKCBVSUdNVmlldyApO1xyXG5cdH1cclxufSIsImltcG9ydCBHYW1lQ2xpZW50IGZyb20gXCIuL0dhbWVDbGllbnRcIjtcclxuaW1wb3J0IExvYWRTb3VyY2VNYW5hZ2VyIGZyb20gXCIuL2NvbS9sb2FkL0xvYWRTb3VyY2VNYW5hZ2VyXCI7XHJcbmltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSBcIi4vY29tL21hbmFnZXIvRXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCBMb2cgZnJvbSBcIi4vY29tL2xvZy9Mb2dcIjtcclxuXHJcbi8qKlxyXG4gKiDlhajlsYDlj4LmlbBcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdsb2JhbCB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB3aWR0aDpudW1iZXI9NjQwO1xyXG4gICAgcHVibGljIHN0YXRpYyBoZWlnaHQ6bnVtYmVyPTExMzY7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJmaXhlZHdpZHRoXCI7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNjcmVlbk1vZGU6c3RyaW5nPVwibm9uZVwiOy8vaG9yaXpvbnRhbFxyXG4gICAgcHVibGljIHN0YXRpYyBhbGlnblY6c3RyaW5nPVwidG9wXCI7XHJcbiAgICBwdWJsaWMgc3RhdGljIGFsaWduSDpzdHJpbmc9XCJsZWZ0XCI7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgcHVibGljIHN0YXRpYyBzdGF0OmJvb2xlYW49ZmFsc2U7XHJcbiAgICBwdWJsaWMgc3RhdGljIHBoeXNpY3NEZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgcHVibGljIHN0YXRpYyBleHBvcnRTY2VuZVRvSnNvbjpib29sZWFuPXRydWU7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhajlsYDliJ3lp4vljJZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpbml0KCk6dm9pZHtcclxuXHJcbiAgICAgICAgTG9nLmluaXQoKTtcclxuICAgICAgICBFdmVudE1hbmFnZXIuaW5pdCgpO1xyXG4gICAgICAgIExvYWRTb3VyY2VNYW5hZ2VyLmluaXQoKTtcclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKCBuZXcgR2FtZUNsaWVudCgpICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcblx0ICog5Yik5pat5a+56LGh5piv5ZCm5Li65a+55bqU57G75oiW5o6l5Y+jXHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyBpcyggdGFyZ2V0OmFueSAsIGNsczphbnkgKTpib29sZWFue1xyXG5cclxuICAgICAgICBpZiggIXRhcmdldCApe1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cdFx0cmV0dXJuIExheWFbXCJfX3R5cGVvZlwiXSggdGFyZ2V0ICwgY2xzICk7XHJcblx0fVxyXG59IiwiaW1wb3J0IEdsb2JhbCBmcm9tIFwiLi9HbG9iYWxcIjtcclxuY2xhc3MgTWFpbiB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cclxuXHRcdExheWEuaW5pdCgxMTM2LCA2NDAsIExheWEuV2ViR0wpO1xyXG5cdFx0Ly8gTGF5YS5pbml0KCBHbG9iYWwud2lkdGggLCBHbG9iYWwuaGVpZ2h0ICwgTGF5YS5XZWJHTCk7XHJcbiAgICAgICAgbGF5YS51dGlscy5TdGF0LnNob3coMCwgMCk7XHJcbiAgICAgICAgLy/orr7nva7pgILphY3mqKHlvI9cclxuICAgICAgICBMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IFwic2hvd2FsbFwiO1xyXG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25IID0gXCJsZWZ0XCI7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5hbGlnblYgPSBcInRvcFwiO1xyXG4gICAgICAgIC8v6K6+572u5qiq56uW5bGPXHJcbiAgICAgICAgTGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2xvYmFsLnNjcmVlbk1vZGU7Ly8gXCJob3Jpem9udGFsXCI7XHJcblxyXG4gICAgICAgIC8v5qC55o2uSURF6K6+572u5Yid5aeL5YyW5byV5pOOXHRcdFxyXG5cdFx0aWYgKHdpbmRvd1tcIkxheWEzRFwiXSl7XHJcbiAgICAgICAgICAgIExheWEzRC5pbml0KEdsb2JhbC53aWR0aCwgR2xvYmFsLmhlaWdodCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIExheWEuaW5pdChHbG9iYWwud2lkdGgsIEdsb2JhbC5oZWlnaHQsIExheWFbXCJXZWJHTFwiXSk7XHJcbiAgICAgICAgfSBcclxuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IEdsb2JhbC5zY2FsZU1vZGU7XHJcblx0XHRMYXlhLnN0YWdlLnNjcmVlbk1vZGUgPSBHbG9iYWwuc2NyZWVuTW9kZTtcclxuXHRcdC8v5YW85a655b6u5L+h5LiN5pSv5oyB5Yqg6L29c2NlbmXlkI7nvIDlnLrmma9cclxuICAgICAgICAvL0xheWEuVVJMLmV4cG9ydFNjZW5lVG9Kc29uID0gR2xvYmFsLmV4cG9ydFNjZW5lVG9Kc29uO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8v5omT5byA6LCD6K+V6Z2i5p2/77yI6YCa6L+HSURF6K6+572u6LCD6K+V5qih5byP77yM5oiW6ICFdXJs5Zyw5Z2A5aKe5YqgZGVidWc9dHJ1ZeWPguaVsO+8jOWdh+WPr+aJk+W8gOiwg+ivlemdouadv++8iVxyXG5cdFx0aWYgKEdsb2JhbC5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG5cdFx0aWYgKEdsb2JhbC5waHlzaWNzRGVidWcgJiYgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0pIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdLmVuYWJsZSgpO1xyXG5cdFx0aWYgKEdsb2JhbC5zdGF0KSBMYXlhLlN0YXQuc2hvdygpO1xyXG5cdFx0TGF5YS5hbGVydEdsb2JhbEVycm9yID0gdHJ1ZTtcclxuXHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0TGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcclxuXHR9XHJcblxyXG5cdG9uVmVyc2lvbkxvYWRlZCgpOiB2b2lkIHtcclxuXHRcdC8v5r+A5rS75aSn5bCP5Zu+5pig5bCE77yM5Yqg6L295bCP5Zu+55qE5pe25YCZ77yM5aaC5p6c5Y+R546w5bCP5Zu+5Zyo5aSn5Zu+5ZCI6ZuG6YeM6Z2i77yM5YiZ5LyY5YWI5Yqg6L295aSn5Zu+5ZCI6ZuG77yM6ICM5LiN5piv5bCP5Zu+XHJcblx0XHQvL0xheWEuQXRsYXNJbmZvTWFuYWdlci5lbmFibGUoXCJmaWxlY29uZmlnLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQ29uZmlnTG9hZGVkKSk7XHJcblxyXG5cdFx0XHJcblx0XHRHbG9iYWwuaW5pdCgpXHJcblx0fVxyXG5cclxuXHRvbkNvbmZpZ0xvYWRlZCgpOiB2b2lkIHtcclxuXHRcdC8v5Yqg6L29SURF5oyH5a6a55qE5Zy65pmvXHJcblx0XHQvL0dhbWVDb25maWcuc3RhcnRTY2VuZSAmJiBMYXlhLlNjZW5lLm9wZW4oR2FtZUNvbmZpZy5zdGFydFNjZW5lKTtcclxuXHR9XHJcbn1cclxuLy/mv4DmtLvlkK/liqjnsbtcclxubmV3IE1haW4oKTtcclxuIiwiaW1wb3J0IEV2ZW50TWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlci9FdmVudE1hbmFnZXJcIjtcclxuXHJcbi8qKlxyXG4gKiDkuovku7bmsaBcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjQuMjBcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50UG9vbCB7XHJcblxyXG5cdHByaXZhdGUgc3RhdGljIHBvb2w6QXJyYXk8RXZlbnRQb29sPiA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKCk6RXZlbnRQb29se1xyXG5cclxuICAgICAgICBsZXQgb2JqOkV2ZW50UG9vbCA9IEV2ZW50UG9vbC5wb29sLnNoaWZ0KCk7XHJcbiAgICAgICAgaWYoIG9iaiA9PSBudWxsICl7XHJcbiAgICAgICAgICAgIG9iaiA9IG5ldyBFdmVudFBvb2woKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlY292ZXIoIG9iajpFdmVudFBvb2wgKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggb2JqICE9IG51bGwgJiYgRXZlbnRQb29sLnBvb2wuaW5kZXhPZiggb2JqICkgPT0gLTEgKXtcclxuICAgICAgICAgICAgRXZlbnRQb29sLnBvb2wucHVzaCggb2JqICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRwcml2YXRlIF9ldmVudE9iakxpc3Q6QXJyYXk8RXZlbnRPYmo+ID0gbnVsbDtcclxuXHJcblx0cHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuXHRcdHRoaXMuX2V2ZW50T2JqTGlzdCA9IFtdO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog5re75Yqg5LqL5Lu255uR5ZCsXHJcblx0ICogQHBhcmFtIHR5cGUgXHRcdOS6i+S7tuexu+Wei1xyXG5cdCAqIEBwYXJhbSBsaXN0ZW5lciBcdOS6i+S7tuaWueazlVxyXG5cdCAqIEBwYXJhbSB0YXJnZXRcdOS6i+S7tuWvueixoVxyXG5cdCAqIEBwYXJhbSB0aGlzT2JqXHJcblx0ICovXHJcblx0cHVibGljIGFkZExpc3RlbmVyKCB0eXBlOnN0cmluZyAsIGxpc3RlbmVyOkZ1bmN0aW9uICwgdGFyZ2V0OkxheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCAsIHRoaXNPYmo6YW55ICk6dm9pZHtcclxuXHJcblx0XHRpZiggIXRoaXMuaGFzRXZlbnRMaXN0ZW5lcih0eXBlLGxpc3RlbmVyLHRhcmdldCx0aGlzT2JqKSApe1xyXG5cdFx0XHRsZXQgb2JqOkV2ZW50T2JqID0gRXZlbnRPYmouY3JlYXRlKCB0eXBlICwgbGlzdGVuZXIgLCB0YXJnZXQgLCB0aGlzT2JqICk7XHJcblx0XHRcdHRoaXMuX2V2ZW50T2JqTGlzdC5wdXNoKCBvYmogKTtcclxuXHRcdFx0RXZlbnRNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoIHR5cGUgLCBsaXN0ZW5lciAsIHRoaXNPYmogLCB0YXJnZXQgKTtcdFx0XHRcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOenu+mZpOS6i+S7tuebkeWQrFxyXG5cdCAqIEBwYXJhbSB0eXBlIFx0XHTkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW0gbGlzdGVuZXIgXHTkuovku7bmlrnms5VcclxuXHQgKiBAcGFyYW0gdGFyZ2V0XHTkuovku7blr7nosaFcclxuXHQgKiBAcGFyYW0gdGhpc09ialx0XHJcblx0ICovXHJcblx0cHVibGljIHJlbW92ZUxpc3RlbmVyKCB0eXBlOnN0cmluZyAsIGxpc3RlbmVyOkZ1bmN0aW9uICwgdGFyZ2V0OkxheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCAsIHRoaXNPYmo6YW55ICk6dm9pZHtcclxuXHJcblx0XHRsZXQgb2JqOkV2ZW50T2JqID0gbnVsbDtcclxuXHRcdGZvciggbGV0IGk9MDtpPHRoaXMuX2V2ZW50T2JqTGlzdC5sZW5ndGg7aSsrICl7XHJcblx0XHRcdG9iaiA9IHRoaXMuX2V2ZW50T2JqTGlzdFtpXTtcclxuXHRcdFx0aWYoIG9iaiAmJiBvYmoudHlwZSA9PSB0eXBlICYmIG9iai5saXN0ZW5lciA9PSBsaXN0ZW5lciAmJiBvYmoudGhpc09iaiA9PSB0aGlzT2JqICl7XHJcblx0XHRcdFx0dGhpcy5fZXZlbnRPYmpMaXN0LnNwbGljZShpLDEpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRFdmVudE1hbmFnZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZSAsIGxpc3RlbmVyICwgdGhpc09iaiAsIHRhcmdldCApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog56e76Zmk5rGg6YeM5omA5pyJ5LqL5Lu255uR5ZCsLOS/neaMgeeahOWvueixoeS4jeS7juWIl+ihqOmHjOenu+mZpFxyXG5cdCAqL1xyXG5cdHB1YmxpYyByZW1vdmVBbGxMaXN0ZW5lcigpOnZvaWR7XHJcblxyXG5cdFx0bGV0IG9iajpFdmVudE9iaiA9IG51bGw7XHJcblx0XHRmb3IoIGxldCBpPTA7aTx0aGlzLl9ldmVudE9iakxpc3QubGVuZ3RoO2krKyApe1xyXG5cdFx0XHRvYmogPSB0aGlzLl9ldmVudE9iakxpc3RbaV07XHJcblx0XHRcdGlmKCBvYmogKXtcclxuXHRcdFx0XHRFdmVudE1hbmFnZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggb2JqLnR5cGUgLCBvYmoubGlzdGVuZXIgLCBvYmoudGhpc09iaiAsIG9iai50YXJnZXQgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog6YeN5paw55uR5ZCs5omA5pyJ5LqL5Lu2XHJcblx0ICovXHJcblx0cHVibGljIHJlbGlzdGVuZXJBbGwoKTp2b2lke1xyXG5cclxuXHRcdGxldCBvYmo6RXZlbnRPYmogPSBudWxsO1xyXG5cdFx0Zm9yKCBsZXQgaT0wO2k8dGhpcy5fZXZlbnRPYmpMaXN0Lmxlbmd0aDtpKysgKXtcclxuXHRcdFx0b2JqID0gdGhpcy5fZXZlbnRPYmpMaXN0W2ldO1xyXG5cdFx0XHRpZiggb2JqICl7XHJcblx0XHRcdFx0RXZlbnRNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoIG9iai50eXBlICwgb2JqLmxpc3RlbmVyICwgb2JqLnRoaXNPYmogLCBvYmoudGFyZ2V0ICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOaYr+WQpuacieafkOS4quebkeWQrFxyXG5cdCAqIEBwYXJhbSB0eXBlIFx0XHTkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW0gbGlzdGVuZXIgXHTkuovku7bmlrnms5VcclxuXHQgKiBAcGFyYW0gdGFyZ2V0XHTkuovku7blr7nosaFcclxuXHQgKiBAcGFyYW0gdGhpc09ialx0XHJcblx0ICovXHJcblx0cHVibGljIGhhc0V2ZW50TGlzdGVuZXIoIHR5cGU6c3RyaW5nICwgbGlzdGVuZXI6RnVuY3Rpb24gLCB0YXJnZXQ6TGF5YS5FdmVudERpc3BhdGNoZXIgPSBudWxsICwgdGhpc09iajphbnkgKTpib29sZWFue1xyXG5cclxuXHRcdGxldCBvYmo6RXZlbnRPYmogPSBudWxsO1xyXG5cdFx0Zm9yKCBvYmogb2YgdGhpcy5fZXZlbnRPYmpMaXN0ICl7XHJcblx0XHRcdGlmKCBvYmogJiYgb2JqLnR5cGUgPT0gdHlwZSAmJiBvYmoubGlzdGVuZXIgPT0gbGlzdGVuZXIgKXtcclxuXHRcdFx0XHRpZiggdGFyZ2V0ID09IG51bGwgKXtcclxuXHRcdFx0XHRcdHJldHVybiBvYmoudGhpc09iaiA9PSB0aGlzT2JqO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmV0dXJuIG9iai50YXJnZXQgPT0gdGFyZ2V0ICYmIG9iai50aGlzT2JqID09IHRoaXNPYmo7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDph4rmlL7otYTmupBcclxuXHQgKi9cclxuXHRwdWJsaWMgZGlzcG9zZSgpOnZvaWR7XHJcblxyXG5cdFx0d2hpbGUoIHRoaXMuX2V2ZW50T2JqTGlzdCAmJiB0aGlzLl9ldmVudE9iakxpc3QubGVuZ3RoID4gMCApe1xyXG5cdFx0XHRsZXQgb2JqOkV2ZW50T2JqID0gdGhpcy5fZXZlbnRPYmpMaXN0LnNoaWZ0KCk7XHJcblx0XHRcdGlmKCBvYmogKXtcclxuXHRcdFx0XHRFdmVudE1hbmFnZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggb2JqLnR5cGUgLCBvYmoubGlzdGVuZXIgLCBvYmoudGhpc09iaiAsIG9iai50YXJnZXQgKTtcclxuXHRcdFx0XHRvYmoucmVjb3ZlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLl9ldmVudE9iakxpc3QgPSBbXTtcclxuXHJcblx0XHRFdmVudFBvb2wucmVjb3ZlciggdGhpcyApO1xyXG5cdH1cclxufSIsImltcG9ydCBSZXNvdXJjZSBmcm9tIFwiLi9yZXNvdXJjZS9SZXNvdXJjZVwiO1xyXG5pbXBvcnQgTG9hZGVyRXZlbnQgZnJvbSBcIi4vZXZlbnQvTG9hZGVyRXZlbnRcIjtcclxuaW1wb3J0IEdyb3VwUmVzb3VyY2UgZnJvbSBcIi4vcmVzb3VyY2UvR3JvdXBSZXNvdXJjZVwiO1xyXG5pbXBvcnQgTG9hZFV0aWxzIGZyb20gXCIuL3V0aWxzL0xvYWRVdGlsc1wiO1xyXG5pbXBvcnQgVHh0UmVzb3VyY2UgZnJvbSBcIi4vcmVzb3VyY2UvVHh0UmVzb3VyY2VcIjtcclxuaW1wb3J0IEV2ZW50TWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlci9FdmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IExvZyBmcm9tIFwiLi4vbG9nL0xvZ1wiO1xyXG5cclxuLyoqXHJcbiAqIOWKoOi9vei1hOa6kOeuoeeQhlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZFNvdXJjZU1hbmFnZXIge1xyXG5cclxuICAgIC8qKuWKoOi9vei1hOa6kOeuoeeQhiAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9hZE1hcDogTGF5YS5XZWFrT2JqZWN0ID0gbnVsbDtcclxuICAgIC8qKui1hOa6kOe7hOWtl+WFuCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ3JvdXBNYXA6IE9iamVjdCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpbml0KCk6IHZvaWQge1xyXG5cclxuICAgICAgICBMb2FkU291cmNlTWFuYWdlci5sb2FkTWFwID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG4gICAgICAgIExvYWRTb3VyY2VNYW5hZ2VyLmdyb3VwTWFwID0ge307XHJcblxyXG4gICAgICAgIEV2ZW50TWFuYWdlci5hZGRFdmVudExpc3RlbmVyKExvYWRlckV2ZW50LkxPQURfU0lOR0xFX0NPTVBMRVRFLCB0aGlzLmxvYWRTaW5nbGVDb21wbGV0ZSwgdGhpcyk7XHJcbiAgICAgICAgRXZlbnRNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoTG9hZGVyRXZlbnQuTE9BRF9HUk9VUF9DT01QTEVURSwgdGhpcy5sb2FkR3JvdXBDb21wbGV0ZSwgdGhpcyk7XHJcblxyXG4gICAgICAgIC8vTGF5YS50aW1lci5sb29wKDEwMDAwLCB0aGlzLCB0aGlzLmNoZWNrUmVzKTsvL+ajgOa1i+i1hOa6kOaYr+WQpuWbnuaUtizmmoLlrpoxMOenkumSn+WbnuaUtuS4gOasoVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L295Y2V5Liq6LWE5rqQ5a6M5oiQXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGxvYWRTaW5nbGVDb21wbGV0ZShzb3VyY2U6IHN0cmluZyB8IFJlc291cmNlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCByZXM6IFJlc291cmNlID0gdHlwZW9mIHNvdXJjZSA9PT0gXCJzdHJpbmdcIiA/IHRoaXMuZ2V0UmVzKHNvdXJjZSkgOiBzb3VyY2U7XHJcbiAgICAgICAgaWYgKHJlcyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBncm91cFJlczogR3JvdXBSZXNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBrZXk6YW55O1xyXG4gICAgICAgICAgICBmb3IgKCBrZXkgaW4gdGhpcy5ncm91cE1hcCkge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBSZXMgPSB0aGlzLmdyb3VwTWFwW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXBSZXMgJiYgZ3JvdXBSZXMuaGFzVXJsKHJlcy51cmwpICYmIGdyb3VwUmVzLmlzTG9hZGVkKCkpIHsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIEV2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KExvYWRlckV2ZW50LkxPQURfR1JPVVBfQ09NUExFVEUsIGdyb3VwUmVzKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWKoOi9vee7hOi1hOa6kOWujOaIkFxyXG4gICAgICogQHBhcmFtIGdyb3VwTmFtZSBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9hZEdyb3VwQ29tcGxldGUoc291cmNlOiBzdHJpbmcgfCBHcm91cFJlc291cmNlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBncm91cFJlczogR3JvdXBSZXNvdXJjZSA9IHR5cGVvZiBzb3VyY2UgPT09IFwic3RyaW5nXCIgPyA8R3JvdXBSZXNvdXJjZT50aGlzLmdldFJlcyhzb3VyY2UpIDogc291cmNlO1xyXG4gICAgICAgIGlmIChncm91cFJlcyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIExvZy5sb2coIHRoaXMgLCBcIuWKoOi9vei1hOa6kOe7hFtcIitncm91cFJlcy5uYW1lK1wiXeWujOaIkCFcIik7XHJcbiAgICAgICAgICAgIGlmIChncm91cFJlcy5jb21wbGV0ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cFJlcy5jb21wbGV0ZS5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWKoOi9vee7hOi1hOa6kFxyXG4gICAgICogQHBhcmFtIGdyb3VwTmFtZSDotYTmupDnu4TlkI3lrZcs5bi46KeE5LiN5bim56ym5Y+355qE5a2X56ym5Liy77yM5a2X5q+NK+aVsOe7hFxyXG4gICAgICogQHBhcmFtIHVybGxpc3Qg6LWE5rqQ5Zyw5Z2A5YiX6KGoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZEdyb3VwKGdyb3VwTmFtZTogc3RyaW5nID0gXCJcIiwgdXJsbGlzdDogQXJyYXk8c3RyaW5nPiwgY29tcGxldGU6IExheWEuSGFuZGxlciA9IG51bGwsIHByb2dyZXNzOiBMYXlhLkhhbmRsZXIgPSBudWxsKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmICghZ3JvdXBOYW1lKSByZXR1cm47XHJcbiAgICAgICAgbGV0IGdyb3VwbGlzdDogQXJyYXk8UmVzb3VyY2U+ID0gdGhpcy5sb2FkTWFwLmdldChncm91cE5hbWUpO1xyXG4gICAgICAgIGlmIChncm91cGxpc3QgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBncm91cGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHVybGxpc3QgIT0gbnVsbCAmJiB1cmxsaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXJsbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB1cmw6IHN0cmluZyA9IHVybGxpc3RbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlczogUmVzb3VyY2UgPSB0aGlzLmxvYWRNYXAuZ2V0KHVybCkgfHwgTG9hZFNvdXJjZU1hbmFnZXIuY3JlYXRlKHVybCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBsaXN0LnB1c2gocmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRNYXAuc2V0KHJlcy51cmwsIHJlcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCB0aGlzLmdyb3VwTWFwWyBncm91cE5hbWUgXSA9PSBudWxsICl7XHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JvdXBSZXM6IEdyb3VwUmVzb3VyY2UgPSBMb2FkU291cmNlTWFuYWdlci5jcmVhdGUoZ3JvdXBsaXN0LCBjb21wbGV0ZSwgcHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBSZXMubmFtZSA9IGdyb3VwTmFtZTtcclxuICAgICAgICAgICAgICAgIGdyb3VwUmVzLmxvYWQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBNYXBbZ3JvdXBOYW1lXSA9IGdyb3VwUmVzO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZiggY29tcGxldGUgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGUucnVuKCk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBMYXlhLkxvZy5wcmludChcIuW3sue7j+acieivpei1hOa6kOe7hOS6hu+8gVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu65Yqg6L296LWE5rqQ57G7XHJcbiAgICAgKiBAcGFyYW0gdXJsXHJcbiAgICAgKiBAcGFyYW0gY29tcGxldGUgXHJcbiAgICAgKiBAcGFyYW0gcHJvZ3Jlc3MgXHJcbiAgICAgKiBAcGFyYW0gZXJyb3IgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKHVybDogYW55LCBjb21wbGV0ZTogTGF5YS5IYW5kbGVyID0gbnVsbCwgcHJvZ3Jlc3M6IExheWEuSGFuZGxlciA9IG51bGwsIGVycm9yOiBMYXlhLkhhbmRsZXIgPSBudWxsKTogYW55IHtcclxuXHJcbiAgICAgICAgbGV0IHJlczogUmVzb3VyY2UgPSBudWxsO1xyXG4gICAgICAgIGxldCBleHQ6IHN0cmluZyA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBMb2FkVXRpbHMuZ2V0RmlsZUV4dCh1cmwpIDogXCJcIjtcclxuICAgICAgICBpZiAodXJsIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKEdyb3VwUmVzb3VyY2UuS0VZLCBHcm91cFJlc291cmNlKTtcclxuICAgICAgICAgICAgcmVzLnR5cGUgPSBSZXNvdXJjZS5UWVBFX0dST1VQO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXh0ID09IFwicG5nXCIgfHwgZXh0ID09IFwianBnXCIgfHwgZXh0ID09IFwiYm1wXCIpIHtcclxuICAgICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKFJlc291cmNlLktFWSwgUmVzb3VyY2UpO1xyXG4gICAgICAgICAgICByZXMudHlwZSA9IExheWEuTG9hZGVyLklNQUdFO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXh0ID09IFwidHh0XCIgfHwgZXh0ID09IFwianNvblwiKSB7XHJcbiAgICAgICAgICAgIHJlcyA9IExheWEuUG9vbC5nZXRJdGVtQnlDbGFzcyhUeHRSZXNvdXJjZS5LRVksIFR4dFJlc291cmNlKTtcclxuICAgICAgICAgICAgcmVzLnR5cGUgPSBMYXlhLkxvYWRlci5URVhUO1xyXG4gICAgICAgIH0gZWxzZSB7Ly/kuozov5vliLbotYTmupBcclxuICAgICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKFJlc291cmNlLktFWSwgUmVzb3VyY2UpO1xyXG4gICAgICAgICAgICByZXMudHlwZSA9IExheWEuTG9hZGVyLkJVRkZFUjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICByZXMuY3JlYXRlKHVybCwgY29tcGxldGUsIHByb2dyZXNzLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3otYTmupBcclxuICAgICAqIEBwYXJhbSBzb3VyY2Ug6LWE5rqQXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZChzb3VyY2U6IHN0cmluZyB8IFJlc291cmNlLCBjb21wbGV0ZTogTGF5YS5IYW5kbGVyID0gbnVsbCwgZXJyb3I6IExheWEuSGFuZGxlciA9IG51bGwpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKCFzb3VyY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVzOiBSZXNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2UgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgcmVzID0gdGhpcy5sb2FkTWFwLmdldChzb3VyY2UpO1xyXG4gICAgICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXMgPSBMb2FkU291cmNlTWFuYWdlci5jcmVhdGUoc291cmNlLCBjb21wbGV0ZSwgZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc291cmNlIGluc3RhbmNlb2YgUmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgcmVzID0gc291cmNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlcyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcy5nZXRSZXMoZmFsc2UpICE9IG51bGwpIHsvL+i1hOa6kOW3suWKoOi9veWujOaIkFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcy5sb2FkKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkTWFwLnNldChyZXMudXJsLCByZXMpO1xyXG4gICAgICAgIGxldCBpc0JyZWFrOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMubG9hZE1hcCkge1xyXG4gICAgICAgICAgICByZXMgPSB0aGlzLmxvYWRNYXAuZ2V0KGtleSk7XHJcbiAgICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGlzQnJlYWsgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzQnJlYWspIHtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5sb29wKDEwMDAsIHRoaXMsIHRoaXMuY2hlY2tSZXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIExheWEudGltZXIuY2xlYXIodGhpcywgdGhpcy5jaGVja1Jlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qOA5rWL6LWE5rqQ5piv5ZCm5Y+v5Zue5pS2XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGNoZWNrUmVzKCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgcmVzOiBSZXNvdXJjZTtcclxuICAgICAgICBmb3IgKGxldCB1cmwgaW4gdGhpcy5sb2FkTWFwKSB7XHJcbiAgICAgICAgICAgIHJlcyA9IHRoaXMubG9hZE1hcC5nZXQodXJsKTtcclxuICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMuY2FuR2MoKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzLnJlY292ZXIoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZE1hcC5kZWwodXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/mo4DmtYvnu4TotYTmupAgVE9ET1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlui1hOa6kOaVsOaNrlxyXG4gICAgICogQHBhcmFtIHVybCDotYTmupDlnLDlnYAs5oiW6ICF57uE6LWE5rqQ5ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UmVzKHVybDogc3RyaW5nKTogUmVzb3VyY2UgfCBHcm91cFJlc291cmNlIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZE1hcC5nZXQodXJsKSB8fCB0aGlzLmdyb3VwTWFwWyB1cmwgXSAhPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W6LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gdXJsIOi1hOa6kOWcsOWdgFxyXG4gICAgICogQHBhcmFtIGlzQ291bnQg5piv5ZCm6K6h5pWwXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0U291cmNlKHVybDogc3RyaW5nLCBpc0NvdW50OiBib29sZWFuID0gZmFsc2UpOiBhbnkge1xyXG5cclxuICAgICAgICBsZXQgcmVzOiBSZXNvdXJjZSA9IHRoaXMubG9hZE1hcC5nZXQodXJsKTtcclxuICAgICAgICByZXR1cm4gcmVzICYmIHJlcy5nZXRSZXMoaXNDb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDph4rmlL7otYTmupBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBkZXN0cm95UmVzKHVybDogc3RyaW5nKTogdm9pZCB7XHJcblxyXG5cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOe6r+eyueWKoOi9vei1hOa6kOeuoeeQhlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExvYWRlck1hbmFnZXIge1xyXG5cclxuICAgIC8qKuWKoOi9vemYn+WIl+S4iumZkCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBMT0FEX0xJTUlUOiBudW1iZXIgPSA1O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YeG5aSH5Yqg6L295YiX6KGoXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWR5TG9hZExpc3Q6IEFycmF5PFJlc291cmNlPiA9IFtdO1xyXG5cclxuICAgIC8qKuato+WcqOWKoOi9veeahOWIl+ihqCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9hZGluZ0xpc3Q6IEFycmF5PFJlc291cmNlPiA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L296LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gc291cmNlIOi1hOa6kOWcsOWdgOaIllJlc291cmNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZChzb3VyY2U6IHN0cmluZyB8IFJlc291cmNlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCByZXM6IFJlc291cmNlID0gdHlwZW9mIHNvdXJjZSA9PT0gXCJzdHJpbmdcIiA/IExvYWRTb3VyY2VNYW5hZ2VyLmdldFJlcyhzb3VyY2UpIDogc291cmNlO1xyXG4gICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubG9hZGluZ0xpc3QubGVuZ3RoIDwgdGhpcy5MT0FEX0xJTUlUKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sb2FkaW5nTGlzdC5pbmRleE9mKHJlcykgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+i1hOa6kOato+WcqOWKoOi9vVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZ0xpc3QucHVzaChyZXMpO1xyXG4gICAgICAgICAgICAgICAgLy9Mb2cubG9nKHRoaXMsIFwi5byA5aeL5Yqg6L296LWE5rqQIHVybDogXCIgKyByZXMudXJsLCBMb2cuVFlQRV9MT0FEKTsvL+aJk+WNsOaXpeW/l1xyXG4gICAgICAgICAgICAgICAgTGF5YS5sb2FkZXIubG9hZChbeyB1cmw6IHJlcy51cmwsIHR5cGU6IHJlcy50eXBlIH1dLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Mb2FkZWQsIFtyZXNdLCB0cnVlKSwgcmVzLnByb2dyZXNzKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlYWR5TG9hZExpc3QuaW5kZXhPZihyZXMpID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5TG9hZExpc3QucHVzaChyZXMpO1xyXG4gICAgICAgICAgICAgICAgLy/ov5nph4zmoLnmja7kvJjlhYjnuqfmjpLluo9cclxuICAgICAgICAgICAgICAgIC8vIHRoaXMucmVhZHlMb2FkTGlzdCA9IHRoaXMucmVhZHlMb2FkTGlzdC5zb3J0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgb25Mb2FkZWQocmVzOiBSZXNvdXJjZSk6IHZvaWQge1xyXG5cclxuICAgICAgICByZXMubG9hZENvbXBsZXRlKCk7XHJcbiAgICAgICAgLy/ku47liqDovb3liJfooajnp7vpmaRcclxuICAgICAgICBsZXQgaW5kZXg6IG51bWJlciA9IHRoaXMubG9hZGluZ0xpc3QuaW5kZXhPZihyZXMpO1xyXG4gICAgICAgIGlmIChpbmRleCAhPSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdMaXN0LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIExvZy5sb2codGhpcywgXCLliqDovb3otYTmupAgdXJs77yaXCIgKyByZXMudXJsICsgXCLlrozmiJDjgIJcIiwgTG9nLlRZUEVfTE9BRCk7XHJcbiAgICAgICAgRXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQoTG9hZGVyRXZlbnQuTE9BRF9TSU5HTEVfQ09NUExFVEUsIHJlcyk7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZE5leHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2FkTmV4dCgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IHJlczogUmVzb3VyY2UgPSB0aGlzLnJlYWR5TG9hZExpc3Quc2hpZnQoKTtcclxuICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkKHJlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIOWKoOi9veS6i+S7tlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZGVyRXZlbnQgIHtcclxuICAgIFxyXG4gICAgLyoq5Yqg6L295Y2V5Liq6LWE5rqQ5a6M5oiQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExPQURfU0lOR0xFX0NPTVBMRVRFOnN0cmluZyA9IFwiTG9hZGVyRXZlbnQubG9hZFNpbmdsZUNvbXBsZXRlXCI7XHJcbiAgICAvKirliqDovb3nu4TotYTmupDlrozmiJAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTE9BRF9HUk9VUF9DT01QTEVURTpzdHJpbmcgPSBcIkxvYWRlckV2ZW50LmxvYWRHcm91cENvbXBsZXRlXCI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCAgKXtcclxuXHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IFJlc291cmNlIGZyb20gXCIuL1Jlc291cmNlXCI7XHJcbmltcG9ydCB7IExvYWRlck1hbmFnZXIgfSBmcm9tIFwiLi4vTG9hZFNvdXJjZU1hbmFnZXJcIjtcclxuaW1wb3J0IExvZyBmcm9tIFwiLi4vLi4vbG9nL0xvZ1wiO1xyXG5cclxuLyoqXHJcbiAqIOe7hOi1hOa6kFxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JvdXBSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBLRVk6c3RyaW5nID0gXCJHcm91cFJlc291cmNlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfbGlzdDpBcnJheTxSZXNvdXJjZT4gPSBudWxsO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgXHJcblxyXG4gICAgICAgIHN1cGVyKCk7IFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoIHVybDpBcnJheTxSZXNvdXJjZT4gPSBudWxsICwgY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbCAsIHByb2dyZXNzOkxheWEuSGFuZGxlciA9IG51bGwgLCBlcnJvcjpMYXlhLkhhbmRsZXIgPSBudWxsICApOnZvaWR7XHJcblxyXG4gICAgICAgIC8vIHRoaXMudXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMuX2xpc3QgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5fY29tcGxldGUgPSBjb21wbGV0ZTtcclxuICAgICAgICB0aGlzLl9wcm9ncmVzcyA9IHByb2dyZXNzO1xyXG4gICAgICAgIHRoaXMuX2Vycm9yID0gZXJyb3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvYWQoKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggdGhpcy5fbGlzdCAmJiB0aGlzLl9saXN0Lmxlbmd0aCA+IDAgKXtcclxuICAgICAgICAgICAgbGV0IGlzQnJlYWs6Ym9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgcmVzOlJlc291cmNlO1xyXG4gICAgICAgICAgICBmb3IoIHJlcyBvZiB0aGlzLl9saXN0ICl7XHJcbiAgICAgICAgICAgICAgICBpZiggcmVzICYmIHJlcy5nZXRSZXMoIGZhbHNlICkgPT0gbnVsbCApeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgTG9hZGVyTWFuYWdlci5sb2FkKCByZXMudXJsICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIWlzQnJlYWspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0JyZWFrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoIWlzQnJlYWsgJiYgdGhpcy5fY29tcGxldGUgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29tcGxldGUucnVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDotYTmupDnu4TmmK/lkKbliqDovb3lrozmiJBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzTG9hZGVkKCk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuX2xpc3QgJiYgdGhpcy5fbGlzdC5sZW5ndGggPiAwICl7XHJcbiAgICAgICAgICAgIGxldCByZXM6UmVzb3VyY2U7XHJcbiAgICAgICAgICAgIGZvciggcmVzIG9mIHRoaXMuX2xpc3QgKXtcclxuICAgICAgICAgICAgICAgIGlmKCByZXMgJiYgcmVzLmdldFJlcyggZmFsc2UgKSA9PSBudWxsICl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5pyJ5a+55bqU5Zyw5Z2A6LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gdXJsIOi1hOa6kOWcsOWdgFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaGFzVXJsKCB1cmw6c3RyaW5nICk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgbGV0IHJlczpSZXNvdXJjZTtcclxuICAgICAgICBmb3IoIHJlcyBvZiB0aGlzLl9saXN0ICl7XHJcbiAgICAgICAgICAgIGlmKCByZXMgJiYgcmVzLnVybCA9PSB1cmwgKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi1hOa6kOaYr+WQpuW3suWKoOi9vVxyXG4gICAgICogQHBhcmFtIHVybCDotYTmupDlnLDlnYBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGhhc0xvYWRlZCggdXJsOnN0cmluZyApOmJvb2xlYW57XHJcblxyXG4gICAgICAgIGxldCByZXM6UmVzb3VyY2U7XHJcbiAgICAgICAgZm9yKCByZXMgb2YgdGhpcy5fbGlzdCApe1xyXG4gICAgICAgICAgICBpZiggcmVzICYmIHJlcy51cmwgPT0gdXJsICYmIHJlcy5nZXRSZXMoIGZhbHNlICkgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IExvYWRVdGlscyBmcm9tIFwiLi4vdXRpbHMvTG9hZFV0aWxzXCI7XHJcbmltcG9ydCB7IExvYWRlck1hbmFnZXIgfSBmcm9tIFwiLi4vTG9hZFNvdXJjZU1hbmFnZXJcIjtcclxuXHJcbi8qKlxyXG4gKiDotYTmupDln7rnsbtcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc291cmNlIGltcGxlbWVudHMgSVJlc291cmNlIHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEtFWTpzdHJpbmcgPSBcIlJlc291cmNlXCI7XHJcblxyXG4gICAgLyoq5Zue5pS26Ze06ZqU5pe26Ze077yM5q+r56eSICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEdDX0dBUFRJTUU6bnVtYmVyID0gMTAwMDA7XHJcblxyXG4gICAgLyoq5Zu+54mH6LWE5rqQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRZUEVfSU1BR0U6c3RyaW5nID0gXCJpbWFnZVwiO1xyXG4gICAgLyoq5paH5pys6LWE5rqQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRQWUVfVEVYVDpzdHJpbmcgPSBcInRleHRcIjtcclxuICAgIC8qKuS6jOi/m+WItui1hOa6kCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUWVBFX0JJTjpzdHJpbmcgPSBcImJpblwiO1xyXG4gICAgLyoq57uE6LWE5rqQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRZUEVfR1JPVVA6c3RyaW5nID0gXCJncm91cFwiO1xyXG5cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgY3JlYXRlKCB1cmw6YW55ICwgY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbCAsIHByb2dyZXNzOkxheWEuSGFuZGxlciA9IG51bGwgLCBlcnJvcjpMYXlhLkhhbmRsZXIgPSBudWxsICk6YW55e1xyXG5cclxuICAgIC8vICAgICBsZXQgcmVzOlJlc291cmNlID0gbnVsbDtcclxuICAgIC8vICAgICBsZXQgZXh0OnN0cmluZyA9IExvYWRVdGlscy5nZXRGaWxlRXh0KCB1cmwgKTtcclxuICAgIC8vICAgICBpZiggZXh0ID09IFwicG5nXCIgfHwgZXh0ID09IFwianBnXCIgfHwgZXh0ID09IFwiYm1wXCIgKXtcclxuICAgIC8vICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKCBSZXNvdXJjZS5LRVkgLCBSZXNvdXJjZSApO1xyXG4gICAgLy8gICAgICAgICByZXMudHlwZSA9IExheWEuTG9hZGVyLklNQUdFO1xyXG4gICAgLy8gICAgIH1lbHNlIGlmKCBleHQgPT0gXCJ0eHRcIiB8fCBleHQgPT0gXCJqc29uXCIgKXtcclxuICAgIC8vICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKCBUeHRSZXNvdXJjZS5LRVkgLCBUeHRSZXNvdXJjZSApO1xyXG4gICAgLy8gICAgICAgICByZXMudHlwZSA9IExheWEuTG9hZGVyLlRFWFQ7XHJcbiAgICAvLyAgICAgfWVsc2UgaWYoIHVybCBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgIC8vICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKCBHcm91cFJlc291cmNlLktFWSAsIEdyb3VwUmVzb3VyY2UgKTtcclxuICAgIC8vICAgICAgICAgcmVzLnR5cGUgPSBSZXNvdXJjZS5UWVBFX0dST1VQO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICBpZihyZXMpe1xyXG4gICAgLy8gICAgICAgICByZXMuY3JlYXRlKCB1cmwgLCBjb21wbGV0ZSAsIHByb2dyZXNzICwgZXJyb3IgKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgcmV0dXJuIHJlcztcclxuICAgIC8vIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWbnuaUtui1hOa6kFxyXG4gICAgICogQHBhcmFtIHJlcyBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWNvdmVyKCByZXM6UmVzb3VyY2UgKTp2b2lke1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCByZXMgKXtcclxuICAgICAgICAgICAgcmVzLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIExheWEuUG9vbC5yZWNvdmVyKCB0eXBlb2YgcmVzICwgcmVzICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAvKirotYTmupDlkI3lrZcgKi9cclxuICAgIHB1YmxpYyBuYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICAvKirliqDovb3lnLDlnYAgKi9cclxuICAgIHB1YmxpYyB1cmw6c3RyaW5nID0gXCJcIjtcclxuICAgIC8qKui1hOa6kOexu+WeiyAqL1xyXG4gICAgcHVibGljIHR5cGU6c3RyaW5nID0gXCJcIjtcclxuICAgIC8qKuS4i+i9veS8mOWFiOe6pyAqL1xyXG4gICAgcHVibGljIHByaW9yaXR5Om51bWJlciA9IDA7XHJcbiAgICAvKirliqDovb3lrozmiJDkuovku7YgKi9cclxuICAgIHByb3RlY3RlZCBfY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbDtcclxuICAgIC8qKui/m+W6puS6i+S7tiAqL1xyXG4gICAgcHJvdGVjdGVkIF9wcm9ncmVzczpMYXlhLkhhbmRsZXIgPSBudWxsO1xyXG4gICAgLyoq6ZSZ6K+v5LqL5Lu2ICovXHJcbiAgICBwcm90ZWN0ZWQgX2Vycm9yOkxheWEuSGFuZGxlciA9IG51bGw7XHJcbiAgICAvKirotYTmupDmlbDmja4gKi9cclxuICAgIHByb3RlY3RlZCBfZGF0YTphbnkgPSBudWxsO1xyXG4gICAgLyoq5L2/55So6K6h5pWwICovXHJcbiAgICBwcm90ZWN0ZWQgX3VzZUNvdW50Om51bWJlciA9IDA7XHJcbiAgICAvKirlm57mlLbml7bpl7QgKi9cclxuICAgIHByb3RlY3RlZCBfZ2NUaW1lOm51bWJlciA9IDA7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCB1cmw6c3RyaW5nID0gXCJcIiAsIGNvbXBsZXRlOkxheWEuSGFuZGxlciA9IG51bGwgLCBlcnJvcjpMYXlhLkhhbmRsZXIgPSBudWxsICkgeyBcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGUoIHVybCAsIGNvbXBsZXRlICwgZXJyb3IgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlKCB1cmw6YW55ID0gXCJcIiAsIGNvbXBsZXRlOkxheWEuSGFuZGxlciA9IG51bGwgLCBwcm9ncmVzczpMYXlhLkhhbmRsZXIgPSBudWxsICwgZXJyb3I6TGF5YS5IYW5kbGVyID0gbnVsbCAgKTp2b2lke1xyXG5cclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgICAgICB0aGlzLl9jb21wbGV0ZSA9IGNvbXBsZXRlO1xyXG4gICAgICAgIHRoaXMuX3Byb2dyZXNzID0gcHJvZ3Jlc3M7XHJcbiAgICAgICAgdGhpcy5fZXJyb3IgPSBlcnJvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9hZCgpOnZvaWR7XHJcblxyXG4gICAgICAgIC8vIExheWEubG9hZGVyLmxvYWQoW1xyXG5cdFx0Ly8gXHR7IHVybDogXCJyZXMvZmFpcnVpL2NvbW1vbl9hdGxhczAucG5nXCIsIHR5cGU6IExheWEuTG9hZGVyLklNQUdFIH0sXHJcblx0XHQvLyBcdHsgdXJsOiBcInJlcy9mYWlydWkvY29tbW9uLm1hcFwiLCB0eXBlOiBMYXlhLkxvYWRlci5CVUZGRVIgfVxyXG4gICAgICAgIC8vICAgICBdLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Mb2FkZWQpKTtcclxuXHJcbiAgICAgICAgTG9hZGVyTWFuYWdlci5sb2FkKCB0aGlzLnVybCApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWNvdmVyKCk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuX3VzZUNvdW50IDw9IDAgKXtcclxuICAgICAgICAgICAgUmVzb3VyY2UucmVjb3ZlciggdGhpcyApO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb2FkQ29tcGxldGUoKTp2b2lke1xyXG5cclxuICAgICAgICB0aGlzLl9kYXRhID0gTGF5YS5sb2FkZXIuZ2V0UmVzKCB0aGlzLnVybCApO1xyXG4gICAgICAgIHRoaXMuX3VzZUNvdW50ID0gMDtcclxuICAgICAgICBpZiggdGhpcy5fY29tcGxldGUgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZS5ydW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5botYTmupBcclxuICAgICAqIEBwYXJhbSBpc0NvdW50IOaYr+WQpuiuoeaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0UmVzKCBpc0NvdW50OmJvb2xlYW4gPSB0cnVlICk6YW55e1xyXG5cclxuICAgICAgICBpZiggaXNDb3VudCApe1xyXG4gICAgICAgICAgICB0aGlzLl91c2VDb3VudCsrO1xyXG4gICAgICAgICAgICB0aGlzLl9nY1RpbWUgPSBMYXlhLnRpbWVyLmN1cnJGcmFtZSArIFJlc291cmNlLkdDX0dBUFRJTUU7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB1c2VDb3VudCgpOm51bWJlcntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZUNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuaYr+WQpuWPr+WbnuaUtiAqL1xyXG4gICAgcHVibGljIGNhbkdjKCk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgcmV0dXJuIExheWEudGltZXIuY3VyckZyYW1lID4gdGhpcy5fZ2NUaW1lICYmIHRoaXMuX3VzZUNvdW50IDw9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzTG9hZGVkKCk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEgIT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hlY2soKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggdGhpcy5jYW5HYygpICl7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3ZlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNvbXBsZXRlKCk6TGF5YS5IYW5kbGVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcGxldGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBwcm9ncmVzcygpOkxheWEuSGFuZGxlcntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2dyZXNzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhcigpOnZvaWR7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIHRoaXMuX2NvbXBsZXRlICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUucmVjb3ZlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5fcHJvZ3Jlc3MgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmVzcy5yZWNvdmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLl9lcnJvciAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yLnJlY292ZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY29tcGxldGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX3Byb2dyZXNzID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9lcnJvciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy51cmwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2djVGltZSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3Bvc2UoKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggdGhpcy5fdXNlQ291bnQgPiAwICl7XHJcbiAgICAgICAgICAgIHRoaXMuX3VzZUNvdW50LS07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBSZXNvdXJjZSBmcm9tIFwiLi9SZXNvdXJjZVwiO1xyXG5cclxuLyoqXHJcbiAqIOaWh+acrOi1hOa6kFxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHh0UmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7ICAgIFxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEtFWTpzdHJpbmcgPSBcIlR4dFJlc291cmNlXCI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7IFxyXG4gICAgICAgIHN1cGVyKCk7IFxyXG4gICAgfVxyXG5cclxuXHJcbn0iLCIvKipcclxuICog5Yqg6L295bel5YW3XHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkVXRpbHN7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICog6I635b6X5paH5Lu25ZCO57yA5ZCNXHJcbiAgICAgKiBAcGFyYW0gdXJsIOaWh+S7tui3r+W+hFxyXG4gICAgICogQHJldHVybiA8Yj5TdHJpbmc8L2I+IOaWh+S7tuWQjue8gOWQjVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEZpbGVFeHQodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIC8v5YiH5o6J6Lev5b6E5ZCO6Z2i55qE5Y+C5pWwXHJcbiAgICAgICAgbGV0IGV4dDogc3RyaW5nID0gdXJsLmluZGV4T2YoXCI/XCIpID4gLTEgPyB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKFwiP1wiKSkgOiB1cmw7XHJcbiAgICAgICAgLy/miKrlj5blkI7nvIBcclxuICAgICAgICBsZXQgbGFzdDogc3RyaW5nID0gZXh0LnN1YnN0cmluZyhleHQubGFzdEluZGV4T2YoXCIvXCIpKTtcclxuICAgICAgICByZXR1cm4gbGFzdC5sYXN0SW5kZXhPZihcIi5cIikgPT0gLTEgPyBcIlwiIDogbGFzdC5zdWJzdHJpbmcobGFzdC5sYXN0SW5kZXhPZihcIi5cIikgKyAxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIOi1hOa6kOWcsOWdgOeuoeeQhuexu1xyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXJsVXRpbHMge1xyXG4gICAgXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBSRVM6c3RyaW5nID0gXCJyZXMvXCI7XHJcbiAgICAvKipmYWlyeWd1aeWPkeW4g+i1hOa6kOebruW9lSAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBGQUlSVUk6c3RyaW5nID0gVXJsVXRpbHMuUkVTICsgXCJmYWlydWkvXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5ZmYWlyeWd1aei1hOa6kOe7hFxyXG4gICAgICogQHBhcmFtIG5hbWUgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0RmFpcnlHcm91cCggbmFtZTpzdHJpbmcgKTpBcnJheTxzdHJpbmc+e1xyXG5cclxuICAgICAgICByZXR1cm4gWyBVcmxVdGlscy5GQUlSVUkgKyBuYW1lICsgXCJfYXRsYXMwLnBuZ1wiICwgVXJsVXRpbHMuRkFJUlVJICsgbmFtZSArIFwiLm1hcFwiIF07XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgTG9nVm8gZnJvbSBcIi4vTG9nVm9cIjtcclxuXHJcbi8qKlxyXG4gKiDml6Xlv5fns7vnu58gXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjI1XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2cge1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGxvZ01hcDogTGF5YS5XZWFrT2JqZWN0ID0gbnVsbDtcclxuICAgIHByaXZhdGUgc3RhdGljIGtleUluZGV4Om51bWJlciA9IDA7XHJcblxyXG4gICAgLyoq5pmu6YCa6LCD6K+V5pel5b+XICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRZUEVfREVCVUc6c3RyaW5nID0gXCJkZWJ1Z1wiO1xyXG4gICAgLyoq5Yqg6L2955u45YWz5pel5b+XICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRZUEVfTE9BRDpzdHJpbmcgPSBcImxvYWRcIjtcclxuXHJcbiAgICAvKirkuI3pnIDopoHmmL7npLrml6Xlv5fnsbvlnovnmoTliJfooaggKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbm9zaG93TG9nVHlwZUxpc3Q6QXJyYXk8c3RyaW5nPiA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0KCk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dNYXAgPSBuZXcgTGF5YS5XZWFrT2JqZWN0KCk7XHJcbiAgICAgICAgdGhpcy5ub3Nob3dMb2dUeXBlTGlzdCA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pi+56S65pel5b+XXHJcbiAgICAgKiBAcGFyYW0gdGhpc09iamVjdCBcclxuICAgICAqIEBwYXJhbSB0ZXh0IOaXpeW/l+aWh+acrFxyXG4gICAgICogQHBhcmFtIHR5cGUg5pel5b+X57G75Z6LXHJcbiAgICAgKiBAcGFyYW0gbGV2ZWwg5pel5b+X562J57qnXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9nKCB0aGlzT2JqZWN0OmFueSAsIHRleHQ6c3RyaW5nICwgdHlwZTpzdHJpbmc9XCJcIiAsIGxldmVsOm51bWJlciA9MCApOnZvaWR7XHJcblxyXG4gICAgICAgIGlmKCB0eXBlID09IFwiXCIpe1xyXG4gICAgICAgICAgICB0eXBlID0gTG9nLlRZUEVfREVCVUc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0eXBlICYmIHRoaXMubm9zaG93TG9nVHlwZUxpc3QuaW5kZXhPZih0eXBlKSAhPSAtMSApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBsb2dWbzpMb2dWbyA9IG5ldyBMb2dWbyggTG9nLmtleUluZGV4ICwgdGV4dCAsIHRoaXNPYmplY3QgLCB0eXBlICwgbGV2ZWwgKTsgICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCBsb2dWby50b1N0cmluZygpICk7XHJcbiAgICAgICAgdGhpcy5sb2dNYXAuc2V0KCBsb2dWby5rZXkgLCBsb2dWbyApO1xyXG4gICAgICAgIExvZy5rZXlJbmRleCsrO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pi+56S66ZSZ6K+v5pel5b+XXHJcbiAgICAgKiBAcGFyYW0gdGhpc09iamVjdCBcclxuICAgICAqIEBwYXJhbSBhcmdzIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGVycm9yKCB0aGlzT2JqZWN0OmFueSAsIHRleHQ6c3RyaW5nICwgdHlwZTpzdHJpbmc9XCJcIiAsIGxldmVsOm51bWJlciA9MCApOnZvaWR7XHJcblxyXG4gICAgICAgIGlmKCB0eXBlID09IFwiXCIpe1xyXG4gICAgICAgICAgICB0eXBlID0gTG9nLlRZUEVfREVCVUc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0eXBlICYmIHRoaXMubm9zaG93TG9nVHlwZUxpc3QuaW5kZXhPZih0eXBlKSAhPSAtMSApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBsb2dWbzpMb2dWbyA9IG5ldyBMb2dWbyggTG9nLmtleUluZGV4ICwgdGV4dCAsIHRoaXNPYmplY3QgLCB0eXBlICwgbGV2ZWwgKTsgICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoIGxvZ1ZvLnRvU3RyaW5nKCkgKTtcclxuICAgICAgICB0aGlzLmxvZ01hcC5zZXQoIGxvZ1ZvLmtleSAsIGxvZ1ZvICk7XHJcbiAgICAgICAgTG9nLmtleUluZGV4Kys7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICog5pel5b+X5pWw5o2uXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjI1XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dWbyB7XHJcblxyXG4gICAgcHVibGljIGtleTphbnk7XHJcbiAgICAvKirml6Xlv5fnsbvlnosgKi9cclxuICAgIHB1YmxpYyB0eXBlOnN0cmluZztcclxuICAgIC8qKuaXpeW/l+aPj+i/sCAqL1xyXG4gICAgcHVibGljIHRleHQ6c3RyaW5nO1xyXG4gICAgLyoqdGhpc09iamVjdCDlr7nosaEgKi9cclxuICAgIHB1YmxpYyB0aGlzT2JqZWN0OmFueTtcclxuICAgIC8qKuaXpeW/l+etiee6pyAqL1xyXG4gICAgcHVibGljIGxldmVsOm51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoIGtleTphbnkgLCB0ZXh0OnN0cmluZyAsIHRoaXNPYmplY3Q6YW55ICwgdHlwZTpzdHJpbmcgPSBcIlwiICwgbGV2ZWw6bnVtYmVyID0gMCApIHtcclxuXHJcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICB0aGlzLnRoaXNPYmplY3QgPSB0aGlzT2JqZWN0O1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5sZXZlbCA9IGxldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOnN0cmluZ3tcclxuXHJcbiAgICAgICAgdmFyIGNsc05hbWU6IGFueSA9IHRoaXMudGhpc09iamVjdCA/IHRoaXMudGhpc09iamVjdC5uYW1lIDogXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIFwiW1wiICsgdGhpcy50eXBlICsgXCJdXCIgKyBcIltcIiArIGNsc05hbWUgKyBcIl1cIiArIHRoaXMudGV4dCArIFwiICAgIFwiICsgbmV3IERhdGUoKS50b1RpbWVTdHJpbmcoKSArIFwiXCIgO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IExvZyBmcm9tIFwiLi4vbG9nL0xvZ1wiO1xyXG5cclxuLyoqXHJcbiAqIOS6i+S7tueuoeeQhuexu1xyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRNYW5hZ2VyIHtcclxuXHJcblx0cHJpdmF0ZSBzdGF0aWMgX2V2ZW50RGljdDogTGF5YS5XZWFrT2JqZWN0ID0gbnVsbDtcclxuXHJcblx0cHJpdmF0ZSBzdGF0aWMgX3RhcmdldE1hcDogTGF5YS5XZWFrT2JqZWN0ID0gbnVsbDtcclxuXHJcblx0cHVibGljIHN0YXRpYyBpbml0KCk6IHZvaWR7XHJcblxyXG5cdFx0dGhpcy5fZXZlbnREaWN0ID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG5cdFx0dGhpcy5fdGFyZ2V0TWFwID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog6Kem5Y+R5YWo5bGA5LqL5Lu2XHJcblx0ICogQHBhcmFtIHR5cGUg5LqL5Lu257G75Z6LXHJcblx0ICogQHBhcmFtIGFyZ3Mg5LqL5Lu25Y+C5pWwXHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyBkaXNwYXRjaEV2ZW50KCB0eXBlOiBzdHJpbmcsIC4uLmFyZ3MgKTp2b2lkIHtcclxuXHJcblx0XHRsZXQgZnVuY0xpc3Q6IEFycmF5PGFueT4gPSB0aGlzLl9ldmVudERpY3QuZ2V0KHR5cGUpO1xyXG5cdFx0aWYgKGZ1bmNMaXN0KSB7XHJcblx0XHRcdGxldCBsaXN0OiBBcnJheTxhbnk+ID0gZnVuY0xpc3QuY29uY2F0KCk7XHJcblx0XHRcdGxldCBsZW5ndGg6IG51bWJlciA9IGxpc3QubGVuZ3RoO1xyXG5cdFx0XHRpZiAobGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0TG9nLmxvZyggdGhpcyAsIFwi6LCD5bqm5LqL5Lu2OiBcIiArIHR5cGUpOy8v6LCD5bqm5LqL5Lu25Ye66ZSZLlxyXG5cdFx0XHRcdFx0XHQvLyBsaXN0W2ldWzBdLmFwcGx5KGxpc3RbaV1bMV0sIGFyZ3MpO1xyXG5cdFx0XHRcdFx0XHRsZXQgZnVuOkZ1bmN0aW9uID0gbGlzdFtpXVswXTtcclxuXHRcdFx0XHRcdFx0aWYoICBmdW4gIT0gbnVsbCApe1xyXG5cdFx0XHRcdFx0XHRcdGZ1bi5hcHBseShsaXN0W2ldWzFdLCBhcmdzKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdFx0TG9nLmVycm9yKCB0aGlzICwgXCLosIPluqbkuovku7blh7rplJkuXCIrZS50b1N0cmluZygpICk7Ly/osIPluqbkuovku7blh7rplJkuXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDmt7vliqDkuovku7bmlrnms5VcclxuXHQgKiBAcGFyYW0gdHlwZSDkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW0gbGlzdGVuZXIg5LqL5Lu25pa55rOVXHJcblx0ICogQHBhcmFtIHRoaXNPYmplY3RcclxuXHQgKiBAcGFyYW0gdGFyZ2V0IOebkeWQrOS6i+S7tuWvueixoe+8jOS4uuepuuWImeebkeWQrOWFqOWxgOS6i+S7tlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgYWRkRXZlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiwgdGhpc09iamVjdDogYW55LCB0YXJnZXQ6IExheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCk6IHZvaWQge1xyXG5cclxuXHRcdGxldCBmdW5jTGlzdDogQXJyYXk8YW55PiA9IG51bGw7XHJcblx0XHRpZiAodGFyZ2V0ID09IG51bGwpIHtcclxuXHRcdFx0ZnVuY0xpc3QgPSA8YW55PkV2ZW50TWFuYWdlci5fZXZlbnREaWN0LmdldCh0eXBlKTtcclxuXHRcdFx0aWYgKCFmdW5jTGlzdCkge1xyXG5cdFx0XHRcdGZ1bmNMaXN0ID0gbmV3IEFycmF5PGFueT4oKTtcclxuXHRcdFx0XHRFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5zZXQodHlwZSwgZnVuY0xpc3QpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghRXZlbnRNYW5hZ2VyLmhhc0V2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHRoaXNPYmplY3QpKSB7XHJcblx0XHRcdFx0ZnVuY0xpc3QucHVzaChbbGlzdGVuZXIsIHRoaXNPYmplY3RdKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZnVuY0xpc3QgPSBFdmVudE1hbmFnZXIuZ2V0TGlzdGVuZXJMaXN0KCB0YXJnZXQgKTtcclxuXHRcdFx0aWYoICFFdmVudE1hbmFnZXIuaGFzTGlzdGVuZXJPZiggdHlwZSAsIGxpc3RlbmVyICwgdGFyZ2V0ICkgKXsgLy/lpoLmnpzmsqHmnInnm5HlkKzor6Xkuovku7bvvIzpgb/lhY3ph43lpI3nm5HlkKxcclxuXHRcdFx0XHR2YXIgb2JqOiBPYmplY3QgPSBuZXcgT2JqZWN0KCk7XHJcblx0XHRcdFx0b2JqW1widHlwZVwiXSA9IHR5cGU7XHJcblx0XHRcdFx0b2JqW1wibGlzdGVuZXJcIl0gPSBsaXN0ZW5lcjtcclxuXHRcdFx0XHRvYmpbXCJ0aGlzT2JqZWN0XCJdID0gdGhpc09iamVjdDtcclxuXHRcdFx0XHRmdW5jTGlzdCA9IGZ1bmNMaXN0IHx8IFtdO1xyXG5cdFx0XHRcdGZ1bmNMaXN0LnB1c2gob2JqKTtcclxuXHRcdFx0XHQvLyB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdGhpc09iamVjdCk7XHJcblx0XHRcdFx0dGFyZ2V0Lm9uKCB0eXBlICwgdGhpc09iamVjdCAsIGxpc3RlbmVyICk7XHJcblx0XHRcdH1cdFx0XHRcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOenu+mZpOS6i+S7tuebkeWQrFxyXG5cdCAqIEBwYXJhbSB0eXBlIOS6i+S7tuexu+Wei1xyXG5cdCAqIEBwYXJhbSBsaXN0ZW5lciDkuovku7bmlrnms5VcclxuXHQgKiBAcGFyYW0gdGhpc09iamVjdFxyXG5cdCAqIEBwYXJhbSB0YXJnZXQg55uR5ZCs5LqL5Lu25a+56LGh77yM5Li656m65YiZ55uR5ZCs5YWo5bGA5LqL5Lu2IFxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiwgdGhpc09iamVjdDogYW55LCB0YXJnZXQ6IExheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCk6IHZvaWQge1xyXG5cdFx0XHJcblx0XHRsZXQgZnVuY0xpc3Q6IEFycmF5PGFueT4gPSBudWxsO1xyXG5cdFx0aWYoIHRhcmdldCA9PSBudWxsICl7IC8v5YWo5bGA5LqL5Lu2XHJcblx0XHRcdGZ1bmNMaXN0ID0gPGFueT5FdmVudE1hbmFnZXIuX2V2ZW50RGljdC5nZXQodHlwZSk7XHJcblx0XHRcdGlmIChmdW5jTGlzdCkge1xyXG5cdFx0XHRcdGxldCBsZW5ndGg6IG51bWJlciA9IGZ1bmNMaXN0Lmxlbmd0aDtcclxuXHRcdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChmdW5jTGlzdFtpXVswXSA9PSBsaXN0ZW5lciAmJiBmdW5jTGlzdFtpXVsxXSA9PSB0aGlzT2JqZWN0KSB7XHJcblx0XHRcdFx0XHRcdGZ1bmNMaXN0LnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRcdFx0aWYgKGZ1bmNMaXN0Lmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0RXZlbnRNYW5hZ2VyLl9ldmVudERpY3Quc2V0KHR5cGUsIG51bGwpO1xyXG5cdFx0XHRcdFx0XHRcdEV2ZW50TWFuYWdlci5fZXZlbnREaWN0LmRlbCh0eXBlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRmdW5jTGlzdCA9IEV2ZW50TWFuYWdlci5nZXRMaXN0ZW5lckxpc3QoIHRhcmdldCApO1xyXG5cdFx0XHR2YXIgb2JqOiBPYmplY3Q7XHJcbiAgICAgICAgICAgIGlmIChmdW5jTGlzdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jTGlzdC5mb3JFYWNoKChvYmopID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLnR5cGUgPT0gdHlwZSAmJiBvYmoubGlzdGVuZXIgPT0gbGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY0xpc3Quc3BsaWNlKGZ1bmNMaXN0LmluZGV4T2Yob2JqKSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cdFx0XHQvLyB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdGhpc09iamVjdCk7XHJcblx0XHRcdHRhcmdldC5vZmYoIHR5cGUgLCB0aGlzT2JqZWN0ICwgbGlzdGVuZXIgKTtcclxuXHRcdH1cdFx0XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDnm5HlkKzkuovku7bliJfooahcclxuXHQgKiBAcGFyYW0gdGFyZ2V0IOS6i+S7tuWvueixoVxyXG5cdCAqKi9cclxuXHRwdWJsaWMgc3RhdGljIGdldExpc3RlbmVyTGlzdCggdGFyZ2V0OkxheWEuRXZlbnREaXNwYXRjaGVyICk6IEFycmF5PE9iamVjdD4ge1xyXG5cclxuXHRcdGxldCBmdW5jTGlzdDpBcnJheTxPYmplY3Q+ID0gbnVsbDtcclxuXHRcdGlmKCB0YXJnZXQgKXtcclxuXHRcdFx0ZnVuY0xpc3QgPSBFdmVudE1hbmFnZXIuX3RhcmdldE1hcC5nZXQodGFyZ2V0KTtcclxuXHRcdFx0aWYgKGZ1bmNMaXN0ID09IG51bGwpIHtcclxuXHRcdFx0XHRmdW5jTGlzdCA9IFtdO1xyXG5cdFx0XHRcdEV2ZW50TWFuYWdlci5fdGFyZ2V0TWFwLnNldCh0YXJnZXQsIGZ1bmNMaXN0KTtcclxuXHRcdFx0fVxyXG5cdFx0fVx0XHRcclxuXHRcdHJldHVybiBmdW5jTGlzdDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOenu+mZpOaJgOacieebkeWQrOS6i+S7tlxyXG5cdCAqIEBwYXJhbSB0YXJnZXQg5Li656m65YiZ56e76Zmk5omA5pyJ5YWo5bGA5LqL5Lu277yM5ZCm5YiZ56e76Zmk5a+55bqU55qE5a+56LGh55qE5omA5pyJ5LqL5Lu2XHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyByZW1vdmVBbGxMaXN0ZW5lcnMoIHRhcmdldDpMYXlhLkV2ZW50RGlzcGF0Y2hlciA9IG51bGwgKTp2b2lke1xyXG5cclxuXHRcdGlmKCB0YXJnZXQgPT0gbnVsbCApe1xyXG5cdFx0XHRFdmVudE1hbmFnZXIucmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcigpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxldCBsaXN0OkFycmF5PE9iamVjdD4gPSBFdmVudE1hbmFnZXIuZ2V0TGlzdGVuZXJMaXN0KCB0YXJnZXQgKTtcclxuXHRcdFx0dmFyIG9iajogT2JqZWN0O1xyXG4gICAgICAgICAgICB3aGlsZSAobGlzdCAmJiBsaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG9iaiA9IGxpc3Quc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIob2JqW1widHlwZVwiXSwgb2JqW1wibGlzdGVuZXJcIl0sIG9ialtcInRoaXNPYmplY3RcIl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDnp7vpmaTmiYDmnInlhajlsYDkuovku7ZcclxuXHQgKi9cclxuXHRwcml2YXRlIHN0YXRpYyByZW1vdmVBbGxFdmVudExpc3RlbmVyKCkge1xyXG5cdFx0Ly8gZm9yIChsZXQgZm9yaW5sZXRfXyBpbiBFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5tYXApIHtcclxuXHRcdC8vIFx0bGV0IHR5cGUgPSBFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5tYXBbZm9yaW5sZXRfX11bMF07XHJcblx0XHQvLyBcdEV2ZW50TWFuYWdlci5yZW1vdmVFdmVudExpc3RlbmVycyh0eXBlKTtcclxuXHRcdC8vIH1cclxuXHRcdGZvciggbGV0IGtleSBpbiBFdmVudE1hbmFnZXIuX2V2ZW50RGljdCApe1xyXG5cdFx0XHRsZXQgdHlwZTphbnkgPSBFdmVudE1hbmFnZXIuX2V2ZW50RGljdFsga2V5IF07XHJcblx0XHRcdEV2ZW50TWFuYWdlci5yZW1vdmVFdmVudExpc3RlbmVycyggdHlwZSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog56e76Zmk5omA5pyJ5a+55bqU57G75Z6L5LqL5Lu255uR5ZCsXHJcblx0ICogQHBhcmFtIHR5cGUg5LqL5Lu257G75Z6LXHJcblx0ICogQHBhcmFtIFxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoIHR5cGU6IHN0cmluZyA9IG51bGwgKSB7XHJcblx0XHRpZiAodHlwZSAhPSBudWxsKSB7XHJcblx0XHRcdGlmIChFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5nZXQodHlwZSkgIT0gbnVsbCkge1xyXG5cdFx0XHRcdEV2ZW50TWFuYWdlci5fZXZlbnREaWN0LnNldCh0eXBlLCBudWxsKTtcclxuXHRcdFx0XHRFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5kZWwodHlwZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRFdmVudE1hbmFnZXIucmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcigpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog5piv5ZCm5pyJ5a+55bqU5LqL5Lu255qE55uR5ZCs5LqL5Lu2XHJcblx0ICogQHBhcmFtXHR0eXBlICAgICAgXHTkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW1cdGxpc3RlbmVyICBcdOS6i+S7tuaWueazlVxyXG5cdCAqIEBwYXJhbSBcdHRhcmdldFx0XHTnm5HlkKzlr7nosaFcclxuXHQgKiBAcGFyYW0gXHR0aGlzT2JqZWN0XHJcblx0ICogQHJldHVyblxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgaGFzTGlzdGVuZXJPZih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiA9IG51bGwsIHRhcmdldDogTGF5YS5FdmVudERpc3BhdGNoZXIgPSBudWxsLCB0aGlzT2JqZWN0OiBhbnkgPSBudWxsKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKSB7XHJcblx0XHRcdGxldCBmdW5jTGlzdDogQXJyYXk8YW55PiA9IEV2ZW50TWFuYWdlci5fdGFyZ2V0TWFwLmdldCh0YXJnZXQpO1xyXG5cdFx0XHR2YXIgb2JqOiBPYmplY3Q7XHJcblx0XHRcdGZvciAob2JqIG9mIGZ1bmNMaXN0KSB7XHJcblx0XHRcdFx0aWYgKG9iaiAmJiBvYmpbXCJ0eXBlXCJdID09IHR5cGUgJiYgKG9ialtcImxpc3RlbmVyXCJdID09IGxpc3RlbmVyIHx8IGxpc3RlbmVyID09IG51bGwpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBFdmVudE1hbmFnZXIuaGFzRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdGhpc09iamVjdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog5piv5ZCm5pyJ5a+55bqU55qE5YWo5bGA55uR5ZCs5LqL5Lu2XHJcblx0ICogQHBhcmFtXHR0eXBlICAgICAgXHTkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW1cdGxpc3RlbmVyICBcdOS6i+S7tuaWueazlVxyXG5cdCAqIEBwYXJhbSBcdHRoaXNPYmplY3RcclxuXHQgKiBAcmV0dXJuXHJcblx0ICovXHJcblx0cHJpdmF0ZSBzdGF0aWMgaGFzRXZlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiA9IG51bGwsIHRoaXNPYmplY3Q6IGFueSA9IG51bGwpOiBib29sZWFuIHtcclxuXHRcdGxldCBib29sOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHRsZXQgZnVuY0xpc3Q6IEFycmF5PGFueT4gPSA8YW55PkV2ZW50TWFuYWdlci5fZXZlbnREaWN0LmdldCh0eXBlKTtcclxuXHRcdGlmICghZnVuY0xpc3QgfHwgZnVuY0xpc3QubGVuZ3RoID09IDApIHtcclxuXHRcdFx0Ym9vbCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmIChsaXN0ZW5lciA9PSBudWxsKSB7XHJcblx0XHRcdFx0Ym9vbCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0ZnVuY0xpc3QuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuXHRcdFx0XHRcdGlmIChlbGVtZW50WzBdID09IGxpc3RlbmVyICYmIGVsZW1lbnRbMV0gPT0gdGhpc09iamVjdCkge1xyXG5cdFx0XHRcdFx0XHRib29sID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGJvb2w7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBib29sO1xyXG5cdH1cclxufSIsIi8qKlxyXG4gKiDpnaLmnb/ms6jlhowgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbFJlZ2lzdGVyIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gcGtnTmFtZSDmmK/lkKblt7Lms6jlhozotYTmupDljIVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBoYXNSZWdpc3RlckNsYXNzKCBwa2dOYW1lOnN0cmluZyApOmJvb2xlYW57XHJcblxyXG4gICAgICAgIHJldHVybiBwa2dOYW1lICYmICFmYWlyeWd1aS5VSVBhY2thZ2UuZ2V0QnlJZChcInJlcy9mYWlydWkvXCIrcGtnTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jlhoznu4Tku7bnsbvkuI5mYWlyeWd1aee8lui+keWZqOS4reexu+WvueW6lFxyXG4gICAgICogQHBhcmFtIHBrZ05hbWUg5YyF5ZCNXHJcbiAgICAgKiBAcGFyYW0gcmVzTmFtZSDotYTmupDlkI1cclxuICAgICAqIEBwYXJhbSBjbHNcdCAg5a+55bqU5YyF5Lit57G75ZCNXHQs5Li6bnVsbOWImeWPquazqOWGjOi1hOa6kOWMhVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyQ2xhc3MocGtnTmFtZTogc3RyaW5nLCByZXNOYW1lOiBzdHJpbmcgPSBcIlwiICwgY2xzOiBhbnkgPSBudWxsICk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAocGtnTmFtZSAmJiAhZmFpcnlndWkuVUlQYWNrYWdlLmdldEJ5SWQoXCJyZXMvZmFpcnVpL1wiK3BrZ05hbWUpKSB7XHJcbiAgICAgICAgICAgIGZhaXJ5Z3VpLlVJUGFja2FnZS5hZGRQYWNrYWdlKFwicmVzL2ZhaXJ1aS9cIitwa2dOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIGNscyApe1xyXG4gICAgICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSBmYWlyeWd1aS5VSVBhY2thZ2UuZ2V0SXRlbVVSTChwa2dOYW1lLCByZXNOYW1lKTtcclxuICAgICAgICAgICAgZmFpcnlndWkuVUlPYmplY3RGYWN0b3J5LnNldFBhY2thZ2VJdGVtRXh0ZW5zaW9uKHVybCwgY2xzKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuiHquWumuS5iWZhaXJ5Z3Vp57uE5Lu277yM5b+F6aG755So5q2k5pa55byPLOS4juS7peS4iuaWueazleWvueW6lOS9v+eUqCzkuI3og73nm7TmjqXkvb/nlKhuZXcgY2xzKCnnmoTmlrnlvI/liJvlu7rkuIDkuKrnu5HlrppmYWlyeWd1aeeahOexu++8gVxyXG4gICAgICogQHBhcmFtIHBrZ05hbWUg5YyF5ZCNXHJcbiAgICAgKiBAcGFyYW0gcmVzTmFtZSDotYTmupDlkI1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVHT2JqZWN0KHBrZ05hbWU6IHN0cmluZywgcmVzTmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICByZXR1cm4gZmFpcnlndWkuVUlQYWNrYWdlLmNyZWF0ZU9iamVjdEZyb21VUkwoZmFpcnlndWkuVUlQYWNrYWdlLmdldEl0ZW1VUkwocGtnTmFtZSwgcmVzTmFtZSkpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFBhbmVsUmVnaXN0ZXIgZnJvbSBcIi4uL1BhbmVsUmVnaXN0ZXJcIjtcclxuaW1wb3J0IEVCdXR0b24gZnJvbSBcIi4uL3ZpZXcvY29tcG9uZW50L0VCdXR0b25cIjtcclxuaW1wb3J0IEJhc2VTcHJpdGUgZnJvbSBcIi4uL3ZpZXcvY29tcG9uZW50L0Jhc2VTcHJpdGVcIjtcclxuaW1wb3J0IExvZyBmcm9tIFwiLi4vLi4vY29tL2xvZy9Mb2dcIjtcclxuaW1wb3J0IHsgQmFzZVBhbmVsIH0gZnJvbSBcIi4uL3ZpZXcvQmFzZVBhbmVsXCI7XHJcblxyXG4vKipcclxuICogRmFpcnlndWnnrqHnkIZcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZhaXJ5VUlNYW5hZ2VyIHtcclxuXHJcbiAgICAvKiroo4Xovb0gKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHBhcmVudDogTGF5YS5TcHJpdGUgPSBudWxsO1xyXG5cclxuICAgIC8qKuS4u+eVjOmdouWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBtYWluTGF5ZXI6IEJhc2VTcHJpdGU7XHJcbiAgICAvKirnlYzpnaLlsYIgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgd2luZG93TGF5ZXI6IEJhc2VTcHJpdGU7XHJcbiAgICAvKiogKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcHJvbXB0TGF5ZXI6IEJhc2VTcHJpdGU7XHJcbiAgICAvKirlvLnmoYblsYIgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYWxlcnRMYXllcjogQmFzZVNwcml0ZTtcclxuICAgIC8qKumhtuWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0b3BMYXllcjogQmFzZVNwcml0ZTtcclxuICAgIC8qKnRpcOWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0aXBMYXllcjogQmFzZVNwcml0ZSA9IG51bGw7XHJcbiAgICAvKirlvJXlr7zlsYIgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ3VpZGVMYXllcjogQmFzZVNwcml0ZSA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdCggY29udGFpbmVyOkxheWEuU3ByaXRlICk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiggIXRoaXMucGFyZW50ICl7XHRcdFx0XHRcclxuICAgICAgICAgICAgRmFpcnlVSU1hbmFnZXIubWFpbkxheWVyID0gbmV3IEJhc2VTcHJpdGUoKTtcclxuICAgICAgICAgICAgRmFpcnlVSU1hbmFnZXIud2luZG93TGF5ZXIgPSBuZXcgQmFzZVNwcml0ZSgpO1xyXG4gICAgICAgICAgICBGYWlyeVVJTWFuYWdlci5wcm9tcHRMYXllciA9IG5ldyBCYXNlU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIEZhaXJ5VUlNYW5hZ2VyLnRvcExheWVyID0gbmV3IEJhc2VTcHJpdGUoKTtcclxuICAgICAgICAgICAgRmFpcnlVSU1hbmFnZXIuYWxlcnRMYXllciA9IG5ldyBCYXNlU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIEZhaXJ5VUlNYW5hZ2VyLnRpcExheWVyID0gbmV3IEJhc2VTcHJpdGUoKTtcclxuICAgICAgICAgICAgRmFpcnlVSU1hbmFnZXIuZ3VpZGVMYXllciA9IG5ldyBCYXNlU3ByaXRlKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKCBmYWlyeWd1aS5HUm9vdC5pbnN0LmRpc3BsYXlPYmplY3QgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGFpbmVyLmFkZENoaWxkKGZhaXJ5Z3VpLkdSb290Lmluc3QuZGlzcGxheU9iamVjdCk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBjb250YWluZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZChGYWlyeVVJTWFuYWdlci5tYWluTGF5ZXIpO1xyXG4gICAgICAgIGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoRmFpcnlVSU1hbmFnZXIud2luZG93TGF5ZXIpO1xyXG4gICAgICAgIGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoRmFpcnlVSU1hbmFnZXIucHJvbXB0TGF5ZXIpO1xyXG4gICAgICAgIGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoRmFpcnlVSU1hbmFnZXIuYWxlcnRMYXllcik7XHJcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZChGYWlyeVVJTWFuYWdlci50b3BMYXllcik7XHRcdFx0XHJcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZChGYWlyeVVJTWFuYWdlci50aXBMYXllcik7XHJcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZChGYWlyeVVJTWFuYWdlci5ndWlkZUxheWVyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaJk+W8gOmdouadv1xyXG4gICAgICogQHBhcmFtIGNscyDpnaLmnb/nsbtcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBvcGVuKCBjbHM6YW55ICk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoIGNscyAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgIGxldCB2aWV3OmFueSA9IG5ldyBjbHMoKTtcclxuICAgICAgICAgICAgICAgIGlmKCB2aWV3IGluc3RhbmNlb2YgQmFzZVBhbmVsICl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5sb2FkKCk7ICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIHZpZXcucGFuZWxWby5pc05vcm1hbCApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpbmRvd0xheWVyLmFkZENoaWxkKCB2aWV3ICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1jYXRjaChlKXtcclxuICAgICAgICAgICAgICAgIExvZy5lcnJvciggdGhpcyAsIFwi5a6e5YiX6Z2i5p2/5aSx6LSl77yBXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBGYWlyeVVJTWFuYWdlcjtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogRmFpcnlVSU1hbmFnZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlID0gdGhpcy5pbnN0YW5jZSB8fCBuZXcgRmFpcnlVSU1hbmFnZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEJhc2VQYW5lbCB9IGZyb20gXCIuLi92aWV3L0Jhc2VQYW5lbFwiO1xyXG5pbXBvcnQgRUJ1dHRvbiBmcm9tIFwiLi4vdmlldy9jb21wb25lbnQvRUJ1dHRvblwiO1xyXG5pbXBvcnQgTG9nIGZyb20gXCIuLi8uLi9jb20vbG9nL0xvZ1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVUlHTVZpZXcgZXh0ZW5kcyBCYXNlUGFuZWwge1xyXG5cclxuICAgIHByaXZhdGUgYnRuX3BsYXk6RUJ1dHRvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlciggXCJjb21tb25cIiAsIFwiVUlHTVZpZXdcIiApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRBbGxMaXN0ZW5lcigpOnZvaWR7XHJcblxyXG4gICAgICAgIHN1cGVyLmFkZEFsbExpc3RlbmVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkR2FtZUxpc3RlbmVyKCBMYXlhLkV2ZW50LkNMSUNLICwgdGhpcy5jbGlja1BsYXlCdG5IYW5kbGVyICwgdGhpcyAsIHRoaXMuYnRuX3BsYXkgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQWxsTGlzdGVuZXIoKTp2b2lke1xyXG5cclxuICAgICAgICBzdXBlci5yZW1vdmVBbGxMaXN0ZW5lcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2xpY2tQbGF5QnRuSGFuZGxlciggZTpMYXlhLkV2ZW50ICk6dm9pZHtcclxuXHJcbiAgICAgICAgTG9nLmxvZyggdGhpcyAsIFwi54K55Ye75pKt5pS+5oyJ6ZKuXCIpO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBCYXNlU3ByaXRlIGZyb20gXCIuLi92aWV3L2NvbXBvbmVudC9CYXNlU3ByaXRlXCI7XHJcbi8vIGltcG9ydCB7IEVHTGlzdCB9IGZyb20gXCIuLi92aWV3L2NvbXBvbmVudC9FR0xpc3RcIjtcclxuXHJcbi8qKlxyXG4gKiBGYWlyeUdVSeW3peWFt1xyXG4gKiBAYXV0aG9yIGNsIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEZhaXJ5VXRpbHMge1xyXG5cclxuXHQvKipcclxuXHQgICog5aOw5piO5a655Zmo5a+55bqU5Y+Y6YePXHJcblx0ICAqIEBwYXJhbSBwYXJlbnQgXHRcdOWuueWZqFxyXG5cdCAgKiBAcGFyYW0gdGhpc09iamVjdCBcdHRoaXPlr7nosaFcclxuXHQgICovXHJcblx0cHVibGljIHN0YXRpYyBzZXRWYXIocGFyZW50OiBmYWlyeWd1aS5HQ29tcG9uZW50LCB0aGlzT2JqZWN0OiBhbnkpOiB2b2lkIHtcclxuXHJcblx0XHRpZiAocGFyZW50ICE9IG51bGwgJiYgdGhpc09iamVjdCAhPSBudWxsKSB7XHJcblx0XHRcdGxldCBkaXNPYmo6IGZhaXJ5Z3VpLkdPYmplY3Q7XHJcblx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBwYXJlbnQubnVtQ2hpbGRyZW47IGkrKykgeyAvL29iamVjdHNcclxuXHRcdFx0XHRkaXNPYmogPSBwYXJlbnQuZ2V0Q2hpbGRBdChpKTtcclxuXHRcdFx0XHRpZiAoZGlzT2JqLm5hbWUgPT0gXCJpY29uXCIgfHwgZGlzT2JqLm5hbWUgPT0gXCJ0aXRsZVwiKSB7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGRpc09iai5uYW1lICYmIGRpc09iai5uYW1lLmluZGV4T2YoXCJ0YWJfXCIpID09IDAgJiYgZGlzT2JqIGluc3RhbmNlb2YgZmFpcnlndWkuR0dyb3VwKSB7XHJcblx0XHRcdFx0XHQvLyB0aGlzT2JqZWN0W2Rpc09iai5uYW1lXSA9IG5ldyBmYWlydWkuRVRhYihkaXNPYmosIHRoaXNPYmplY3QpO1xyXG5cdFx0XHRcdFx0Ly8gaWYgKHRoaXNPYmplY3QgaW5zdGFuY2VvZiBCYXNlU3ByaXRlKSB0aGlzT2JqZWN0LmFkZENvbXBvbmVudCh0aGlzT2JqZWN0W2Rpc09iai5uYW1lXSk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChkaXNPYmoubmFtZSAmJiBkaXNPYmoubmFtZS5pbmRleE9mKFwiZWdsaXN0X1wiKSA9PSAwICYmIGRpc09iaiBpbnN0YW5jZW9mIGZhaXJ5Z3VpLkdMaXN0KSB7XHJcblx0XHRcdFx0XHQvLyB0aGlzT2JqZWN0W2Rpc09iai5uYW1lXSA9IG5ldyBFR0xpc3QoZGlzT2JqLCB0aGlzT2JqZWN0KTtcclxuXHRcdFx0XHRcdC8vIGlmICh0aGlzT2JqZWN0IGluc3RhbmNlb2YgQmFzZVNwcml0ZSkgdGhpc09iamVjdC5hZGRDb21wb25lbnQodGhpc09iamVjdFtkaXNPYmoubmFtZV0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzT2JqZWN0W2Rpc09iai5uYW1lXSA9IGRpc09iajtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBwYXJlbnQuX3RyYW5zaXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0bGV0IHRyYW5zT2JqOiBmYWlyeWd1aS5UcmFuc2l0aW9uO1xyXG5cdFx0XHRcdHRyYW5zT2JqID0gcGFyZW50Ll90cmFuc2l0aW9uc1tpXTtcclxuXHRcdFx0XHR0aGlzT2JqZWN0W3RyYW5zT2JqLm5hbWVdID0gdHJhbnNPYmo7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0iLCJpbXBvcnQgVmlldyBmcm9tIFwiLi9WaWV3XCI7XHJcbmltcG9ydCBFQnV0dG9uIGZyb20gXCIuL2NvbXBvbmVudC9FQnV0dG9uXCI7XHJcbmltcG9ydCB7IEZhaXJ5VXRpbHMgfSBmcm9tIFwiLi4vdXRpbHMvRmFpcnlVdGlsc1wiO1xyXG5pbXBvcnQgRmFpcnlVSU1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXIvRmFpcnlVSU1hbmFnZXJcIjtcclxuaW1wb3J0IFBhbmVsVm8gZnJvbSBcIi4uL3ZvL1BhbmVsVm9cIjtcclxuaW1wb3J0IExvYWRTb3VyY2VNYW5hZ2VyIGZyb20gXCIuLi8uLi9jb20vbG9hZC9Mb2FkU291cmNlTWFuYWdlclwiO1xyXG5pbXBvcnQgVXJsVXRpbHMgZnJvbSBcIi4uLy4uL2NvbS9sb2FkL3V0aWxzL1VybFV0aWxzXCI7XHJcbmltcG9ydCBQYW5lbFJlZ2lzdGVyIGZyb20gXCIuLi9QYW5lbFJlZ2lzdGVyXCI7XHJcblxyXG4vKipcclxuICog6Z2i5p2/5Z+657G7XHJcbiAqIEBhdXRob3IgY2wgMjAxOC41LjE4XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQmFzZVBhbmVsIGV4dGVuZHMgVmlldyB7XHJcblxyXG4gICAgcHJvdGVjdGVkIHZpZXc6IGZhaXJ5Z3VpLkdDb21wb25lbnQgPSBudWxsO1xyXG4gICAgLyoq6IOM5pmvICovXHJcbiAgICBwcm90ZWN0ZWQgYmc6IGZhaXJ5Z3VpLkdJbWFnZSB8IGZhaXJ5Z3VpLkdMb2FkZXI7XHJcbiAgICAvKirmoIfpopjmoI8gKi9cclxuICAgIC8vIHByb3RlY3RlZCB0aXRsZUJhcjogVGl0bGVCYXI7XHJcbiAgICAvKirlhbPpl63mjInpkq465Y+W6L+Z5Liq5ZCN5a2X55qE5oyJ6ZKuLOS8muagueaNruWxj+W5leWkp+Wwj+iwg+aVtOS9jee9riAqL1xyXG4gICAgcHJvdGVjdGVkIGJ0bl9jbG9zZTogZmFpcnlndWkuR0J1dHRvbiB8IEVCdXR0b247XHJcbiAgICAvKirkvKAgZmFsc2Ug6KGo56S65LiN57uR5a6a54K55Ye76YGu572p5YWz6Zet6Z2i5p2/5LqL5Lu2ICovXHJcbiAgICAvLyBwcm90ZWN0ZWQgb3BlblRhcE1hc2s6IGJvb2xlYW47XHJcbiAgICAvLyAvKirljIXlkI0gKi9cclxuICAgIC8vIHByb3RlY3RlZCBfcGtnTmFtZTogc3RyaW5nID0gXCJcIjtcclxuICAgIC8vIC8qKuexu+WQjSAqL1xyXG4gICAgLy8gcHJvdGVjdGVkIF9yZXNOYW1lOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgXHJcbiAgICAvKirpnaLmnb/mlbDmja4gKi9cclxuICAgIHByb3RlY3RlZCBfcGFuZWxWbzpQYW5lbFZvID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOmdouadv+Wfuuexu1xyXG4gICAgICogQHBhcmFtIHBrZ05hbWUg5YyF5ZCNXHJcbiAgICAgKiBAcGFyYW0gcmVzTmFtZSDlr7nlupTpnaLmnb/lkI3lrZdcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHBrZ05hbWU6IHN0cmluZyA9IFwiXCIsIHJlc05hbWU6IHN0cmluZyA9IFwiXCIpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcGFuZWxWbyA9IG5ldyBQYW5lbFZvKCk7XHJcbiAgICAgICAgdGhpcy5fcGFuZWxWby5wa2dOYW1lID0gcGtnTmFtZTtcclxuICAgICAgICB0aGlzLl9wYW5lbFZvLnJlc05hbWUgPSByZXNOYW1lO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0RnJvbVhNTCh4bWw6IGFueSk6IHZvaWQge1xyXG5cclxuICAgICAgICBzdXBlci5jb25zdHJ1Y3RGcm9tWE1MKHhtbCk7XHJcblxyXG4gICAgICAgIC8vRmFpcnlVdGlscy5zZXRWYXIodGhpcywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3otYTmupBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGxvYWQoKTp2b2lke1xyXG5cclxuICAgICAgICBsZXQgdXJsczpBcnJheTxzdHJpbmc+ID0gVXJsVXRpbHMuZ2V0RmFpcnlHcm91cCggXCJjb21tb25cIiApO1xyXG4gICAgICAgIExvYWRTb3VyY2VNYW5hZ2VyLmxvYWRHcm91cCggXCJjb21tb25cIiAsIHVybHMgLCBMYXlhLkhhbmRsZXIuY3JlYXRlKCB0aGlzICwgdGhpcy5pbml0ICkgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirpnaLmnb/mlbDmja4gKi9cclxuICAgIHB1YmxpYyBnZXQgcGFuZWxWbygpOlBhbmVsVm97XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYW5lbFZvO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0KCk6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBpZiAoIHRoaXMuX3BhbmVsVm8ucGtnTmFtZSAmJiAhZmFpcnlndWkuVUlQYWNrYWdlLmdldEJ5SWQodGhpcy5fcGFuZWxWby5wa2dOYW1lKSkge1xyXG4gICAgICAgIC8vICAgICBmYWlyeWd1aS5VSVBhY2thZ2UuYWRkUGFja2FnZSh0aGlzLl9wYW5lbFZvLnBrZ05hbWUpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBQYW5lbFJlZ2lzdGVyLnJlZ2lzdGVyQ2xhc3MoIHRoaXMuX3BhbmVsVm8ucGtnTmFtZSApO1xyXG5cclxuICAgICAgICAvLyB0aGlzLl9wYW5lbFZvLm9wZW5UYXBNYXNrID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgbGV0IG9iajogYW55ID0gZmFpcnlndWkuVUlQYWNrYWdlLmNyZWF0ZU9iamVjdCggdGhpcy5fcGFuZWxWby5wa2dOYW1lLCB0aGlzLl9wYW5lbFZvLnJlc05hbWUgKTtcclxuICAgICAgICB0aGlzLnZpZXcgPSBvYmouYXNDb207XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLnZpZXcpO1xyXG5cclxuICAgICAgICBGYWlyeVV0aWxzLnNldFZhcih0aGlzLnZpZXcsIHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRVSSgpO1xyXG5cclxuICAgICAgICB0aGlzLm9uUmVzaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXRVSSgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gaWYgKHRoaXMudGl0bGVCYXIgIT0gbnVsbCkge1xyXG4gICAgICAgIC8vICAgICB0aGlzLmJ0bl9jbG9zZSA9IHRoaXMudGl0bGVCYXIuYnRuX2Nsb3NlO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQWxsTGlzdGVuZXIoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHN1cGVyLmFkZEFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuYnRuX2Nsb3NlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRHYW1lTGlzdGVuZXIoTGF5YS5FdmVudC5DTElDSywgdGhpcy5jbG9zZUhhbmRsZXIsIHRoaXMuYnRuX2Nsb3NlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hZGRHYW1lTGlzdGVuZXIoR2FtZUV2ZW50LlNUR0FFX1JFU0laRSwgdGhpcy5vblJlc2l6ZSwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7moIfpopjnmq7ogqRcclxuICAgICAqIEBhdXRob3IgcGtnTmFtZSDljIXlkI1cclxuICAgICAqIEBhdXRob3IgcmVzTmFtZSDotYTmupDlkI1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFRpdGxlU2tpbihwa2dOYW1lOiBzdHJpbmcsIHJlc05hbWU6IHN0cmluZyk6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBpZiAodGhpcy50aXRsZUJhciAhPSBudWxsKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMudGl0bGVCYXIuc2V0VGl0bGVTa2luKHBrZ05hbWUsIHJlc05hbWUpO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlueVjOmdouWtkOWFg+S7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Vmlld0NoaWxkKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnZpZXcgPyB0aGlzLnZpZXcuZ2V0Q2hpbGQobmFtZSkgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiDmuLLmn5PliJfooajmnaHnm67mlrnms5VcclxuICAgICogQHBhcmFtIGluZGV4ICDlr7nlupTmnaHnm67ntKLlvJVcclxuICAgICogQHBhcmFtIG9iaiAgICDmuLLmn5Plr7nosaFcclxuICAgICovXHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyTGlzdEl0ZW0oaW5kZXg6IG51bWJlciwgb2JqOiBmYWlyeWd1aS5HT2JqZWN0KTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKuWFs+mXreS6i+S7tiAqL1xyXG4gICAgcHJvdGVjdGVkIGNsb3NlSGFuZGxlcigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWz6Zet6Z2i5p2/XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbG9zZShpc0hpZGVHdWlkZTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gRmFpcnlVSU1hbmFnZXIuY2xvc2VQYW5lbCh0aGlzLCB0aGlzLmNhbkRpc3Bvc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55WM6Z2i5piv5ZCm5Y+v6YeK5pS+XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0IGNhbkRpc3Bvc2UoKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHu01hc2vlsYIs5YWz6Zet6Z2i5p2/ICovXHJcbiAgICBwcm90ZWN0ZWQgdGFwTWFzayhlOiBMYXlhLkV2ZW50KTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaYvuekulxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvdyhkYXRhOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIC8vIHN1cGVyLnNob3coZGF0YSk7Ly/ov5nlj6Xor53kuIDlrpropoHmlL7lnKh0aGlzLnZpc2libGUgPSB0cnVl5LmL5ZCO5omn6KGMLOS4jeeEtumdouadv+S6i+S7tuazqOWGjOS4jeS6hiAgXHJcbiAgICAgICAgdGhpcy5pbml0RGF0YShkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmakOiXj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaGlkZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy52aXNpYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDovazljJbkuLrlr7nlupTnmoTnsbtcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvQ2xhc3MoKTogYW55IHtcclxuICAgICAgICBsZXQgY2xzTmFtZTogc3RyaW5nID0gdHlwZW9mIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIExheWEuQ2xhc3NVdGlscy5nZXRDbGFzcyhjbHNOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiHqumAguW6lFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25SZXNpemUoKTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5riF55CG5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgc3VwZXIuY2xlYXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHiuaUvui1hOa6kCzkuI3lhYHorrjlpJbpg6jnm7TmjqXosIPnlKjov5nkuKrmlrnms5VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRpc3Bvc2UoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHN1cGVyLmRpc3Bvc2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy52aWV3ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9kYXRhID0gbnVsbDtcclxuICAgICAgICBpZiggdGhpcy5fcGFuZWxWbyAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhbmVsVm8uZGlzcG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wYW5lbFZvID0gbnVsbDtcclxuICAgIH1cclxufSIsImltcG9ydCBCYXNlU3ByaXRlIGZyb20gXCIuL2NvbXBvbmVudC9CYXNlU3ByaXRlXCI7XHJcblxyXG4vKipcclxuICAqIFVJ5pi+56S65Luj55CG57G7XHJcbiAgKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVJQ29tcG9uZW50IGV4dGVuZHMgQmFzZVNwcml0ZSB7XHJcblxyXG5cdC8qKuaYr+WQpuaJk+W8gOi/h+eVjOmdoiAqL1xyXG5cdHByb3RlY3RlZCBpc09wZW5lZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdC8qKuaYr+WQpuWIneWni+WMluaJp+ihjOe7k+adnyAqL1xyXG5cdHByb3RlY3RlZCBpc0NvbXBseWVkOiBib29sZWFuID0gZmFsc2U7XHJcblx0Lyoq5Y+C5pWwICovXHJcblx0cHVibGljIHBhcmFtOiBhbnk7XHJcblxyXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuXHJcblx0XHRzdXBlcigpO1xyXG5cdH1cclxuXHJcblx0cHJvdGVjdGVkIGNvbnN0cnVjdEZyb21YTUwoeG1sOiBhbnkpOiB2b2lkIHtcclxuXHJcblx0XHRzdXBlci5jb25zdHJ1Y3RGcm9tWE1MKHhtbCk7XHJcblxyXG5cdFx0dGhpcy5pbml0KG51bGwpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGlzSW5pdGVkKCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuICF0aGlzLmlzQ29tcGx5ZWQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgaW5pdENvbXBsZXRlKCk6IGJvb2xlYW4ge1xyXG5cclxuXHRcdC8v5qOA5rWL5Yid5aeL5YyW5piv5ZCm5a6M5oiQXHJcblx0XHRpZiAoIXRoaXMuaXNJbml0ZWQoKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0aGlzLmlzT3BlbmVkKSB7XHJcblx0XHRcdHRoaXMuaXNPcGVuZWQgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLmluaXRVSSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuaW5pdERhdGEodGhpcy5wYXJhbSk7XHJcblx0XHR0aGlzLmFkZEFsbExpc3RlbmVyKCk7XHJcblxyXG5cdFx0dGhpcy5pc0NvbXBseWVkID0gdHJ1ZTtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOWklumDqOS4jeimgeiwg+eUqFxyXG5cdCAgKi9cclxuXHRwdWJsaWMgaW5pdChwYXJhbTogYW55KTogdm9pZCB7XHJcblx0XHR0aGlzLnBhcmFtID0gcGFyYW07XHJcblx0XHR0aGlzLmluaXRDb21wbGV0ZSgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOWIneWni+WMllVJ55WM6Z2iXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBpbml0VUkoKTogdm9pZCB7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOWIneWni+WMluWPguaVsFxyXG5cdCAgKi9cclxuXHRwdWJsaWMgaW5pdERhdGEocGFyYW06IGFueSA9IG51bGwpOiB2b2lkIHtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5YWz6Zet55WM6Z2i5pe26LCD55SoXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuXHJcblx0XHRzdXBlci5jbGVhcigpO1xyXG5cclxuXHRcdHRoaXMucGFyYW0gPSBudWxsO1xyXG5cdFx0dGhpcy5pc0NvbXBseWVkID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZGlzcG9zZSgpOiB2b2lkIHtcclxuXHJcblx0XHRzdXBlci5kaXNwb3NlKCk7XHJcblxyXG5cdFx0dGhpcy5wYXJhbSA9IG51bGw7XHJcblx0fVxyXG59IiwiaW1wb3J0IFVJQ29tcG9uZW50ICBmcm9tIFwiLi9VSUNvbXBvbmVudFwiO1xyXG5cclxuLyoqXHJcbiAqIFZpZXfln7rnsbtcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcgZXh0ZW5kcyBVSUNvbXBvbmVudCBpbXBsZW1lbnRzIElWaWV3IHtcclxuXHJcblx0Lyoq6LWE5rqQ5Y+v6YeK5pS+5ZCO57yT5a2Y5pe26Ze0LOavq+enkiAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0FDSEVfVElNRTogbnVtYmVyID0gNTAwMDtcclxuXHJcblx0cHVibGljIGNsczogYW55ID0gbnVsbDtcclxuXHQvL+mHiuaUvuaXtumXtFxyXG5cdHByb3RlY3RlZCBnY1RpbWU6IG51bWJlciA9IDA7XHJcblxyXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuXHJcblx0XHRzdXBlcigpO1xyXG5cdH1cclxuXHJcblx0Lyoq6I635Y+W5b2T5YmN57uE5Lu2Q2xhc3PnsbsgKi9cclxuXHRwdWJsaWMgZ2V0Q2xzKCk6IGFueSB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuY2xzO1xyXG5cdH1cclxuXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Lyoq5Yqg6L296LWE5rqQICovXHJcblx0cHVibGljIGxvYWQoKTp2b2lke1xyXG5cclxuXHRcdHRoaXMuaW5pdCggbnVsbCApO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGluaXQocGFyYW06IGFueSk6IHZvaWQge1xyXG5cdFx0c3VwZXIuaW5pdChwYXJhbSk7XHJcblx0XHR0aGlzLmdjVGltZSA9IE51bWJlci5NQVhfVkFMVUU7XHJcblx0fVxyXG5cclxuXHQvL+WIneWni+WMllVJXHJcblx0cHVibGljIGluaXRVSSgpOiB2b2lkIHtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog6Ieq6YCC5bqU5o6l5Y+jXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBvblJlc2l6ZSgpOiB2b2lkIHtcclxuXHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOaYr+WQpuWPr+WbnuaUtlxyXG5cdCAgKi9cclxuXHRwdWJsaWMgaXNDYW5HYygpOiBib29sZWFuIHtcclxuXHJcblx0XHRyZXR1cm4gTGF5YS50aW1lci5jdXJyRnJhbWUgPiB0aGlzLmdjVGltZTsvLyBHbG9iYWwudGltZXIuY3VyckZyYW1lID49IHRoaXMuZ2NUaW1lO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOmHjee9rizmr4/mrKHlhbPpl63nlYzpnaLosIPnlKhcclxuXHQgICovXHJcblx0cHVibGljIGNsZWFyKCk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmNsZWFyKCk7XHJcblx0XHR0aGlzLmdjVGltZSA9IExheWEudGltZXIuY3VyckZyYW1lICsgVmlldy5DQUNIRV9USU1FO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOmUgOavge+8jOWujOWFqOmUgOavgeWvueixoeWSjOi1hOa6kFxyXG5cdCAgKiDmjqXlj6PpmaTkuobnu4Tku7bkvaDku6zlhbblroPlnLDmlrnkuI3opoHosIPnlKjov5nkuKrmjqXlj6NcclxuXHQgICog5Y+q5pyJ5Zue5pS26LWE5rqQ55qE5pe25YCZ5Lya6LCD55So5LiA5qyhXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBkaXNwb3NlKCk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcclxuXHRcdHRoaXMuY2xzID0gbnVsbDtcclxuXHR9XHJcbn0iLCIvKipcclxuICog5Z+65LqOZmFpcnlndWkuR0J1dHRvbueahOWfuuexu+aMiemSrlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUJ1dHRvbiBleHRlbmRzIGZhaXJ5Z3VpLkdCdXR0b24ge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgXHJcbiAgICAgICAgc3VwZXIoKTsgXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgR2xvYmFsIGZyb20gXCIuLi8uLi8uLi9HbG9iYWxcIjtcclxuaW1wb3J0IEV2ZW50UG9vbCBmcm9tIFwiLi4vLi4vLi4vY29tL2V2ZW50cy9FdmVudFBvb2xcIjtcclxuXHJcbi8qKlxyXG4gKiBmYWlyeWd1aeWOn+S7tuWfuuexu1xyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVNwcml0ZSBleHRlbmRzIGZhaXJ5Z3VpLkdDb21wb25lbnQgaW1wbGVtZW50cyBJQ29tcG9uZW50e1xyXG5cclxuICAgIC8qKuaVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIF9kYXRhOiBhbnkgPSBudWxsO1xyXG4gICAgLyoq5piv5ZCm5Y+Y54GwICovXHJcbiAgICBwcm90ZWN0ZWQgX2lzR3JheTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLyoqXHJcbiAgICAgKiDnlKjkvKDlhaXnmoRmYWlyeXVpLkdDb21wb25lbnTovazljJbkuLpCYXNlU3ByaXRlXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBvd2VyOiBmYWlyeWd1aS5HQ29tcG9uZW50ID0gbnVsbDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2ljb25Mb2FkZXI6ZmFpcnlndWkuR0xvYWRlcjtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2N1cnJlbnRTdGF0ZTpzdHJpbmcgPSBcIlwiO1xyXG5cclxuXHRwcm90ZWN0ZWQgX2J1dHRvbkNvbnRyb2xsZXI6ZmFpcnlndWkuQ29udHJvbGxlcjtcclxuXHJcbiAgICAvL+S6i+S7tue8k+WtmOaxoFxyXG4gICAgcHJvdGVjdGVkIG1fZXZlbnRQb29sOiBFdmVudFBvb2wgPSBudWxsO1xyXG4gICAgLy/nu4Tku7bnvJPlrZjmsaBcclxuXHRwcm90ZWN0ZWQgbV9jb21wb25lbnREaWM6IExheWEuV2Vha09iamVjdCA9IG51bGw7XHJcbiAgICAgICAgXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29tcDogZmFpcnlndWkuR0NvbXBvbmVudCA9IG51bGwpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vd2VyID0gY29tcDtcclxuXHJcbiAgICAgICAgdGhpcy5tX2V2ZW50UG9vbCA9IEV2ZW50UG9vbC5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RGcm9tWE1MKHhtbDogYW55KTogdm9pZCB7XHJcblxyXG4gICAgICAgIHN1cGVyLmNvbnN0cnVjdEZyb21YTUwoeG1sKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0Q29udHJvbGxlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWIneWni+WMluaOp+WItuWZqCAqL1xyXG4gICAgcHJvdGVjdGVkIGluaXRDb250cm9sbGVyKCk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5fYnV0dG9uQ29udHJvbGxlciA9IHRoaXMuZ2V0Q29udHJvbGxlcihcImJ1dHRvblwiKTtcclxuICAgICAgICB0aGlzLl9pY29uTG9hZGVyID0gPGZhaXJ5Z3VpLkdMb2FkZXI+dGhpcy5nZXRDaGlsZChcImljb25cIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBjdXJyZW50U3RhdGUodmFsdWU6IHN0cmluZykge1xyXG5cdFx0XHRcclxuICAgICAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuX2J1dHRvbkNvbnRyb2xsZXIgKXtcclxuICAgICAgICAgICAgdGhpcy5fYnV0dG9uQ29udHJvbGxlci5zZWxlY3RlZFBhZ2UgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKirlvZPliY3nirbmgIEgKi9cclxuICAgIHB1YmxpYyBnZXQgY3VycmVudFN0YXRlKCk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50U3RhdGU7XHJcbiAgICB9XHRcdFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5YyF5ZCr5YWo5bGA5Z2Q5qCH54K5XHJcbiAgICAgKiBAcGFyYW0gZ3gg5YWo5bGAWOWdkOagh1xyXG4gICAgICogQHBhcmFtIGd5IOWFqOWxgFnlnZDmoIdcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnRhaW5zR2xvYmFsUG9pbnQoZ3g6IG51bWJlciwgZ3k6IG51bWJlcik6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICBsZXQgbHA6IExheWEuUG9pbnQgPSB0aGlzLmdsb2JhbFRvTG9jYWwoZ3gsIGd5KTtcclxuICAgICAgICBsZXQgYm91bmRzOiBMYXlhLlJlY3RhbmdsZSA9IG5ldyBMYXlhLlJlY3RhbmdsZSgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgcmV0dXJuIGJvdW5kcy5jb250YWlucyhscC54LCBscC55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2hpbGQoY2hpbGQ6IGZhaXJ5Z3VpLkdPYmplY3QpOiBmYWlyeWd1aS5HT2JqZWN0IHtcclxuXHJcbiAgICAgICAgaWYgKCBHbG9iYWwuaXMoIGNoaWxkICwgXCJJQ29tcG9uZW50XCIgKSApIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoPGFueT5jaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdXBlci5hZGRDaGlsZChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENoaWxkQXQoY2hpbGQ6IGZhaXJ5Z3VpLkdPYmplY3QsIGluZGV4OiBudW1iZXIpOiBmYWlyeWd1aS5HT2JqZWN0IHtcclxuXHJcbiAgICAgICAgaWYgKCBHbG9iYWwuaXMoIGNoaWxkICwgXCJJQ29tcG9uZW50XCIgKSApIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoPGFueT5jaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdXBlci5hZGRDaGlsZEF0KGNoaWxkLCBpbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmnaHnm65cclxuICAgICAqIEBwYXJhbSBuYW1lIOe7hOS7tuWQjeWtl1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RWxlbWVudChuYW1lOiBzdHJpbmcsIGNvbnRhaW5lcjogZmFpcnlndWkuR0NvbXBvbmVudCA9IG51bGwpOiBhbnkge1xyXG5cclxuICAgICAgICBjb250YWluZXIgPSBjb250YWluZXIgfHwgdGhpcztcclxuICAgICAgICByZXR1cm4gY29udGFpbmVyLmdldENoaWxkKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5YyF5ZCr5p+Q5Liq5a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb250YWlucyhjaGlsZDogZmFpcnlndWkuR09iamVjdCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZEluZGV4KGNoaWxkKSAhPSAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoExheWHljp/nlJ/lhYPku7ZcclxuICAgICAqIEBwYXJhbSBjaGlsZCBMYXlh5Y6f55Sf5pi+56S65a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRFZ3JldENoaWxkKGNoaWxkOiBMYXlhLk5vZGUpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmFkZENoaWxkKGNoaWxkKTtcclxuICAgIH1cclxuICAgIC8qKua3u+WKoExheWHljp/nlJ/lhYPku7ZcclxuICAgICAqIEBwYXJhbSBjaGlsZCBMYXlh5Y6f55Sf5pi+56S65a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRFZ3JldENoaWxkQXQoY2hpbGQ6IExheWEuTm9kZSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hZGRDaGlsZEF0KGNoaWxkLCBpbmRleCk7ICAgICAgICBcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog56e76ZmkTGF5YeWOn+eUn+WFg+S7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlRWdyZXRDaGlsZChjaGlsZDogTGF5YS5Ob2RlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmIChjaGlsZCAmJiB0aGlzLl9jb250YWluZXIuY29udGFpbnMoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZW1vdmVDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZCAmJiBjaGlsZC5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHRvdWNoRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXIubW91c2VFbmFibGVkID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0b3VjaEVuYWJsZWQoKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250YWluZXIubW91c2VFbmFibGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdG91Y2hDaGlsZHJlbih2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXIubW91c2VUaHJvdWdoID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0b3VjaENoaWxkcmVuKCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGFpbmVyLm1vdXNlVGhyb3VnaDtcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICBwdWJsaWMgYWRkRXZlbnRMaXN0ZW5lciggdHlwZTpzdHJpbmcgLCBsaXN0ZW5lcjpGdW5jdGlvbiAsIHRoaXNPYmplY3Q6YW55ICwgYXJnczpBcnJheTxhbnk+ID0gbnVsbCApOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMub24oIHR5cGUgLCB0aGlzT2JqZWN0ICwgbGlzdGVuZXIgLCBhcmdzIClcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZTpzdHJpbmcgLCBsaXN0ZW5lcjpGdW5jdGlvbiAsIHRoaXNPYmplY3Q6YW55ICk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5vZmYoIHR5cGUgLCB0aGlzT2JqZWN0ICwgbGlzdGVuZXIgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWinuWKoOebkeWQrOS6i+S7tuWHveaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkQWxsTGlzdGVuZXIoKTp2b2lkIHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLnJlbGlzdGVuZXJBbGwoKTtcclxuICAgICAgICAgICAgZm9yKCBsZXQga2V5IGluIHRoaXMubV9jb21wb25lbnREaWMgKXtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhOmFueSA9IHRoaXMubV9jb21wb25lbnREaWMuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgICAgIGlmKCBHbG9iYWwuaXMoIGRhdGEgLCBcIklDb21wb25lbnRcIiApKXtcclxuICAgICAgICAgICAgICAgICAgICAoPElDb21wb25lbnQ+ZGF0YSkuYWRkQWxsTGlzdGVuZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cdFx0XHRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOebkeWQrOS6i+S7tuWHveaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQWxsTGlzdGVuZXIoKTp2b2lkIHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YTphbnkgPSB0aGlzLm1fY29tcG9uZW50RGljLmdldCgga2V5ICk7XHJcbiAgICAgICAgICAgICAgICBpZiggR2xvYmFsLmlzKCBkYXRhICwgXCJJQ29tcG9uZW50XCIgKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgKDxJQ29tcG9uZW50PmRhdGEpLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHRcdFx0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDkuovku7bnm5HlkKxcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEdhbWVMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiwgdGhpc09iamVjdDogYW55ICwgdGFyZ2V0PzogYW55KSB7XHJcbiAgICAgICAgaWYoIHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLmFkZExpc3RlbmVyKCB0eXBlICwgbGlzdGVuZXIgLCB0YXJnZXQgLCB0aGlzT2JqZWN0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5LqL5Lu255uR5ZCsXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVHYW1lTGlzdGVuZXIodHlwZTogc3RyaW5nLCBsaXN0ZW5lcjogRnVuY3Rpb24sIHRoaXNPYmplY3Q6IGFueSAsIHRhcmdldD86IGFueSkge1xyXG4gICAgICAgIGlmKCB0aGlzLm1fZXZlbnRQb29sICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5tX2V2ZW50UG9vbC5yZW1vdmVMaXN0ZW5lciggdHlwZSAsIGxpc3RlbmVyICwgdGFyZ2V0ICwgdGhpc09iamVjdCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOe7hOS7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkQ29tcG9uZW50KGNvbXBvbmVudDogSUNvbXBvbmVudCk6IGFueSB7XHJcblxyXG4gICAgICAgIGlmKCBjb21wb25lbnQgKXtcclxuICAgICAgICAgICAgbGV0IGhhc2hDb2RlOm51bWJlciA9IGNvbXBvbmVudC5nZXRIYXNoQ29kZSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljLnNldCggaGFzaENvZGUgLCBjb21wb25lbnQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOe7hOS7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudDogSUNvbXBvbmVudCk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiggY29tcG9uZW50ICE9IG51bGwgKXtcclxuICAgICAgICAgICAgbGV0IGhhc2hDb2RlOm51bWJlciA9IGNvbXBvbmVudC5nZXRIYXNoQ29kZSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljLmRlbCggaGFzaENvZGUgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5omA5pyJ57uE5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVBbGxDb21wb25lbnQoKTp2b2lke1xyXG5cclxuICAgICAgICBmb3IobGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgIHRoaXMubV9jb21wb25lbnREaWMuZGVsKCBrZXkgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdGhpcy5tX2NvbXBvbmVudERpYy5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YeN572u55WM6Z2iXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOmFueSA9IHRoaXMubV9jb21wb25lbnREaWMuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgaWYoIEdsb2JhbC5pcyggZGF0YSAsIFwiSUNvbXBvbmVudFwiICkgKXtcclxuICAgICAgICAgICAgICAgICg8SUNvbXBvbmVudD5kYXRhKS5jbGVhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBkZXN0cm95Q29tcG9uZW50KCk6IHZvaWQge1xyXG4gICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOmFueSA9IHRoaXMubV9jb21wb25lbnREaWMuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgaWYoIEdsb2JhbC5pcyggZGF0YSAsIFwiSUNvbXBvbmVudFwiICkgKXtcclxuICAgICAgICAgICAgICAgICg8SUNvbXBvbmVudD5kYXRhKS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bllK/kuIBoYXNoQ29kZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0SGFzaENvZGUoKTogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXNbXCIkX0dJRFwiXSA9IHRoaXNbXCIkX0dJRFwiXSB8fCBMYXlhLlV0aWxzLmdldEdJRCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNEaXNwb3NlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpc1tcIl9kaXNwb3NlZFwiXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHiuaUvuaJgOaciei1hOa6kFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpOnZvaWR7XHJcblxyXG4gICAgICAgIGlmICh0aGlzW1wiX2Rpc3Bvc2VkXCJdKXsgLy9mYWlyeWd1aSDkuK3nmoTnp4HmnInlsZ7mgKdcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuZGlzcG9zZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1fZXZlbnRQb29sKSB7XHJcbiAgICAgICAgICAgIHRoaXMubV9ldmVudFBvb2wuZGlzcG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljID0gbnVsbDtcclxuICAgICAgICB0aGlzLm1fZXZlbnRQb29sID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJhc2VCdXR0b24gZnJvbSBcIi4vQmFzZUJ1dHRvblwiO1xyXG4vKipcclxuICog5bCB6KOFZmFpcnlndWnmjInpkq5cclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVCdXR0b24gZXh0ZW5kcyBCYXNlQnV0dG9uIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIOmdouadv+aVsOaNrlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4yNlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFuZWxWbyB7XHJcblxyXG4gICAgLyoq6Z2i5p2/SUQgKi9cclxuICAgIHB1YmxpYyBpZDpudW1iZXIgPSAwO1xyXG4gICAgLyoq6Z2i5p2/57G75Z6LICovXHJcbiAgICBwdWJsaWMgdHlwZTpudW1iZXIgPSAwO1xyXG4gICAgLyoq5bGC57qnIDDkuLrpu5jorqTnlYzpnaLlsYIgKi9cclxuICAgIHB1YmxpYyBsYXllcjpudW1iZXIgPSAwO1xyXG4gICAgLyoq5LygIGZhbHNlIOihqOekuuS4jee7keWumueCueWHu+mBrue9qeWFs+mXremdouadv+S6i+S7tiAqL1xyXG4gICAgcHVibGljIG9wZW5UYXBNYXNrOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLyoqZmFpcnlndWkg5a+55bqU5YyF5ZCNICovXHJcbiAgICBwdWJsaWMgcGtnTmFtZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgLyoqZmFpcnlndWkg5a+55bqU5YyF6LWE5rqQ5ZCNICovXHJcbiAgICBwdWJsaWMgcmVzTmFtZTpzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCAgKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNOb3JtYWwoKTpib29sZWFue1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50eXBlICA9PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwb3NlKCk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5wa2dOYW1lID0gXCJcIjtcclxuICAgICAgICB0aGlzLnJlc05hbWUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudHlwZSA9IDA7XHJcbiAgICAgICAgdGhpcy5pZCA9IDA7XHJcbiAgICAgICAgdGhpcy5vcGVuVGFwTWFzayA9IGZhbHNlOyAgICAgICAgXHJcbiAgICB9XHJcbn0iXX0=
