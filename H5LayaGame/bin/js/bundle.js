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
},{"./com/load/LoadSourceManager":7,"./com/load/utils/UrlUtils":13,"./fairui/PanelRegister":17,"./fairui/manager/FairyUIManager":18,"./fairui/panel/UIMainView":20,"./fairui/view/component/EButton":28}],2:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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
     * @param cls   面板类
     * @param data  其他数据
     */
    FairyUIManager.open = function (cls, data) {
        if (data === void 0) { data = null; }
        if (cls != null) {
            try {
                var view = new cls();
                if (view instanceof BasePanel_1.BasePanel) {
                    view.load();
                    view.show(data);
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
},{"../../com/log/Log":14,"../view/BasePanel":23,"../view/component/BaseSprite":27}],19:[function(require,module,exports){
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
},{"../../com/log/Log":14,"../view/BasePanel":23}],20:[function(require,module,exports){
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
},{"../manager/FairyUIManager":18,"../view/BasePanel":23,"./UIGMView":19}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var View_1 = require("./View");
var FairyUtils_1 = require("../utils/FairyUtils");
var PanelVo_1 = require("../vo/PanelVo");
var LoadSourceManager_1 = require("../../com/load/LoadSourceManager");
var UrlUtils_1 = require("../../com/load/utils/UrlUtils");
var PanelRegister_1 = require("../PanelRegister");
var EGList_1 = require("./component/EGList");
var GameEvent_1 = require("../../com/events/GameEvent");
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
        var urls = UrlUtils_1.default.getFairyGroup(this._panelVo.pkgName);
        LoadSourceManager_1.default.loadGroup(this._panelVo.pkgName, urls, Laya.Handler.create(this, this.init));
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
        PanelRegister_1.default.registerClass(this._panelVo.pkgName);
        if (this.view == null) {
            var obj = fairygui.UIPackage.createObject(this._panelVo.pkgName, this._panelVo.resName);
            this.view = obj.asCom;
            this.addChild(this.view);
            FairyUtils_1.FairyUtils.setVar(this.view, this);
            var disObj = void 0;
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
            this.initUI();
        }
        this.initData(this.param);
        this.onResize();
    };
    BasePanel.prototype.initUI = function () {
        // if (this.titleBar != null) {
        //     this.btn_close = this.titleBar.btn_close;
        // }
    };
    BasePanel.prototype.initData = function (data) {
        this.show(data);
    };
    BasePanel.prototype.addAllListener = function () {
        _super.prototype.addAllListener.call(this);
        if (this.btn_close != null) {
            this.addGameListener(Laya.Event.CLICK, this.closeHandler, this.btn_close);
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
        this._data = data;
        if (this.view == null) {
            return;
        }
        this.visible = true;
        this.addAllListener();
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
},{"../../com/events/GameEvent":6,"../../com/load/LoadSourceManager":7,"../../com/load/utils/UrlUtils":13,"../PanelRegister":17,"../utils/FairyUtils":22,"../vo/PanelVo":31,"./View":25,"./component/EGList":29}],24:[function(require,module,exports){
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
},{"./component/BaseSprite":27}],25:[function(require,module,exports){
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
},{"./UIComponent":24}],26:[function(require,module,exports){
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
},{"../../../Global":2,"../../../com/events/EventPool":5,"../../utils/FairyUtils":22}],27:[function(require,module,exports){
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
},{"../../../Global":2,"../../../com/events/EventPool":5}],28:[function(require,module,exports){
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
},{"./BaseButton":26}],29:[function(require,module,exports){
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
},{"../../../Global":2,"../../../com/events/GameEvent":6,"../../utils/FairyTextureUtils":21,"./BaseButton":26,"./BaseSprite":27,"./UIEListRenderItem":30}],30:[function(require,module,exports){
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
},{"../UIComponent":24}],31:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L1Byb2dyYW0gRmlsZXMgKHg4NikvTGF5YUFpcklERV8yLjEuMGJldGExL3Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9HYW1lQ2xpZW50LnRzIiwic3JjL0dsb2JhbC50cyIsInNyYy9NYWluLnRzIiwic3JjL2NvbS9ldmVudHMvRXZlbnRPYmoudHMiLCJzcmMvY29tL2V2ZW50cy9FdmVudFBvb2wudHMiLCJzcmMvY29tL2V2ZW50cy9HYW1lRXZlbnQudHMiLCJzcmMvY29tL2xvYWQvTG9hZFNvdXJjZU1hbmFnZXIudHMiLCJzcmMvY29tL2xvYWQvZXZlbnQvTG9hZGVyRXZlbnQudHMiLCJzcmMvY29tL2xvYWQvcmVzb3VyY2UvR3JvdXBSZXNvdXJjZS50cyIsInNyYy9jb20vbG9hZC9yZXNvdXJjZS9SZXNvdXJjZS50cyIsInNyYy9jb20vbG9hZC9yZXNvdXJjZS9UeHRSZXNvdXJjZS50cyIsInNyYy9jb20vbG9hZC91dGlscy9Mb2FkVXRpbHMudHMiLCJzcmMvY29tL2xvYWQvdXRpbHMvVXJsVXRpbHMudHMiLCJzcmMvY29tL2xvZy9Mb2cudHMiLCJzcmMvY29tL2xvZy9Mb2dWby50cyIsInNyYy9jb20vbWFuYWdlci9FdmVudE1hbmFnZXIudHMiLCJzcmMvZmFpcnVpL1BhbmVsUmVnaXN0ZXIudHMiLCJzcmMvZmFpcnVpL21hbmFnZXIvRmFpcnlVSU1hbmFnZXIudHMiLCJzcmMvZmFpcnVpL3BhbmVsL1VJR01WaWV3LnRzIiwic3JjL2ZhaXJ1aS9wYW5lbC9VSU1haW5WaWV3LnRzIiwic3JjL2ZhaXJ1aS91dGlscy9GYWlyeVRleHR1cmVVdGlscy50cyIsInNyYy9mYWlydWkvdXRpbHMvRmFpcnlVdGlscy50cyIsInNyYy9mYWlydWkvdmlldy9CYXNlUGFuZWwudHMiLCJzcmMvZmFpcnVpL3ZpZXcvVUlDb21wb25lbnQudHMiLCJzcmMvZmFpcnVpL3ZpZXcvVmlldy50cyIsInNyYy9mYWlydWkvdmlldy9jb21wb25lbnQvQmFzZUJ1dHRvbi50cyIsInNyYy9mYWlydWkvdmlldy9jb21wb25lbnQvQmFzZVNwcml0ZS50cyIsInNyYy9mYWlydWkvdmlldy9jb21wb25lbnQvRUJ1dHRvbi50cyIsInNyYy9mYWlydWkvdmlldy9jb21wb25lbnQvRUdMaXN0LnRzIiwic3JjL2ZhaXJ1aS92aWV3L2NvbXBvbmVudC9VSUVMaXN0UmVuZGVySXRlbS50cyIsInNyYy9mYWlydWkvdm8vUGFuZWxWby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNWQSxrRUFBNkQ7QUFDN0Qsd0RBQW1EO0FBQ25ELDJEQUFzRDtBQUN0RCxrRUFBZ0Y7QUFDaEYsc0RBQWlEO0FBRWpELHdEQUFtRDtBQUVuRDs7O0dBR0c7QUFDSDtJQUF3Qyw4QkFBVztJQUUvQztRQUFBLFlBRUksaUJBQU8sU0FHVjtRQURHLEtBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7SUFDaEIsQ0FBQztJQUVNLHlCQUFJLEdBQVg7UUFFSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV2RCxxQkFBcUI7UUFDM0IscUVBQXFFO1FBQ3JFLDhEQUE4RDtRQUN4RCxvREFBb0Q7UUFDcEQsSUFBSSxJQUFJLEdBQWlCLGtCQUFRLENBQUMsYUFBYSxDQUFFLFFBQVEsQ0FBRSxDQUFDO1FBQzVELDJCQUFpQixDQUFDLFNBQVMsQ0FBRSxRQUFRLEVBQUcsSUFBSSxFQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFFLElBQUksRUFBRyxJQUFJLENBQUMsUUFBUSxDQUFFLENBQUUsQ0FBQztJQUNqRyxDQUFDO0lBRU8sNkJBQVEsR0FBaEI7UUFFRix3REFBd0Q7UUFDbEQscURBQXFEO1FBQ3JELG1FQUFtRTtRQUNuRSxxRUFBcUU7UUFDckUsd0RBQXdE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Q0FBQztJQUVELHNCQUFXLDZCQUFRO2FBQW5CO1lBRUksT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFLLENBQUMsQ0FBQztRQUMzQixDQUFDOzs7T0FBQTtJQUVNLHlCQUFPLEdBQWQ7UUFFSSxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQztJQUNMLGNBQUM7QUFBRCxDQWpDQSxBQWlDQyxJQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBGYWlyeVVJTWFuYWdlciBmcm9tIFwiLi9mYWlydWkvbWFuYWdlci9GYWlyeVVJTWFuYWdlclwiO1xyXG5pbXBvcnQgUGFuZWxSZWdpc3RlciBmcm9tIFwiLi9mYWlydWkvUGFuZWxSZWdpc3RlclwiO1xyXG5pbXBvcnQgRUJ1dHRvbiBmcm9tIFwiLi9mYWlydWkvdmlldy9jb21wb25lbnQvRUJ1dHRvblwiO1xyXG5pbXBvcnQgTG9hZFNvdXJjZU1hbmFnZXIsIHsgTG9hZGVyTWFuYWdlciB9IGZyb20gXCIuL2NvbS9sb2FkL0xvYWRTb3VyY2VNYW5hZ2VyXCI7XHJcbmltcG9ydCBVcmxVdGlscyBmcm9tIFwiLi9jb20vbG9hZC91dGlscy9VcmxVdGlsc1wiO1xyXG5pbXBvcnQgVUlHTVZpZXcgZnJvbSBcIi4vZmFpcnVpL3BhbmVsL1VJR01WaWV3XCI7XHJcbmltcG9ydCBVSU1haW5WaWV3IGZyb20gXCIuL2ZhaXJ1aS9wYW5lbC9VSU1haW5WaWV3XCI7XHJcblxyXG4vKipcclxuICog5ri45oiP5Li75a6i5oi356uvXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ2xpZW50IGV4dGVuZHMgTGF5YS5TcHJpdGUge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTsgXHJcblxyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0KCk6dm9pZHtcclxuXHJcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZChmYWlyeWd1aS5HUm9vdC5pbnN0LmRpc3BsYXlPYmplY3QpO1xyXG5cclxuICAgICAgICAvLyBMYXlhLmxvYWRlci5sb2FkKFtcclxuXHRcdC8vIFx0eyB1cmw6IFwicmVzL2ZhaXJ1aS9jb21tb25fYXRsYXMwLnBuZ1wiLCB0eXBlOiBMYXlhLkxvYWRlci5JTUFHRSB9LFxyXG5cdFx0Ly8gXHR7IHVybDogXCJyZXMvZmFpcnVpL2NvbW1vbi5tYXBcIiwgdHlwZTogTGF5YS5Mb2FkZXIuQlVGRkVSIH1cclxuICAgICAgICAvLyAgICAgXSwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uTG9hZGVkKSk7XHJcbiAgICAgICAgbGV0IHVybHM6QXJyYXk8c3RyaW5nPiA9IFVybFV0aWxzLmdldEZhaXJ5R3JvdXAoIFwiY29tbW9uXCIgKTtcclxuICAgICAgICBMb2FkU291cmNlTWFuYWdlci5sb2FkR3JvdXAoIFwiY29tbW9uXCIgLCB1cmxzICwgTGF5YS5IYW5kbGVyLmNyZWF0ZSggdGhpcyAsIHRoaXMub25Mb2FkZWQgKSApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Mb2FkZWQoKTp2b2lke1xyXG5cclxuXHRcdC8vIGZhaXJ5Z3VpLlVJUGFja2FnZS5hZGRQYWNrYWdlKFwicmVzL2ZhaXJ1aS9jb21tb25cIik7XHRcdFxyXG4gICAgICAgIC8vIGZhaXJ5Z3VpLlVJQ29uZmlnLmRlZmF1bHRGb250ID0gXCJNaWNyb3NvZnQgWWFIZWlcIjtcclxuICAgICAgICAvLyBmYWlyeWd1aS5VSUNvbmZpZy52ZXJ0aWNhbFNjcm9sbEJhciA9IFwidWk6Ly9CYXNpYy9TY3JvbGxCYXJfVlRcIjtcclxuICAgICAgICAvLyBmYWlyeWd1aS5VSUNvbmZpZy5ob3Jpem9udGFsU2Nyb2xsQmFyID0gXCJ1aTovL0Jhc2ljL1Njcm9sbEJhcl9IWlwiO1xyXG4gICAgICAgIC8vIGZhaXJ5Z3VpLlVJQ29uZmlnLnBvcHVwTWVudSA9IFwidWk6Ly9CYXNpYy9Qb3B1cE1lbnVcIjtcclxuICAgICAgICBmYWlyeWd1aS5VSUNvbmZpZy5wYWNrYWdlRmlsZUV4dGVuc2lvbiA9IFwibWFwXCI7XHJcblxyXG4gICAgICAgIEZhaXJ5VUlNYW5hZ2VyLmluaXQoIExheWEuc3RhZ2UgKTtcclxuICAgICAgICBcclxuICAgICAgICBQYW5lbFJlZ2lzdGVyLnJlZ2lzdGVyQ2xhc3MoXCJjb21tb25cIiwgXCJFQnV0dG9uXCIsIEVCdXR0b24gKTtcclxuXHJcbiAgICAgICAgRmFpcnlVSU1hbmFnZXIub3BlbiggVUlNYWluVmlldyApO1xyXG5cdH1cclxufSIsImltcG9ydCBHYW1lQ2xpZW50IGZyb20gXCIuL0dhbWVDbGllbnRcIjtcclxuaW1wb3J0IExvYWRTb3VyY2VNYW5hZ2VyIGZyb20gXCIuL2NvbS9sb2FkL0xvYWRTb3VyY2VNYW5hZ2VyXCI7XHJcbmltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSBcIi4vY29tL21hbmFnZXIvRXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCBMb2cgZnJvbSBcIi4vY29tL2xvZy9Mb2dcIjtcclxuXHJcbi8qKlxyXG4gKiDlhajlsYDlj4LmlbBcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdsb2JhbCB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB3aWR0aDpudW1iZXI9NjQwO1xyXG4gICAgcHVibGljIHN0YXRpYyBoZWlnaHQ6bnVtYmVyPTExMzY7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJmaXhlZHdpZHRoXCI7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNjcmVlbk1vZGU6c3RyaW5nPVwibm9uZVwiOy8vaG9yaXpvbnRhbFxyXG4gICAgcHVibGljIHN0YXRpYyBhbGlnblY6c3RyaW5nPVwidG9wXCI7XHJcbiAgICBwdWJsaWMgc3RhdGljIGFsaWduSDpzdHJpbmc9XCJsZWZ0XCI7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgcHVibGljIHN0YXRpYyBzdGF0OmJvb2xlYW49ZmFsc2U7XHJcbiAgICBwdWJsaWMgc3RhdGljIHBoeXNpY3NEZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgcHVibGljIHN0YXRpYyBleHBvcnRTY2VuZVRvSnNvbjpib29sZWFuPXRydWU7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhajlsYDliJ3lp4vljJZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpbml0KCk6dm9pZHtcclxuXHJcbiAgICAgICAgTG9nLmluaXQoKTtcclxuICAgICAgICBFdmVudE1hbmFnZXIuaW5pdCgpO1xyXG4gICAgICAgIExvYWRTb3VyY2VNYW5hZ2VyLmluaXQoKTtcclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKCBuZXcgR2FtZUNsaWVudCgpICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcblx0ICog5Yik5pat5a+56LGh5piv5ZCm5Li65a+55bqU57G75oiW5o6l5Y+jXHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyBpcyggdGFyZ2V0OmFueSAsIGNsczphbnkgKTpib29sZWFue1xyXG5cclxuICAgICAgICBpZiggIXRhcmdldCApe1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cdFx0cmV0dXJuIExheWFbXCJfX3R5cGVvZlwiXSggdGFyZ2V0ICwgY2xzICk7XHJcblx0fVxyXG59IiwiaW1wb3J0IEdsb2JhbCBmcm9tIFwiLi9HbG9iYWxcIjtcclxuY2xhc3MgTWFpbiB7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cclxuXHRcdExheWEuaW5pdCgxMTM2LCA2NDAsIExheWEuV2ViR0wpO1xyXG5cdFx0Ly8gTGF5YS5pbml0KCBHbG9iYWwud2lkdGggLCBHbG9iYWwuaGVpZ2h0ICwgTGF5YS5XZWJHTCk7XHJcbiAgICAgICAgbGF5YS51dGlscy5TdGF0LnNob3coMCwgMCk7XHJcbiAgICAgICAgLy/orr7nva7pgILphY3mqKHlvI9cclxuICAgICAgICBMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IFwic2hvd2FsbFwiO1xyXG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25IID0gXCJsZWZ0XCI7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5hbGlnblYgPSBcInRvcFwiO1xyXG4gICAgICAgIC8v6K6+572u5qiq56uW5bGPXHJcbiAgICAgICAgTGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2xvYmFsLnNjcmVlbk1vZGU7Ly8gXCJob3Jpem9udGFsXCI7XHJcblxyXG4gICAgICAgIC8v5qC55o2uSURF6K6+572u5Yid5aeL5YyW5byV5pOOXHRcdFxyXG5cdFx0aWYgKHdpbmRvd1tcIkxheWEzRFwiXSl7XHJcbiAgICAgICAgICAgIExheWEzRC5pbml0KEdsb2JhbC53aWR0aCwgR2xvYmFsLmhlaWdodCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIExheWEuaW5pdChHbG9iYWwud2lkdGgsIEdsb2JhbC5oZWlnaHQsIExheWFbXCJXZWJHTFwiXSk7XHJcbiAgICAgICAgfSBcclxuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IEdsb2JhbC5zY2FsZU1vZGU7XHJcblx0XHRMYXlhLnN0YWdlLnNjcmVlbk1vZGUgPSBHbG9iYWwuc2NyZWVuTW9kZTtcclxuXHRcdC8v5YW85a655b6u5L+h5LiN5pSv5oyB5Yqg6L29c2NlbmXlkI7nvIDlnLrmma9cclxuICAgICAgICAvL0xheWEuVVJMLmV4cG9ydFNjZW5lVG9Kc29uID0gR2xvYmFsLmV4cG9ydFNjZW5lVG9Kc29uO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8v5omT5byA6LCD6K+V6Z2i5p2/77yI6YCa6L+HSURF6K6+572u6LCD6K+V5qih5byP77yM5oiW6ICFdXJs5Zyw5Z2A5aKe5YqgZGVidWc9dHJ1ZeWPguaVsO+8jOWdh+WPr+aJk+W8gOiwg+ivlemdouadv++8iVxyXG5cdFx0aWYgKEdsb2JhbC5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG5cdFx0aWYgKEdsb2JhbC5waHlzaWNzRGVidWcgJiYgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0pIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdLmVuYWJsZSgpO1xyXG5cdFx0aWYgKEdsb2JhbC5zdGF0KSBMYXlhLlN0YXQuc2hvdygpO1xyXG5cdFx0TGF5YS5hbGVydEdsb2JhbEVycm9yID0gdHJ1ZTtcclxuXHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0TGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcclxuXHR9XHJcblxyXG5cdG9uVmVyc2lvbkxvYWRlZCgpOiB2b2lkIHtcclxuXHRcdC8v5r+A5rS75aSn5bCP5Zu+5pig5bCE77yM5Yqg6L295bCP5Zu+55qE5pe25YCZ77yM5aaC5p6c5Y+R546w5bCP5Zu+5Zyo5aSn5Zu+5ZCI6ZuG6YeM6Z2i77yM5YiZ5LyY5YWI5Yqg6L295aSn5Zu+5ZCI6ZuG77yM6ICM5LiN5piv5bCP5Zu+XHJcblx0XHQvL0xheWEuQXRsYXNJbmZvTWFuYWdlci5lbmFibGUoXCJmaWxlY29uZmlnLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQ29uZmlnTG9hZGVkKSk7XHJcblxyXG5cdFx0XHJcblx0XHRHbG9iYWwuaW5pdCgpXHJcblx0fVxyXG5cclxuXHRvbkNvbmZpZ0xvYWRlZCgpOiB2b2lkIHtcclxuXHRcdC8v5Yqg6L29SURF5oyH5a6a55qE5Zy65pmvXHJcblx0XHQvL0dhbWVDb25maWcuc3RhcnRTY2VuZSAmJiBMYXlhLlNjZW5lLm9wZW4oR2FtZUNvbmZpZy5zdGFydFNjZW5lKTtcclxuXHR9XHJcbn1cclxuLy/mv4DmtLvlkK/liqjnsbtcclxubmV3IE1haW4oKTtcclxuIiwiXHJcbi8qKlxyXG4gKiDpgJrnlKjkuovku7bnsbtcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjMuMjNcclxuICovXHJcbmV4cG9ydCBjbGFzcyBFdmVudE9iaiB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcG9vbDpBcnJheTxFdmVudE9iaj4gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZSggdHlwZTogc3RyaW5nLCBsaXN0ZW5lcjogRnVuY3Rpb24sIHRhcmdldDogTGF5YS5FdmVudERpc3BhdGNoZXIgPSBudWxsLCB0aGlzT2JqOiBhbnkgPSBudWxsICk6RXZlbnRPYmp7XHJcblxyXG4gICAgICAgIGxldCBvYmo6RXZlbnRPYmogPSBFdmVudE9iai5wb29sLnNoaWZ0KCk7XHJcbiAgICAgICAgaWYoIG9iaiA9PSBudWxsICl7XHJcbiAgICAgICAgICAgIG9iaiA9IG5ldyBFdmVudE9iaigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvYmoudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgb2JqLmxpc3RlbmVyID0gbGlzdGVuZXI7XHJcbiAgICAgICAgb2JqLnRhcmdldCA9IHRhcmdldDtcclxuICAgICAgICBvYmoudGhpc09iaiA9IHRoaXNPYmo7XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlY292ZXIoIG9iajpFdmVudE9iaiApOnZvaWR7XHJcblxyXG4gICAgICAgIGlmKCBvYmogIT0gbnVsbCAmJiBFdmVudE9iai5wb29sLmluZGV4T2YoIG9iaiApID09IC0xICl7XHJcbiAgICAgICAgICAgIEV2ZW50T2JqLnBvb2wucHVzaCggb2JqICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIHByaXZhdGUgX3R5cGU6IHN0cmluZztcclxuICAgIHByaXZhdGUgX2xpc3RlbmVyOiBGdW5jdGlvbjtcclxuICAgIHByaXZhdGUgX3RhcmdldDogTGF5YS5FdmVudERpc3BhdGNoZXI7XHJcbiAgICBwcml2YXRlIF90aGlzT2JqOiBhbnk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuovku7bmnoTpgKDlh73mlbBcclxuICAgICAqIEBwYXJhbSB0eXBlICAgICAg5LqL5Lu257G75Z6LXHJcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIgICAgICAg5LqL5Lu25ZON5bqU5aSE55CG5Ye95pWwXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0ICAgIOS6i+S7tue7keWumueahOaOp+S7tlxyXG4gICAgICogQHBhcmFtIF9oaXNPYmogICDmmK/lkKbmmK/nu5Hlrprmjqfku7bnmoQgaGFuZGxlcuaWueazlVxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvciggdHlwZTogc3RyaW5nID0gXCJcIiAsIGxpc3RlbmVyOiBGdW5jdGlvbiA9IG51bGwgLCB0YXJnZXQ6IExheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCwgdGhpc09iajogYW55ID0gbnVsbCApIHtcclxuXHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSBsaXN0ZW5lcjtcclxuICAgICAgICB0aGlzLl90YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgICAgdGhpcy5fdGhpc09iaiA9IHRoaXNPYmo7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB0eXBlKHZhbHVlOnN0cmluZyl7XHJcblxyXG4gICAgICAgIHRoaXMuX3R5cGUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHR5cGUoKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBsaXN0ZW5lciggdmFsdWU6RnVuY3Rpb24gKXtcclxuXHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGxpc3RlbmVyKCk6IEZ1bmN0aW9uIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdGFyZ2V0KCB2YWx1ZTpMYXlhLkV2ZW50RGlzcGF0Y2hlciApe1xyXG5cclxuICAgICAgICB0aGlzLl90YXJnZXQgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHRhcmdldCgpOiBMYXlhLkV2ZW50RGlzcGF0Y2hlciB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl90YXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB0aGlzT2JqKCB2YWx1ZTphbnkgKXtcclxuXHJcbiAgICAgICAgdGhpcy5fdGhpc09iaiA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdGhpc09iaigpOiBhbnkge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fdGhpc09iajtcclxuICAgIH1cclxuXHJcbiAgICAvKirph43nva7lubblm57mlLYgKi9cclxuICAgIHB1YmxpYyByZWNvdmVyKCk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX3RhcmdldCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fdGhpc09iaiA9IG51bGw7XHJcblxyXG4gICAgICAgIEV2ZW50T2JqLnJlY292ZXIoIHRoaXMgKTtcclxuICAgIH1cclxufSIsImltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXIvRXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEV2ZW50T2JqIH0gZnJvbSBcIi4vRXZlbnRPYmpcIjtcclxuXHJcbi8qKlxyXG4gKiDkuovku7bmsaBcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjQuMjBcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50UG9vbCB7XHJcblxyXG5cdHByaXZhdGUgc3RhdGljIHBvb2w6QXJyYXk8RXZlbnRQb29sPiA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKCk6RXZlbnRQb29se1xyXG5cclxuICAgICAgICBsZXQgb2JqOkV2ZW50UG9vbCA9IEV2ZW50UG9vbC5wb29sLnNoaWZ0KCk7XHJcbiAgICAgICAgaWYoIG9iaiA9PSBudWxsICl7XHJcbiAgICAgICAgICAgIG9iaiA9IG5ldyBFdmVudFBvb2woKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlY292ZXIoIG9iajpFdmVudFBvb2wgKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggb2JqICE9IG51bGwgJiYgRXZlbnRQb29sLnBvb2wuaW5kZXhPZiggb2JqICkgPT0gLTEgKXtcclxuICAgICAgICAgICAgRXZlbnRQb29sLnBvb2wucHVzaCggb2JqICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRwcml2YXRlIF9ldmVudE9iakxpc3Q6QXJyYXk8RXZlbnRPYmo+ID0gbnVsbDtcclxuXHJcblx0cHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuXHRcdHRoaXMuX2V2ZW50T2JqTGlzdCA9IFtdO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog5re75Yqg5LqL5Lu255uR5ZCsXHJcblx0ICogQHBhcmFtIHR5cGUgXHRcdOS6i+S7tuexu+Wei1xyXG5cdCAqIEBwYXJhbSBsaXN0ZW5lciBcdOS6i+S7tuaWueazlVxyXG5cdCAqIEBwYXJhbSB0YXJnZXRcdOS6i+S7tuWvueixoVxyXG5cdCAqIEBwYXJhbSB0aGlzT2JqXHJcblx0ICovXHJcblx0cHVibGljIGFkZExpc3RlbmVyKCB0eXBlOnN0cmluZyAsIGxpc3RlbmVyOkZ1bmN0aW9uICwgdGFyZ2V0OkxheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCAsIHRoaXNPYmo6YW55ICk6dm9pZHtcclxuXHJcblx0XHRpZiggIXRoaXMuaGFzRXZlbnRMaXN0ZW5lcih0eXBlLGxpc3RlbmVyLHRhcmdldCx0aGlzT2JqKSApe1xyXG5cdFx0XHRsZXQgb2JqOkV2ZW50T2JqID0gRXZlbnRPYmouY3JlYXRlKCB0eXBlICwgbGlzdGVuZXIgLCB0YXJnZXQgLCB0aGlzT2JqICk7XHJcblx0XHRcdHRoaXMuX2V2ZW50T2JqTGlzdC5wdXNoKCBvYmogKTtcclxuXHRcdFx0RXZlbnRNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoIHR5cGUgLCBsaXN0ZW5lciAsIHRoaXNPYmogLCB0YXJnZXQgKTtcdFx0XHRcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOenu+mZpOS6i+S7tuebkeWQrFxyXG5cdCAqIEBwYXJhbSB0eXBlIFx0XHTkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW0gbGlzdGVuZXIgXHTkuovku7bmlrnms5VcclxuXHQgKiBAcGFyYW0gdGFyZ2V0XHTkuovku7blr7nosaFcclxuXHQgKiBAcGFyYW0gdGhpc09ialx0XHJcblx0ICovXHJcblx0cHVibGljIHJlbW92ZUxpc3RlbmVyKCB0eXBlOnN0cmluZyAsIGxpc3RlbmVyOkZ1bmN0aW9uICwgdGFyZ2V0OkxheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCAsIHRoaXNPYmo6YW55ICk6dm9pZHtcclxuXHJcblx0XHRsZXQgb2JqOkV2ZW50T2JqID0gbnVsbDtcclxuXHRcdGZvciggbGV0IGk9MDtpPHRoaXMuX2V2ZW50T2JqTGlzdC5sZW5ndGg7aSsrICl7XHJcblx0XHRcdG9iaiA9IHRoaXMuX2V2ZW50T2JqTGlzdFtpXTtcclxuXHRcdFx0aWYoIG9iaiAmJiBvYmoudHlwZSA9PSB0eXBlICYmIG9iai5saXN0ZW5lciA9PSBsaXN0ZW5lciAmJiBvYmoudGhpc09iaiA9PSB0aGlzT2JqICl7XHJcblx0XHRcdFx0dGhpcy5fZXZlbnRPYmpMaXN0LnNwbGljZShpLDEpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRFdmVudE1hbmFnZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZSAsIGxpc3RlbmVyICwgdGhpc09iaiAsIHRhcmdldCApO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog56e76Zmk5rGg6YeM5omA5pyJ5LqL5Lu255uR5ZCsLOS/neaMgeeahOWvueixoeS4jeS7juWIl+ihqOmHjOenu+mZpFxyXG5cdCAqL1xyXG5cdHB1YmxpYyByZW1vdmVBbGxMaXN0ZW5lcigpOnZvaWR7XHJcblxyXG5cdFx0bGV0IG9iajpFdmVudE9iaiA9IG51bGw7XHJcblx0XHRmb3IoIGxldCBpPTA7aTx0aGlzLl9ldmVudE9iakxpc3QubGVuZ3RoO2krKyApe1xyXG5cdFx0XHRvYmogPSB0aGlzLl9ldmVudE9iakxpc3RbaV07XHJcblx0XHRcdGlmKCBvYmogKXtcclxuXHRcdFx0XHRFdmVudE1hbmFnZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggb2JqLnR5cGUgLCBvYmoubGlzdGVuZXIgLCBvYmoudGhpc09iaiAsIG9iai50YXJnZXQgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog6YeN5paw55uR5ZCs5omA5pyJ5LqL5Lu2XHJcblx0ICovXHJcblx0cHVibGljIHJlbGlzdGVuZXJBbGwoKTp2b2lke1xyXG5cclxuXHRcdGxldCBvYmo6RXZlbnRPYmogPSBudWxsO1xyXG5cdFx0Zm9yKCBsZXQgaT0wO2k8dGhpcy5fZXZlbnRPYmpMaXN0Lmxlbmd0aDtpKysgKXtcclxuXHRcdFx0b2JqID0gdGhpcy5fZXZlbnRPYmpMaXN0W2ldO1xyXG5cdFx0XHRpZiggb2JqICl7XHJcblx0XHRcdFx0RXZlbnRNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoIG9iai50eXBlICwgb2JqLmxpc3RlbmVyICwgb2JqLnRoaXNPYmogLCBvYmoudGFyZ2V0ICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOaYr+WQpuacieafkOS4quebkeWQrFxyXG5cdCAqIEBwYXJhbSB0eXBlIFx0XHTkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW0gbGlzdGVuZXIgXHTkuovku7bmlrnms5VcclxuXHQgKiBAcGFyYW0gdGFyZ2V0XHTkuovku7blr7nosaFcclxuXHQgKiBAcGFyYW0gdGhpc09ialx0XHJcblx0ICovXHJcblx0cHVibGljIGhhc0V2ZW50TGlzdGVuZXIoIHR5cGU6c3RyaW5nICwgbGlzdGVuZXI6RnVuY3Rpb24gLCB0YXJnZXQ6TGF5YS5FdmVudERpc3BhdGNoZXIgPSBudWxsICwgdGhpc09iajphbnkgKTpib29sZWFue1xyXG5cclxuXHRcdGxldCBvYmo6RXZlbnRPYmogPSBudWxsO1xyXG5cdFx0Zm9yKCBvYmogb2YgdGhpcy5fZXZlbnRPYmpMaXN0ICl7XHJcblx0XHRcdGlmKCBvYmogJiYgb2JqLnR5cGUgPT0gdHlwZSAmJiBvYmoubGlzdGVuZXIgPT0gbGlzdGVuZXIgKXtcclxuXHRcdFx0XHRpZiggdGFyZ2V0ID09IG51bGwgKXtcclxuXHRcdFx0XHRcdHJldHVybiBvYmoudGhpc09iaiA9PSB0aGlzT2JqO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmV0dXJuIG9iai50YXJnZXQgPT0gdGFyZ2V0ICYmIG9iai50aGlzT2JqID09IHRoaXNPYmo7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDph4rmlL7otYTmupBcclxuXHQgKi9cclxuXHRwdWJsaWMgZGlzcG9zZSgpOnZvaWR7XHJcblxyXG5cdFx0d2hpbGUoIHRoaXMuX2V2ZW50T2JqTGlzdCAmJiB0aGlzLl9ldmVudE9iakxpc3QubGVuZ3RoID4gMCApe1xyXG5cdFx0XHRsZXQgb2JqOkV2ZW50T2JqID0gdGhpcy5fZXZlbnRPYmpMaXN0LnNoaWZ0KCk7XHJcblx0XHRcdGlmKCBvYmogKXtcclxuXHRcdFx0XHRFdmVudE1hbmFnZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggb2JqLnR5cGUgLCBvYmoubGlzdGVuZXIgLCBvYmoudGhpc09iaiAsIG9iai50YXJnZXQgKTtcclxuXHRcdFx0XHRvYmoucmVjb3ZlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLl9ldmVudE9iakxpc3QgPSBbXTtcclxuXHJcblx0XHRFdmVudFBvb2wucmVjb3ZlciggdGhpcyApO1xyXG5cdH1cclxufSIsIi8qKlxyXG4gKiDmuLjmiI/kuovku7ZcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjMuMjNcclxuICovXHJcbmV4cG9ydCBjbGFzcyBHYW1lRXZlbnQgZXh0ZW5kcyBMYXlhLkV2ZW50e1xyXG5cclxuXHQvKirpgInmi6kgKi9cclxuXHRwdWJsaWMgc3RhdGljIFNFTEVDVDpzdHJpbmcgPSBcIkdhbWVFdmVudC5zZWxlY3RcIjtcclxuXHJcblx0Lyoq5riy5p+T5LqL5Lu2ICovXHJcblx0cHVibGljIHN0YXRpYyBSRU5ERVI6c3RyaW5nID0gXCJHYW1lRXZlbnQucmVuZGVyXCI7XHJcblxyXG5cdC8qKuWKoOi9veWujOaIkCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgTE9BRF9DT01QTEVURTpzdHJpbmcgPSBcIkdhbWVFdmVudC5sb2FkQ29tcGxldGVcIjtcclxuXHJcblx0Lyoq6Iie5Y+w6Ieq6YCC5bqUICovXHJcblx0cHVibGljIHN0YXRpYyBTVEdBRV9SRVNJWkU6c3RyaW5nID0gXCJHYW1lRXZlbnQuc3RhZ2VSZXNpemVcIjtcclxuXHJcblx0Lyoq5Yqg6L296L+b5bqmICovXHJcblx0cHVibGljIHN0YXRpYyBMT0FEX1BST0dSRVNTOnN0cmluZyA9IFwiR2FtZUV2ZW50LmxvYWRQcm9ncmVzc1wiO1xyXG5cclxuXHQvKirliJfooajmuLLmn5MgKi9cclxuXHRwdWJsaWMgc3RhdGljIEVHTElTVF9SRU5ERVI6c3RyaW5nID0gXCJHYW1lRXZlbnQuRUdsaXN0UmVuZGVyXCI7XHJcblx0Lyoq5YiX6KGo5riy5p+T5a6M5oiQICovXHJcblx0cHVibGljIHN0YXRpYyBFR0xJU1RfQ09NUExFVEU6c3RyaW5nID0gXCJHYW1lRXZlbnQuRUdsaXN0Q29tcGxldGVcIjtcclxuXHJcblx0Lyoq57uT5p2f5byV5a+8ICovXHJcblx0cHVibGljIHN0YXRpYyBHVUlERV9FTkQ6c3RyaW5nID0gXCJHYW1lRXZlbnQuZ3VpZGVFbmRcIjtcclxuXHJcblx0Lyoq5a+75om+5byV5a+85a+56LGhICovXHJcblx0cHVibGljIHN0YXRpYyBHVUlERV9TRUFSQ0hfVEFSR0VUOnN0cmluZyA9IFwiR2FtZUV2ZW50Lmd1aWRlU2VhcmNoVGFyZ2V0XCI7XHJcblxyXG5cdC8qKuiuvue9ruW8leWvvOebruagh+WvueixoSAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgR1VJREVfVEFSR0VUOnN0cmluZyA9IFwiR2FtZUV2ZW50Lmd1aWRlVGFyZ2V0XCI7XHJcblxyXG5cdC8qKuS4u+WKoOi9veeVjOmdouWKoOi9veWujOaIkCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgTUFJTl9MT0FEX0NPTVBMRVRFOnN0cmluZyA9IFwiR2FtZUV2ZW50Lm1haW5Mb2FkQ29tcGxldGVcIjtcclxuXHJcblx0Lyoq5byA5aeL5ri45oiPICovXHJcblx0cHVibGljIHN0YXRpYyBTVEFSVF9HQU1FOnN0cmluZyA9IFwiR2FtZUV2ZW50LnN0YWdlR2FtZVwiO1xyXG5cclxuXHQvKirmt7vliqDmtojmga8gKi9cclxuXHRwdWJsaWMgc3RhdGljIEFERF9NRVNTQUdFOnN0cmluZyA9IFwiR2FtZUV2ZW50LmFkZE1lc3NhZ2VcIjtcclxuXHJcblx0Lyoq5pKt5pS+5bm/5ZGKICovXHJcblx0cHVibGljIHN0YXRpYyBQTEFZX0FEOnN0cmluZyA9IFwiR2FtZUV2ZW50LnBsYXlBZFwiO1xyXG5cclxuXHQvKirmkq3mlL7lub/lkYrlrozmiJAgKi9cclxuXHRwdWJsaWMgc3RhdGljIEVORF9QTEFZX0FEOnN0cmluZyA9IFwiR2FtZUV2ZW50LmVuZFBsYXlBZFwiO1xyXG5cclxuXHRwdWJsaWMgdGhpc09iamVjdDphbnkgPSBudWxsO1xyXG5cclxuXHRwcml2YXRlIF9kYXRhOmFueSA9IG51bGw7XHJcblxyXG5cdHB1YmxpYyBjb25zdHJ1Y3RvciggdHlwZTogc3RyaW5nICwgZGF0YT86IGFueSApIHtcclxuXHJcblx0XHRzdXBlcigpO1xyXG5cclxuXHRcdHRoaXMudHlwZSA9IHR5cGU7XHJcblx0XHR0aGlzLl9kYXRhID0gZGF0YTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgZGF0YSggdmFsdWU6YW55ICl7XHJcblx0XHR0aGlzLl9kYXRhID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGRhdGEoKTphbnl7XHJcblx0XHRyZXR1cm4gdGhpcy5fZGF0YTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgUmVzb3VyY2UgZnJvbSBcIi4vcmVzb3VyY2UvUmVzb3VyY2VcIjtcclxuaW1wb3J0IExvYWRlckV2ZW50IGZyb20gXCIuL2V2ZW50L0xvYWRlckV2ZW50XCI7XHJcbmltcG9ydCBHcm91cFJlc291cmNlIGZyb20gXCIuL3Jlc291cmNlL0dyb3VwUmVzb3VyY2VcIjtcclxuaW1wb3J0IExvYWRVdGlscyBmcm9tIFwiLi91dGlscy9Mb2FkVXRpbHNcIjtcclxuaW1wb3J0IFR4dFJlc291cmNlIGZyb20gXCIuL3Jlc291cmNlL1R4dFJlc291cmNlXCI7XHJcbmltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXIvRXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCBMb2cgZnJvbSBcIi4uL2xvZy9Mb2dcIjtcclxuXHJcbi8qKlxyXG4gKiDliqDovb3otYTmupDnrqHnkIZcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRTb3VyY2VNYW5hZ2VyIHtcclxuXHJcbiAgICAvKirliqDovb3otYTmupDnrqHnkIYgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGxvYWRNYXA6IExheWEuV2Vha09iamVjdCA9IG51bGw7XHJcbiAgICAvKirotYTmupDnu4TlrZflhbggKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGdyb3VwTWFwOiBPYmplY3QgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yid5aeL5YyWXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdCgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgTG9hZFNvdXJjZU1hbmFnZXIubG9hZE1hcCA9IG5ldyBMYXlhLldlYWtPYmplY3QoKTtcclxuICAgICAgICBMb2FkU291cmNlTWFuYWdlci5ncm91cE1hcCA9IHt9O1xyXG5cclxuICAgICAgICBFdmVudE1hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihMb2FkZXJFdmVudC5MT0FEX1NJTkdMRV9DT01QTEVURSwgdGhpcy5sb2FkU2luZ2xlQ29tcGxldGUsIHRoaXMpO1xyXG4gICAgICAgIEV2ZW50TWFuYWdlci5hZGRFdmVudExpc3RlbmVyKExvYWRlckV2ZW50LkxPQURfR1JPVVBfQ09NUExFVEUsIHRoaXMubG9hZEdyb3VwQ29tcGxldGUsIHRoaXMpO1xyXG5cclxuICAgICAgICAvL0xheWEudGltZXIubG9vcCgxMDAwMCwgdGhpcywgdGhpcy5jaGVja1Jlcyk7Ly/mo4DmtYvotYTmupDmmK/lkKblm57mlLYs5pqC5a6aMTDnp5Lpkp/lm57mlLbkuIDmrKFcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWKoOi9veWNleS4qui1hOa6kOWujOaIkFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2FkU2luZ2xlQ29tcGxldGUoc291cmNlOiBzdHJpbmcgfCBSZXNvdXJjZSk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgcmVzOiBSZXNvdXJjZSA9IHR5cGVvZiBzb3VyY2UgPT09IFwic3RyaW5nXCIgPyB0aGlzLmdldFJlcyhzb3VyY2UpIDogc291cmNlO1xyXG4gICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgZ3JvdXBSZXM6IEdyb3VwUmVzb3VyY2UgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQga2V5OmFueTtcclxuICAgICAgICAgICAgZm9yICgga2V5IGluIHRoaXMuZ3JvdXBNYXApIHtcclxuICAgICAgICAgICAgICAgIGdyb3VwUmVzID0gdGhpcy5ncm91cE1hcFtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwUmVzICYmIGdyb3VwUmVzLmhhc1VybChyZXMudXJsKSAmJiBncm91cFJlcy5pc0xvYWRlZCgpKSB7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBFdmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudChMb2FkZXJFdmVudC5MT0FEX0dST1VQX0NPTVBMRVRFLCBncm91cFJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3nu4TotYTmupDlrozmiJBcclxuICAgICAqIEBwYXJhbSBncm91cE5hbWUgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGxvYWRHcm91cENvbXBsZXRlKHNvdXJjZTogc3RyaW5nIHwgR3JvdXBSZXNvdXJjZSk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgZ3JvdXBSZXM6IEdyb3VwUmVzb3VyY2UgPSB0eXBlb2Ygc291cmNlID09PSBcInN0cmluZ1wiID8gPEdyb3VwUmVzb3VyY2U+dGhpcy5nZXRSZXMoc291cmNlKSA6IHNvdXJjZTtcclxuICAgICAgICBpZiAoZ3JvdXBSZXMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBMb2cubG9nKCB0aGlzICwgXCLliqDovb3otYTmupDnu4RbXCIrZ3JvdXBSZXMubmFtZStcIl3lrozmiJAhXCIpO1xyXG4gICAgICAgICAgICBpZiAoZ3JvdXBSZXMuY29tcGxldGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBSZXMuY29tcGxldGUucnVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3nu4TotYTmupBcclxuICAgICAqIEBwYXJhbSBncm91cE5hbWUg6LWE5rqQ57uE5ZCN5a2XLOW4uOinhOS4jeW4puespuWPt+eahOWtl+espuS4su+8jOWtl+avjSvmlbDnu4RcclxuICAgICAqIEBwYXJhbSB1cmxsaXN0IOi1hOa6kOWcsOWdgOWIl+ihqFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWRHcm91cChncm91cE5hbWU6IHN0cmluZyA9IFwiXCIsIHVybGxpc3Q6IEFycmF5PHN0cmluZz4sIGNvbXBsZXRlOiBMYXlhLkhhbmRsZXIgPSBudWxsLCBwcm9ncmVzczogTGF5YS5IYW5kbGVyID0gbnVsbCk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAoIWdyb3VwTmFtZSkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBncm91cGxpc3Q6IEFycmF5PFJlc291cmNlPiA9IHRoaXMubG9hZE1hcC5nZXQoZ3JvdXBOYW1lKTtcclxuICAgICAgICBpZiAoZ3JvdXBsaXN0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgZ3JvdXBsaXN0ID0gW107XHJcbiAgICAgICAgICAgIGlmICh1cmxsaXN0ICE9IG51bGwgJiYgdXJsbGlzdC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVybGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSB1cmxsaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXM6IFJlc291cmNlID0gdGhpcy5sb2FkTWFwLmdldCh1cmwpIHx8IExvYWRTb3VyY2VNYW5hZ2VyLmNyZWF0ZSh1cmwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwbGlzdC5wdXNoKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkTWFwLnNldChyZXMudXJsLCByZXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgZ3JvdXBSZXM6IEdyb3VwUmVzb3VyY2UgPSB0aGlzLmdyb3VwTWFwWyBncm91cE5hbWUgXTsgXHJcbiAgICAgICAgICAgIGlmKCBncm91cFJlcyA9PSBudWxsICl7XHJcbiAgICAgICAgICAgICAgICBncm91cFJlcyA9IExvYWRTb3VyY2VNYW5hZ2VyLmNyZWF0ZShncm91cGxpc3QsIGNvbXBsZXRlLCBwcm9ncmVzcyk7XHJcbiAgICAgICAgICAgICAgICBncm91cFJlcy5uYW1lID0gZ3JvdXBOYW1lO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBSZXMubG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cE1hcFtncm91cE5hbWVdID0gZ3JvdXBSZXM7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmKCBjb21wbGV0ZSAhPSBudWxsICl7XHJcbiAgICAgICAgICAgICAgICBpZiggZ3JvdXBSZXMuaXNMb2FkZWQoKSApe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlLnJ1bigpO1xyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIExheWEuTG9nLnByaW50KFwi5bey57uP5pyJ6K+l6LWE5rqQ57uE5LqG77yBXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH0gXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJvlu7rliqDovb3otYTmupDnsbtcclxuICAgICAqIEBwYXJhbSB1cmxcclxuICAgICAqIEBwYXJhbSBjb21wbGV0ZSBcclxuICAgICAqIEBwYXJhbSBwcm9ncmVzcyBcclxuICAgICAqIEBwYXJhbSBlcnJvciBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUodXJsOiBhbnksIGNvbXBsZXRlOiBMYXlhLkhhbmRsZXIgPSBudWxsLCBwcm9ncmVzczogTGF5YS5IYW5kbGVyID0gbnVsbCwgZXJyb3I6IExheWEuSGFuZGxlciA9IG51bGwpOiBhbnkge1xyXG5cclxuICAgICAgICBsZXQgcmVzOiBSZXNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgbGV0IGV4dDogc3RyaW5nID0gdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiA/IExvYWRVdGlscy5nZXRGaWxlRXh0KHVybCkgOiBcIlwiO1xyXG4gICAgICAgIGlmICh1cmwgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICByZXMgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q2xhc3MoR3JvdXBSZXNvdXJjZS5LRVksIEdyb3VwUmVzb3VyY2UpO1xyXG4gICAgICAgICAgICByZXMudHlwZSA9IFJlc291cmNlLlRZUEVfR1JPVVA7XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHQgPT0gXCJwbmdcIiB8fCBleHQgPT0gXCJqcGdcIiB8fCBleHQgPT0gXCJibXBcIikge1xyXG4gICAgICAgICAgICByZXMgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q2xhc3MoUmVzb3VyY2UuS0VZLCBSZXNvdXJjZSk7XHJcbiAgICAgICAgICAgIHJlcy50eXBlID0gTGF5YS5Mb2FkZXIuSU1BR0U7XHJcbiAgICAgICAgfSBlbHNlIGlmIChleHQgPT0gXCJ0eHRcIiB8fCBleHQgPT0gXCJqc29uXCIpIHtcclxuICAgICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKFR4dFJlc291cmNlLktFWSwgVHh0UmVzb3VyY2UpO1xyXG4gICAgICAgICAgICByZXMudHlwZSA9IExheWEuTG9hZGVyLlRFWFQ7XHJcbiAgICAgICAgfSBlbHNlIHsvL+S6jOi/m+WItui1hOa6kFxyXG4gICAgICAgICAgICByZXMgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q2xhc3MoUmVzb3VyY2UuS0VZLCBSZXNvdXJjZSk7XHJcbiAgICAgICAgICAgIHJlcy50eXBlID0gTGF5YS5Mb2FkZXIuQlVGRkVSO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgIHJlcy5jcmVhdGUodXJsLCBjb21wbGV0ZSwgcHJvZ3Jlc3MsIGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWKoOi9vei1hOa6kFxyXG4gICAgICogQHBhcmFtIHNvdXJjZSDotYTmupBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKHNvdXJjZTogc3RyaW5nIHwgUmVzb3VyY2UsIGNvbXBsZXRlOiBMYXlhLkhhbmRsZXIgPSBudWxsLCBlcnJvcjogTGF5YS5IYW5kbGVyID0gbnVsbCk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAoIXNvdXJjZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCByZXM6IFJlc291cmNlID0gbnVsbDtcclxuICAgICAgICBpZiAodHlwZW9mIHNvdXJjZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICByZXMgPSB0aGlzLmxvYWRNYXAuZ2V0KHNvdXJjZSk7XHJcbiAgICAgICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlcyA9IExvYWRTb3VyY2VNYW5hZ2VyLmNyZWF0ZShzb3VyY2UsIGNvbXBsZXRlLCBlcnJvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzb3VyY2UgaW5zdGFuY2VvZiBSZXNvdXJjZSkge1xyXG4gICAgICAgICAgICByZXMgPSBzb3VyY2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVzID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzLmdldFJlcyhmYWxzZSkgIT0gbnVsbCkgey8v6LWE5rqQ5bey5Yqg6L295a6M5oiQXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzLmxvYWQoKTtcclxuICAgICAgICB0aGlzLmxvYWRNYXAuc2V0KHJlcy51cmwsIHJlcyk7XHJcbiAgICAgICAgbGV0IGlzQnJlYWs6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5sb2FkTWFwKSB7XHJcbiAgICAgICAgICAgIHJlcyA9IHRoaXMubG9hZE1hcC5nZXQoa2V5KTtcclxuICAgICAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICAgICAgaXNCcmVhayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNCcmVhaykge1xyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLmxvb3AoMTAwMCwgdGhpcywgdGhpcy5jaGVja1Jlcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5jbGVhcih0aGlzLCB0aGlzLmNoZWNrUmVzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmo4DmtYvotYTmupDmmK/lkKblj6/lm57mlLZcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2hlY2tSZXMoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCByZXM6IFJlc291cmNlO1xyXG4gICAgICAgIGZvciAobGV0IHVybCBpbiB0aGlzLmxvYWRNYXApIHtcclxuICAgICAgICAgICAgcmVzID0gdGhpcy5sb2FkTWFwLmdldCh1cmwpO1xyXG4gICAgICAgICAgICBpZiAocmVzICYmIHJlcy5jYW5HYygpKSB7XHJcbiAgICAgICAgICAgICAgICByZXMucmVjb3ZlcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkTWFwLmRlbCh1cmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL+ajgOa1i+e7hOi1hOa6kCBUT0RPXHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W6LWE5rqQ5pWw5o2uXHJcbiAgICAgKiBAcGFyYW0gdXJsIOi1hOa6kOWcsOWdgCzmiJbogIXnu4TotYTmupDlkI1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSZXModXJsOiBzdHJpbmcpOiBSZXNvdXJjZSB8IEdyb3VwUmVzb3VyY2Uge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5sb2FkTWFwLmdldCh1cmwpIHx8IHRoaXMuZ3JvdXBNYXBbIHVybCBdICE9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5botYTmupBcclxuICAgICAqIEBwYXJhbSB1cmwg6LWE5rqQ5Zyw5Z2AXHJcbiAgICAgKiBAcGFyYW0gaXNDb3VudCDmmK/lkKborqHmlbBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRTb3VyY2UodXJsOiBzdHJpbmcsIGlzQ291bnQ6IGJvb2xlYW4gPSBmYWxzZSk6IGFueSB7XHJcblxyXG4gICAgICAgIGxldCByZXM6IFJlc291cmNlID0gdGhpcy5sb2FkTWFwLmdldCh1cmwpO1xyXG4gICAgICAgIHJldHVybiByZXMgJiYgcmVzLmdldFJlcyhpc0NvdW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHiuaUvui1hOa6kFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGRlc3Ryb3lSZXModXJsOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcblxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog57qv57K55Yqg6L296LWE5rqQ566h55CGXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTG9hZGVyTWFuYWdlciB7XHJcblxyXG4gICAgLyoq5Yqg6L296Zif5YiX5LiK6ZmQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIExPQURfTElNSVQ6IG51bWJlciA9IDU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlh4blpIfliqDovb3liJfooahcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZHlMb2FkTGlzdDogQXJyYXk8UmVzb3VyY2U+ID0gW107XHJcblxyXG4gICAgLyoq5q2j5Zyo5Yqg6L2955qE5YiX6KGoICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2FkaW5nTGlzdDogQXJyYXk8UmVzb3VyY2U+ID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3otYTmupBcclxuICAgICAqIEBwYXJhbSBzb3VyY2Ug6LWE5rqQ5Zyw5Z2A5oiWUmVzb3VyY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKHNvdXJjZTogc3RyaW5nIHwgUmVzb3VyY2UpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IHJlczogUmVzb3VyY2UgPSB0eXBlb2Ygc291cmNlID09PSBcInN0cmluZ1wiID8gTG9hZFNvdXJjZU1hbmFnZXIuZ2V0UmVzKHNvdXJjZSkgOiBzb3VyY2U7XHJcbiAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5sb2FkaW5nTGlzdC5sZW5ndGggPCB0aGlzLkxPQURfTElNSVQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxvYWRpbmdMaXN0LmluZGV4T2YocmVzKSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8v6LWE5rqQ5q2j5Zyo5Yqg6L29XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nTGlzdC5wdXNoKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAvL0xvZy5sb2codGhpcywgXCLlvIDlp4vliqDovb3otYTmupAgdXJsOiBcIiArIHJlcy51cmwsIExvZy5UWVBFX0xPQUQpOy8v5omT5Y2w5pel5b+XXHJcbiAgICAgICAgICAgICAgICBMYXlhLmxvYWRlci5sb2FkKFt7IHVybDogcmVzLnVybCwgdHlwZTogcmVzLnR5cGUgfV0sIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkxvYWRlZCwgW3Jlc10sIHRydWUpLCByZXMucHJvZ3Jlc3MpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmVhZHlMb2FkTGlzdC5pbmRleE9mKHJlcykgPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVhZHlMb2FkTGlzdC5wdXNoKHJlcyk7XHJcbiAgICAgICAgICAgICAgICAvL+i/memHjOagueaNruS8mOWFiOe6p+aOkuW6j1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5yZWFkeUxvYWRMaXN0ID0gdGhpcy5yZWFkeUxvYWRMaXN0LnNvcnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBvbkxvYWRlZChyZXM6IFJlc291cmNlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHJlcy5sb2FkQ29tcGxldGUoKTtcclxuICAgICAgICAvL+S7juWKoOi9veWIl+ihqOenu+mZpFxyXG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gdGhpcy5sb2FkaW5nTGlzdC5pbmRleE9mKHJlcyk7XHJcbiAgICAgICAgaWYgKGluZGV4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgTG9nLmxvZyh0aGlzLCBcIuWKoOi9vei1hOa6kCB1cmzvvJpcIiArIHJlcy51cmwgKyBcIuWujOaIkOOAglwiLCBMb2cuVFlQRV9MT0FEKTtcclxuICAgICAgICBFdmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudChMb2FkZXJFdmVudC5MT0FEX1NJTkdMRV9DT01QTEVURSwgcmVzKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkTmV4dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGxvYWROZXh0KCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgcmVzOiBSZXNvdXJjZSA9IHRoaXMucmVhZHlMb2FkTGlzdC5zaGlmdCgpO1xyXG4gICAgICAgIGlmIChyZXMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQocmVzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICog5Yqg6L295LqL5Lu2XHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkZXJFdmVudCAge1xyXG4gICAgXHJcbiAgICAvKirliqDovb3ljZXkuKrotYTmupDlrozmiJAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTE9BRF9TSU5HTEVfQ09NUExFVEU6c3RyaW5nID0gXCJMb2FkZXJFdmVudC5sb2FkU2luZ2xlQ29tcGxldGVcIjtcclxuICAgIC8qKuWKoOi9vee7hOi1hOa6kOWujOaIkCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBMT0FEX0dST1VQX0NPTVBMRVRFOnN0cmluZyA9IFwiTG9hZGVyRXZlbnQubG9hZEdyb3VwQ29tcGxldGVcIjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoICApe1xyXG5cclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUmVzb3VyY2UgZnJvbSBcIi4vUmVzb3VyY2VcIjtcclxuaW1wb3J0IHsgTG9hZGVyTWFuYWdlciB9IGZyb20gXCIuLi9Mb2FkU291cmNlTWFuYWdlclwiO1xyXG5pbXBvcnQgTG9nIGZyb20gXCIuLi8uLi9sb2cvTG9nXCI7XHJcblxyXG4vKipcclxuICog57uE6LWE5rqQXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcm91cFJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEtFWTpzdHJpbmcgPSBcIkdyb3VwUmVzb3VyY2VcIjtcclxuXHJcbiAgICBwcml2YXRlIF9saXN0OkFycmF5PFJlc291cmNlPiA9IG51bGw7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBcclxuXHJcbiAgICAgICAgc3VwZXIoKTsgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZSggdXJsOkFycmF5PFJlc291cmNlPiA9IG51bGwgLCBjb21wbGV0ZTpMYXlhLkhhbmRsZXIgPSBudWxsICwgcHJvZ3Jlc3M6TGF5YS5IYW5kbGVyID0gbnVsbCAsIGVycm9yOkxheWEuSGFuZGxlciA9IG51bGwgICk6dm9pZHtcclxuXHJcbiAgICAgICAgLy8gdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5fbGlzdCA9IHVybDtcclxuICAgICAgICB0aGlzLl9jb21wbGV0ZSA9IGNvbXBsZXRlO1xyXG4gICAgICAgIHRoaXMuX3Byb2dyZXNzID0gcHJvZ3Jlc3M7XHJcbiAgICAgICAgdGhpcy5fZXJyb3IgPSBlcnJvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9hZCgpOnZvaWR7XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLl9saXN0ICYmIHRoaXMuX2xpc3QubGVuZ3RoID4gMCApe1xyXG4gICAgICAgICAgICBsZXQgaXNCcmVhazpib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCByZXM6UmVzb3VyY2U7XHJcbiAgICAgICAgICAgIGZvciggcmVzIG9mIHRoaXMuX2xpc3QgKXtcclxuICAgICAgICAgICAgICAgIGlmKCByZXMgJiYgcmVzLmdldFJlcyggZmFsc2UgKSA9PSBudWxsICl7ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBMb2FkZXJNYW5hZ2VyLmxvYWQoIHJlcy51cmwgKTtcclxuICAgICAgICAgICAgICAgICAgICBpZighaXNCcmVhayl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQnJlYWsgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZighaXNCcmVhayAmJiB0aGlzLl9jb21wbGV0ZSAhPSBudWxsICl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21wbGV0ZS5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi1hOa6kOe7hOaYr+WQpuWKoOi9veWujOaIkFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaXNMb2FkZWQoKTpib29sZWFue1xyXG5cclxuICAgICAgICBpZiggdGhpcy5fbGlzdCAmJiB0aGlzLl9saXN0Lmxlbmd0aCA+IDAgKXtcclxuICAgICAgICAgICAgbGV0IHJlczpSZXNvdXJjZTtcclxuICAgICAgICAgICAgZm9yKCByZXMgb2YgdGhpcy5fbGlzdCApe1xyXG4gICAgICAgICAgICAgICAgaWYoIHJlcyAmJiByZXMuZ2V0UmVzKCBmYWxzZSApID09IG51bGwgKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZSBpZiggIXRoaXMuX2xpc3QgKXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmK/lkKbmnInlr7nlupTlnLDlnYDotYTmupBcclxuICAgICAqIEBwYXJhbSB1cmwg6LWE5rqQ5Zyw5Z2AXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBoYXNVcmwoIHVybDpzdHJpbmcgKTpib29sZWFue1xyXG5cclxuICAgICAgICBsZXQgcmVzOlJlc291cmNlO1xyXG4gICAgICAgIGZvciggcmVzIG9mIHRoaXMuX2xpc3QgKXtcclxuICAgICAgICAgICAgaWYoIHJlcyAmJiByZXMudXJsID09IHVybCApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6LWE5rqQ5piv5ZCm5bey5Yqg6L29XHJcbiAgICAgKiBAcGFyYW0gdXJsIOi1hOa6kOWcsOWdgFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaGFzTG9hZGVkKCB1cmw6c3RyaW5nICk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgbGV0IHJlczpSZXNvdXJjZTtcclxuICAgICAgICBmb3IoIHJlcyBvZiB0aGlzLl9saXN0ICl7XHJcbiAgICAgICAgICAgIGlmKCByZXMgJiYgcmVzLnVybCA9PSB1cmwgJiYgcmVzLmdldFJlcyggZmFsc2UgKSAhPSBudWxsICl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgTG9hZFV0aWxzIGZyb20gXCIuLi91dGlscy9Mb2FkVXRpbHNcIjtcclxuaW1wb3J0IHsgTG9hZGVyTWFuYWdlciB9IGZyb20gXCIuLi9Mb2FkU291cmNlTWFuYWdlclwiO1xyXG5cclxuLyoqXHJcbiAqIOi1hOa6kOWfuuexu1xyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzb3VyY2UgaW1wbGVtZW50cyBJUmVzb3VyY2Uge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgS0VZOnN0cmluZyA9IFwiUmVzb3VyY2VcIjtcclxuXHJcbiAgICAvKirlm57mlLbpl7TpmpTml7bpl7TvvIzmr6vnp5IgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgR0NfR0FQVElNRTpudW1iZXIgPSAxMDAwMDtcclxuXHJcbiAgICAvKirlm77niYfotYTmupAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVFlQRV9JTUFHRTpzdHJpbmcgPSBcImltYWdlXCI7XHJcbiAgICAvKirmlofmnKzotYTmupAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVFBZRV9URVhUOnN0cmluZyA9IFwidGV4dFwiO1xyXG4gICAgLyoq5LqM6L+b5Yi26LWE5rqQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRZUEVfQklOOnN0cmluZyA9IFwiYmluXCI7XHJcbiAgICAvKirnu4TotYTmupAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVFlQRV9HUk9VUDpzdHJpbmcgPSBcImdyb3VwXCI7XHJcblxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBjcmVhdGUoIHVybDphbnkgLCBjb21wbGV0ZTpMYXlhLkhhbmRsZXIgPSBudWxsICwgcHJvZ3Jlc3M6TGF5YS5IYW5kbGVyID0gbnVsbCAsIGVycm9yOkxheWEuSGFuZGxlciA9IG51bGwgKTphbnl7XHJcblxyXG4gICAgLy8gICAgIGxldCByZXM6UmVzb3VyY2UgPSBudWxsO1xyXG4gICAgLy8gICAgIGxldCBleHQ6c3RyaW5nID0gTG9hZFV0aWxzLmdldEZpbGVFeHQoIHVybCApO1xyXG4gICAgLy8gICAgIGlmKCBleHQgPT0gXCJwbmdcIiB8fCBleHQgPT0gXCJqcGdcIiB8fCBleHQgPT0gXCJibXBcIiApe1xyXG4gICAgLy8gICAgICAgICByZXMgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q2xhc3MoIFJlc291cmNlLktFWSAsIFJlc291cmNlICk7XHJcbiAgICAvLyAgICAgICAgIHJlcy50eXBlID0gTGF5YS5Mb2FkZXIuSU1BR0U7XHJcbiAgICAvLyAgICAgfWVsc2UgaWYoIGV4dCA9PSBcInR4dFwiIHx8IGV4dCA9PSBcImpzb25cIiApe1xyXG4gICAgLy8gICAgICAgICByZXMgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q2xhc3MoIFR4dFJlc291cmNlLktFWSAsIFR4dFJlc291cmNlICk7XHJcbiAgICAvLyAgICAgICAgIHJlcy50eXBlID0gTGF5YS5Mb2FkZXIuVEVYVDtcclxuICAgIC8vICAgICB9ZWxzZSBpZiggdXJsIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgLy8gICAgICAgICByZXMgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q2xhc3MoIEdyb3VwUmVzb3VyY2UuS0VZICwgR3JvdXBSZXNvdXJjZSApO1xyXG4gICAgLy8gICAgICAgICByZXMudHlwZSA9IFJlc291cmNlLlRZUEVfR1JPVVA7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIGlmKHJlcyl7XHJcbiAgICAvLyAgICAgICAgIHJlcy5jcmVhdGUoIHVybCAsIGNvbXBsZXRlICwgcHJvZ3Jlc3MgLCBlcnJvciApO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICByZXR1cm4gcmVzO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Zue5pS26LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gcmVzIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlY292ZXIoIHJlczpSZXNvdXJjZSApOnZvaWR7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIHJlcyApe1xyXG4gICAgICAgICAgICByZXMuY2xlYXIoKTtcclxuICAgICAgICAgICAgTGF5YS5Qb29sLnJlY292ZXIoIHR5cGVvZiByZXMgLCByZXMgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIC8qKui1hOa6kOWQjeWtlyAqL1xyXG4gICAgcHVibGljIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIC8qKuWKoOi9veWcsOWdgCAqL1xyXG4gICAgcHVibGljIHVybDpzdHJpbmcgPSBcIlwiO1xyXG4gICAgLyoq6LWE5rqQ57G75Z6LICovXHJcbiAgICBwdWJsaWMgdHlwZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgLyoq5LiL6L295LyY5YWI57qnICovXHJcbiAgICBwdWJsaWMgcHJpb3JpdHk6bnVtYmVyID0gMDtcclxuICAgIC8qKuWKoOi9veWujOaIkOS6i+S7tiAqL1xyXG4gICAgcHJvdGVjdGVkIF9jb21wbGV0ZTpMYXlhLkhhbmRsZXIgPSBudWxsO1xyXG4gICAgLyoq6L+b5bqm5LqL5Lu2ICovXHJcbiAgICBwcm90ZWN0ZWQgX3Byb2dyZXNzOkxheWEuSGFuZGxlciA9IG51bGw7XHJcbiAgICAvKirplJnor6/kuovku7YgKi9cclxuICAgIHByb3RlY3RlZCBfZXJyb3I6TGF5YS5IYW5kbGVyID0gbnVsbDtcclxuICAgIC8qKui1hOa6kOaVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIF9kYXRhOmFueSA9IG51bGw7XHJcbiAgICAvKirkvb/nlKjorqHmlbAgKi9cclxuICAgIHByb3RlY3RlZCBfdXNlQ291bnQ6bnVtYmVyID0gMDtcclxuICAgIC8qKuWbnuaUtuaXtumXtCAqL1xyXG4gICAgcHJvdGVjdGVkIF9nY1RpbWU6bnVtYmVyID0gMDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoIHVybDpzdHJpbmcgPSBcIlwiICwgY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbCAsIGVycm9yOkxheWEuSGFuZGxlciA9IG51bGwgKSB7IFxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSggdXJsICwgY29tcGxldGUgLCBlcnJvciApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoIHVybDphbnkgPSBcIlwiICwgY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbCAsIHByb2dyZXNzOkxheWEuSGFuZGxlciA9IG51bGwgLCBlcnJvcjpMYXlhLkhhbmRsZXIgPSBudWxsICApOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMuX2NvbXBsZXRlID0gY29tcGxldGU7XHJcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3MgPSBwcm9ncmVzcztcclxuICAgICAgICB0aGlzLl9lcnJvciA9IGVycm9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb2FkKCk6dm9pZHtcclxuXHJcbiAgICAgICAgLy8gTGF5YS5sb2FkZXIubG9hZChbXHJcblx0XHQvLyBcdHsgdXJsOiBcInJlcy9mYWlydWkvY29tbW9uX2F0bGFzMC5wbmdcIiwgdHlwZTogTGF5YS5Mb2FkZXIuSU1BR0UgfSxcclxuXHRcdC8vIFx0eyB1cmw6IFwicmVzL2ZhaXJ1aS9jb21tb24ubWFwXCIsIHR5cGU6IExheWEuTG9hZGVyLkJVRkZFUiB9XHJcbiAgICAgICAgLy8gICAgIF0sIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkxvYWRlZCkpO1xyXG5cclxuICAgICAgICBMb2FkZXJNYW5hZ2VyLmxvYWQoIHRoaXMudXJsICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlY292ZXIoKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggdGhpcy5fdXNlQ291bnQgPD0gMCApe1xyXG4gICAgICAgICAgICBSZXNvdXJjZS5yZWNvdmVyKCB0aGlzICk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvYWRDb21wbGV0ZSgpOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMuX2RhdGEgPSBMYXlhLmxvYWRlci5nZXRSZXMoIHRoaXMudXJsICk7XHJcbiAgICAgICAgdGhpcy5fdXNlQ291bnQgPSAwO1xyXG4gICAgICAgIGlmKCB0aGlzLl9jb21wbGV0ZSAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlLnJ1bigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlui1hOa6kFxyXG4gICAgICogQHBhcmFtIGlzQ291bnQg5piv5ZCm6K6h5pWwXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRSZXMoIGlzQ291bnQ6Ym9vbGVhbiA9IHRydWUgKTphbnl7XHJcblxyXG4gICAgICAgIGlmKCBpc0NvdW50ICl7XHJcbiAgICAgICAgICAgIHRoaXMuX3VzZUNvdW50Kys7XHJcbiAgICAgICAgICAgIHRoaXMuX2djVGltZSA9IExheWEudGltZXIuY3VyckZyYW1lICsgUmVzb3VyY2UuR0NfR0FQVElNRTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHVzZUNvdW50KCk6bnVtYmVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fdXNlQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5piv5ZCm5Y+v5Zue5pS2ICovXHJcbiAgICBwdWJsaWMgY2FuR2MoKTpib29sZWFue1xyXG5cclxuICAgICAgICByZXR1cm4gTGF5YS50aW1lci5jdXJyRnJhbWUgPiB0aGlzLl9nY1RpbWUgJiYgdGhpcy5fdXNlQ291bnQgPD0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNMb2FkZWQoKTpib29sZWFue1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YSAhPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjaGVjaygpOnZvaWR7XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLmNhbkdjKCkgKXtcclxuICAgICAgICAgICAgdGhpcy5yZWNvdmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY29tcGxldGUoKTpMYXlhLkhhbmRsZXJ7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21wbGV0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHByb2dyZXNzKCk6TGF5YS5IYW5kbGVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3Jlc3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyKCk6dm9pZHtcclxuICAgICAgICBcclxuICAgICAgICBpZiggdGhpcy5fY29tcGxldGUgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZS5yZWNvdmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLl9wcm9ncmVzcyAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyZXNzLnJlY292ZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMuX2Vycm9yICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5fZXJyb3IucmVjb3ZlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb21wbGV0ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3MgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2Vycm9yID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9kYXRhID0gbnVsbDtcclxuICAgICAgICB0aGlzLnVybCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fZ2NUaW1lID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpOnZvaWR7XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLl91c2VDb3VudCA+IDAgKXtcclxuICAgICAgICAgICAgdGhpcy5fdXNlQ291bnQtLTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFJlc291cmNlIGZyb20gXCIuL1Jlc291cmNlXCI7XHJcblxyXG4vKipcclxuICog5paH5pys6LWE5rqQXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUeHRSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHsgICAgXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgS0VZOnN0cmluZyA9IFwiVHh0UmVzb3VyY2VcIjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgXHJcbiAgICAgICAgc3VwZXIoKTsgXHJcbiAgICB9XHJcblxyXG5cclxufSIsIi8qKlxyXG4gKiDliqDovb3lt6XlhbdcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRVdGlsc3tcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflvpfmlofku7blkI7nvIDlkI1cclxuICAgICAqIEBwYXJhbSB1cmwg5paH5Lu26Lev5b6EXHJcbiAgICAgKiBAcmV0dXJuIDxiPlN0cmluZzwvYj4g5paH5Lu25ZCO57yA5ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0RmlsZUV4dCh1cmw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgLy/liIfmjonot6/lvoTlkI7pnaLnmoTlj4LmlbBcclxuICAgICAgICBsZXQgZXh0OiBzdHJpbmcgPSB1cmwuaW5kZXhPZihcIj9cIikgPiAtMSA/IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoXCI/XCIpKSA6IHVybDtcclxuICAgICAgICAvL+aIquWPluWQjue8gFxyXG4gICAgICAgIGxldCBsYXN0OiBzdHJpbmcgPSBleHQuc3Vic3RyaW5nKGV4dC5sYXN0SW5kZXhPZihcIi9cIikpO1xyXG4gICAgICAgIHJldHVybiBsYXN0Lmxhc3RJbmRleE9mKFwiLlwiKSA9PSAtMSA/IFwiXCIgOiBsYXN0LnN1YnN0cmluZyhsYXN0Lmxhc3RJbmRleE9mKFwiLlwiKSArIDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICog6LWE5rqQ5Zyw5Z2A566h55CG57G7XHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcmxVdGlscyB7XHJcbiAgICBcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJFUzpzdHJpbmcgPSBcInJlcy9cIjtcclxuICAgIC8qKmZhaXJ5Z3Vp5Y+R5biD6LWE5rqQ55uu5b2VICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEZBSVJVSTpzdHJpbmcgPSBVcmxVdGlscy5SRVMgKyBcImZhaXJ1aS9cIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlmZhaXJ5Z3Vp6LWE5rqQ57uEXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRGYWlyeUdyb3VwKCBuYW1lOnN0cmluZyApOkFycmF5PHN0cmluZz57XHJcblxyXG4gICAgICAgIHJldHVybiBbIFVybFV0aWxzLkZBSVJVSSArIG5hbWUgKyBcIl9hdGxhczAucG5nXCIgLCBVcmxVdGlscy5GQUlSVUkgKyBuYW1lICsgXCIubWFwXCIgXTtcclxuICAgIH1cclxufSIsImltcG9ydCBMb2dWbyBmcm9tIFwiLi9Mb2dWb1wiO1xyXG5cclxuLyoqXHJcbiAqIOaXpeW/l+ezu+e7nyBcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMjVcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZyB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9nTWFwOiBMYXlhLldlYWtPYmplY3QgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMga2V5SW5kZXg6bnVtYmVyID0gMDtcclxuXHJcbiAgICAvKirmma7pgJrosIPor5Xml6Xlv5cgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVFlQRV9ERUJVRzpzdHJpbmcgPSBcImRlYnVnXCI7XHJcbiAgICAvKirliqDovb3nm7jlhbPml6Xlv5cgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVFlQRV9MT0FEOnN0cmluZyA9IFwibG9hZFwiO1xyXG5cclxuICAgIC8qKuS4jemcgOimgeaYvuekuuaXpeW/l+exu+Wei+eahOWIl+ihqCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBub3Nob3dMb2dUeXBlTGlzdDpBcnJheTxzdHJpbmc+ID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXQoKTp2b2lke1xyXG5cclxuICAgICAgICB0aGlzLmxvZ01hcCA9IG5ldyBMYXlhLldlYWtPYmplY3QoKTtcclxuICAgICAgICB0aGlzLm5vc2hvd0xvZ1R5cGVMaXN0ID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmL7npLrml6Xlv5dcclxuICAgICAqIEBwYXJhbSB0aGlzT2JqZWN0IFxyXG4gICAgICogQHBhcmFtIHRleHQg5pel5b+X5paH5pysXHJcbiAgICAgKiBAcGFyYW0gdHlwZSDml6Xlv5fnsbvlnotcclxuICAgICAqIEBwYXJhbSBsZXZlbCDml6Xlv5fnrYnnuqdcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2coIHRoaXNPYmplY3Q6YW55ICwgdGV4dDpzdHJpbmcgLCB0eXBlOnN0cmluZz1cIlwiICwgbGV2ZWw6bnVtYmVyID0wICk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoIHR5cGUgPT0gXCJcIil7XHJcbiAgICAgICAgICAgIHR5cGUgPSBMb2cuVFlQRV9ERUJVRztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHR5cGUgJiYgdGhpcy5ub3Nob3dMb2dUeXBlTGlzdC5pbmRleE9mKHR5cGUpICE9IC0xICl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGxvZ1ZvOkxvZ1ZvID0gbmV3IExvZ1ZvKCBMb2cua2V5SW5kZXggLCB0ZXh0ICwgdGhpc09iamVjdCAsIHR5cGUgLCBsZXZlbCApOyAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coIGxvZ1ZvLnRvU3RyaW5nKCkgKTtcclxuICAgICAgICB0aGlzLmxvZ01hcC5zZXQoIGxvZ1ZvLmtleSAsIGxvZ1ZvICk7XHJcbiAgICAgICAgTG9nLmtleUluZGV4Kys7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmL7npLrplJnor6/ml6Xlv5dcclxuICAgICAqIEBwYXJhbSB0aGlzT2JqZWN0IFxyXG4gICAgICogQHBhcmFtIGFyZ3MgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZXJyb3IoIHRoaXNPYmplY3Q6YW55ICwgdGV4dDpzdHJpbmcgLCB0eXBlOnN0cmluZz1cIlwiICwgbGV2ZWw6bnVtYmVyID0wICk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoIHR5cGUgPT0gXCJcIil7XHJcbiAgICAgICAgICAgIHR5cGUgPSBMb2cuVFlQRV9ERUJVRztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHR5cGUgJiYgdGhpcy5ub3Nob3dMb2dUeXBlTGlzdC5pbmRleE9mKHR5cGUpICE9IC0xICl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGxvZ1ZvOkxvZ1ZvID0gbmV3IExvZ1ZvKCBMb2cua2V5SW5kZXggLCB0ZXh0ICwgdGhpc09iamVjdCAsIHR5cGUgLCBsZXZlbCApOyAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5lcnJvciggbG9nVm8udG9TdHJpbmcoKSApO1xyXG4gICAgICAgIHRoaXMubG9nTWFwLnNldCggbG9nVm8ua2V5ICwgbG9nVm8gKTtcclxuICAgICAgICBMb2cua2V5SW5kZXgrKztcclxuICAgIH1cclxufSIsIi8qKlxyXG4gKiDml6Xlv5fmlbDmja5cclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMjVcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ1ZvIHtcclxuXHJcbiAgICBwdWJsaWMga2V5OmFueTtcclxuICAgIC8qKuaXpeW/l+exu+WeiyAqL1xyXG4gICAgcHVibGljIHR5cGU6c3RyaW5nO1xyXG4gICAgLyoq5pel5b+X5o+P6L+wICovXHJcbiAgICBwdWJsaWMgdGV4dDpzdHJpbmc7XHJcbiAgICAvKip0aGlzT2JqZWN0IOWvueixoSAqL1xyXG4gICAgcHVibGljIHRoaXNPYmplY3Q6YW55O1xyXG4gICAgLyoq5pel5b+X562J57qnICovXHJcbiAgICBwdWJsaWMgbGV2ZWw6bnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigga2V5OmFueSAsIHRleHQ6c3RyaW5nICwgdGhpc09iamVjdDphbnkgLCB0eXBlOnN0cmluZyA9IFwiXCIgLCBsZXZlbDpudW1iZXIgPSAwICkge1xyXG5cclxuICAgICAgICB0aGlzLmtleSA9IGtleTtcclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXMudGhpc09iamVjdCA9IHRoaXNPYmplY3Q7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLmxldmVsID0gbGV2ZWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCk6c3RyaW5ne1xyXG5cclxuICAgICAgICB2YXIgY2xzTmFtZTogYW55ID0gdGhpcy50aGlzT2JqZWN0ID8gdGhpcy50aGlzT2JqZWN0Lm5hbWUgOiBcIlwiO1xyXG5cclxuICAgICAgICByZXR1cm4gXCJbXCIgKyB0aGlzLnR5cGUgKyBcIl1cIiArIFwiW1wiICsgY2xzTmFtZSArIFwiXVwiICsgdGhpcy50ZXh0ICsgXCIgICAgXCIgKyBuZXcgRGF0ZSgpLnRvVGltZVN0cmluZygpICsgXCJcIiA7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgTG9nIGZyb20gXCIuLi9sb2cvTG9nXCI7XHJcblxyXG4vKipcclxuICog5LqL5Lu2566h55CG57G7XHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudE1hbmFnZXIge1xyXG5cclxuXHRwcml2YXRlIHN0YXRpYyBfZXZlbnREaWN0OiBMYXlhLldlYWtPYmplY3QgPSBudWxsO1xyXG5cclxuXHRwcml2YXRlIHN0YXRpYyBfdGFyZ2V0TWFwOiBMYXlhLldlYWtPYmplY3QgPSBudWxsO1xyXG5cclxuXHRwdWJsaWMgc3RhdGljIGluaXQoKTogdm9pZHtcclxuXHJcblx0XHR0aGlzLl9ldmVudERpY3QgPSBuZXcgTGF5YS5XZWFrT2JqZWN0KCk7XHJcblx0XHR0aGlzLl90YXJnZXRNYXAgPSBuZXcgTGF5YS5XZWFrT2JqZWN0KCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDop6blj5HlhajlsYDkuovku7ZcclxuXHQgKiBAcGFyYW0gdHlwZSDkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW0gYXJncyDkuovku7blj4LmlbBcclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIGRpc3BhdGNoRXZlbnQoIHR5cGU6IHN0cmluZywgLi4uYXJncyApOnZvaWQge1xyXG5cclxuXHRcdGxldCBmdW5jTGlzdDogQXJyYXk8YW55PiA9IHRoaXMuX2V2ZW50RGljdC5nZXQodHlwZSk7XHJcblx0XHRpZiAoZnVuY0xpc3QpIHtcclxuXHRcdFx0bGV0IGxpc3Q6IEFycmF5PGFueT4gPSBmdW5jTGlzdC5jb25jYXQoKTtcclxuXHRcdFx0bGV0IGxlbmd0aDogbnVtYmVyID0gbGlzdC5sZW5ndGg7XHJcblx0XHRcdGlmIChsZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRMb2cubG9nKCB0aGlzICwgXCLosIPluqbkuovku7Y6IFwiICsgdHlwZSk7Ly/osIPluqbkuovku7blh7rplJkuXHJcblx0XHRcdFx0XHRcdC8vIGxpc3RbaV1bMF0uYXBwbHkobGlzdFtpXVsxXSwgYXJncyk7XHJcblx0XHRcdFx0XHRcdGxldCBmdW46RnVuY3Rpb24gPSBsaXN0W2ldWzBdO1xyXG5cdFx0XHRcdFx0XHRpZiggIGZ1biAhPSBudWxsICl7XHJcblx0XHRcdFx0XHRcdFx0ZnVuLmFwcGx5KGxpc3RbaV1bMV0sIGFyZ3MpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0XHRMb2cuZXJyb3IoIHRoaXMgLCBcIuiwg+W6puS6i+S7tuWHuumUmS5cIitlLnRvU3RyaW5nKCkgKTsvL+iwg+W6puS6i+S7tuWHuumUmS5cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOa3u+WKoOS6i+S7tuaWueazlVxyXG5cdCAqIEBwYXJhbSB0eXBlIOS6i+S7tuexu+Wei1xyXG5cdCAqIEBwYXJhbSBsaXN0ZW5lciDkuovku7bmlrnms5VcclxuXHQgKiBAcGFyYW0gdGhpc09iamVjdFxyXG5cdCAqIEBwYXJhbSB0YXJnZXQg55uR5ZCs5LqL5Lu25a+56LGh77yM5Li656m65YiZ55uR5ZCs5YWo5bGA5LqL5Lu2XHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyBhZGRFdmVudExpc3RlbmVyKHR5cGU6IHN0cmluZywgbGlzdGVuZXI6IEZ1bmN0aW9uLCB0aGlzT2JqZWN0OiBhbnksIHRhcmdldDogTGF5YS5FdmVudERpc3BhdGNoZXIgPSBudWxsKTogdm9pZCB7XHJcblxyXG5cdFx0bGV0IGZ1bmNMaXN0OiBBcnJheTxhbnk+ID0gbnVsbDtcclxuXHRcdGlmICh0YXJnZXQgPT0gbnVsbCkge1xyXG5cdFx0XHRmdW5jTGlzdCA9IDxhbnk+RXZlbnRNYW5hZ2VyLl9ldmVudERpY3QuZ2V0KHR5cGUpO1xyXG5cdFx0XHRpZiAoIWZ1bmNMaXN0KSB7XHJcblx0XHRcdFx0ZnVuY0xpc3QgPSBuZXcgQXJyYXk8YW55PigpO1xyXG5cdFx0XHRcdEV2ZW50TWFuYWdlci5fZXZlbnREaWN0LnNldCh0eXBlLCBmdW5jTGlzdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFFdmVudE1hbmFnZXIuaGFzRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdGhpc09iamVjdCkpIHtcclxuXHRcdFx0XHRmdW5jTGlzdC5wdXNoKFtsaXN0ZW5lciwgdGhpc09iamVjdF0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRmdW5jTGlzdCA9IEV2ZW50TWFuYWdlci5nZXRMaXN0ZW5lckxpc3QoIHRhcmdldCApO1xyXG5cdFx0XHRpZiggIUV2ZW50TWFuYWdlci5oYXNMaXN0ZW5lck9mKCB0eXBlICwgbGlzdGVuZXIgLCB0YXJnZXQgKSApeyAvL+WmguaenOayoeacieebkeWQrOivpeS6i+S7tu+8jOmBv+WFjemHjeWkjeebkeWQrFxyXG5cdFx0XHRcdHZhciBvYmo6IE9iamVjdCA9IG5ldyBPYmplY3QoKTtcclxuXHRcdFx0XHRvYmpbXCJ0eXBlXCJdID0gdHlwZTtcclxuXHRcdFx0XHRvYmpbXCJsaXN0ZW5lclwiXSA9IGxpc3RlbmVyO1xyXG5cdFx0XHRcdG9ialtcInRoaXNPYmplY3RcIl0gPSB0aGlzT2JqZWN0O1xyXG5cdFx0XHRcdGZ1bmNMaXN0ID0gZnVuY0xpc3QgfHwgW107XHJcblx0XHRcdFx0ZnVuY0xpc3QucHVzaChvYmopO1xyXG5cdFx0XHRcdC8vIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB0aGlzT2JqZWN0KTtcclxuXHRcdFx0XHR0YXJnZXQub24oIHR5cGUgLCB0aGlzT2JqZWN0ICwgbGlzdGVuZXIgKTtcclxuXHRcdFx0fVx0XHRcdFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog56e76Zmk5LqL5Lu255uR5ZCsXHJcblx0ICogQHBhcmFtIHR5cGUg5LqL5Lu257G75Z6LXHJcblx0ICogQHBhcmFtIGxpc3RlbmVyIOS6i+S7tuaWueazlVxyXG5cdCAqIEBwYXJhbSB0aGlzT2JqZWN0XHJcblx0ICogQHBhcmFtIHRhcmdldCDnm5HlkKzkuovku7blr7nosaHvvIzkuLrnqbrliJnnm5HlkKzlhajlsYDkuovku7YgXHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyByZW1vdmVFdmVudExpc3RlbmVyKHR5cGU6IHN0cmluZywgbGlzdGVuZXI6IEZ1bmN0aW9uLCB0aGlzT2JqZWN0OiBhbnksIHRhcmdldDogTGF5YS5FdmVudERpc3BhdGNoZXIgPSBudWxsKTogdm9pZCB7XHJcblx0XHRcclxuXHRcdGxldCBmdW5jTGlzdDogQXJyYXk8YW55PiA9IG51bGw7XHJcblx0XHRpZiggdGFyZ2V0ID09IG51bGwgKXsgLy/lhajlsYDkuovku7ZcclxuXHRcdFx0ZnVuY0xpc3QgPSA8YW55PkV2ZW50TWFuYWdlci5fZXZlbnREaWN0LmdldCh0eXBlKTtcclxuXHRcdFx0aWYgKGZ1bmNMaXN0KSB7XHJcblx0XHRcdFx0bGV0IGxlbmd0aDogbnVtYmVyID0gZnVuY0xpc3QubGVuZ3RoO1xyXG5cdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKGZ1bmNMaXN0W2ldWzBdID09IGxpc3RlbmVyICYmIGZ1bmNMaXN0W2ldWzFdID09IHRoaXNPYmplY3QpIHtcclxuXHRcdFx0XHRcdFx0ZnVuY0xpc3Quc3BsaWNlKGksIDEpO1xyXG5cdFx0XHRcdFx0XHRpZiAoZnVuY0xpc3QubGVuZ3RoID09IDApIHtcclxuXHRcdFx0XHRcdFx0XHRFdmVudE1hbmFnZXIuX2V2ZW50RGljdC5zZXQodHlwZSwgbnVsbCk7XHJcblx0XHRcdFx0XHRcdFx0RXZlbnRNYW5hZ2VyLl9ldmVudERpY3QuZGVsKHR5cGUpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGZ1bmNMaXN0ID0gRXZlbnRNYW5hZ2VyLmdldExpc3RlbmVyTGlzdCggdGFyZ2V0ICk7XHJcblx0XHRcdHZhciBvYmo6IE9iamVjdDtcclxuICAgICAgICAgICAgaWYgKGZ1bmNMaXN0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGZ1bmNMaXN0LmZvckVhY2goKG9iaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmoudHlwZSA9PSB0eXBlICYmIG9iai5saXN0ZW5lciA9PSBsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jTGlzdC5zcGxpY2UoZnVuY0xpc3QuaW5kZXhPZihvYmopLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblx0XHRcdC8vIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB0aGlzT2JqZWN0KTtcclxuXHRcdFx0dGFyZ2V0Lm9mZiggdHlwZSAsIHRoaXNPYmplY3QgLCBsaXN0ZW5lciApO1xyXG5cdFx0fVx0XHRcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOebkeWQrOS6i+S7tuWIl+ihqFxyXG5cdCAqIEBwYXJhbSB0YXJnZXQg5LqL5Lu25a+56LGhXHJcblx0ICoqL1xyXG5cdHB1YmxpYyBzdGF0aWMgZ2V0TGlzdGVuZXJMaXN0KCB0YXJnZXQ6TGF5YS5FdmVudERpc3BhdGNoZXIgKTogQXJyYXk8T2JqZWN0PiB7XHJcblxyXG5cdFx0bGV0IGZ1bmNMaXN0OkFycmF5PE9iamVjdD4gPSBudWxsO1xyXG5cdFx0aWYoIHRhcmdldCApe1xyXG5cdFx0XHRmdW5jTGlzdCA9IEV2ZW50TWFuYWdlci5fdGFyZ2V0TWFwLmdldCh0YXJnZXQpO1xyXG5cdFx0XHRpZiAoZnVuY0xpc3QgPT0gbnVsbCkge1xyXG5cdFx0XHRcdGZ1bmNMaXN0ID0gW107XHJcblx0XHRcdFx0RXZlbnRNYW5hZ2VyLl90YXJnZXRNYXAuc2V0KHRhcmdldCwgZnVuY0xpc3QpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHRcdFxyXG5cdFx0cmV0dXJuIGZ1bmNMaXN0O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog56e76Zmk5omA5pyJ55uR5ZCs5LqL5Lu2XHJcblx0ICogQHBhcmFtIHRhcmdldCDkuLrnqbrliJnnp7vpmaTmiYDmnInlhajlsYDkuovku7bvvIzlkKbliJnnp7vpmaTlr7nlupTnmoTlr7nosaHnmoTmiYDmnInkuovku7ZcclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIHJlbW92ZUFsbExpc3RlbmVycyggdGFyZ2V0OkxheWEuRXZlbnREaXNwYXRjaGVyID0gbnVsbCApOnZvaWR7XHJcblxyXG5cdFx0aWYoIHRhcmdldCA9PSBudWxsICl7XHJcblx0XHRcdEV2ZW50TWFuYWdlci5yZW1vdmVBbGxFdmVudExpc3RlbmVyKCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0bGV0IGxpc3Q6QXJyYXk8T2JqZWN0PiA9IEV2ZW50TWFuYWdlci5nZXRMaXN0ZW5lckxpc3QoIHRhcmdldCApO1xyXG5cdFx0XHR2YXIgb2JqOiBPYmplY3Q7XHJcbiAgICAgICAgICAgIHdoaWxlIChsaXN0ICYmIGxpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgb2JqID0gbGlzdC5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihvYmpbXCJ0eXBlXCJdLCBvYmpbXCJsaXN0ZW5lclwiXSwgb2JqW1widGhpc09iamVjdFwiXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOenu+mZpOaJgOacieWFqOWxgOS6i+S7tlxyXG5cdCAqL1xyXG5cdHByaXZhdGUgc3RhdGljIHJlbW92ZUFsbEV2ZW50TGlzdGVuZXIoKSB7XHJcblx0XHQvLyBmb3IgKGxldCBmb3JpbmxldF9fIGluIEV2ZW50TWFuYWdlci5fZXZlbnREaWN0Lm1hcCkge1xyXG5cdFx0Ly8gXHRsZXQgdHlwZSA9IEV2ZW50TWFuYWdlci5fZXZlbnREaWN0Lm1hcFtmb3JpbmxldF9fXVswXTtcclxuXHRcdC8vIFx0RXZlbnRNYW5hZ2VyLnJlbW92ZUV2ZW50TGlzdGVuZXJzKHR5cGUpO1xyXG5cdFx0Ly8gfVxyXG5cdFx0Zm9yKCBsZXQga2V5IGluIEV2ZW50TWFuYWdlci5fZXZlbnREaWN0ICl7XHJcblx0XHRcdGxldCB0eXBlOmFueSA9IEV2ZW50TWFuYWdlci5fZXZlbnREaWN0WyBrZXkgXTtcclxuXHRcdFx0RXZlbnRNYW5hZ2VyLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCB0eXBlICk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDnp7vpmaTmiYDmnInlr7nlupTnsbvlnovkuovku7bnm5HlkKxcclxuXHQgKiBAcGFyYW0gdHlwZSDkuovku7bnsbvlnotcclxuXHQgKiBAcGFyYW0gXHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyByZW1vdmVFdmVudExpc3RlbmVycyggdHlwZTogc3RyaW5nID0gbnVsbCApIHtcclxuXHRcdGlmICh0eXBlICE9IG51bGwpIHtcclxuXHRcdFx0aWYgKEV2ZW50TWFuYWdlci5fZXZlbnREaWN0LmdldCh0eXBlKSAhPSBudWxsKSB7XHJcblx0XHRcdFx0RXZlbnRNYW5hZ2VyLl9ldmVudERpY3Quc2V0KHR5cGUsIG51bGwpO1xyXG5cdFx0XHRcdEV2ZW50TWFuYWdlci5fZXZlbnREaWN0LmRlbCh0eXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdEV2ZW50TWFuYWdlci5yZW1vdmVBbGxFdmVudExpc3RlbmVyKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDmmK/lkKbmnInlr7nlupTkuovku7bnmoTnm5HlkKzkuovku7ZcclxuXHQgKiBAcGFyYW1cdHR5cGUgICAgICBcdOS6i+S7tuexu+Wei1xyXG5cdCAqIEBwYXJhbVx0bGlzdGVuZXIgIFx05LqL5Lu25pa55rOVXHJcblx0ICogQHBhcmFtIFx0dGFyZ2V0XHRcdOebkeWQrOWvueixoVxyXG5cdCAqIEBwYXJhbSBcdHRoaXNPYmplY3RcclxuXHQgKiBAcmV0dXJuXHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyBoYXNMaXN0ZW5lck9mKHR5cGU6IHN0cmluZywgbGlzdGVuZXI6IEZ1bmN0aW9uID0gbnVsbCwgdGFyZ2V0OiBMYXlhLkV2ZW50RGlzcGF0Y2hlciA9IG51bGwsIHRoaXNPYmplY3Q6IGFueSA9IG51bGwpOiBib29sZWFuIHtcclxuXHJcblx0XHRpZiAodGFyZ2V0ID09IG51bGwpIHtcclxuXHRcdFx0bGV0IGZ1bmNMaXN0OiBBcnJheTxhbnk+ID0gRXZlbnRNYW5hZ2VyLl90YXJnZXRNYXAuZ2V0KHRhcmdldCk7XHJcblx0XHRcdHZhciBvYmo6IE9iamVjdDtcclxuXHRcdFx0Zm9yIChvYmogb2YgZnVuY0xpc3QpIHtcclxuXHRcdFx0XHRpZiAob2JqICYmIG9ialtcInR5cGVcIl0gPT0gdHlwZSAmJiAob2JqW1wibGlzdGVuZXJcIl0gPT0gbGlzdGVuZXIgfHwgbGlzdGVuZXIgPT0gbnVsbCkpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIEV2ZW50TWFuYWdlci5oYXNFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB0aGlzT2JqZWN0KTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDmmK/lkKbmnInlr7nlupTnmoTlhajlsYDnm5HlkKzkuovku7ZcclxuXHQgKiBAcGFyYW1cdHR5cGUgICAgICBcdOS6i+S7tuexu+Wei1xyXG5cdCAqIEBwYXJhbVx0bGlzdGVuZXIgIFx05LqL5Lu25pa55rOVXHJcblx0ICogQHBhcmFtIFx0dGhpc09iamVjdFxyXG5cdCAqIEByZXR1cm5cclxuXHQgKi9cclxuXHRwcml2YXRlIHN0YXRpYyBoYXNFdmVudExpc3RlbmVyKHR5cGU6IHN0cmluZywgbGlzdGVuZXI6IEZ1bmN0aW9uID0gbnVsbCwgdGhpc09iamVjdDogYW55ID0gbnVsbCk6IGJvb2xlYW4ge1xyXG5cdFx0bGV0IGJvb2w6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdGxldCBmdW5jTGlzdDogQXJyYXk8YW55PiA9IDxhbnk+RXZlbnRNYW5hZ2VyLl9ldmVudERpY3QuZ2V0KHR5cGUpO1xyXG5cdFx0aWYgKCFmdW5jTGlzdCB8fCBmdW5jTGlzdC5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRib29sID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0aWYgKGxpc3RlbmVyID09IG51bGwpIHtcclxuXHRcdFx0XHRib29sID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRmdW5jTGlzdC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKGVsZW1lbnRbMF0gPT0gbGlzdGVuZXIgJiYgZWxlbWVudFsxXSA9PSB0aGlzT2JqZWN0KSB7XHJcblx0XHRcdFx0XHRcdGJvb2wgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gYm9vbDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGJvb2w7XHJcblx0fVxyXG59IiwiLyoqXHJcbiAqIOmdouadv+azqOWGjCBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhbmVsUmVnaXN0ZXIge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBwa2dOYW1lIOaYr+WQpuW3suazqOWGjOi1hOa6kOWMhVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGhhc1JlZ2lzdGVyQ2xhc3MoIHBrZ05hbWU6c3RyaW5nICk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgcmV0dXJuIHBrZ05hbWUgJiYgIWZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRCeUlkKFwicmVzL2ZhaXJ1aS9cIitwa2dOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOazqOWGjOe7hOS7tuexu+S4jmZhaXJ5Z3Vp57yW6L6R5Zmo5Lit57G75a+55bqUXHJcbiAgICAgKiBAcGFyYW0gcGtnTmFtZSDljIXlkI1cclxuICAgICAqIEBwYXJhbSByZXNOYW1lIOi1hOa6kOWQjVxyXG4gICAgICogQHBhcmFtIGNsc1x0ICDlr7nlupTljIXkuK3nsbvlkI1cdCzkuLpudWxs5YiZ5Y+q5rOo5YaM6LWE5rqQ5YyFXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJDbGFzcyhwa2dOYW1lOiBzdHJpbmcsIHJlc05hbWU6IHN0cmluZyA9IFwiXCIgLCBjbHM6IGFueSA9IG51bGwgKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmIChwa2dOYW1lICYmICFmYWlyeWd1aS5VSVBhY2thZ2UuZ2V0QnlJZChcInJlcy9mYWlydWkvXCIrcGtnTmFtZSkpIHtcclxuICAgICAgICAgICAgZmFpcnlndWkuVUlQYWNrYWdlLmFkZFBhY2thZ2UoXCJyZXMvZmFpcnVpL1wiK3BrZ05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggY2xzICl7XHJcbiAgICAgICAgICAgIGxldCB1cmw6IHN0cmluZyA9IGZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRJdGVtVVJMKHBrZ05hbWUsIHJlc05hbWUpO1xyXG4gICAgICAgICAgICBmYWlyeWd1aS5VSU9iamVjdEZhY3Rvcnkuc2V0UGFja2FnZUl0ZW1FeHRlbnNpb24odXJsLCBjbHMpO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu66Ieq5a6a5LmJZmFpcnlndWnnu4Tku7bvvIzlv4XpobvnlKjmraTmlrnlvI8s5LiO5Lul5LiK5pa55rOV5a+55bqU5L2/55SoLOS4jeiDveebtOaOpeS9v+eUqG5ldyBjbHMoKeeahOaWueW8j+WIm+W7uuS4gOS4que7keWummZhaXJ5Z3Vp55qE57G777yBXHJcbiAgICAgKiBAcGFyYW0gcGtnTmFtZSDljIXlkI1cclxuICAgICAqIEBwYXJhbSByZXNOYW1lIOi1hOa6kOWQjVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUdPYmplY3QocGtnTmFtZTogc3RyaW5nLCByZXNOYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiBmYWlyeWd1aS5VSVBhY2thZ2UuY3JlYXRlT2JqZWN0RnJvbVVSTChmYWlyeWd1aS5VSVBhY2thZ2UuZ2V0SXRlbVVSTChwa2dOYW1lLCByZXNOYW1lKSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUGFuZWxSZWdpc3RlciBmcm9tIFwiLi4vUGFuZWxSZWdpc3RlclwiO1xyXG5pbXBvcnQgRUJ1dHRvbiBmcm9tIFwiLi4vdmlldy9jb21wb25lbnQvRUJ1dHRvblwiO1xyXG5pbXBvcnQgQmFzZVNwcml0ZSBmcm9tIFwiLi4vdmlldy9jb21wb25lbnQvQmFzZVNwcml0ZVwiO1xyXG5pbXBvcnQgTG9nIGZyb20gXCIuLi8uLi9jb20vbG9nL0xvZ1wiO1xyXG5pbXBvcnQgeyBCYXNlUGFuZWwgfSBmcm9tIFwiLi4vdmlldy9CYXNlUGFuZWxcIjtcclxuXHJcbi8qKlxyXG4gKiBGYWlyeWd1aeeuoeeQhlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmFpcnlVSU1hbmFnZXIge1xyXG5cclxuICAgIC8qKuijhei9vSAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcGFyZW50OiBMYXlhLlNwcml0ZSA9IG51bGw7XHJcblxyXG4gICAgLyoq5Li755WM6Z2i5bGCICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG1haW5MYXllcjogQmFzZVNwcml0ZTtcclxuICAgIC8qKueVjOmdouWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB3aW5kb3dMYXllcjogQmFzZVNwcml0ZTtcclxuICAgIC8qKiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBwcm9tcHRMYXllcjogQmFzZVNwcml0ZTtcclxuICAgIC8qKuW8ueahhuWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhbGVydExheWVyOiBCYXNlU3ByaXRlO1xyXG4gICAgLyoq6aG25bGCICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvcExheWVyOiBCYXNlU3ByaXRlO1xyXG4gICAgLyoqdGlw5bGCICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRpcExheWVyOiBCYXNlU3ByaXRlID0gbnVsbDtcclxuICAgIC8qKuW8leWvvOWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBndWlkZUxheWVyOiBCYXNlU3ByaXRlID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0KCBjb250YWluZXI6TGF5YS5TcHJpdGUgKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmKCAhdGhpcy5wYXJlbnQgKXtcdFx0XHRcdFxyXG4gICAgICAgICAgICBGYWlyeVVJTWFuYWdlci5tYWluTGF5ZXIgPSBuZXcgQmFzZVNwcml0ZSgpO1xyXG4gICAgICAgICAgICBGYWlyeVVJTWFuYWdlci53aW5kb3dMYXllciA9IG5ldyBCYXNlU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIEZhaXJ5VUlNYW5hZ2VyLnByb21wdExheWVyID0gbmV3IEJhc2VTcHJpdGUoKTtcclxuICAgICAgICAgICAgRmFpcnlVSU1hbmFnZXIudG9wTGF5ZXIgPSBuZXcgQmFzZVNwcml0ZSgpO1xyXG4gICAgICAgICAgICBGYWlyeVVJTWFuYWdlci5hbGVydExheWVyID0gbmV3IEJhc2VTcHJpdGUoKTtcclxuICAgICAgICAgICAgRmFpcnlVSU1hbmFnZXIudGlwTGF5ZXIgPSBuZXcgQmFzZVNwcml0ZSgpO1xyXG4gICAgICAgICAgICBGYWlyeVVJTWFuYWdlci5ndWlkZUxheWVyID0gbmV3IEJhc2VTcHJpdGUoKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQoIGZhaXJ5Z3VpLkdSb290Lmluc3QuZGlzcGxheU9iamVjdCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250YWluZXIuYWRkQ2hpbGQoZmFpcnlndWkuR1Jvb3QuaW5zdC5kaXNwbGF5T2JqZWN0KTtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBcclxuICAgICAgICBmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKEZhaXJ5VUlNYW5hZ2VyLm1haW5MYXllcik7XHJcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZChGYWlyeVVJTWFuYWdlci53aW5kb3dMYXllcik7XHJcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZChGYWlyeVVJTWFuYWdlci5wcm9tcHRMYXllcik7XHJcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZChGYWlyeVVJTWFuYWdlci5hbGVydExheWVyKTtcclxuICAgICAgICBmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKEZhaXJ5VUlNYW5hZ2VyLnRvcExheWVyKTtcdFx0XHRcclxuICAgICAgICBmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKEZhaXJ5VUlNYW5hZ2VyLnRpcExheWVyKTtcclxuICAgICAgICBmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKEZhaXJ5VUlNYW5hZ2VyLmd1aWRlTGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5omT5byA6Z2i5p2/XHJcbiAgICAgKiBAcGFyYW0gY2xzICAg6Z2i5p2/57G7XHJcbiAgICAgKiBAcGFyYW0gZGF0YSAg5YW25LuW5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgb3BlbiggY2xzOmFueSAsIGRhdGE6YW55ID0gbnVsbCApOnZvaWR7XHJcblxyXG4gICAgICAgIGlmKCBjbHMgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmlldzphbnkgPSBuZXcgY2xzKCk7XHJcbiAgICAgICAgICAgICAgICBpZiggdmlldyBpbnN0YW5jZW9mIEJhc2VQYW5lbCApe1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcubG9hZCgpOyAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXcuc2hvdyggZGF0YSApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCB2aWV3LnBhbmVsVm8uaXNOb3JtYWwgKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53aW5kb3dMYXllci5hZGRDaGlsZCggdmlldyApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9Y2F0Y2goZSl7XHJcbiAgICAgICAgICAgICAgICBMb2cuZXJyb3IoIHRoaXMgLCBcIuWunuWIl+mdouadv+Wksei0pe+8gVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogRmFpcnlVSU1hbmFnZXI7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCk6IEZhaXJ5VUlNYW5hZ2VyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2UgfHwgbmV3IEZhaXJ5VUlNYW5hZ2VyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBCYXNlUGFuZWwgfSBmcm9tIFwiLi4vdmlldy9CYXNlUGFuZWxcIjtcclxuaW1wb3J0IEVCdXR0b24gZnJvbSBcIi4uL3ZpZXcvY29tcG9uZW50L0VCdXR0b25cIjtcclxuaW1wb3J0IExvZyBmcm9tIFwiLi4vLi4vY29tL2xvZy9Mb2dcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVJR01WaWV3IGV4dGVuZHMgQmFzZVBhbmVsIHtcclxuXHJcbiAgICBwcml2YXRlIGJ0bl9wbGF5OkVCdXR0b247XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoIFwiY29tbW9uXCIgLCBcIlVJR01WaWV3XCIgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQWxsTGlzdGVuZXIoKTp2b2lke1xyXG5cclxuICAgICAgICBzdXBlci5hZGRBbGxMaXN0ZW5lcigpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZEdhbWVMaXN0ZW5lciggTGF5YS5FdmVudC5DTElDSyAsIHRoaXMuY2xpY2tQbGF5QnRuSGFuZGxlciAsIHRoaXMgLCB0aGlzLmJ0bl9wbGF5ICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUFsbExpc3RlbmVyKCk6dm9pZHtcclxuXHJcbiAgICAgICAgc3VwZXIucmVtb3ZlQWxsTGlzdGVuZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsaWNrUGxheUJ0bkhhbmRsZXIoIGU6TGF5YS5FdmVudCApOnZvaWR7XHJcblxyXG4gICAgICAgIExvZy5sb2coIHRoaXMgLCBcIueCueWHu+aSreaUvuaMiemSrlwiKTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyBCYXNlUGFuZWwgfSBmcm9tIFwiLi4vdmlldy9CYXNlUGFuZWxcIjtcclxuaW1wb3J0IEVCdXR0b24gZnJvbSBcIi4uL3ZpZXcvY29tcG9uZW50L0VCdXR0b25cIjtcclxuaW1wb3J0IEZhaXJ5VUlNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2VyL0ZhaXJ5VUlNYW5hZ2VyXCI7XHJcbmltcG9ydCBVSUdNVmlldyBmcm9tIFwiLi9VSUdNVmlld1wiO1xyXG5cclxuLyoqXHJcbiAqIOS4u+eVjOmdolxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNi45XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVSU1haW5WaWV3IGV4dGVuZHMgQmFzZVBhbmVsIHtcclxuXHJcbiAgICBwcml2YXRlIGJ0bl9nbTpFQnV0dG9uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBzdXBlcihcIm1haW5cIixcIlVJTWFpblZpZXdcIik7IFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0VUkoKTp2b2lke1xyXG5cclxuICAgICAgICBzdXBlci5pbml0VUkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQWxsTGlzdGVuZXIoKTp2b2lke1xyXG5cclxuICAgICAgICBzdXBlci5hZGRBbGxMaXN0ZW5lcigpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZEdhbWVMaXN0ZW5lciggTGF5YS5FdmVudC5DTElDSyAsIHRoaXMuY2xpY2tHbUhhbmRsZXIgLCB0aGlzICwgdGhpcy5idG5fZ20gKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQWxsTGlzdGVuZXIoKTp2b2lke1xyXG5cclxuICAgICAgICBzdXBlci5yZW1vdmVBbGxMaXN0ZW5lcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2xpY2tHbUhhbmRsZXIoIGU6TGF5YS5FdmVudCApOnZvaWR7XHJcblxyXG4gICAgICAgIEZhaXJ5VUlNYW5hZ2VyLm9wZW4oIFVJR01WaWV3ICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyKCk6dm9pZHtcclxuXHJcbiAgICAgICAgc3VwZXIuY2xlYXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpOnZvaWR7XHJcblxyXG4gICAgICAgIHN1cGVyLmRpc3Bvc2UoKTtcclxuICAgIH1cclxufSIsIi8qKlxyXG4gKiBGYWlyeUdVSee6ueeQhumbhuWkhOeQhuW3peWFt+exu1xyXG4gKiBAYXV0aG9yIGNsIDIwMTkuMi4yMFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEZhaXJ5VGV4dHVyZVV0aWxzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlui1hOa6kOWcsOWdgFxyXG4gICAgICogQHBhcmFtIHBrZ05hbWUgICDljIXlkI1cclxuICAgICAqIEBwYXJhbSByZXNOYW1lICAg6LWE5rqQ5ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VXJsKHBrZ05hbWU6IHN0cmluZywgcmVzTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgbGV0IHVybDogc3RyaW5nID0gZmFpcnlndWkuVUlQYWNrYWdlLmdldEl0ZW1VUkwocGtnTmFtZSwgcmVzTmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIHVybDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlkZhaXJ56LWE5rqQ5YyF6YeM55qE5Zu+54mH6LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gcGtnTmFtZSAgIOWMheWQjVxyXG4gICAgICogQHBhcmFtIHJlc05hbWUgICDotYTmupDlkI1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRUZXh0dXJlQnkocGtnTmFtZTogc3RyaW5nLCByZXNOYW1lOiBzdHJpbmcpOiBMYXlhLlRleHR1cmUge1xyXG5cclxuICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSBmYWlyeWd1aS5VSVBhY2thZ2UuZ2V0SXRlbVVSTChwa2dOYW1lLCByZXNOYW1lKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZXh0dXJlKHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLnmja5GYWlyeWd1aeeahFVSTOWcsOWdgOiOt+WPluWvueW6lOe6ueeQhlxyXG4gICAgICogQHBhcmFtIHVpVXJsICAgICDlpoJ1aTovL3E0ZXZsd2NqZG1vYzJpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VGV4dHVyZSh1cmw6IHN0cmluZyk6IExheWEuVGV4dHVyZSB7XHJcblxyXG4gICAgICAgIGxldCBpdGVtOiBmYWlyeWd1aS5QYWNrYWdlSXRlbSA9IGZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRJdGVtQnlVUkwodXJsKTtcclxuICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpdGVtLmxvYWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW0gPyBpdGVtLnRleHR1cmUgOiBudWxsO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJhc2VTcHJpdGUgZnJvbSBcIi4uL3ZpZXcvY29tcG9uZW50L0Jhc2VTcHJpdGVcIjtcclxuLy8gaW1wb3J0IHsgRUdMaXN0IH0gZnJvbSBcIi4uL3ZpZXcvY29tcG9uZW50L0VHTGlzdFwiO1xyXG5cclxuLyoqXHJcbiAqIEZhaXJ5R1VJ5bel5YW3XHJcbiAqIEBhdXRob3IgY2wgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRmFpcnlVdGlscyB7XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDlo7DmmI7lrrnlmajlr7nlupTlj5jph49cclxuXHQgICogQHBhcmFtIHBhcmVudCBcdFx05a655ZmoXHJcblx0ICAqIEBwYXJhbSB0aGlzT2JqZWN0IFx0dGhpc+WvueixoVxyXG5cdCAgKi9cclxuXHRwdWJsaWMgc3RhdGljIHNldFZhcihwYXJlbnQ6IGZhaXJ5Z3VpLkdDb21wb25lbnQsIHRoaXNPYmplY3Q6IGFueSk6IHZvaWQge1xyXG5cclxuXHRcdGlmIChwYXJlbnQgIT0gbnVsbCAmJiB0aGlzT2JqZWN0ICE9IG51bGwpIHtcclxuXHRcdFx0bGV0IGRpc09iajogZmFpcnlndWkuR09iamVjdDtcclxuXHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHBhcmVudC5udW1DaGlsZHJlbjsgaSsrKSB7IC8vb2JqZWN0c1xyXG5cdFx0XHRcdGRpc09iaiA9IHBhcmVudC5nZXRDaGlsZEF0KGkpO1xyXG5cdFx0XHRcdGlmIChkaXNPYmoubmFtZSA9PSBcImljb25cIiB8fCBkaXNPYmoubmFtZSA9PSBcInRpdGxlXCIpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZGlzT2JqLm5hbWUgJiYgZGlzT2JqLm5hbWUuaW5kZXhPZihcInRhYl9cIikgPT0gMCAmJiBkaXNPYmogaW5zdGFuY2VvZiBmYWlyeWd1aS5HR3JvdXApIHtcclxuXHRcdFx0XHRcdC8vIHRoaXNPYmplY3RbZGlzT2JqLm5hbWVdID0gbmV3IGZhaXJ1aS5FVGFiKGRpc09iaiwgdGhpc09iamVjdCk7XHJcblx0XHRcdFx0XHQvLyBpZiAodGhpc09iamVjdCBpbnN0YW5jZW9mIEJhc2VTcHJpdGUpIHRoaXNPYmplY3QuYWRkQ29tcG9uZW50KHRoaXNPYmplY3RbZGlzT2JqLm5hbWVdKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGRpc09iai5uYW1lICYmIGRpc09iai5uYW1lLmluZGV4T2YoXCJlZ2xpc3RfXCIpID09IDAgJiYgZGlzT2JqIGluc3RhbmNlb2YgZmFpcnlndWkuR0xpc3QpIHtcclxuXHRcdFx0XHRcdC8vIHRoaXNPYmplY3RbZGlzT2JqLm5hbWVdID0gbmV3IEVHTGlzdChkaXNPYmosIHRoaXNPYmplY3QpO1xyXG5cdFx0XHRcdFx0Ly8gaWYgKHRoaXNPYmplY3QgaW5zdGFuY2VvZiBCYXNlU3ByaXRlKSB0aGlzT2JqZWN0LmFkZENvbXBvbmVudCh0aGlzT2JqZWN0W2Rpc09iai5uYW1lXSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXNPYmplY3RbZGlzT2JqLm5hbWVdID0gZGlzT2JqO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHBhcmVudC5fdHJhbnNpdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRsZXQgdHJhbnNPYmo6IGZhaXJ5Z3VpLlRyYW5zaXRpb247XHJcblx0XHRcdFx0dHJhbnNPYmogPSBwYXJlbnQuX3RyYW5zaXRpb25zW2ldO1xyXG5cdFx0XHRcdHRoaXNPYmplY3RbdHJhbnNPYmoubmFtZV0gPSB0cmFuc09iajtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufSIsImltcG9ydCBWaWV3IGZyb20gXCIuL1ZpZXdcIjtcclxuaW1wb3J0IEVCdXR0b24gZnJvbSBcIi4vY29tcG9uZW50L0VCdXR0b25cIjtcclxuaW1wb3J0IHsgRmFpcnlVdGlscyB9IGZyb20gXCIuLi91dGlscy9GYWlyeVV0aWxzXCI7XHJcbmltcG9ydCBGYWlyeVVJTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlci9GYWlyeVVJTWFuYWdlclwiO1xyXG5pbXBvcnQgUGFuZWxWbyBmcm9tIFwiLi4vdm8vUGFuZWxWb1wiO1xyXG5pbXBvcnQgTG9hZFNvdXJjZU1hbmFnZXIgZnJvbSBcIi4uLy4uL2NvbS9sb2FkL0xvYWRTb3VyY2VNYW5hZ2VyXCI7XHJcbmltcG9ydCBVcmxVdGlscyBmcm9tIFwiLi4vLi4vY29tL2xvYWQvdXRpbHMvVXJsVXRpbHNcIjtcclxuaW1wb3J0IFBhbmVsUmVnaXN0ZXIgZnJvbSBcIi4uL1BhbmVsUmVnaXN0ZXJcIjtcclxuaW1wb3J0IHsgRUdMaXN0IH0gZnJvbSBcIi4vY29tcG9uZW50L0VHTGlzdFwiO1xyXG5pbXBvcnQgeyBHYW1lRXZlbnQgfSBmcm9tIFwiLi4vLi4vY29tL2V2ZW50cy9HYW1lRXZlbnRcIjtcclxuXHJcbi8qKlxyXG4gKiDpnaLmnb/ln7rnsbtcclxuICogQGF1dGhvciBjbCAyMDE4LjUuMThcclxuICovXHJcbmV4cG9ydCBjbGFzcyBCYXNlUGFuZWwgZXh0ZW5kcyBWaWV3IHtcclxuXHJcbiAgICBwcm90ZWN0ZWQgdmlldzogZmFpcnlndWkuR0NvbXBvbmVudCA9IG51bGw7XHJcbiAgICAvKirog4zmma8gKi9cclxuICAgIHByb3RlY3RlZCBiZzogZmFpcnlndWkuR0ltYWdlIHwgZmFpcnlndWkuR0xvYWRlcjtcclxuICAgIC8qKuagh+mimOagjyAqL1xyXG4gICAgLy8gcHJvdGVjdGVkIHRpdGxlQmFyOiBUaXRsZUJhcjtcclxuICAgIC8qKuWFs+mXreaMiemSrjrlj5bov5nkuKrlkI3lrZfnmoTmjInpkq4s5Lya5qC55o2u5bGP5bmV5aSn5bCP6LCD5pW05L2N572uICovXHJcbiAgICBwcm90ZWN0ZWQgYnRuX2Nsb3NlOiBmYWlyeWd1aS5HQnV0dG9uIHwgRUJ1dHRvbjtcclxuICAgIC8qKuS8oCBmYWxzZSDooajnpLrkuI3nu5Hlrprngrnlh7vpga7nvanlhbPpl63pnaLmnb/kuovku7YgKi9cclxuICAgIC8vIHByb3RlY3RlZCBvcGVuVGFwTWFzazogYm9vbGVhbjtcclxuICAgIC8vIC8qKuWMheWQjSAqL1xyXG4gICAgLy8gcHJvdGVjdGVkIF9wa2dOYW1lOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgLy8gLyoq57G75ZCNICovXHJcbiAgICAvLyBwcm90ZWN0ZWQgX3Jlc05hbWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBcclxuICAgIC8qKumdouadv+aVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIF9wYW5lbFZvOlBhbmVsVm8gPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Z2i5p2/5Z+657G7XHJcbiAgICAgKiBAcGFyYW0gcGtnTmFtZSDljIXlkI1cclxuICAgICAqIEBwYXJhbSByZXNOYW1lIOWvueW6lOmdouadv+WQjeWtl1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IocGtnTmFtZTogc3RyaW5nID0gXCJcIiwgcmVzTmFtZTogc3RyaW5nID0gXCJcIikge1xyXG5cclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLl9wYW5lbFZvID0gbmV3IFBhbmVsVm8oKTtcclxuICAgICAgICB0aGlzLl9wYW5lbFZvLnBrZ05hbWUgPSBwa2dOYW1lO1xyXG4gICAgICAgIHRoaXMuX3BhbmVsVm8ucmVzTmFtZSA9IHJlc05hbWU7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RGcm9tWE1MKHhtbDogYW55KTogdm9pZCB7XHJcblxyXG4gICAgICAgIHN1cGVyLmNvbnN0cnVjdEZyb21YTUwoeG1sKTtcclxuXHJcbiAgICAgICAgLy9GYWlyeVV0aWxzLnNldFZhcih0aGlzLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWKoOi9vei1hOa6kFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbG9hZCgpOnZvaWR7XHJcblxyXG4gICAgICAgIGxldCB1cmxzOkFycmF5PHN0cmluZz4gPSBVcmxVdGlscy5nZXRGYWlyeUdyb3VwKCB0aGlzLl9wYW5lbFZvLnBrZ05hbWUgKTtcclxuICAgICAgICBMb2FkU291cmNlTWFuYWdlci5sb2FkR3JvdXAoIHRoaXMuX3BhbmVsVm8ucGtnTmFtZSAsIHVybHMgLCBMYXlhLkhhbmRsZXIuY3JlYXRlKCB0aGlzICwgdGhpcy5pbml0ICkgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirpnaLmnb/mlbDmja4gKi9cclxuICAgIHB1YmxpYyBnZXQgcGFuZWxWbygpOlBhbmVsVm97XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYW5lbFZvO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0KCk6IHZvaWQge1xyXG5cclxuICAgICAgICBQYW5lbFJlZ2lzdGVyLnJlZ2lzdGVyQ2xhc3MoIHRoaXMuX3BhbmVsVm8ucGtnTmFtZSApO1xyXG5cclxuICAgICAgICBpZiggdGhpcy52aWV3ID09IG51bGwgKXtcclxuICAgICAgICAgICAgbGV0IG9iajogYW55ID0gZmFpcnlndWkuVUlQYWNrYWdlLmNyZWF0ZU9iamVjdCggdGhpcy5fcGFuZWxWby5wa2dOYW1lLCB0aGlzLl9wYW5lbFZvLnJlc05hbWUgKTtcclxuICAgICAgICAgICAgdGhpcy52aWV3ID0gb2JqLmFzQ29tO1xyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMudmlldyk7XHJcblxyXG4gICAgICAgICAgICBGYWlyeVV0aWxzLnNldFZhcih0aGlzLnZpZXcsIHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRpc09iajogZmFpcnlndWkuR09iamVjdDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMudmlldy5udW1DaGlsZHJlbjsgaSsrKSB7IC8vb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgZGlzT2JqID0gdGhpcy52aWV3LmdldENoaWxkQXQoaSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlzT2JqLm5hbWUgPT0gXCJpY29uXCIgfHwgZGlzT2JqLm5hbWUgPT0gXCJ0aXRsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlzT2JqLm5hbWUgJiYgZGlzT2JqLm5hbWUuaW5kZXhPZihcInRhYl9cIikgPT0gMCAmJiBkaXNPYmogaW5zdGFuY2VvZiBmYWlyeWd1aS5HR3JvdXApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzW2Rpc09iai5uYW1lXSA9IG5ldyBmYWlydWkuRVRhYihkaXNPYmosIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuYWRkQ29tcG9uZW50KHRoaXNbZGlzT2JqLm5hbWVdKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlzT2JqLm5hbWUgJiYgZGlzT2JqLm5hbWUuaW5kZXhPZihcImVnbGlzdF9cIikgPT0gMCAmJiBkaXNPYmogaW5zdGFuY2VvZiBmYWlyeWd1aS5HTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNbZGlzT2JqLm5hbWVdID0gbmV3IEVHTGlzdChkaXNPYmosIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KHRoaXNbZGlzT2JqLm5hbWVdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5pbml0VUkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbml0RGF0YSh0aGlzLnBhcmFtKTtcclxuXHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0VUkoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIGlmICh0aGlzLnRpdGxlQmFyICE9IG51bGwpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5idG5fY2xvc2UgPSB0aGlzLnRpdGxlQmFyLmJ0bl9jbG9zZTtcclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXREYXRhKCBkYXRhOmFueSApOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMuc2hvdyggZGF0YSApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRBbGxMaXN0ZW5lcigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgc3VwZXIuYWRkQWxsTGlzdGVuZXIoKTtcclxuICAgICAgICBpZiAodGhpcy5idG5fY2xvc2UgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZEdhbWVMaXN0ZW5lcihMYXlhLkV2ZW50LkNMSUNLLCB0aGlzLmNsb3NlSGFuZGxlciwgdGhpcy5idG5fY2xvc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFkZEdhbWVMaXN0ZW5lcihHYW1lRXZlbnQuU1RHQUVfUkVTSVpFLCB0aGlzLm9uUmVzaXplLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiuvue9ruagh+mimOearuiCpFxyXG4gICAgICogQGF1dGhvciBwa2dOYW1lIOWMheWQjVxyXG4gICAgICogQGF1dGhvciByZXNOYW1lIOi1hOa6kOWQjVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0VGl0bGVTa2luKHBrZ05hbWU6IHN0cmluZywgcmVzTmFtZTogc3RyaW5nKTogdm9pZCB7XHJcblxyXG4gICAgICAgIC8vIGlmICh0aGlzLnRpdGxlQmFyICE9IG51bGwpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy50aXRsZUJhci5zZXRUaXRsZVNraW4ocGtnTmFtZSwgcmVzTmFtZSk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W55WM6Z2i5a2Q5YWD5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRWaWV3Q2hpbGQobmFtZTogc3RyaW5nKTogYW55IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmlldyA/IHRoaXMudmlldy5nZXRDaGlsZChuYW1lKSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIOa4suafk+WIl+ihqOadoeebruaWueazlVxyXG4gICAgKiBAcGFyYW0gaW5kZXggIOWvueW6lOadoeebrue0ouW8lVxyXG4gICAgKiBAcGFyYW0gb2JqICAgIOa4suafk+WvueixoVxyXG4gICAgKi9cclxuICAgIHByb3RlY3RlZCByZW5kZXJMaXN0SXRlbShpbmRleDogbnVtYmVyLCBvYmo6IGZhaXJ5Z3VpLkdPYmplY3QpOiB2b2lkIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoq5YWz6Zet5LqL5Lu2ICovXHJcbiAgICBwcm90ZWN0ZWQgY2xvc2VIYW5kbGVyKCk6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhbPpl63pnaLmnb9cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsb3NlKGlzSGlkZUd1aWRlOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG5cclxuICAgICAgICAvLyBGYWlyeVVJTWFuYWdlci5jbG9zZVBhbmVsKHRoaXMsIHRoaXMuY2FuRGlzcG9zZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnlYzpnaLmmK/lkKblj6/ph4rmlL5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXQgY2FuRGlzcG9zZSgpOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq54K55Ye7TWFza+WxgizlhbPpl63pnaLmnb8gKi9cclxuICAgIHByb3RlY3RlZCB0YXBNYXNrKGU6IExheWEuRXZlbnQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pi+56S6XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzaG93KGRhdGE6IGFueSk6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLl9kYXRhID0gZGF0YTtcclxuICAgICAgICBpZiggdGhpcy52aWV3ID09IG51bGwgKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlOyBcclxuXHJcbiAgICAgICAgdGhpcy5hZGRBbGxMaXN0ZW5lcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6ZqQ6JePXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBoaWRlKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLnZpc2libGUpIHtcclxuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi9rOWMluS4uuWvueW6lOeahOexu1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdG9DbGFzcygpOiBhbnkge1xyXG4gICAgICAgIGxldCBjbHNOYW1lOiBzdHJpbmcgPSB0eXBlb2YgdGhpcztcclxuICAgICAgICByZXR1cm4gTGF5YS5DbGFzc1V0aWxzLmdldENsYXNzKGNsc05hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Ieq6YCC5bqUXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvblJlc2l6ZSgpOiB2b2lkIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXnkIbmlbDmja5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xyXG5cclxuICAgICAgICBzdXBlci5jbGVhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YeK5pS+6LWE5rqQLOS4jeWFgeiuuOWklumDqOebtOaOpeiwg+eUqOi/meS4quaWueazlVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgc3VwZXIuZGlzcG9zZSgpO1xyXG5cclxuICAgICAgICB0aGlzLnZpZXcgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2RhdGEgPSBudWxsO1xyXG4gICAgICAgIGlmKCB0aGlzLl9wYW5lbFZvICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5fcGFuZWxWby5kaXNwb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3BhbmVsVm8gPSBudWxsO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJhc2VTcHJpdGUgZnJvbSBcIi4vY29tcG9uZW50L0Jhc2VTcHJpdGVcIjtcclxuXHJcbi8qKlxyXG4gICogVUnmmL7npLrku6PnkIbnsbtcclxuICAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAgKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVUlDb21wb25lbnQgZXh0ZW5kcyBCYXNlU3ByaXRlIHtcclxuXHJcblx0Lyoq5piv5ZCm5omT5byA6L+H55WM6Z2iICovXHJcblx0cHJvdGVjdGVkIGlzT3BlbmVkOiBib29sZWFuID0gZmFsc2U7XHJcblx0Lyoq5piv5ZCm5Yid5aeL5YyW5omn6KGM57uT5p2fICovXHJcblx0cHJvdGVjdGVkIGlzQ29tcGx5ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHQvKirlj4LmlbAgKi9cclxuXHRwdWJsaWMgcGFyYW06IGFueTtcclxuXHJcblx0cHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuXHRcdHN1cGVyKCk7XHJcblx0fVxyXG5cclxuXHRwcm90ZWN0ZWQgY29uc3RydWN0RnJvbVhNTCh4bWw6IGFueSk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmNvbnN0cnVjdEZyb21YTUwoeG1sKTtcclxuXHJcblx0XHR0aGlzLmluaXQobnVsbCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgaXNJbml0ZWQoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gIXRoaXMuaXNDb21wbHllZDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBpbml0Q29tcGxldGUoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0Ly/mo4DmtYvliJ3lp4vljJbmmK/lkKblrozmiJBcclxuXHRcdGlmICghdGhpcy5pc0luaXRlZCgpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMuaXNPcGVuZWQpIHtcclxuXHRcdFx0dGhpcy5pc09wZW5lZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuaW5pdFVJKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5pbml0RGF0YSh0aGlzLnBhcmFtKTtcclxuXHRcdHRoaXMuYWRkQWxsTGlzdGVuZXIoKTtcclxuXHJcblx0XHR0aGlzLmlzQ29tcGx5ZWQgPSB0cnVlO1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5aSW6YOo5LiN6KaB6LCD55SoXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBpbml0KHBhcmFtOiBhbnkpOiB2b2lkIHtcclxuXHRcdHRoaXMucGFyYW0gPSBwYXJhbTtcclxuXHRcdHRoaXMuaW5pdENvbXBsZXRlKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5Yid5aeL5YyWVUnnlYzpnaJcclxuXHQgICovXHJcblx0cHVibGljIGluaXRVSSgpOiB2b2lkIHtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5Yid5aeL5YyW5Y+C5pWwXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBpbml0RGF0YShwYXJhbTogYW55ID0gbnVsbCk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMuX2RhdGEgPSBwYXJhbTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDlhbPpl63nlYzpnaLml7bosIPnlKhcclxuXHQgICovXHJcblx0cHVibGljIGNsZWFyKCk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmNsZWFyKCk7XHJcblxyXG5cdFx0dGhpcy5wYXJhbSA9IG51bGw7XHJcblx0XHR0aGlzLmlzQ29tcGx5ZWQgPSBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkaXNwb3NlKCk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcclxuXHJcblx0XHR0aGlzLnBhcmFtID0gbnVsbDtcclxuXHR9XHJcbn0iLCJpbXBvcnQgVUlDb21wb25lbnQgIGZyb20gXCIuL1VJQ29tcG9uZW50XCI7XHJcblxyXG4vKipcclxuICogVmlld+Wfuuexu1xyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyBleHRlbmRzIFVJQ29tcG9uZW50IGltcGxlbWVudHMgSVZpZXcge1xyXG5cclxuXHQvKirotYTmupDlj6/ph4rmlL7lkI7nvJPlrZjml7bpl7Qs5q+r56eSICovXHJcblx0cHVibGljIHN0YXRpYyByZWFkb25seSBDQUNIRV9USU1FOiBudW1iZXIgPSA1MDAwO1xyXG5cclxuXHRwdWJsaWMgY2xzOiBhbnkgPSBudWxsO1xyXG5cdC8v6YeK5pS+5pe26Ze0XHJcblx0cHJvdGVjdGVkIGdjVGltZTogbnVtYmVyID0gMDtcclxuXHJcblx0cHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuXHRcdHN1cGVyKCk7XHJcblx0fVxyXG5cclxuXHQvKirojrflj5blvZPliY3nu4Tku7ZDbGFzc+exuyAqL1xyXG5cdHB1YmxpYyBnZXRDbHMoKTogYW55IHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5jbHM7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHQvKirliqDovb3otYTmupAgKi9cclxuXHRwdWJsaWMgbG9hZCgpOnZvaWR7XHJcblxyXG5cdFx0dGhpcy5pbml0KCBudWxsICk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgaW5pdChwYXJhbTogYW55KTogdm9pZCB7XHJcblx0XHRzdXBlci5pbml0KHBhcmFtKTtcclxuXHRcdHRoaXMuZ2NUaW1lID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuXHR9XHJcblxyXG5cdC8v5Yid5aeL5YyWVUlcclxuXHRwdWJsaWMgaW5pdFVJKCk6IHZvaWQge1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDoh6rpgILlupTmjqXlj6NcclxuXHQgICovXHJcblx0cHVibGljIG9uUmVzaXplKCk6IHZvaWQge1xyXG5cclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5piv5ZCm5Y+v5Zue5pS2XHJcblx0ICAqL1xyXG5cdHB1YmxpYyBpc0NhbkdjKCk6IGJvb2xlYW4ge1xyXG5cclxuXHRcdHJldHVybiBMYXlhLnRpbWVyLmN1cnJGcmFtZSA+IHRoaXMuZ2NUaW1lOy8vIEdsb2JhbC50aW1lci5jdXJyRnJhbWUgPj0gdGhpcy5nY1RpbWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog6YeN572uLOavj+asoeWFs+mXreeVjOmdouiwg+eUqFxyXG5cdCAgKi9cclxuXHRwdWJsaWMgY2xlYXIoKTogdm9pZCB7XHJcblxyXG5cdFx0c3VwZXIuY2xlYXIoKTtcclxuXHRcdHRoaXMuZ2NUaW1lID0gTGF5YS50aW1lci5jdXJyRnJhbWUgKyBWaWV3LkNBQ0hFX1RJTUU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog6ZSA5q+B77yM5a6M5YWo6ZSA5q+B5a+56LGh5ZKM6LWE5rqQXHJcblx0ICAqIOaOpeWPo+mZpOS6hue7hOS7tuS9oOS7rOWFtuWug+WcsOaWueS4jeimgeiwg+eUqOi/meS4quaOpeWPo1xyXG5cdCAgKiDlj6rmnInlm57mlLbotYTmupDnmoTml7blgJnkvJrosIPnlKjkuIDmrKFcclxuXHQgICovXHJcblx0cHVibGljIGRpc3Bvc2UoKTogdm9pZCB7XHJcblxyXG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xyXG5cdFx0dGhpcy5jbHMgPSBudWxsO1xyXG5cdH1cclxufSIsImltcG9ydCBFdmVudFBvb2wgZnJvbSBcIi4uLy4uLy4uL2NvbS9ldmVudHMvRXZlbnRQb29sXCI7XHJcbmltcG9ydCB7IEZhaXJ5VXRpbHMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvRmFpcnlVdGlsc1wiO1xyXG5pbXBvcnQgeyBGYWlyeVRleHR1cmVVdGlscyB9IGZyb20gXCIuLi8uLi91dGlscy9GYWlyeVRleHR1cmVVdGlsc1wiO1xyXG5pbXBvcnQgR2xvYmFsIGZyb20gXCIuLi8uLi8uLi9HbG9iYWxcIjtcclxuXHJcbi8qKlxyXG4gKiDln7rkuo5mYWlyeWd1aS5HQnV0dG9u55qE5Z+657G75oyJ6ZKuXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQnV0dG9uIGV4dGVuZHMgZmFpcnlndWkuR0J1dHRvbiBpbXBsZW1lbnRzIElDb21wb25lbnQsSVBvb2wge1xyXG4gICAgXHJcbiAgICAvKirmmK/lkKblt7Lnu4/ph4rmlL4gKi9cclxuICAgIHB1YmxpYyBpc0Rpc3Bvc2U6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKirpop3lpJbmlbDmja4gKi9cclxuICAgIHByb3RlY3RlZCBfX2RhdGE6IGFueSA9IG51bGw7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9lbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIC8qKuaYr+WQpuWIneWni+WMliAqL1xyXG4gICAgcHJvdGVjdGVkIGlzSW5pdDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfY3VycmVudFN0YXRlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJvdGVjdGVkIF9idG5Db250cm9sbGVyOiBmYWlyeWd1aS5Db250cm9sbGVyO1xyXG5cclxuICAgIC8v57uE5Lu257yT5a2Y5rGgXHJcbiAgICBwcm90ZWN0ZWQgbV9jb21wb25lbnREaWM6IExheWEuV2Vha09iamVjdCA9IG51bGw7XHJcbiAgICAvL+S6i+S7tue8k+WtmOaxoFxyXG4gICAgcHJvdGVjdGVkIG1fZXZlbnRQb29sOiBFdmVudFBvb2wgPSBudWxsO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgXHJcblxyXG4gICAgICAgIHN1cGVyKCk7IFxyXG5cclxuICAgICAgICB0aGlzLm1fZXZlbnRQb29sID0gRXZlbnRQb29sLmNyZWF0ZSgpO1xyXG4gICAgICAgIHRoaXMubV9jb21wb25lbnREaWMgPSBuZXcgTGF5YS5XZWFrT2JqZWN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yid5aeL5Yib5bu65pe255qE5pa55rOV77yM55So5LqO57un5om/SVBvb2znmoTnsbsgKi9cclxuICAgIHB1YmxpYyBjcmVhdGUoKTp2b2lke1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdEZyb21YTUwoeG1sOiBhbnkpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgc3VwZXIuY29uc3RydWN0RnJvbVhNTCh4bWwpO1xyXG5cclxuICAgICAgICBGYWlyeVV0aWxzLnNldFZhcih0aGlzLCB0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5fYnRuQ29udHJvbGxlciA9IHRoaXNbXCJfYnV0dG9uQ29udHJvbGxlclwiXTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0KG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBJc0luaXRlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc0luaXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBjdXJyZW50U3RhdGUodmFsdWU6IHN0cmluZykge1xyXG5cclxuICAgICAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2J0bkNvbnRyb2xsZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fYnRuQ29udHJvbGxlci5zZWxlY3RlZFBhZ2UgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKirlvZPliY3nirbmgIEgKi9cclxuICAgIHB1YmxpYyBnZXQgY3VycmVudFN0YXRlKCk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50U3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3codmFsdWU6IGFueSk6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLl9fZGF0YSA9IHZhbHVlO1xyXG5cclxuICAgICAgICB0aGlzLmFkZEFsbExpc3RlbmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZGUoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuX19kYXRhID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgZW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuICAgICAgICB0aGlzLl9lbmFibGVkID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy50b3VjaGFibGUgPSB2YWx1ZTtcclxuICAgICAgICBpZiggdGhpcy5faWNvbk9iamVjdCApe1xyXG4gICAgICAgICAgICB0aGlzLl9pY29uT2JqZWN0LmdyYXllZCA9ICF2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOaYr+WQpuWPr+eCueWHuyzkuI3lj6/ngrnlh7vnva7ngbBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBlbmFibGVkKCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoExheWHljp/nlJ/lhYPku7ZcclxuICAgICAqIEBwYXJhbSBjaGlsZCBMYXlh5Y6f55Sf5pi+56S65a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRMYXlhQ2hpbGQoY2hpbGQ6IExheWEuTm9kZSk6IHZvaWQge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXIuYWRkQ2hpbGQoY2hpbGQpO1xyXG4gICAgfVxyXG4gICAgLyoq5re75YqgTGF5YeWOn+eUn+WFg+S7tlxyXG4gICAgICogQHBhcmFtIGNoaWxkIExheWHljp/nlJ/mmL7npLrlr7nosaFcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZExheWFDaGlsZEF0KGNoaWxkOiBMYXlhLk5vZGUsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jb250YWluZXIuYWRkQ2hpbGRBdChjaGlsZCwgaW5kZXgpOyAgICAgICAgXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpExheWHljp/nlJ/lhYPku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUxheWFDaGlsZChjaGlsZDogTGF5YS5Ob2RlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmIChjaGlsZCAmJiB0aGlzLl9jb250YWluZXIuY29udGFpbnMoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZW1vdmVDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZCAmJiBjaGlsZC5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiHs+S6jumhtuWxglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdG9Ub3AoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFyZW50Lm51bUNoaWxkcmVuID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuc2V0Q2hpbGRJbmRleCh0aGlzLCB0aGlzLnBhcmVudC5udW1DaGlsZHJlbiAtIDEpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuc2V0Q2hpbGRJbmRleCh0aGlzLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaUueWPmOWFg+S7tua3seW6pue0ouW8lVxyXG4gICAgICogQHBhcmFtIGluZGV4IOe0ouW8lVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW5kZXhUbyhpbmRleDogbnVtYmVyKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+ICh0aGlzLnBhcmVudC5udW1DaGlsZHJlbiAtIDEpKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IHRoaXMucGFyZW50Lm51bUNoaWxkcmVuIC0gMTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5zZXRDaGlsZEluZGV4KHRoaXMsIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Zyo54i25a655Zmo5Lit55qE57Si5byVICovXHJcbiAgICBwdWJsaWMgZ2V0SW5kZXgoKTpudW1iZXJ7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmdldENoaWxkSW5kZXgoIHRoaXMgKSA6IC0xO1xyXG4gICAgfSBcclxuXHJcbiAgICAvKipcclxuICAgICAqIOiHs+S6juW6lemDqCBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvQm90dG9tKCk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5zZXRDaGlsZEluZGV4KHRoaXMsIDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluadoeebrlxyXG4gICAgICogQHBhcmFtIG5hbWUg57uE5Lu25ZCN5a2XXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRFbGVtZW50KG5hbWU6IHN0cmluZywgY29udGFpbmVyOiBmYWlyeWd1aS5HQ29tcG9uZW50ID0gbnVsbCk6IGFueSB7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lciA9IGNvbnRhaW5lciB8fCB0aGlzO1xyXG4gICAgICAgIHJldHVybiBjb250YWluZXIuZ2V0Q2hpbGQobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmK/lkKbljIXlkKvmn5DkuKrlr7nosaFcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnRhaW5zKGNoaWxkOiBmYWlyeWd1aS5HT2JqZWN0KTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldENoaWxkSW5kZXgoY2hpbGQpICE9IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdG91Y2hFbmFibGVkKHZhbHVlOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5tb3VzZUVuYWJsZWQgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHRvdWNoRW5hYmxlZCgpOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lci5tb3VzZUVuYWJsZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB0b3VjaENoaWxkcmVuKHZhbHVlOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5tb3VzZVRocm91Z2ggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHRvdWNoQ2hpbGRyZW4oKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250YWluZXIubW91c2VUaHJvdWdoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6+572uRmFpcnlHdWnotYTmupBcclxuICAgICAqIEBwYXJhbSBwa2dOYW1lIOWMheWQjVxyXG4gICAgICogQHBhcmFtIHJlc05hbWUg6LWE5rqQ5ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRGYWlyeVNvdXJjZShwa2dOYW1lOiBzdHJpbmcsIHJlc05hbWU6IHN0cmluZywgZGlzT2JqOiBmYWlyeWd1aS5HTG9hZGVyID0gbnVsbCk6IHZvaWQge1xyXG5cclxuICAgICAgICBkaXNPYmogPSBkaXNPYmogfHwgPGZhaXJ5Z3VpLkdMb2FkZXI+dGhpcy5faWNvbk9iamVjdDtcclxuICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSBmYWlyeWd1aS5VSVBhY2thZ2UuZ2V0SXRlbVVSTChwa2dOYW1lLCByZXNOYW1lKTtcclxuICAgICAgICB0aGlzLnNldEZhaXJ5VXJsKHVybCwgZGlzT2JqKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiuvue9rkZhaXJ5R3Vp6LWE5rqQ5Zyw5Z2AXHJcbiAgICAgKiBAcGFyYW0gdXJsIEZhaXJ5R3Vp6LWE5rqQ5Zyw5Z2AXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRGYWlyeVVybCh1cmw6IHN0cmluZywgZGlzT2JqOiBmYWlyeWd1aS5HTG9hZGVyID0gbnVsbCk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAoZGlzT2JqICE9IG51bGwpIHtcclxuICAgICAgICAgICAgZGlzT2JqLnVybCA9IHVybDsvLyA/IEZhaXJ5VGV4dHVyZVV0aWxzLmdldFRleHR1cmUodXJsKSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5YyF5ZCr5YWo5bGA5Z2Q5qCH54K5XHJcbiAgICAgKiBAcGFyYW0gZ3gg5YWo5bGAWOWdkOagh1xyXG4gICAgICogQHBhcmFtIGd5IOWFqOWxgFnlnZDmoIdcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnRhaW5zR2xvYmFsUG9pbnQoZ3g6IG51bWJlciwgZ3k6IG51bWJlcik6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICBsZXQgbHA6IExheWEuUG9pbnQgPSB0aGlzLmdsb2JhbFRvTG9jYWwoZ3gsIGd5KTtcclxuICAgICAgICBsZXQgYm91bmRzOiBMYXlhLlJlY3RhbmdsZSA9IG5ldyBMYXlhLlJlY3RhbmdsZSgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgaWYoIHRoaXMucGl2b3RBc0FuY2hvciApey8v5piv5ZCm5Lit5b+D54K55Li66ZSa54K5XHJcbiAgICAgICAgICAgIGJvdW5kcy54ID0gLXRoaXMud2lkdGggKiAwLjU7XHJcbiAgICAgICAgICAgIGJvdW5kcy55ID0gLXRoaXMuaGVpZ2h0ICogMC41O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYm91bmRzLmNvbnRhaW5zKGxwLngsIGxwLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YOP57Sg56m/6YCPXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgcGl4ZWxIaXRUZXN0KHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmKCB0aGlzLl9pY29uT2JqZWN0ICl7XHJcbiAgICAgICAgICAgIGxldCBsb2FkZXI6IGZhaXJ5Z3VpLkdMb2FkZXIgPSB0aGlzLl9pY29uT2JqZWN0LmFzTG9hZGVyO1xyXG4gICAgICAgICAgICBpZiAobG9hZGVyLmNvbnRlbnQgaW5zdGFuY2VvZiBMYXlhLkJpdG1hcCkge1xyXG4gICAgICAgICAgICAgICAgLy8gbG9hZGVyLmNvbnRlbnQucGl4ZWxIaXRUZXN0ID0gdmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICAgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIFxyXG4gICAgLy/liJ3lp4vljJZcclxuICAgIHB1YmxpYyBpbml0KHBhcmFtOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmluaXRVSSgpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZEFsbExpc3RlbmVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy/liJ3lp4vljJZVSVxyXG4gICAgcHVibGljIGluaXRVSSgpOiB2b2lkIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy/lop7liqDnm5HlkKzkuovku7blh73mlbBcclxuICAgIHB1YmxpYyBhZGRBbGxMaXN0ZW5lcigpOnZvaWQge1xyXG5cclxuICAgICAgICBmb3IoIGxldCBrZXkgaW4gdGhpcy5tX2NvbXBvbmVudERpYyApe1xyXG4gICAgICAgICAgICBsZXQgZGF0YTphbnkgPSB0aGlzLm1fY29tcG9uZW50RGljLmdldCgga2V5ICk7XHJcbiAgICAgICAgICAgIGlmKCBHbG9iYWwuaXMoIGRhdGEgLCBcIklDb21wb25lbnRcIiApKXtcclxuICAgICAgICAgICAgICAgICg8SUNvbXBvbmVudD5kYXRhKS5hZGRBbGxMaXN0ZW5lcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8v56e76Zmk55uR5ZCs5LqL5Lu25Ye95pWwXHJcbiAgICBwdWJsaWMgcmVtb3ZlQWxsTGlzdGVuZXIoKTp2b2lkIHtcclxuXHJcbiAgICAgICAgZm9yKCBsZXQga2V5IGluIHRoaXMubV9jb21wb25lbnREaWMgKXtcclxuICAgICAgICAgICAgbGV0IGRhdGE6YW55ID0gdGhpcy5tX2NvbXBvbmVudERpYy5nZXQoIGtleSApO1xyXG4gICAgICAgICAgICBpZiggR2xvYmFsLmlzKCBkYXRhICwgXCJJQ29tcG9uZW50XCIgKSl7XHJcbiAgICAgICAgICAgICAgICAoPElDb21wb25lbnQ+ZGF0YSkucmVtb3ZlQWxsTGlzdGVuZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOS6i+S7tuebkeWQrFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkR2FtZUxpc3RlbmVyKHR5cGU6IHN0cmluZywgbGlzdGVuZXI6IEZ1bmN0aW9uLCB0aGlzT2JqZWN0OiBhbnksIHRhcmdldD86IGFueSkge1xyXG4gICAgICAgIGlmKCB0aGlzLm1fZXZlbnRQb29sICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5tX2V2ZW50UG9vbC5hZGRMaXN0ZW5lciggdHlwZSAsIGxpc3RlbmVyICwgdGFyZ2V0ICwgdGhpc09iamVjdCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOS6i+S7tuebkeWQrFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlR2FtZUxpc3RlbmVyKHR5cGU6IHN0cmluZywgbGlzdGVuZXI6IEZ1bmN0aW9uLCB0aGlzT2JqZWN0OiBhbnksIHRhcmdldD86IGFueSkge1xyXG4gICAgICAgIGlmKCB0aGlzLm1fZXZlbnRQb29sICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5tX2V2ZW50UG9vbC5yZW1vdmVMaXN0ZW5lciggdHlwZSAsIGxpc3RlbmVyICwgdGFyZ2V0ICwgdGhpc09iamVjdCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOe7hOS7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkQ29tcG9uZW50KGNvbXBvbmVudDogSUNvbXBvbmVudCk6IGFueSB7XHJcblxyXG4gICAgICAgIGlmICggY29tcG9uZW50ID09IG51bGwgfHwgdGhpcy5tX2NvbXBvbmVudERpYy5oYXNPd25Qcm9wZXJ0eSggXCJcIiArIGNvbXBvbmVudC5nZXRIYXNoQ29kZSgpICkgKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCLlt7LmnInnm7jlkIznu4Tku7ZcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljLnNldCggY29tcG9uZW50LmdldEhhc2hDb2RlKCksIGNvbXBvbmVudCApO1xyXG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTnu4Tku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUNvbXBvbmVudChjb21wb25lbnQ6IElDb21wb25lbnQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYoIGNvbXBvbmVudCA9PSBudWxsICkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBwb29sOiBJQ29tcG9uZW50ID0gdGhpcy5tX2NvbXBvbmVudERpY1tjb21wb25lbnQuZ2V0SGFzaENvZGUoKV07XHJcbiAgICAgICAgaWYgKHBvb2wgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBkZWxldGUgdGhpcy5tX2NvbXBvbmVudERpY1tjb21wb25lbnQuZ2V0SGFzaENvZGUoKV07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTmiYDmnInnu4Tku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUFsbENvbXBvbmVudCgpOnZvaWR7XHJcblxyXG4gICAgICAgIC8vIHRoaXMubV9jb21wb25lbnREaWMucmVzZXQoKTtcclxuICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YeN572u55WM6Z2iXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IoIGxldCBrZXkgaW4gdGhpcy5tX2NvbXBvbmVudERpYyApe1xyXG4gICAgICAgICAgICBsZXQgZGF0YTphbnkgPSB0aGlzLm1fY29tcG9uZW50RGljLmdldCgga2V5ICk7XHJcbiAgICAgICAgICAgIGlmKCBHbG9iYWwuaXMoIGRhdGEgLCBcIklDb21wb25lbnRcIiApKXtcclxuICAgICAgICAgICAgICAgICg8SUNvbXBvbmVudD5kYXRhKS5jbGVhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBkZXN0cm95Q29tcG9uZW50KCk6IHZvaWQge1xyXG5cclxuICAgICAgICBmb3IoIGxldCBrZXkgaW4gdGhpcy5tX2NvbXBvbmVudERpYyApe1xyXG4gICAgICAgICAgICBsZXQgZGF0YTphbnkgPSB0aGlzLm1fY29tcG9uZW50RGljLmdldCgga2V5ICk7XHJcbiAgICAgICAgICAgIGlmKCBHbG9iYWwuaXMoIGRhdGEgLCBcIklDb21wb25lbnRcIiApKXtcclxuICAgICAgICAgICAgICAgICg8SUNvbXBvbmVudD5kYXRhKS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bllK/kuIBoYXNoQ29kZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0SGFzaENvZGUoKTogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXNbXCIkX0dJRFwiXSA9IHRoaXNbXCIkX0dJRFwiXSB8fCBMYXlhLlV0aWxzLmdldEdJRCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNEaXNwb3NlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpc1tcIl9kaXNwb3NlZFwiXTtcclxuICAgIH1cclxuXHJcbiAgICAvKirlm57mlLbliLDmsaDkuK0gKi9cclxuICAgIHB1YmxpYyByZWNvdmVyKCk6dm9pZHtcclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDph4rmlL7miYDmnInotYTmupBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRpc3Bvc2UoKTp2b2lke1xyXG5cclxuICAgICAgICBpZiAodGhpc1tcIl9kaXNwb3NlZFwiXSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzdXBlci5kaXNwb3NlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fX2RhdGEgPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLm1fZXZlbnRQb29sKSB7XHJcbiAgICAgICAgICAgIHRoaXMubV9ldmVudFBvb2wuZGlzcG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljID0gbnVsbDtcclxuICAgICAgICB0aGlzLm1fZXZlbnRQb29sID0gbnVsbDtcclxuICAgIH1cclxufSIsImltcG9ydCBHbG9iYWwgZnJvbSBcIi4uLy4uLy4uL0dsb2JhbFwiO1xyXG5pbXBvcnQgRXZlbnRQb29sIGZyb20gXCIuLi8uLi8uLi9jb20vZXZlbnRzL0V2ZW50UG9vbFwiO1xyXG5cclxuLyoqXHJcbiAqIGZhaXJ5Z3Vp5Y6f5Lu25Z+657G7XHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlU3ByaXRlIGV4dGVuZHMgZmFpcnlndWkuR0NvbXBvbmVudCBpbXBsZW1lbnRzIElDb21wb25lbnR7XHJcblxyXG4gICAgLyoq5pWw5o2uICovXHJcbiAgICBwcm90ZWN0ZWQgX2RhdGE6IGFueSA9IG51bGw7XHJcbiAgICAvKirmmK/lkKblj5jngbAgKi9cclxuICAgIHByb3RlY3RlZCBfaXNHcmF5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAvKipcclxuICAgICAqIOeUqOS8oOWFpeeahGZhaXJ5dWkuR0NvbXBvbmVudOi9rOWMluS4ukJhc2VTcHJpdGVcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIG93ZXI6IGZhaXJ5Z3VpLkdDb21wb25lbnQgPSBudWxsO1xyXG5cclxuICAgIHByb3RlY3RlZCBfaWNvbkxvYWRlcjpmYWlyeWd1aS5HTG9hZGVyO1xyXG5cclxuICAgIHByb3RlY3RlZCBfY3VycmVudFN0YXRlOnN0cmluZyA9IFwiXCI7XHJcblxyXG5cdHByb3RlY3RlZCBfYnV0dG9uQ29udHJvbGxlcjpmYWlyeWd1aS5Db250cm9sbGVyO1xyXG5cclxuICAgIC8v5LqL5Lu257yT5a2Y5rGgXHJcbiAgICBwcm90ZWN0ZWQgbV9ldmVudFBvb2w6IEV2ZW50UG9vbCA9IG51bGw7XHJcbiAgICAvL+e7hOS7tue8k+WtmOaxoFxyXG5cdHByb3RlY3RlZCBtX2NvbXBvbmVudERpYzogTGF5YS5XZWFrT2JqZWN0ID0gbnVsbDtcclxuICAgICAgICBcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihjb21wOiBmYWlyeWd1aS5HQ29tcG9uZW50ID0gbnVsbCkge1xyXG5cclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLm93ZXIgPSBjb21wO1xyXG5cclxuICAgICAgICB0aGlzLm1fZXZlbnRQb29sID0gRXZlbnRQb29sLmNyZWF0ZSgpO1xyXG4gICAgICAgIHRoaXMubV9jb21wb25lbnREaWMgPSBuZXcgTGF5YS5XZWFrT2JqZWN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbnN0cnVjdEZyb21YTUwoeG1sOiBhbnkpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgc3VwZXIuY29uc3RydWN0RnJvbVhNTCh4bWwpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRDb250cm9sbGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yid5aeL5YyW5o6n5Yi25ZmoICovXHJcbiAgICBwcm90ZWN0ZWQgaW5pdENvbnRyb2xsZXIoKTp2b2lke1xyXG5cclxuICAgICAgICB0aGlzLl9idXR0b25Db250cm9sbGVyID0gdGhpcy5nZXRDb250cm9sbGVyKFwiYnV0dG9uXCIpO1xyXG4gICAgICAgIHRoaXMuX2ljb25Mb2FkZXIgPSA8ZmFpcnlndWkuR0xvYWRlcj50aGlzLmdldENoaWxkKFwiaWNvblwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGN1cnJlbnRTdGF0ZSh2YWx1ZTogc3RyaW5nKSB7XHJcblx0XHRcdFxyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTdGF0ZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpZiggdGhpcy5fYnV0dG9uQ29udHJvbGxlciApe1xyXG4gICAgICAgICAgICB0aGlzLl9idXR0b25Db250cm9sbGVyLnNlbGVjdGVkUGFnZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKuW9k+WJjeeKtuaAgSAqL1xyXG4gICAgcHVibGljIGdldCBjdXJyZW50U3RhdGUoKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRTdGF0ZTtcclxuICAgIH1cdFx0XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmK/lkKbljIXlkKvlhajlsYDlnZDmoIfngrlcclxuICAgICAqIEBwYXJhbSBneCDlhajlsYBY5Z2Q5qCHXHJcbiAgICAgKiBAcGFyYW0gZ3kg5YWo5bGAWeWdkOagh1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29udGFpbnNHbG9iYWxQb2ludChneDogbnVtYmVyLCBneTogbnVtYmVyKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIGxldCBscDogTGF5YS5Qb2ludCA9IHRoaXMuZ2xvYmFsVG9Mb2NhbChneCwgZ3kpO1xyXG4gICAgICAgIGxldCBib3VuZHM6IExheWEuUmVjdGFuZ2xlID0gbmV3IExheWEuUmVjdGFuZ2xlKDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICByZXR1cm4gYm91bmRzLmNvbnRhaW5zKGxwLngsIGxwLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDaGlsZChjaGlsZDogZmFpcnlndWkuR09iamVjdCk6IGZhaXJ5Z3VpLkdPYmplY3Qge1xyXG5cclxuICAgICAgICBpZiAoIEdsb2JhbC5pcyggY2hpbGQgLCBcIklDb21wb25lbnRcIiApICkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENvbXBvbmVudCg8YW55PmNoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFkZENoaWxkKGNoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2hpbGRBdChjaGlsZDogZmFpcnlndWkuR09iamVjdCwgaW5kZXg6IG51bWJlcik6IGZhaXJ5Z3VpLkdPYmplY3Qge1xyXG5cclxuICAgICAgICBpZiAoIEdsb2JhbC5pcyggY2hpbGQgLCBcIklDb21wb25lbnRcIiApICkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENvbXBvbmVudCg8YW55PmNoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmFkZENoaWxkQXQoY2hpbGQsIGluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluadoeebrlxyXG4gICAgICogQHBhcmFtIG5hbWUg57uE5Lu25ZCN5a2XXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRFbGVtZW50KG5hbWU6IHN0cmluZywgY29udGFpbmVyOiBmYWlyeWd1aS5HQ29tcG9uZW50ID0gbnVsbCk6IGFueSB7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lciA9IGNvbnRhaW5lciB8fCB0aGlzO1xyXG4gICAgICAgIHJldHVybiBjb250YWluZXIuZ2V0Q2hpbGQobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmK/lkKbljIXlkKvmn5DkuKrlr7nosaFcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnRhaW5zKGNoaWxkOiBmYWlyeWd1aS5HT2JqZWN0KTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldENoaWxkSW5kZXgoY2hpbGQpICE9IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5re75YqgTGF5YeWOn+eUn+WFg+S7tlxyXG4gICAgICogQHBhcmFtIGNoaWxkIExheWHljp/nlJ/mmL7npLrlr7nosaFcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZExheWFDaGlsZChjaGlsZDogTGF5YS5Ob2RlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hZGRDaGlsZChjaGlsZCk7XHJcbiAgICB9XHJcbiAgICAvKirmt7vliqBMYXlh5Y6f55Sf5YWD5Lu2XHJcbiAgICAgKiBAcGFyYW0gY2hpbGQgTGF5YeWOn+eUn+aYvuekuuWvueixoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkTGF5YUNoaWxkQXQoY2hpbGQ6IExheWEuTm9kZSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hZGRDaGlsZEF0KGNoaWxkLCBpbmRleCk7ICAgICAgICBcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog56e76ZmkTGF5YeWOn+eUn+WFg+S7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlTGF5YUNoaWxkKGNoaWxkOiBMYXlhLk5vZGUpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKGNoaWxkICYmIHRoaXMuX2NvbnRhaW5lci5jb250YWlucyhjaGlsZCkpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLnJlbW92ZUNoaWxkKGNoaWxkKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNoaWxkICYmIGNoaWxkLnBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNoaWxkLnBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdG91Y2hFbmFibGVkKHZhbHVlOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5tb3VzZUVuYWJsZWQgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHRvdWNoRW5hYmxlZCgpOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lci5tb3VzZUVuYWJsZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB0b3VjaENoaWxkcmVuKHZhbHVlOiBib29sZWFuKSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5tb3VzZVRocm91Z2ggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHRvdWNoQ2hpbGRyZW4oKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250YWluZXIubW91c2VUaHJvdWdoO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIHB1YmxpYyBhZGRFdmVudExpc3RlbmVyKCB0eXBlOnN0cmluZyAsIGxpc3RlbmVyOkZ1bmN0aW9uICwgdGhpc09iamVjdDphbnkgLCBhcmdzOkFycmF5PGFueT4gPSBudWxsICk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5vbiggdHlwZSAsIHRoaXNPYmplY3QgLCBsaXN0ZW5lciAsIGFyZ3MgKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlOnN0cmluZyAsIGxpc3RlbmVyOkZ1bmN0aW9uICwgdGhpc09iamVjdDphbnkgKTp2b2lke1xyXG5cclxuICAgICAgICB0aGlzLm9mZiggdHlwZSAsIHRoaXNPYmplY3QgLCBsaXN0ZW5lciApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5aKe5Yqg55uR5ZCs5LqL5Lu25Ye95pWwXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRBbGxMaXN0ZW5lcigpOnZvaWQge1xyXG5cclxuICAgICAgICBpZiggdGhpcy5tX2V2ZW50UG9vbCAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMubV9ldmVudFBvb2wucmVsaXN0ZW5lckFsbCgpO1xyXG4gICAgICAgICAgICBmb3IoIGxldCBrZXkgaW4gdGhpcy5tX2NvbXBvbmVudERpYyApe1xyXG4gICAgICAgICAgICAgICAgbGV0IGRhdGE6YW55ID0gdGhpcy5tX2NvbXBvbmVudERpYy5nZXQoIGtleSApO1xyXG4gICAgICAgICAgICAgICAgaWYoIEdsb2JhbC5pcyggZGF0YSAsIFwiSUNvbXBvbmVudFwiICkpe1xyXG4gICAgICAgICAgICAgICAgICAgICg8SUNvbXBvbmVudD5kYXRhKS5hZGRBbGxMaXN0ZW5lcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVx0XHRcdFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk55uR5ZCs5LqL5Lu25Ye95pWwXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVBbGxMaXN0ZW5lcigpOnZvaWQge1xyXG5cclxuICAgICAgICBpZiggdGhpcy5tX2V2ZW50UG9vbCAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMubV9ldmVudFBvb2wucmVtb3ZlQWxsTGlzdGVuZXIoKTtcclxuICAgICAgICAgICAgZm9yKCBsZXQga2V5IGluIHRoaXMubV9jb21wb25lbnREaWMgKXtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhOmFueSA9IHRoaXMubV9jb21wb25lbnREaWMuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgICAgIGlmKCBHbG9iYWwuaXMoIGRhdGEgLCBcIklDb21wb25lbnRcIiApKXtcclxuICAgICAgICAgICAgICAgICAgICAoPElDb21wb25lbnQ+ZGF0YSkucmVtb3ZlQWxsTGlzdGVuZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cdFx0XHRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOS6i+S7tuebkeWQrFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkR2FtZUxpc3RlbmVyKHR5cGU6IHN0cmluZywgbGlzdGVuZXI6IEZ1bmN0aW9uLCB0aGlzT2JqZWN0OiBhbnkgLCB0YXJnZXQ/OiBhbnkpIHtcclxuICAgICAgICBpZiggdGhpcy5tX2V2ZW50UG9vbCAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMubV9ldmVudFBvb2wuYWRkTGlzdGVuZXIoIHR5cGUgLCBsaXN0ZW5lciAsIHRhcmdldCAsIHRoaXNPYmplY3QgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTkuovku7bnm5HlkKxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUdhbWVMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiwgdGhpc09iamVjdDogYW55ICwgdGFyZ2V0PzogYW55KSB7XHJcbiAgICAgICAgaWYoIHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLnJlbW92ZUxpc3RlbmVyKCB0eXBlICwgbGlzdGVuZXIgLCB0YXJnZXQgLCB0aGlzT2JqZWN0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg57uE5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRDb21wb25lbnQoY29tcG9uZW50OiBJQ29tcG9uZW50KTogYW55IHtcclxuXHJcbiAgICAgICAgaWYoIGNvbXBvbmVudCApe1xyXG4gICAgICAgICAgICBsZXQgaGFzaENvZGU6bnVtYmVyID0gY29tcG9uZW50LmdldEhhc2hDb2RlKCk7XHJcbiAgICAgICAgICAgIHRoaXMubV9jb21wb25lbnREaWMuc2V0KCBoYXNoQ29kZSAsIGNvbXBvbmVudCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29tcG9uZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk57uE5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVDb21wb25lbnQoY29tcG9uZW50OiBJQ29tcG9uZW50KTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmKCBjb21wb25lbnQgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICBsZXQgaGFzaENvZGU6bnVtYmVyID0gY29tcG9uZW50LmdldEhhc2hDb2RlKCk7XHJcbiAgICAgICAgICAgIHRoaXMubV9jb21wb25lbnREaWMuZGVsKCBoYXNoQ29kZSAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTmiYDmnInnu4Tku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUFsbENvbXBvbmVudCgpOnZvaWR7XHJcblxyXG4gICAgICAgIGZvcihsZXQga2V5IGluIHRoaXMubV9jb21wb25lbnREaWMgKXtcclxuICAgICAgICAgICAgdGhpcy5tX2NvbXBvbmVudERpYy5kZWwoIGtleSApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0aGlzLm1fY29tcG9uZW50RGljLnJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDph43nva7nlYzpnaJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5tX2V2ZW50UG9vbCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubV9ldmVudFBvb2wucmVtb3ZlQWxsTGlzdGVuZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKCBsZXQga2V5IGluIHRoaXMubV9jb21wb25lbnREaWMgKXtcclxuICAgICAgICAgICAgbGV0IGRhdGE6YW55ID0gdGhpcy5tX2NvbXBvbmVudERpYy5nZXQoIGtleSApO1xyXG4gICAgICAgICAgICBpZiggR2xvYmFsLmlzKCBkYXRhICwgXCJJQ29tcG9uZW50XCIgKSApe1xyXG4gICAgICAgICAgICAgICAgKDxJQ29tcG9uZW50PmRhdGEpLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGRlc3Ryb3lDb21wb25lbnQoKTogdm9pZCB7XHJcbiAgICAgICAgZm9yKCBsZXQga2V5IGluIHRoaXMubV9jb21wb25lbnREaWMgKXtcclxuICAgICAgICAgICAgbGV0IGRhdGE6YW55ID0gdGhpcy5tX2NvbXBvbmVudERpYy5nZXQoIGtleSApO1xyXG4gICAgICAgICAgICBpZiggR2xvYmFsLmlzKCBkYXRhICwgXCJJQ29tcG9uZW50XCIgKSApe1xyXG4gICAgICAgICAgICAgICAgKDxJQ29tcG9uZW50PmRhdGEpLmRpc3Bvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluWUr+S4gGhhc2hDb2RlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRIYXNoQ29kZSgpOiBudW1iZXIge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpc1tcIiRfR0lEXCJdID0gdGhpc1tcIiRfR0lEXCJdIHx8IExheWEuVXRpbHMuZ2V0R0lEKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBpc0Rpc3Bvc2VkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzW1wiX2Rpc3Bvc2VkXCJdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YeK5pS+5omA5pyJ6LWE5rqQXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkaXNwb3NlKCk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXNbXCJfZGlzcG9zZWRcIl0peyAvL2ZhaXJ5Z3VpIOS4reeahOengeacieWxnuaAp1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdXBlci5kaXNwb3NlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubV9ldmVudFBvb2wpIHtcclxuICAgICAgICAgICAgdGhpcy5tX2V2ZW50UG9vbC5kaXNwb3NlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubV9jb21wb25lbnREaWMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubV9ldmVudFBvb2wgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQmFzZUJ1dHRvbiBmcm9tIFwiLi9CYXNlQnV0dG9uXCI7XHJcbi8qKlxyXG4gKiDlsIHoo4VmYWlyeWd1aeaMiemSrlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRUJ1dHRvbiBleHRlbmRzIEJhc2VCdXR0b24ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQmFzZVNwcml0ZSBmcm9tIFwiLi9CYXNlU3ByaXRlXCI7XHJcbmltcG9ydCBFQnV0dG9uIGZyb20gXCIuL0VCdXR0b25cIjtcclxuaW1wb3J0IEdsb2JhbCBmcm9tIFwiLi4vLi4vLi4vR2xvYmFsXCI7XHJcbmltcG9ydCB7IFVJRUxpc3RSZW5kZXJJdGVtIH0gZnJvbSBcIi4vVUlFTGlzdFJlbmRlckl0ZW1cIjtcclxuaW1wb3J0IEJhc2VCdXR0b24gZnJvbSBcIi4vQmFzZUJ1dHRvblwiO1xyXG5pbXBvcnQgeyBGYWlyeVRleHR1cmVVdGlscyB9IGZyb20gXCIuLi8uLi91dGlscy9GYWlyeVRleHR1cmVVdGlsc1wiO1xyXG5pbXBvcnQgeyBHYW1lRXZlbnQgfSBmcm9tIFwiLi4vLi4vLi4vY29tL2V2ZW50cy9HYW1lRXZlbnRcIjtcclxuXHJcblxyXG4vKipcclxuICAqIOWwgeijhUZhaXJ5R3Vp5YiX6KGoLOmcgOe8lui+keWZqOS4rWZhaXJ5Z3VpLkdMaXN05ZG95ZCN5Li6ZWdsaXN0X+W8gOWktFxyXG4gICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICAqL1xyXG5leHBvcnQgY2xhc3MgRUdMaXN0IGV4dGVuZHMgQmFzZVNwcml0ZSB7XHJcblxyXG5cdHByb3RlY3RlZCBsaXN0OiBmYWlyeWd1aS5HTGlzdDtcclxuXHRwcm90ZWN0ZWQgX2FycmF5OiBBcnJheTxhbnk+O1xyXG5cdHByb3RlY3RlZCBfdGhpc09iamVjdDogYW55O1xyXG5cdHByb3RlY3RlZCBfaXRlbVJlbmRlcmVyOiBMYXlhLkhhbmRsZXIgPSBudWxsO1xyXG5cdHByb3RlY3RlZCBfY2xpY2tIYW5kbGVyOiBGdW5jdGlvbiA9IG51bGw7Ly/ngrnlh7vkuovku7ZcclxuXHRwcm90ZWN0ZWQgX3NlbGVjdGVkUGFnZTogRnVuY3Rpb24gPSBudWxsOy8v5YiG6aG16YCJ5Lit5p+Q5LiA6aG16Kem5Y+R55qE5LqL5Lu2XHJcblx0cHJvdGVjdGVkIF9lbGVtZW50czogQXJyYXk8ZmFpcnlndWkuR09iamVjdD4gPSBudWxsO1xyXG5cdHByb3RlY3RlZCBfbGFzdGNsaWNrSXRlbTogZmFpcnlndWkuR09iamVjdCA9IG51bGw7XHJcblx0cHJpdmF0ZSBfaXNTaG93RG9TcGVjaWFsRWZmZWN0OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdC8qKuWIhumhtee7hOS7tiAqL1xyXG5cdHByb3RlY3RlZCBjdXJyZW50cGFnZTogbnVtYmVyID0gMDtcclxuXHRwcm90ZWN0ZWQgaXNGaXJzdDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdC8qKuWQkeW3puaMiemSriAqL1xyXG5cdHByb3RlY3RlZCBfYnRuX2xlZnQ6IEVCdXR0b24gfCBmYWlyeWd1aS5HQnV0dG9uO1xyXG5cdC8qKuWQkeWPs+aMiemSriAqL1xyXG5cdHByb3RlY3RlZCBfYnRuX3JpZ2h0OiBFQnV0dG9uIHwgZmFpcnlndWkuR0J1dHRvbjtcclxuXHJcblx0Lyoq5piv5ZCm6Ieq5Yqo5ruR5Yqo5Yiw5bqV6YOoICovXHJcblx0cHVibGljIGlzQXV0b0JvdHRvbTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRwdWJsaWMgY29uc3RydWN0b3IobGlzdDogZmFpcnlndWkuR0xpc3QsIHRoaXNPYmplY3Q6IGFueSA9IG51bGwpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHR0aGlzLmxpc3QgPSBsaXN0O1xyXG5cdFx0aWYgKHRoaXMubGlzdCAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuY2FsbGJhY2tUaGlzT2JqID0gdGhpc09iamVjdCB8fCB0aGlzO1xyXG5cdFx0XHQvLyB0aGlzLmxpc3QuY2FsbGJhY2tUaGlzT2JqID0gdGhpcztcclxuXHRcdFx0dGhpcy5saXN0Lml0ZW1SZW5kZXJlciA9IExheWEuSGFuZGxlci5jcmVhdGUoIHRoaXMgLCB0aGlzLmxpc3RJdGVtUmVuZGVyICk7XHJcblx0XHRcdHRoaXMubGlzdC5vbiggTGF5YS5FdmVudC5DTElDSyAsIHRoaXMgLCB0aGlzLmNsaWNrSXRlbSApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIElzSW5pdGVkKCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYWRkQWxsTGlzdGVuZXIoKTogdm9pZCB7XHJcblxyXG5cdFx0c3VwZXIuYWRkQWxsTGlzdGVuZXIoKTtcclxuXHR9XHJcblxyXG5cdC8qKuiuvue9ruS4iuS4gOmhteaMiemSriAqL1xyXG5cdHB1YmxpYyBzZXQgYnRuX2xlZnQodmFsdWU6IEVCdXR0b24gfCBmYWlyeWd1aS5HQnV0dG9uKSB7XHJcblx0XHRpZiAodmFsdWUpIHtcclxuXHRcdFx0dGhpcy5fYnRuX2xlZnQgPSB2YWx1ZTtcclxuXHRcdFx0dGhpcy5fYnRuX2xlZnQub24oIExheWEuRXZlbnQuQ0xJQ0sgLCB0aGlzICwgdGhpcy50b3VjaExlZnRCdG5IYW5kbGVyICk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAodGhpcy5fYnRuX2xlZnQpIHtcclxuXHRcdFx0XHR0aGlzLl9idG5fbGVmdC5vZmYoTGF5YS5FdmVudC5DTElDSywgdGhpcywgdGhpcy50b3VjaExlZnRCdG5IYW5kbGVyICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCog5LiK5LiA6aG1XHJcblx0Ki9cclxuXHRwcml2YXRlIHRvdWNoTGVmdEJ0bkhhbmRsZXIoZTogTGF5YS5FdmVudCk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuY3VycmVudHBhZ2UgPiAwKSB7XHJcblx0XHRcdGxldCBpbmRleDogbnVtYmVyID0gdGhpcy5jdXJyZW50cGFnZSAtIDE7XHJcblx0XHRcdHRoaXMudG9QYWdlKGluZGV4KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKuiuvue9ruS4i+S4gOmhteaMiemSriAqL1xyXG5cdHB1YmxpYyBzZXQgYnRuX3JpZ2h0KHZhbHVlOiBFQnV0dG9uIHwgZmFpcnlndWkuR0J1dHRvbikge1xyXG5cdFx0aWYgKHZhbHVlKSB7XHJcblx0XHRcdHRoaXMuX2J0bl9yaWdodCA9IHZhbHVlO1xyXG5cdFx0XHR0aGlzLl9idG5fcmlnaHQub24oTGF5YS5FdmVudC5DTElDSyAsIHRoaXMgLCB0aGlzLnRvdWNoUmlnaHRCdG5IYW5kbGVyICk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAodGhpcy5fYnRuX3JpZ2h0KSB7XHJcblx0XHRcdFx0dGhpcy5fYnRuX3JpZ2h0Lm9mZihMYXlhLkV2ZW50LkNMSUNLLCB0aGlzLCB0aGlzLnRvdWNoUmlnaHRCdG5IYW5kbGVyICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOS4i+S4gOmhtVxyXG5cdCAqL1xyXG5cdHByaXZhdGUgdG91Y2hSaWdodEJ0bkhhbmRsZXIoZTogTGF5YS5FdmVudCk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuY3VycmVudHBhZ2UgPCB0aGlzLmFycmF5Lmxlbmd0aCAtIDEpIHtcclxuXHRcdFx0bGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmN1cnJlbnRwYWdlICsgMTtcclxuXHRcdFx0dGhpcy50b1BhZ2UoaW5kZXgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Lyoq6Lez6L2s5Yiw5p+Q5LiA6aG1IDB+biovXHJcblx0cHJpdmF0ZSB0b1BhZ2UoaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0aW5kZXggPSBpbmRleCA8IDAgPyAwIDogaW5kZXg7XHJcblx0XHRpZiAodGhpcy5fc2VsZWN0ZWRQYWdlKSB7XHJcblx0XHRcdHRoaXMuX3NlbGVjdGVkUGFnZS5hcHBseSh0aGlzLmNhbGxiYWNrVGhpc09iaiwgMCk7XHJcblx0XHR9XHJcblx0XHR0aGlzLnNjcm9sbFRvVmlldyhpbmRleCwgdHJ1ZSk7Ly/mu5rliqjliLDmn5DkuIDkuKppdGVtXHJcblx0fVxyXG5cclxuXHQvKirmu5HliqhsaXN0ICovXHJcblx0cHJpdmF0ZSBzY3JvbGxMaXN0UGFnZSgpOiB2b2lkIHtcclxuXHJcblx0XHRsZXQgaW5kZXg6IG51bWJlciA9ICgodGhpcy5saXN0LmdldEZpcnN0Q2hpbGRJblZpZXcoKSkgJSB0aGlzLmxpc3QubnVtSXRlbXMpOy8v6I635Y+W6aG15pWwXHJcblxyXG5cdFx0dGhpcy5jdXJyZW50cGFnZSA9IGluZGV4O1xyXG5cclxuXHRcdGlmICh0aGlzLl9idG5fbGVmdCkge1xyXG5cdFx0XHR0aGlzLl9idG5fbGVmdC5lbmFibGVkID0gdGhpcy5jdXJyZW50cGFnZSA+IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX2J0bl9yaWdodCkge1xyXG5cdFx0XHR0aGlzLl9idG5fcmlnaHQuZW5hYmxlZCA9IHRoaXMuY3VycmVudHBhZ2UgPCAodGhpcy5hcnJheS5sZW5ndGggLSAxKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fc2VsZWN0ZWRQYWdlKSB7XHJcblx0XHRcdHRoaXMuX3NlbGVjdGVkUGFnZS5hcHBseSh0aGlzLmNhbGxiYWNrVGhpc09iaiwgMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGlzU2hvd0RvU3BlY2lhbEVmZmVjdChib29sOiBib29sZWFuKSB7XHJcblx0XHR0aGlzLl9pc1Nob3dEb1NwZWNpYWxFZmZlY3QgPSBib29sO1xyXG5cdFx0aWYgKHRoaXMuX2lzU2hvd0RvU3BlY2lhbEVmZmVjdCkge1xyXG5cdFx0XHR0aGlzLmxpc3Qub24oZmFpcnlndWkuRXZlbnRzLlNDUk9MTCwgdGhpcywgdGhpcy5kb1NwZWNpYWxFZmZlY3QpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5saXN0Lm9mZihmYWlyeWd1aS5FdmVudHMuU0NST0xMLCB0aGlzLCB0aGlzLmRvU3BlY2lhbEVmZmVjdCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5ruR5YqobGlzdFxyXG5cdCAgKi9cclxuXHRwcml2YXRlIGRvU3BlY2lhbEVmZmVjdCgpOiB2b2lkIHtcclxuXHRcdHZhciBtaWRYOiBudW1iZXIgPSB0aGlzLmxpc3Quc2Nyb2xsUGFuZS5wb3NYICsgdGhpcy5saXN0LnZpZXdXaWR0aCAvIDI7XHJcblx0XHR2YXIgY250OiBudW1iZXIgPSB0aGlzLmxpc3QubnVtQ2hpbGRyZW47XHJcblx0XHRmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgY250OyBpKyspIHtcclxuXHRcdFx0dmFyIG9iajogZmFpcnlndWkuR09iamVjdCA9IHRoaXMubGlzdC5nZXRDaGlsZEF0KGkpO1xyXG5cdFx0XHR2YXIgZGlzdDogbnVtYmVyID0gTWF0aC5hYnMobWlkWCAtIG9iai54IC0gb2JqLndpZHRoIC8gMik7XHJcblx0XHRcdGlmIChkaXN0IDw9IG9iai53aWR0aCAqIDAuNSkgLy/mraTmnaHnm67lnKjkuK3pl7RcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmICh0aGlzLl9sYXN0Y2xpY2tJdGVtICYmIG9iaiAmJiB0aGlzLl9sYXN0Y2xpY2tJdGVtID09IG9iaikge1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuY2xpY2tJbmRleCA9IHRoaXMuZ2V0U2hvd0l0ZW1JbmRleChvYmopO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIGdldFNob3dJdGVtKGluZGV4OiBudW1iZXIpOiBhbnkge1xyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5nZXRDaGlsZEF0KGluZGV4KTtcclxuXHR9XHJcblxyXG5cdC8qKiDmm7TlhbfmnaHnm64g6I635Y+W57Si5byV77yM5piv5ZCm5Li65p2h55uu57Si5byVKi9cclxuXHRwdWJsaWMgZ2V0U2hvd0l0ZW1JbmRleChpdGVtOiBmYWlyeWd1aS5HT2JqZWN0LCBpc0NoaW5kSW5kZXg6IGJvb2xlYW4gPSB0cnVlKTogbnVtYmVyIHtcclxuXHRcdGlmIChpc0NoaW5kSW5kZXgpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubGlzdC5nZXRDaGlsZEluZGV4KGl0ZW0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubGlzdC5jaGlsZEluZGV4VG9JdGVtSW5kZXgodGhpcy5saXN0LmdldENoaWxkSW5kZXgoaXRlbSkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Lyoq6L2s5o2i5Yiw5pi+56S65a+56LGh57Si5byVKi9cclxuXHRwdWJsaWMgaXRlbUluZGV4VG9DaGlsZEluZGV4KGluZGV4OiBudW1iZXIpOiBudW1iZXIge1xyXG5cdFx0bGV0IG5ld0luZGV4OiBudW1iZXIgPSB0aGlzLmxpc3QuaXRlbUluZGV4VG9DaGlsZEluZGV4KGluZGV4KTtcclxuXHRcdHJldHVybiBuZXdJbmRleDtcclxuXHR9XHJcblxyXG5cdC8qKui9rOaNouaYvuekuuWvueixoee0ouW8leS4uumhueebrue0ouW8leOAgiovXHJcblx0cHVibGljIGNoaWxkSW5kZXhUb0l0ZW1JbmRleChpbmRleDogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdGxldCBuZXdJbmRleDogbnVtYmVyID0gdGhpcy5saXN0LmNoaWxkSW5kZXhUb0l0ZW1JbmRleChpbmRleCk7XHJcblx0XHRyZXR1cm4gbmV3SW5kZXg7XHJcblx0fVxyXG5cclxuXHQvKirorr7nva7omZrmi5/liJfooaggKi9cclxuXHRwdWJsaWMgc2V0VmlydHVhbCgpOiB2b2lkIHtcclxuXHRcdHRoaXMubGlzdC5zZXRWaXJ0dWFsKCk7XHJcblx0XHR0aGlzLnNldFNjcm9sbCgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFNjcm9sbCgpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLmxpc3QpIHtcclxuXHRcdFx0dGhpcy5saXN0Lm9uKGZhaXJ5Z3VpLkV2ZW50cy5TQ1JPTEwsIHRoaXMsIHRoaXMuc2Nyb2xsTGlzdFBhZ2UgKTsvL+i/meS4quWHveaVsOS4u+imgeaYr+adpeWkhOeQhua7muWKqOWIhumhtVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOiuvue9rkxpc3TmmK/lkKbog73lpJ/mu5rliqhcclxuXHQgICovXHJcblx0cHVibGljIHNldCBpc0RyYWdnZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuXHRcdGlmICh0aGlzLmxpc3Quc2Nyb2xsUGFuZSkge1xyXG5cdFx0XHR0aGlzLmxpc3Quc2Nyb2xsUGFuZS50b3VjaEVmZmVjdCA9IHZhbHVlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHN5bmMoKTogdm9pZCB7XHJcblx0XHR0aGlzLmxpc3QuZW5zdXJlQm91bmRzQ29ycmVjdCgpO1xyXG5cdH1cclxuXHJcblx0Lyoq6buY6K6k6YCJ5oup56ys5Yeg5LiqICovXHJcblx0cHVibGljIHNldCBjbGlja0luZGV4KGluZGV4OiBudW1iZXIpIHtcclxuXHRcdGxldCBuZXdJbmRleDogbnVtYmVyID0gdGhpcy5pdGVtSW5kZXhUb0NoaWxkSW5kZXgoaW5kZXgpO1xyXG5cdFx0aWYgKG5ld0luZGV4IDwgMCkge1xyXG5cdFx0XHRuZXdJbmRleCA9IDA7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5saXN0Lm51bUNoaWxkcmVuID4gMCkge1xyXG5cdFx0XHQvLyBsZXQgaXRlbTogZmFpcnlndWkuR09iamVjdCA9IHRoaXMubGlzdC5nZXRDaGlsZEF0KG5ld0luZGV4KTtcclxuXHRcdFx0Ly8gbGV0IGllOiBmYWlyeWd1aS5JdGVtRXZlbnQgPSBuZXcgZmFpcnlndWkuSXRlbUV2ZW50KGZhaXJ5Z3VpLkl0ZW1FdmVudC5DTElDSywgaXRlbSk7XHJcblx0XHRcdC8vIHRoaXMubGlzdC5kaXNwYXRjaEV2ZW50KGllKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgY2FsbGJhY2tUaGlzT2JqKHZhbHVlOiBhbnkpIHtcclxuXHJcblx0XHR0aGlzLl90aGlzT2JqZWN0ID0gdmFsdWU7XHJcblx0fVxyXG5cdC8qKlRoaXMgKi9cclxuXHRwdWJsaWMgZ2V0IGNhbGxiYWNrVGhpc09iaigpOiBhbnkge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLl90aGlzT2JqZWN0O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOiuvue9rua4suafk+adoeebrlxyXG5cdCAgKi9cclxuXHRwdWJsaWMgc2V0UmVuZGVySXRlbShwa2dOYW1lOiBzdHJpbmcsIHJlc05hbWU6IHN0cmluZyk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMubGlzdC5kZWZhdWx0SXRlbSA9IEZhaXJ5VGV4dHVyZVV0aWxzLmdldFVybChwa2dOYW1lLCByZXNOYW1lKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgaXRlbVByb3ZpZGVyKHZhbHVlOiBMYXlhLkhhbmRsZXIpIHtcclxuXHJcblx0XHRpZiAodGhpcy5saXN0ICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5saXN0Lml0ZW1Qcm92aWRlciA9IHZhbHVlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBpdGVtUmVuZGVyZXIodmFsdWU6IExheWEuSGFuZGxlcikge1xyXG5cclxuXHRcdHRoaXMuX2l0ZW1SZW5kZXJlciA9IHZhbHVlO1xyXG5cdFx0aWYgKHRoaXMubGlzdCAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMubGlzdC5pdGVtUmVuZGVyZXIgPSB2YWx1ZTtcclxuXHRcdH1cclxuXHR9XHJcblx0Lyoq5riy5p+T5pa55rOVICovXHJcblx0cHVibGljIGdldCBpdGVtUmVuZGVyZXIoKTpMYXlhLkhhbmRsZXIge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLl9pdGVtUmVuZGVyZXI7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGNsaWNrSGFuZGxlcih2YWx1ZTogRnVuY3Rpb24pIHtcclxuXHJcblx0XHR0aGlzLl9jbGlja0hhbmRsZXIgPSB2YWx1ZTtcclxuXHR9XHJcblx0Lyoq54K55Ye75LqL5Lu2ICovXHJcblx0cHVibGljIGdldCBjbGlja0hhbmRsZXIoKTogRnVuY3Rpb24ge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLl9jbGlja0hhbmRsZXI7XHJcblx0fVxyXG5cclxuXHQvKirorr7nva7liIbpobXkuovku7YgKi9cclxuXHRwdWJsaWMgc2V0IHNlbGVjdGVkUGFnZSh2YWx1ZTogRnVuY3Rpb24pIHtcclxuXHJcblx0XHR0aGlzLl9zZWxlY3RlZFBhZ2UgPSB2YWx1ZTtcclxuXHR9XHJcblx0Lyoq6I635Y+W5YiG6aG15LqL5Lu2ICovXHJcblx0cHVibGljIGdldCBzZWxlY3RlZFBhZ2UoKTogRnVuY3Rpb24ge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLl9zZWxlY3RlZFBhZ2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHNlbGVjdGlvbk1vZGUoKTpudW1iZXIgIHsvL2ZhaXJ5Z3VpLkxpc3RTZWxlY3Rpb25Nb2RlXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LnNlbGVjdGlvbk1vZGU7XHJcblx0fVxyXG5cdC8qKumAieaLqeaooeW8jyAqL1xyXG5cdHB1YmxpYyBzZXQgc2VsZWN0aW9uTW9kZSh2YWx1ZTogbnVtYmVyKSB7Ly9mYWlyeWd1aS5MaXN0U2VsZWN0aW9uTW9kZVxyXG5cdFx0dGhpcy5saXN0LnNlbGVjdGlvbk1vZGUgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKuaYr+WQpuS4uuWNlemAieaooeW8jyAqL1xyXG5cdHB1YmxpYyBnZXQgaXNTaW5nbGVTZWxlY3QoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuc2VsZWN0aW9uTW9kZSA9PSBmYWlyeWd1aS5MaXN0U2VsZWN0aW9uTW9kZS5TaW5nbGU7XHJcblx0fVxyXG5cclxuXHQvKirmmK/lkKbkuLrlpJrpgInmqKHlvI8gKi9cclxuXHRwdWJsaWMgZ2V0IGlzTXVsdFNlbGVjdCgpOiBib29sZWFuIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5zZWxlY3Rpb25Nb2RlID09IGZhaXJ5Z3VpLkxpc3RTZWxlY3Rpb25Nb2RlLk11bHRpcGxlO1xyXG5cdH1cclxuXHJcblx0Lyoq5q+P5qyh5pWw5YC85pS55Y+Y5LmL5YmN5Lya6Kem5Y+R5q+P5Liq5pi+56S65Lit5a2Q57uE5Lu255qEZGF0YT1udWxs55qE5pa55rOV77yM6YeN5YaZc2V0IGRhdGHoh6rlt7HlpITnkIbmlbDmja7lvJXnlKgs5p+Q5Lqb5oOF5Ya15aaC5p6c5pi+56S65Lit55qE5a2Q57uE5Lu26ZyA6KaB5pWw5o2u5pu05paw77yMXHJcblx0ICAqIOivt+S9v+eUqGVsZW1lbnRz5bGe5oCn6Ieq6KGM6L+b6KGM57uE5Lu25pu05paw77yM5LiN6KaB57uZYXJyYXnotYvlgLzvvIzlj6/ku6Xmj5DljYfmlYjnjocqL1xyXG5cdHB1YmxpYyBzZXQgYXJyYXkodmFsdWU6IEFycmF5PGFueT4pIHtcclxuXHJcblx0XHR0aGlzLnJlbW92ZUFsbENvbXBvbmVudCgpO1xyXG5cclxuXHRcdHRoaXMuY2xlYXJEYXRhKCk7XHJcblx0XHR0aGlzLl9hcnJheSA9IHZhbHVlIHx8IFtdO1xyXG5cdFx0dGhpcy51cGRhdGVMaXN0KCk7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAgKiDorr7nva7lr7nlupTmlbDmja5cclxuXHQgICovXHJcblx0cHVibGljIGdldCBhcnJheSgpOiBBcnJheTxhbnk+IHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fYXJyYXk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYWRkSXRlbSh2YWx1ZTogYW55LCBpc1Vuc2hpZnQ6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG5cclxuXHRcdGlmICh0aGlzLl9hcnJheSAmJiB0aGlzLl9hcnJheS5pbmRleE9mKHZhbHVlKSA9PSAtMSkge1xyXG5cdFx0XHRpZiAoaXNVbnNoaWZ0KSB7XHJcblx0XHRcdFx0dGhpcy5fYXJyYXkudW5zaGlmdCh2YWx1ZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5fYXJyYXkucHVzaCh2YWx1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy51cGRhdGVMaXN0KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKirnp7vpmaTmnaHnm64gKi9cclxuXHRwdWJsaWMgcmVtb3ZlSXRlbSh2YWx1ZTogYW55KTogdm9pZCB7XHJcblxyXG5cdFx0bGV0IGl0ZW06IGFueSA9IG51bGw7XHJcblx0XHRsZXQgaW5kZXg6IG51bWJlciA9IHRoaXMuX2FycmF5LmluZGV4T2YodmFsdWUpO1xyXG5cdFx0aWYgKHRoaXMuX2FycmF5ICYmIGluZGV4ICE9IC0xKSB7XHJcblx0XHRcdGl0ZW0gPSB0aGlzLl9hcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0XHR0aGlzLnVwZGF0ZUxpc3QoKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBpdGVtO1xyXG5cdH1cclxuXHJcblxyXG5cdC8qKuabtOaWsOWIl+ihqCAqL1xyXG5cdHByaXZhdGUgdXBkYXRlTGlzdCgpOiB2b2lkIHtcclxuXHJcblx0XHRpZiAodGhpcy5saXN0ICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5saXN0Lm51bUl0ZW1zID0gdGhpcy5fYXJyYXkubGVuZ3RoO1xyXG5cdFx0XHRpZiAodGhpcy5pc0F1dG9Cb3R0b20pIHtcclxuXHRcdFx0XHR0aGlzLnNjcm9sbFRvQm90dG9tKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhZGRJdGVtTGlzdChsaXN0OiBBcnJheTxhbnk+KTogdm9pZCB7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2FycmF5ICE9IG51bGwgJiYgbGlzdCAmJiBsaXN0Lmxlbmd0aCA+IDApIHtcclxuXHRcdFx0dGhpcy5fYXJyYXkgPSB0aGlzLl9hcnJheS5jb25jYXQobGlzdCk7XHJcblx0XHR9XHJcblx0XHR0aGlzLnVwZGF0ZUxpc3QoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZXBsYWNlQWxsKGxpc3Q6IEFycmF5PGFueT4pOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLl9hcnJheSA9IGxpc3Q7XHJcblx0XHR0aGlzLnVwZGF0ZUxpc3QoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgbnVtSXRlbXModmFsdWU6IG51bWJlcikge1xyXG5cclxuXHRcdC8vIHRoaXMuX2FycmF5ID0gW107XHJcblx0XHR0aGlzLmNsZWFyRGF0YSgpO1xyXG5cdFx0dGhpcy5fYXJyYXkubGVuZ3RoID0gdmFsdWU7XHJcblx0XHR0aGlzLnVwZGF0ZUxpc3QoKTtcclxuXHR9XHJcblx0Lyoq6K6+572u5p2h55uuICovXHJcblx0cHVibGljIGdldCBudW1JdGVtcygpOiBudW1iZXIge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QubnVtSXRlbXM7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog54K55Ye75p2h55uuXHJcblx0ICAqL1xyXG5cdHByb3RlY3RlZCBjbGlja0l0ZW0oZTogYW55KTogdm9pZCB7Ly9mYWlyeWd1aS5JdGVtRXZlbnRcclxuXHRcdHRoaXMuc2VsZWN0SXRlbShlLml0ZW1PYmplY3QpO1xyXG5cdH1cclxuXHJcblx0Lyoq6YCJ5oup5p2h55uuICovXHJcblx0cHVibGljIHNlbGVjdEl0ZW0oaXRlbTogYW55KTogdm9pZCB7XHJcblxyXG5cdFx0Ly/lpI3pgInlj6/pgInmi6nlpJrkuKrlj6/ph43lpI3pgInmi6lcclxuXHRcdGlmICgodGhpcy5zZWxlY3Rpb25Nb2RlID09IGZhaXJ5Z3VpLkxpc3RTZWxlY3Rpb25Nb2RlLlNpbmdsZSlcclxuXHRcdFx0JiYgdGhpcy5fbGFzdGNsaWNrSXRlbVxyXG5cdFx0XHQmJiBpdGVtXHJcblx0XHRcdCYmIHRoaXMuX2xhc3RjbGlja0l0ZW0gPT0gaXRlbVxyXG5cdFx0KSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fbGFzdGNsaWNrSXRlbSkge1xyXG5cdFx0XHR0aGlzLl9sYXN0Y2xpY2tJdGVtW1wic2VsZWN0XCJdID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRpdGVtW1wic2VsZWN0XCJdID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX2xhc3RjbGlja0l0ZW0gPSBpdGVtO1xyXG5cclxuXHRcdGlmIChpdGVtLmRhdGEpIHRoaXMuX3NlbGVjdEluZGV4ID0gdGhpcy5fYXJyYXkuaW5kZXhPZihpdGVtLmRhdGEpO1xyXG5cdFx0ZWxzZSB0aGlzLl9zZWxlY3RJbmRleCA9IHBhcnNlSW50KGl0ZW0ubmFtZSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2NsaWNrSGFuZGxlcikge1xyXG5cdFx0XHR0aGlzLl9jbGlja0hhbmRsZXIuYXBwbHkodGhpcy5jYWxsYmFja1RoaXNPYmosIFtpdGVtXSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKirojrflj5bpgInmi6nnmoTmnaHnm64gKi9cclxuXHRwdWJsaWMgZ2V0IGxhc3RDbGlja0l0ZW0oKTogZmFpcnlndWkuR09iamVjdCB7XHJcblx0XHRyZXR1cm4gdGhpcy5fbGFzdGNsaWNrSXRlbTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDmuLLmn5PmnaHnm65cclxuXHQgICovXHJcblx0cHJvdGVjdGVkIGxpc3RJdGVtUmVuZGVyKGluZGV4OiBudW1iZXIsIG9iajogZmFpcnlndWkuR09iamVjdCk6IHZvaWQge1xyXG5cclxuXHRcdGlmIChpbmRleCA9PSAwKSB7XHJcblx0XHRcdHRoaXMuX2VsZW1lbnRzID0gW107XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGl0ZW06IGFueSA9IG9iajtcclxuXHRcdGlmIChpdGVtICYmIGl0ZW1bXCJzaG93XCJdICE9IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRpdGVtLnNob3codGhpcy5fYXJyYXlbaW5kZXhdKTtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLmVsZW1lbnRzLmluZGV4T2YoaXRlbSkgPT0gLTEpIHtcclxuXHRcdFx0dGhpcy5lbGVtZW50cy5wdXNoKGl0ZW0pO1xyXG5cdFx0fVxyXG5cdFx0Ly/liJfooajmuLLmn5PljZXkuKrmnaHnm65cclxuXHRcdGxldCBldnQ6IEdhbWVFdmVudCA9IG5ldyBHYW1lRXZlbnQoR2FtZUV2ZW50LkVHTElTVF9SRU5ERVIpO1xyXG5cdFx0ZXZ0LmRhdGEgPSB7IFwiaW5kZXhcIjogaW5kZXgsIFwib2JqXCI6IG9iaiB9O1xyXG5cdFx0ZXZ0LnRoaXNPYmplY3QgPSB0aGlzLl90aGlzT2JqZWN0O1xyXG5cdFx0Ly8gdGhpcy5kaXNwYXRjaEV2ZW50KGV2dCk7XHJcblx0XHRmYWlyeWd1aS5FdmVudHMuZGlzcGF0Y2goIEdhbWVFdmVudC5FR0xJU1RfUkVOREVSICwgdGhpcy5fZGlzcGxheU9iamVjdCAsIGV2dCApO1xyXG5cdFx0Ly/liJfooajmuLLmn5PlrozmiJBcclxuXHRcdGlmIChpbmRleCA9PSAodGhpcy5fYXJyYXkubGVuZ3RoIC0gMSkpIHtcclxuXHJcblx0XHRcdGxldCBjb21wbGV0ZUV2dDogR2FtZUV2ZW50ID0gbmV3IEdhbWVFdmVudChHYW1lRXZlbnQuRUdMSVNUX0NPTVBMRVRFKTtcclxuXHRcdFx0Y29tcGxldGVFdnQudGhpc09iamVjdCA9IHRoaXMuX3RoaXNPYmplY3Q7XHJcblx0XHRcdC8vIHRoaXMuZGlzcGF0Y2hFdmVudChjb21wbGV0ZUV2dCk7XHJcblx0XHRcdGZhaXJ5Z3VpLkV2ZW50cy5kaXNwYXRjaCggR2FtZUV2ZW50LkVHTElTVF9DT01QTEVURSAsIHRoaXMuX2Rpc3BsYXlPYmplY3QgLCBldnQgKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fc2VsZWN0ZWRQYWdlKSB7XHJcblx0XHRcdC8v5aSE55CG5YiG6aG155qE5pe25YCZXHJcblx0XHRcdGlmIChpbmRleCA9PSAwICYmICF0aGlzLmlzRmlyc3QpIHtcclxuXHRcdFx0XHR0aGlzLmlzRmlyc3QgPSB0cnVlO1xyXG5cdFx0XHRcdHRoaXMuX3NlbGVjdGVkUGFnZS5hcHBseSh0aGlzLmNhbGxiYWNrVGhpc09iaiwgMCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIEdsb2JhbC5pcyhvYmosIFwiSUNvbXBvbmVudFwiKSApIHtcclxuXHRcdFx0dGhpcy5hZGRDb21wb25lbnQoPGFueT5vYmopO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Lyoq5YiX6KGo5riy5p+T5omA5pyJ5p2h55uuICDomZrmi5/liJfooajkuI3lj6/ku6Xov5nmoLflj5YqL1xyXG5cdHB1YmxpYyBnZXQgZWxlbWVudHMoKTogQXJyYXk8YW55PiB7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudHM7XHJcblx0XHQvL+i9rOaNoumhueebrue0ouW8leS4uuaYvuekuuWvueixoee0ouW8leOAglxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfc2VsZWN0SW5kZXg6IG51bWJlciA9IDA7XHJcblxyXG5cdHB1YmxpYyBzZXQgc2VsZWN0ZWRJbmRleCh2YWx1ZTogbnVtYmVyKSB7XHJcblxyXG5cdFx0aWYgKHRoaXMuaXNTaW5nbGVTZWxlY3QpIHtcclxuXHJcblx0XHRcdHRoaXMubGlzdC5zZWxlY3RlZEluZGV4ID0gdmFsdWU7Ly/lnZHvvIzmnInml7blj5YgdGhpcy5saXN0LnNlbGVjdGVkSW5kZXjmnInpl67pophcclxuXHRcdFx0dGhpcy5fc2VsZWN0SW5kZXggPSB2YWx1ZTtcclxuXHRcdFx0Ly9jbG9uZyAyMDE5LjIuMTJcclxuXHRcdFx0bGV0IGl0ZW06IGFueSA9IHZhbHVlIDwgdGhpcy5saXN0Lm51bUNoaWxkcmVuID8gdGhpcy5saXN0LmdldENoaWxkQXQodmFsdWUpIDogbnVsbDtcclxuXHRcdFx0aWYgKGl0ZW0gaW5zdGFuY2VvZiBVSUVMaXN0UmVuZGVySXRlbSB8fCBpdGVtIGluc3RhbmNlb2YgQmFzZUJ1dHRvbiApIHtcclxuXHRcdFx0XHR0aGlzLnNlbGVjdEl0ZW0oaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuX3NlbGVjdEluZGV4ID0gLTE7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8qKuW9k+WJjemAieaLqeadoeebrue0ouW8lSAqL1xyXG5cdHB1YmxpYyBnZXQgc2VsZWN0ZWRJbmRleCgpOiBudW1iZXIge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLl9zZWxlY3RJbmRleDsvLyB0aGlzLmxpc3Quc2VsZWN0ZWRJbmRleDtcclxuXHR9XHJcblxyXG5cdC8qKuW9k+WJjemAieaLqeaVsOaNriAqL1xyXG5cdHB1YmxpYyBnZXQgc2VsZWN0ZWRJdGVtKCk6IGFueSB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX3NlbGVjdEluZGV4IDwgMCA/IG51bGwgOiB0aGlzLl9hcnJheVt0aGlzLl9zZWxlY3RJbmRleF07XHJcblx0fVxyXG5cclxuXHQvKirmt7vliqDpgInmi6kgKi9cclxuXHRwdWJsaWMgYWRkU2VsZWN0aW9uKGluZGV4OiBudW1iZXIsIHNjcm9sbEl0VG9WaWV3PzogYm9vbGVhbik6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMubGlzdC5hZGRTZWxlY3Rpb24oaW5kZXgsIHNjcm9sbEl0VG9WaWV3KTtcclxuXHR9XHJcblxyXG5cdC8qKuenu+mZpOmAieaLqSAqL1xyXG5cdHB1YmxpYyByZW1vdmVTZWxlY3Rpb24oaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMubGlzdC5yZW1vdmVTZWxlY3Rpb24oaW5kZXgpO1xyXG5cdH1cclxuXHJcblx0Lyoq5YWo6YCJICovXHJcblx0cHVibGljIHNlbGVjdEFsbCgpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmxpc3Quc2VsZWN0QWxsKCk7XHJcblx0fVxyXG5cclxuXHQvKirkuI3pgInmi6kgKi9cclxuXHRwdWJsaWMgc2VsZWN0Tm9uZSgpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmxpc3Quc2VsZWN0Tm9uZSgpO1xyXG5cdH1cclxuXHJcblx0Lyoq5Y+N6YCJICovXHJcblx0cHVibGljIHNlbGVjdFJldmVyc2UoKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5saXN0LnNlbGVjdFJldmVyc2UoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDlvZPliY3ov5vluqbmnaHmu5rliqjnmb7liIbmr5RcclxuXHQgICovXHJcblx0cHVibGljIGdldCBwcm9ncmVzcygpOiBudW1iZXIge1xyXG5cclxuXHRcdGlmICh0aGlzLmlzSG9yaXpvbnRhbCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5saXN0LnNjcm9sbFBhbmUucGVyY1g7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5saXN0LnNjcm9sbFBhbmUucGVyY1k7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBwdWJsaWMgc2V0IGlzSG9yaXpvbnRhbCh2YWx1ZTpib29sZWFuKXtcclxuXHQvLyBcdGlmKCB2YWx1ZSApe1xyXG5cdC8vIFx0XHR0aGlzLmxpc3Quc2Nyb2xsUGFuZS5zY3JcclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcblxyXG5cdC8qKuaoquWQkea7muWKqOadoSAqL1xyXG5cdHB1YmxpYyBnZXQgaXNIb3Jpem9udGFsKCk6IGJvb2xlYW4ge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3Quc2Nyb2xsUGFuZSA/IHRoaXMubGlzdC5zY3JvbGxQYW5lW1wiX3Njcm9sbFR5cGVcIl0gPT0gZmFpcnlndWkuU2Nyb2xsVHlwZS5Ib3Jpem9udGFsIDogZmFsc2U7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5ruR5Yqo5YiwXHJcblx0ICAqIEBwYXJhbSBwcm9ncmVzcyAwIH4gMVxyXG5cdCAgKi9cclxuXHRwdWJsaWMgc2xpZGVyVG8ocHJvZ3Jlc3M6IG51bWJlciwgYW5pOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG5cclxuXHRcdC8vIHRoaXMubGlzdC5zY3JvbGxQYW5lLnNjcm9sbERvd24oIHByb2dyZXNzICwgYW5pICk7XHJcblx0XHRpZiAodGhpcy5saXN0LnNjcm9sbFBhbmUpIHtcclxuXHRcdFx0aWYgKHRoaXMuaXNIb3Jpem9udGFsKSB7XHJcblx0XHRcdFx0dGhpcy5saXN0LnNjcm9sbFBhbmUuc2V0UGVyY1gocHJvZ3Jlc3MsIGFuaSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5saXN0LnNjcm9sbFBhbmUuc2V0UGVyY1kocHJvZ3Jlc3MsIGFuaSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDmu5rliqjliLBcclxuXHQgICogQHBhcmFtcyBpbmRleFxyXG5cdCAgKiBAcGFyYW1zIGFuaVxyXG5cdCAgKiBAcGFyYW1zIHNldEZpcnN0XHJcblx0ICAqL1xyXG5cdHB1YmxpYyBzY3JvbGxUb1ZpZXcoaW5kZXg6IG51bWJlciwgYW5pOiBib29sZWFuID0gZmFsc2UsIHNldEZpcnN0OiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmxpc3Quc2Nyb2xsVG9WaWV3KGluZGV4LCBhbmksIHNldEZpcnN0KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgc2Nyb2xsUGFuZSgpOiBmYWlyeWd1aS5TY3JvbGxQYW5lIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LnNjcm9sbFBhbmU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0Rmlyc3RDaGlsZEluVmlldygpOiBudW1iZXIge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QuZ2V0Rmlyc3RDaGlsZEluVmlldygpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldExpc3RDb21wb25ldCgpOiBmYWlyeWd1aS5HTGlzdCB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDmu5HliqjliLDpobbpg6hcclxuXHQgICovXHJcblx0cHVibGljIHNjcm9sbFRvVG9wKGFuaTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5saXN0LnNjcm9sbFBhbmUuc2Nyb2xsVG9wKGFuaSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5rua5Yqo5Yiw5bqV6YOoXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBzY3JvbGxUb0JvdHRvbShhbmk6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMubGlzdC5zY3JvbGxQYW5lLnNjcm9sbEJvdHRvbShhbmkpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB0b3VjaEVuYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuXHJcblx0XHR0aGlzLmxpc3QuX2NvbnRhaW5lci5tb3VzZUVuYWJsZWQgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgdG91Y2hFbmFibGVkKCk6IGJvb2xlYW4ge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QuX2NvbnRhaW5lci5tb3VzZUVuYWJsZWQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGVuYWJsZWQoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmVuYWJsZWQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGVuYWJsZWQodmFsOiBib29sZWFuKSB7XHJcblx0XHR0aGlzLmxpc3QuZW5hYmxlZCA9IHZhbDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgdG91Y2hDaGlsZHJlbih2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuXHRcdHRoaXMubGlzdC5fY29udGFpbmVyLm1vdXNlVGhyb3VnaCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB0b3VjaENoaWxkcmVuKCk6IGJvb2xlYW4ge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QuX2NvbnRhaW5lci5tb3VzZVRocm91Z2g7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0Q2hpbGRBdChpbmRleDogbnVtYmVyKTogZmFpcnlndWkuR09iamVjdCB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5nZXRDaGlsZEF0KGluZGV4KVxyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBudW1DaGlsZHJlbigpOiBudW1iZXIge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QubnVtQ2hpbGRyZW47XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGxpbmVDb3VudCh2YWx1ZTogbnVtYmVyKSB7XHJcblxyXG5cdFx0dGhpcy5saXN0LmxpbmVDb3VudCA9IHZhbHVlO1xyXG5cdH1cclxuXHQvKirorr7nva7ooYzmlbAgKi9cclxuXHRwdWJsaWMgZ2V0IGxpbmVDb3VudCgpOiBudW1iZXIge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QubGluZUNvdW50O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBjb2x1bW5Db3VudCh2YWx1ZTogbnVtYmVyKSB7XHJcblxyXG5cdFx0dGhpcy5saXN0LmNvbHVtbkNvdW50ID0gdmFsdWU7XHJcblx0fVxyXG5cdC8qKuiuvue9ruWIl+aVsCAqL1xyXG5cdHB1YmxpYyBnZXQgY29sdW1uQ291bnQoKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmNvbHVtbkNvdW50O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB2aXNpYmxlKHZhbHVlOiBib29sZWFuKSB7XHJcblxyXG5cdFx0dGhpcy5saXN0LnZpc2libGUgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgdmlzaWJsZSgpOiBib29sZWFuIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LnZpc2libGU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHgodmFsdWU6IG51bWJlcikge1xyXG5cclxuXHRcdHRoaXMubGlzdC54ID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHgoKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0Lng7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHkodmFsdWU6IG51bWJlcikge1xyXG5cclxuXHRcdHRoaXMubGlzdC55ID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHkoKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0Lnk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHNjcm9sbFR5cGUodmFsdWU6IGZhaXJ5Z3VpLlNjcm9sbFR5cGUpIHtcclxuXHJcblx0XHRpZiAodGhpcy5saXN0LnNjcm9sbFBhbmUpIHtcclxuXHRcdFx0dGhpcy5saXN0LnNjcm9sbFBhbmVbXCJfc2Nyb2xsVHlwZVwiXSA9IHZhbHVlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvKirliJfooajmu5rliqjmqKHlvI8gKi9cclxuXHRwdWJsaWMgZ2V0IHNjcm9sbFR5cGUoKTogZmFpcnlndWkuU2Nyb2xsVHlwZSB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5zY3JvbGxQYW5lID8gdGhpcy5saXN0LnNjcm9sbFBhbmVbXCJfc2Nyb2xsVHlwZVwiXSA6IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBsYXlvdXQodmFsdWU6bnVtYmVyICkgey8vZmFpcnlndWkuTGlzdExheW91dFR5cGVcclxuXHJcblx0XHR0aGlzLmxpc3QubGF5b3V0ID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGFsaWduKHZhbHVlOnN0cmluZyApIHsvL2ZhaXJ5Z3VpLkFsaWduVHlwZVxyXG5cclxuXHRcdHRoaXMubGlzdC5hbGlnbiA9IHZhbHVlO1xyXG5cdH1cclxuXHQvKirlt6blj7PluIPlsYAgKi9cclxuXHRwdWJsaWMgZ2V0IGFsaWduKCk6IHN0cmluZyB7Ly9mYWlyeWd1aS5BbGlnblR5cGVcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmFsaWduO1xyXG5cdH1cclxuXHJcblx0Ly8gcHVibGljIHNldCB2ZXJ0aWNhbEFsaWduKHZhbHVlOiBmYWlyeWd1aS5WZXJ0QWxpZ25UeXBlKSB7XHJcblxyXG5cdC8vIFx0dGhpcy5saXN0LnZlcnRpY2FsQWxpZ24gPSB2YWx1ZTtcclxuXHQvLyB9XHJcblx0Ly8gLyoq5LiK5LiLICovXHJcblx0Ly8gcHVibGljIGdldCB2ZXJ0aWNhbEFsaWduKCk6IGZhaXJ5Z3VpLlZlcnRBbGlnblR5cGUge1xyXG5cdC8vIFx0cmV0dXJuIHRoaXMubGlzdC52ZXJ0aWNhbEFsaWduO1xyXG5cdC8vIH1cclxuXHJcblx0cHVibGljIHNldCBjb2x1bW5HYXAodmFsdWU6IG51bWJlcikge1xyXG5cclxuXHRcdHRoaXMubGlzdC5jb2x1bW5HYXAgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKuWIl+i3nSAqL1xyXG5cdHB1YmxpYyBnZXQgY29sdW1uR2FwKCk6IG51bWJlciB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5jb2x1bW5HYXA7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGxpbmVHYXAoZ2FwOiBudW1iZXIpIHtcclxuXHJcblx0XHR0aGlzLmxpc3QubGluZUdhcCA9IGdhcDtcclxuXHR9XHJcblxyXG5cdC8qKuihjOi3nSAqL1xyXG5cdHB1YmxpYyBnZXQgbGluZUdhcCgpOiBudW1iZXIge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QubGluZUdhcDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRTaXplKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBpZ25vcmVQaXZvdDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5saXN0LnNldFNpemUod2lkdGgsIGhlaWdodCwgaWdub3JlUGl2b3QpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN1cGVyU2V0U2l6ZSh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgaWdub3JlUGl2b3Q6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLnNldFNpemUod2lkdGgsIGhlaWdodCwgaWdub3JlUGl2b3QpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB3aWR0aCgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC53aWR0aDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgd2lkdGgodmFsdWU6IG51bWJlcikge1xyXG5cdFx0dGhpcy5saXN0LndpZHRoID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IGhlaWdodCgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5oZWlnaHQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGhlaWdodCh2YWx1ZTogbnVtYmVyKSB7XHJcblx0XHR0aGlzLmxpc3QuaGVpZ2h0ID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHZpZXdXaWR0aCgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC52aWV3V2lkdGg7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHZpZXdIZWlnaHQoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLmxpc3Qudmlld0hlaWdodDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgZ3JheWVkKHZhbHVlOiBib29sZWFuKSB7XHJcblxyXG5cdFx0dGhpcy5saXN0LmdyYXllZCA9IHZhbHVlO1xyXG5cdH1cclxuXHQvKirnva7ngbAgKi9cclxuXHRwdWJsaWMgZ2V0IGdyYXllZCgpOiBib29sZWFuIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmdyYXllZDtcclxuXHR9XHJcblxyXG5cdC8qKueItuWuueWZqCAqL1xyXG5cdHB1YmxpYyBnZXQgcGFyZW50KCk6IGZhaXJ5Z3VpLkdDb21wb25lbnQge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QucGFyZW50O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGxvY2FsVG9HbG9iYWwoYXg/OiBudW1iZXIsIGF5PzogbnVtYmVyLCByZXN1bHRQb2ludD86IExheWEuUG9pbnQpOiBMYXlhLlBvaW50IHtcclxuXHRcdHJldHVybiB0aGlzLmxpc3QubG9jYWxUb0dsb2JhbChheCwgYXksIHJlc3VsdFBvaW50KTtcclxuXHR9XHJcblxyXG5cdC8qKua4heeQhuaVsOaNriAqL1xyXG5cdHB1YmxpYyBjbGVhckRhdGEoKSB7XHJcblx0XHRpZiAodGhpcy5lbGVtZW50cykge1xyXG5cdFx0XHRmb3IgKGxldCBpbmRleCBpbiB0aGlzLmVsZW1lbnRzKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuZWxlbWVudHNbaW5kZXhdIGluc3RhbmNlb2YgQmFzZVNwcml0ZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50c1tpbmRleF1bXCJoaWRlXCJdKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5fbGFzdGNsaWNrSXRlbSkge1xyXG5cdFx0XHR0aGlzLl9sYXN0Y2xpY2tJdGVtW1wic2VsZWN0XCJdID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuX2xhc3RjbGlja0l0ZW0gPSBudWxsO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuX2J0bl9sZWZ0KSB7XHJcblx0XHRcdHRoaXMuX2J0bl9sZWZ0Lm9mZihMYXlhLkV2ZW50LkNMSUNLLCB0aGlzLCB0aGlzLnRvdWNoTGVmdEJ0bkhhbmRsZXIgKTtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLl9idG5fcmlnaHQpIHtcclxuXHRcdFx0dGhpcy5fYnRuX3JpZ2h0Lm9mZihMYXlhLkV2ZW50LkNMSUNLLCB0aGlzLCB0aGlzLnRvdWNoUmlnaHRCdG5IYW5kbGVyICk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9idG5fbGVmdCA9IG51bGw7XHJcblx0XHR0aGlzLl9idG5fcmlnaHQgPSBudWxsO1xyXG5cdFx0dGhpcy5fZWxlbWVudHMgPSBbXTtcclxuXHRcdHRoaXMuX2FycmF5ID0gW107XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog6YeN572uXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuXHJcblx0XHRzdXBlci5jbGVhcigpO1xyXG5cclxuXHRcdHRoaXMuc2xpZGVyVG8oMCwgZmFsc2UpO1xyXG5cclxuXHRcdHRoaXMuY2xlYXJEYXRhKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog6YeK5pS+XHJcblx0ICAqL1xyXG5cdHB1YmxpYyBkaXNwb3NlKCk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcclxuXHJcblx0XHR0aGlzLmNsZWFyKCk7XHJcblxyXG5cdFx0aWYgKHRoaXMubGlzdCAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMubGlzdC5vZmYoTGF5YS5FdmVudC5DTElDSyAsIHRoaXMgLCB0aGlzLmNsaWNrSXRlbSk7XHJcblx0XHRcdHRoaXMubGlzdC5vZmYoZmFpcnlndWkuRXZlbnRzLlNDUk9MTCAsIHRoaXMgLCB0aGlzLnNjcm9sbExpc3RQYWdlICk7XHJcblx0XHRcdHRoaXMubGlzdC5kaXNwb3NlKCk7XHJcblx0XHRcdHRoaXMubGlzdCA9IG51bGw7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9idG5fbGVmdCA9IG51bGw7XHJcblx0XHR0aGlzLl9idG5fcmlnaHQgPSBudWxsO1xyXG5cdFx0dGhpcy5fdGhpc09iamVjdCA9IG51bGw7XHJcblx0XHR0aGlzLl9pdGVtUmVuZGVyZXIgPSBudWxsO1xyXG5cdFx0dGhpcy5fY2xpY2tIYW5kbGVyID0gbnVsbDtcclxuXHRcdHRoaXMuX3NlbGVjdGVkUGFnZSA9IG51bGw7XHJcblx0XHR0aGlzLl9hcnJheSA9IG51bGw7XHJcblx0XHR0aGlzLl9lbGVtZW50cyA9IG51bGw7XHJcblx0XHR0aGlzLl9sYXN0Y2xpY2tJdGVtID0gbnVsbDtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0ICBVSUNvbXBvbmVudCAgZnJvbSBcIi4uL1VJQ29tcG9uZW50XCI7XHJcblxyXG4vKipcclxuICAqIOWIl+ihqOa4suafk+adoeebrlxyXG4gICogQGF1dGhvciBjbCAyMDE5LjUuMThcclxuICAqL1xyXG5leHBvcnQgY2xhc3MgVUlFTGlzdFJlbmRlckl0ZW0gZXh0ZW5kcyBVSUNvbXBvbmVudCB7XHJcblxyXG5cdC8qKuaYr+WQpuacieWPr+mAieS4reeKtuaAgSAqL1xyXG5cdHB1YmxpYyBjYW5TZWxlY3Q6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0cHJvdGVjdGVkIF9fZGF0YTogYW55ID0gbnVsbDtcclxuXHJcblx0cHJvdGVjdGVkIF9zZWxlY3Q6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0cHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuXHRcdHN1cGVyKCk7XHJcblx0fVxyXG5cclxuXHRwcm90ZWN0ZWQgY29uc3RydWN0RnJvbVhNTCh4bWw6IGFueSk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmNvbnN0cnVjdEZyb21YTUwoeG1sKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBpbml0Q29tcGxldGUoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0Ly/mo4DmtYvliJ3lp4vljJbmmK/lkKblrozmiJBcclxuXHRcdGlmICghdGhpcy5pc0luaXRlZCgpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMuaXNPcGVuZWQpIHtcclxuXHRcdFx0dGhpcy5pc09wZW5lZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuaW5pdFVJKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5pbml0RGF0YSh0aGlzLnBhcmFtKTtcclxuXHRcdC8vIHRoaXMuQWRkUm9vdExpc3RlbmVyKCk7Ly/mraTmlrnms5XlnKhzaG935pa55rOV55qE5pe25YCZ6LCD55SoXHJcblxyXG5cdFx0dGhpcy5pc0NvbXBseWVkID0gdHJ1ZTtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOaYr+WQpuWMheWQq+WFqOWxgOWdkOagh+eCuVxyXG5cdCAgKiBAcGFyYW0gZ3gg5YWo5bGAWOWdkOagh1xyXG5cdCAgKiBAcGFyYW0gZ3kg5YWo5bGAWeWdkOagh1xyXG5cdCAgKi9cclxuXHRwdWJsaWMgY29udGFpbnNHbG9iYWxQb2ludChneDogbnVtYmVyLCBneTogbnVtYmVyKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0bGV0IGxwOiBMYXlhLlBvaW50ID0gdGhpcy5nbG9iYWxUb0xvY2FsKGd4LCBneSk7XHJcblx0XHRsZXQgYm91bmRzOiBMYXlhLlJlY3RhbmdsZSA9IG5ldyBMYXlhLlJlY3RhbmdsZSgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblx0XHRyZXR1cm4gYm91bmRzLmNvbnRhaW5zKGxwLngsIGxwLnkpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBzZWxlY3QodmFsdWU6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRpZiAodGhpcy5jYW5TZWxlY3QpIHtcclxuXHRcdFx0dGhpcy5jdXJyZW50U3RhdGUgPSB2YWx1ZSA/IFwiZG93blwiIDogXCJ1cFwiO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBzZWxlY3QoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuY2FuU2VsZWN0ID8gdGhpcy5jdXJyZW50U3RhdGUgPT0gXCJkb3duXCIgOiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzaG93KGRhdGE6IGFueSk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMuZGF0YSA9IHRoaXMuX2RhdGEgPSBkYXRhO1xyXG5cdFx0dGhpcy5hZGRBbGxMaXN0ZW5lcigpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGhpZGUoKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5jbGVhcigpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOmHjee9rlxyXG5cdCAgKi9cclxuXHRwdWJsaWMgY2xlYXIoKTogdm9pZCB7XHJcblxyXG5cdFx0c3VwZXIuY2xlYXIoKTtcclxuXHRcdHRoaXMucmVtb3ZlQWxsTGlzdGVuZXIoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDph4rmlL7otYTmupBcclxuXHQgICovXHJcblx0cHVibGljIGRpc3Bvc2UoKTogdm9pZCB7XHJcblxyXG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xyXG5cdH1cclxufSIsIi8qKlxyXG4gKiDpnaLmnb/mlbDmja5cclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMjZcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhbmVsVm8ge1xyXG5cclxuICAgIC8qKumdouadv0lEICovXHJcbiAgICBwdWJsaWMgaWQ6bnVtYmVyID0gMDtcclxuICAgIC8qKumdouadv+exu+WeiyAqL1xyXG4gICAgcHVibGljIHR5cGU6bnVtYmVyID0gMDtcclxuICAgIC8qKuWxgue6pyAw5Li66buY6K6k55WM6Z2i5bGCICovXHJcbiAgICBwdWJsaWMgbGF5ZXI6bnVtYmVyID0gMDtcclxuICAgIC8qKuS8oCBmYWxzZSDooajnpLrkuI3nu5Hlrprngrnlh7vpga7nvanlhbPpl63pnaLmnb/kuovku7YgKi9cclxuICAgIHB1YmxpYyBvcGVuVGFwTWFzazogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qKmZhaXJ5Z3VpIOWvueW6lOWMheWQjSAqL1xyXG4gICAgcHVibGljIHBrZ05hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIC8qKmZhaXJ5Z3VpIOWvueW6lOWMhei1hOa6kOWQjSAqL1xyXG4gICAgcHVibGljIHJlc05hbWU6c3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciggICkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzTm9ybWFsKCk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZSAgPT0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMucGtnTmFtZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5yZXNOYW1lID0gXCJcIjtcclxuICAgICAgICB0aGlzLnR5cGUgPSAwO1xyXG4gICAgICAgIHRoaXMuaWQgPSAwO1xyXG4gICAgICAgIHRoaXMub3BlblRhcE1hc2sgPSBmYWxzZTsgICAgICAgIFxyXG4gICAgfVxyXG59Il19
