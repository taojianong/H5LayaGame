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
var UIMainView_1 = require("./fairui/panel/UIMainView");
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
        FairyUIManager_1.default.open(UIMainView_1.default);
    };
    return GameClient;
}(Laya.Sprite));
exports.default = GameClient;
},{"./com/load/LoadSourceManager":7,"./com/load/utils/UrlUtils":13,"./fairui/PanelRegister":18,"./fairui/manager/FairyUIManager":19,"./fairui/panel/UIMainView":21,"./fairui/view/component/EButton":29}],2:[function(require,module,exports){
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
},{"./GameClient":1,"./com/load/LoadSourceManager":7,"./com/log/Log":14,"./com/manager/EventManager":16}],3:[function(require,module,exports){
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
/**
 * 通用事件类
 * @author clong 2019.3.23
 */
var EventObj = /** @class */ (function () {
    /**
     * 事件构造函数
     * @param type      事件类型
     * @param listener       事件响应处理函数
     * @param target    事件绑定的控件
     * @param _hisObj   是否是绑定控件的 handler方法
     *
     */
    function EventObj(type, listener, target, thisObj) {
        if (type === void 0) { type = ""; }
        if (listener === void 0) { listener = null; }
        if (target === void 0) { target = null; }
        if (thisObj === void 0) { thisObj = null; }
        this._type = type;
        this._listener = listener;
        this._target = target;
        this._thisObj = thisObj;
    }
    EventObj.create = function (type, listener, target, thisObj) {
        if (target === void 0) { target = null; }
        if (thisObj === void 0) { thisObj = null; }
        var obj = EventObj.pool.shift();
        if (obj == null) {
            obj = new EventObj();
        }
        obj.type = type;
        obj.listener = listener;
        obj.target = target;
        obj.thisObj = thisObj;
        return obj;
    };
    EventObj.recover = function (obj) {
        if (obj != null && EventObj.pool.indexOf(obj) == -1) {
            EventObj.pool.push(obj);
        }
    };
    Object.defineProperty(EventObj.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (value) {
            this._type = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventObj.prototype, "listener", {
        get: function () {
            return this._listener;
        },
        set: function (value) {
            this._listener = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventObj.prototype, "target", {
        get: function () {
            return this._target;
        },
        set: function (value) {
            this._target = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventObj.prototype, "thisObj", {
        get: function () {
            return this._thisObj;
        },
        set: function (value) {
            this._thisObj = value;
        },
        enumerable: true,
        configurable: true
    });
    /**重置并回收 */
    EventObj.prototype.recover = function () {
        this._type = "";
        this._listener = null;
        this._target = null;
        this._thisObj = null;
        EventObj.recover(this);
    };
    EventObj.pool = [];
    return EventObj;
}());
exports.EventObj = EventObj;
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventManager_1 = require("../manager/EventManager");
var EventObj_1 = require("./EventObj");
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
            var obj = EventObj_1.EventObj.create(type, listener, target, thisObj);
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
},{"../manager/EventManager":16,"./EventObj":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 游戏事件
 * @author clong 2019.3.23
 */
var GameEvent = /** @class */ (function (_super) {
    __extends(GameEvent, _super);
    function GameEvent(type, data) {
        var _this = _super.call(this) || this;
        _this.thisObject = null;
        _this._data = null;
        _this.type = type;
        _this._data = data;
        return _this;
    }
    Object.defineProperty(GameEvent.prototype, "data", {
        get: function () {
            return this._data;
        },
        set: function (value) {
            this._data = value;
        },
        enumerable: true,
        configurable: true
    });
    /**选择 */
    GameEvent.SELECT = "GameEvent.select";
    /**渲染事件 */
    GameEvent.RENDER = "GameEvent.render";
    /**加载完成 */
    GameEvent.LOAD_COMPLETE = "GameEvent.loadComplete";
    /**舞台自适应 */
    GameEvent.STGAE_RESIZE = "GameEvent.stageResize";
    /**加载进度 */
    GameEvent.LOAD_PROGRESS = "GameEvent.loadProgress";
    /**列表渲染 */
    GameEvent.EGLIST_RENDER = "GameEvent.EGlistRender";
    /**列表渲染完成 */
    GameEvent.EGLIST_COMPLETE = "GameEvent.EGlistComplete";
    /**结束引导 */
    GameEvent.GUIDE_END = "GameEvent.guideEnd";
    /**寻找引导对象 */
    GameEvent.GUIDE_SEARCH_TARGET = "GameEvent.guideSearchTarget";
    /**设置引导目标对象 */
    GameEvent.GUIDE_TARGET = "GameEvent.guideTarget";
    /**主加载界面加载完成 */
    GameEvent.MAIN_LOAD_COMPLETE = "GameEvent.mainLoadComplete";
    /**开始游戏 */
    GameEvent.START_GAME = "GameEvent.stageGame";
    /**添加消息 */
    GameEvent.ADD_MESSAGE = "GameEvent.addMessage";
    /**播放广告 */
    GameEvent.PLAY_AD = "GameEvent.playAd";
    /**播放广告完成 */
    GameEvent.END_PLAY_AD = "GameEvent.endPlayAd";
    return GameEvent;
}(Laya.Event));
exports.GameEvent = GameEvent;
},{}],7:[function(require,module,exports){
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
            var groupRes = this.groupMap[groupName];
            if (groupRes == null) {
                groupRes = LoadSourceManager.create(grouplist, complete, progress);
                groupRes.name = groupName;
                groupRes.load();
                this.groupMap[groupName] = groupRes;
            }
            else if (complete != null) {
                if (groupRes.isLoaded()) {
                    complete.run();
                }
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
},{"../log/Log":14,"../manager/EventManager":16,"./event/LoaderEvent":8,"./resource/GroupResource":9,"./resource/Resource":10,"./resource/TxtResource":11,"./utils/LoadUtils":12}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
        else if (!this._list) {
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
},{"../LoadSourceManager":7,"./Resource":10}],10:[function(require,module,exports){
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
},{"../LoadSourceManager":7}],11:[function(require,module,exports){
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
},{"./Resource":10}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{"./LogVo":15}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{"../log/Log":14}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
  * 公用类
  * @author cl 2018.4.27
  */
var CommonUtils = /** @class */ (function () {
    function CommonUtils() {
    }
    /**
      * 获取分页页数
      * @param	arr   要分页的数组
      * @param	items 分页条目数
      * @return
      */
    CommonUtils.getPages = function (arr, items) {
        if (items === void 0) { items = 5; }
        var pages = 0;
        if (arr && arr.length > 0) {
            pages = (arr.length % items) > 0 ? parseInt("" + (arr.length / items)) + 1 : parseInt("" + (arr.length / items));
        }
        else {
            pages = 0;
        }
        return pages || 1;
    };
    /*************************************************
      * 按照arr的数组进行分页处理
      * arr = [0,1,2,3,4,5,6],page为当前页，items为每页的条数
      * 页数从1开始
      * @param arr   要分割的数组
      * @param page  当前页数
      * @param items 每页页数条目
      */
    CommonUtils.getPageList = function (arr, page, items) {
        if (page === void 0) { page = 1; }
        if (items === void 0) { items = 5; }
        var newArr = new Array;
        /*
        * 根据当前数组长度得到总页数
        */
        var pages = 0;
        if (arr.length > 0) {
            pages = (arr.length % items) > 0 ? parseInt("" + (arr.length / items)) + 1 : parseInt("" + (arr.length / items));
        }
        else {
            pages = 0;
            return newArr;
        }
        if (page > pages) {
            return null;
        }
        var min = (page - 1) * items;
        var max = page * items;
        if (parseInt("" + (arr.length % items)) == 0) {
            max = page * items;
        }
        else {
            max = page == pages ? (page - 1) * items + parseInt("" + (arr.length % items)) : page * items;
        }
        for (var i = min; i < max; i++) {
            newArr.push(arr[i]);
        }
        return newArr;
    };
    CommonUtils.getQualifiedClassName = function (value) {
        var type = typeof value;
        if (!value || (type != "object" && !value.prototype)) {
            return type;
        }
        var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty("__class__")) {
            return prototype["__class__"];
        }
        var constructorString = prototype.constructor.toString().trim();
        var index = constructorString.indexOf("(");
        var className = constructorString.substring(9, index);
        Object.defineProperty(prototype, "__class__", {
            value: className,
            enumerable: false,
            writable: true
        });
        return className;
    };
    return CommonUtils;
}());
exports.CommonUtils = CommonUtils;
},{}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSprite_1 = require("../view/component/BaseSprite");
var Log_1 = require("../../com/log/Log");
var BasePanel_1 = require("../view/BasePanel");
var CommonUtils_1 = require("../../com/utils/CommonUtils");
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
     * @param cls   面板类
     * @param data  其他数据
     */
    FairyUIManager.open = function (cls, data) {
        if (data === void 0) { data = null; }
        if (this._openedViews == null) {
            this._openedViews = new Laya.WeakObject();
        }
        if (cls != null) {
            try {
                var view = new cls();
                if (view instanceof BasePanel_1.BasePanel) {
                    view.load(data);
                    // view.show( data );
                    if (view.panelVo.isNormal) {
                        this.windowLayer.addChild(view);
                    }
                    this._openedViews.set(view.panelVo.clsName, view);
                }
            }
            catch (e) {
                Log_1.default.error(this, "实列面板失败！");
            }
        }
    };
    /**
     * 关闭界面
     * @param cls 面板类
     */
    FairyUIManager.close = function (cls) {
        if (cls != null) {
            var clsName = CommonUtils_1.CommonUtils.getQualifiedClassName(cls);
            var view = this._openedViews.get(clsName);
            this.closePanel(view);
        }
    };
    FairyUIManager.closePanel = function (view) {
        if (view instanceof BasePanel_1.BasePanel) {
            this._openedViews.del(view.panelVo.clsName);
            view.clear();
            if (view.parent != null) {
                view.parent.removeChild(view);
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
    /**当前打开的面板 */
    FairyUIManager._openedViews = null;
    return FairyUIManager;
}());
exports.default = FairyUIManager;
},{"../../com/log/Log":14,"../../com/utils/CommonUtils":17,"../view/BasePanel":24,"../view/component/BaseSprite":28}],20:[function(require,module,exports){
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
},{"../../com/log/Log":14,"../view/BasePanel":24}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasePanel_1 = require("../view/BasePanel");
var FairyUIManager_1 = require("../manager/FairyUIManager");
var UIGMView_1 = require("./UIGMView");
/**
 * 主界面
 * @author clong 2019.6.9
 */
var UIMainView = /** @class */ (function (_super) {
    __extends(UIMainView, _super);
    function UIMainView() {
        return _super.call(this, "main", "UIMainView") || this;
    }
    UIMainView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
    };
    UIMainView.prototype.addAllListener = function () {
        _super.prototype.addAllListener.call(this);
        this.addGameListener(Laya.Event.CLICK, this.clickGmHandler, this, this.btn_gm);
    };
    UIMainView.prototype.removeAllListener = function () {
        _super.prototype.removeAllListener.call(this);
    };
    UIMainView.prototype.clickGmHandler = function (e) {
        FairyUIManager_1.default.open(UIGMView_1.default);
    };
    UIMainView.prototype.clear = function () {
        _super.prototype.clear.call(this);
    };
    UIMainView.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    return UIMainView;
}(BasePanel_1.BasePanel));
exports.default = UIMainView;
},{"../manager/FairyUIManager":19,"../view/BasePanel":24,"./UIGMView":20}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * FairyGUI纹理集处理工具类
 * @author cl 2019.2.20
 */
var FairyTextureUtils = /** @class */ (function () {
    function FairyTextureUtils() {
    }
    /**
     * 获取资源地址
     * @param pkgName   包名
     * @param resName   资源名
     */
    FairyTextureUtils.getUrl = function (pkgName, resName) {
        var url = fairygui.UIPackage.getItemURL(pkgName, resName);
        return url;
    };
    /**
     * 获取Fairy资源包里的图片资源
     * @param pkgName   包名
     * @param resName   资源名
     */
    FairyTextureUtils.getTextureBy = function (pkgName, resName) {
        var url = fairygui.UIPackage.getItemURL(pkgName, resName);
        return this.getTexture(url);
    };
    /**
     * 根据Fairygui的URL地址获取对应纹理
     * @param uiUrl     如ui://q4evlwcjdmoc2i
     */
    FairyTextureUtils.getTexture = function (url) {
        var item = fairygui.UIPackage.getItemByURL(url);
        if (item) {
            item.load();
        }
        return item ? item.texture : null;
    };
    return FairyTextureUtils;
}());
exports.FairyTextureUtils = FairyTextureUtils;
},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var View_1 = require("./View");
var FairyUtils_1 = require("../utils/FairyUtils");
var FairyUIManager_1 = require("../manager/FairyUIManager");
var PanelVo_1 = require("../vo/PanelVo");
var LoadSourceManager_1 = require("../../com/load/LoadSourceManager");
var UrlUtils_1 = require("../../com/load/utils/UrlUtils");
var PanelRegister_1 = require("../PanelRegister");
var EGList_1 = require("./component/EGList");
var GameEvent_1 = require("../../com/events/GameEvent");
var CommonUtils_1 = require("../../com/utils/CommonUtils");
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
        /**是否正在加载 */
        _this.isLoad = false;
        /**面板数据 */
        _this._panelVo = null;
        _this._panelVo = new PanelVo_1.default();
        _this._panelVo.pkgName = pkgName;
        _this._panelVo.resName = resName;
        _this._panelVo.clsName = CommonUtils_1.CommonUtils.getQualifiedClassName(_this); // typeof this;
        return _this;
        // this.load();
    }
    BasePanel.prototype.constructFromXML = function (xml) {
        _super.prototype.constructFromXML.call(this, xml);
        //FairyUtils.setVar(this, this);
    };
    /**
     * 加载资源
     */
    BasePanel.prototype.load = function (data) {
        if (this.view == null && !this.isLoad) {
            this.isLoad = true;
            var urls = UrlUtils_1.default.getFairyGroup(this._panelVo.pkgName);
            LoadSourceManager_1.default.loadGroup(this._panelVo.pkgName, urls, Laya.Handler.create(this, this.init, [data], true));
        }
        else {
            this.init(data);
        }
    };
    Object.defineProperty(BasePanel.prototype, "panelVo", {
        /**面板数据 */
        get: function () {
            return this._panelVo;
        },
        enumerable: true,
        configurable: true
    });
    BasePanel.prototype.initComplete = function () {
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
    };
    BasePanel.prototype.init = function (data) {
        _super.prototype.init.call(this, data);
        this.isLoad = false;
        // if( this.view == null ){
        //     this.initUI();
        // }
        this.initData(this.param);
        // this.onResize();
    };
    BasePanel.prototype.initUI = function () {
        // if (this.titleBar != null) {
        //     this.btn_close = this.titleBar.btn_close;
        // }
        PanelRegister_1.default.registerClass(this._panelVo.pkgName);
        var obj = fairygui.UIPackage.createObject(this._panelVo.pkgName, this._panelVo.resName);
        this.view = obj.asCom;
        this.addChild(this.view);
        FairyUtils_1.FairyUtils.setVar(this.view, this);
        var disObj;
        for (var i = 0; i < this.view.numChildren; i++) { //objects
            disObj = this.view.getChildAt(i);
            if (disObj.name == "icon" || disObj.name == "title") {
                continue;
            }
            if (disObj.name && disObj.name.indexOf("tab_") == 0 && disObj instanceof fairygui.GGroup) {
                // this[disObj.name] = new fairui.ETab(disObj, this);
                // this.addComponent(this[disObj.name]);
            }
            else if (disObj.name && disObj.name.indexOf("eglist_") == 0 && disObj instanceof fairygui.GList) {
                this[disObj.name] = new EGList_1.EGList(disObj, this);
                this.addComponent(this[disObj.name]);
            }
        }
    };
    BasePanel.prototype.initData = function (data) {
        this.show(data);
    };
    BasePanel.prototype.addAllListener = function () {
        _super.prototype.addAllListener.call(this);
        if (this.btn_close != null) {
            this.addGameListener(Laya.Event.CLICK, this.closeHandler, this, this.btn_close);
        }
        this.addGameListener(GameEvent_1.GameEvent.STGAE_RESIZE, this.onResize, this);
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
        FairyUIManager_1.default.close(this);
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
        this._data = data;
        if (this.view == null) {
            return;
        }
        this.visible = true;
        this.addAllListener();
        this.onResize();
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
},{"../../com/events/GameEvent":6,"../../com/load/LoadSourceManager":7,"../../com/load/utils/UrlUtils":13,"../../com/utils/CommonUtils":17,"../PanelRegister":18,"../manager/FairyUIManager":19,"../utils/FairyUtils":23,"../vo/PanelVo":32,"./View":26,"./component/EGList":30}],25:[function(require,module,exports){
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
        this._data = param;
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
},{"./component/BaseSprite":28}],26:[function(require,module,exports){
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
    View.prototype.load = function (data) {
        this.init(data);
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
},{"./UIComponent":25}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventPool_1 = require("../../../com/events/EventPool");
var FairyUtils_1 = require("../../utils/FairyUtils");
var Global_1 = require("../../../Global");
/**
 * 基于fairygui.GButton的基类按钮
 * @author clong 2019.5.18
 */
var BaseButton = /** @class */ (function (_super) {
    __extends(BaseButton, _super);
    function BaseButton() {
        var _this = _super.call(this) || this;
        /**是否已经释放 */
        _this.isDispose = false;
        /**额外数据 */
        _this.__data = null;
        _this._enabled = true;
        /**是否初始化 */
        _this.isInit = false;
        _this._currentState = "";
        //组件缓存池
        _this.m_componentDic = null;
        //事件缓存池
        _this.m_eventPool = null;
        _this.m_eventPool = EventPool_1.default.create();
        _this.m_componentDic = new Laya.WeakObject();
        return _this;
    }
    /**初始创建时的方法，用于继承IPool的类 */
    BaseButton.prototype.create = function () {
    };
    BaseButton.prototype.constructFromXML = function (xml) {
        _super.prototype.constructFromXML.call(this, xml);
        FairyUtils_1.FairyUtils.setVar(this, this);
        this._btnController = this["_buttonController"];
        this.init(null);
    };
    BaseButton.prototype.IsInited = function () {
        return this.isInit;
    };
    Object.defineProperty(BaseButton.prototype, "currentState", {
        /**当前状态 */
        get: function () {
            return this._currentState;
        },
        set: function (value) {
            this._currentState = value;
            if (this._btnController) {
                this._btnController.selectedPage = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    BaseButton.prototype.show = function (value) {
        this.__data = value;
        this.addAllListener();
    };
    BaseButton.prototype.hide = function () {
        this.__data = null;
        this.removeAllListener();
    };
    Object.defineProperty(BaseButton.prototype, "enabled", {
        /**
         * 是否可点击,不可点击置灰
         */
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            this._enabled = value;
            this.touchable = value;
            if (this._iconObject) {
                this._iconObject.grayed = !value;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 添加Laya原生元件
     * @param child Laya原生显示对象
     */
    BaseButton.prototype.addLayaChild = function (child) {
        this._container.addChild(child);
    };
    /**添加Laya原生元件
     * @param child Laya原生显示对象
     */
    BaseButton.prototype.addLayaChildAt = function (child, index) {
        this._container.addChildAt(child, index);
    };
    /**
     * 移除Laya原生元件
     */
    BaseButton.prototype.removeLayaChild = function (child) {
        if (child && this._container.contains(child)) {
            this._container.removeChild(child);
        }
        else if (child && child.parent != null) {
            child.parent.removeChild(child);
        }
    };
    /**
     * 至于顶层
     */
    BaseButton.prototype.toTop = function () {
        if (this.parent != null) {
            if (this.parent.numChildren > 0) {
                this.parent.setChildIndex(this, this.parent.numChildren - 1);
            }
            else {
                this.parent.setChildIndex(this, 0);
            }
        }
    };
    /**
     * 改变元件深度索引
     * @param index 索引
     */
    BaseButton.prototype.indexTo = function (index) {
        if (this.parent != null) {
            if (index > (this.parent.numChildren - 1)) {
                index = this.parent.numChildren - 1;
            }
            else if (index < 0) {
                index = 0;
            }
            this.parent.setChildIndex(this, index);
        }
    };
    /**在父容器中的索引 */
    BaseButton.prototype.getIndex = function () {
        return this.parent ? this.parent.getChildIndex(this) : -1;
    };
    /**
     * 至于底部
     */
    BaseButton.prototype.toBottom = function () {
        if (this.parent != null) {
            this.parent.setChildIndex(this, 0);
        }
    };
    /**
     * 获取条目
     * @param name 组件名字
     */
    BaseButton.prototype.getElement = function (name, container) {
        if (container === void 0) { container = null; }
        container = container || this;
        return container.getChild(name);
    };
    /**
     * 是否包含某个对象
     */
    BaseButton.prototype.contains = function (child) {
        return this.getChildIndex(child) != -1;
    };
    Object.defineProperty(BaseButton.prototype, "touchEnabled", {
        get: function () {
            return this._container.mouseEnabled;
        },
        set: function (value) {
            this._container.mouseEnabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseButton.prototype, "touchChildren", {
        get: function () {
            return this._container.mouseThrough;
        },
        set: function (value) {
            this._container.mouseThrough = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 设置FairyGui资源
     * @param pkgName 包名
     * @param resName 资源名
     */
    BaseButton.prototype.setFairySource = function (pkgName, resName, disObj) {
        if (disObj === void 0) { disObj = null; }
        disObj = disObj || this._iconObject;
        var url = fairygui.UIPackage.getItemURL(pkgName, resName);
        this.setFairyUrl(url, disObj);
    };
    /**
     * 设置FairyGui资源地址
     * @param url FairyGui资源地址
     */
    BaseButton.prototype.setFairyUrl = function (url, disObj) {
        if (disObj === void 0) { disObj = null; }
        if (disObj != null) {
            disObj.url = url; // ? FairyTextureUtils.getTexture(url) : null;
        }
    };
    /**
     * 是否包含全局坐标点
     * @param gx 全局X坐标
     * @param gy 全局Y坐标
     */
    BaseButton.prototype.containsGlobalPoint = function (gx, gy) {
        var lp = this.globalToLocal(gx, gy);
        var bounds = new Laya.Rectangle(0, 0, this.width, this.height);
        if (this.pivotAsAnchor) { //是否中心点为锚点
            bounds.x = -this.width * 0.5;
            bounds.y = -this.height * 0.5;
        }
        return bounds.contains(lp.x, lp.y);
    };
    Object.defineProperty(BaseButton.prototype, "pixelHitTest", {
        /**
         * 像素穿透
         */
        set: function (val) {
            if (this._iconObject) {
                var loader = this._iconObject.asLoader;
                if (loader.content instanceof Laya.Bitmap) {
                    // loader.content.pixelHitTest = val;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    //--------------------------------------
    //初始化
    BaseButton.prototype.init = function (param) {
        this.initUI();
        this.addAllListener();
    };
    //初始化UI
    BaseButton.prototype.initUI = function () {
    };
    //增加监听事件函数
    BaseButton.prototype.addAllListener = function () {
        for (var key in this.m_componentDic) {
            var data = this.m_componentDic.get(key);
            if (Global_1.default.is(data, "IComponent")) {
                data.addAllListener();
            }
        }
    };
    //移除监听事件函数
    BaseButton.prototype.removeAllListener = function () {
        for (var key in this.m_componentDic) {
            var data = this.m_componentDic.get(key);
            if (Global_1.default.is(data, "IComponent")) {
                data.removeAllListener();
            }
        }
    };
    /**
     * 添加事件监听
     */
    BaseButton.prototype.addGameListener = function (type, listener, thisObject, target) {
        if (this.m_eventPool != null) {
            this.m_eventPool.addListener(type, listener, target, thisObject);
        }
    };
    /**
     * 移除事件监听
     */
    BaseButton.prototype.removeGameListener = function (type, listener, thisObject, target) {
        if (this.m_eventPool != null) {
            this.m_eventPool.removeListener(type, listener, target, thisObject);
        }
    };
    /**
     * 添加组件
     */
    BaseButton.prototype.addComponent = function (component) {
        if (component == null || this.m_componentDic.hasOwnProperty("" + component.getHashCode())) {
            //console.log("已有相同组件");
            return component;
        }
        this.m_componentDic.set(component.getHashCode(), component);
        return component;
    };
    /**
     * 移除组件
     */
    BaseButton.prototype.removeComponent = function (component) {
        if (component == null)
            return;
        var pool = this.m_componentDic[component.getHashCode()];
        if (pool == null)
            return;
        delete this.m_componentDic[component.getHashCode()];
    };
    /**
     * 移除所有组件
     */
    BaseButton.prototype.removeAllComponent = function () {
        // this.m_componentDic.reset();
        this.m_componentDic = new Laya.WeakObject();
    };
    /**
     * 重置界面
     */
    BaseButton.prototype.clear = function () {
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
    BaseButton.prototype.destroyComponent = function () {
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
    BaseButton.prototype.getHashCode = function () {
        return this["$_GID"] = this["$_GID"] || Laya.Utils.getGID();
    };
    Object.defineProperty(BaseButton.prototype, "isDisposed", {
        get: function () {
            return this["_disposed"];
        },
        enumerable: true,
        configurable: true
    });
    /**回收到池中 */
    BaseButton.prototype.recover = function () {
    };
    /**
     * 释放所有资源
     */
    BaseButton.prototype.dispose = function () {
        if (this["_disposed"])
            return;
        _super.prototype.dispose.call(this);
        this.clear();
        this.__data = null;
        if (this.m_eventPool) {
            this.m_eventPool.dispose();
        }
        this.m_componentDic = null;
        this.m_eventPool = null;
    };
    return BaseButton;
}(fairygui.GButton));
exports.default = BaseButton;
},{"../../../Global":2,"../../../com/events/EventPool":5,"../../utils/FairyUtils":23}],28:[function(require,module,exports){
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
    BaseSprite.prototype.addLayaChild = function (child) {
        this._container.addChild(child);
    };
    /**添加Laya原生元件
     * @param child Laya原生显示对象
     */
    BaseSprite.prototype.addLayaChildAt = function (child, index) {
        this._container.addChildAt(child, index);
    };
    /**
     * 移除Laya原生元件
     */
    BaseSprite.prototype.removeLayaChild = function (child) {
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
},{"../../../Global":2,"../../../com/events/EventPool":5}],29:[function(require,module,exports){
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
},{"./BaseButton":27}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSprite_1 = require("./BaseSprite");
var Global_1 = require("../../../Global");
var UIEListRenderItem_1 = require("./UIEListRenderItem");
var BaseButton_1 = require("./BaseButton");
var FairyTextureUtils_1 = require("../../utils/FairyTextureUtils");
var GameEvent_1 = require("../../../com/events/GameEvent");
/**
  * 封装FairyGui列表,需编辑器中fairygui.GList命名为eglist_开头
  * @author clong 2019.5.18
  */
var EGList = /** @class */ (function (_super) {
    __extends(EGList, _super);
    function EGList(list, thisObject) {
        if (thisObject === void 0) { thisObject = null; }
        var _this = _super.call(this) || this;
        _this._itemRenderer = null;
        _this._clickHandler = null; //点击事件
        _this._selectedPage = null; //分页选中某一页触发的事件
        _this._elements = null;
        _this._lastclickItem = null;
        _this._isShowDoSpecialEffect = false;
        /**分页组件 */
        _this.currentpage = 0;
        _this.isFirst = false;
        /**是否自动滑动到底部 */
        _this.isAutoBottom = false;
        _this._selectIndex = 0;
        _this.list = list;
        if (_this.list != null) {
            _this.callbackThisObj = thisObject || _this;
            // this.list.callbackThisObj = this;
            _this.list.itemRenderer = Laya.Handler.create(_this, _this.listItemRender);
            _this.list.on(Laya.Event.CLICK, _this, _this.clickItem);
        }
        return _this;
    }
    EGList.prototype.IsInited = function () {
        return true;
    };
    EGList.prototype.addAllListener = function () {
        _super.prototype.addAllListener.call(this);
    };
    Object.defineProperty(EGList.prototype, "btn_left", {
        /**设置上一页按钮 */
        set: function (value) {
            if (value) {
                this._btn_left = value;
                this._btn_left.on(Laya.Event.CLICK, this, this.touchLeftBtnHandler);
            }
            else {
                if (this._btn_left) {
                    this._btn_left.off(Laya.Event.CLICK, this, this.touchLeftBtnHandler);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
    * 上一页
    */
    EGList.prototype.touchLeftBtnHandler = function (e) {
        if (this.currentpage > 0) {
            var index = this.currentpage - 1;
            this.toPage(index);
        }
    };
    Object.defineProperty(EGList.prototype, "btn_right", {
        /**设置下一页按钮 */
        set: function (value) {
            if (value) {
                this._btn_right = value;
                this._btn_right.on(Laya.Event.CLICK, this, this.touchRightBtnHandler);
            }
            else {
                if (this._btn_right) {
                    this._btn_right.off(Laya.Event.CLICK, this, this.touchRightBtnHandler);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 下一页
     */
    EGList.prototype.touchRightBtnHandler = function (e) {
        if (this.currentpage < this.array.length - 1) {
            var index = this.currentpage + 1;
            this.toPage(index);
        }
    };
    /**跳转到某一页 0~n*/
    EGList.prototype.toPage = function (index) {
        index = index < 0 ? 0 : index;
        if (this._selectedPage) {
            this._selectedPage.apply(this.callbackThisObj, 0);
        }
        this.scrollToView(index, true); //滚动到某一个item
    };
    /**滑动list */
    EGList.prototype.scrollListPage = function () {
        var index = ((this.list.getFirstChildInView()) % this.list.numItems); //获取页数
        this.currentpage = index;
        if (this._btn_left) {
            this._btn_left.enabled = this.currentpage > 0;
        }
        if (this._btn_right) {
            this._btn_right.enabled = this.currentpage < (this.array.length - 1);
        }
        if (this._selectedPage) {
            this._selectedPage.apply(this.callbackThisObj, 0);
        }
    };
    Object.defineProperty(EGList.prototype, "isShowDoSpecialEffect", {
        set: function (bool) {
            this._isShowDoSpecialEffect = bool;
            if (this._isShowDoSpecialEffect) {
                this.list.on(fairygui.Events.SCROLL, this, this.doSpecialEffect);
            }
            else {
                this.list.off(fairygui.Events.SCROLL, this, this.doSpecialEffect);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
      * 滑动list
      */
    EGList.prototype.doSpecialEffect = function () {
        var midX = this.list.scrollPane.posX + this.list.viewWidth / 2;
        var cnt = this.list.numChildren;
        for (var i = 0; i < cnt; i++) {
            var obj = this.list.getChildAt(i);
            var dist = Math.abs(midX - obj.x - obj.width / 2);
            if (dist <= obj.width * 0.5) //此条目在中间
             {
                if (this._lastclickItem && obj && this._lastclickItem == obj) {
                    continue;
                }
                this.clickIndex = this.getShowItemIndex(obj);
                return;
            }
        }
    };
    EGList.prototype.getShowItem = function (index) {
        return this.list.getChildAt(index);
    };
    /** 更具条目 获取索引，是否为条目索引*/
    EGList.prototype.getShowItemIndex = function (item, isChindIndex) {
        if (isChindIndex === void 0) { isChindIndex = true; }
        if (isChindIndex) {
            return this.list.getChildIndex(item);
        }
        else {
            return this.list.childIndexToItemIndex(this.list.getChildIndex(item));
        }
    };
    /**转换到显示对象索引*/
    EGList.prototype.itemIndexToChildIndex = function (index) {
        var newIndex = this.list.itemIndexToChildIndex(index);
        return newIndex;
    };
    /**转换显示对象索引为项目索引。*/
    EGList.prototype.childIndexToItemIndex = function (index) {
        var newIndex = this.list.childIndexToItemIndex(index);
        return newIndex;
    };
    /**设置虚拟列表 */
    EGList.prototype.setVirtual = function () {
        this.list.setVirtual();
        this.setScroll();
    };
    EGList.prototype.setScroll = function () {
        if (this.list) {
            this.list.on(fairygui.Events.SCROLL, this, this.scrollListPage); //这个函数主要是来处理滚动分页
        }
    };
    Object.defineProperty(EGList.prototype, "isDragged", {
        /**
          * 设置List是否能够滚动
          */
        set: function (value) {
            if (this.list.scrollPane) {
                this.list.scrollPane.touchEffect = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    EGList.prototype.sync = function () {
        this.list.ensureBoundsCorrect();
    };
    Object.defineProperty(EGList.prototype, "clickIndex", {
        /**默认选择第几个 */
        set: function (index) {
            var newIndex = this.itemIndexToChildIndex(index);
            if (newIndex < 0) {
                newIndex = 0;
            }
            if (this.list.numChildren > 0) {
                // let item: fairygui.GObject = this.list.getChildAt(newIndex);
                // let ie: fairygui.ItemEvent = new fairygui.ItemEvent(fairygui.ItemEvent.CLICK, item);
                // this.list.dispatchEvent(ie);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "callbackThisObj", {
        /**This */
        get: function () {
            return this._thisObject;
        },
        set: function (value) {
            this._thisObject = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
      * 设置渲染条目
      */
    EGList.prototype.setRenderItem = function (pkgName, resName) {
        this.list.defaultItem = FairyTextureUtils_1.FairyTextureUtils.getUrl(pkgName, resName);
    };
    Object.defineProperty(EGList.prototype, "itemProvider", {
        set: function (value) {
            if (this.list != null) {
                this.list.itemProvider = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "itemRenderer", {
        /**渲染方法 */
        get: function () {
            return this._itemRenderer;
        },
        set: function (value) {
            this._itemRenderer = value;
            if (this.list != null) {
                this.list.itemRenderer = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "clickHandler", {
        /**点击事件 */
        get: function () {
            return this._clickHandler;
        },
        set: function (value) {
            this._clickHandler = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "selectedPage", {
        /**获取分页事件 */
        get: function () {
            return this._selectedPage;
        },
        /**设置分页事件 */
        set: function (value) {
            this._selectedPage = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "selectionMode", {
        get: function () {
            return this.list.selectionMode;
        },
        /**选择模式 */
        set: function (value) {
            this.list.selectionMode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "isSingleSelect", {
        /**是否为单选模式 */
        get: function () {
            return this.selectionMode == fairygui.ListSelectionMode.Single;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "isMultSelect", {
        /**是否为多选模式 */
        get: function () {
            return this.selectionMode == fairygui.ListSelectionMode.Multiple;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "array", {
        /**
          * 设置对应数据
          */
        get: function () {
            return this._array;
        },
        /**每次数值改变之前会触发每个显示中子组件的data=null的方法，重写set data自己处理数据引用,某些情况如果显示中的子组件需要数据更新，
          * 请使用elements属性自行进行组件更新，不要给array赋值，可以提升效率*/
        set: function (value) {
            this.removeAllComponent();
            this.clearData();
            this._array = value || [];
            this.updateList();
        },
        enumerable: true,
        configurable: true
    });
    EGList.prototype.addItem = function (value, isUnshift) {
        if (isUnshift === void 0) { isUnshift = false; }
        if (this._array && this._array.indexOf(value) == -1) {
            if (isUnshift) {
                this._array.unshift(value);
            }
            else {
                this._array.push(value);
            }
            this.updateList();
        }
    };
    /**移除条目 */
    EGList.prototype.removeItem = function (value) {
        var item = null;
        var index = this._array.indexOf(value);
        if (this._array && index != -1) {
            item = this._array.splice(index, 1);
            this.updateList();
        }
        return item;
    };
    /**更新列表 */
    EGList.prototype.updateList = function () {
        if (this.list != null) {
            this.list.numItems = this._array.length;
            if (this.isAutoBottom) {
                this.scrollToBottom();
            }
        }
    };
    EGList.prototype.addItemList = function (list) {
        if (this._array != null && list && list.length > 0) {
            this._array = this._array.concat(list);
        }
        this.updateList();
    };
    EGList.prototype.replaceAll = function (list) {
        this._array = list;
        this.updateList();
    };
    Object.defineProperty(EGList.prototype, "numItems", {
        /**设置条目 */
        get: function () {
            return this.list.numItems;
        },
        set: function (value) {
            // this._array = [];
            this.clearData();
            this._array.length = value;
            this.updateList();
        },
        enumerable: true,
        configurable: true
    });
    /**
      * 点击条目
      */
    EGList.prototype.clickItem = function (e) {
        this.selectItem(e.itemObject);
    };
    /**选择条目 */
    EGList.prototype.selectItem = function (item) {
        //复选可选择多个可重复选择
        if ((this.selectionMode == fairygui.ListSelectionMode.Single)
            && this._lastclickItem
            && item
            && this._lastclickItem == item) {
            return;
        }
        if (this._lastclickItem) {
            this._lastclickItem["select"] = false;
        }
        if (item) {
            item["select"] = true;
        }
        this._lastclickItem = item;
        if (item.data)
            this._selectIndex = this._array.indexOf(item.data);
        else
            this._selectIndex = parseInt(item.name);
        if (this._clickHandler) {
            this._clickHandler.apply(this.callbackThisObj, [item]);
        }
    };
    Object.defineProperty(EGList.prototype, "lastClickItem", {
        /**获取选择的条目 */
        get: function () {
            return this._lastclickItem;
        },
        enumerable: true,
        configurable: true
    });
    /**
      * 渲染条目
      */
    EGList.prototype.listItemRender = function (index, obj) {
        if (index == 0) {
            this._elements = [];
        }
        var item = obj;
        if (item && item["show"] != undefined) {
            item.show(this._array[index]);
        }
        if (this.elements.indexOf(item) == -1) {
            this.elements.push(item);
        }
        //列表渲染单个条目
        var evt = new GameEvent_1.GameEvent(GameEvent_1.GameEvent.EGLIST_RENDER);
        evt.data = { "index": index, "obj": obj };
        evt.thisObject = this._thisObject;
        // this.dispatchEvent(evt);
        fairygui.Events.dispatch(GameEvent_1.GameEvent.EGLIST_RENDER, this._displayObject, evt);
        //列表渲染完成
        if (index == (this._array.length - 1)) {
            var completeEvt = new GameEvent_1.GameEvent(GameEvent_1.GameEvent.EGLIST_COMPLETE);
            completeEvt.thisObject = this._thisObject;
            // this.dispatchEvent(completeEvt);
            fairygui.Events.dispatch(GameEvent_1.GameEvent.EGLIST_COMPLETE, this._displayObject, evt);
        }
        if (this._selectedPage) {
            //处理分页的时候
            if (index == 0 && !this.isFirst) {
                this.isFirst = true;
                this._selectedPage.apply(this.callbackThisObj, 0);
            }
        }
        if (Global_1.default.is(obj, "IComponent")) {
            this.addComponent(obj);
        }
    };
    Object.defineProperty(EGList.prototype, "elements", {
        /**列表渲染所有条目  虚拟列表不可以这样取*/
        get: function () {
            return this._elements;
            //转换项目索引为显示对象索引。
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "selectedIndex", {
        /**当前选择条目索引 */
        get: function () {
            return this._selectIndex; // this.list.selectedIndex;
        },
        set: function (value) {
            if (this.isSingleSelect) {
                this.list.selectedIndex = value; //坑，有时取 this.list.selectedIndex有问题
                this._selectIndex = value;
                //clong 2019.2.12
                var item = value < this.list.numChildren ? this.list.getChildAt(value) : null;
                if (item instanceof UIEListRenderItem_1.UIEListRenderItem || item instanceof BaseButton_1.default) {
                    this.selectItem(item);
                }
            }
            else {
                this._selectIndex = -1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "selectedItem", {
        /**当前选择数据 */
        get: function () {
            return this._selectIndex < 0 ? null : this._array[this._selectIndex];
        },
        enumerable: true,
        configurable: true
    });
    /**添加选择 */
    EGList.prototype.addSelection = function (index, scrollItToView) {
        this.list.addSelection(index, scrollItToView);
    };
    /**移除选择 */
    EGList.prototype.removeSelection = function (index) {
        this.list.removeSelection(index);
    };
    /**全选 */
    EGList.prototype.selectAll = function () {
        this.list.selectAll();
    };
    /**不选择 */
    EGList.prototype.selectNone = function () {
        this.list.selectNone();
    };
    /**反选 */
    EGList.prototype.selectReverse = function () {
        this.list.selectReverse();
    };
    Object.defineProperty(EGList.prototype, "progress", {
        /**
          * 当前进度条滚动百分比
          */
        get: function () {
            if (this.isHorizontal) {
                return this.list.scrollPane.percX;
            }
            else {
                return this.list.scrollPane.percY;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "isHorizontal", {
        // public set isHorizontal(value:boolean){
        // 	if( value ){
        // 		this.list.scrollPane.scr
        // 	}
        // }
        /**横向滚动条 */
        get: function () {
            return this.list.scrollPane ? this.list.scrollPane["_scrollType"] == fairygui.ScrollType.Horizontal : false;
        },
        enumerable: true,
        configurable: true
    });
    /**
      * 滑动到
      * @param progress 0 ~ 1
      */
    EGList.prototype.sliderTo = function (progress, ani) {
        if (ani === void 0) { ani = true; }
        // this.list.scrollPane.scrollDown( progress , ani );
        if (this.list.scrollPane) {
            if (this.isHorizontal) {
                this.list.scrollPane.setPercX(progress, ani);
            }
            else {
                this.list.scrollPane.setPercY(progress, ani);
            }
        }
    };
    /**
      * 滚动到
      * @params index
      * @params ani
      * @params setFirst
      */
    EGList.prototype.scrollToView = function (index, ani, setFirst) {
        if (ani === void 0) { ani = false; }
        if (setFirst === void 0) { setFirst = false; }
        this.list.scrollToView(index, ani, setFirst);
    };
    Object.defineProperty(EGList.prototype, "scrollPane", {
        get: function () {
            return this.list.scrollPane;
        },
        enumerable: true,
        configurable: true
    });
    EGList.prototype.getFirstChildInView = function () {
        return this.list.getFirstChildInView();
    };
    EGList.prototype.getListComponet = function () {
        return this.list;
    };
    /**
      * 滑动到顶部
      */
    EGList.prototype.scrollToTop = function (ani) {
        if (ani === void 0) { ani = false; }
        this.list.scrollPane.scrollTop(ani);
    };
    /**
      * 滚动到底部
      */
    EGList.prototype.scrollToBottom = function (ani) {
        if (ani === void 0) { ani = false; }
        this.list.scrollPane.scrollBottom(ani);
    };
    Object.defineProperty(EGList.prototype, "touchEnabled", {
        get: function () {
            return this.list._container.mouseEnabled;
        },
        set: function (value) {
            this.list._container.mouseEnabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "enabled", {
        get: function () {
            return this.list.enabled;
        },
        set: function (val) {
            this.list.enabled = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "touchChildren", {
        get: function () {
            return this.list._container.mouseThrough;
        },
        set: function (value) {
            this.list._container.mouseThrough = value;
        },
        enumerable: true,
        configurable: true
    });
    EGList.prototype.getChildAt = function (index) {
        return this.list.getChildAt(index);
    };
    Object.defineProperty(EGList.prototype, "numChildren", {
        get: function () {
            return this.list.numChildren;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "lineCount", {
        /**设置行数 */
        get: function () {
            return this.list.lineCount;
        },
        set: function (value) {
            this.list.lineCount = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "columnCount", {
        /**设置列数 */
        get: function () {
            return this.list.columnCount;
        },
        set: function (value) {
            this.list.columnCount = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "visible", {
        get: function () {
            return this.list.visible;
        },
        set: function (value) {
            this.list.visible = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "x", {
        get: function () {
            return this.list.x;
        },
        set: function (value) {
            this.list.x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "y", {
        get: function () {
            return this.list.y;
        },
        set: function (value) {
            this.list.y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "scrollType", {
        /**列表滚动模式 */
        get: function () {
            return this.list.scrollPane ? this.list.scrollPane["_scrollType"] : false;
        },
        set: function (value) {
            if (this.list.scrollPane) {
                this.list.scrollPane["_scrollType"] = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "layout", {
        set: function (value) {
            this.list.layout = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "align", {
        /**左右布局 */
        get: function () {
            return this.list.align;
        },
        set: function (value) {
            this.list.align = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "columnGap", {
        /**列距 */
        get: function () {
            return this.list.columnGap;
        },
        // public set verticalAlign(value: fairygui.VertAlignType) {
        // 	this.list.verticalAlign = value;
        // }
        // /**上下 */
        // public get verticalAlign(): fairygui.VertAlignType {
        // 	return this.list.verticalAlign;
        // }
        set: function (value) {
            this.list.columnGap = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "lineGap", {
        /**行距 */
        get: function () {
            return this.list.lineGap;
        },
        set: function (gap) {
            this.list.lineGap = gap;
        },
        enumerable: true,
        configurable: true
    });
    EGList.prototype.setSize = function (width, height, ignorePivot) {
        if (ignorePivot === void 0) { ignorePivot = false; }
        this.list.setSize(width, height, ignorePivot);
    };
    EGList.prototype.superSetSize = function (width, height, ignorePivot) {
        if (ignorePivot === void 0) { ignorePivot = false; }
        _super.prototype.setSize.call(this, width, height, ignorePivot);
    };
    Object.defineProperty(EGList.prototype, "width", {
        get: function () {
            return this.list.width;
        },
        set: function (value) {
            this.list.width = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "height", {
        get: function () {
            return this.list.height;
        },
        set: function (value) {
            this.list.height = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "viewWidth", {
        get: function () {
            return this.list.viewWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "viewHeight", {
        get: function () {
            return this.list.viewHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "grayed", {
        /**置灰 */
        get: function () {
            return this.list.grayed;
        },
        set: function (value) {
            this.list.grayed = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EGList.prototype, "parent", {
        /**父容器 */
        get: function () {
            return this.list.parent;
        },
        enumerable: true,
        configurable: true
    });
    EGList.prototype.localToGlobal = function (ax, ay, resultPoint) {
        return this.list.localToGlobal(ax, ay, resultPoint);
    };
    /**清理数据 */
    EGList.prototype.clearData = function () {
        if (this.elements) {
            for (var index in this.elements) {
                if (this.elements[index] instanceof BaseSprite_1.default) {
                    this.elements[index]["hide"]();
                }
            }
        }
        if (this._lastclickItem) {
            this._lastclickItem["select"] = false;
            this._lastclickItem = null;
        }
        if (this._btn_left) {
            this._btn_left.off(Laya.Event.CLICK, this, this.touchLeftBtnHandler);
        }
        if (this._btn_right) {
            this._btn_right.off(Laya.Event.CLICK, this, this.touchRightBtnHandler);
        }
        this._btn_left = null;
        this._btn_right = null;
        this._elements = [];
        this._array = [];
    };
    /**
      * 重置
      */
    EGList.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.sliderTo(0, false);
        this.clearData();
    };
    /**
      * 释放
      */
    EGList.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.clear();
        if (this.list != null) {
            this.list.off(Laya.Event.CLICK, this, this.clickItem);
            this.list.off(fairygui.Events.SCROLL, this, this.scrollListPage);
            this.list.dispose();
            this.list = null;
        }
        this._btn_left = null;
        this._btn_right = null;
        this._thisObject = null;
        this._itemRenderer = null;
        this._clickHandler = null;
        this._selectedPage = null;
        this._array = null;
        this._elements = null;
        this._lastclickItem = null;
    };
    return EGList;
}(BaseSprite_1.default));
exports.EGList = EGList;
},{"../../../Global":2,"../../../com/events/GameEvent":6,"../../utils/FairyTextureUtils":22,"./BaseButton":27,"./BaseSprite":28,"./UIEListRenderItem":31}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UIComponent_1 = require("../UIComponent");
/**
  * 列表渲染条目
  * @author cl 2019.5.18
  */
var UIEListRenderItem = /** @class */ (function (_super) {
    __extends(UIEListRenderItem, _super);
    function UIEListRenderItem() {
        var _this = _super.call(this) || this;
        /**是否有可选中状态 */
        _this.canSelect = false;
        _this.__data = null;
        _this._select = false;
        return _this;
    }
    UIEListRenderItem.prototype.constructFromXML = function (xml) {
        _super.prototype.constructFromXML.call(this, xml);
    };
    UIEListRenderItem.prototype.initComplete = function () {
        //检测初始化是否完成
        if (!this.isInited()) {
            return false;
        }
        if (!this.isOpened) {
            this.isOpened = true;
            this.initUI();
        }
        this.initData(this.param);
        // this.AddRootListener();//此方法在show方法的时候调用
        this.isComplyed = true;
        return true;
    };
    /**
      * 是否包含全局坐标点
      * @param gx 全局X坐标
      * @param gy 全局Y坐标
      */
    UIEListRenderItem.prototype.containsGlobalPoint = function (gx, gy) {
        var lp = this.globalToLocal(gx, gy);
        var bounds = new Laya.Rectangle(0, 0, this.width, this.height);
        return bounds.contains(lp.x, lp.y);
    };
    Object.defineProperty(UIEListRenderItem.prototype, "select", {
        get: function () {
            return this.canSelect ? this.currentState == "down" : false;
        },
        set: function (value) {
            if (this.canSelect) {
                this.currentState = value ? "down" : "up";
            }
        },
        enumerable: true,
        configurable: true
    });
    UIEListRenderItem.prototype.show = function (data) {
        this.data = this._data = data;
        this.addAllListener();
    };
    UIEListRenderItem.prototype.hide = function () {
        this.clear();
    };
    /**
      * 重置
      */
    UIEListRenderItem.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this.removeAllListener();
    };
    /**
      * 释放资源
      */
    UIEListRenderItem.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
    };
    return UIEListRenderItem;
}(UIComponent_1.default));
exports.UIEListRenderItem = UIEListRenderItem;
},{"../UIComponent":25}],32:[function(require,module,exports){
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
        /**界面类名 */
        this.clsName = "";
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
        this.clsName = "";
        this.type = 0;
        this.id = 0;
        this.openTapMask = false;
    };
    return PanelVo;
}());
exports.default = PanelVo;
},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L1Byb2dyYW0gRmlsZXMgKHg4NikvTGF5YUFpcklERV8yLjEuMGJldGExL3Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9HYW1lQ2xpZW50LnRzIiwic3JjL0dsb2JhbC50cyIsInNyYy9NYWluLnRzIiwic3JjL2NvbS9ldmVudHMvRXZlbnRPYmoudHMiLCJzcmMvY29tL2V2ZW50cy9FdmVudFBvb2wudHMiLCJzcmMvY29tL2V2ZW50cy9HYW1lRXZlbnQudHMiLCJzcmMvY29tL2xvYWQvTG9hZFNvdXJjZU1hbmFnZXIudHMiLCJzcmMvY29tL2xvYWQvZXZlbnQvTG9hZGVyRXZlbnQudHMiLCJzcmMvY29tL2xvYWQvcmVzb3VyY2UvR3JvdXBSZXNvdXJjZS50cyIsInNyYy9jb20vbG9hZC9yZXNvdXJjZS9SZXNvdXJjZS50cyIsInNyYy9jb20vbG9hZC9yZXNvdXJjZS9UeHRSZXNvdXJjZS50cyIsInNyYy9jb20vbG9hZC91dGlscy9Mb2FkVXRpbHMudHMiLCJzcmMvY29tL2xvYWQvdXRpbHMvVXJsVXRpbHMudHMiLCJzcmMvY29tL2xvZy9Mb2cudHMiLCJzcmMvY29tL2xvZy9Mb2dWby50cyIsInNyYy9jb20vbWFuYWdlci9FdmVudE1hbmFnZXIudHMiLCJzcmMvY29tL3V0aWxzL0NvbW1vblV0aWxzLnRzIiwic3JjL2ZhaXJ1aS9QYW5lbFJlZ2lzdGVyLnRzIiwic3JjL2ZhaXJ1aS9tYW5hZ2VyL0ZhaXJ5VUlNYW5hZ2VyLnRzIiwic3JjL2ZhaXJ1aS9wYW5lbC9VSUdNVmlldy50cyIsInNyYy9mYWlydWkvcGFuZWwvVUlNYWluVmlldy50cyIsInNyYy9mYWlydWkvdXRpbHMvRmFpcnlUZXh0dXJlVXRpbHMudHMiLCJzcmMvZmFpcnVpL3V0aWxzL0ZhaXJ5VXRpbHMudHMiLCJzcmMvZmFpcnVpL3ZpZXcvQmFzZVBhbmVsLnRzIiwic3JjL2ZhaXJ1aS92aWV3L1VJQ29tcG9uZW50LnRzIiwic3JjL2ZhaXJ1aS92aWV3L1ZpZXcudHMiLCJzcmMvZmFpcnVpL3ZpZXcvY29tcG9uZW50L0Jhc2VCdXR0b24udHMiLCJzcmMvZmFpcnVpL3ZpZXcvY29tcG9uZW50L0Jhc2VTcHJpdGUudHMiLCJzcmMvZmFpcnVpL3ZpZXcvY29tcG9uZW50L0VCdXR0b24udHMiLCJzcmMvZmFpcnVpL3ZpZXcvY29tcG9uZW50L0VHTGlzdC50cyIsInNyYy9mYWlydWkvdmlldy9jb21wb25lbnQvVUlFTGlzdFJlbmRlckl0ZW0udHMiLCJzcmMvZmFpcnVpL3ZvL1BhbmVsVm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVkEsa0VBQTZEO0FBQzdELHdEQUFtRDtBQUNuRCwyREFBc0Q7QUFDdEQsa0VBQWdGO0FBQ2hGLHNEQUFpRDtBQUVqRCx3REFBbUQ7QUFFbkQ7OztHQUdHO0FBQ0g7SUFBd0MsOEJBQVc7SUFFL0M7UUFBQSxZQUVJLGlCQUFPLFNBR1Y7UUFERyxLQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0lBQ2hCLENBQUM7SUFFTSx5QkFBSSxHQUFYO1FBRUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFdkQscUJBQXFCO1FBQzNCLHFFQUFxRTtRQUNyRSw4REFBOEQ7UUFDeEQsb0RBQW9EO1FBQ3BELElBQUksSUFBSSxHQUFpQixrQkFBUSxDQUFDLGFBQWEsQ0FBRSxRQUFRLENBQUUsQ0FBQztRQUM1RCwyQkFBaUIsQ0FBQyxTQUFTLENBQUUsUUFBUSxFQUFHLElBQUksRUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBRSxJQUFJLEVBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFFLENBQUM7SUFDakcsQ0FBQztJQUVPLDZCQUFRLEdBQWhCO1FBRUYsd0RBQXdEO1FBQ2xELHFEQUFxRDtRQUNyRCxt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OztHQUdHO0FBQ0g7SUFtQkk7UUFqQkEsVUFBVTtRQUNILE9BQUUsR0FBVSxDQUFDLENBQUM7UUFDckIsVUFBVTtRQUNILFNBQUksR0FBVSxDQUFDLENBQUM7UUFDdkIsZ0JBQWdCO1FBQ1QsVUFBSyxHQUFVLENBQUMsQ0FBQztRQUN4Qiw2QkFBNkI7UUFDdEIsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFFcEMsbUJBQW1CO1FBQ1osWUFBTyxHQUFVLEVBQUUsQ0FBQztRQUMzQixxQkFBcUI7UUFDZCxZQUFPLEdBQVUsRUFBRSxDQUFDO1FBRTNCLFVBQVU7UUFDSCxZQUFPLEdBQVUsRUFBRSxDQUFDO0lBSTNCLENBQUM7SUFFRCxzQkFBVyw2QkFBUTthQUFuQjtZQUVJLE9BQU8sSUFBSSxDQUFDLElBQUksSUFBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQzs7O09BQUE7SUFFTSx5QkFBTyxHQUFkO1FBRUksSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0FyQ0EsQUFxQ0MsSUFBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgRmFpcnlVSU1hbmFnZXIgZnJvbSBcIi4vZmFpcnVpL21hbmFnZXIvRmFpcnlVSU1hbmFnZXJcIjtcclxuaW1wb3J0IFBhbmVsUmVnaXN0ZXIgZnJvbSBcIi4vZmFpcnVpL1BhbmVsUmVnaXN0ZXJcIjtcclxuaW1wb3J0IEVCdXR0b24gZnJvbSBcIi4vZmFpcnVpL3ZpZXcvY29tcG9uZW50L0VCdXR0b25cIjtcclxuaW1wb3J0IExvYWRTb3VyY2VNYW5hZ2VyLCB7IExvYWRlck1hbmFnZXIgfSBmcm9tIFwiLi9jb20vbG9hZC9Mb2FkU291cmNlTWFuYWdlclwiO1xyXG5pbXBvcnQgVXJsVXRpbHMgZnJvbSBcIi4vY29tL2xvYWQvdXRpbHMvVXJsVXRpbHNcIjtcclxuaW1wb3J0IFVJR01WaWV3IGZyb20gXCIuL2ZhaXJ1aS9wYW5lbC9VSUdNVmlld1wiO1xyXG5pbXBvcnQgVUlNYWluVmlldyBmcm9tIFwiLi9mYWlydWkvcGFuZWwvVUlNYWluVmlld1wiO1xyXG5cclxuLyoqXHJcbiAqIOa4uOaIj+S4u+WuouaIt+err1xyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNsaWVudCBleHRlbmRzIExheWEuU3ByaXRlIHtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7IFxyXG5cclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdCgpOnZvaWR7XHJcblxyXG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoZmFpcnlndWkuR1Jvb3QuaW5zdC5kaXNwbGF5T2JqZWN0KTtcclxuXHJcbiAgICAgICAgLy8gTGF5YS5sb2FkZXIubG9hZChbXHJcblx0XHQvLyBcdHsgdXJsOiBcInJlcy9mYWlydWkvY29tbW9uX2F0bGFzMC5wbmdcIiwgdHlwZTogTGF5YS5Mb2FkZXIuSU1BR0UgfSxcclxuXHRcdC8vIFx0eyB1cmw6IFwicmVzL2ZhaXJ1aS9jb21tb24ubWFwXCIsIHR5cGU6IExheWEuTG9hZGVyLkJVRkZFUiB9XHJcbiAgICAgICAgLy8gICAgIF0sIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkxvYWRlZCkpO1xyXG4gICAgICAgIGxldCB1cmxzOkFycmF5PHN0cmluZz4gPSBVcmxVdGlscy5nZXRGYWlyeUdyb3VwKCBcImNvbW1vblwiICk7XHJcbiAgICAgICAgTG9hZFNvdXJjZU1hbmFnZXIubG9hZEdyb3VwKCBcImNvbW1vblwiICwgdXJscyAsIExheWEuSGFuZGxlci5jcmVhdGUoIHRoaXMgLCB0aGlzLm9uTG9hZGVkICkgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uTG9hZGVkKCk6dm9pZHtcclxuXHJcblx0XHQvLyBmYWlyeWd1aS5VSVBhY2thZ2UuYWRkUGFja2FnZShcInJlcy9mYWlydWkvY29tbW9uXCIpO1x0XHRcclxuICAgICAgICAvLyBmYWlyeWd1aS5VSUNvbmZpZy5kZWZhdWx0Rm9udCA9IFwiTWljcm9zb2Z0IFlhSGVpXCI7XHJcbiAgICAgICAgLy8gZmFpcnlndWkuVUlDb25maWcudmVydGljYWxTY3JvbGxCYXIgPSBcInVpOi8vQmFzaWMvU2Nyb2xsQmFyX1ZUXCI7XHJcbiAgICAgICAgLy8gZmFpcnlndWkuVUlDb25maWcuaG9yaXpvbnRhbFNjcm9sbEJhciA9IFwidWk6Ly9CYXNpYy9TY3JvbGxCYXJfSFpcIjtcclxuICAgICAgICAvLyBmYWlyeWd1aS5VSUNvbmZpZy5wb3B1cE1lbnUgPSBcInVpOi8vQmFzaWMvUG9wdXBNZW51XCI7XHJcbiAgICAgICAgZmFpcnlndWkuVUlDb25maWcucGFja2FnZUZpbGVFeHRlbnNpb24gPSBcIm1hcFwiO1xyXG5cclxuICAgICAgICBGYWlyeVVJTWFuYWdlci5pbml0KCBMYXlhLnN0YWdlICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgUGFuZWxSZWdpc3Rlci5yZWdpc3RlckNsYXNzKFwiY29tbW9uXCIsIFwiRUJ1dHRvblwiLCBFQnV0dG9uICk7XHJcblxyXG4gICAgICAgIEZhaXJ5VUlNYW5hZ2VyLm9wZW4oIFVJTWFpblZpZXcgKTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgR2FtZUNsaWVudCBmcm9tIFwiLi9HYW1lQ2xpZW50XCI7XHJcbmltcG9ydCBMb2FkU291cmNlTWFuYWdlciBmcm9tIFwiLi9jb20vbG9hZC9Mb2FkU291cmNlTWFuYWdlclwiO1xyXG5pbXBvcnQgRXZlbnRNYW5hZ2VyIGZyb20gXCIuL2NvbS9tYW5hZ2VyL0V2ZW50TWFuYWdlclwiO1xyXG5pbXBvcnQgTG9nIGZyb20gXCIuL2NvbS9sb2cvTG9nXCI7XHJcblxyXG4vKipcclxuICog5YWo5bGA5Y+C5pWwXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHbG9iYWwge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgd2lkdGg6bnVtYmVyPTY0MDtcclxuICAgIHB1YmxpYyBzdGF0aWMgaGVpZ2h0Om51bWJlcj0xMTM2O1xyXG4gICAgcHVibGljIHN0YXRpYyBzY2FsZU1vZGU6c3RyaW5nPVwiZml4ZWR3aWR0aFwiO1xyXG4gICAgcHVibGljIHN0YXRpYyBzY3JlZW5Nb2RlOnN0cmluZz1cIm5vbmVcIjsvL2hvcml6b250YWxcclxuICAgIHB1YmxpYyBzdGF0aWMgYWxpZ25WOnN0cmluZz1cInRvcFwiO1xyXG4gICAgcHVibGljIHN0YXRpYyBhbGlnbkg6c3RyaW5nPVwibGVmdFwiO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgc3RhdDpib29sZWFuPWZhbHNlO1xyXG4gICAgcHVibGljIHN0YXRpYyBwaHlzaWNzRGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgZXhwb3J0U2NlbmVUb0pzb246Ym9vbGVhbj10cnVlO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWo5bGA5Yid5aeL5YyWXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdCgpOnZvaWR7XHJcblxyXG4gICAgICAgIExvZy5pbml0KCk7XHJcbiAgICAgICAgRXZlbnRNYW5hZ2VyLmluaXQoKTtcclxuICAgICAgICBMb2FkU291cmNlTWFuYWdlci5pbml0KCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZCggbmV3IEdhbWVDbGllbnQoKSApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG5cdCAqIOWIpOaWreWvueixoeaYr+WQpuS4uuWvueW6lOexu+aIluaOpeWPo1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgaXMoIHRhcmdldDphbnkgLCBjbHM6YW55ICk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgaWYoICF0YXJnZXQgKXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHRcdHJldHVybiBMYXlhW1wiX190eXBlb2ZcIl0oIHRhcmdldCAsIGNscyApO1xyXG5cdH1cclxufSIsImltcG9ydCBHbG9iYWwgZnJvbSBcIi4vR2xvYmFsXCI7XHJcbmNsYXNzIE1haW4ge1xyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHJcblx0XHRMYXlhLmluaXQoMTEzNiwgNjQwLCBMYXlhLldlYkdMKTtcclxuXHRcdC8vIExheWEuaW5pdCggR2xvYmFsLndpZHRoICwgR2xvYmFsLmhlaWdodCAsIExheWEuV2ViR0wpO1xyXG4gICAgICAgIGxheWEudXRpbHMuU3RhdC5zaG93KDAsIDApO1xyXG4gICAgICAgIC8v6K6+572u6YCC6YWN5qih5byPXHJcbiAgICAgICAgTGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBcInNob3dhbGxcIjtcclxuICAgICAgICBMYXlhLnN0YWdlLmFsaWduSCA9IFwibGVmdFwiO1xyXG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25WID0gXCJ0b3BcIjtcclxuICAgICAgICAvL+iuvue9ruaoquerluWxj1xyXG4gICAgICAgIExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IEdsb2JhbC5zY3JlZW5Nb2RlOy8vIFwiaG9yaXpvbnRhbFwiO1xyXG5cclxuICAgICAgICAvL+agueaNrklEReiuvue9ruWIneWni+WMluW8leaTjlx0XHRcclxuXHRcdGlmICh3aW5kb3dbXCJMYXlhM0RcIl0pe1xyXG4gICAgICAgICAgICBMYXlhM0QuaW5pdChHbG9iYWwud2lkdGgsIEdsb2JhbC5oZWlnaHQpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBMYXlhLmluaXQoR2xvYmFsLndpZHRoLCBHbG9iYWwuaGVpZ2h0LCBMYXlhW1wiV2ViR0xcIl0pO1xyXG4gICAgICAgIH0gXHJcblx0XHRMYXlhW1wiUGh5c2ljc1wiXSAmJiBMYXlhW1wiUGh5c2ljc1wiXS5lbmFibGUoKTtcclxuXHRcdExheWFbXCJEZWJ1Z1BhbmVsXCJdICYmIExheWFbXCJEZWJ1Z1BhbmVsXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBHbG9iYWwuc2NhbGVNb2RlO1xyXG5cdFx0TGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2xvYmFsLnNjcmVlbk1vZGU7XHJcblx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXHJcbiAgICAgICAgLy9MYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdsb2JhbC5leHBvcnRTY2VuZVRvSnNvbjtcclxuICAgICAgICBcclxuICAgICAgICAvL+aJk+W8gOiwg+ivlemdouadv++8iOmAmui/h0lEReiuvue9ruiwg+ivleaooeW8j++8jOaIluiAhXVybOWcsOWdgOWinuWKoGRlYnVnPXRydWXlj4LmlbDvvIzlnYflj6/miZPlvIDosIPor5XpnaLmnb/vvIlcclxuXHRcdGlmIChHbG9iYWwuZGVidWcgfHwgTGF5YS5VdGlscy5nZXRRdWVyeVN0cmluZyhcImRlYnVnXCIpID09IFwidHJ1ZVwiKSBMYXlhLmVuYWJsZURlYnVnUGFuZWwoKTtcclxuXHRcdGlmIChHbG9iYWwucGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcclxuXHRcdGlmIChHbG9iYWwuc3RhdCkgTGF5YS5TdGF0LnNob3coKTtcclxuXHRcdExheWEuYWxlcnRHbG9iYWxFcnJvciA9IHRydWU7XHJcblxyXG5cdFx0Ly/mv4DmtLvotYTmupDniYjmnKzmjqfliLbvvIx2ZXJzaW9uLmpzb27nlLFJREXlj5HluIPlip/og73oh6rliqjnlJ/miJDvvIzlpoLmnpzmsqHmnInkuZ/kuI3lvbHlk43lkI7nu63mtYHnqItcclxuXHRcdExheWEuUmVzb3VyY2VWZXJzaW9uLmVuYWJsZShcInZlcnNpb24uanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25WZXJzaW9uTG9hZGVkKSwgTGF5YS5SZXNvdXJjZVZlcnNpb24uRklMRU5BTUVfVkVSU0lPTik7XHJcblx0fVxyXG5cclxuXHRvblZlcnNpb25Mb2FkZWQoKTogdm9pZCB7XHJcblx0XHQvL+a/gOa0u+Wkp+Wwj+WbvuaYoOWwhO+8jOWKoOi9veWwj+WbvueahOaXtuWAme+8jOWmguaenOWPkeeOsOWwj+WbvuWcqOWkp+WbvuWQiOmbhumHjOmdou+8jOWImeS8mOWFiOWKoOi9veWkp+WbvuWQiOmbhu+8jOiAjOS4jeaYr+Wwj+WbvlxyXG5cdFx0Ly9MYXlhLkF0bGFzSW5mb01hbmFnZXIuZW5hYmxlKFwiZmlsZWNvbmZpZy5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkNvbmZpZ0xvYWRlZCkpO1xyXG5cclxuXHRcdFxyXG5cdFx0R2xvYmFsLmluaXQoKVxyXG5cdH1cclxuXHJcblx0b25Db25maWdMb2FkZWQoKTogdm9pZCB7XHJcblx0XHQvL+WKoOi9vUlEReaMh+WumueahOWcuuaZr1xyXG5cdFx0Ly9HYW1lQ29uZmlnLnN0YXJ0U2NlbmUgJiYgTGF5YS5TY2VuZS5vcGVuKEdhbWVDb25maWcuc3RhcnRTY2VuZSk7XHJcblx0fVxyXG59XHJcbi8v5r+A5rS75ZCv5Yqo57G7XHJcbm5ldyBNYWluKCk7XHJcbiIsIlxyXG4vKipcclxuICog6YCa55So5LqL5Lu257G7XHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS4zLjIzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRXZlbnRPYmoge1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHBvb2w6QXJyYXk8RXZlbnRPYmo+ID0gW107XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoIHR5cGU6IHN0cmluZywgbGlzdGVuZXI6IEZ1bmN0aW9uLCB0YXJnZXQ6IExheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCwgdGhpc09iajogYW55ID0gbnVsbCApOkV2ZW50T2Jqe1xyXG5cclxuICAgICAgICBsZXQgb2JqOkV2ZW50T2JqID0gRXZlbnRPYmoucG9vbC5zaGlmdCgpO1xyXG4gICAgICAgIGlmKCBvYmogPT0gbnVsbCApe1xyXG4gICAgICAgICAgICBvYmogPSBuZXcgRXZlbnRPYmooKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb2JqLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIG9iai5saXN0ZW5lciA9IGxpc3RlbmVyO1xyXG4gICAgICAgIG9iai50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgICAgb2JqLnRoaXNPYmogPSB0aGlzT2JqO1xyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZWNvdmVyKCBvYmo6RXZlbnRPYmogKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggb2JqICE9IG51bGwgJiYgRXZlbnRPYmoucG9vbC5pbmRleE9mKCBvYmogKSA9PSAtMSApe1xyXG4gICAgICAgICAgICBFdmVudE9iai5wb29sLnB1c2goIG9iaiApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICBwcml2YXRlIF90eXBlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9saXN0ZW5lcjogRnVuY3Rpb247XHJcbiAgICBwcml2YXRlIF90YXJnZXQ6IExheWEuRXZlbnREaXNwYXRjaGVyO1xyXG4gICAgcHJpdmF0ZSBfdGhpc09iajogYW55O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5LqL5Lu25p6E6YCg5Ye95pWwXHJcbiAgICAgKiBAcGFyYW0gdHlwZSAgICAgIOS6i+S7tuexu+Wei1xyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyICAgICAgIOS6i+S7tuWTjeW6lOWkhOeQhuWHveaVsFxyXG4gICAgICogQHBhcmFtIHRhcmdldCAgICDkuovku7bnu5HlrprnmoTmjqfku7ZcclxuICAgICAqIEBwYXJhbSBfaGlzT2JqICAg5piv5ZCm5piv57uR5a6a5o6n5Lu255qEIGhhbmRsZXLmlrnms5VcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoIHR5cGU6IHN0cmluZyA9IFwiXCIgLCBsaXN0ZW5lcjogRnVuY3Rpb24gPSBudWxsICwgdGFyZ2V0OiBMYXlhLkV2ZW50RGlzcGF0Y2hlciA9IG51bGwsIHRoaXNPYmo6IGFueSA9IG51bGwgKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMuX2xpc3RlbmVyID0gbGlzdGVuZXI7XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgIHRoaXMuX3RoaXNPYmogPSB0aGlzT2JqO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdHlwZSh2YWx1ZTpzdHJpbmcpe1xyXG5cclxuICAgICAgICB0aGlzLl90eXBlID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0eXBlKCk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgbGlzdGVuZXIoIHZhbHVlOkZ1bmN0aW9uICl7XHJcblxyXG4gICAgICAgIHRoaXMuX2xpc3RlbmVyID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBsaXN0ZW5lcigpOiBGdW5jdGlvbiB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHRhcmdldCggdmFsdWU6TGF5YS5FdmVudERpc3BhdGNoZXIgKXtcclxuXHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0YXJnZXQoKTogTGF5YS5FdmVudERpc3BhdGNoZXIge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fdGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdGhpc09iaiggdmFsdWU6YW55ICl7XHJcblxyXG4gICAgICAgIHRoaXMuX3RoaXNPYmogPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHRoaXNPYmooKTogYW55IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RoaXNPYmo7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6YeN572u5bm25Zue5pS2ICovXHJcbiAgICBwdWJsaWMgcmVjb3ZlcigpOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMuX3R5cGUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2xpc3RlbmVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLl90YXJnZXQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX3RoaXNPYmogPSBudWxsO1xyXG5cclxuICAgICAgICBFdmVudE9iai5yZWNvdmVyKCB0aGlzICk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgRXZlbnRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2VyL0V2ZW50TWFuYWdlclwiO1xyXG5pbXBvcnQgeyBFdmVudE9iaiB9IGZyb20gXCIuL0V2ZW50T2JqXCI7XHJcblxyXG4vKipcclxuICog5LqL5Lu25rGgXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS40LjIwXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudFBvb2wge1xyXG5cclxuXHRwcml2YXRlIHN0YXRpYyBwb29sOkFycmF5PEV2ZW50UG9vbD4gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZSgpOkV2ZW50UG9vbHtcclxuXHJcbiAgICAgICAgbGV0IG9iajpFdmVudFBvb2wgPSBFdmVudFBvb2wucG9vbC5zaGlmdCgpO1xyXG4gICAgICAgIGlmKCBvYmogPT0gbnVsbCApe1xyXG4gICAgICAgICAgICBvYmogPSBuZXcgRXZlbnRQb29sKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZWNvdmVyKCBvYmo6RXZlbnRQb29sICk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoIG9iaiAhPSBudWxsICYmIEV2ZW50UG9vbC5wb29sLmluZGV4T2YoIG9iaiApID09IC0xICl7XHJcbiAgICAgICAgICAgIEV2ZW50UG9vbC5wb29sLnB1c2goIG9iaiApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0cHJpdmF0ZSBfZXZlbnRPYmpMaXN0OkFycmF5PEV2ZW50T2JqPiA9IG51bGw7XHJcblxyXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuXHJcblx0XHR0aGlzLl9ldmVudE9iakxpc3QgPSBbXTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOa3u+WKoOS6i+S7tuebkeWQrFxyXG5cdCAqIEBwYXJhbSB0eXBlIFx0XHTkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW0gbGlzdGVuZXIgXHTkuovku7bmlrnms5VcclxuXHQgKiBAcGFyYW0gdGFyZ2V0XHTkuovku7blr7nosaFcclxuXHQgKiBAcGFyYW0gdGhpc09ialxyXG5cdCAqL1xyXG5cdHB1YmxpYyBhZGRMaXN0ZW5lciggdHlwZTpzdHJpbmcgLCBsaXN0ZW5lcjpGdW5jdGlvbiAsIHRhcmdldDpMYXlhLkV2ZW50RGlzcGF0Y2hlciA9IG51bGwgLCB0aGlzT2JqOmFueSApOnZvaWR7XHJcblxyXG5cdFx0aWYoICF0aGlzLmhhc0V2ZW50TGlzdGVuZXIodHlwZSxsaXN0ZW5lcix0YXJnZXQsdGhpc09iaikgKXtcclxuXHRcdFx0bGV0IG9iajpFdmVudE9iaiA9IEV2ZW50T2JqLmNyZWF0ZSggdHlwZSAsIGxpc3RlbmVyICwgdGFyZ2V0ICwgdGhpc09iaiApO1xyXG5cdFx0XHR0aGlzLl9ldmVudE9iakxpc3QucHVzaCggb2JqICk7XHJcblx0XHRcdEV2ZW50TWFuYWdlci5hZGRFdmVudExpc3RlbmVyKCB0eXBlICwgbGlzdGVuZXIgLCB0aGlzT2JqICwgdGFyZ2V0ICk7XHRcdFx0XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDnp7vpmaTkuovku7bnm5HlkKxcclxuXHQgKiBAcGFyYW0gdHlwZSBcdFx05LqL5Lu257G75Z6LXHJcblx0ICogQHBhcmFtIGxpc3RlbmVyIFx05LqL5Lu25pa55rOVXHJcblx0ICogQHBhcmFtIHRhcmdldFx05LqL5Lu25a+56LGhXHJcblx0ICogQHBhcmFtIHRoaXNPYmpcdFxyXG5cdCAqL1xyXG5cdHB1YmxpYyByZW1vdmVMaXN0ZW5lciggdHlwZTpzdHJpbmcgLCBsaXN0ZW5lcjpGdW5jdGlvbiAsIHRhcmdldDpMYXlhLkV2ZW50RGlzcGF0Y2hlciA9IG51bGwgLCB0aGlzT2JqOmFueSApOnZvaWR7XHJcblxyXG5cdFx0bGV0IG9iajpFdmVudE9iaiA9IG51bGw7XHJcblx0XHRmb3IoIGxldCBpPTA7aTx0aGlzLl9ldmVudE9iakxpc3QubGVuZ3RoO2krKyApe1xyXG5cdFx0XHRvYmogPSB0aGlzLl9ldmVudE9iakxpc3RbaV07XHJcblx0XHRcdGlmKCBvYmogJiYgb2JqLnR5cGUgPT0gdHlwZSAmJiBvYmoubGlzdGVuZXIgPT0gbGlzdGVuZXIgJiYgb2JqLnRoaXNPYmogPT0gdGhpc09iaiApe1xyXG5cdFx0XHRcdHRoaXMuX2V2ZW50T2JqTGlzdC5zcGxpY2UoaSwxKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0RXZlbnRNYW5hZ2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGUgLCBsaXN0ZW5lciAsIHRoaXNPYmogLCB0YXJnZXQgKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOenu+mZpOaxoOmHjOaJgOacieS6i+S7tuebkeWQrCzkv53mjIHnmoTlr7nosaHkuI3ku47liJfooajph4znp7vpmaRcclxuXHQgKi9cclxuXHRwdWJsaWMgcmVtb3ZlQWxsTGlzdGVuZXIoKTp2b2lke1xyXG5cclxuXHRcdGxldCBvYmo6RXZlbnRPYmogPSBudWxsO1xyXG5cdFx0Zm9yKCBsZXQgaT0wO2k8dGhpcy5fZXZlbnRPYmpMaXN0Lmxlbmd0aDtpKysgKXtcclxuXHRcdFx0b2JqID0gdGhpcy5fZXZlbnRPYmpMaXN0W2ldO1xyXG5cdFx0XHRpZiggb2JqICl7XHJcblx0XHRcdFx0RXZlbnRNYW5hZ2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoIG9iai50eXBlICwgb2JqLmxpc3RlbmVyICwgb2JqLnRoaXNPYmogLCBvYmoudGFyZ2V0ICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOmHjeaWsOebkeWQrOaJgOacieS6i+S7tlxyXG5cdCAqL1xyXG5cdHB1YmxpYyByZWxpc3RlbmVyQWxsKCk6dm9pZHtcclxuXHJcblx0XHRsZXQgb2JqOkV2ZW50T2JqID0gbnVsbDtcclxuXHRcdGZvciggbGV0IGk9MDtpPHRoaXMuX2V2ZW50T2JqTGlzdC5sZW5ndGg7aSsrICl7XHJcblx0XHRcdG9iaiA9IHRoaXMuX2V2ZW50T2JqTGlzdFtpXTtcclxuXHRcdFx0aWYoIG9iaiApe1xyXG5cdFx0XHRcdEV2ZW50TWFuYWdlci5hZGRFdmVudExpc3RlbmVyKCBvYmoudHlwZSAsIG9iai5saXN0ZW5lciAsIG9iai50aGlzT2JqICwgb2JqLnRhcmdldCApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDmmK/lkKbmnInmn5DkuKrnm5HlkKxcclxuXHQgKiBAcGFyYW0gdHlwZSBcdFx05LqL5Lu257G75Z6LXHJcblx0ICogQHBhcmFtIGxpc3RlbmVyIFx05LqL5Lu25pa55rOVXHJcblx0ICogQHBhcmFtIHRhcmdldFx05LqL5Lu25a+56LGhXHJcblx0ICogQHBhcmFtIHRoaXNPYmpcdFxyXG5cdCAqL1xyXG5cdHB1YmxpYyBoYXNFdmVudExpc3RlbmVyKCB0eXBlOnN0cmluZyAsIGxpc3RlbmVyOkZ1bmN0aW9uICwgdGFyZ2V0OkxheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCAsIHRoaXNPYmo6YW55ICk6Ym9vbGVhbntcclxuXHJcblx0XHRsZXQgb2JqOkV2ZW50T2JqID0gbnVsbDtcclxuXHRcdGZvciggb2JqIG9mIHRoaXMuX2V2ZW50T2JqTGlzdCApe1xyXG5cdFx0XHRpZiggb2JqICYmIG9iai50eXBlID09IHR5cGUgJiYgb2JqLmxpc3RlbmVyID09IGxpc3RlbmVyICl7XHJcblx0XHRcdFx0aWYoIHRhcmdldCA9PSBudWxsICl7XHJcblx0XHRcdFx0XHRyZXR1cm4gb2JqLnRoaXNPYmogPT0gdGhpc09iajtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHJldHVybiBvYmoudGFyZ2V0ID09IHRhcmdldCAmJiBvYmoudGhpc09iaiA9PSB0aGlzT2JqO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog6YeK5pS+6LWE5rqQXHJcblx0ICovXHJcblx0cHVibGljIGRpc3Bvc2UoKTp2b2lke1xyXG5cclxuXHRcdHdoaWxlKCB0aGlzLl9ldmVudE9iakxpc3QgJiYgdGhpcy5fZXZlbnRPYmpMaXN0Lmxlbmd0aCA+IDAgKXtcclxuXHRcdFx0bGV0IG9iajpFdmVudE9iaiA9IHRoaXMuX2V2ZW50T2JqTGlzdC5zaGlmdCgpO1xyXG5cdFx0XHRpZiggb2JqICl7XHJcblx0XHRcdFx0RXZlbnRNYW5hZ2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoIG9iai50eXBlICwgb2JqLmxpc3RlbmVyICwgb2JqLnRoaXNPYmogLCBvYmoudGFyZ2V0ICk7XHJcblx0XHRcdFx0b2JqLnJlY292ZXIoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5fZXZlbnRPYmpMaXN0ID0gW107XHJcblxyXG5cdFx0RXZlbnRQb29sLnJlY292ZXIoIHRoaXMgKTtcclxuXHR9XHJcbn0iLCIvKipcclxuICog5ri45oiP5LqL5Lu2XHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS4zLjIzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgR2FtZUV2ZW50IGV4dGVuZHMgTGF5YS5FdmVudHtcclxuXHJcblx0Lyoq6YCJ5oupICovXHJcblx0cHVibGljIHN0YXRpYyBTRUxFQ1Q6c3RyaW5nID0gXCJHYW1lRXZlbnQuc2VsZWN0XCI7XHJcblxyXG5cdC8qKua4suafk+S6i+S7tiAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgUkVOREVSOnN0cmluZyA9IFwiR2FtZUV2ZW50LnJlbmRlclwiO1xyXG5cclxuXHQvKirliqDovb3lrozmiJAgKi9cclxuXHRwdWJsaWMgc3RhdGljIExPQURfQ09NUExFVEU6c3RyaW5nID0gXCJHYW1lRXZlbnQubG9hZENvbXBsZXRlXCI7XHJcblxyXG5cdC8qKuiInuWPsOiHqumAguW6lCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgU1RHQUVfUkVTSVpFOnN0cmluZyA9IFwiR2FtZUV2ZW50LnN0YWdlUmVzaXplXCI7XHJcblxyXG5cdC8qKuWKoOi9vei/m+W6piAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgTE9BRF9QUk9HUkVTUzpzdHJpbmcgPSBcIkdhbWVFdmVudC5sb2FkUHJvZ3Jlc3NcIjtcclxuXHJcblx0Lyoq5YiX6KGo5riy5p+TICovXHJcblx0cHVibGljIHN0YXRpYyBFR0xJU1RfUkVOREVSOnN0cmluZyA9IFwiR2FtZUV2ZW50LkVHbGlzdFJlbmRlclwiO1xyXG5cdC8qKuWIl+ihqOa4suafk+WujOaIkCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgRUdMSVNUX0NPTVBMRVRFOnN0cmluZyA9IFwiR2FtZUV2ZW50LkVHbGlzdENvbXBsZXRlXCI7XHJcblxyXG5cdC8qKue7k+adn+W8leWvvCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgR1VJREVfRU5EOnN0cmluZyA9IFwiR2FtZUV2ZW50Lmd1aWRlRW5kXCI7XHJcblxyXG5cdC8qKuWvu+aJvuW8leWvvOWvueixoSAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgR1VJREVfU0VBUkNIX1RBUkdFVDpzdHJpbmcgPSBcIkdhbWVFdmVudC5ndWlkZVNlYXJjaFRhcmdldFwiO1xyXG5cclxuXHQvKirorr7nva7lvJXlr7znm67moIflr7nosaEgKi9cclxuXHRwdWJsaWMgc3RhdGljIEdVSURFX1RBUkdFVDpzdHJpbmcgPSBcIkdhbWVFdmVudC5ndWlkZVRhcmdldFwiO1xyXG5cclxuXHQvKirkuLvliqDovb3nlYzpnaLliqDovb3lrozmiJAgKi9cclxuXHRwdWJsaWMgc3RhdGljIE1BSU5fTE9BRF9DT01QTEVURTpzdHJpbmcgPSBcIkdhbWVFdmVudC5tYWluTG9hZENvbXBsZXRlXCI7XHJcblxyXG5cdC8qKuW8gOWni+a4uOaIjyAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgU1RBUlRfR0FNRTpzdHJpbmcgPSBcIkdhbWVFdmVudC5zdGFnZUdhbWVcIjtcclxuXHJcblx0Lyoq5re75Yqg5raI5oGvICovXHJcblx0cHVibGljIHN0YXRpYyBBRERfTUVTU0FHRTpzdHJpbmcgPSBcIkdhbWVFdmVudC5hZGRNZXNzYWdlXCI7XHJcblxyXG5cdC8qKuaSreaUvuW5v+WRiiAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgUExBWV9BRDpzdHJpbmcgPSBcIkdhbWVFdmVudC5wbGF5QWRcIjtcclxuXHJcblx0Lyoq5pKt5pS+5bm/5ZGK5a6M5oiQICovXHJcblx0cHVibGljIHN0YXRpYyBFTkRfUExBWV9BRDpzdHJpbmcgPSBcIkdhbWVFdmVudC5lbmRQbGF5QWRcIjtcclxuXHJcblx0cHVibGljIHRoaXNPYmplY3Q6YW55ID0gbnVsbDtcclxuXHJcblx0cHJpdmF0ZSBfZGF0YTphbnkgPSBudWxsO1xyXG5cclxuXHRwdWJsaWMgY29uc3RydWN0b3IoIHR5cGU6IHN0cmluZyAsIGRhdGE/OiBhbnkgKSB7XHJcblxyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHR0aGlzLnR5cGUgPSB0eXBlO1xyXG5cdFx0dGhpcy5fZGF0YSA9IGRhdGE7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGRhdGEoIHZhbHVlOmFueSApe1xyXG5cdFx0dGhpcy5fZGF0YSA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBkYXRhKCk6YW55e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2RhdGE7XHJcblx0fVxyXG59IiwiaW1wb3J0IFJlc291cmNlIGZyb20gXCIuL3Jlc291cmNlL1Jlc291cmNlXCI7XHJcbmltcG9ydCBMb2FkZXJFdmVudCBmcm9tIFwiLi9ldmVudC9Mb2FkZXJFdmVudFwiO1xyXG5pbXBvcnQgR3JvdXBSZXNvdXJjZSBmcm9tIFwiLi9yZXNvdXJjZS9Hcm91cFJlc291cmNlXCI7XHJcbmltcG9ydCBMb2FkVXRpbHMgZnJvbSBcIi4vdXRpbHMvTG9hZFV0aWxzXCI7XHJcbmltcG9ydCBUeHRSZXNvdXJjZSBmcm9tIFwiLi9yZXNvdXJjZS9UeHRSZXNvdXJjZVwiO1xyXG5pbXBvcnQgRXZlbnRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2VyL0V2ZW50TWFuYWdlclwiO1xyXG5pbXBvcnQgTG9nIGZyb20gXCIuLi9sb2cvTG9nXCI7XHJcblxyXG4vKipcclxuICog5Yqg6L296LWE5rqQ566h55CGXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkU291cmNlTWFuYWdlciB7XHJcblxyXG4gICAgLyoq5Yqg6L296LWE5rqQ566h55CGICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2FkTWFwOiBMYXlhLldlYWtPYmplY3QgPSBudWxsO1xyXG4gICAgLyoq6LWE5rqQ57uE5a2X5YW4ICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBncm91cE1hcDogT2JqZWN0ID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMllxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXQoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIExvYWRTb3VyY2VNYW5hZ2VyLmxvYWRNYXAgPSBuZXcgTGF5YS5XZWFrT2JqZWN0KCk7XHJcbiAgICAgICAgTG9hZFNvdXJjZU1hbmFnZXIuZ3JvdXBNYXAgPSB7fTtcclxuXHJcbiAgICAgICAgRXZlbnRNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoTG9hZGVyRXZlbnQuTE9BRF9TSU5HTEVfQ09NUExFVEUsIHRoaXMubG9hZFNpbmdsZUNvbXBsZXRlLCB0aGlzKTtcclxuICAgICAgICBFdmVudE1hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihMb2FkZXJFdmVudC5MT0FEX0dST1VQX0NPTVBMRVRFLCB0aGlzLmxvYWRHcm91cENvbXBsZXRlLCB0aGlzKTtcclxuXHJcbiAgICAgICAgLy9MYXlhLnRpbWVyLmxvb3AoMTAwMDAsIHRoaXMsIHRoaXMuY2hlY2tSZXMpOy8v5qOA5rWL6LWE5rqQ5piv5ZCm5Zue5pS2LOaaguWumjEw56eS6ZKf5Zue5pS25LiA5qyhXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3ljZXkuKrotYTmupDlrozmiJBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9hZFNpbmdsZUNvbXBsZXRlKHNvdXJjZTogc3RyaW5nIHwgUmVzb3VyY2UpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IHJlczogUmVzb3VyY2UgPSB0eXBlb2Ygc291cmNlID09PSBcInN0cmluZ1wiID8gdGhpcy5nZXRSZXMoc291cmNlKSA6IHNvdXJjZTtcclxuICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgbGV0IGdyb3VwUmVzOiBHcm91cFJlc291cmNlID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IGtleTphbnk7XHJcbiAgICAgICAgICAgIGZvciAoIGtleSBpbiB0aGlzLmdyb3VwTWFwKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cFJlcyA9IHRoaXMuZ3JvdXBNYXBba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmIChncm91cFJlcyAmJiBncm91cFJlcy5oYXNVcmwocmVzLnVybCkgJiYgZ3JvdXBSZXMuaXNMb2FkZWQoKSkgeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgRXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQoTG9hZGVyRXZlbnQuTE9BRF9HUk9VUF9DT01QTEVURSwgZ3JvdXBSZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L2957uE6LWE5rqQ5a6M5oiQXHJcbiAgICAgKiBAcGFyYW0gZ3JvdXBOYW1lIFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2FkR3JvdXBDb21wbGV0ZShzb3VyY2U6IHN0cmluZyB8IEdyb3VwUmVzb3VyY2UpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGdyb3VwUmVzOiBHcm91cFJlc291cmNlID0gdHlwZW9mIHNvdXJjZSA9PT0gXCJzdHJpbmdcIiA/IDxHcm91cFJlc291cmNlPnRoaXMuZ2V0UmVzKHNvdXJjZSkgOiBzb3VyY2U7XHJcbiAgICAgICAgaWYgKGdyb3VwUmVzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgTG9nLmxvZyggdGhpcyAsIFwi5Yqg6L296LWE5rqQ57uEW1wiK2dyb3VwUmVzLm5hbWUrXCJd5a6M5oiQIVwiKTtcclxuICAgICAgICAgICAgaWYgKGdyb3VwUmVzLmNvbXBsZXRlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGdyb3VwUmVzLmNvbXBsZXRlLnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L2957uE6LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gZ3JvdXBOYW1lIOi1hOa6kOe7hOWQjeWtlyzluLjop4TkuI3luKbnrKblj7fnmoTlrZfnrKbkuLLvvIzlrZfmr40r5pWw57uEXHJcbiAgICAgKiBAcGFyYW0gdXJsbGlzdCDotYTmupDlnLDlnYDliJfooahcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkR3JvdXAoZ3JvdXBOYW1lOiBzdHJpbmcgPSBcIlwiLCB1cmxsaXN0OiBBcnJheTxzdHJpbmc+LCBjb21wbGV0ZTogTGF5YS5IYW5kbGVyID0gbnVsbCwgcHJvZ3Jlc3M6IExheWEuSGFuZGxlciA9IG51bGwpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKCFncm91cE5hbWUpIHJldHVybjtcclxuICAgICAgICBsZXQgZ3JvdXBsaXN0OiBBcnJheTxSZXNvdXJjZT4gPSB0aGlzLmxvYWRNYXAuZ2V0KGdyb3VwTmFtZSk7XHJcbiAgICAgICAgaWYgKGdyb3VwbGlzdCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGdyb3VwbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICBpZiAodXJsbGlzdCAhPSBudWxsICYmIHVybGxpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1cmxsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVybDogc3RyaW5nID0gdXJsbGlzdFtpXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzOiBSZXNvdXJjZSA9IHRoaXMubG9hZE1hcC5nZXQodXJsKSB8fCBMb2FkU291cmNlTWFuYWdlci5jcmVhdGUodXJsKTtcclxuICAgICAgICAgICAgICAgICAgICBncm91cGxpc3QucHVzaChyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZE1hcC5zZXQocmVzLnVybCwgcmVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGdyb3VwUmVzOiBHcm91cFJlc291cmNlID0gdGhpcy5ncm91cE1hcFsgZ3JvdXBOYW1lIF07IFxyXG4gICAgICAgICAgICBpZiggZ3JvdXBSZXMgPT0gbnVsbCApe1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBSZXMgPSBMb2FkU291cmNlTWFuYWdlci5jcmVhdGUoZ3JvdXBsaXN0LCBjb21wbGV0ZSwgcHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBSZXMubmFtZSA9IGdyb3VwTmFtZTtcclxuICAgICAgICAgICAgICAgIGdyb3VwUmVzLmxvYWQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBNYXBbZ3JvdXBOYW1lXSA9IGdyb3VwUmVzO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZiggY29tcGxldGUgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICAgICAgaWYoIGdyb3VwUmVzLmlzTG9hZGVkKCkgKXtcclxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZS5ydW4oKTtcclxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBMYXlhLkxvZy5wcmludChcIuW3sue7j+acieivpei1hOa6kOe7hOS6hu+8gVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu65Yqg6L296LWE5rqQ57G7XHJcbiAgICAgKiBAcGFyYW0gdXJsXHJcbiAgICAgKiBAcGFyYW0gY29tcGxldGUgXHJcbiAgICAgKiBAcGFyYW0gcHJvZ3Jlc3MgXHJcbiAgICAgKiBAcGFyYW0gZXJyb3IgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKHVybDogYW55LCBjb21wbGV0ZTogTGF5YS5IYW5kbGVyID0gbnVsbCwgcHJvZ3Jlc3M6IExheWEuSGFuZGxlciA9IG51bGwsIGVycm9yOiBMYXlhLkhhbmRsZXIgPSBudWxsKTogYW55IHtcclxuXHJcbiAgICAgICAgbGV0IHJlczogUmVzb3VyY2UgPSBudWxsO1xyXG4gICAgICAgIGxldCBleHQ6IHN0cmluZyA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBMb2FkVXRpbHMuZ2V0RmlsZUV4dCh1cmwpIDogXCJcIjtcclxuICAgICAgICBpZiAodXJsIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKEdyb3VwUmVzb3VyY2UuS0VZLCBHcm91cFJlc291cmNlKTtcclxuICAgICAgICAgICAgcmVzLnR5cGUgPSBSZXNvdXJjZS5UWVBFX0dST1VQO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXh0ID09IFwicG5nXCIgfHwgZXh0ID09IFwianBnXCIgfHwgZXh0ID09IFwiYm1wXCIpIHtcclxuICAgICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKFJlc291cmNlLktFWSwgUmVzb3VyY2UpO1xyXG4gICAgICAgICAgICByZXMudHlwZSA9IExheWEuTG9hZGVyLklNQUdFO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZXh0ID09IFwidHh0XCIgfHwgZXh0ID09IFwianNvblwiKSB7XHJcbiAgICAgICAgICAgIHJlcyA9IExheWEuUG9vbC5nZXRJdGVtQnlDbGFzcyhUeHRSZXNvdXJjZS5LRVksIFR4dFJlc291cmNlKTtcclxuICAgICAgICAgICAgcmVzLnR5cGUgPSBMYXlhLkxvYWRlci5URVhUO1xyXG4gICAgICAgIH0gZWxzZSB7Ly/kuozov5vliLbotYTmupBcclxuICAgICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKFJlc291cmNlLktFWSwgUmVzb3VyY2UpO1xyXG4gICAgICAgICAgICByZXMudHlwZSA9IExheWEuTG9hZGVyLkJVRkZFUjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICByZXMuY3JlYXRlKHVybCwgY29tcGxldGUsIHByb2dyZXNzLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3otYTmupBcclxuICAgICAqIEBwYXJhbSBzb3VyY2Ug6LWE5rqQXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZChzb3VyY2U6IHN0cmluZyB8IFJlc291cmNlLCBjb21wbGV0ZTogTGF5YS5IYW5kbGVyID0gbnVsbCwgZXJyb3I6IExheWEuSGFuZGxlciA9IG51bGwpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKCFzb3VyY2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVzOiBSZXNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2UgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgcmVzID0gdGhpcy5sb2FkTWFwLmdldChzb3VyY2UpO1xyXG4gICAgICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXMgPSBMb2FkU291cmNlTWFuYWdlci5jcmVhdGUoc291cmNlLCBjb21wbGV0ZSwgZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc291cmNlIGluc3RhbmNlb2YgUmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgcmVzID0gc291cmNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlcyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcy5nZXRSZXMoZmFsc2UpICE9IG51bGwpIHsvL+i1hOa6kOW3suWKoOi9veWujOaIkFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcy5sb2FkKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkTWFwLnNldChyZXMudXJsLCByZXMpO1xyXG4gICAgICAgIGxldCBpc0JyZWFrOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMubG9hZE1hcCkge1xyXG4gICAgICAgICAgICByZXMgPSB0aGlzLmxvYWRNYXAuZ2V0KGtleSk7XHJcbiAgICAgICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGlzQnJlYWsgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzQnJlYWspIHtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5sb29wKDEwMDAsIHRoaXMsIHRoaXMuY2hlY2tSZXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIExheWEudGltZXIuY2xlYXIodGhpcywgdGhpcy5jaGVja1Jlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qOA5rWL6LWE5rqQ5piv5ZCm5Y+v5Zue5pS2XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGNoZWNrUmVzKCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgcmVzOiBSZXNvdXJjZTtcclxuICAgICAgICBmb3IgKGxldCB1cmwgaW4gdGhpcy5sb2FkTWFwKSB7XHJcbiAgICAgICAgICAgIHJlcyA9IHRoaXMubG9hZE1hcC5nZXQodXJsKTtcclxuICAgICAgICAgICAgaWYgKHJlcyAmJiByZXMuY2FuR2MoKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzLnJlY292ZXIoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZE1hcC5kZWwodXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/mo4DmtYvnu4TotYTmupAgVE9ET1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlui1hOa6kOaVsOaNrlxyXG4gICAgICogQHBhcmFtIHVybCDotYTmupDlnLDlnYAs5oiW6ICF57uE6LWE5rqQ5ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UmVzKHVybDogc3RyaW5nKTogUmVzb3VyY2UgfCBHcm91cFJlc291cmNlIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZE1hcC5nZXQodXJsKSB8fCB0aGlzLmdyb3VwTWFwWyB1cmwgXSAhPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W6LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gdXJsIOi1hOa6kOWcsOWdgFxyXG4gICAgICogQHBhcmFtIGlzQ291bnQg5piv5ZCm6K6h5pWwXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0U291cmNlKHVybDogc3RyaW5nLCBpc0NvdW50OiBib29sZWFuID0gZmFsc2UpOiBhbnkge1xyXG5cclxuICAgICAgICBsZXQgcmVzOiBSZXNvdXJjZSA9IHRoaXMubG9hZE1hcC5nZXQodXJsKTtcclxuICAgICAgICByZXR1cm4gcmVzICYmIHJlcy5nZXRSZXMoaXNDb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDph4rmlL7otYTmupBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBkZXN0cm95UmVzKHVybDogc3RyaW5nKTogdm9pZCB7XHJcblxyXG5cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOe6r+eyueWKoOi9vei1hOa6kOeuoeeQhlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExvYWRlck1hbmFnZXIge1xyXG5cclxuICAgIC8qKuWKoOi9vemYn+WIl+S4iumZkCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBMT0FEX0xJTUlUOiBudW1iZXIgPSA1O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YeG5aSH5Yqg6L295YiX6KGoXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWR5TG9hZExpc3Q6IEFycmF5PFJlc291cmNlPiA9IFtdO1xyXG5cclxuICAgIC8qKuato+WcqOWKoOi9veeahOWIl+ihqCAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9hZGluZ0xpc3Q6IEFycmF5PFJlc291cmNlPiA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L296LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gc291cmNlIOi1hOa6kOWcsOWdgOaIllJlc291cmNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZChzb3VyY2U6IHN0cmluZyB8IFJlc291cmNlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCByZXM6IFJlc291cmNlID0gdHlwZW9mIHNvdXJjZSA9PT0gXCJzdHJpbmdcIiA/IExvYWRTb3VyY2VNYW5hZ2VyLmdldFJlcyhzb3VyY2UpIDogc291cmNlO1xyXG4gICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubG9hZGluZ0xpc3QubGVuZ3RoIDwgdGhpcy5MT0FEX0xJTUlUKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sb2FkaW5nTGlzdC5pbmRleE9mKHJlcykgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+i1hOa6kOato+WcqOWKoOi9vVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZ0xpc3QucHVzaChyZXMpO1xyXG4gICAgICAgICAgICAgICAgLy9Mb2cubG9nKHRoaXMsIFwi5byA5aeL5Yqg6L296LWE5rqQIHVybDogXCIgKyByZXMudXJsLCBMb2cuVFlQRV9MT0FEKTsvL+aJk+WNsOaXpeW/l1xyXG4gICAgICAgICAgICAgICAgTGF5YS5sb2FkZXIubG9hZChbeyB1cmw6IHJlcy51cmwsIHR5cGU6IHJlcy50eXBlIH1dLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Mb2FkZWQsIFtyZXNdLCB0cnVlKSwgcmVzLnByb2dyZXNzKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlYWR5TG9hZExpc3QuaW5kZXhPZihyZXMpID09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5TG9hZExpc3QucHVzaChyZXMpO1xyXG4gICAgICAgICAgICAgICAgLy/ov5nph4zmoLnmja7kvJjlhYjnuqfmjpLluo9cclxuICAgICAgICAgICAgICAgIC8vIHRoaXMucmVhZHlMb2FkTGlzdCA9IHRoaXMucmVhZHlMb2FkTGlzdC5zb3J0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgb25Mb2FkZWQocmVzOiBSZXNvdXJjZSk6IHZvaWQge1xyXG5cclxuICAgICAgICByZXMubG9hZENvbXBsZXRlKCk7XHJcbiAgICAgICAgLy/ku47liqDovb3liJfooajnp7vpmaRcclxuICAgICAgICBsZXQgaW5kZXg6IG51bWJlciA9IHRoaXMubG9hZGluZ0xpc3QuaW5kZXhPZihyZXMpO1xyXG4gICAgICAgIGlmIChpbmRleCAhPSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdMaXN0LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIExvZy5sb2codGhpcywgXCLliqDovb3otYTmupAgdXJs77yaXCIgKyByZXMudXJsICsgXCLlrozmiJDjgIJcIiwgTG9nLlRZUEVfTE9BRCk7XHJcbiAgICAgICAgRXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQoTG9hZGVyRXZlbnQuTE9BRF9TSU5HTEVfQ09NUExFVEUsIHJlcyk7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZE5leHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2FkTmV4dCgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IHJlczogUmVzb3VyY2UgPSB0aGlzLnJlYWR5TG9hZExpc3Quc2hpZnQoKTtcclxuICAgICAgICBpZiAocmVzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkKHJlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIOWKoOi9veS6i+S7tlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZGVyRXZlbnQgIHtcclxuICAgIFxyXG4gICAgLyoq5Yqg6L295Y2V5Liq6LWE5rqQ5a6M5oiQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExPQURfU0lOR0xFX0NPTVBMRVRFOnN0cmluZyA9IFwiTG9hZGVyRXZlbnQubG9hZFNpbmdsZUNvbXBsZXRlXCI7XHJcbiAgICAvKirliqDovb3nu4TotYTmupDlrozmiJAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTE9BRF9HUk9VUF9DT01QTEVURTpzdHJpbmcgPSBcIkxvYWRlckV2ZW50LmxvYWRHcm91cENvbXBsZXRlXCI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCAgKXtcclxuXHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IFJlc291cmNlIGZyb20gXCIuL1Jlc291cmNlXCI7XHJcbmltcG9ydCB7IExvYWRlck1hbmFnZXIgfSBmcm9tIFwiLi4vTG9hZFNvdXJjZU1hbmFnZXJcIjtcclxuaW1wb3J0IExvZyBmcm9tIFwiLi4vLi4vbG9nL0xvZ1wiO1xyXG5cclxuLyoqXHJcbiAqIOe7hOi1hOa6kFxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JvdXBSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHtcclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBLRVk6c3RyaW5nID0gXCJHcm91cFJlc291cmNlXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfbGlzdDpBcnJheTxSZXNvdXJjZT4gPSBudWxsO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgXHJcblxyXG4gICAgICAgIHN1cGVyKCk7IFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoIHVybDpBcnJheTxSZXNvdXJjZT4gPSBudWxsICwgY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbCAsIHByb2dyZXNzOkxheWEuSGFuZGxlciA9IG51bGwgLCBlcnJvcjpMYXlhLkhhbmRsZXIgPSBudWxsICApOnZvaWR7XHJcblxyXG4gICAgICAgIC8vIHRoaXMudXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMuX2xpc3QgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5fY29tcGxldGUgPSBjb21wbGV0ZTtcclxuICAgICAgICB0aGlzLl9wcm9ncmVzcyA9IHByb2dyZXNzO1xyXG4gICAgICAgIHRoaXMuX2Vycm9yID0gZXJyb3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvYWQoKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggdGhpcy5fbGlzdCAmJiB0aGlzLl9saXN0Lmxlbmd0aCA+IDAgKXtcclxuICAgICAgICAgICAgbGV0IGlzQnJlYWs6Ym9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBsZXQgcmVzOlJlc291cmNlO1xyXG4gICAgICAgICAgICBmb3IoIHJlcyBvZiB0aGlzLl9saXN0ICl7XHJcbiAgICAgICAgICAgICAgICBpZiggcmVzICYmIHJlcy5nZXRSZXMoIGZhbHNlICkgPT0gbnVsbCApeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgTG9hZGVyTWFuYWdlci5sb2FkKCByZXMudXJsICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIWlzQnJlYWspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0JyZWFrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoIWlzQnJlYWsgJiYgdGhpcy5fY29tcGxldGUgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29tcGxldGUucnVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDotYTmupDnu4TmmK/lkKbliqDovb3lrozmiJBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzTG9hZGVkKCk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuX2xpc3QgJiYgdGhpcy5fbGlzdC5sZW5ndGggPiAwICl7XHJcbiAgICAgICAgICAgIGxldCByZXM6UmVzb3VyY2U7XHJcbiAgICAgICAgICAgIGZvciggcmVzIG9mIHRoaXMuX2xpc3QgKXtcclxuICAgICAgICAgICAgICAgIGlmKCByZXMgJiYgcmVzLmdldFJlcyggZmFsc2UgKSA9PSBudWxsICl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2UgaWYoICF0aGlzLl9saXN0ICl7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5pyJ5a+55bqU5Zyw5Z2A6LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gdXJsIOi1hOa6kOWcsOWdgFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaGFzVXJsKCB1cmw6c3RyaW5nICk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgbGV0IHJlczpSZXNvdXJjZTtcclxuICAgICAgICBmb3IoIHJlcyBvZiB0aGlzLl9saXN0ICl7XHJcbiAgICAgICAgICAgIGlmKCByZXMgJiYgcmVzLnVybCA9PSB1cmwgKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi1hOa6kOaYr+WQpuW3suWKoOi9vVxyXG4gICAgICogQHBhcmFtIHVybCDotYTmupDlnLDlnYBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGhhc0xvYWRlZCggdXJsOnN0cmluZyApOmJvb2xlYW57XHJcblxyXG4gICAgICAgIGxldCByZXM6UmVzb3VyY2U7XHJcbiAgICAgICAgZm9yKCByZXMgb2YgdGhpcy5fbGlzdCApe1xyXG4gICAgICAgICAgICBpZiggcmVzICYmIHJlcy51cmwgPT0gdXJsICYmIHJlcy5nZXRSZXMoIGZhbHNlICkgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IExvYWRVdGlscyBmcm9tIFwiLi4vdXRpbHMvTG9hZFV0aWxzXCI7XHJcbmltcG9ydCB7IExvYWRlck1hbmFnZXIgfSBmcm9tIFwiLi4vTG9hZFNvdXJjZU1hbmFnZXJcIjtcclxuXHJcbi8qKlxyXG4gKiDotYTmupDln7rnsbtcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc291cmNlIGltcGxlbWVudHMgSVJlc291cmNlIHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEtFWTpzdHJpbmcgPSBcIlJlc291cmNlXCI7XHJcblxyXG4gICAgLyoq5Zue5pS26Ze06ZqU5pe26Ze077yM5q+r56eSICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEdDX0dBUFRJTUU6bnVtYmVyID0gMTAwMDA7XHJcblxyXG4gICAgLyoq5Zu+54mH6LWE5rqQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRZUEVfSU1BR0U6c3RyaW5nID0gXCJpbWFnZVwiO1xyXG4gICAgLyoq5paH5pys6LWE5rqQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRQWUVfVEVYVDpzdHJpbmcgPSBcInRleHRcIjtcclxuICAgIC8qKuS6jOi/m+WItui1hOa6kCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUWVBFX0JJTjpzdHJpbmcgPSBcImJpblwiO1xyXG4gICAgLyoq57uE6LWE5rqQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRZUEVfR1JPVVA6c3RyaW5nID0gXCJncm91cFwiO1xyXG5cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgY3JlYXRlKCB1cmw6YW55ICwgY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbCAsIHByb2dyZXNzOkxheWEuSGFuZGxlciA9IG51bGwgLCBlcnJvcjpMYXlhLkhhbmRsZXIgPSBudWxsICk6YW55e1xyXG5cclxuICAgIC8vICAgICBsZXQgcmVzOlJlc291cmNlID0gbnVsbDtcclxuICAgIC8vICAgICBsZXQgZXh0OnN0cmluZyA9IExvYWRVdGlscy5nZXRGaWxlRXh0KCB1cmwgKTtcclxuICAgIC8vICAgICBpZiggZXh0ID09IFwicG5nXCIgfHwgZXh0ID09IFwianBnXCIgfHwgZXh0ID09IFwiYm1wXCIgKXtcclxuICAgIC8vICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKCBSZXNvdXJjZS5LRVkgLCBSZXNvdXJjZSApO1xyXG4gICAgLy8gICAgICAgICByZXMudHlwZSA9IExheWEuTG9hZGVyLklNQUdFO1xyXG4gICAgLy8gICAgIH1lbHNlIGlmKCBleHQgPT0gXCJ0eHRcIiB8fCBleHQgPT0gXCJqc29uXCIgKXtcclxuICAgIC8vICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKCBUeHRSZXNvdXJjZS5LRVkgLCBUeHRSZXNvdXJjZSApO1xyXG4gICAgLy8gICAgICAgICByZXMudHlwZSA9IExheWEuTG9hZGVyLlRFWFQ7XHJcbiAgICAvLyAgICAgfWVsc2UgaWYoIHVybCBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgIC8vICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKCBHcm91cFJlc291cmNlLktFWSAsIEdyb3VwUmVzb3VyY2UgKTtcclxuICAgIC8vICAgICAgICAgcmVzLnR5cGUgPSBSZXNvdXJjZS5UWVBFX0dST1VQO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICBpZihyZXMpe1xyXG4gICAgLy8gICAgICAgICByZXMuY3JlYXRlKCB1cmwgLCBjb21wbGV0ZSAsIHByb2dyZXNzICwgZXJyb3IgKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgcmV0dXJuIHJlcztcclxuICAgIC8vIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWbnuaUtui1hOa6kFxyXG4gICAgICogQHBhcmFtIHJlcyBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWNvdmVyKCByZXM6UmVzb3VyY2UgKTp2b2lke1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCByZXMgKXtcclxuICAgICAgICAgICAgcmVzLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIExheWEuUG9vbC5yZWNvdmVyKCB0eXBlb2YgcmVzICwgcmVzICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAvKirotYTmupDlkI3lrZcgKi9cclxuICAgIHB1YmxpYyBuYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICAvKirliqDovb3lnLDlnYAgKi9cclxuICAgIHB1YmxpYyB1cmw6c3RyaW5nID0gXCJcIjtcclxuICAgIC8qKui1hOa6kOexu+WeiyAqL1xyXG4gICAgcHVibGljIHR5cGU6c3RyaW5nID0gXCJcIjtcclxuICAgIC8qKuS4i+i9veS8mOWFiOe6pyAqL1xyXG4gICAgcHVibGljIHByaW9yaXR5Om51bWJlciA9IDA7XHJcbiAgICAvKirliqDovb3lrozmiJDkuovku7YgKi9cclxuICAgIHByb3RlY3RlZCBfY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbDtcclxuICAgIC8qKui/m+W6puS6i+S7tiAqL1xyXG4gICAgcHJvdGVjdGVkIF9wcm9ncmVzczpMYXlhLkhhbmRsZXIgPSBudWxsO1xyXG4gICAgLyoq6ZSZ6K+v5LqL5Lu2ICovXHJcbiAgICBwcm90ZWN0ZWQgX2Vycm9yOkxheWEuSGFuZGxlciA9IG51bGw7XHJcbiAgICAvKirotYTmupDmlbDmja4gKi9cclxuICAgIHByb3RlY3RlZCBfZGF0YTphbnkgPSBudWxsO1xyXG4gICAgLyoq5L2/55So6K6h5pWwICovXHJcbiAgICBwcm90ZWN0ZWQgX3VzZUNvdW50Om51bWJlciA9IDA7XHJcbiAgICAvKirlm57mlLbml7bpl7QgKi9cclxuICAgIHByb3RlY3RlZCBfZ2NUaW1lOm51bWJlciA9IDA7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCB1cmw6c3RyaW5nID0gXCJcIiAsIGNvbXBsZXRlOkxheWEuSGFuZGxlciA9IG51bGwgLCBlcnJvcjpMYXlhLkhhbmRsZXIgPSBudWxsICkgeyBcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGUoIHVybCAsIGNvbXBsZXRlICwgZXJyb3IgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlKCB1cmw6YW55ID0gXCJcIiAsIGNvbXBsZXRlOkxheWEuSGFuZGxlciA9IG51bGwgLCBwcm9ncmVzczpMYXlhLkhhbmRsZXIgPSBudWxsICwgZXJyb3I6TGF5YS5IYW5kbGVyID0gbnVsbCAgKTp2b2lke1xyXG5cclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgICAgICB0aGlzLl9jb21wbGV0ZSA9IGNvbXBsZXRlO1xyXG4gICAgICAgIHRoaXMuX3Byb2dyZXNzID0gcHJvZ3Jlc3M7XHJcbiAgICAgICAgdGhpcy5fZXJyb3IgPSBlcnJvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9hZCgpOnZvaWR7XHJcblxyXG4gICAgICAgIC8vIExheWEubG9hZGVyLmxvYWQoW1xyXG5cdFx0Ly8gXHR7IHVybDogXCJyZXMvZmFpcnVpL2NvbW1vbl9hdGxhczAucG5nXCIsIHR5cGU6IExheWEuTG9hZGVyLklNQUdFIH0sXHJcblx0XHQvLyBcdHsgdXJsOiBcInJlcy9mYWlydWkvY29tbW9uLm1hcFwiLCB0eXBlOiBMYXlhLkxvYWRlci5CVUZGRVIgfVxyXG4gICAgICAgIC8vICAgICBdLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Mb2FkZWQpKTtcclxuXHJcbiAgICAgICAgTG9hZGVyTWFuYWdlci5sb2FkKCB0aGlzLnVybCApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWNvdmVyKCk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuX3VzZUNvdW50IDw9IDAgKXtcclxuICAgICAgICAgICAgUmVzb3VyY2UucmVjb3ZlciggdGhpcyApO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb2FkQ29tcGxldGUoKTp2b2lke1xyXG5cclxuICAgICAgICB0aGlzLl9kYXRhID0gTGF5YS5sb2FkZXIuZ2V0UmVzKCB0aGlzLnVybCApO1xyXG4gICAgICAgIHRoaXMuX3VzZUNvdW50ID0gMDtcclxuICAgICAgICBpZiggdGhpcy5fY29tcGxldGUgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZS5ydW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5botYTmupBcclxuICAgICAqIEBwYXJhbSBpc0NvdW50IOaYr+WQpuiuoeaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0UmVzKCBpc0NvdW50OmJvb2xlYW4gPSB0cnVlICk6YW55e1xyXG5cclxuICAgICAgICBpZiggaXNDb3VudCApe1xyXG4gICAgICAgICAgICB0aGlzLl91c2VDb3VudCsrO1xyXG4gICAgICAgICAgICB0aGlzLl9nY1RpbWUgPSBMYXlhLnRpbWVyLmN1cnJGcmFtZSArIFJlc291cmNlLkdDX0dBUFRJTUU7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB1c2VDb3VudCgpOm51bWJlcntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZUNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuaYr+WQpuWPr+WbnuaUtiAqL1xyXG4gICAgcHVibGljIGNhbkdjKCk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgcmV0dXJuIExheWEudGltZXIuY3VyckZyYW1lID4gdGhpcy5fZ2NUaW1lICYmIHRoaXMuX3VzZUNvdW50IDw9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzTG9hZGVkKCk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEgIT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hlY2soKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggdGhpcy5jYW5HYygpICl7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3ZlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNvbXBsZXRlKCk6TGF5YS5IYW5kbGVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcGxldGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBwcm9ncmVzcygpOkxheWEuSGFuZGxlcntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2dyZXNzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhcigpOnZvaWR7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIHRoaXMuX2NvbXBsZXRlICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUucmVjb3ZlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5fcHJvZ3Jlc3MgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmVzcy5yZWNvdmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLl9lcnJvciAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yLnJlY292ZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY29tcGxldGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX3Byb2dyZXNzID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9lcnJvciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy51cmwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2djVGltZSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3Bvc2UoKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggdGhpcy5fdXNlQ291bnQgPiAwICl7XHJcbiAgICAgICAgICAgIHRoaXMuX3VzZUNvdW50LS07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBSZXNvdXJjZSBmcm9tIFwiLi9SZXNvdXJjZVwiO1xyXG5cclxuLyoqXHJcbiAqIOaWh+acrOi1hOa6kFxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHh0UmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7ICAgIFxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEtFWTpzdHJpbmcgPSBcIlR4dFJlc291cmNlXCI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7IFxyXG4gICAgICAgIHN1cGVyKCk7IFxyXG4gICAgfVxyXG5cclxuXHJcbn0iLCIvKipcclxuICog5Yqg6L295bel5YW3XHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkVXRpbHN7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICog6I635b6X5paH5Lu25ZCO57yA5ZCNXHJcbiAgICAgKiBAcGFyYW0gdXJsIOaWh+S7tui3r+W+hFxyXG4gICAgICogQHJldHVybiA8Yj5TdHJpbmc8L2I+IOaWh+S7tuWQjue8gOWQjVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEZpbGVFeHQodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIC8v5YiH5o6J6Lev5b6E5ZCO6Z2i55qE5Y+C5pWwXHJcbiAgICAgICAgbGV0IGV4dDogc3RyaW5nID0gdXJsLmluZGV4T2YoXCI/XCIpID4gLTEgPyB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKFwiP1wiKSkgOiB1cmw7XHJcbiAgICAgICAgLy/miKrlj5blkI7nvIBcclxuICAgICAgICBsZXQgbGFzdDogc3RyaW5nID0gZXh0LnN1YnN0cmluZyhleHQubGFzdEluZGV4T2YoXCIvXCIpKTtcclxuICAgICAgICByZXR1cm4gbGFzdC5sYXN0SW5kZXhPZihcIi5cIikgPT0gLTEgPyBcIlwiIDogbGFzdC5zdWJzdHJpbmcobGFzdC5sYXN0SW5kZXhPZihcIi5cIikgKyAxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIOi1hOa6kOWcsOWdgOeuoeeQhuexu1xyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXJsVXRpbHMge1xyXG4gICAgXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBSRVM6c3RyaW5nID0gXCJyZXMvXCI7XHJcbiAgICAvKipmYWlyeWd1aeWPkeW4g+i1hOa6kOebruW9lSAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBGQUlSVUk6c3RyaW5nID0gVXJsVXRpbHMuUkVTICsgXCJmYWlydWkvXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5ZmYWlyeWd1aei1hOa6kOe7hFxyXG4gICAgICogQHBhcmFtIG5hbWUgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0RmFpcnlHcm91cCggbmFtZTpzdHJpbmcgKTpBcnJheTxzdHJpbmc+e1xyXG5cclxuICAgICAgICByZXR1cm4gWyBVcmxVdGlscy5GQUlSVUkgKyBuYW1lICsgXCJfYXRsYXMwLnBuZ1wiICwgVXJsVXRpbHMuRkFJUlVJICsgbmFtZSArIFwiLm1hcFwiIF07XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgTG9nVm8gZnJvbSBcIi4vTG9nVm9cIjtcclxuXHJcbi8qKlxyXG4gKiDml6Xlv5fns7vnu58gXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjI1XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2cge1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGxvZ01hcDogTGF5YS5XZWFrT2JqZWN0ID0gbnVsbDtcclxuICAgIHByaXZhdGUgc3RhdGljIGtleUluZGV4Om51bWJlciA9IDA7XHJcblxyXG4gICAgLyoq5pmu6YCa6LCD6K+V5pel5b+XICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRZUEVfREVCVUc6c3RyaW5nID0gXCJkZWJ1Z1wiO1xyXG4gICAgLyoq5Yqg6L2955u45YWz5pel5b+XICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRZUEVfTE9BRDpzdHJpbmcgPSBcImxvYWRcIjtcclxuXHJcbiAgICAvKirkuI3pnIDopoHmmL7npLrml6Xlv5fnsbvlnovnmoTliJfooaggKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbm9zaG93TG9nVHlwZUxpc3Q6QXJyYXk8c3RyaW5nPiA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0KCk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dNYXAgPSBuZXcgTGF5YS5XZWFrT2JqZWN0KCk7XHJcbiAgICAgICAgdGhpcy5ub3Nob3dMb2dUeXBlTGlzdCA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pi+56S65pel5b+XXHJcbiAgICAgKiBAcGFyYW0gdGhpc09iamVjdCBcclxuICAgICAqIEBwYXJhbSB0ZXh0IOaXpeW/l+aWh+acrFxyXG4gICAgICogQHBhcmFtIHR5cGUg5pel5b+X57G75Z6LXHJcbiAgICAgKiBAcGFyYW0gbGV2ZWwg5pel5b+X562J57qnXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9nKCB0aGlzT2JqZWN0OmFueSAsIHRleHQ6c3RyaW5nICwgdHlwZTpzdHJpbmc9XCJcIiAsIGxldmVsOm51bWJlciA9MCApOnZvaWR7XHJcblxyXG4gICAgICAgIGlmKCB0eXBlID09IFwiXCIpe1xyXG4gICAgICAgICAgICB0eXBlID0gTG9nLlRZUEVfREVCVUc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0eXBlICYmIHRoaXMubm9zaG93TG9nVHlwZUxpc3QuaW5kZXhPZih0eXBlKSAhPSAtMSApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBsb2dWbzpMb2dWbyA9IG5ldyBMb2dWbyggTG9nLmtleUluZGV4ICwgdGV4dCAsIHRoaXNPYmplY3QgLCB0eXBlICwgbGV2ZWwgKTsgICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCBsb2dWby50b1N0cmluZygpICk7XHJcbiAgICAgICAgdGhpcy5sb2dNYXAuc2V0KCBsb2dWby5rZXkgLCBsb2dWbyApO1xyXG4gICAgICAgIExvZy5rZXlJbmRleCsrO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pi+56S66ZSZ6K+v5pel5b+XXHJcbiAgICAgKiBAcGFyYW0gdGhpc09iamVjdCBcclxuICAgICAqIEBwYXJhbSBhcmdzIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGVycm9yKCB0aGlzT2JqZWN0OmFueSAsIHRleHQ6c3RyaW5nICwgdHlwZTpzdHJpbmc9XCJcIiAsIGxldmVsOm51bWJlciA9MCApOnZvaWR7XHJcblxyXG4gICAgICAgIGlmKCB0eXBlID09IFwiXCIpe1xyXG4gICAgICAgICAgICB0eXBlID0gTG9nLlRZUEVfREVCVUc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0eXBlICYmIHRoaXMubm9zaG93TG9nVHlwZUxpc3QuaW5kZXhPZih0eXBlKSAhPSAtMSApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBsb2dWbzpMb2dWbyA9IG5ldyBMb2dWbyggTG9nLmtleUluZGV4ICwgdGV4dCAsIHRoaXNPYmplY3QgLCB0eXBlICwgbGV2ZWwgKTsgICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoIGxvZ1ZvLnRvU3RyaW5nKCkgKTtcclxuICAgICAgICB0aGlzLmxvZ01hcC5zZXQoIGxvZ1ZvLmtleSAsIGxvZ1ZvICk7XHJcbiAgICAgICAgTG9nLmtleUluZGV4Kys7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICog5pel5b+X5pWw5o2uXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjI1XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dWbyB7XHJcblxyXG4gICAgcHVibGljIGtleTphbnk7XHJcbiAgICAvKirml6Xlv5fnsbvlnosgKi9cclxuICAgIHB1YmxpYyB0eXBlOnN0cmluZztcclxuICAgIC8qKuaXpeW/l+aPj+i/sCAqL1xyXG4gICAgcHVibGljIHRleHQ6c3RyaW5nO1xyXG4gICAgLyoqdGhpc09iamVjdCDlr7nosaEgKi9cclxuICAgIHB1YmxpYyB0aGlzT2JqZWN0OmFueTtcclxuICAgIC8qKuaXpeW/l+etiee6pyAqL1xyXG4gICAgcHVibGljIGxldmVsOm51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoIGtleTphbnkgLCB0ZXh0OnN0cmluZyAsIHRoaXNPYmplY3Q6YW55ICwgdHlwZTpzdHJpbmcgPSBcIlwiICwgbGV2ZWw6bnVtYmVyID0gMCApIHtcclxuXHJcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICB0aGlzLnRoaXNPYmplY3QgPSB0aGlzT2JqZWN0O1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5sZXZlbCA9IGxldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOnN0cmluZ3tcclxuXHJcbiAgICAgICAgdmFyIGNsc05hbWU6IGFueSA9IHRoaXMudGhpc09iamVjdCA/IHRoaXMudGhpc09iamVjdC5uYW1lIDogXCJcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIFwiW1wiICsgdGhpcy50eXBlICsgXCJdXCIgKyBcIltcIiArIGNsc05hbWUgKyBcIl1cIiArIHRoaXMudGV4dCArIFwiICAgIFwiICsgbmV3IERhdGUoKS50b1RpbWVTdHJpbmcoKSArIFwiXCIgO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IExvZyBmcm9tIFwiLi4vbG9nL0xvZ1wiO1xyXG5cclxuLyoqXHJcbiAqIOS6i+S7tueuoeeQhuexu1xyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRNYW5hZ2VyIHtcclxuXHJcblx0cHJpdmF0ZSBzdGF0aWMgX2V2ZW50RGljdDogTGF5YS5XZWFrT2JqZWN0ID0gbnVsbDtcclxuXHJcblx0cHJpdmF0ZSBzdGF0aWMgX3RhcmdldE1hcDogTGF5YS5XZWFrT2JqZWN0ID0gbnVsbDtcclxuXHJcblx0cHVibGljIHN0YXRpYyBpbml0KCk6IHZvaWR7XHJcblxyXG5cdFx0dGhpcy5fZXZlbnREaWN0ID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG5cdFx0dGhpcy5fdGFyZ2V0TWFwID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog6Kem5Y+R5YWo5bGA5LqL5Lu2XHJcblx0ICogQHBhcmFtIHR5cGUg5LqL5Lu257G75Z6LXHJcblx0ICogQHBhcmFtIGFyZ3Mg5LqL5Lu25Y+C5pWwXHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyBkaXNwYXRjaEV2ZW50KCB0eXBlOiBzdHJpbmcsIC4uLmFyZ3MgKTp2b2lkIHtcclxuXHJcblx0XHRsZXQgZnVuY0xpc3Q6IEFycmF5PGFueT4gPSB0aGlzLl9ldmVudERpY3QuZ2V0KHR5cGUpO1xyXG5cdFx0aWYgKGZ1bmNMaXN0KSB7XHJcblx0XHRcdGxldCBsaXN0OiBBcnJheTxhbnk+ID0gZnVuY0xpc3QuY29uY2F0KCk7XHJcblx0XHRcdGxldCBsZW5ndGg6IG51bWJlciA9IGxpc3QubGVuZ3RoO1xyXG5cdFx0XHRpZiAobGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0TG9nLmxvZyggdGhpcyAsIFwi6LCD5bqm5LqL5Lu2OiBcIiArIHR5cGUpOy8v6LCD5bqm5LqL5Lu25Ye66ZSZLlxyXG5cdFx0XHRcdFx0XHQvLyBsaXN0W2ldWzBdLmFwcGx5KGxpc3RbaV1bMV0sIGFyZ3MpO1xyXG5cdFx0XHRcdFx0XHRsZXQgZnVuOkZ1bmN0aW9uID0gbGlzdFtpXVswXTtcclxuXHRcdFx0XHRcdFx0aWYoICBmdW4gIT0gbnVsbCApe1xyXG5cdFx0XHRcdFx0XHRcdGZ1bi5hcHBseShsaXN0W2ldWzFdLCBhcmdzKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdFx0TG9nLmVycm9yKCB0aGlzICwgXCLosIPluqbkuovku7blh7rplJkuXCIrZS50b1N0cmluZygpICk7Ly/osIPluqbkuovku7blh7rplJkuXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDmt7vliqDkuovku7bmlrnms5VcclxuXHQgKiBAcGFyYW0gdHlwZSDkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW0gbGlzdGVuZXIg5LqL5Lu25pa55rOVXHJcblx0ICogQHBhcmFtIHRoaXNPYmplY3RcclxuXHQgKiBAcGFyYW0gdGFyZ2V0IOebkeWQrOS6i+S7tuWvueixoe+8jOS4uuepuuWImeebkeWQrOWFqOWxgOS6i+S7tlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgYWRkRXZlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiwgdGhpc09iamVjdDogYW55LCB0YXJnZXQ6IExheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCk6IHZvaWQge1xyXG5cclxuXHRcdGxldCBmdW5jTGlzdDogQXJyYXk8YW55PiA9IG51bGw7XHJcblx0XHRpZiAodGFyZ2V0ID09IG51bGwpIHtcclxuXHRcdFx0ZnVuY0xpc3QgPSA8YW55PkV2ZW50TWFuYWdlci5fZXZlbnREaWN0LmdldCh0eXBlKTtcclxuXHRcdFx0aWYgKCFmdW5jTGlzdCkge1xyXG5cdFx0XHRcdGZ1bmNMaXN0ID0gbmV3IEFycmF5PGFueT4oKTtcclxuXHRcdFx0XHRFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5zZXQodHlwZSwgZnVuY0xpc3QpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghRXZlbnRNYW5hZ2VyLmhhc0V2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHRoaXNPYmplY3QpKSB7XHJcblx0XHRcdFx0ZnVuY0xpc3QucHVzaChbbGlzdGVuZXIsIHRoaXNPYmplY3RdKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZnVuY0xpc3QgPSBFdmVudE1hbmFnZXIuZ2V0TGlzdGVuZXJMaXN0KCB0YXJnZXQgKTtcclxuXHRcdFx0aWYoICFFdmVudE1hbmFnZXIuaGFzTGlzdGVuZXJPZiggdHlwZSAsIGxpc3RlbmVyICwgdGFyZ2V0ICkgKXsgLy/lpoLmnpzmsqHmnInnm5HlkKzor6Xkuovku7bvvIzpgb/lhY3ph43lpI3nm5HlkKxcclxuXHRcdFx0XHR2YXIgb2JqOiBPYmplY3QgPSBuZXcgT2JqZWN0KCk7XHJcblx0XHRcdFx0b2JqW1widHlwZVwiXSA9IHR5cGU7XHJcblx0XHRcdFx0b2JqW1wibGlzdGVuZXJcIl0gPSBsaXN0ZW5lcjtcclxuXHRcdFx0XHRvYmpbXCJ0aGlzT2JqZWN0XCJdID0gdGhpc09iamVjdDtcclxuXHRcdFx0XHRmdW5jTGlzdCA9IGZ1bmNMaXN0IHx8IFtdO1xyXG5cdFx0XHRcdGZ1bmNMaXN0LnB1c2gob2JqKTtcclxuXHRcdFx0XHQvLyB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdGhpc09iamVjdCk7XHJcblx0XHRcdFx0dGFyZ2V0Lm9uKCB0eXBlICwgdGhpc09iamVjdCAsIGxpc3RlbmVyICk7XHJcblx0XHRcdH1cdFx0XHRcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOenu+mZpOS6i+S7tuebkeWQrFxyXG5cdCAqIEBwYXJhbSB0eXBlIOS6i+S7tuexu+Wei1xyXG5cdCAqIEBwYXJhbSBsaXN0ZW5lciDkuovku7bmlrnms5VcclxuXHQgKiBAcGFyYW0gdGhpc09iamVjdFxyXG5cdCAqIEBwYXJhbSB0YXJnZXQg55uR5ZCs5LqL5Lu25a+56LGh77yM5Li656m65YiZ55uR5ZCs5YWo5bGA5LqL5Lu2IFxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiwgdGhpc09iamVjdDogYW55LCB0YXJnZXQ6IExheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCk6IHZvaWQge1xyXG5cdFx0XHJcblx0XHRsZXQgZnVuY0xpc3Q6IEFycmF5PGFueT4gPSBudWxsO1xyXG5cdFx0aWYoIHRhcmdldCA9PSBudWxsICl7IC8v5YWo5bGA5LqL5Lu2XHJcblx0XHRcdGZ1bmNMaXN0ID0gPGFueT5FdmVudE1hbmFnZXIuX2V2ZW50RGljdC5nZXQodHlwZSk7XHJcblx0XHRcdGlmIChmdW5jTGlzdCkge1xyXG5cdFx0XHRcdGxldCBsZW5ndGg6IG51bWJlciA9IGZ1bmNMaXN0Lmxlbmd0aDtcclxuXHRcdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChmdW5jTGlzdFtpXVswXSA9PSBsaXN0ZW5lciAmJiBmdW5jTGlzdFtpXVsxXSA9PSB0aGlzT2JqZWN0KSB7XHJcblx0XHRcdFx0XHRcdGZ1bmNMaXN0LnNwbGljZShpLCAxKTtcclxuXHRcdFx0XHRcdFx0aWYgKGZ1bmNMaXN0Lmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0RXZlbnRNYW5hZ2VyLl9ldmVudERpY3Quc2V0KHR5cGUsIG51bGwpO1xyXG5cdFx0XHRcdFx0XHRcdEV2ZW50TWFuYWdlci5fZXZlbnREaWN0LmRlbCh0eXBlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRmdW5jTGlzdCA9IEV2ZW50TWFuYWdlci5nZXRMaXN0ZW5lckxpc3QoIHRhcmdldCApO1xyXG5cdFx0XHR2YXIgb2JqOiBPYmplY3Q7XHJcbiAgICAgICAgICAgIGlmIChmdW5jTGlzdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jTGlzdC5mb3JFYWNoKChvYmopID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqLnR5cGUgPT0gdHlwZSAmJiBvYmoubGlzdGVuZXIgPT0gbGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY0xpc3Quc3BsaWNlKGZ1bmNMaXN0LmluZGV4T2Yob2JqKSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cdFx0XHQvLyB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdGhpc09iamVjdCk7XHJcblx0XHRcdHRhcmdldC5vZmYoIHR5cGUgLCB0aGlzT2JqZWN0ICwgbGlzdGVuZXIgKTtcclxuXHRcdH1cdFx0XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDnm5HlkKzkuovku7bliJfooahcclxuXHQgKiBAcGFyYW0gdGFyZ2V0IOS6i+S7tuWvueixoVxyXG5cdCAqKi9cclxuXHRwdWJsaWMgc3RhdGljIGdldExpc3RlbmVyTGlzdCggdGFyZ2V0OkxheWEuRXZlbnREaXNwYXRjaGVyICk6IEFycmF5PE9iamVjdD4ge1xyXG5cclxuXHRcdGxldCBmdW5jTGlzdDpBcnJheTxPYmplY3Q+ID0gbnVsbDtcclxuXHRcdGlmKCB0YXJnZXQgKXtcclxuXHRcdFx0ZnVuY0xpc3QgPSBFdmVudE1hbmFnZXIuX3RhcmdldE1hcC5nZXQodGFyZ2V0KTtcclxuXHRcdFx0aWYgKGZ1bmNMaXN0ID09IG51bGwpIHtcclxuXHRcdFx0XHRmdW5jTGlzdCA9IFtdO1xyXG5cdFx0XHRcdEV2ZW50TWFuYWdlci5fdGFyZ2V0TWFwLnNldCh0YXJnZXQsIGZ1bmNMaXN0KTtcclxuXHRcdFx0fVxyXG5cdFx0fVx0XHRcclxuXHRcdHJldHVybiBmdW5jTGlzdDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOenu+mZpOaJgOacieebkeWQrOS6i+S7tlxyXG5cdCAqIEBwYXJhbSB0YXJnZXQg5Li656m65YiZ56e76Zmk5omA5pyJ5YWo5bGA5LqL5Lu277yM5ZCm5YiZ56e76Zmk5a+55bqU55qE5a+56LGh55qE5omA5pyJ5LqL5Lu2XHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyByZW1vdmVBbGxMaXN0ZW5lcnMoIHRhcmdldDpMYXlhLkV2ZW50RGlzcGF0Y2hlciA9IG51bGwgKTp2b2lke1xyXG5cclxuXHRcdGlmKCB0YXJnZXQgPT0gbnVsbCApe1xyXG5cdFx0XHRFdmVudE1hbmFnZXIucmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcigpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGxldCBsaXN0OkFycmF5PE9iamVjdD4gPSBFdmVudE1hbmFnZXIuZ2V0TGlzdGVuZXJMaXN0KCB0YXJnZXQgKTtcclxuXHRcdFx0dmFyIG9iajogT2JqZWN0O1xyXG4gICAgICAgICAgICB3aGlsZSAobGlzdCAmJiBsaXN0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIG9iaiA9IGxpc3Quc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIob2JqW1widHlwZVwiXSwgb2JqW1wibGlzdGVuZXJcIl0sIG9ialtcInRoaXNPYmplY3RcIl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDnp7vpmaTmiYDmnInlhajlsYDkuovku7ZcclxuXHQgKi9cclxuXHRwcml2YXRlIHN0YXRpYyByZW1vdmVBbGxFdmVudExpc3RlbmVyKCkge1xyXG5cdFx0Ly8gZm9yIChsZXQgZm9yaW5sZXRfXyBpbiBFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5tYXApIHtcclxuXHRcdC8vIFx0bGV0IHR5cGUgPSBFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5tYXBbZm9yaW5sZXRfX11bMF07XHJcblx0XHQvLyBcdEV2ZW50TWFuYWdlci5yZW1vdmVFdmVudExpc3RlbmVycyh0eXBlKTtcclxuXHRcdC8vIH1cclxuXHRcdGZvciggbGV0IGtleSBpbiBFdmVudE1hbmFnZXIuX2V2ZW50RGljdCApe1xyXG5cdFx0XHRsZXQgdHlwZTphbnkgPSBFdmVudE1hbmFnZXIuX2V2ZW50RGljdFsga2V5IF07XHJcblx0XHRcdEV2ZW50TWFuYWdlci5yZW1vdmVFdmVudExpc3RlbmVycyggdHlwZSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog56e76Zmk5omA5pyJ5a+55bqU57G75Z6L5LqL5Lu255uR5ZCsXHJcblx0ICogQHBhcmFtIHR5cGUg5LqL5Lu257G75Z6LXHJcblx0ICogQHBhcmFtIFxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoIHR5cGU6IHN0cmluZyA9IG51bGwgKSB7XHJcblx0XHRpZiAodHlwZSAhPSBudWxsKSB7XHJcblx0XHRcdGlmIChFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5nZXQodHlwZSkgIT0gbnVsbCkge1xyXG5cdFx0XHRcdEV2ZW50TWFuYWdlci5fZXZlbnREaWN0LnNldCh0eXBlLCBudWxsKTtcclxuXHRcdFx0XHRFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5kZWwodHlwZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRFdmVudE1hbmFnZXIucmVtb3ZlQWxsRXZlbnRMaXN0ZW5lcigpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog5piv5ZCm5pyJ5a+55bqU5LqL5Lu255qE55uR5ZCs5LqL5Lu2XHJcblx0ICogQHBhcmFtXHR0eXBlICAgICAgXHTkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW1cdGxpc3RlbmVyICBcdOS6i+S7tuaWueazlVxyXG5cdCAqIEBwYXJhbSBcdHRhcmdldFx0XHTnm5HlkKzlr7nosaFcclxuXHQgKiBAcGFyYW0gXHR0aGlzT2JqZWN0XHJcblx0ICogQHJldHVyblxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgaGFzTGlzdGVuZXJPZih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiA9IG51bGwsIHRhcmdldDogTGF5YS5FdmVudERpc3BhdGNoZXIgPSBudWxsLCB0aGlzT2JqZWN0OiBhbnkgPSBudWxsKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0aWYgKHRhcmdldCA9PSBudWxsKSB7XHJcblx0XHRcdGxldCBmdW5jTGlzdDogQXJyYXk8YW55PiA9IEV2ZW50TWFuYWdlci5fdGFyZ2V0TWFwLmdldCh0YXJnZXQpO1xyXG5cdFx0XHR2YXIgb2JqOiBPYmplY3Q7XHJcblx0XHRcdGZvciAob2JqIG9mIGZ1bmNMaXN0KSB7XHJcblx0XHRcdFx0aWYgKG9iaiAmJiBvYmpbXCJ0eXBlXCJdID09IHR5cGUgJiYgKG9ialtcImxpc3RlbmVyXCJdID09IGxpc3RlbmVyIHx8IGxpc3RlbmVyID09IG51bGwpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBFdmVudE1hbmFnZXIuaGFzRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdGhpc09iamVjdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog5piv5ZCm5pyJ5a+55bqU55qE5YWo5bGA55uR5ZCs5LqL5Lu2XHJcblx0ICogQHBhcmFtXHR0eXBlICAgICAgXHTkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW1cdGxpc3RlbmVyICBcdOS6i+S7tuaWueazlVxyXG5cdCAqIEBwYXJhbSBcdHRoaXNPYmplY3RcclxuXHQgKiBAcmV0dXJuXHJcblx0ICovXHJcblx0cHJpdmF0ZSBzdGF0aWMgaGFzRXZlbnRMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiA9IG51bGwsIHRoaXNPYmplY3Q6IGFueSA9IG51bGwpOiBib29sZWFuIHtcclxuXHRcdGxldCBib29sOiBib29sZWFuID0gZmFsc2U7XHJcblx0XHRsZXQgZnVuY0xpc3Q6IEFycmF5PGFueT4gPSA8YW55PkV2ZW50TWFuYWdlci5fZXZlbnREaWN0LmdldCh0eXBlKTtcclxuXHRcdGlmICghZnVuY0xpc3QgfHwgZnVuY0xpc3QubGVuZ3RoID09IDApIHtcclxuXHRcdFx0Ym9vbCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGlmIChsaXN0ZW5lciA9PSBudWxsKSB7XHJcblx0XHRcdFx0Ym9vbCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0ZnVuY0xpc3QuZm9yRWFjaChlbGVtZW50ID0+IHtcclxuXHRcdFx0XHRcdGlmIChlbGVtZW50WzBdID09IGxpc3RlbmVyICYmIGVsZW1lbnRbMV0gPT0gdGhpc09iamVjdCkge1xyXG5cdFx0XHRcdFx0XHRib29sID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGJvb2w7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBib29sO1xyXG5cdH1cclxufSIsIi8qKlxyXG4gICog5YWs55So57G7XHJcbiAgKiBAYXV0aG9yIGNsIDIwMTguNC4yN1xyXG4gICovXHJcbmV4cG9ydCBjbGFzcyBDb21tb25VdGlscyB7XHJcblx0XHJcblx0LyoqXHJcblx0ICAqIOiOt+WPluWIhumhtemhteaVsFxyXG5cdCAgKiBAcGFyYW1cdGFyciAgIOimgeWIhumhteeahOaVsOe7hFxyXG5cdCAgKiBAcGFyYW1cdGl0ZW1zIOWIhumhteadoeebruaVsFxyXG5cdCAgKiBAcmV0dXJuXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgZ2V0UGFnZXMoYXJyOiBBcnJheTxhbnk+LCBpdGVtczogbnVtYmVyID0gNSk6IG51bWJlciB7XHJcblxyXG5cdFx0dmFyIHBhZ2VzOiBudW1iZXIgPSAwO1xyXG5cdFx0aWYgKGFyciAmJiBhcnIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRwYWdlcyA9IChhcnIubGVuZ3RoICUgaXRlbXMpID4gMCA/IHBhcnNlSW50KFwiXCIgKyAoYXJyLmxlbmd0aCAvIGl0ZW1zKSkgKyAxIDogcGFyc2VJbnQoXCJcIiArIChhcnIubGVuZ3RoIC8gaXRlbXMpKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHBhZ2VzID0gMDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBwYWdlcyB8fCAxO1xyXG5cdH1cclxuXHJcblx0LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuXHQgICog5oyJ54WnYXJy55qE5pWw57uE6L+b6KGM5YiG6aG15aSE55CGXHJcblx0ICAqIGFyciA9IFswLDEsMiwzLDQsNSw2XSxwYWdl5Li65b2T5YmN6aG177yMaXRlbXPkuLrmr4/pobXnmoTmnaHmlbBcclxuXHQgICog6aG15pWw5LuOMeW8gOWni1xyXG5cdCAgKiBAcGFyYW0gYXJyICAg6KaB5YiG5Ymy55qE5pWw57uEXHJcblx0ICAqIEBwYXJhbSBwYWdlICDlvZPliY3pobXmlbBcclxuXHQgICogQHBhcmFtIGl0ZW1zIOavj+mhtemhteaVsOadoeebrlxyXG5cdCAgKi9cclxuXHRwdWJsaWMgc3RhdGljIGdldFBhZ2VMaXN0KGFycjogQXJyYXk8YW55PiwgcGFnZTogbnVtYmVyID0gMSwgaXRlbXM6IG51bWJlciA9IDUpOiBBcnJheTxhbnk+IHtcclxuXHJcblx0XHR2YXIgbmV3QXJyOiBBcnJheTxhbnk+ID0gbmV3IEFycmF5O1xyXG5cdFx0LypcclxuXHRcdCog5qC55o2u5b2T5YmN5pWw57uE6ZW/5bqm5b6X5Yiw5oC76aG15pWwXHJcblx0XHQqL1xyXG5cdFx0dmFyIHBhZ2VzOiBudW1iZXIgPSAwO1xyXG5cdFx0aWYgKGFyci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHBhZ2VzID0gKGFyci5sZW5ndGggJSBpdGVtcykgPiAwID8gcGFyc2VJbnQoXCJcIiArIChhcnIubGVuZ3RoIC8gaXRlbXMpKSArIDEgOiBwYXJzZUludChcIlwiICsgKGFyci5sZW5ndGggLyBpdGVtcykpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cGFnZXMgPSAwO1xyXG5cdFx0XHRyZXR1cm4gbmV3QXJyO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHBhZ2UgPiBwYWdlcykge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbWluOiBudW1iZXIgPSAocGFnZSAtIDEpICogaXRlbXM7XHJcblx0XHR2YXIgbWF4OiBudW1iZXIgPSBwYWdlICogaXRlbXM7XHJcblx0XHRpZiAocGFyc2VJbnQoXCJcIiArIChhcnIubGVuZ3RoICUgaXRlbXMpKSA9PSAwKSB7XHJcblx0XHRcdG1heCA9IHBhZ2UgKiBpdGVtcztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG1heCA9IHBhZ2UgPT0gcGFnZXMgPyAocGFnZSAtIDEpICogaXRlbXMgKyBwYXJzZUludChcIlwiICsgKGFyci5sZW5ndGggJSBpdGVtcykpIDogcGFnZSAqIGl0ZW1zO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGk6IG51bWJlciA9IG1pbjsgaSA8IG1heDsgaSsrKSB7XHJcblx0XHRcdG5ld0Fyci5wdXNoKGFycltpXSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbmV3QXJyO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBnZXRRdWFsaWZpZWRDbGFzc05hbWUodmFsdWUpOnN0cmluZyB7XHJcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSB8fCAodHlwZSAhPSBcIm9iamVjdFwiICYmICF2YWx1ZS5wcm90b3R5cGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcHJvdG90eXBlID0gdmFsdWUucHJvdG90eXBlID8gdmFsdWUucHJvdG90eXBlIDogT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcclxuICAgICAgICBpZiAocHJvdG90eXBlLmhhc093blByb3BlcnR5KFwiX19jbGFzc19fXCIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm90b3R5cGVbXCJfX2NsYXNzX19cIl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjb25zdHJ1Y3RvclN0cmluZyA9IHByb3RvdHlwZS5jb25zdHJ1Y3Rvci50b1N0cmluZygpLnRyaW0oKTtcclxuICAgICAgICB2YXIgaW5kZXggPSBjb25zdHJ1Y3RvclN0cmluZy5pbmRleE9mKFwiKFwiKTtcclxuICAgICAgICB2YXIgY2xhc3NOYW1lID0gY29uc3RydWN0b3JTdHJpbmcuc3Vic3RyaW5nKDksIGluZGV4KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG90eXBlLCBcIl9fY2xhc3NfX1wiLCB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBjbGFzc05hbWUsXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBjbGFzc05hbWU7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICog6Z2i5p2/5rOo5YaMIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFuZWxSZWdpc3RlciB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHBrZ05hbWUg5piv5ZCm5bey5rOo5YaM6LWE5rqQ5YyFXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaGFzUmVnaXN0ZXJDbGFzcyggcGtnTmFtZTpzdHJpbmcgKTpib29sZWFue1xyXG5cclxuICAgICAgICByZXR1cm4gcGtnTmFtZSAmJiAhZmFpcnlndWkuVUlQYWNrYWdlLmdldEJ5SWQoXCJyZXMvZmFpcnVpL1wiK3BrZ05hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5rOo5YaM57uE5Lu257G75LiOZmFpcnlndWnnvJbovpHlmajkuK3nsbvlr7nlupRcclxuICAgICAqIEBwYXJhbSBwa2dOYW1lIOWMheWQjVxyXG4gICAgICogQHBhcmFtIHJlc05hbWUg6LWE5rqQ5ZCNXHJcbiAgICAgKiBAcGFyYW0gY2xzXHQgIOWvueW6lOWMheS4reexu+WQjVx0LOS4um51bGzliJnlj6rms6jlhozotYTmupDljIVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWdpc3RlckNsYXNzKHBrZ05hbWU6IHN0cmluZywgcmVzTmFtZTogc3RyaW5nID0gXCJcIiAsIGNsczogYW55ID0gbnVsbCApOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKHBrZ05hbWUgJiYgIWZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRCeUlkKFwicmVzL2ZhaXJ1aS9cIitwa2dOYW1lKSkge1xyXG4gICAgICAgICAgICBmYWlyeWd1aS5VSVBhY2thZ2UuYWRkUGFja2FnZShcInJlcy9mYWlydWkvXCIrcGtnTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCBjbHMgKXtcclxuICAgICAgICAgICAgbGV0IHVybDogc3RyaW5nID0gZmFpcnlndWkuVUlQYWNrYWdlLmdldEl0ZW1VUkwocGtnTmFtZSwgcmVzTmFtZSk7XHJcbiAgICAgICAgICAgIGZhaXJ5Z3VpLlVJT2JqZWN0RmFjdG9yeS5zZXRQYWNrYWdlSXRlbUV4dGVuc2lvbih1cmwsIGNscyk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7roh6rlrprkuYlmYWlyeWd1aee7hOS7tu+8jOW/hemhu+eUqOatpOaWueW8jyzkuI7ku6XkuIrmlrnms5Xlr7nlupTkvb/nlKgs5LiN6IO955u05o6l5L2/55SobmV3IGNscygp55qE5pa55byP5Yib5bu65LiA5Liq57uR5a6aZmFpcnlndWnnmoTnsbvvvIFcclxuICAgICAqIEBwYXJhbSBwa2dOYW1lIOWMheWQjVxyXG4gICAgICogQHBhcmFtIHJlc05hbWUg6LWE5rqQ5ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlR09iamVjdChwa2dOYW1lOiBzdHJpbmcsIHJlc05hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIGZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3RGcm9tVVJMKGZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRJdGVtVVJMKHBrZ05hbWUsIHJlc05hbWUpKTtcclxuICAgIH1cclxufSIsImltcG9ydCBQYW5lbFJlZ2lzdGVyIGZyb20gXCIuLi9QYW5lbFJlZ2lzdGVyXCI7XHJcbmltcG9ydCBFQnV0dG9uIGZyb20gXCIuLi92aWV3L2NvbXBvbmVudC9FQnV0dG9uXCI7XHJcbmltcG9ydCBCYXNlU3ByaXRlIGZyb20gXCIuLi92aWV3L2NvbXBvbmVudC9CYXNlU3ByaXRlXCI7XHJcbmltcG9ydCBMb2cgZnJvbSBcIi4uLy4uL2NvbS9sb2cvTG9nXCI7XHJcbmltcG9ydCB7IEJhc2VQYW5lbCB9IGZyb20gXCIuLi92aWV3L0Jhc2VQYW5lbFwiO1xyXG5pbXBvcnQgeyBDb21tb25VdGlscyB9IGZyb20gXCIuLi8uLi9jb20vdXRpbHMvQ29tbW9uVXRpbHNcIjtcclxuXHJcbi8qKlxyXG4gKiBGYWlyeWd1aeeuoeeQhlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmFpcnlVSU1hbmFnZXIge1xyXG5cclxuICAgIC8qKuijhei9vSAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcGFyZW50OiBMYXlhLlNwcml0ZSA9IG51bGw7XHJcblxyXG4gICAgLyoq5Li755WM6Z2i5bGCICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG1haW5MYXllcjogQmFzZVNwcml0ZTtcclxuICAgIC8qKueVjOmdouWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB3aW5kb3dMYXllcjogQmFzZVNwcml0ZTtcclxuICAgIC8qKiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBwcm9tcHRMYXllcjogQmFzZVNwcml0ZTtcclxuICAgIC8qKuW8ueahhuWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhbGVydExheWVyOiBCYXNlU3ByaXRlO1xyXG4gICAgLyoq6aG25bGCICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvcExheWVyOiBCYXNlU3ByaXRlO1xyXG4gICAgLyoqdGlw5bGCICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRpcExheWVyOiBCYXNlU3ByaXRlID0gbnVsbDtcclxuICAgIC8qKuW8leWvvOWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBndWlkZUxheWVyOiBCYXNlU3ByaXRlID0gbnVsbDtcclxuXHJcbiAgICAvKirlvZPliY3miZPlvIDnmoTpnaLmnb8gKi9cclxuICAgIHByaXZhdGUgc3RhdGljIF9vcGVuZWRWaWV3czpMYXlhLldlYWtPYmplY3QgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXQoIGNvbnRhaW5lcjpMYXlhLlNwcml0ZSApOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYoICF0aGlzLnBhcmVudCApe1x0XHRcdFx0XHJcbiAgICAgICAgICAgIEZhaXJ5VUlNYW5hZ2VyLm1haW5MYXllciA9IG5ldyBCYXNlU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIEZhaXJ5VUlNYW5hZ2VyLndpbmRvd0xheWVyID0gbmV3IEJhc2VTcHJpdGUoKTtcclxuICAgICAgICAgICAgRmFpcnlVSU1hbmFnZXIucHJvbXB0TGF5ZXIgPSBuZXcgQmFzZVNwcml0ZSgpO1xyXG4gICAgICAgICAgICBGYWlyeVVJTWFuYWdlci50b3BMYXllciA9IG5ldyBCYXNlU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIEZhaXJ5VUlNYW5hZ2VyLmFsZXJ0TGF5ZXIgPSBuZXcgQmFzZVNwcml0ZSgpO1xyXG4gICAgICAgICAgICBGYWlyeVVJTWFuYWdlci50aXBMYXllciA9IG5ldyBCYXNlU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIEZhaXJ5VUlNYW5hZ2VyLmd1aWRlTGF5ZXIgPSBuZXcgQmFzZVNwcml0ZSgpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCggZmFpcnlndWkuR1Jvb3QuaW5zdC5kaXNwbGF5T2JqZWN0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRhaW5lci5hZGRDaGlsZChmYWlyeWd1aS5HUm9vdC5pbnN0LmRpc3BsYXlPYmplY3QpO1xyXG4gICAgICAgIHRoaXMucGFyZW50ID0gY29udGFpbmVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoRmFpcnlVSU1hbmFnZXIubWFpbkxheWVyKTtcclxuICAgICAgICBmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKEZhaXJ5VUlNYW5hZ2VyLndpbmRvd0xheWVyKTtcclxuICAgICAgICBmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKEZhaXJ5VUlNYW5hZ2VyLnByb21wdExheWVyKTtcclxuICAgICAgICBmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKEZhaXJ5VUlNYW5hZ2VyLmFsZXJ0TGF5ZXIpO1xyXG4gICAgICAgIGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoRmFpcnlVSU1hbmFnZXIudG9wTGF5ZXIpO1x0XHRcdFxyXG4gICAgICAgIGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoRmFpcnlVSU1hbmFnZXIudGlwTGF5ZXIpO1xyXG4gICAgICAgIGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoRmFpcnlVSU1hbmFnZXIuZ3VpZGVMYXllcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmiZPlvIDpnaLmnb9cclxuICAgICAqIEBwYXJhbSBjbHMgICDpnaLmnb/nsbtcclxuICAgICAqIEBwYXJhbSBkYXRhICDlhbbku5bmlbDmja5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBvcGVuKCBjbHM6YW55ICwgZGF0YTphbnkgPSBudWxsICk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYodGhpcy5fb3BlbmVkVmlld3M9PW51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLl9vcGVuZWRWaWV3cyA9IG5ldyBMYXlhLldlYWtPYmplY3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIGNscyAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgIGxldCB2aWV3OmFueSA9IG5ldyBjbHMoKTtcclxuICAgICAgICAgICAgICAgIGlmKCB2aWV3IGluc3RhbmNlb2YgQmFzZVBhbmVsICl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmlldy5sb2FkKCBkYXRhICk7ICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmlldy5zaG93KCBkYXRhICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIHZpZXcucGFuZWxWby5pc05vcm1hbCApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndpbmRvd0xheWVyLmFkZENoaWxkKCB2aWV3ICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3BlbmVkVmlld3Muc2V0KCB2aWV3LnBhbmVsVm8uY2xzTmFtZSAsIHZpZXcgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWNhdGNoKGUpe1xyXG4gICAgICAgICAgICAgICAgTG9nLmVycm9yKCB0aGlzICwgXCLlrp7liJfpnaLmnb/lpLHotKXvvIFcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhbPpl63nlYzpnaJcclxuICAgICAqIEBwYXJhbSBjbHMg6Z2i5p2/57G7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY2xvc2UoIGNsczphbnkgKTp2b2lke1xyXG5cclxuICAgICAgICBpZihjbHMgIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGxldCBjbHNOYW1lOnN0cmluZyA9IENvbW1vblV0aWxzLmdldFF1YWxpZmllZENsYXNzTmFtZSggY2xzICk7XHJcbiAgICAgICAgICAgIGxldCB2aWV3OkJhc2VQYW5lbCA9IHRoaXMuX29wZW5lZFZpZXdzLmdldCggY2xzTmFtZSApO1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlUGFuZWwoIHZpZXcgKTtcclxuICAgICAgICB9ICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY2xvc2VQYW5lbCggdmlldzphbnkgKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggdmlldyBpbnN0YW5jZW9mIEJhc2VQYW5lbCApeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9vcGVuZWRWaWV3cy5kZWwoIHZpZXcucGFuZWxWby5jbHNOYW1lICk7XHJcbiAgICAgICAgICAgIHZpZXcuY2xlYXIoKTtcclxuICAgICAgICAgICAgaWYodmlldy5wYXJlbnQhPW51bGwpe1xyXG4gICAgICAgICAgICAgICAgdmlldy5wYXJlbnQucmVtb3ZlQ2hpbGQodmlldyk7XHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEZhaXJ5VUlNYW5hZ2VyO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBGYWlyeVVJTWFuYWdlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlIHx8IG5ldyBGYWlyeVVJTWFuYWdlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQmFzZVBhbmVsIH0gZnJvbSBcIi4uL3ZpZXcvQmFzZVBhbmVsXCI7XHJcbmltcG9ydCBFQnV0dG9uIGZyb20gXCIuLi92aWV3L2NvbXBvbmVudC9FQnV0dG9uXCI7XHJcbmltcG9ydCBMb2cgZnJvbSBcIi4uLy4uL2NvbS9sb2cvTG9nXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVSUdNVmlldyBleHRlbmRzIEJhc2VQYW5lbCB7XHJcblxyXG4gICAgcHJpdmF0ZSBidG5fcGxheTpFQnV0dG9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCBcImNvbW1vblwiICwgXCJVSUdNVmlld1wiICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZEFsbExpc3RlbmVyKCk6dm9pZHtcclxuXHJcbiAgICAgICAgc3VwZXIuYWRkQWxsTGlzdGVuZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRHYW1lTGlzdGVuZXIoIExheWEuRXZlbnQuQ0xJQ0sgLCB0aGlzLmNsaWNrUGxheUJ0bkhhbmRsZXIgLCB0aGlzICwgdGhpcy5idG5fcGxheSApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVBbGxMaXN0ZW5lcigpOnZvaWR7XHJcblxyXG4gICAgICAgIHN1cGVyLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGlja1BsYXlCdG5IYW5kbGVyKCBlOkxheWEuRXZlbnQgKTp2b2lke1xyXG5cclxuICAgICAgICBMb2cubG9nKCB0aGlzICwgXCLngrnlh7vmkq3mlL7mjInpkq5cIik7XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IHsgQmFzZVBhbmVsIH0gZnJvbSBcIi4uL3ZpZXcvQmFzZVBhbmVsXCI7XHJcbmltcG9ydCBFQnV0dG9uIGZyb20gXCIuLi92aWV3L2NvbXBvbmVudC9FQnV0dG9uXCI7XHJcbmltcG9ydCBGYWlyeVVJTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlci9GYWlyeVVJTWFuYWdlclwiO1xyXG5pbXBvcnQgVUlHTVZpZXcgZnJvbSBcIi4vVUlHTVZpZXdcIjtcclxuXHJcbi8qKlxyXG4gKiDkuLvnlYzpnaJcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjYuOVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVUlNYWluVmlldyBleHRlbmRzIEJhc2VQYW5lbCB7XHJcblxyXG4gICAgcHJpdmF0ZSBidG5fZ206RUJ1dHRvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoXCJtYWluXCIsXCJVSU1haW5WaWV3XCIpOyBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdFVJKCk6dm9pZHtcclxuXHJcbiAgICAgICAgc3VwZXIuaW5pdFVJKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZEFsbExpc3RlbmVyKCk6dm9pZHtcclxuXHJcbiAgICAgICAgc3VwZXIuYWRkQWxsTGlzdGVuZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRHYW1lTGlzdGVuZXIoIExheWEuRXZlbnQuQ0xJQ0sgLCB0aGlzLmNsaWNrR21IYW5kbGVyICwgdGhpcyAsIHRoaXMuYnRuX2dtICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUFsbExpc3RlbmVyKCk6dm9pZHtcclxuXHJcbiAgICAgICAgc3VwZXIucmVtb3ZlQWxsTGlzdGVuZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsaWNrR21IYW5kbGVyKCBlOkxheWEuRXZlbnQgKTp2b2lke1xyXG5cclxuICAgICAgICBGYWlyeVVJTWFuYWdlci5vcGVuKCBVSUdNVmlldyApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhcigpOnZvaWR7XHJcblxyXG4gICAgICAgIHN1cGVyLmNsZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3Bvc2UoKTp2b2lke1xyXG5cclxuICAgICAgICBzdXBlci5kaXNwb3NlKCk7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICogRmFpcnlHVUnnurnnkIbpm4blpITnkIblt6XlhbfnsbtcclxuICogQGF1dGhvciBjbCAyMDE5LjIuMjBcclxuICovXHJcbmV4cG9ydCBjbGFzcyBGYWlyeVRleHR1cmVVdGlscyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5botYTmupDlnLDlnYBcclxuICAgICAqIEBwYXJhbSBwa2dOYW1lICAg5YyF5ZCNXHJcbiAgICAgKiBAcGFyYW0gcmVzTmFtZSAgIOi1hOa6kOWQjVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFVybChwa2dOYW1lOiBzdHJpbmcsIHJlc05hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIGxldCB1cmw6IHN0cmluZyA9IGZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRJdGVtVVJMKHBrZ05hbWUsIHJlc05hbWUpO1xyXG4gICAgICAgIHJldHVybiB1cmw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5ZGYWlyeei1hOa6kOWMhemHjOeahOWbvueJh+i1hOa6kFxyXG4gICAgICogQHBhcmFtIHBrZ05hbWUgICDljIXlkI1cclxuICAgICAqIEBwYXJhbSByZXNOYW1lICAg6LWE5rqQ5ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VGV4dHVyZUJ5KHBrZ05hbWU6IHN0cmluZywgcmVzTmFtZTogc3RyaW5nKTogTGF5YS5UZXh0dXJlIHtcclxuXHJcbiAgICAgICAgbGV0IHVybDogc3RyaW5nID0gZmFpcnlndWkuVUlQYWNrYWdlLmdldEl0ZW1VUkwocGtnTmFtZSwgcmVzTmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGV4dHVyZSh1cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qC55o2uRmFpcnlndWnnmoRVUkzlnLDlnYDojrflj5blr7nlupTnurnnkIZcclxuICAgICAqIEBwYXJhbSB1aVVybCAgICAg5aaCdWk6Ly9xNGV2bHdjamRtb2MyaVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFRleHR1cmUodXJsOiBzdHJpbmcpOiBMYXlhLlRleHR1cmUge1xyXG5cclxuICAgICAgICBsZXQgaXRlbTogZmFpcnlndWkuUGFja2FnZUl0ZW0gPSBmYWlyeWd1aS5VSVBhY2thZ2UuZ2V0SXRlbUJ5VVJMKHVybCk7XHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgaXRlbS5sb2FkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtID8gaXRlbS50ZXh0dXJlIDogbnVsbDtcclxuICAgIH1cclxufSIsImltcG9ydCBCYXNlU3ByaXRlIGZyb20gXCIuLi92aWV3L2NvbXBvbmVudC9CYXNlU3ByaXRlXCI7XHJcbi8vIGltcG9ydCB7IEVHTGlzdCB9IGZyb20gXCIuLi92aWV3L2NvbXBvbmVudC9FR0xpc3RcIjtcclxuXHJcbi8qKlxyXG4gKiBGYWlyeUdVSeW3peWFt1xyXG4gKiBAYXV0aG9yIGNsIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEZhaXJ5VXRpbHMge1xyXG5cclxuXHQvKipcclxuXHQgICog5aOw5piO5a655Zmo5a+55bqU5Y+Y6YePXHJcblx0ICAqIEBwYXJhbSBwYXJlbnQgXHRcdOWuueWZqFxyXG5cdCAgKiBAcGFyYW0gdGhpc09iamVjdCBcdHRoaXPlr7nosaFcclxuXHQgICovXHJcblx0cHVibGljIHN0YXRpYyBzZXRWYXIocGFyZW50OiBmYWlyeWd1aS5HQ29tcG9uZW50LCB0aGlzT2JqZWN0OiBhbnkpOiB2b2lkIHtcclxuXHJcblx0XHRpZiAocGFyZW50ICE9IG51bGwgJiYgdGhpc09iamVjdCAhPSBudWxsKSB7XHJcblx0XHRcdGxldCBkaXNPYmo6IGZhaXJ5Z3VpLkdPYmplY3Q7XHJcblx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBwYXJlbnQubnVtQ2hpbGRyZW47IGkrKykgeyAvL29iamVjdHNcclxuXHRcdFx0XHRkaXNPYmogPSBwYXJlbnQuZ2V0Q2hpbGRBdChpKTtcclxuXHRcdFx0XHRpZiAoZGlzT2JqLm5hbWUgPT0gXCJpY29uXCIgfHwgZGlzT2JqLm5hbWUgPT0gXCJ0aXRsZVwiKSB7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGRpc09iai5uYW1lICYmIGRpc09iai5uYW1lLmluZGV4T2YoXCJ0YWJfXCIpID09IDAgJiYgZGlzT2JqIGluc3RhbmNlb2YgZmFpcnlndWkuR0dyb3VwKSB7XHJcblx0XHRcdFx0XHQvLyB0aGlzT2JqZWN0W2Rpc09iai5uYW1lXSA9IG5ldyBmYWlydWkuRVRhYihkaXNPYmosIHRoaXNPYmplY3QpO1xyXG5cdFx0XHRcdFx0Ly8gaWYgKHRoaXNPYmplY3QgaW5zdGFuY2VvZiBCYXNlU3ByaXRlKSB0aGlzT2JqZWN0LmFkZENvbXBvbmVudCh0aGlzT2JqZWN0W2Rpc09iai5uYW1lXSk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChkaXNPYmoubmFtZSAmJiBkaXNPYmoubmFtZS5pbmRleE9mKFwiZWdsaXN0X1wiKSA9PSAwICYmIGRpc09iaiBpbnN0YW5jZW9mIGZhaXJ5Z3VpLkdMaXN0KSB7XHJcblx0XHRcdFx0XHQvLyB0aGlzT2JqZWN0W2Rpc09iai5uYW1lXSA9IG5ldyBFR0xpc3QoZGlzT2JqLCB0aGlzT2JqZWN0KTtcclxuXHRcdFx0XHRcdC8vIGlmICh0aGlzT2JqZWN0IGluc3RhbmNlb2YgQmFzZVNwcml0ZSkgdGhpc09iamVjdC5hZGRDb21wb25lbnQodGhpc09iamVjdFtkaXNPYmoubmFtZV0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzT2JqZWN0W2Rpc09iai5uYW1lXSA9IGRpc09iajtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBwYXJlbnQuX3RyYW5zaXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0bGV0IHRyYW5zT2JqOiBmYWlyeWd1aS5UcmFuc2l0aW9uO1xyXG5cdFx0XHRcdHRyYW5zT2JqID0gcGFyZW50Ll90cmFuc2l0aW9uc1tpXTtcclxuXHRcdFx0XHR0aGlzT2JqZWN0W3RyYW5zT2JqLm5hbWVdID0gdHJhbnNPYmo7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0iLCJpbXBvcnQgVmlldyBmcm9tIFwiLi9WaWV3XCI7XHJcbmltcG9ydCBFQnV0dG9uIGZyb20gXCIuL2NvbXBvbmVudC9FQnV0dG9uXCI7XHJcbmltcG9ydCB7IEZhaXJ5VXRpbHMgfSBmcm9tIFwiLi4vdXRpbHMvRmFpcnlVdGlsc1wiO1xyXG5pbXBvcnQgRmFpcnlVSU1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXIvRmFpcnlVSU1hbmFnZXJcIjtcclxuaW1wb3J0IFBhbmVsVm8gZnJvbSBcIi4uL3ZvL1BhbmVsVm9cIjtcclxuaW1wb3J0IExvYWRTb3VyY2VNYW5hZ2VyIGZyb20gXCIuLi8uLi9jb20vbG9hZC9Mb2FkU291cmNlTWFuYWdlclwiO1xyXG5pbXBvcnQgVXJsVXRpbHMgZnJvbSBcIi4uLy4uL2NvbS9sb2FkL3V0aWxzL1VybFV0aWxzXCI7XHJcbmltcG9ydCBQYW5lbFJlZ2lzdGVyIGZyb20gXCIuLi9QYW5lbFJlZ2lzdGVyXCI7XHJcbmltcG9ydCB7IEVHTGlzdCB9IGZyb20gXCIuL2NvbXBvbmVudC9FR0xpc3RcIjtcclxuaW1wb3J0IHsgR2FtZUV2ZW50IH0gZnJvbSBcIi4uLy4uL2NvbS9ldmVudHMvR2FtZUV2ZW50XCI7XHJcbmltcG9ydCB7IENvbW1vblV0aWxzIH0gZnJvbSBcIi4uLy4uL2NvbS91dGlscy9Db21tb25VdGlsc1wiO1xyXG5cclxuLyoqXHJcbiAqIOmdouadv+Wfuuexu1xyXG4gKiBAYXV0aG9yIGNsIDIwMTguNS4xOFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEJhc2VQYW5lbCBleHRlbmRzIFZpZXcge1xyXG5cclxuICAgIHByb3RlY3RlZCB2aWV3OiBmYWlyeWd1aS5HQ29tcG9uZW50ID0gbnVsbDtcclxuICAgIC8qKuiDjOaZryAqL1xyXG4gICAgcHJvdGVjdGVkIGJnOiBmYWlyeWd1aS5HSW1hZ2UgfCBmYWlyeWd1aS5HTG9hZGVyO1xyXG4gICAgLyoq5qCH6aKY5qCPICovXHJcbiAgICAvLyBwcm90ZWN0ZWQgdGl0bGVCYXI6IFRpdGxlQmFyO1xyXG4gICAgLyoq5YWz6Zet5oyJ6ZKuOuWPlui/meS4quWQjeWtl+eahOaMiemSrizkvJrmoLnmja7lsY/luZXlpKflsI/osIPmlbTkvY3nva4gKi9cclxuICAgIHByb3RlY3RlZCBidG5fY2xvc2U6IGZhaXJ5Z3VpLkdCdXR0b24gfCBFQnV0dG9uO1xyXG4gICAgLyoq5piv5ZCm5q2j5Zyo5Yqg6L29ICovXHJcbiAgICBwcm90ZWN0ZWQgaXNMb2FkOmJvb2xlYW4gPSBmYWxzZTtcclxuICAgIFxyXG4gICAgLyoq6Z2i5p2/5pWw5o2uICovXHJcbiAgICBwcm90ZWN0ZWQgX3BhbmVsVm86UGFuZWxWbyA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDpnaLmnb/ln7rnsbtcclxuICAgICAqIEBwYXJhbSBwa2dOYW1lIOWMheWQjVxyXG4gICAgICogQHBhcmFtIHJlc05hbWUg5a+55bqU6Z2i5p2/5ZCN5a2XXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwa2dOYW1lOiBzdHJpbmcgPSBcIlwiLCByZXNOYW1lOiBzdHJpbmcgPSBcIlwiKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3BhbmVsVm8gPSBuZXcgUGFuZWxWbygpO1xyXG4gICAgICAgIHRoaXMuX3BhbmVsVm8ucGtnTmFtZSA9IHBrZ05hbWU7XHJcbiAgICAgICAgdGhpcy5fcGFuZWxWby5yZXNOYW1lID0gcmVzTmFtZTtcclxuICAgICAgICB0aGlzLl9wYW5lbFZvLmNsc05hbWUgPSBDb21tb25VdGlscy5nZXRRdWFsaWZpZWRDbGFzc05hbWUoIHRoaXMgKTsvLyB0eXBlb2YgdGhpcztcclxuICAgICAgICAvLyB0aGlzLmxvYWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0RnJvbVhNTCh4bWw6IGFueSk6IHZvaWQge1xyXG5cclxuICAgICAgICBzdXBlci5jb25zdHJ1Y3RGcm9tWE1MKHhtbCk7XHJcblxyXG4gICAgICAgIC8vRmFpcnlVdGlscy5zZXRWYXIodGhpcywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3otYTmupBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGxvYWQoIGRhdGE6YW55ICk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMudmlldyA9PSBudWxsICYmICF0aGlzLmlzTG9hZCApe1xyXG5cclxuICAgICAgICAgICAgdGhpcy5pc0xvYWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBsZXQgdXJsczpBcnJheTxzdHJpbmc+ID0gVXJsVXRpbHMuZ2V0RmFpcnlHcm91cCggdGhpcy5fcGFuZWxWby5wa2dOYW1lICk7XHJcbiAgICAgICAgICAgIExvYWRTb3VyY2VNYW5hZ2VyLmxvYWRHcm91cCggdGhpcy5fcGFuZWxWby5wa2dOYW1lICwgdXJscyAsIExheWEuSGFuZGxlci5jcmVhdGUoIHRoaXMgLCB0aGlzLmluaXQgLCBbZGF0YV0gLCB0cnVlICApICk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdCggZGF0YSApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirpnaLmnb/mlbDmja4gKi9cclxuICAgIHB1YmxpYyBnZXQgcGFuZWxWbygpOlBhbmVsVm97XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYW5lbFZvO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0Q29tcGxldGUoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0Ly/mo4DmtYvliJ3lp4vljJbmmK/lkKblrozmiJBcclxuXHRcdGlmICghdGhpcy5pc0luaXRlZCgpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMuaXNPcGVuZWQpIHtcclxuXHRcdFx0dGhpcy5pc09wZW5lZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuaW5pdFVJKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdGhpcy5pbml0RGF0YSh0aGlzLnBhcmFtKTtcclxuXHRcdC8vIHRoaXMuYWRkQWxsTGlzdGVuZXIoKTtcclxuXHJcblx0XHR0aGlzLmlzQ29tcGx5ZWQgPSB0cnVlO1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuICAgIHB1YmxpYyBpbml0KCBkYXRhOmFueSApOiB2b2lkIHtcclxuXHJcbiAgICAgICAgc3VwZXIuaW5pdCggZGF0YSApO1xyXG5cclxuICAgICAgICB0aGlzLmlzTG9hZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvLyBpZiggdGhpcy52aWV3ID09IG51bGwgKXtcclxuXHJcbiAgICAgICAgLy8gICAgIHRoaXMuaW5pdFVJKCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuaW5pdERhdGEodGhpcy5wYXJhbSk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMub25SZXNpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdFVJKCk6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBpZiAodGhpcy50aXRsZUJhciAhPSBudWxsKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuYnRuX2Nsb3NlID0gdGhpcy50aXRsZUJhci5idG5fY2xvc2U7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIFBhbmVsUmVnaXN0ZXIucmVnaXN0ZXJDbGFzcyggdGhpcy5fcGFuZWxWby5wa2dOYW1lICk7XHJcblxyXG4gICAgICAgIGxldCBvYmo6IGFueSA9IGZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3QoIHRoaXMuX3BhbmVsVm8ucGtnTmFtZSwgdGhpcy5fcGFuZWxWby5yZXNOYW1lICk7XHJcbiAgICAgICAgdGhpcy52aWV3ID0gb2JqLmFzQ29tO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy52aWV3KTtcclxuXHJcbiAgICAgICAgRmFpcnlVdGlscy5zZXRWYXIodGhpcy52aWV3LCB0aGlzKTtcclxuXHJcbiAgICAgICAgbGV0IGRpc09iajogZmFpcnlndWkuR09iamVjdDtcclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy52aWV3Lm51bUNoaWxkcmVuOyBpKyspIHsgLy9vYmplY3RzXHJcbiAgICAgICAgICAgIGRpc09iaiA9IHRoaXMudmlldy5nZXRDaGlsZEF0KGkpO1xyXG4gICAgICAgICAgICBpZiAoZGlzT2JqLm5hbWUgPT0gXCJpY29uXCIgfHwgZGlzT2JqLm5hbWUgPT0gXCJ0aXRsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGlzT2JqLm5hbWUgJiYgZGlzT2JqLm5hbWUuaW5kZXhPZihcInRhYl9cIikgPT0gMCAmJiBkaXNPYmogaW5zdGFuY2VvZiBmYWlyeWd1aS5HR3JvdXApIHtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXNbZGlzT2JqLm5hbWVdID0gbmV3IGZhaXJ1aS5FVGFiKGRpc09iaiwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLmFkZENvbXBvbmVudCh0aGlzW2Rpc09iai5uYW1lXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlzT2JqLm5hbWUgJiYgZGlzT2JqLm5hbWUuaW5kZXhPZihcImVnbGlzdF9cIikgPT0gMCAmJiBkaXNPYmogaW5zdGFuY2VvZiBmYWlyeWd1aS5HTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpc1tkaXNPYmoubmFtZV0gPSBuZXcgRUdMaXN0KGRpc09iaiwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZENvbXBvbmVudCh0aGlzW2Rpc09iai5uYW1lXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXREYXRhKCBkYXRhOmFueSApOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMuc2hvdyggZGF0YSApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRBbGxMaXN0ZW5lcigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgc3VwZXIuYWRkQWxsTGlzdGVuZXIoKTtcclxuICAgICAgICBpZiAodGhpcy5idG5fY2xvc2UgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZEdhbWVMaXN0ZW5lcihMYXlhLkV2ZW50LkNMSUNLLCB0aGlzLmNsb3NlSGFuZGxlciwgdGhpcyAsIHRoaXMuYnRuX2Nsb3NlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hZGRHYW1lTGlzdGVuZXIoR2FtZUV2ZW50LlNUR0FFX1JFU0laRSwgdGhpcy5vblJlc2l6ZSwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7moIfpopjnmq7ogqRcclxuICAgICAqIEBhdXRob3IgcGtnTmFtZSDljIXlkI1cclxuICAgICAqIEBhdXRob3IgcmVzTmFtZSDotYTmupDlkI1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFRpdGxlU2tpbihwa2dOYW1lOiBzdHJpbmcsIHJlc05hbWU6IHN0cmluZyk6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBpZiAodGhpcy50aXRsZUJhciAhPSBudWxsKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMudGl0bGVCYXIuc2V0VGl0bGVTa2luKHBrZ05hbWUsIHJlc05hbWUpO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlueVjOmdouWtkOWFg+S7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Vmlld0NoaWxkKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnZpZXcgPyB0aGlzLnZpZXcuZ2V0Q2hpbGQobmFtZSkgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiDmuLLmn5PliJfooajmnaHnm67mlrnms5VcclxuICAgICogQHBhcmFtIGluZGV4ICDlr7nlupTmnaHnm67ntKLlvJVcclxuICAgICogQHBhcmFtIG9iaiAgICDmuLLmn5Plr7nosaFcclxuICAgICovXHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyTGlzdEl0ZW0oaW5kZXg6IG51bWJlciwgb2JqOiBmYWlyeWd1aS5HT2JqZWN0KTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKuWFs+mXreS6i+S7tiAqL1xyXG4gICAgcHJvdGVjdGVkIGNsb3NlSGFuZGxlcigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWz6Zet6Z2i5p2/XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbG9zZShpc0hpZGVHdWlkZTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgRmFpcnlVSU1hbmFnZXIuY2xvc2UoIHRoaXMgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOeVjOmdouaYr+WQpuWPr+mHiuaUvlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldCBjYW5EaXNwb3NlKCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKirngrnlh7tNYXNr5bGCLOWFs+mXremdouadvyAqL1xyXG4gICAgcHJvdGVjdGVkIHRhcE1hc2soZTogTGF5YS5FdmVudCk6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmL7npLpcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3coZGF0YTogYW55KTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xyXG4gICAgICAgIGlmKCB0aGlzLnZpZXcgPT0gbnVsbCApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHRydWU7IFxyXG5cclxuICAgICAgICB0aGlzLmFkZEFsbExpc3RlbmVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMub25SZXNpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmakOiXj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaGlkZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy52aXNpYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDovazljJbkuLrlr7nlupTnmoTnsbtcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvQ2xhc3MoKTogYW55IHtcclxuICAgICAgICBsZXQgY2xzTmFtZTogc3RyaW5nID0gdHlwZW9mIHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIExheWEuQ2xhc3NVdGlscy5nZXRDbGFzcyhjbHNOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiHqumAguW6lFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb25SZXNpemUoKTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5riF55CG5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgc3VwZXIuY2xlYXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHiuaUvui1hOa6kCzkuI3lhYHorrjlpJbpg6jnm7TmjqXosIPnlKjov5nkuKrmlrnms5VcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRpc3Bvc2UoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHN1cGVyLmRpc3Bvc2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy52aWV3ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9kYXRhID0gbnVsbDtcclxuICAgICAgICBpZiggdGhpcy5fcGFuZWxWbyAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhbmVsVm8uZGlzcG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wYW5lbFZvID0gbnVsbDtcclxuICAgIH1cclxufSIsImltcG9ydCBCYXNlU3ByaXRlIGZyb20gXCIuL2NvbXBvbmVudC9CYXNlU3ByaXRlXCI7XHJcblxyXG4vKipcclxuICAqIFVJ5pi+56S65Luj55CG57G7XHJcbiAgKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVJQ29tcG9uZW50IGV4dGVuZHMgQmFzZVNwcml0ZSB7XHJcblxyXG5cdC8qKuaYr+WQpuaJk+W8gOi/h+eVjOmdoiAqL1xyXG5cdHByb3RlY3RlZCBpc09wZW5lZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdC8qKuaYr+WQpuWIneWni+WMluaJp+ihjOe7k+adnyAqL1xyXG5cdHByb3RlY3RlZCBpc0NvbXBseWVkOiBib29sZWFuID0gZmFsc2U7XHJcblx0Lyoq5Y+C5pWwICovXHJcblx0cHVibGljIHBhcmFtOiBhbnk7XHJcblxyXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuXHJcblx0XHRzdXBlcigpO1xyXG5cdH1cclxuXHJcblx0cHJvdGVjdGVkIGNvbnN0cnVjdEZyb21YTUwoeG1sOiBhbnkpOiB2b2lkIHtcclxuXHJcblx0XHRzdXBlci5jb25zdHJ1Y3RGcm9tWE1MKHhtbCk7XHJcblxyXG5cdFx0dGhpcy5pbml0KG51bGwpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGlzSW5pdGVkKCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuICF0aGlzLmlzQ29tcGx5ZWQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgaW5pdENvbXBsZXRlKCk6IGJvb2xlYW4ge1xyXG5cclxuXHRcdC8v5qOA5rWL5Yid5aeL5YyW5piv5ZCm5a6M5oiQXHJcblx0XHRpZiAoIXRoaXMuaXNJbml0ZWQoKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0aGlzLmlzT3BlbmVkKSB7XHJcblx0XHRcdHRoaXMuaXNPcGVuZWQgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLmluaXRVSSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuaW5pdERhdGEodGhpcy5wYXJhbSk7XHJcblx0XHR0aGlzLmFkZEFsbExpc3RlbmVyKCk7XHJcblxyXG5cdFx0dGhpcy5pc0NvbXBseWVkID0gdHJ1ZTtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOWklumDqOS4jeimgeiwg+eUqFxyXG5cdCAgKi9cclxuXHRwdWJsaWMgaW5pdChwYXJhbTogYW55KTogdm9pZCB7XHJcblx0XHR0aGlzLnBhcmFtID0gcGFyYW07XHJcblx0XHR0aGlzLmluaXRDb21wbGV0ZSgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOWIneWni+WMllVJ55WM6Z2iXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBpbml0VUkoKTogdm9pZCB7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOWIneWni+WMluWPguaVsFxyXG5cdCAgKi9cclxuXHRwdWJsaWMgaW5pdERhdGEocGFyYW06IGFueSA9IG51bGwpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLl9kYXRhID0gcGFyYW07XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5YWz6Zet55WM6Z2i5pe26LCD55SoXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuXHJcblx0XHRzdXBlci5jbGVhcigpO1xyXG5cclxuXHRcdHRoaXMucGFyYW0gPSBudWxsO1xyXG5cdFx0dGhpcy5pc0NvbXBseWVkID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZGlzcG9zZSgpOiB2b2lkIHtcclxuXHJcblx0XHRzdXBlci5kaXNwb3NlKCk7XHJcblxyXG5cdFx0dGhpcy5wYXJhbSA9IG51bGw7XHJcblx0fVxyXG59IiwiaW1wb3J0IFVJQ29tcG9uZW50ICBmcm9tIFwiLi9VSUNvbXBvbmVudFwiO1xyXG5cclxuLyoqXHJcbiAqIFZpZXfln7rnsbtcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcgZXh0ZW5kcyBVSUNvbXBvbmVudCBpbXBsZW1lbnRzIElWaWV3IHtcclxuXHJcblx0Lyoq6LWE5rqQ5Y+v6YeK5pS+5ZCO57yT5a2Y5pe26Ze0LOavq+enkiAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0FDSEVfVElNRTogbnVtYmVyID0gNTAwMDtcclxuXHJcblx0cHVibGljIGNsczogYW55ID0gbnVsbDtcclxuXHQvL+mHiuaUvuaXtumXtFxyXG5cdHByb3RlY3RlZCBnY1RpbWU6IG51bWJlciA9IDA7XHJcblxyXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuXHJcblx0XHRzdXBlcigpO1xyXG5cdH1cclxuXHJcblx0Lyoq6I635Y+W5b2T5YmN57uE5Lu2Q2xhc3PnsbsgKi9cclxuXHRwdWJsaWMgZ2V0Q2xzKCk6IGFueSB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuY2xzO1xyXG5cdH1cclxuXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Lyoq5Yqg6L296LWE5rqQICovXHJcblx0cHVibGljIGxvYWQoIGRhdGE6YW55ICk6dm9pZHtcclxuXHJcblx0XHR0aGlzLmluaXQoIGRhdGEgKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBpbml0KHBhcmFtOiBhbnkpOiB2b2lkIHtcclxuXHRcdFxyXG5cdFx0c3VwZXIuaW5pdChwYXJhbSk7XHJcblx0XHR0aGlzLmdjVGltZSA9IE51bWJlci5NQVhfVkFMVUU7XHJcblx0fVxyXG5cclxuXHQvL+WIneWni+WMllVJXHJcblx0cHVibGljIGluaXRVSSgpOiB2b2lkIHtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog6Ieq6YCC5bqU5o6l5Y+jXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBvblJlc2l6ZSgpOiB2b2lkIHtcclxuXHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOaYr+WQpuWPr+WbnuaUtlxyXG5cdCAgKi9cclxuXHRwdWJsaWMgaXNDYW5HYygpOiBib29sZWFuIHtcclxuXHJcblx0XHRyZXR1cm4gTGF5YS50aW1lci5jdXJyRnJhbWUgPiB0aGlzLmdjVGltZTsvLyBHbG9iYWwudGltZXIuY3VyckZyYW1lID49IHRoaXMuZ2NUaW1lO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOmHjee9rizmr4/mrKHlhbPpl63nlYzpnaLosIPnlKhcclxuXHQgICovXHJcblx0cHVibGljIGNsZWFyKCk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmNsZWFyKCk7XHJcblx0XHR0aGlzLmdjVGltZSA9IExheWEudGltZXIuY3VyckZyYW1lICsgVmlldy5DQUNIRV9USU1FO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOmUgOavge+8jOWujOWFqOmUgOavgeWvueixoeWSjOi1hOa6kFxyXG5cdCAgKiDmjqXlj6PpmaTkuobnu4Tku7bkvaDku6zlhbblroPlnLDmlrnkuI3opoHosIPnlKjov5nkuKrmjqXlj6NcclxuXHQgICog5Y+q5pyJ5Zue5pS26LWE5rqQ55qE5pe25YCZ5Lya6LCD55So5LiA5qyhXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBkaXNwb3NlKCk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcclxuXHRcdHRoaXMuY2xzID0gbnVsbDtcclxuXHR9XHJcbn0iLCJpbXBvcnQgRXZlbnRQb29sIGZyb20gXCIuLi8uLi8uLi9jb20vZXZlbnRzL0V2ZW50UG9vbFwiO1xyXG5pbXBvcnQgeyBGYWlyeVV0aWxzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL0ZhaXJ5VXRpbHNcIjtcclxuaW1wb3J0IHsgRmFpcnlUZXh0dXJlVXRpbHMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvRmFpcnlUZXh0dXJlVXRpbHNcIjtcclxuaW1wb3J0IEdsb2JhbCBmcm9tIFwiLi4vLi4vLi4vR2xvYmFsXCI7XHJcblxyXG4vKipcclxuICog5Z+65LqOZmFpcnlndWkuR0J1dHRvbueahOWfuuexu+aMiemSrlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUJ1dHRvbiBleHRlbmRzIGZhaXJ5Z3VpLkdCdXR0b24gaW1wbGVtZW50cyBJQ29tcG9uZW50LElQb29sIHtcclxuICAgIFxyXG4gICAgLyoq5piv5ZCm5bey57uP6YeK5pS+ICovXHJcbiAgICBwdWJsaWMgaXNEaXNwb3NlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLyoq6aKd5aSW5pWw5o2uICovXHJcbiAgICBwcm90ZWN0ZWQgX19kYXRhOiBhbnkgPSBudWxsO1xyXG5cclxuICAgIHByb3RlY3RlZCBfZW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAvKirmmK/lkKbliJ3lp4vljJYgKi9cclxuICAgIHByb3RlY3RlZCBpc0luaXQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2N1cnJlbnRTdGF0ZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHByb3RlY3RlZCBfYnRuQ29udHJvbGxlcjogZmFpcnlndWkuQ29udHJvbGxlcjtcclxuXHJcbiAgICAvL+e7hOS7tue8k+WtmOaxoFxyXG4gICAgcHJvdGVjdGVkIG1fY29tcG9uZW50RGljOiBMYXlhLldlYWtPYmplY3QgPSBudWxsO1xyXG4gICAgLy/kuovku7bnvJPlrZjmsaBcclxuICAgIHByb3RlY3RlZCBtX2V2ZW50UG9vbDogRXZlbnRQb29sID0gbnVsbDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7IFxyXG5cclxuICAgICAgICBzdXBlcigpOyBcclxuXHJcbiAgICAgICAgdGhpcy5tX2V2ZW50UG9vbCA9IEV2ZW50UG9vbC5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWIneWni+WIm+W7uuaXtueahOaWueazle+8jOeUqOS6jue7p+aJv0lQb29s55qE57G7ICovXHJcbiAgICBwdWJsaWMgY3JlYXRlKCk6dm9pZHtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RGcm9tWE1MKHhtbDogYW55KTogdm9pZCB7XHJcblxyXG4gICAgICAgIHN1cGVyLmNvbnN0cnVjdEZyb21YTUwoeG1sKTtcclxuXHJcbiAgICAgICAgRmFpcnlVdGlscy5zZXRWYXIodGhpcywgdGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuX2J0bkNvbnRyb2xsZXIgPSB0aGlzW1wiX2J1dHRvbkNvbnRyb2xsZXJcIl07XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdChudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgSXNJbml0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNJbml0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgY3VycmVudFN0YXRlKHZhbHVlOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5fY3VycmVudFN0YXRlID0gdmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9idG5Db250cm9sbGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2J0bkNvbnRyb2xsZXIuc2VsZWN0ZWRQYWdlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoq5b2T5YmN54q25oCBICovXHJcbiAgICBwdWJsaWMgZ2V0IGN1cnJlbnRTdGF0ZSgpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93KHZhbHVlOiBhbnkpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5fX2RhdGEgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRBbGxMaXN0ZW5lcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWRlKCk6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLl9fZGF0YSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGVuYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuXHJcbiAgICAgICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudG91Y2hhYmxlID0gdmFsdWU7XHJcbiAgICAgICAgaWYoIHRoaXMuX2ljb25PYmplY3QgKXtcclxuICAgICAgICAgICAgdGhpcy5faWNvbk9iamVjdC5ncmF5ZWQgPSAhdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDmmK/lkKblj6/ngrnlh7ss5LiN5Y+v54K55Ye7572u54GwXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgZW5hYmxlZCgpOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqBMYXlh5Y6f55Sf5YWD5Lu2XHJcbiAgICAgKiBAcGFyYW0gY2hpbGQgTGF5YeWOn+eUn+aYvuekuuWvueixoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkTGF5YUNoaWxkKGNoaWxkOiBMYXlhLk5vZGUpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmFkZENoaWxkKGNoaWxkKTtcclxuICAgIH1cclxuICAgIC8qKua3u+WKoExheWHljp/nlJ/lhYPku7ZcclxuICAgICAqIEBwYXJhbSBjaGlsZCBMYXlh5Y6f55Sf5pi+56S65a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRMYXlhQ2hpbGRBdChjaGlsZDogTGF5YS5Ob2RlLCBpbmRleDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmFkZENoaWxkQXQoY2hpbGQsIGluZGV4KTsgICAgICAgIFxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaRMYXlh5Y6f55Sf5YWD5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVMYXlhQ2hpbGQoY2hpbGQ6IExheWEuTm9kZSk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAoY2hpbGQgJiYgdGhpcy5fY29udGFpbmVyLmNvbnRhaW5zKGNoaWxkKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY2hpbGQgJiYgY2hpbGQucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY2hpbGQucGFyZW50LnJlbW92ZUNoaWxkKGNoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoh7Pkuo7pobblsYJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvVG9wKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmVudC5udW1DaGlsZHJlbiA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LnNldENoaWxkSW5kZXgodGhpcywgdGhpcy5wYXJlbnQubnVtQ2hpbGRyZW4gLSAxKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LnNldENoaWxkSW5kZXgodGhpcywgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmlLnlj5jlhYPku7bmt7HluqbntKLlvJVcclxuICAgICAqIEBwYXJhbSBpbmRleCDntKLlvJVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluZGV4VG8oaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAodGhpcy5wYXJlbnQubnVtQ2hpbGRyZW4gLSAxKSkge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSB0aGlzLnBhcmVudC5udW1DaGlsZHJlbiAtIDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuc2V0Q2hpbGRJbmRleCh0aGlzLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKuWcqOeItuWuueWZqOS4reeahOe0ouW8lSAqL1xyXG4gICAgcHVibGljIGdldEluZGV4KCk6bnVtYmVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5nZXRDaGlsZEluZGV4KCB0aGlzICkgOiAtMTtcclxuICAgIH0gXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDoh7Pkuo7lupXpg6ggXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0b0JvdHRvbSgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQuc2V0Q2hpbGRJbmRleCh0aGlzLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmnaHnm65cclxuICAgICAqIEBwYXJhbSBuYW1lIOe7hOS7tuWQjeWtl1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RWxlbWVudChuYW1lOiBzdHJpbmcsIGNvbnRhaW5lcjogZmFpcnlndWkuR0NvbXBvbmVudCA9IG51bGwpOiBhbnkge1xyXG5cclxuICAgICAgICBjb250YWluZXIgPSBjb250YWluZXIgfHwgdGhpcztcclxuICAgICAgICByZXR1cm4gY29udGFpbmVyLmdldENoaWxkKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5YyF5ZCr5p+Q5Liq5a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb250YWlucyhjaGlsZDogZmFpcnlndWkuR09iamVjdCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZEluZGV4KGNoaWxkKSAhPSAtMTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHRvdWNoRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXIubW91c2VFbmFibGVkID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0b3VjaEVuYWJsZWQoKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250YWluZXIubW91c2VFbmFibGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdG91Y2hDaGlsZHJlbih2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXIubW91c2VUaHJvdWdoID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0b3VjaENoaWxkcmVuKCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGFpbmVyLm1vdXNlVGhyb3VnaDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiuvue9rkZhaXJ5R3Vp6LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gcGtnTmFtZSDljIXlkI1cclxuICAgICAqIEBwYXJhbSByZXNOYW1lIOi1hOa6kOWQjVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0RmFpcnlTb3VyY2UocGtnTmFtZTogc3RyaW5nLCByZXNOYW1lOiBzdHJpbmcsIGRpc09iajogZmFpcnlndWkuR0xvYWRlciA9IG51bGwpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgZGlzT2JqID0gZGlzT2JqIHx8IDxmYWlyeWd1aS5HTG9hZGVyPnRoaXMuX2ljb25PYmplY3Q7XHJcbiAgICAgICAgbGV0IHVybDogc3RyaW5nID0gZmFpcnlndWkuVUlQYWNrYWdlLmdldEl0ZW1VUkwocGtnTmFtZSwgcmVzTmFtZSk7XHJcbiAgICAgICAgdGhpcy5zZXRGYWlyeVVybCh1cmwsIGRpc09iaik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva5GYWlyeUd1aei1hOa6kOWcsOWdgFxyXG4gICAgICogQHBhcmFtIHVybCBGYWlyeUd1aei1hOa6kOWcsOWdgFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0RmFpcnlVcmwodXJsOiBzdHJpbmcsIGRpc09iajogZmFpcnlndWkuR0xvYWRlciA9IG51bGwpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKGRpc09iaiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGRpc09iai51cmwgPSB1cmw7Ly8gPyBGYWlyeVRleHR1cmVVdGlscy5nZXRUZXh0dXJlKHVybCkgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaYr+WQpuWMheWQq+WFqOWxgOWdkOagh+eCuVxyXG4gICAgICogQHBhcmFtIGd4IOWFqOWxgFjlnZDmoIdcclxuICAgICAqIEBwYXJhbSBneSDlhajlsYBZ5Z2Q5qCHXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb250YWluc0dsb2JhbFBvaW50KGd4OiBudW1iZXIsIGd5OiBudW1iZXIpOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgbGV0IGxwOiBMYXlhLlBvaW50ID0gdGhpcy5nbG9iYWxUb0xvY2FsKGd4LCBneSk7XHJcbiAgICAgICAgbGV0IGJvdW5kczogTGF5YS5SZWN0YW5nbGUgPSBuZXcgTGF5YS5SZWN0YW5nbGUoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIGlmKCB0aGlzLnBpdm90QXNBbmNob3IgKXsvL+aYr+WQpuS4reW/g+eCueS4uumUmueCuVxyXG4gICAgICAgICAgICBib3VuZHMueCA9IC10aGlzLndpZHRoICogMC41O1xyXG4gICAgICAgICAgICBib3VuZHMueSA9IC10aGlzLmhlaWdodCAqIDAuNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJvdW5kcy5jb250YWlucyhscC54LCBscC55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWDj+e0oOepv+mAj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IHBpeGVsSGl0VGVzdCh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiggdGhpcy5faWNvbk9iamVjdCApe1xyXG4gICAgICAgICAgICBsZXQgbG9hZGVyOiBmYWlyeWd1aS5HTG9hZGVyID0gdGhpcy5faWNvbk9iamVjdC5hc0xvYWRlcjtcclxuICAgICAgICAgICAgaWYgKGxvYWRlci5jb250ZW50IGluc3RhbmNlb2YgTGF5YS5CaXRtYXApIHtcclxuICAgICAgICAgICAgICAgIC8vIGxvYWRlci5jb250ZW50LnBpeGVsSGl0VGVzdCA9IHZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gICAgICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICBcclxuICAgIC8v5Yid5aeL5YyWXHJcbiAgICBwdWJsaWMgaW5pdChwYXJhbTogYW55KTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbml0VUkoKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRBbGxMaXN0ZW5lcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8v5Yid5aeL5YyWVUlcclxuICAgIHB1YmxpYyBpbml0VUkoKTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8v5aKe5Yqg55uR5ZCs5LqL5Lu25Ye95pWwXHJcbiAgICBwdWJsaWMgYWRkQWxsTGlzdGVuZXIoKTp2b2lkIHtcclxuXHJcbiAgICAgICAgZm9yKCBsZXQga2V5IGluIHRoaXMubV9jb21wb25lbnREaWMgKXtcclxuICAgICAgICAgICAgbGV0IGRhdGE6YW55ID0gdGhpcy5tX2NvbXBvbmVudERpYy5nZXQoIGtleSApO1xyXG4gICAgICAgICAgICBpZiggR2xvYmFsLmlzKCBkYXRhICwgXCJJQ29tcG9uZW50XCIgKSl7XHJcbiAgICAgICAgICAgICAgICAoPElDb21wb25lbnQ+ZGF0YSkuYWRkQWxsTGlzdGVuZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL+enu+mZpOebkeWQrOS6i+S7tuWHveaVsFxyXG4gICAgcHVibGljIHJlbW92ZUFsbExpc3RlbmVyKCk6dm9pZCB7XHJcblxyXG4gICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOmFueSA9IHRoaXMubV9jb21wb25lbnREaWMuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgaWYoIEdsb2JhbC5pcyggZGF0YSAsIFwiSUNvbXBvbmVudFwiICkpe1xyXG4gICAgICAgICAgICAgICAgKDxJQ29tcG9uZW50PmRhdGEpLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDkuovku7bnm5HlkKxcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEdhbWVMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiwgdGhpc09iamVjdDogYW55LCB0YXJnZXQ/OiBhbnkpIHtcclxuICAgICAgICBpZiggdGhpcy5tX2V2ZW50UG9vbCAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMubV9ldmVudFBvb2wuYWRkTGlzdGVuZXIoIHR5cGUgLCBsaXN0ZW5lciAsIHRhcmdldCAsIHRoaXNPYmplY3QgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTkuovku7bnm5HlkKxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUdhbWVMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiwgdGhpc09iamVjdDogYW55LCB0YXJnZXQ/OiBhbnkpIHtcclxuICAgICAgICBpZiggdGhpcy5tX2V2ZW50UG9vbCAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMubV9ldmVudFBvb2wucmVtb3ZlTGlzdGVuZXIoIHR5cGUgLCBsaXN0ZW5lciAsIHRhcmdldCAsIHRoaXNPYmplY3QgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDnu4Tku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZENvbXBvbmVudChjb21wb25lbnQ6IElDb21wb25lbnQpOiBhbnkge1xyXG5cclxuICAgICAgICBpZiAoIGNvbXBvbmVudCA9PSBudWxsIHx8IHRoaXMubV9jb21wb25lbnREaWMuaGFzT3duUHJvcGVydHkoIFwiXCIgKyBjb21wb25lbnQuZ2V0SGFzaENvZGUoKSApICkge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwi5bey5pyJ55u45ZCM57uE5Lu2XCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tX2NvbXBvbmVudERpYy5zZXQoIGNvbXBvbmVudC5nZXRIYXNoQ29kZSgpLCBjb21wb25lbnQgKTtcclxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk57uE5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVDb21wb25lbnQoY29tcG9uZW50OiBJQ29tcG9uZW50KTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmKCBjb21wb25lbnQgPT0gbnVsbCApIHJldHVybjtcclxuICAgICAgICB2YXIgcG9vbDogSUNvbXBvbmVudCA9IHRoaXMubV9jb21wb25lbnREaWNbY29tcG9uZW50LmdldEhhc2hDb2RlKCldO1xyXG4gICAgICAgIGlmIChwb29sID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICAgICAgZGVsZXRlIHRoaXMubV9jb21wb25lbnREaWNbY29tcG9uZW50LmdldEhhc2hDb2RlKCldO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5omA5pyJ57uE5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVBbGxDb21wb25lbnQoKTp2b2lke1xyXG5cclxuICAgICAgICAvLyB0aGlzLm1fY29tcG9uZW50RGljLnJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5tX2NvbXBvbmVudERpYyA9IG5ldyBMYXlhLldlYWtPYmplY3QoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHjee9rueVjOmdolxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1fZXZlbnRQb29sICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5tX2V2ZW50UG9vbC5yZW1vdmVBbGxMaXN0ZW5lcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yKCBsZXQga2V5IGluIHRoaXMubV9jb21wb25lbnREaWMgKXtcclxuICAgICAgICAgICAgbGV0IGRhdGE6YW55ID0gdGhpcy5tX2NvbXBvbmVudERpYy5nZXQoIGtleSApO1xyXG4gICAgICAgICAgICBpZiggR2xvYmFsLmlzKCBkYXRhICwgXCJJQ29tcG9uZW50XCIgKSl7XHJcbiAgICAgICAgICAgICAgICAoPElDb21wb25lbnQ+ZGF0YSkuY2xlYXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZGVzdHJveUNvbXBvbmVudCgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgZm9yKCBsZXQga2V5IGluIHRoaXMubV9jb21wb25lbnREaWMgKXtcclxuICAgICAgICAgICAgbGV0IGRhdGE6YW55ID0gdGhpcy5tX2NvbXBvbmVudERpYy5nZXQoIGtleSApO1xyXG4gICAgICAgICAgICBpZiggR2xvYmFsLmlzKCBkYXRhICwgXCJJQ29tcG9uZW50XCIgKSl7XHJcbiAgICAgICAgICAgICAgICAoPElDb21wb25lbnQ+ZGF0YSkuZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5ZSv5LiAaGFzaENvZGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEhhc2hDb2RlKCk6IG51bWJlciB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzW1wiJF9HSURcIl0gPSB0aGlzW1wiJF9HSURcIl0gfHwgTGF5YS5VdGlscy5nZXRHSUQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzRGlzcG9zZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbXCJfZGlzcG9zZWRcIl07XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Zue5pS25Yiw5rGg5LitICovXHJcbiAgICBwdWJsaWMgcmVjb3ZlcigpOnZvaWR7XHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YeK5pS+5omA5pyJ6LWE5rqQXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkaXNwb3NlKCk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXNbXCJfZGlzcG9zZWRcIl0pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3VwZXIuZGlzcG9zZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX19kYXRhID0gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5tX2V2ZW50UG9vbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLmRpc3Bvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tX2NvbXBvbmVudERpYyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5tX2V2ZW50UG9vbCA9IG51bGw7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgR2xvYmFsIGZyb20gXCIuLi8uLi8uLi9HbG9iYWxcIjtcclxuaW1wb3J0IEV2ZW50UG9vbCBmcm9tIFwiLi4vLi4vLi4vY29tL2V2ZW50cy9FdmVudFBvb2xcIjtcclxuXHJcbi8qKlxyXG4gKiBmYWlyeWd1aeWOn+S7tuWfuuexu1xyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVNwcml0ZSBleHRlbmRzIGZhaXJ5Z3VpLkdDb21wb25lbnQgaW1wbGVtZW50cyBJQ29tcG9uZW50e1xyXG5cclxuICAgIC8qKuaVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIF9kYXRhOiBhbnkgPSBudWxsO1xyXG4gICAgLyoq5piv5ZCm5Y+Y54GwICovXHJcbiAgICBwcm90ZWN0ZWQgX2lzR3JheTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLyoqXHJcbiAgICAgKiDnlKjkvKDlhaXnmoRmYWlyeXVpLkdDb21wb25lbnTovazljJbkuLpCYXNlU3ByaXRlXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBvd2VyOiBmYWlyeWd1aS5HQ29tcG9uZW50ID0gbnVsbDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2ljb25Mb2FkZXI6ZmFpcnlndWkuR0xvYWRlcjtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2N1cnJlbnRTdGF0ZTpzdHJpbmcgPSBcIlwiO1xyXG5cclxuXHRwcm90ZWN0ZWQgX2J1dHRvbkNvbnRyb2xsZXI6ZmFpcnlndWkuQ29udHJvbGxlcjtcclxuXHJcbiAgICAvL+S6i+S7tue8k+WtmOaxoFxyXG4gICAgcHJvdGVjdGVkIG1fZXZlbnRQb29sOiBFdmVudFBvb2wgPSBudWxsO1xyXG4gICAgLy/nu4Tku7bnvJPlrZjmsaBcclxuXHRwcm90ZWN0ZWQgbV9jb21wb25lbnREaWM6IExheWEuV2Vha09iamVjdCA9IG51bGw7XHJcbiAgICAgICAgXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29tcDogZmFpcnlndWkuR0NvbXBvbmVudCA9IG51bGwpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vd2VyID0gY29tcDtcclxuXHJcbiAgICAgICAgdGhpcy5tX2V2ZW50UG9vbCA9IEV2ZW50UG9vbC5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RGcm9tWE1MKHhtbDogYW55KTogdm9pZCB7XHJcblxyXG4gICAgICAgIHN1cGVyLmNvbnN0cnVjdEZyb21YTUwoeG1sKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0Q29udHJvbGxlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWIneWni+WMluaOp+WItuWZqCAqL1xyXG4gICAgcHJvdGVjdGVkIGluaXRDb250cm9sbGVyKCk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5fYnV0dG9uQ29udHJvbGxlciA9IHRoaXMuZ2V0Q29udHJvbGxlcihcImJ1dHRvblwiKTtcclxuICAgICAgICB0aGlzLl9pY29uTG9hZGVyID0gPGZhaXJ5Z3VpLkdMb2FkZXI+dGhpcy5nZXRDaGlsZChcImljb25cIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBjdXJyZW50U3RhdGUodmFsdWU6IHN0cmluZykge1xyXG5cdFx0XHRcclxuICAgICAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuX2J1dHRvbkNvbnRyb2xsZXIgKXtcclxuICAgICAgICAgICAgdGhpcy5fYnV0dG9uQ29udHJvbGxlci5zZWxlY3RlZFBhZ2UgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKirlvZPliY3nirbmgIEgKi9cclxuICAgIHB1YmxpYyBnZXQgY3VycmVudFN0YXRlKCk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50U3RhdGU7XHJcbiAgICB9XHRcdFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5YyF5ZCr5YWo5bGA5Z2Q5qCH54K5XHJcbiAgICAgKiBAcGFyYW0gZ3gg5YWo5bGAWOWdkOagh1xyXG4gICAgICogQHBhcmFtIGd5IOWFqOWxgFnlnZDmoIdcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnRhaW5zR2xvYmFsUG9pbnQoZ3g6IG51bWJlciwgZ3k6IG51bWJlcik6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICBsZXQgbHA6IExheWEuUG9pbnQgPSB0aGlzLmdsb2JhbFRvTG9jYWwoZ3gsIGd5KTtcclxuICAgICAgICBsZXQgYm91bmRzOiBMYXlhLlJlY3RhbmdsZSA9IG5ldyBMYXlhLlJlY3RhbmdsZSgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgcmV0dXJuIGJvdW5kcy5jb250YWlucyhscC54LCBscC55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2hpbGQoY2hpbGQ6IGZhaXJ5Z3VpLkdPYmplY3QpOiBmYWlyeWd1aS5HT2JqZWN0IHtcclxuXHJcbiAgICAgICAgaWYgKCBHbG9iYWwuaXMoIGNoaWxkICwgXCJJQ29tcG9uZW50XCIgKSApIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoPGFueT5jaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdXBlci5hZGRDaGlsZChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENoaWxkQXQoY2hpbGQ6IGZhaXJ5Z3VpLkdPYmplY3QsIGluZGV4OiBudW1iZXIpOiBmYWlyeWd1aS5HT2JqZWN0IHtcclxuXHJcbiAgICAgICAgaWYgKCBHbG9iYWwuaXMoIGNoaWxkICwgXCJJQ29tcG9uZW50XCIgKSApIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoPGFueT5jaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdXBlci5hZGRDaGlsZEF0KGNoaWxkLCBpbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmnaHnm65cclxuICAgICAqIEBwYXJhbSBuYW1lIOe7hOS7tuWQjeWtl1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RWxlbWVudChuYW1lOiBzdHJpbmcsIGNvbnRhaW5lcjogZmFpcnlndWkuR0NvbXBvbmVudCA9IG51bGwpOiBhbnkge1xyXG5cclxuICAgICAgICBjb250YWluZXIgPSBjb250YWluZXIgfHwgdGhpcztcclxuICAgICAgICByZXR1cm4gY29udGFpbmVyLmdldENoaWxkKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5YyF5ZCr5p+Q5Liq5a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb250YWlucyhjaGlsZDogZmFpcnlndWkuR09iamVjdCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZEluZGV4KGNoaWxkKSAhPSAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoExheWHljp/nlJ/lhYPku7ZcclxuICAgICAqIEBwYXJhbSBjaGlsZCBMYXlh5Y6f55Sf5pi+56S65a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRMYXlhQ2hpbGQoY2hpbGQ6IExheWEuTm9kZSk6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXIuYWRkQ2hpbGQoY2hpbGQpO1xyXG4gICAgfVxyXG4gICAgLyoq5re75YqgTGF5YeWOn+eUn+WFg+S7tlxyXG4gICAgICogQHBhcmFtIGNoaWxkIExheWHljp/nlJ/mmL7npLrlr7nosaFcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZExheWFDaGlsZEF0KGNoaWxkOiBMYXlhLk5vZGUsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jb250YWluZXIuYWRkQ2hpbGRBdChjaGlsZCwgaW5kZXgpOyAgICAgICAgXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpExheWHljp/nlJ/lhYPku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUxheWFDaGlsZChjaGlsZDogTGF5YS5Ob2RlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmIChjaGlsZCAmJiB0aGlzLl9jb250YWluZXIuY29udGFpbnMoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZW1vdmVDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZCAmJiBjaGlsZC5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHRvdWNoRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXIubW91c2VFbmFibGVkID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0b3VjaEVuYWJsZWQoKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250YWluZXIubW91c2VFbmFibGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdG91Y2hDaGlsZHJlbih2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXIubW91c2VUaHJvdWdoID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0b3VjaENoaWxkcmVuKCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGFpbmVyLm1vdXNlVGhyb3VnaDtcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICBwdWJsaWMgYWRkRXZlbnRMaXN0ZW5lciggdHlwZTpzdHJpbmcgLCBsaXN0ZW5lcjpGdW5jdGlvbiAsIHRoaXNPYmplY3Q6YW55ICwgYXJnczpBcnJheTxhbnk+ID0gbnVsbCApOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMub24oIHR5cGUgLCB0aGlzT2JqZWN0ICwgbGlzdGVuZXIgLCBhcmdzIClcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZTpzdHJpbmcgLCBsaXN0ZW5lcjpGdW5jdGlvbiAsIHRoaXNPYmplY3Q6YW55ICk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5vZmYoIHR5cGUgLCB0aGlzT2JqZWN0ICwgbGlzdGVuZXIgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWinuWKoOebkeWQrOS6i+S7tuWHveaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkQWxsTGlzdGVuZXIoKTp2b2lkIHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLnJlbGlzdGVuZXJBbGwoKTtcclxuICAgICAgICAgICAgZm9yKCBsZXQga2V5IGluIHRoaXMubV9jb21wb25lbnREaWMgKXtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhOmFueSA9IHRoaXMubV9jb21wb25lbnREaWMuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgICAgIGlmKCBHbG9iYWwuaXMoIGRhdGEgLCBcIklDb21wb25lbnRcIiApKXtcclxuICAgICAgICAgICAgICAgICAgICAoPElDb21wb25lbnQ+ZGF0YSkuYWRkQWxsTGlzdGVuZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cdFx0XHRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOebkeWQrOS6i+S7tuWHveaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQWxsTGlzdGVuZXIoKTp2b2lkIHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YTphbnkgPSB0aGlzLm1fY29tcG9uZW50RGljLmdldCgga2V5ICk7XHJcbiAgICAgICAgICAgICAgICBpZiggR2xvYmFsLmlzKCBkYXRhICwgXCJJQ29tcG9uZW50XCIgKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgKDxJQ29tcG9uZW50PmRhdGEpLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHRcdFx0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDkuovku7bnm5HlkKxcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEdhbWVMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiwgdGhpc09iamVjdDogYW55ICwgdGFyZ2V0PzogYW55KSB7XHJcbiAgICAgICAgaWYoIHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLmFkZExpc3RlbmVyKCB0eXBlICwgbGlzdGVuZXIgLCB0YXJnZXQgLCB0aGlzT2JqZWN0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5LqL5Lu255uR5ZCsXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVHYW1lTGlzdGVuZXIodHlwZTogc3RyaW5nLCBsaXN0ZW5lcjogRnVuY3Rpb24sIHRoaXNPYmplY3Q6IGFueSAsIHRhcmdldD86IGFueSkge1xyXG4gICAgICAgIGlmKCB0aGlzLm1fZXZlbnRQb29sICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5tX2V2ZW50UG9vbC5yZW1vdmVMaXN0ZW5lciggdHlwZSAsIGxpc3RlbmVyICwgdGFyZ2V0ICwgdGhpc09iamVjdCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOe7hOS7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkQ29tcG9uZW50KGNvbXBvbmVudDogSUNvbXBvbmVudCk6IGFueSB7XHJcblxyXG4gICAgICAgIGlmKCBjb21wb25lbnQgKXtcclxuICAgICAgICAgICAgbGV0IGhhc2hDb2RlOm51bWJlciA9IGNvbXBvbmVudC5nZXRIYXNoQ29kZSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljLnNldCggaGFzaENvZGUgLCBjb21wb25lbnQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOe7hOS7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudDogSUNvbXBvbmVudCk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiggY29tcG9uZW50ICE9IG51bGwgKXtcclxuICAgICAgICAgICAgbGV0IGhhc2hDb2RlOm51bWJlciA9IGNvbXBvbmVudC5nZXRIYXNoQ29kZSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljLmRlbCggaGFzaENvZGUgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5omA5pyJ57uE5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVBbGxDb21wb25lbnQoKTp2b2lke1xyXG5cclxuICAgICAgICBmb3IobGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgIHRoaXMubV9jb21wb25lbnREaWMuZGVsKCBrZXkgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdGhpcy5tX2NvbXBvbmVudERpYy5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YeN572u55WM6Z2iXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOmFueSA9IHRoaXMubV9jb21wb25lbnREaWMuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgaWYoIEdsb2JhbC5pcyggZGF0YSAsIFwiSUNvbXBvbmVudFwiICkgKXtcclxuICAgICAgICAgICAgICAgICg8SUNvbXBvbmVudD5kYXRhKS5jbGVhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBkZXN0cm95Q29tcG9uZW50KCk6IHZvaWQge1xyXG4gICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOmFueSA9IHRoaXMubV9jb21wb25lbnREaWMuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgaWYoIEdsb2JhbC5pcyggZGF0YSAsIFwiSUNvbXBvbmVudFwiICkgKXtcclxuICAgICAgICAgICAgICAgICg8SUNvbXBvbmVudD5kYXRhKS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bllK/kuIBoYXNoQ29kZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0SGFzaENvZGUoKTogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXNbXCIkX0dJRFwiXSA9IHRoaXNbXCIkX0dJRFwiXSB8fCBMYXlhLlV0aWxzLmdldEdJRCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNEaXNwb3NlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpc1tcIl9kaXNwb3NlZFwiXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHiuaUvuaJgOaciei1hOa6kFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpOnZvaWR7XHJcblxyXG4gICAgICAgIGlmICh0aGlzW1wiX2Rpc3Bvc2VkXCJdKXsgLy9mYWlyeWd1aSDkuK3nmoTnp4HmnInlsZ7mgKdcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuZGlzcG9zZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1fZXZlbnRQb29sKSB7XHJcbiAgICAgICAgICAgIHRoaXMubV9ldmVudFBvb2wuZGlzcG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljID0gbnVsbDtcclxuICAgICAgICB0aGlzLm1fZXZlbnRQb29sID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJhc2VCdXR0b24gZnJvbSBcIi4vQmFzZUJ1dHRvblwiO1xyXG4vKipcclxuICog5bCB6KOFZmFpcnlndWnmjInpkq5cclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVCdXR0b24gZXh0ZW5kcyBCYXNlQnV0dG9uIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJhc2VTcHJpdGUgZnJvbSBcIi4vQmFzZVNwcml0ZVwiO1xyXG5pbXBvcnQgRUJ1dHRvbiBmcm9tIFwiLi9FQnV0dG9uXCI7XHJcbmltcG9ydCBHbG9iYWwgZnJvbSBcIi4uLy4uLy4uL0dsb2JhbFwiO1xyXG5pbXBvcnQgeyBVSUVMaXN0UmVuZGVySXRlbSB9IGZyb20gXCIuL1VJRUxpc3RSZW5kZXJJdGVtXCI7XHJcbmltcG9ydCBCYXNlQnV0dG9uIGZyb20gXCIuL0Jhc2VCdXR0b25cIjtcclxuaW1wb3J0IHsgRmFpcnlUZXh0dXJlVXRpbHMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvRmFpcnlUZXh0dXJlVXRpbHNcIjtcclxuaW1wb3J0IHsgR2FtZUV2ZW50IH0gZnJvbSBcIi4uLy4uLy4uL2NvbS9ldmVudHMvR2FtZUV2ZW50XCI7XHJcblxyXG5cclxuLyoqXHJcbiAgKiDlsIHoo4VGYWlyeUd1aeWIl+ihqCzpnIDnvJbovpHlmajkuK1mYWlyeWd1aS5HTGlzdOWRveWQjeS4umVnbGlzdF/lvIDlpLRcclxuICAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAgKi9cclxuZXhwb3J0IGNsYXNzIEVHTGlzdCBleHRlbmRzIEJhc2VTcHJpdGUge1xyXG5cclxuXHRwcm90ZWN0ZWQgbGlzdDogZmFpcnlndWkuR0xpc3Q7XHJcblx0cHJvdGVjdGVkIF9hcnJheTogQXJyYXk8YW55PjtcclxuXHRwcm90ZWN0ZWQgX3RoaXNPYmplY3Q6IGFueTtcclxuXHRwcm90ZWN0ZWQgX2l0ZW1SZW5kZXJlcjogTGF5YS5IYW5kbGVyID0gbnVsbDtcclxuXHRwcm90ZWN0ZWQgX2NsaWNrSGFuZGxlcjogRnVuY3Rpb24gPSBudWxsOy8v54K55Ye75LqL5Lu2XHJcblx0cHJvdGVjdGVkIF9zZWxlY3RlZFBhZ2U6IEZ1bmN0aW9uID0gbnVsbDsvL+WIhumhtemAieS4reafkOS4gOmhteinpuWPkeeahOS6i+S7tlxyXG5cdHByb3RlY3RlZCBfZWxlbWVudHM6IEFycmF5PGZhaXJ5Z3VpLkdPYmplY3Q+ID0gbnVsbDtcclxuXHRwcm90ZWN0ZWQgX2xhc3RjbGlja0l0ZW06IGZhaXJ5Z3VpLkdPYmplY3QgPSBudWxsO1xyXG5cdHByaXZhdGUgX2lzU2hvd0RvU3BlY2lhbEVmZmVjdDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHQvKirliIbpobXnu4Tku7YgKi9cclxuXHRwcm90ZWN0ZWQgY3VycmVudHBhZ2U6IG51bWJlciA9IDA7XHJcblx0cHJvdGVjdGVkIGlzRmlyc3Q6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHQvKirlkJHlt6bmjInpkq4gKi9cclxuXHRwcm90ZWN0ZWQgX2J0bl9sZWZ0OiBFQnV0dG9uIHwgZmFpcnlndWkuR0J1dHRvbjtcclxuXHQvKirlkJHlj7PmjInpkq4gKi9cclxuXHRwcm90ZWN0ZWQgX2J0bl9yaWdodDogRUJ1dHRvbiB8IGZhaXJ5Z3VpLkdCdXR0b247XHJcblxyXG5cdC8qKuaYr+WQpuiHquWKqOa7keWKqOWIsOW6lemDqCAqL1xyXG5cdHB1YmxpYyBpc0F1dG9Cb3R0b206IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0cHVibGljIGNvbnN0cnVjdG9yKGxpc3Q6IGZhaXJ5Z3VpLkdMaXN0LCB0aGlzT2JqZWN0OiBhbnkgPSBudWxsKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5saXN0ID0gbGlzdDtcclxuXHRcdGlmICh0aGlzLmxpc3QgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLmNhbGxiYWNrVGhpc09iaiA9IHRoaXNPYmplY3QgfHwgdGhpcztcclxuXHRcdFx0Ly8gdGhpcy5saXN0LmNhbGxiYWNrVGhpc09iaiA9IHRoaXM7XHJcblx0XHRcdHRoaXMubGlzdC5pdGVtUmVuZGVyZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKCB0aGlzICwgdGhpcy5saXN0SXRlbVJlbmRlciApO1xyXG5cdFx0XHR0aGlzLmxpc3Qub24oIExheWEuRXZlbnQuQ0xJQ0sgLCB0aGlzICwgdGhpcy5jbGlja0l0ZW0gKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBJc0luaXRlZCgpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFkZEFsbExpc3RlbmVyKCk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmFkZEFsbExpc3RlbmVyKCk7XHJcblx0fVxyXG5cclxuXHQvKirorr7nva7kuIrkuIDpobXmjInpkq4gKi9cclxuXHRwdWJsaWMgc2V0IGJ0bl9sZWZ0KHZhbHVlOiBFQnV0dG9uIHwgZmFpcnlndWkuR0J1dHRvbikge1xyXG5cdFx0aWYgKHZhbHVlKSB7XHJcblx0XHRcdHRoaXMuX2J0bl9sZWZ0ID0gdmFsdWU7XHJcblx0XHRcdHRoaXMuX2J0bl9sZWZ0Lm9uKCBMYXlhLkV2ZW50LkNMSUNLICwgdGhpcyAsIHRoaXMudG91Y2hMZWZ0QnRuSGFuZGxlciApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHRoaXMuX2J0bl9sZWZ0KSB7XHJcblx0XHRcdFx0dGhpcy5fYnRuX2xlZnQub2ZmKExheWEuRXZlbnQuQ0xJQ0ssIHRoaXMsIHRoaXMudG91Y2hMZWZ0QnRuSGFuZGxlciApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQqIOS4iuS4gOmhtVxyXG5cdCovXHJcblx0cHJpdmF0ZSB0b3VjaExlZnRCdG5IYW5kbGVyKGU6IExheWEuRXZlbnQpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLmN1cnJlbnRwYWdlID4gMCkge1xyXG5cdFx0XHRsZXQgaW5kZXg6IG51bWJlciA9IHRoaXMuY3VycmVudHBhZ2UgLSAxO1xyXG5cdFx0XHR0aGlzLnRvUGFnZShpbmRleCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKirorr7nva7kuIvkuIDpobXmjInpkq4gKi9cclxuXHRwdWJsaWMgc2V0IGJ0bl9yaWdodCh2YWx1ZTogRUJ1dHRvbiB8IGZhaXJ5Z3VpLkdCdXR0b24pIHtcclxuXHRcdGlmICh2YWx1ZSkge1xyXG5cdFx0XHR0aGlzLl9idG5fcmlnaHQgPSB2YWx1ZTtcclxuXHRcdFx0dGhpcy5fYnRuX3JpZ2h0Lm9uKExheWEuRXZlbnQuQ0xJQ0sgLCB0aGlzICwgdGhpcy50b3VjaFJpZ2h0QnRuSGFuZGxlciApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHRoaXMuX2J0bl9yaWdodCkge1xyXG5cdFx0XHRcdHRoaXMuX2J0bl9yaWdodC5vZmYoTGF5YS5FdmVudC5DTElDSywgdGhpcywgdGhpcy50b3VjaFJpZ2h0QnRuSGFuZGxlciApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDkuIvkuIDpobVcclxuXHQgKi9cclxuXHRwcml2YXRlIHRvdWNoUmlnaHRCdG5IYW5kbGVyKGU6IExheWEuRXZlbnQpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLmN1cnJlbnRwYWdlIDwgdGhpcy5hcnJheS5sZW5ndGggLSAxKSB7XHJcblx0XHRcdGxldCBpbmRleDogbnVtYmVyID0gdGhpcy5jdXJyZW50cGFnZSArIDE7XHJcblx0XHRcdHRoaXMudG9QYWdlKGluZGV4KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKui3s+i9rOWIsOafkOS4gOmhtSAwfm4qL1xyXG5cdHByaXZhdGUgdG9QYWdlKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdGluZGV4ID0gaW5kZXggPCAwID8gMCA6IGluZGV4O1xyXG5cdFx0aWYgKHRoaXMuX3NlbGVjdGVkUGFnZSkge1xyXG5cdFx0XHR0aGlzLl9zZWxlY3RlZFBhZ2UuYXBwbHkodGhpcy5jYWxsYmFja1RoaXNPYmosIDApO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5zY3JvbGxUb1ZpZXcoaW5kZXgsIHRydWUpOy8v5rua5Yqo5Yiw5p+Q5LiA5LiqaXRlbVxyXG5cdH1cclxuXHJcblx0Lyoq5ruR5YqobGlzdCAqL1xyXG5cdHByaXZhdGUgc2Nyb2xsTGlzdFBhZ2UoKTogdm9pZCB7XHJcblxyXG5cdFx0bGV0IGluZGV4OiBudW1iZXIgPSAoKHRoaXMubGlzdC5nZXRGaXJzdENoaWxkSW5WaWV3KCkpICUgdGhpcy5saXN0Lm51bUl0ZW1zKTsvL+iOt+WPlumhteaVsFxyXG5cclxuXHRcdHRoaXMuY3VycmVudHBhZ2UgPSBpbmRleDtcclxuXHJcblx0XHRpZiAodGhpcy5fYnRuX2xlZnQpIHtcclxuXHRcdFx0dGhpcy5fYnRuX2xlZnQuZW5hYmxlZCA9IHRoaXMuY3VycmVudHBhZ2UgPiAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9idG5fcmlnaHQpIHtcclxuXHRcdFx0dGhpcy5fYnRuX3JpZ2h0LmVuYWJsZWQgPSB0aGlzLmN1cnJlbnRwYWdlIDwgKHRoaXMuYXJyYXkubGVuZ3RoIC0gMSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3NlbGVjdGVkUGFnZSkge1xyXG5cdFx0XHR0aGlzLl9zZWxlY3RlZFBhZ2UuYXBwbHkodGhpcy5jYWxsYmFja1RoaXNPYmosIDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBpc1Nob3dEb1NwZWNpYWxFZmZlY3QoYm9vbDogYm9vbGVhbikge1xyXG5cdFx0dGhpcy5faXNTaG93RG9TcGVjaWFsRWZmZWN0ID0gYm9vbDtcclxuXHRcdGlmICh0aGlzLl9pc1Nob3dEb1NwZWNpYWxFZmZlY3QpIHtcclxuXHRcdFx0dGhpcy5saXN0Lm9uKGZhaXJ5Z3VpLkV2ZW50cy5TQ1JPTEwsIHRoaXMsIHRoaXMuZG9TcGVjaWFsRWZmZWN0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMubGlzdC5vZmYoZmFpcnlndWkuRXZlbnRzLlNDUk9MTCwgdGhpcywgdGhpcy5kb1NwZWNpYWxFZmZlY3QpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOa7keWKqGxpc3RcclxuXHQgICovXHJcblx0cHJpdmF0ZSBkb1NwZWNpYWxFZmZlY3QoKTogdm9pZCB7XHJcblx0XHR2YXIgbWlkWDogbnVtYmVyID0gdGhpcy5saXN0LnNjcm9sbFBhbmUucG9zWCArIHRoaXMubGlzdC52aWV3V2lkdGggLyAyO1xyXG5cdFx0dmFyIGNudDogbnVtYmVyID0gdGhpcy5saXN0Lm51bUNoaWxkcmVuO1xyXG5cdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IGNudDsgaSsrKSB7XHJcblx0XHRcdHZhciBvYmo6IGZhaXJ5Z3VpLkdPYmplY3QgPSB0aGlzLmxpc3QuZ2V0Q2hpbGRBdChpKTtcclxuXHRcdFx0dmFyIGRpc3Q6IG51bWJlciA9IE1hdGguYWJzKG1pZFggLSBvYmoueCAtIG9iai53aWR0aCAvIDIpO1xyXG5cdFx0XHRpZiAoZGlzdCA8PSBvYmoud2lkdGggKiAwLjUpIC8v5q2k5p2h55uu5Zyo5Lit6Ze0XHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAodGhpcy5fbGFzdGNsaWNrSXRlbSAmJiBvYmogJiYgdGhpcy5fbGFzdGNsaWNrSXRlbSA9PSBvYmopIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmNsaWNrSW5kZXggPSB0aGlzLmdldFNob3dJdGVtSW5kZXgob2JqKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRTaG93SXRlbShpbmRleDogbnVtYmVyKTogYW55IHtcclxuXHRcdHJldHVybiB0aGlzLmxpc3QuZ2V0Q2hpbGRBdChpbmRleCk7XHJcblx0fVxyXG5cclxuXHQvKiog5pu05YW35p2h55uuIOiOt+WPlue0ouW8le+8jOaYr+WQpuS4uuadoeebrue0ouW8lSovXHJcblx0cHVibGljIGdldFNob3dJdGVtSW5kZXgoaXRlbTogZmFpcnlndWkuR09iamVjdCwgaXNDaGluZEluZGV4OiBib29sZWFuID0gdHJ1ZSk6IG51bWJlciB7XHJcblx0XHRpZiAoaXNDaGluZEluZGV4KSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmxpc3QuZ2V0Q2hpbGRJbmRleChpdGVtKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmxpc3QuY2hpbGRJbmRleFRvSXRlbUluZGV4KHRoaXMubGlzdC5nZXRDaGlsZEluZGV4KGl0ZW0pKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKui9rOaNouWIsOaYvuekuuWvueixoee0ouW8lSovXHJcblx0cHVibGljIGl0ZW1JbmRleFRvQ2hpbGRJbmRleChpbmRleDogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdGxldCBuZXdJbmRleDogbnVtYmVyID0gdGhpcy5saXN0Lml0ZW1JbmRleFRvQ2hpbGRJbmRleChpbmRleCk7XHJcblx0XHRyZXR1cm4gbmV3SW5kZXg7XHJcblx0fVxyXG5cclxuXHQvKirovazmjaLmmL7npLrlr7nosaHntKLlvJXkuLrpobnnm67ntKLlvJXjgIIqL1xyXG5cdHB1YmxpYyBjaGlsZEluZGV4VG9JdGVtSW5kZXgoaW5kZXg6IG51bWJlcik6IG51bWJlciB7XHJcblx0XHRsZXQgbmV3SW5kZXg6IG51bWJlciA9IHRoaXMubGlzdC5jaGlsZEluZGV4VG9JdGVtSW5kZXgoaW5kZXgpO1xyXG5cdFx0cmV0dXJuIG5ld0luZGV4O1xyXG5cdH1cclxuXHJcblx0Lyoq6K6+572u6Jma5ouf5YiX6KGoICovXHJcblx0cHVibGljIHNldFZpcnR1YWwoKTogdm9pZCB7XHJcblx0XHR0aGlzLmxpc3Quc2V0VmlydHVhbCgpO1xyXG5cdFx0dGhpcy5zZXRTY3JvbGwoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRTY3JvbGwoKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5saXN0KSB7XHJcblx0XHRcdHRoaXMubGlzdC5vbihmYWlyeWd1aS5FdmVudHMuU0NST0xMLCB0aGlzLCB0aGlzLnNjcm9sbExpc3RQYWdlICk7Ly/ov5nkuKrlh73mlbDkuLvopoHmmK/mnaXlpITnkIbmu5rliqjliIbpobVcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDorr7nva5MaXN05piv5ZCm6IO95aSf5rua5YqoXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBzZXQgaXNEcmFnZ2VkKHZhbHVlOiBib29sZWFuKSB7XHJcblx0XHRpZiAodGhpcy5saXN0LnNjcm9sbFBhbmUpIHtcclxuXHRcdFx0dGhpcy5saXN0LnNjcm9sbFBhbmUudG91Y2hFZmZlY3QgPSB2YWx1ZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzeW5jKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5saXN0LmVuc3VyZUJvdW5kc0NvcnJlY3QoKTtcclxuXHR9XHJcblxyXG5cdC8qKum7mOiupOmAieaLqeesrOWHoOS4qiAqL1xyXG5cdHB1YmxpYyBzZXQgY2xpY2tJbmRleChpbmRleDogbnVtYmVyKSB7XHJcblx0XHRsZXQgbmV3SW5kZXg6IG51bWJlciA9IHRoaXMuaXRlbUluZGV4VG9DaGlsZEluZGV4KGluZGV4KTtcclxuXHRcdGlmIChuZXdJbmRleCA8IDApIHtcclxuXHRcdFx0bmV3SW5kZXggPSAwO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMubGlzdC5udW1DaGlsZHJlbiA+IDApIHtcclxuXHRcdFx0Ly8gbGV0IGl0ZW06IGZhaXJ5Z3VpLkdPYmplY3QgPSB0aGlzLmxpc3QuZ2V0Q2hpbGRBdChuZXdJbmRleCk7XHJcblx0XHRcdC8vIGxldCBpZTogZmFpcnlndWkuSXRlbUV2ZW50ID0gbmV3IGZhaXJ5Z3VpLkl0ZW1FdmVudChmYWlyeWd1aS5JdGVtRXZlbnQuQ0xJQ0ssIGl0ZW0pO1xyXG5cdFx0XHQvLyB0aGlzLmxpc3QuZGlzcGF0Y2hFdmVudChpZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGNhbGxiYWNrVGhpc09iaih2YWx1ZTogYW55KSB7XHJcblxyXG5cdFx0dGhpcy5fdGhpc09iamVjdCA9IHZhbHVlO1xyXG5cdH1cclxuXHQvKipUaGlzICovXHJcblx0cHVibGljIGdldCBjYWxsYmFja1RoaXNPYmooKTogYW55IHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fdGhpc09iamVjdDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDorr7nva7muLLmn5PmnaHnm65cclxuXHQgICovXHJcblx0cHVibGljIHNldFJlbmRlckl0ZW0ocGtnTmFtZTogc3RyaW5nLCByZXNOYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmxpc3QuZGVmYXVsdEl0ZW0gPSBGYWlyeVRleHR1cmVVdGlscy5nZXRVcmwocGtnTmFtZSwgcmVzTmFtZSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGl0ZW1Qcm92aWRlcih2YWx1ZTogTGF5YS5IYW5kbGVyKSB7XHJcblxyXG5cdFx0aWYgKHRoaXMubGlzdCAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMubGlzdC5pdGVtUHJvdmlkZXIgPSB2YWx1ZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgaXRlbVJlbmRlcmVyKHZhbHVlOiBMYXlhLkhhbmRsZXIpIHtcclxuXHJcblx0XHR0aGlzLl9pdGVtUmVuZGVyZXIgPSB2YWx1ZTtcclxuXHRcdGlmICh0aGlzLmxpc3QgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLmxpc3QuaXRlbVJlbmRlcmVyID0gdmFsdWU7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8qKua4suafk+aWueazlSAqL1xyXG5cdHB1YmxpYyBnZXQgaXRlbVJlbmRlcmVyKCk6TGF5YS5IYW5kbGVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5faXRlbVJlbmRlcmVyO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBjbGlja0hhbmRsZXIodmFsdWU6IEZ1bmN0aW9uKSB7XHJcblxyXG5cdFx0dGhpcy5fY2xpY2tIYW5kbGVyID0gdmFsdWU7XHJcblx0fVxyXG5cdC8qKueCueWHu+S6i+S7tiAqL1xyXG5cdHB1YmxpYyBnZXQgY2xpY2tIYW5kbGVyKCk6IEZ1bmN0aW9uIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fY2xpY2tIYW5kbGVyO1xyXG5cdH1cclxuXHJcblx0Lyoq6K6+572u5YiG6aG15LqL5Lu2ICovXHJcblx0cHVibGljIHNldCBzZWxlY3RlZFBhZ2UodmFsdWU6IEZ1bmN0aW9uKSB7XHJcblxyXG5cdFx0dGhpcy5fc2VsZWN0ZWRQYWdlID0gdmFsdWU7XHJcblx0fVxyXG5cdC8qKuiOt+WPluWIhumhteS6i+S7tiAqL1xyXG5cdHB1YmxpYyBnZXQgc2VsZWN0ZWRQYWdlKCk6IEZ1bmN0aW9uIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fc2VsZWN0ZWRQYWdlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBzZWxlY3Rpb25Nb2RlKCk6bnVtYmVyICB7Ly9mYWlyeWd1aS5MaXN0U2VsZWN0aW9uTW9kZVxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5zZWxlY3Rpb25Nb2RlO1xyXG5cdH1cclxuXHQvKirpgInmi6nmqKHlvI8gKi9cclxuXHRwdWJsaWMgc2V0IHNlbGVjdGlvbk1vZGUodmFsdWU6IG51bWJlcikgey8vZmFpcnlndWkuTGlzdFNlbGVjdGlvbk1vZGVcclxuXHRcdHRoaXMubGlzdC5zZWxlY3Rpb25Nb2RlID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKirmmK/lkKbkuLrljZXpgInmqKHlvI8gKi9cclxuXHRwdWJsaWMgZ2V0IGlzU2luZ2xlU2VsZWN0KCk6IGJvb2xlYW4ge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLnNlbGVjdGlvbk1vZGUgPT0gZmFpcnlndWkuTGlzdFNlbGVjdGlvbk1vZGUuU2luZ2xlO1xyXG5cdH1cclxuXHJcblx0Lyoq5piv5ZCm5Li65aSa6YCJ5qih5byPICovXHJcblx0cHVibGljIGdldCBpc011bHRTZWxlY3QoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuc2VsZWN0aW9uTW9kZSA9PSBmYWlyeWd1aS5MaXN0U2VsZWN0aW9uTW9kZS5NdWx0aXBsZTtcclxuXHR9XHJcblxyXG5cdC8qKuavj+asoeaVsOWAvOaUueWPmOS5i+WJjeS8muinpuWPkeavj+S4quaYvuekuuS4reWtkOe7hOS7tueahGRhdGE9bnVsbOeahOaWueazle+8jOmHjeWGmXNldCBkYXRh6Ieq5bex5aSE55CG5pWw5o2u5byV55SoLOafkOS6m+aDheWGteWmguaenOaYvuekuuS4reeahOWtkOe7hOS7tumcgOimgeaVsOaNruabtOaWsO+8jFxyXG5cdCAgKiDor7fkvb/nlKhlbGVtZW50c+WxnuaAp+iHquihjOi/m+ihjOe7hOS7tuabtOaWsO+8jOS4jeimgee7mWFycmF56LWL5YC877yM5Y+v5Lul5o+Q5Y2H5pWI546HKi9cclxuXHRwdWJsaWMgc2V0IGFycmF5KHZhbHVlOiBBcnJheTxhbnk+KSB7XHJcblxyXG5cdFx0dGhpcy5yZW1vdmVBbGxDb21wb25lbnQoKTtcclxuXHJcblx0XHR0aGlzLmNsZWFyRGF0YSgpO1xyXG5cdFx0dGhpcy5fYXJyYXkgPSB2YWx1ZSB8fCBbXTtcclxuXHRcdHRoaXMudXBkYXRlTGlzdCgpO1xyXG5cdH1cclxuXHQvKipcclxuXHQgICog6K6+572u5a+55bqU5pWw5o2uXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBnZXQgYXJyYXkoKTogQXJyYXk8YW55PiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX2FycmF5O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFkZEl0ZW0odmFsdWU6IGFueSwgaXNVbnNoaWZ0OiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuXHJcblx0XHRpZiAodGhpcy5fYXJyYXkgJiYgdGhpcy5fYXJyYXkuaW5kZXhPZih2YWx1ZSkgPT0gLTEpIHtcclxuXHRcdFx0aWYgKGlzVW5zaGlmdCkge1xyXG5cdFx0XHRcdHRoaXMuX2FycmF5LnVuc2hpZnQodmFsdWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuX2FycmF5LnB1c2godmFsdWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMudXBkYXRlTGlzdCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Lyoq56e76Zmk5p2h55uuICovXHJcblx0cHVibGljIHJlbW92ZUl0ZW0odmFsdWU6IGFueSk6IHZvaWQge1xyXG5cclxuXHRcdGxldCBpdGVtOiBhbnkgPSBudWxsO1xyXG5cdFx0bGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLl9hcnJheS5pbmRleE9mKHZhbHVlKTtcclxuXHRcdGlmICh0aGlzLl9hcnJheSAmJiBpbmRleCAhPSAtMSkge1xyXG5cdFx0XHRpdGVtID0gdGhpcy5fYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcclxuXHRcdFx0dGhpcy51cGRhdGVMaXN0KCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gaXRlbTtcclxuXHR9XHJcblxyXG5cclxuXHQvKirmm7TmlrDliJfooaggKi9cclxuXHRwcml2YXRlIHVwZGF0ZUxpc3QoKTogdm9pZCB7XHJcblxyXG5cdFx0aWYgKHRoaXMubGlzdCAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMubGlzdC5udW1JdGVtcyA9IHRoaXMuX2FycmF5Lmxlbmd0aDtcclxuXHRcdFx0aWYgKHRoaXMuaXNBdXRvQm90dG9tKSB7XHJcblx0XHRcdFx0dGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYWRkSXRlbUxpc3QobGlzdDogQXJyYXk8YW55Pik6IHZvaWQge1xyXG5cclxuXHRcdGlmICh0aGlzLl9hcnJheSAhPSBudWxsICYmIGxpc3QgJiYgbGlzdC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHRoaXMuX2FycmF5ID0gdGhpcy5fYXJyYXkuY29uY2F0KGxpc3QpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy51cGRhdGVMaXN0KCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgcmVwbGFjZUFsbChsaXN0OiBBcnJheTxhbnk+KTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5fYXJyYXkgPSBsaXN0O1xyXG5cdFx0dGhpcy51cGRhdGVMaXN0KCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IG51bUl0ZW1zKHZhbHVlOiBudW1iZXIpIHtcclxuXHJcblx0XHQvLyB0aGlzLl9hcnJheSA9IFtdO1xyXG5cdFx0dGhpcy5jbGVhckRhdGEoKTtcclxuXHRcdHRoaXMuX2FycmF5Lmxlbmd0aCA9IHZhbHVlO1xyXG5cdFx0dGhpcy51cGRhdGVMaXN0KCk7XHJcblx0fVxyXG5cdC8qKuiuvue9ruadoeebriAqL1xyXG5cdHB1YmxpYyBnZXQgbnVtSXRlbXMoKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0Lm51bUl0ZW1zO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOeCueWHu+adoeebrlxyXG5cdCAgKi9cclxuXHRwcm90ZWN0ZWQgY2xpY2tJdGVtKGU6IGFueSk6IHZvaWQgey8vZmFpcnlndWkuSXRlbUV2ZW50XHJcblx0XHR0aGlzLnNlbGVjdEl0ZW0oZS5pdGVtT2JqZWN0KTtcclxuXHR9XHJcblxyXG5cdC8qKumAieaLqeadoeebriAqL1xyXG5cdHB1YmxpYyBzZWxlY3RJdGVtKGl0ZW06IGFueSk6IHZvaWQge1xyXG5cclxuXHRcdC8v5aSN6YCJ5Y+v6YCJ5oup5aSa5Liq5Y+v6YeN5aSN6YCJ5oupXHJcblx0XHRpZiAoKHRoaXMuc2VsZWN0aW9uTW9kZSA9PSBmYWlyeWd1aS5MaXN0U2VsZWN0aW9uTW9kZS5TaW5nbGUpXHJcblx0XHRcdCYmIHRoaXMuX2xhc3RjbGlja0l0ZW1cclxuXHRcdFx0JiYgaXRlbVxyXG5cdFx0XHQmJiB0aGlzLl9sYXN0Y2xpY2tJdGVtID09IGl0ZW1cclxuXHRcdCkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX2xhc3RjbGlja0l0ZW0pIHtcclxuXHRcdFx0dGhpcy5fbGFzdGNsaWNrSXRlbVtcInNlbGVjdFwiXSA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGl0ZW0pIHtcclxuXHRcdFx0aXRlbVtcInNlbGVjdFwiXSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9sYXN0Y2xpY2tJdGVtID0gaXRlbTtcclxuXHJcblx0XHRpZiAoaXRlbS5kYXRhKSB0aGlzLl9zZWxlY3RJbmRleCA9IHRoaXMuX2FycmF5LmluZGV4T2YoaXRlbS5kYXRhKTtcclxuXHRcdGVsc2UgdGhpcy5fc2VsZWN0SW5kZXggPSBwYXJzZUludChpdGVtLm5hbWUpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9jbGlja0hhbmRsZXIpIHtcclxuXHRcdFx0dGhpcy5fY2xpY2tIYW5kbGVyLmFwcGx5KHRoaXMuY2FsbGJhY2tUaGlzT2JqLCBbaXRlbV0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Lyoq6I635Y+W6YCJ5oup55qE5p2h55uuICovXHJcblx0cHVibGljIGdldCBsYXN0Q2xpY2tJdGVtKCk6IGZhaXJ5Z3VpLkdPYmplY3Qge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2xhc3RjbGlja0l0ZW07XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5riy5p+T5p2h55uuXHJcblx0ICAqL1xyXG5cdHByb3RlY3RlZCBsaXN0SXRlbVJlbmRlcihpbmRleDogbnVtYmVyLCBvYmo6IGZhaXJ5Z3VpLkdPYmplY3QpOiB2b2lkIHtcclxuXHJcblx0XHRpZiAoaW5kZXggPT0gMCkge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50cyA9IFtdO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBpdGVtOiBhbnkgPSBvYmo7XHJcblx0XHRpZiAoaXRlbSAmJiBpdGVtW1wic2hvd1wiXSAhPSB1bmRlZmluZWQpIHtcclxuXHRcdFx0aXRlbS5zaG93KHRoaXMuX2FycmF5W2luZGV4XSk7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5lbGVtZW50cy5pbmRleE9mKGl0ZW0pID09IC0xKSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudHMucHVzaChpdGVtKTtcclxuXHRcdH1cclxuXHRcdC8v5YiX6KGo5riy5p+T5Y2V5Liq5p2h55uuXHJcblx0XHRsZXQgZXZ0OiBHYW1lRXZlbnQgPSBuZXcgR2FtZUV2ZW50KEdhbWVFdmVudC5FR0xJU1RfUkVOREVSKTtcclxuXHRcdGV2dC5kYXRhID0geyBcImluZGV4XCI6IGluZGV4LCBcIm9ialwiOiBvYmogfTtcclxuXHRcdGV2dC50aGlzT2JqZWN0ID0gdGhpcy5fdGhpc09iamVjdDtcclxuXHRcdC8vIHRoaXMuZGlzcGF0Y2hFdmVudChldnQpO1xyXG5cdFx0ZmFpcnlndWkuRXZlbnRzLmRpc3BhdGNoKCBHYW1lRXZlbnQuRUdMSVNUX1JFTkRFUiAsIHRoaXMuX2Rpc3BsYXlPYmplY3QgLCBldnQgKTtcclxuXHRcdC8v5YiX6KGo5riy5p+T5a6M5oiQXHJcblx0XHRpZiAoaW5kZXggPT0gKHRoaXMuX2FycmF5Lmxlbmd0aCAtIDEpKSB7XHJcblxyXG5cdFx0XHRsZXQgY29tcGxldGVFdnQ6IEdhbWVFdmVudCA9IG5ldyBHYW1lRXZlbnQoR2FtZUV2ZW50LkVHTElTVF9DT01QTEVURSk7XHJcblx0XHRcdGNvbXBsZXRlRXZ0LnRoaXNPYmplY3QgPSB0aGlzLl90aGlzT2JqZWN0O1xyXG5cdFx0XHQvLyB0aGlzLmRpc3BhdGNoRXZlbnQoY29tcGxldGVFdnQpO1xyXG5cdFx0XHRmYWlyeWd1aS5FdmVudHMuZGlzcGF0Y2goIEdhbWVFdmVudC5FR0xJU1RfQ09NUExFVEUgLCB0aGlzLl9kaXNwbGF5T2JqZWN0ICwgZXZ0ICk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3NlbGVjdGVkUGFnZSkge1xyXG5cdFx0XHQvL+WkhOeQhuWIhumhteeahOaXtuWAmVxyXG5cdFx0XHRpZiAoaW5kZXggPT0gMCAmJiAhdGhpcy5pc0ZpcnN0KSB7XHJcblx0XHRcdFx0dGhpcy5pc0ZpcnN0ID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLl9zZWxlY3RlZFBhZ2UuYXBwbHkodGhpcy5jYWxsYmFja1RoaXNPYmosIDApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCBHbG9iYWwuaXMob2JqLCBcIklDb21wb25lbnRcIikgKSB7XHJcblx0XHRcdHRoaXMuYWRkQ29tcG9uZW50KDxhbnk+b2JqKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKuWIl+ihqOa4suafk+aJgOacieadoeebriAg6Jma5ouf5YiX6KGo5LiN5Y+v5Lul6L+Z5qC35Y+WKi9cclxuXHRwdWJsaWMgZ2V0IGVsZW1lbnRzKCk6IEFycmF5PGFueT4ge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnRzO1xyXG5cdFx0Ly/ovazmjaLpobnnm67ntKLlvJXkuLrmmL7npLrlr7nosaHntKLlvJXjgIJcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3NlbGVjdEluZGV4OiBudW1iZXIgPSAwO1xyXG5cclxuXHRwdWJsaWMgc2V0IHNlbGVjdGVkSW5kZXgodmFsdWU6IG51bWJlcikge1xyXG5cclxuXHRcdGlmICh0aGlzLmlzU2luZ2xlU2VsZWN0KSB7XHJcblxyXG5cdFx0XHR0aGlzLmxpc3Quc2VsZWN0ZWRJbmRleCA9IHZhbHVlOy8v5Z2R77yM5pyJ5pe25Y+WIHRoaXMubGlzdC5zZWxlY3RlZEluZGV45pyJ6Zeu6aKYXHJcblx0XHRcdHRoaXMuX3NlbGVjdEluZGV4ID0gdmFsdWU7XHJcblx0XHRcdC8vY2xvbmcgMjAxOS4yLjEyXHJcblx0XHRcdGxldCBpdGVtOiBhbnkgPSB2YWx1ZSA8IHRoaXMubGlzdC5udW1DaGlsZHJlbiA/IHRoaXMubGlzdC5nZXRDaGlsZEF0KHZhbHVlKSA6IG51bGw7XHJcblx0XHRcdGlmIChpdGVtIGluc3RhbmNlb2YgVUlFTGlzdFJlbmRlckl0ZW0gfHwgaXRlbSBpbnN0YW5jZW9mIEJhc2VCdXR0b24gKSB7XHJcblx0XHRcdFx0dGhpcy5zZWxlY3RJdGVtKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9zZWxlY3RJbmRleCA9IC0xO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvKirlvZPliY3pgInmi6nmnaHnm67ntKLlvJUgKi9cclxuXHRwdWJsaWMgZ2V0IHNlbGVjdGVkSW5kZXgoKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fc2VsZWN0SW5kZXg7Ly8gdGhpcy5saXN0LnNlbGVjdGVkSW5kZXg7XHJcblx0fVxyXG5cclxuXHQvKirlvZPliY3pgInmi6nmlbDmja4gKi9cclxuXHRwdWJsaWMgZ2V0IHNlbGVjdGVkSXRlbSgpOiBhbnkge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLl9zZWxlY3RJbmRleCA8IDAgPyBudWxsIDogdGhpcy5fYXJyYXlbdGhpcy5fc2VsZWN0SW5kZXhdO1xyXG5cdH1cclxuXHJcblx0Lyoq5re75Yqg6YCJ5oupICovXHJcblx0cHVibGljIGFkZFNlbGVjdGlvbihpbmRleDogbnVtYmVyLCBzY3JvbGxJdFRvVmlldz86IGJvb2xlYW4pOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmxpc3QuYWRkU2VsZWN0aW9uKGluZGV4LCBzY3JvbGxJdFRvVmlldyk7XHJcblx0fVxyXG5cclxuXHQvKirnp7vpmaTpgInmi6kgKi9cclxuXHRwdWJsaWMgcmVtb3ZlU2VsZWN0aW9uKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmxpc3QucmVtb3ZlU2VsZWN0aW9uKGluZGV4KTtcclxuXHR9XHJcblxyXG5cdC8qKuWFqOmAiSAqL1xyXG5cdHB1YmxpYyBzZWxlY3RBbGwoKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5saXN0LnNlbGVjdEFsbCgpO1xyXG5cdH1cclxuXHJcblx0Lyoq5LiN6YCJ5oupICovXHJcblx0cHVibGljIHNlbGVjdE5vbmUoKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5saXN0LnNlbGVjdE5vbmUoKTtcclxuXHR9XHJcblxyXG5cdC8qKuWPjemAiSAqL1xyXG5cdHB1YmxpYyBzZWxlY3RSZXZlcnNlKCk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMubGlzdC5zZWxlY3RSZXZlcnNlKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5b2T5YmN6L+b5bqm5p2h5rua5Yqo55m+5YiG5q+UXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBnZXQgcHJvZ3Jlc3MoKTogbnVtYmVyIHtcclxuXHJcblx0XHRpZiAodGhpcy5pc0hvcml6b250YWwpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubGlzdC5zY3JvbGxQYW5lLnBlcmNYO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubGlzdC5zY3JvbGxQYW5lLnBlcmNZO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gcHVibGljIHNldCBpc0hvcml6b250YWwodmFsdWU6Ym9vbGVhbil7XHJcblx0Ly8gXHRpZiggdmFsdWUgKXtcclxuXHQvLyBcdFx0dGhpcy5saXN0LnNjcm9sbFBhbmUuc2NyXHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cclxuXHQvKirmqKrlkJHmu5rliqjmnaEgKi9cclxuXHRwdWJsaWMgZ2V0IGlzSG9yaXpvbnRhbCgpOiBib29sZWFuIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LnNjcm9sbFBhbmUgPyB0aGlzLmxpc3Quc2Nyb2xsUGFuZVtcIl9zY3JvbGxUeXBlXCJdID09IGZhaXJ5Z3VpLlNjcm9sbFR5cGUuSG9yaXpvbnRhbCA6IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOa7keWKqOWIsFxyXG5cdCAgKiBAcGFyYW0gcHJvZ3Jlc3MgMCB+IDFcclxuXHQgICovXHJcblx0cHVibGljIHNsaWRlclRvKHByb2dyZXNzOiBudW1iZXIsIGFuaTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuXHJcblx0XHQvLyB0aGlzLmxpc3Quc2Nyb2xsUGFuZS5zY3JvbGxEb3duKCBwcm9ncmVzcyAsIGFuaSApO1xyXG5cdFx0aWYgKHRoaXMubGlzdC5zY3JvbGxQYW5lKSB7XHJcblx0XHRcdGlmICh0aGlzLmlzSG9yaXpvbnRhbCkge1xyXG5cdFx0XHRcdHRoaXMubGlzdC5zY3JvbGxQYW5lLnNldFBlcmNYKHByb2dyZXNzLCBhbmkpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMubGlzdC5zY3JvbGxQYW5lLnNldFBlcmNZKHByb2dyZXNzLCBhbmkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5rua5Yqo5YiwXHJcblx0ICAqIEBwYXJhbXMgaW5kZXhcclxuXHQgICogQHBhcmFtcyBhbmlcclxuXHQgICogQHBhcmFtcyBzZXRGaXJzdFxyXG5cdCAgKi9cclxuXHRwdWJsaWMgc2Nyb2xsVG9WaWV3KGluZGV4OiBudW1iZXIsIGFuaTogYm9vbGVhbiA9IGZhbHNlLCBzZXRGaXJzdDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5saXN0LnNjcm9sbFRvVmlldyhpbmRleCwgYW5pLCBzZXRGaXJzdCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHNjcm9sbFBhbmUoKTogZmFpcnlndWkuU2Nyb2xsUGFuZSB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5zY3JvbGxQYW5lO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldEZpcnN0Q2hpbGRJblZpZXcoKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmdldEZpcnN0Q2hpbGRJblZpZXcoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRMaXN0Q29tcG9uZXQoKTogZmFpcnlndWkuR0xpc3Qge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3Q7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5ruR5Yqo5Yiw6aG26YOoXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBzY3JvbGxUb1RvcChhbmk6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMubGlzdC5zY3JvbGxQYW5lLnNjcm9sbFRvcChhbmkpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOa7muWKqOWIsOW6lemDqFxyXG5cdCAgKi9cclxuXHRwdWJsaWMgc2Nyb2xsVG9Cb3R0b20oYW5pOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmxpc3Quc2Nyb2xsUGFuZS5zY3JvbGxCb3R0b20oYW5pKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgdG91Y2hFbmFibGVkKHZhbHVlOiBib29sZWFuKSB7XHJcblxyXG5cdFx0dGhpcy5saXN0Ll9jb250YWluZXIubW91c2VFbmFibGVkID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHRvdWNoRW5hYmxlZCgpOiBib29sZWFuIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0Ll9jb250YWluZXIubW91c2VFbmFibGVkO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBlbmFibGVkKCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5lbmFibGVkO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBlbmFibGVkKHZhbDogYm9vbGVhbikge1xyXG5cdFx0dGhpcy5saXN0LmVuYWJsZWQgPSB2YWw7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHRvdWNoQ2hpbGRyZW4odmFsdWU6IGJvb2xlYW4pIHtcclxuXHJcblx0XHR0aGlzLmxpc3QuX2NvbnRhaW5lci5tb3VzZVRocm91Z2ggPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgdG91Y2hDaGlsZHJlbigpOiBib29sZWFuIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0Ll9jb250YWluZXIubW91c2VUaHJvdWdoO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldENoaWxkQXQoaW5kZXg6IG51bWJlcik6IGZhaXJ5Z3VpLkdPYmplY3Qge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QuZ2V0Q2hpbGRBdChpbmRleClcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgbnVtQ2hpbGRyZW4oKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0Lm51bUNoaWxkcmVuO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBsaW5lQ291bnQodmFsdWU6IG51bWJlcikge1xyXG5cclxuXHRcdHRoaXMubGlzdC5saW5lQ291bnQgPSB2YWx1ZTtcclxuXHR9XHJcblx0Lyoq6K6+572u6KGM5pWwICovXHJcblx0cHVibGljIGdldCBsaW5lQ291bnQoKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmxpbmVDb3VudDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgY29sdW1uQ291bnQodmFsdWU6IG51bWJlcikge1xyXG5cclxuXHRcdHRoaXMubGlzdC5jb2x1bW5Db3VudCA9IHZhbHVlO1xyXG5cdH1cclxuXHQvKirorr7nva7liJfmlbAgKi9cclxuXHRwdWJsaWMgZ2V0IGNvbHVtbkNvdW50KCk6IG51bWJlciB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5jb2x1bW5Db3VudDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgdmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuXHRcdHRoaXMubGlzdC52aXNpYmxlID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHZpc2libGUoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC52aXNpYmxlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB4KHZhbHVlOiBudW1iZXIpIHtcclxuXHJcblx0XHR0aGlzLmxpc3QueCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB4KCk6IG51bWJlciB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC54O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB5KHZhbHVlOiBudW1iZXIpIHtcclxuXHJcblx0XHR0aGlzLmxpc3QueSA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB5KCk6IG51bWJlciB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC55O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBzY3JvbGxUeXBlKHZhbHVlOiBmYWlyeWd1aS5TY3JvbGxUeXBlKSB7XHJcblxyXG5cdFx0aWYgKHRoaXMubGlzdC5zY3JvbGxQYW5lKSB7XHJcblx0XHRcdHRoaXMubGlzdC5zY3JvbGxQYW5lW1wiX3Njcm9sbFR5cGVcIl0gPSB2YWx1ZTtcclxuXHRcdH1cclxuXHR9XHJcblx0Lyoq5YiX6KGo5rua5Yqo5qih5byPICovXHJcblx0cHVibGljIGdldCBzY3JvbGxUeXBlKCk6IGZhaXJ5Z3VpLlNjcm9sbFR5cGUge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3Quc2Nyb2xsUGFuZSA/IHRoaXMubGlzdC5zY3JvbGxQYW5lW1wiX3Njcm9sbFR5cGVcIl0gOiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgbGF5b3V0KHZhbHVlOm51bWJlciApIHsvL2ZhaXJ5Z3VpLkxpc3RMYXlvdXRUeXBlXHJcblxyXG5cdFx0dGhpcy5saXN0LmxheW91dCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBhbGlnbih2YWx1ZTpzdHJpbmcgKSB7Ly9mYWlyeWd1aS5BbGlnblR5cGVcclxuXHJcblx0XHR0aGlzLmxpc3QuYWxpZ24gPSB2YWx1ZTtcclxuXHR9XHJcblx0Lyoq5bem5Y+z5biD5bGAICovXHJcblx0cHVibGljIGdldCBhbGlnbigpOiBzdHJpbmcgey8vZmFpcnlndWkuQWxpZ25UeXBlXHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5hbGlnbjtcclxuXHR9XHJcblxyXG5cdC8vIHB1YmxpYyBzZXQgdmVydGljYWxBbGlnbih2YWx1ZTogZmFpcnlndWkuVmVydEFsaWduVHlwZSkge1xyXG5cclxuXHQvLyBcdHRoaXMubGlzdC52ZXJ0aWNhbEFsaWduID0gdmFsdWU7XHJcblx0Ly8gfVxyXG5cdC8vIC8qKuS4iuS4iyAqL1xyXG5cdC8vIHB1YmxpYyBnZXQgdmVydGljYWxBbGlnbigpOiBmYWlyeWd1aS5WZXJ0QWxpZ25UeXBlIHtcclxuXHQvLyBcdHJldHVybiB0aGlzLmxpc3QudmVydGljYWxBbGlnbjtcclxuXHQvLyB9XHJcblxyXG5cdHB1YmxpYyBzZXQgY29sdW1uR2FwKHZhbHVlOiBudW1iZXIpIHtcclxuXHJcblx0XHR0aGlzLmxpc3QuY29sdW1uR2FwID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKirliJfot50gKi9cclxuXHRwdWJsaWMgZ2V0IGNvbHVtbkdhcCgpOiBudW1iZXIge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QuY29sdW1uR2FwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBsaW5lR2FwKGdhcDogbnVtYmVyKSB7XHJcblxyXG5cdFx0dGhpcy5saXN0LmxpbmVHYXAgPSBnYXA7XHJcblx0fVxyXG5cclxuXHQvKirooYzot50gKi9cclxuXHRwdWJsaWMgZ2V0IGxpbmVHYXAoKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmxpbmVHYXA7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0U2l6ZSh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgaWdub3JlUGl2b3Q6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMubGlzdC5zZXRTaXplKHdpZHRoLCBoZWlnaHQsIGlnbm9yZVBpdm90KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdXBlclNldFNpemUod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGlnbm9yZVBpdm90OiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuXHJcblx0XHRzdXBlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQsIGlnbm9yZVBpdm90KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgd2lkdGgoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLmxpc3Qud2lkdGg7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHdpZHRoKHZhbHVlOiBudW1iZXIpIHtcclxuXHRcdHRoaXMubGlzdC53aWR0aCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBoZWlnaHQoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLmxpc3QuaGVpZ2h0O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBoZWlnaHQodmFsdWU6IG51bWJlcikge1xyXG5cdFx0dGhpcy5saXN0LmhlaWdodCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB2aWV3V2lkdGgoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLmxpc3Qudmlld1dpZHRoO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB2aWV3SGVpZ2h0KCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LnZpZXdIZWlnaHQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGdyYXllZCh2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuXHRcdHRoaXMubGlzdC5ncmF5ZWQgPSB2YWx1ZTtcclxuXHR9XHJcblx0Lyoq572u54GwICovXHJcblx0cHVibGljIGdldCBncmF5ZWQoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5ncmF5ZWQ7XHJcblx0fVxyXG5cclxuXHQvKirniLblrrnlmaggKi9cclxuXHRwdWJsaWMgZ2V0IHBhcmVudCgpOiBmYWlyeWd1aS5HQ29tcG9uZW50IHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LnBhcmVudDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBsb2NhbFRvR2xvYmFsKGF4PzogbnVtYmVyLCBheT86IG51bWJlciwgcmVzdWx0UG9pbnQ/OiBMYXlhLlBvaW50KTogTGF5YS5Qb2ludCB7XHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmxvY2FsVG9HbG9iYWwoYXgsIGF5LCByZXN1bHRQb2ludCk7XHJcblx0fVxyXG5cclxuXHQvKirmuIXnkIbmlbDmja4gKi9cclxuXHRwdWJsaWMgY2xlYXJEYXRhKCkge1xyXG5cdFx0aWYgKHRoaXMuZWxlbWVudHMpIHtcclxuXHRcdFx0Zm9yIChsZXQgaW5kZXggaW4gdGhpcy5lbGVtZW50cykge1xyXG5cdFx0XHRcdGlmICh0aGlzLmVsZW1lbnRzW2luZGV4XSBpbnN0YW5jZW9mIEJhc2VTcHJpdGUpIHtcclxuXHRcdFx0XHRcdHRoaXMuZWxlbWVudHNbaW5kZXhdW1wiaGlkZVwiXSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuX2xhc3RjbGlja0l0ZW0pIHtcclxuXHRcdFx0dGhpcy5fbGFzdGNsaWNrSXRlbVtcInNlbGVjdFwiXSA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLl9sYXN0Y2xpY2tJdGVtID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLl9idG5fbGVmdCkge1xyXG5cdFx0XHR0aGlzLl9idG5fbGVmdC5vZmYoTGF5YS5FdmVudC5DTElDSywgdGhpcywgdGhpcy50b3VjaExlZnRCdG5IYW5kbGVyICk7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5fYnRuX3JpZ2h0KSB7XHJcblx0XHRcdHRoaXMuX2J0bl9yaWdodC5vZmYoTGF5YS5FdmVudC5DTElDSywgdGhpcywgdGhpcy50b3VjaFJpZ2h0QnRuSGFuZGxlciApO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fYnRuX2xlZnQgPSBudWxsO1xyXG5cdFx0dGhpcy5fYnRuX3JpZ2h0ID0gbnVsbDtcclxuXHRcdHRoaXMuX2VsZW1lbnRzID0gW107XHJcblx0XHR0aGlzLl9hcnJheSA9IFtdO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOmHjee9rlxyXG5cdCAgKi9cclxuXHRwdWJsaWMgY2xlYXIoKTogdm9pZCB7XHJcblxyXG5cdFx0c3VwZXIuY2xlYXIoKTtcclxuXHJcblx0XHR0aGlzLnNsaWRlclRvKDAsIGZhbHNlKTtcclxuXHJcblx0XHR0aGlzLmNsZWFyRGF0YSgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOmHiuaUvlxyXG5cdCAgKi9cclxuXHRwdWJsaWMgZGlzcG9zZSgpOiB2b2lkIHtcclxuXHJcblx0XHRzdXBlci5kaXNwb3NlKCk7XHJcblxyXG5cdFx0dGhpcy5jbGVhcigpO1xyXG5cclxuXHRcdGlmICh0aGlzLmxpc3QgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLmxpc3Qub2ZmKExheWEuRXZlbnQuQ0xJQ0sgLCB0aGlzICwgdGhpcy5jbGlja0l0ZW0pO1xyXG5cdFx0XHR0aGlzLmxpc3Qub2ZmKGZhaXJ5Z3VpLkV2ZW50cy5TQ1JPTEwgLCB0aGlzICwgdGhpcy5zY3JvbGxMaXN0UGFnZSApO1xyXG5cdFx0XHR0aGlzLmxpc3QuZGlzcG9zZSgpO1xyXG5cdFx0XHR0aGlzLmxpc3QgPSBudWxsO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fYnRuX2xlZnQgPSBudWxsO1xyXG5cdFx0dGhpcy5fYnRuX3JpZ2h0ID0gbnVsbDtcclxuXHRcdHRoaXMuX3RoaXNPYmplY3QgPSBudWxsO1xyXG5cdFx0dGhpcy5faXRlbVJlbmRlcmVyID0gbnVsbDtcclxuXHRcdHRoaXMuX2NsaWNrSGFuZGxlciA9IG51bGw7XHJcblx0XHR0aGlzLl9zZWxlY3RlZFBhZ2UgPSBudWxsO1xyXG5cdFx0dGhpcy5fYXJyYXkgPSBudWxsO1xyXG5cdFx0dGhpcy5fZWxlbWVudHMgPSBudWxsO1xyXG5cdFx0dGhpcy5fbGFzdGNsaWNrSXRlbSA9IG51bGw7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCAgVUlDb21wb25lbnQgIGZyb20gXCIuLi9VSUNvbXBvbmVudFwiO1xyXG5cclxuLyoqXHJcbiAgKiDliJfooajmuLLmn5PmnaHnm65cclxuICAqIEBhdXRob3IgY2wgMjAxOS41LjE4XHJcbiAgKi9cclxuZXhwb3J0IGNsYXNzIFVJRUxpc3RSZW5kZXJJdGVtIGV4dGVuZHMgVUlDb21wb25lbnQge1xyXG5cclxuXHQvKirmmK/lkKbmnInlj6/pgInkuK3nirbmgIEgKi9cclxuXHRwdWJsaWMgY2FuU2VsZWN0OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdHByb3RlY3RlZCBfX2RhdGE6IGFueSA9IG51bGw7XHJcblxyXG5cdHByb3RlY3RlZCBfc2VsZWN0OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuXHJcblx0XHRzdXBlcigpO1xyXG5cdH1cclxuXHJcblx0cHJvdGVjdGVkIGNvbnN0cnVjdEZyb21YTUwoeG1sOiBhbnkpOiB2b2lkIHtcclxuXHJcblx0XHRzdXBlci5jb25zdHJ1Y3RGcm9tWE1MKHhtbCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgaW5pdENvbXBsZXRlKCk6IGJvb2xlYW4ge1xyXG5cclxuXHRcdC8v5qOA5rWL5Yid5aeL5YyW5piv5ZCm5a6M5oiQXHJcblx0XHRpZiAoIXRoaXMuaXNJbml0ZWQoKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0aGlzLmlzT3BlbmVkKSB7XHJcblx0XHRcdHRoaXMuaXNPcGVuZWQgPSB0cnVlO1xyXG5cdFx0XHR0aGlzLmluaXRVSSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuaW5pdERhdGEodGhpcy5wYXJhbSk7XHJcblx0XHQvLyB0aGlzLkFkZFJvb3RMaXN0ZW5lcigpOy8v5q2k5pa55rOV5Zyoc2hvd+aWueazleeahOaXtuWAmeiwg+eUqFxyXG5cclxuXHRcdHRoaXMuaXNDb21wbHllZCA9IHRydWU7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDmmK/lkKbljIXlkKvlhajlsYDlnZDmoIfngrlcclxuXHQgICogQHBhcmFtIGd4IOWFqOWxgFjlnZDmoIdcclxuXHQgICogQHBhcmFtIGd5IOWFqOWxgFnlnZDmoIdcclxuXHQgICovXHJcblx0cHVibGljIGNvbnRhaW5zR2xvYmFsUG9pbnQoZ3g6IG51bWJlciwgZ3k6IG51bWJlcik6IGJvb2xlYW4ge1xyXG5cclxuXHRcdGxldCBscDogTGF5YS5Qb2ludCA9IHRoaXMuZ2xvYmFsVG9Mb2NhbChneCwgZ3kpO1xyXG5cdFx0bGV0IGJvdW5kczogTGF5YS5SZWN0YW5nbGUgPSBuZXcgTGF5YS5SZWN0YW5nbGUoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cdFx0cmV0dXJuIGJvdW5kcy5jb250YWlucyhscC54LCBscC55KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgc2VsZWN0KHZhbHVlOiBib29sZWFuKSB7XHJcblxyXG5cdFx0aWYgKHRoaXMuY2FuU2VsZWN0KSB7XHJcblx0XHRcdHRoaXMuY3VycmVudFN0YXRlID0gdmFsdWUgPyBcImRvd25cIiA6IFwidXBcIjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgc2VsZWN0KCk6IGJvb2xlYW4ge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmNhblNlbGVjdCA/IHRoaXMuY3VycmVudFN0YXRlID09IFwiZG93blwiIDogZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2hvdyhkYXRhOiBhbnkpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmRhdGEgPSB0aGlzLl9kYXRhID0gZGF0YTtcclxuXHRcdHRoaXMuYWRkQWxsTGlzdGVuZXIoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBoaWRlKCk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMuY2xlYXIoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDph43nva5cclxuXHQgICovXHJcblx0cHVibGljIGNsZWFyKCk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmNsZWFyKCk7XHJcblx0XHR0aGlzLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog6YeK5pS+6LWE5rqQXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBkaXNwb3NlKCk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcclxuXHR9XHJcbn0iLCIvKipcclxuICog6Z2i5p2/5pWw5o2uXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjI2XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbFZvIHtcclxuXHJcbiAgICAvKirpnaLmnb9JRCAqL1xyXG4gICAgcHVibGljIGlkOm51bWJlciA9IDA7XHJcbiAgICAvKirpnaLmnb/nsbvlnosgKi9cclxuICAgIHB1YmxpYyB0eXBlOm51bWJlciA9IDA7XHJcbiAgICAvKirlsYLnuqcgMOS4uum7mOiupOeVjOmdouWxgiAqL1xyXG4gICAgcHVibGljIGxheWVyOm51bWJlciA9IDA7XHJcbiAgICAvKirkvKAgZmFsc2Ug6KGo56S65LiN57uR5a6a54K55Ye76YGu572p5YWz6Zet6Z2i5p2/5LqL5Lu2ICovXHJcbiAgICBwdWJsaWMgb3BlblRhcE1hc2s6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKipmYWlyeWd1aSDlr7nlupTljIXlkI0gKi9cclxuICAgIHB1YmxpYyBwa2dOYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICAvKipmYWlyeWd1aSDlr7nlupTljIXotYTmupDlkI0gKi9cclxuICAgIHB1YmxpYyByZXNOYW1lOnN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgLyoq55WM6Z2i57G75ZCNICovXHJcbiAgICBwdWJsaWMgY2xzTmFtZTpzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCAgKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNOb3JtYWwoKTpib29sZWFue1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50eXBlICA9PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwb3NlKCk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5wa2dOYW1lID0gXCJcIjtcclxuICAgICAgICB0aGlzLnJlc05hbWUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuY2xzTmFtZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy50eXBlID0gMDtcclxuICAgICAgICB0aGlzLmlkID0gMDtcclxuICAgICAgICB0aGlzLm9wZW5UYXBNYXNrID0gZmFsc2U7ICAgICAgICBcclxuICAgIH1cclxufSJdfQ==
