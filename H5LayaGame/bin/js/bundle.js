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
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
        // Laya.loader.load([
        // 	{ url: "res/fairui/common_atlas0.png", type: Laya.Loader.IMAGE },
        // 	{ url: "res/fairui/common.map", type: Laya.Loader.BUFFER }
        //     ], Laya.Handler.create(this, this.onLoaded));
        var urls = UrlUtils_1.default.getFairyGroup("common");
        LoadSourceManager_1.default.loadGroup("common", urls, Laya.Handler.create(_this, _this.onLoaded));
        return _this;
    }
    GameClient.prototype.onLoaded = function () {
        fairygui.UIPackage.addPackage("res/fairui/common");
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
},{"./com/load/LoadSourceManager":4,"./com/load/utils/UrlUtils":10,"./fairui/PanelRegister":11,"./fairui/manager/FairyUIManager":12,"./fairui/view/component/EButton":18}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        Laya.init(1136, 640, Laya.WebGL);
        laya.utils.Stat.show(0, 0);
        //设置适配模式
        Laya.stage.scaleMode = "showall";
        Laya.stage.alignH = "left";
        Laya.stage.alignV = "top";
        //设置横竖屏
        Laya.stage.screenMode = Global.screenMode; // "horizontal";
        //根据IDE设置初始化引擎		
        if (window["Laya3D"]) {
            Laya3D.init(Global.width, Global.height);
        }
        else {
            Laya.init(Global.width, Global.height, Laya["WebGL"]);
        }
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.scaleMode = Global.scaleMode;
        Laya.stage.screenMode = Global.screenMode;
        //兼容微信不支持加载scene后缀场景
        //Laya.URL.exportSceneToJson = Global.exportSceneToJson;
        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if (Global.debug || Laya.Utils.getQueryString("debug") == "true")
            Laya.enableDebugPanel();
        if (Global.physicsDebug && Laya["PhysicsDebugDraw"])
            Laya["PhysicsDebugDraw"].enable();
        if (Global.stat)
            Laya.Stat.show();
        Laya.alertGlobalError = true;
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
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameClient_1 = require("./GameClient");
var Global_1 = require("./Global");
var Main = /** @class */ (function () {
    function Main() {
        Global_1.default.init();
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    }
    Main.prototype.onVersionLoaded = function () {
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        //Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        Laya.stage.addChild(new GameClient_1.default());
    };
    return Main;
}());
//激活启动类
new Main();
},{"./GameClient":1,"./Global":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Resource_1 = require("./resource/Resource");
var LoaderEvent_1 = require("./event/LoaderEvent");
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
        EventManager.addEventListener(LoaderEvent_1.default.LOAD_SINGLE_COMPLETE, this.loadSingleComplete, this);
        EventManager.addEventListener(LoaderEvent_1.default.LOAD_GROUP_COMPLETE, this.loadGroupComplete, this);
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
                    EventManager.dispatchEvent(LoaderEvent_1.default.LOAD_GROUP_COMPLETE, groupRes);
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
                    var res = this.loadMap.get(url) || Resource_1.default.create(url);
                    grouplist.push(res);
                    this.loadMap.set(res.url, res);
                }
            }
            var groupRes = Resource_1.default.create(grouplist, complete, progress);
            groupRes.load();
            this.groupMap.set(groupName, groupRes);
        }
        else {
            Laya.Log.print("已经有该资源组了！");
        }
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
            res = Resource_1.default.create(source, complete, error);
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
    LoadSourceManager.loadMap = new Laya.WeakObject();
    /**资源组字典 */
    LoadSourceManager.groupMap = new Laya.WeakObject();
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
                Laya.loader.load({ url: res.url, type: res.type }, Laya.Handler.create(this, this.onLoaded, [res], true), res.progress);
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
        EventManager.dispatchEvent(LoaderEvent_1.default.LOAD_SINGLE_COMPLETE, res);
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
},{"./event/LoaderEvent":5,"./resource/Resource":7}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{"../LoadSourceManager":4,"./Resource":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoadUtils_1 = require("../utils/LoadUtils");
var TxtResource_1 = require("./TxtResource");
var GroupResource_1 = require("./GroupResource");
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
    Resource.create = function (url, complete, progress, error) {
        if (complete === void 0) { complete = null; }
        if (progress === void 0) { progress = null; }
        if (error === void 0) { error = null; }
        var res = null;
        var ext = LoadUtils_1.default.getFileExt(url);
        if (ext == "png" || ext == "jpg" || ext == "bmp") {
            res = Laya.Pool.getItemByClass(Resource.KEY, Resource);
            res.type = Laya.Loader.IMAGE;
        }
        else if (ext == "txt" || ext == "json") {
            res = Laya.Pool.getItemByClass(TxtResource_1.default.KEY, TxtResource_1.default);
            res.type = Laya.Loader.TEXT;
        }
        else if (url instanceof Array) {
            res = Laya.Pool.getItemByClass(GroupResource_1.default.KEY, GroupResource_1.default);
            res.type = Resource.TYPE_GROUP;
        }
        if (res) {
            res.create(url, complete, progress, error);
        }
        return res;
    };
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
},{"../LoadSourceManager":4,"../utils/LoadUtils":9,"./GroupResource":6,"./TxtResource":8}],8:[function(require,module,exports){
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
},{"./Resource":7}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
        if (pkgName && !fairygui.UIPackage.getById(pkgName)) {
            fairygui.UIPackage.addPackage(pkgName);
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
},{}],12:[function(require,module,exports){
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
},{"../view/component/BaseSprite":17}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSprite_1 = require("../view/component/BaseSprite");
var EGList_1 = require("../view/component/EGList");
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
                    thisObject[disObj.name] = new EGList_1.EGList(disObj, thisObject);
                    if (thisObject instanceof BaseSprite_1.default)
                        thisObject.addComponent(thisObject[disObj.name]);
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
},{"../view/component/BaseSprite":17,"../view/component/EGList":19}],15:[function(require,module,exports){
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
exports.UIComponent = UIComponent;
},{"./component/BaseSprite":17}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FairyUtils_1 = require("../../utils/FairyUtils");
var Global_1 = require("../../../Global");
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
        _this.m_eventPool = EventPool.create();
        _this.m_componentDic = new Laya.WeakObject();
        return _this;
    }
    BaseSprite.prototype.constructFromXML = function (xml) {
        _super.prototype.constructFromXML.call(this, xml);
        this.initController();
        FairyUtils_1.FairyUtils.setVar(this, this);
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
},{"../../../Global":2,"../../utils/FairyUtils":14}],18:[function(require,module,exports){
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
},{"./BaseButton":16}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSprite_1 = require("./BaseSprite");
var Global_1 = require("../../../Global");
var UIEListRenderItem_1 = require("./UIEListRenderItem");
var BaseButton_1 = require("./BaseButton");
var FairyTextureUtils_1 = require("../../utils/FairyTextureUtils");
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
            // this.list.addEventListener(fairygui.ItemEvent.CLICK, this.clickItem, this);
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
        var evt = new GameEvent(GameEvent.EGLIST_RENDER);
        evt.data = { "index": index, "obj": obj };
        evt.thisObject = this._thisObject;
        // this.dispatchEvent(evt);
        fairygui.Events.dispatch(GameEvent.EGLIST_RENDER, this._displayObject, evt);
        //列表渲染完成
        if (index == (this._array.length - 1)) {
            var completeEvt = new GameEvent(GameEvent.EGLIST_COMPLETE);
            completeEvt.thisObject = this._thisObject;
            // this.dispatchEvent(completeEvt);
            fairygui.Events.dispatch(GameEvent.EGLIST_COMPLETE, this._displayObject, evt);
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
},{"../../../Global":2,"../../utils/FairyTextureUtils":13,"./BaseButton":16,"./BaseSprite":17,"./UIEListRenderItem":20}],20:[function(require,module,exports){
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
}(UIComponent_1.UIComponent));
exports.UIEListRenderItem = UIEListRenderItem;
},{"../UIComponent":15}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L1Byb2dyYW0gRmlsZXMvTGF5YUFpcklERV9iZXRhL3Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9HYW1lQ2xpZW50LnRzIiwic3JjL0dsb2JhbC50cyIsInNyYy9NYWluLnRzIiwic3JjL2NvbS9sb2FkL0xvYWRTb3VyY2VNYW5hZ2VyLnRzIiwic3JjL2NvbS9sb2FkL2V2ZW50L0xvYWRlckV2ZW50LnRzIiwic3JjL2NvbS9sb2FkL3Jlc291cmNlL0dyb3VwUmVzb3VyY2UudHMiLCJzcmMvY29tL2xvYWQvcmVzb3VyY2UvUmVzb3VyY2UudHMiLCJzcmMvY29tL2xvYWQvcmVzb3VyY2UvVHh0UmVzb3VyY2UudHMiLCJzcmMvY29tL2xvYWQvdXRpbHMvTG9hZFV0aWxzLnRzIiwic3JjL2NvbS9sb2FkL3V0aWxzL1VybFV0aWxzLnRzIiwic3JjL2ZhaXJ1aS9QYW5lbFJlZ2lzdGVyLnRzIiwic3JjL2ZhaXJ1aS9tYW5hZ2VyL0ZhaXJ5VUlNYW5hZ2VyLnRzIiwic3JjL2ZhaXJ1aS91dGlscy9GYWlyeVRleHR1cmVVdGlscy50cyIsInNyYy9mYWlydWkvdXRpbHMvRmFpcnlVdGlscy50cyIsInNyYy9mYWlydWkvdmlldy9VSUNvbXBvbmVudC50cyIsInNyYy9mYWlydWkvdmlldy9jb21wb25lbnQvQmFzZUJ1dHRvbi50cyIsInNyYy9mYWlydWkvdmlldy9jb21wb25lbnQvQmFzZVNwcml0ZS50cyIsInNyYy9mYWlydWkvdmlldy9jb21wb25lbnQvRUJ1dHRvbi50cyIsInNyYy9mYWlydWkvdmlldy9jb21wb25lbnQvRUdMaXN0LnRzIiwic3JjL2ZhaXJ1aS92aWV3L2NvbXBvbmVudC9VSUVMaXN0UmVuZGVySXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNWQSxrRUFBNkQ7QUFDN0Qs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LENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxzQkFBVyxxQ0FBTTthQU9qQjtZQUVDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUM3RCxDQUFDO2FBVkQsVUFBa0IsS0FBYztZQUUvQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzthQUMxQztRQUNGLENBQUM7OztPQUFBO0lBT00sZ0NBQUksR0FBWCxVQUFZLElBQVM7UUFFcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVNLGdDQUFJLEdBQVg7UUFFQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQ7O1FBRUk7SUFDRyxpQ0FBSyxHQUFaO1FBRUMsaUJBQU0sS0FBSyxXQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQ7O1FBRUk7SUFDRyxtQ0FBTyxHQUFkO1FBRUMsaUJBQU0sT0FBTyxXQUFFLENBQUM7SUFDakIsQ0FBQztJQUNGLHdCQUFDO0FBQUQsQ0F6RkEsQUF5RkMsQ0F6RnNDLHlCQUFXLEdBeUZqRDtBQXpGWSw4Q0FBaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEZhaXJ5VUlNYW5hZ2VyIGZyb20gXCIuL2ZhaXJ1aS9tYW5hZ2VyL0ZhaXJ5VUlNYW5hZ2VyXCI7XHJcbmltcG9ydCBQYW5lbFJlZ2lzdGVyIGZyb20gXCIuL2ZhaXJ1aS9QYW5lbFJlZ2lzdGVyXCI7XHJcbmltcG9ydCBFQnV0dG9uIGZyb20gXCIuL2ZhaXJ1aS92aWV3L2NvbXBvbmVudC9FQnV0dG9uXCI7XHJcbmltcG9ydCBMb2FkU291cmNlTWFuYWdlciwgeyBMb2FkZXJNYW5hZ2VyIH0gZnJvbSBcIi4vY29tL2xvYWQvTG9hZFNvdXJjZU1hbmFnZXJcIjtcclxuaW1wb3J0IFVybFV0aWxzIGZyb20gXCIuL2NvbS9sb2FkL3V0aWxzL1VybFV0aWxzXCI7XHJcblxyXG4vKipcclxuICog5ri45oiP5Li75a6i5oi356uvXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ2xpZW50IGV4dGVuZHMgTGF5YS5TcHJpdGUge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTsgXHJcblxyXG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoZmFpcnlndWkuR1Jvb3QuaW5zdC5kaXNwbGF5T2JqZWN0KTtcclxuXHJcbiAgICAgICAgLy8gTGF5YS5sb2FkZXIubG9hZChbXHJcblx0XHQvLyBcdHsgdXJsOiBcInJlcy9mYWlydWkvY29tbW9uX2F0bGFzMC5wbmdcIiwgdHlwZTogTGF5YS5Mb2FkZXIuSU1BR0UgfSxcclxuXHRcdC8vIFx0eyB1cmw6IFwicmVzL2ZhaXJ1aS9jb21tb24ubWFwXCIsIHR5cGU6IExheWEuTG9hZGVyLkJVRkZFUiB9XHJcbiAgICAgICAgLy8gICAgIF0sIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkxvYWRlZCkpO1xyXG4gICAgICAgIGxldCB1cmxzOkFycmF5PHN0cmluZz4gPSBVcmxVdGlscy5nZXRGYWlyeUdyb3VwKCBcImNvbW1vblwiICk7XHJcbiAgICAgICAgTG9hZFNvdXJjZU1hbmFnZXIubG9hZEdyb3VwKCBcImNvbW1vblwiICwgdXJscyAsIExheWEuSGFuZGxlci5jcmVhdGUoIHRoaXMgLCB0aGlzLm9uTG9hZGVkICkgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uTG9hZGVkKCk6dm9pZHtcclxuXHJcblx0XHRmYWlyeWd1aS5VSVBhY2thZ2UuYWRkUGFja2FnZShcInJlcy9mYWlydWkvY29tbW9uXCIpO1x0XHRcclxuICAgICAgICAvLyBmYWlyeWd1aS5VSUNvbmZpZy5kZWZhdWx0Rm9udCA9IFwiTWljcm9zb2Z0IFlhSGVpXCI7XHJcbiAgICAgICAgLy8gZmFpcnlndWkuVUlDb25maWcudmVydGljYWxTY3JvbGxCYXIgPSBcInVpOi8vQmFzaWMvU2Nyb2xsQmFyX1ZUXCI7XHJcbiAgICAgICAgLy8gZmFpcnlndWkuVUlDb25maWcuaG9yaXpvbnRhbFNjcm9sbEJhciA9IFwidWk6Ly9CYXNpYy9TY3JvbGxCYXJfSFpcIjtcclxuICAgICAgICAvLyBmYWlyeWd1aS5VSUNvbmZpZy5wb3B1cE1lbnUgPSBcInVpOi8vQmFzaWMvUG9wdXBNZW51XCI7XHJcblxyXG4gICAgICAgIFBhbmVsUmVnaXN0ZXIucmVnaXN0ZXJDbGFzcyhcImNvbW1vblwiLCBcIkVCdXR0b25cIiwgRUJ1dHRvbiApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIEZhaXJ5VUlNYW5hZ2VyLmluaXQoIExheWEuc3RhZ2UgKTtcclxuXHR9XHJcbn0iLCIvKipcclxuICog5YWo5bGA5Y+C5pWwXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHbG9iYWwge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgd2lkdGg6bnVtYmVyPTY0MDtcclxuICAgIHB1YmxpYyBzdGF0aWMgaGVpZ2h0Om51bWJlcj0xMTM2O1xyXG4gICAgcHVibGljIHN0YXRpYyBzY2FsZU1vZGU6c3RyaW5nPVwiZml4ZWR3aWR0aFwiO1xyXG4gICAgcHVibGljIHN0YXRpYyBzY3JlZW5Nb2RlOnN0cmluZz1cIm5vbmVcIjsvL2hvcml6b250YWxcclxuICAgIHB1YmxpYyBzdGF0aWMgYWxpZ25WOnN0cmluZz1cInRvcFwiO1xyXG4gICAgcHVibGljIHN0YXRpYyBhbGlnbkg6c3RyaW5nPVwibGVmdFwiO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgc3RhdDpib29sZWFuPWZhbHNlO1xyXG4gICAgcHVibGljIHN0YXRpYyBwaHlzaWNzRGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgZXhwb3J0U2NlbmVUb0pzb246Ym9vbGVhbj10cnVlO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgXHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWo5bGA5Yid5aeL5YyWXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdCgpOnZvaWR7XHJcblxyXG4gICAgICAgIExheWEuaW5pdCgxMTM2LCA2NDAsIExheWEuV2ViR0wpO1xyXG4gICAgICAgIGxheWEudXRpbHMuU3RhdC5zaG93KDAsIDApO1xyXG4gICAgICAgIC8v6K6+572u6YCC6YWN5qih5byPXHJcbiAgICAgICAgTGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBcInNob3dhbGxcIjtcclxuICAgICAgICBMYXlhLnN0YWdlLmFsaWduSCA9IFwibGVmdFwiO1xyXG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25WID0gXCJ0b3BcIjtcclxuICAgICAgICAvL+iuvue9ruaoquerluWxj1xyXG4gICAgICAgIExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IEdsb2JhbC5zY3JlZW5Nb2RlOy8vIFwiaG9yaXpvbnRhbFwiO1xyXG5cclxuICAgICAgICAvL+agueaNrklEReiuvue9ruWIneWni+WMluW8leaTjlx0XHRcclxuXHRcdGlmICh3aW5kb3dbXCJMYXlhM0RcIl0pe1xyXG4gICAgICAgICAgICBMYXlhM0QuaW5pdChHbG9iYWwud2lkdGgsIEdsb2JhbC5oZWlnaHQpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBMYXlhLmluaXQoR2xvYmFsLndpZHRoLCBHbG9iYWwuaGVpZ2h0LCBMYXlhW1wiV2ViR0xcIl0pO1xyXG4gICAgICAgIH0gXHJcblx0XHRMYXlhW1wiUGh5c2ljc1wiXSAmJiBMYXlhW1wiUGh5c2ljc1wiXS5lbmFibGUoKTtcclxuXHRcdExheWFbXCJEZWJ1Z1BhbmVsXCJdICYmIExheWFbXCJEZWJ1Z1BhbmVsXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBHbG9iYWwuc2NhbGVNb2RlO1xyXG5cdFx0TGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2xvYmFsLnNjcmVlbk1vZGU7XHJcblx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXHJcbiAgICAgICAgLy9MYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdsb2JhbC5leHBvcnRTY2VuZVRvSnNvbjtcclxuICAgICAgICBcclxuICAgICAgICAvL+aJk+W8gOiwg+ivlemdouadv++8iOmAmui/h0lEReiuvue9ruiwg+ivleaooeW8j++8jOaIluiAhXVybOWcsOWdgOWinuWKoGRlYnVnPXRydWXlj4LmlbDvvIzlnYflj6/miZPlvIDosIPor5XpnaLmnb/vvIlcclxuXHRcdGlmIChHbG9iYWwuZGVidWcgfHwgTGF5YS5VdGlscy5nZXRRdWVyeVN0cmluZyhcImRlYnVnXCIpID09IFwidHJ1ZVwiKSBMYXlhLmVuYWJsZURlYnVnUGFuZWwoKTtcclxuXHRcdGlmIChHbG9iYWwucGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcclxuXHRcdGlmIChHbG9iYWwuc3RhdCkgTGF5YS5TdGF0LnNob3coKTtcclxuXHRcdExheWEuYWxlcnRHbG9iYWxFcnJvciA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcblx0ICog5Yik5pat5a+56LGh5piv5ZCm5Li65a+55bqU57G75oiW5o6l5Y+jXHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyBpcyggdGFyZ2V0OmFueSAsIGNsczphbnkgKTpib29sZWFue1xyXG5cclxuICAgICAgICBpZiggIXRhcmdldCApe1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cdFx0cmV0dXJuIExheWFbXCJfX3R5cGVvZlwiXSggdGFyZ2V0ICwgY2xzICk7XHJcblx0fVxyXG59IiwiaW1wb3J0IEdhbWVDbGllbnQgZnJvbSBcIi4vR2FtZUNsaWVudFwiO1xyXG5pbXBvcnQgR2xvYmFsIGZyb20gXCIuL0dsb2JhbFwiO1xyXG5jbGFzcyBNYWluIHtcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblxyXG5cdFx0R2xvYmFsLmluaXQoKTtcclxuXHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0TGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcclxuXHR9XHJcblxyXG5cdG9uVmVyc2lvbkxvYWRlZCgpOiB2b2lkIHtcclxuXHRcdC8v5r+A5rS75aSn5bCP5Zu+5pig5bCE77yM5Yqg6L295bCP5Zu+55qE5pe25YCZ77yM5aaC5p6c5Y+R546w5bCP5Zu+5Zyo5aSn5Zu+5ZCI6ZuG6YeM6Z2i77yM5YiZ5LyY5YWI5Yqg6L295aSn5Zu+5ZCI6ZuG77yM6ICM5LiN5piv5bCP5Zu+XHJcblx0XHQvL0xheWEuQXRsYXNJbmZvTWFuYWdlci5lbmFibGUoXCJmaWxlY29uZmlnLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQ29uZmlnTG9hZGVkKSk7XHJcblxyXG5cdFx0TGF5YS5zdGFnZS5hZGRDaGlsZCggbmV3IEdhbWVDbGllbnQoKSApO1xyXG5cdH1cclxuXHJcblx0Ly8gb25Db25maWdMb2FkZWQoKTogdm9pZCB7XHJcblx0Ly8gXHQvL+WKoOi9vUlEReaMh+WumueahOWcuuaZr1xyXG5cdC8vIFx0R2FtZUNvbmZpZy5zdGFydFNjZW5lICYmIExheWEuU2NlbmUub3BlbihHYW1lQ29uZmlnLnN0YXJ0U2NlbmUpO1xyXG5cdC8vIH1cclxufVxyXG4vL+a/gOa0u+WQr+WKqOexu1xyXG5uZXcgTWFpbigpO1xyXG4iLCJpbXBvcnQgUmVzb3VyY2UgZnJvbSBcIi4vcmVzb3VyY2UvUmVzb3VyY2VcIjtcclxuaW1wb3J0IExvYWRlckV2ZW50IGZyb20gXCIuL2V2ZW50L0xvYWRlckV2ZW50XCI7XHJcbmltcG9ydCBHcm91cFJlc291cmNlIGZyb20gXCIuL3Jlc291cmNlL0dyb3VwUmVzb3VyY2VcIjtcclxuXHJcbi8qKlxyXG4gKiDliqDovb3otYTmupDnrqHnkIZcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRTb3VyY2VNYW5hZ2VyIHtcclxuXHJcbiAgICAvKirliqDovb3otYTmupDnrqHnkIYgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGxvYWRNYXA6TGF5YS5XZWFrT2JqZWN0ID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG4gICAgLyoq6LWE5rqQ57uE5a2X5YW4ICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBncm91cE1hcDpMYXlhLldlYWtPYmplY3QgPSBuZXcgTGF5YS5XZWFrT2JqZWN0KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3lp4vljJZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpbml0KCk6dm9pZHtcclxuXHJcbiAgICAgICAgRXZlbnRNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoIExvYWRlckV2ZW50LkxPQURfU0lOR0xFX0NPTVBMRVRFICwgdGhpcy5sb2FkU2luZ2xlQ29tcGxldGUgLCB0aGlzICk7XHJcbiAgICAgICAgRXZlbnRNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoIExvYWRlckV2ZW50LkxPQURfR1JPVVBfQ09NUExFVEUgLCB0aGlzLmxvYWRHcm91cENvbXBsZXRlICwgdGhpcyApO1xyXG5cclxuICAgICAgICBMYXlhLnRpbWVyLmxvb3AoIDEwMDAwICwgdGhpcyAsIHRoaXMuY2hlY2tSZXMgKTsvL+ajgOa1i+i1hOa6kOaYr+WQpuWbnuaUtizmmoLlrpoxMOenkumSn+WbnuaUtuS4gOasoVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L295Y2V5Liq6LWE5rqQ5a6M5oiQXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGxvYWRTaW5nbGVDb21wbGV0ZSggc291cmNlOnN0cmluZ3xSZXNvdXJjZSApOnZvaWR7XHJcblxyXG4gICAgICAgIGxldCByZXM6UmVzb3VyY2UgPSB0eXBlb2Ygc291cmNlID09PSBcInN0cmluZ1wiID8gdGhpcy5nZXRSZXMoIHNvdXJjZSApIDogc291cmNlO1xyXG4gICAgICAgIGlmKCByZXMgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICBsZXQgZ3JvdXBSZXM6R3JvdXBSZXNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLmdyb3VwTWFwICl7XHJcbiAgICAgICAgICAgICAgICBncm91cFJlcyA9IHRoaXMuZ3JvdXBNYXAuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgICAgIGlmKCBncm91cFJlcyAmJiBncm91cFJlcy5oYXNVcmwoIHJlcy51cmwgKSAmJiBncm91cFJlcy5pc0xvYWRlZCgpICl7XHJcbiAgICAgICAgICAgICAgICAgICAgRXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQoIExvYWRlckV2ZW50LkxPQURfR1JPVVBfQ09NUExFVEUgLCBncm91cFJlcyApO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L2957uE6LWE5rqQ5a6M5oiQXHJcbiAgICAgKiBAcGFyYW0gZ3JvdXBOYW1lIFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2FkR3JvdXBDb21wbGV0ZSggc291cmNlOnN0cmluZyB8IEdyb3VwUmVzb3VyY2UgKTp2b2lke1xyXG5cclxuICAgICAgICBsZXQgZ3JvdXBSZXM6R3JvdXBSZXNvdXJjZSA9IHR5cGVvZiBzb3VyY2UgPT09IFwic3RyaW5nXCIgPyAgPEdyb3VwUmVzb3VyY2U+dGhpcy5nZXRSZXMoIHNvdXJjZSApIDogc291cmNlO1xyXG4gICAgICAgIGlmKCBncm91cFJlcyAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIGlmKCBncm91cFJlcy5jb21wbGV0ZSAhPSBudWxsICl7XHJcbiAgICAgICAgICAgICAgICBncm91cFJlcy5jb21wbGV0ZS5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWKoOi9vee7hOi1hOa6kFxyXG4gICAgICogQHBhcmFtIGdyb3VwTmFtZSDotYTmupDnu4TlkI3lrZcs5bi46KeE5LiN5bim56ym5Y+355qE5a2X56ym5Liy77yM5a2X5q+NK+aVsOe7hFxyXG4gICAgICogQHBhcmFtIHVybGxpc3Qg6LWE5rqQ5Zyw5Z2A5YiX6KGoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZEdyb3VwKCBncm91cE5hbWU6c3RyaW5nID0gXCJcIiAsIHVybGxpc3Q6QXJyYXk8c3RyaW5nPiAsIGNvbXBsZXRlOkxheWEuSGFuZGxlciA9IG51bGwgLCBwcm9ncmVzczpMYXlhLkhhbmRsZXIgPSBudWxsICk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoICFncm91cE5hbWUgKSByZXR1cm47XHJcbiAgICAgICAgbGV0IGdyb3VwbGlzdDpBcnJheTxSZXNvdXJjZT4gPSB0aGlzLmxvYWRNYXAuZ2V0KCBncm91cE5hbWUgKTtcclxuICAgICAgICBpZiggZ3JvdXBsaXN0ID09IG51bGwgKXtcclxuICAgICAgICAgICAgZ3JvdXBsaXN0ID0gW107XHJcbiAgICAgICAgICAgIGlmKCB1cmxsaXN0ICE9IG51bGwgJiYgdXJsbGlzdC5sZW5ndGggPiAwICl7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPHVybGxpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVybDpzdHJpbmcgPSB1cmxsaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXM6UmVzb3VyY2UgPSB0aGlzLmxvYWRNYXAuZ2V0KCB1cmwgKSB8fCBSZXNvdXJjZS5jcmVhdGUoIHVybCApO1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwbGlzdC5wdXNoKCByZXMgKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRNYXAuc2V0KCByZXMudXJsICwgcmVzICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBncm91cFJlczpHcm91cFJlc291cmNlID0gUmVzb3VyY2UuY3JlYXRlKCBncm91cGxpc3QgLCBjb21wbGV0ZSAsIHByb2dyZXNzICApO1xyXG4gICAgICAgICAgICBncm91cFJlcy5sb2FkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXBNYXAuc2V0KCBncm91cE5hbWUgLCBncm91cFJlcyApO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBMYXlhLkxvZy5wcmludCggXCLlt7Lnu4/mnInor6XotYTmupDnu4TkuobvvIFcIiApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWKoOi9vei1hOa6kFxyXG4gICAgICogQHBhcmFtIHNvdXJjZSDotYTmupBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkKCBzb3VyY2U6c3RyaW5nfFJlc291cmNlICwgY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbCAsIGVycm9yOkxheWEuSGFuZGxlciA9IG51bGwgICk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoICFzb3VyY2UgKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVzOlJlc291cmNlID0gbnVsbDtcclxuICAgICAgICBpZiggdHlwZW9mIHNvdXJjZSA9PT0gXCJzdHJpbmdcIiApe1xyXG4gICAgICAgICAgICByZXMgPSB0aGlzLmxvYWRNYXAuZ2V0KCBzb3VyY2UgKTtcclxuICAgICAgICAgICAgaWYoIHJlcyAhPSBudWxsICl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzID0gUmVzb3VyY2UuY3JlYXRlKCBzb3VyY2UgLCBjb21wbGV0ZSAsIGVycm9yICk7XHJcbiAgICAgICAgfWVsc2UgaWYoIHNvdXJjZSBpbnN0YW5jZW9mIFJlc291cmNlICl7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJlcyA9IHNvdXJjZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIHJlcyA9PSBudWxsICl7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHJlcy5nZXRSZXMoZmFsc2UpICE9IG51bGwgKXsvL+i1hOa6kOW3suWKoOi9veWujOaIkFxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcy5sb2FkKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkTWFwLnNldCggcmVzLnVybCAsIHJlcyApO1xyXG4gICAgICAgIGxldCBpc0JyZWFrOmJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBmb3IoIGxldCBrZXkgaW4gdGhpcy5sb2FkTWFwICl7XHJcbiAgICAgICAgICAgIHJlcyA9IHRoaXMubG9hZE1hcC5nZXQoIGtleSApO1xyXG4gICAgICAgICAgICBpZiggcmVzICl7XHJcbiAgICAgICAgICAgICAgICBpc0JyZWFrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCBpc0JyZWFrICl7XHJcbiAgICAgICAgICAgIExheWEudGltZXIubG9vcCggMTAwMCAsIHRoaXMgLCB0aGlzLmNoZWNrUmVzICk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIExheWEudGltZXIuY2xlYXIoIHRoaXMgLCB0aGlzLmNoZWNrUmVzICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qOA5rWL6LWE5rqQ5piv5ZCm5Y+v5Zue5pS2XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGNoZWNrUmVzKCk6dm9pZHtcclxuXHJcbiAgICAgICAgbGV0IHJlczpSZXNvdXJjZTtcclxuICAgICAgICBmb3IoIGxldCB1cmwgaW4gdGhpcy5sb2FkTWFwICl7XHJcbiAgICAgICAgICAgIHJlcyA9IHRoaXMubG9hZE1hcC5nZXQoIHVybCApO1xyXG4gICAgICAgICAgICBpZiggcmVzICYmIHJlcy5jYW5HYygpICl7XHJcbiAgICAgICAgICAgICAgICByZXMucmVjb3ZlcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkTWFwLmRlbCggdXJsICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v5qOA5rWL57uE6LWE5rqQIFRPRE9cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlui1hOa6kOaVsOaNrlxyXG4gICAgICogQHBhcmFtIHVybCDotYTmupDlnLDlnYAs5oiW6ICF57uE6LWE5rqQ5ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UmVzKCB1cmw6c3RyaW5nICk6UmVzb3VyY2V8R3JvdXBSZXNvdXJjZXtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZE1hcC5nZXQoIHVybCApIHx8IHRoaXMuZ3JvdXBNYXAuZ2V0KCB1cmwgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlui1hOa6kFxyXG4gICAgICogQHBhcmFtIHVybCDotYTmupDlnLDlnYBcclxuICAgICAqIEBwYXJhbSBpc0NvdW50IOaYr+WQpuiuoeaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFNvdXJjZSggdXJsOnN0cmluZyAsIGlzQ291bnQ6Ym9vbGVhbiA9IGZhbHNlICk6YW55e1xyXG5cclxuICAgICAgICBsZXQgcmVzOlJlc291cmNlID0gdGhpcy5sb2FkTWFwLmdldCggdXJsICk7XHJcbiAgICAgICAgcmV0dXJuIHJlcyAmJiByZXMuZ2V0UmVzKCBpc0NvdW50ICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDph4rmlL7otYTmupBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBkZXN0cm95UmVzKCB1cmw6c3RyaW5nICk6dm9pZHtcclxuXHJcblxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog57qv57K55Yqg6L296LWE5rqQ566h55CGXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTG9hZGVyTWFuYWdlcntcclxuXHJcbiAgICAvKirliqDovb3pmJ/liJfkuIrpmZAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgTE9BRF9MSU1JVDpudW1iZXIgPSA1O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YeG5aSH5Yqg6L295YiX6KGoXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWR5TG9hZExpc3Q6QXJyYXk8UmVzb3VyY2U+ID0gW107XHJcblxyXG4gICAgLyoq5q2j5Zyo5Yqg6L2955qE5YiX6KGoICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2FkaW5nTGlzdDpBcnJheTxSZXNvdXJjZT4gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWKoOi9vei1hOa6kFxyXG4gICAgICogQHBhcmFtIHNvdXJjZSDotYTmupDlnLDlnYDmiJZSZXNvdXJjZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWQoIHNvdXJjZTpzdHJpbmcgfCBSZXNvdXJjZSApOnZvaWR7XHJcblxyXG4gICAgICAgIGxldCByZXM6UmVzb3VyY2UgPSB0eXBlb2Ygc291cmNlID09PSBcInN0cmluZ1wiID8gTG9hZFNvdXJjZU1hbmFnZXIuZ2V0UmVzKCBzb3VyY2UgKSA6IHNvdXJjZTtcclxuICAgICAgICBpZiggcmVzICl7XHJcbiAgICAgICAgICAgIGlmKCB0aGlzLmxvYWRpbmdMaXN0Lmxlbmd0aCA8IHRoaXMuTE9BRF9MSU1JVCApe1xyXG4gICAgICAgICAgICAgICAgaWYoIHRoaXMubG9hZGluZ0xpc3QuaW5kZXhPZiggcmVzICkgIT0gLTEgKXtcclxuICAgICAgICAgICAgICAgICAgICAvL+i1hOa6kOato+WcqOWKoOi9vVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZGluZ0xpc3QucHVzaCggcmVzICk7XHJcbiAgICAgICAgICAgICAgICBMYXlhLmxvYWRlci5sb2FkKCB7dXJsOnJlcy51cmwsdHlwZTpyZXMudHlwZX0gLCBMYXlhLkhhbmRsZXIuY3JlYXRlKCB0aGlzICwgdGhpcy5vbkxvYWRlZCAsIFtyZXNdICwgdHJ1ZSAgKSAgLCByZXMucHJvZ3Jlc3MgICk7XHJcbiAgICAgICAgICAgIH1lbHNlIGlmKCB0aGlzLnJlYWR5TG9hZExpc3QuaW5kZXhPZiggcmVzICkgPT0gLTEgKXtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVhZHlMb2FkTGlzdC5wdXNoKCByZXMgKTtcclxuICAgICAgICAgICAgICAgIC8v6L+Z6YeM5qC55o2u5LyY5YWI57qn5o6S5bqPXHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLnJlYWR5TG9hZExpc3QgPSB0aGlzLnJlYWR5TG9hZExpc3Quc29ydCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgb25Mb2FkZWQoIHJlczpSZXNvdXJjZSApOnZvaWR7XHJcblxyXG4gICAgICAgIHJlcy5sb2FkQ29tcGxldGUoKTtcclxuICAgICAgICAvL+S7juWKoOi9veWIl+ihqOenu+mZpFxyXG4gICAgICAgIGxldCBpbmRleDpudW1iZXIgPSB0aGlzLmxvYWRpbmdMaXN0LmluZGV4T2YoIHJlcyApO1xyXG4gICAgICAgIGlmKCBpbmRleCAhPSAtMSApe1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRpbmdMaXN0LnNwbGljZSggaW5kZXggLCAxICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIEV2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KCBMb2FkZXJFdmVudC5MT0FEX1NJTkdMRV9DT01QTEVURSAsIHJlcyApO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWROZXh0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9hZE5leHQoKTp2b2lke1xyXG5cclxuICAgICAgICBsZXQgcmVzOlJlc291cmNlID0gdGhpcy5yZWFkeUxvYWRMaXN0LnNoaWZ0KCk7XHJcbiAgICAgICAgaWYoIHJlcyAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZCggcmVzICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSAgICBcclxufSIsIi8qKlxyXG4gKiDliqDovb3kuovku7ZcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRlckV2ZW50ICB7XHJcbiAgICBcclxuICAgIC8qKuWKoOi9veWNleS4qui1hOa6kOWujOaIkCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBMT0FEX1NJTkdMRV9DT01QTEVURTpzdHJpbmcgPSBcIkxvYWRlckV2ZW50LmxvYWRTaW5nbGVDb21wbGV0ZVwiO1xyXG4gICAgLyoq5Yqg6L2957uE6LWE5rqQ5a6M5oiQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExPQURfR1JPVVBfQ09NUExFVEU6c3RyaW5nID0gXCJMb2FkZXJFdmVudC5sb2FkR3JvdXBDb21wbGV0ZVwiO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvciggICl7XHJcblxyXG5cclxuICAgIH1cclxufSIsImltcG9ydCBSZXNvdXJjZSBmcm9tIFwiLi9SZXNvdXJjZVwiO1xyXG5pbXBvcnQgeyBMb2FkZXJNYW5hZ2VyIH0gZnJvbSBcIi4uL0xvYWRTb3VyY2VNYW5hZ2VyXCI7XHJcblxyXG4vKipcclxuICog57uE6LWE5rqQXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcm91cFJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge1xyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEtFWTpzdHJpbmcgPSBcIkdyb3VwUmVzb3VyY2VcIjtcclxuXHJcbiAgICBwcml2YXRlIF9saXN0OkFycmF5PFJlc291cmNlPiA9IG51bGw7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBcclxuXHJcbiAgICAgICAgc3VwZXIoKTsgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZSggdXJsOkFycmF5PFJlc291cmNlPiA9IG51bGwgLCBjb21wbGV0ZTpMYXlhLkhhbmRsZXIgPSBudWxsICwgcHJvZ3Jlc3M6TGF5YS5IYW5kbGVyID0gbnVsbCAsIGVycm9yOkxheWEuSGFuZGxlciA9IG51bGwgICk6dm9pZHtcclxuXHJcbiAgICAgICAgLy8gdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy5fbGlzdCA9IHVybDtcclxuICAgICAgICB0aGlzLl9jb21wbGV0ZSA9IGNvbXBsZXRlO1xyXG4gICAgICAgIHRoaXMuX3Byb2dyZXNzID0gcHJvZ3Jlc3M7XHJcbiAgICAgICAgdGhpcy5fZXJyb3IgPSBlcnJvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9hZCgpOnZvaWR7XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLl9saXN0ICYmIHRoaXMuX2xpc3QubGVuZ3RoID4gMCApe1xyXG4gICAgICAgICAgICBsZXQgaXNCcmVhazpib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCByZXM6UmVzb3VyY2U7XHJcbiAgICAgICAgICAgIGZvciggcmVzIG9mIHRoaXMuX2xpc3QgKXtcclxuICAgICAgICAgICAgICAgIGlmKCByZXMgJiYgcmVzLmdldFJlcyggZmFsc2UgKSA9PSBudWxsICl7XHJcbiAgICAgICAgICAgICAgICAgICAgTG9hZGVyTWFuYWdlci5sb2FkKCByZXMudXJsICk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIWlzQnJlYWspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0JyZWFrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoIWlzQnJlYWsgJiYgdGhpcy5fY29tcGxldGUgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29tcGxldGUucnVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDotYTmupDnu4TmmK/lkKbliqDovb3lrozmiJBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzTG9hZGVkKCk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuX2xpc3QgJiYgdGhpcy5fbGlzdC5sZW5ndGggPiAwICl7XHJcbiAgICAgICAgICAgIGxldCByZXM6UmVzb3VyY2U7XHJcbiAgICAgICAgICAgIGZvciggcmVzIG9mIHRoaXMuX2xpc3QgKXtcclxuICAgICAgICAgICAgICAgIGlmKCByZXMgJiYgcmVzLmdldFJlcyggZmFsc2UgKSA9PSBudWxsICl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5pyJ5a+55bqU5Zyw5Z2A6LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gdXJsIOi1hOa6kOWcsOWdgFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaGFzVXJsKCB1cmw6c3RyaW5nICk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgbGV0IHJlczpSZXNvdXJjZTtcclxuICAgICAgICBmb3IoIHJlcyBvZiB0aGlzLl9saXN0ICl7XHJcbiAgICAgICAgICAgIGlmKCByZXMgJiYgcmVzLnVybCA9PSB1cmwgKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi1hOa6kOaYr+WQpuW3suWKoOi9vVxyXG4gICAgICogQHBhcmFtIHVybCDotYTmupDlnLDlnYBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGhhc0xvYWRlZCggdXJsOnN0cmluZyApOmJvb2xlYW57XHJcblxyXG4gICAgICAgIGxldCByZXM6UmVzb3VyY2U7XHJcbiAgICAgICAgZm9yKCByZXMgb2YgdGhpcy5fbGlzdCApe1xyXG4gICAgICAgICAgICBpZiggcmVzICYmIHJlcy51cmwgPT0gdXJsICYmIHJlcy5nZXRSZXMoIGZhbHNlICkgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IExvYWRVdGlscyBmcm9tIFwiLi4vdXRpbHMvTG9hZFV0aWxzXCI7XHJcbmltcG9ydCBUeHRSZXNvdXJjZSBmcm9tIFwiLi9UeHRSZXNvdXJjZVwiO1xyXG5pbXBvcnQgR3JvdXBSZXNvdXJjZSBmcm9tIFwiLi9Hcm91cFJlc291cmNlXCI7XHJcbmltcG9ydCB7IExvYWRlck1hbmFnZXIgfSBmcm9tIFwiLi4vTG9hZFNvdXJjZU1hbmFnZXJcIjtcclxuXHJcbi8qKlxyXG4gKiDotYTmupDln7rnsbtcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlc291cmNlIGltcGxlbWVudHMgSVJlc291cmNlIHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEtFWTpzdHJpbmcgPSBcIlJlc291cmNlXCI7XHJcblxyXG4gICAgLyoq5Zue5pS26Ze06ZqU5pe26Ze077yM5q+r56eSICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEdDX0dBUFRJTUU6bnVtYmVyID0gMTAwMDA7XHJcblxyXG4gICAgLyoq5Zu+54mH6LWE5rqQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRZUEVfSU1BR0U6c3RyaW5nID0gXCJpbWFnZVwiO1xyXG4gICAgLyoq5paH5pys6LWE5rqQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRQWUVfVEVYVDpzdHJpbmcgPSBcInRleHRcIjtcclxuICAgIC8qKuS6jOi/m+WItui1hOa6kCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBUWVBFX0JJTjpzdHJpbmcgPSBcImJpblwiO1xyXG4gICAgLyoq57uE6LWE5rqQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRZUEVfR1JPVVA6c3RyaW5nID0gXCJncm91cFwiO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKCB1cmw6YW55ICwgY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbCAsIHByb2dyZXNzOkxheWEuSGFuZGxlciA9IG51bGwgLCBlcnJvcjpMYXlhLkhhbmRsZXIgPSBudWxsICk6YW55e1xyXG5cclxuICAgICAgICBsZXQgcmVzOlJlc291cmNlID0gbnVsbDtcclxuICAgICAgICBsZXQgZXh0OnN0cmluZyA9IExvYWRVdGlscy5nZXRGaWxlRXh0KCB1cmwgKTtcclxuICAgICAgICBpZiggZXh0ID09IFwicG5nXCIgfHwgZXh0ID09IFwianBnXCIgfHwgZXh0ID09IFwiYm1wXCIgKXtcclxuICAgICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKCBSZXNvdXJjZS5LRVkgLCBSZXNvdXJjZSApO1xyXG4gICAgICAgICAgICByZXMudHlwZSA9IExheWEuTG9hZGVyLklNQUdFO1xyXG4gICAgICAgIH1lbHNlIGlmKCBleHQgPT0gXCJ0eHRcIiB8fCBleHQgPT0gXCJqc29uXCIgKXtcclxuICAgICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKCBUeHRSZXNvdXJjZS5LRVkgLCBUeHRSZXNvdXJjZSApO1xyXG4gICAgICAgICAgICByZXMudHlwZSA9IExheWEuTG9hZGVyLlRFWFQ7XHJcbiAgICAgICAgfWVsc2UgaWYoIHVybCBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICAgICAgcmVzID0gTGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKCBHcm91cFJlc291cmNlLktFWSAsIEdyb3VwUmVzb3VyY2UgKTtcclxuICAgICAgICAgICAgcmVzLnR5cGUgPSBSZXNvdXJjZS5UWVBFX0dST1VQO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihyZXMpe1xyXG4gICAgICAgICAgICByZXMuY3JlYXRlKCB1cmwgLCBjb21wbGV0ZSAsIHByb2dyZXNzICwgZXJyb3IgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWbnuaUtui1hOa6kFxyXG4gICAgICogQHBhcmFtIHJlcyBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWNvdmVyKCByZXM6UmVzb3VyY2UgKTp2b2lke1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKCByZXMgKXtcclxuICAgICAgICAgICAgcmVzLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIExheWEuUG9vbC5yZWNvdmVyKCB0eXBlb2YgcmVzICwgcmVzICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAvKirotYTmupDlkI3lrZcgKi9cclxuICAgIHB1YmxpYyBuYW1lOnN0cmluZyA9IFwiXCI7XHJcbiAgICAvKirliqDovb3lnLDlnYAgKi9cclxuICAgIHB1YmxpYyB1cmw6c3RyaW5nID0gXCJcIjtcclxuICAgIC8qKui1hOa6kOexu+WeiyAqL1xyXG4gICAgcHVibGljIHR5cGU6c3RyaW5nID0gXCJcIjtcclxuICAgIC8qKuS4i+i9veS8mOWFiOe6pyAqL1xyXG4gICAgcHVibGljIHByaW9yaXR5Om51bWJlciA9IDA7XHJcbiAgICAvKirliqDovb3lrozmiJDkuovku7YgKi9cclxuICAgIHByb3RlY3RlZCBfY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbDtcclxuICAgIC8qKui/m+W6puS6i+S7tiAqL1xyXG4gICAgcHJvdGVjdGVkIF9wcm9ncmVzczpMYXlhLkhhbmRsZXIgPSBudWxsO1xyXG4gICAgLyoq6ZSZ6K+v5LqL5Lu2ICovXHJcbiAgICBwcm90ZWN0ZWQgX2Vycm9yOkxheWEuSGFuZGxlciA9IG51bGw7XHJcbiAgICAvKirotYTmupDmlbDmja4gKi9cclxuICAgIHByb3RlY3RlZCBfZGF0YTphbnkgPSBudWxsO1xyXG4gICAgLyoq5L2/55So6K6h5pWwICovXHJcbiAgICBwcm90ZWN0ZWQgX3VzZUNvdW50Om51bWJlciA9IDA7XHJcbiAgICAvKirlm57mlLbml7bpl7QgKi9cclxuICAgIHByb3RlY3RlZCBfZ2NUaW1lOm51bWJlciA9IDA7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCB1cmw6c3RyaW5nID0gXCJcIiAsIGNvbXBsZXRlOkxheWEuSGFuZGxlciA9IG51bGwgLCBlcnJvcjpMYXlhLkhhbmRsZXIgPSBudWxsICkgeyBcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGUoIHVybCAsIGNvbXBsZXRlICwgZXJyb3IgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlKCB1cmw6YW55ID0gXCJcIiAsIGNvbXBsZXRlOkxheWEuSGFuZGxlciA9IG51bGwgLCBwcm9ncmVzczpMYXlhLkhhbmRsZXIgPSBudWxsICwgZXJyb3I6TGF5YS5IYW5kbGVyID0gbnVsbCAgKTp2b2lke1xyXG5cclxuICAgICAgICB0aGlzLnVybCA9IHVybDtcclxuICAgICAgICB0aGlzLl9jb21wbGV0ZSA9IGNvbXBsZXRlO1xyXG4gICAgICAgIHRoaXMuX3Byb2dyZXNzID0gcHJvZ3Jlc3M7XHJcbiAgICAgICAgdGhpcy5fZXJyb3IgPSBlcnJvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9hZCgpOnZvaWR7XHJcblxyXG4gICAgICAgIC8vIExheWEubG9hZGVyLmxvYWQoW1xyXG5cdFx0Ly8gXHR7IHVybDogXCJyZXMvZmFpcnVpL2NvbW1vbl9hdGxhczAucG5nXCIsIHR5cGU6IExheWEuTG9hZGVyLklNQUdFIH0sXHJcblx0XHQvLyBcdHsgdXJsOiBcInJlcy9mYWlydWkvY29tbW9uLm1hcFwiLCB0eXBlOiBMYXlhLkxvYWRlci5CVUZGRVIgfVxyXG4gICAgICAgIC8vICAgICBdLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Mb2FkZWQpKTtcclxuXHJcbiAgICAgICAgTG9hZGVyTWFuYWdlci5sb2FkKCB0aGlzLnVybCApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWNvdmVyKCk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuX3VzZUNvdW50IDw9IDAgKXtcclxuICAgICAgICAgICAgUmVzb3VyY2UucmVjb3ZlciggdGhpcyApO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb2FkQ29tcGxldGUoKTp2b2lke1xyXG5cclxuICAgICAgICB0aGlzLl9kYXRhID0gTGF5YS5sb2FkZXIuZ2V0UmVzKCB0aGlzLnVybCApO1xyXG4gICAgICAgIHRoaXMuX3VzZUNvdW50ID0gMDtcclxuICAgICAgICBpZiggdGhpcy5fY29tcGxldGUgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZS5ydW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5botYTmupBcclxuICAgICAqIEBwYXJhbSBpc0NvdW50IOaYr+WQpuiuoeaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0UmVzKCBpc0NvdW50OmJvb2xlYW4gPSB0cnVlICk6YW55e1xyXG5cclxuICAgICAgICBpZiggaXNDb3VudCApe1xyXG4gICAgICAgICAgICB0aGlzLl91c2VDb3VudCsrO1xyXG4gICAgICAgICAgICB0aGlzLl9nY1RpbWUgPSBMYXlhLnRpbWVyLmN1cnJGcmFtZSArIFJlc291cmNlLkdDX0dBUFRJTUU7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB1c2VDb3VudCgpOm51bWJlcntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZUNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuaYr+WQpuWPr+WbnuaUtiAqL1xyXG4gICAgcHVibGljIGNhbkdjKCk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgcmV0dXJuIExheWEudGltZXIuY3VyckZyYW1lID4gdGhpcy5fZ2NUaW1lICYmIHRoaXMuX3VzZUNvdW50IDw9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzTG9hZGVkKCk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEgIT0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hlY2soKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggdGhpcy5jYW5HYygpICl7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3ZlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNvbXBsZXRlKCk6TGF5YS5IYW5kbGVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcGxldGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBwcm9ncmVzcygpOkxheWEuSGFuZGxlcntcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2dyZXNzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhcigpOnZvaWR7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIHRoaXMuX2NvbXBsZXRlICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5fY29tcGxldGUucmVjb3ZlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5fcHJvZ3Jlc3MgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLl9wcm9ncmVzcy5yZWNvdmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLl9lcnJvciAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMuX2Vycm9yLnJlY292ZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY29tcGxldGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX3Byb2dyZXNzID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9lcnJvciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy51cmwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX2djVGltZSA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3Bvc2UoKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggdGhpcy5fdXNlQ291bnQgPiAwICl7XHJcbiAgICAgICAgICAgIHRoaXMuX3VzZUNvdW50LS07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBSZXNvdXJjZSBmcm9tIFwiLi9SZXNvdXJjZVwiO1xyXG5cclxuLyoqXHJcbiAqIOaWh+acrOi1hOa6kFxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHh0UmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7ICAgIFxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEtFWTpzdHJpbmcgPSBcIlR4dFJlc291cmNlXCI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7IFxyXG4gICAgICAgIHN1cGVyKCk7IFxyXG4gICAgfVxyXG5cclxuXHJcbn0iLCIvKipcclxuICog5Yqg6L295bel5YW3XHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkVXRpbHN7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICog6I635b6X5paH5Lu25ZCO57yA5ZCNXHJcbiAgICAgKiBAcGFyYW0gdXJsIOaWh+S7tui3r+W+hFxyXG4gICAgICogQHJldHVybiA8Yj5TdHJpbmc8L2I+IOaWh+S7tuWQjue8gOWQjVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEZpbGVFeHQodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIC8v5YiH5o6J6Lev5b6E5ZCO6Z2i55qE5Y+C5pWwXHJcbiAgICAgICAgbGV0IGV4dDogc3RyaW5nID0gdXJsLmluZGV4T2YoXCI/XCIpID4gLTEgPyB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKFwiP1wiKSkgOiB1cmw7XHJcbiAgICAgICAgLy/miKrlj5blkI7nvIBcclxuICAgICAgICBsZXQgbGFzdDogc3RyaW5nID0gZXh0LnN1YnN0cmluZyhleHQubGFzdEluZGV4T2YoXCIvXCIpKTtcclxuICAgICAgICByZXR1cm4gbGFzdC5sYXN0SW5kZXhPZihcIi5cIikgPT0gLTEgPyBcIlwiIDogbGFzdC5zdWJzdHJpbmcobGFzdC5sYXN0SW5kZXhPZihcIi5cIikgKyAxKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIOi1hOa6kOWcsOWdgOeuoeeQhuexu1xyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXJsVXRpbHMge1xyXG4gICAgXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBSRVM6c3RyaW5nID0gXCJyZXMvXCI7XHJcbiAgICAvKipmYWlyeWd1aeWPkeW4g+i1hOa6kOebruW9lSAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBGQUlSVUk6c3RyaW5nID0gVXJsVXRpbHMuUkVTICsgXCJmYWlydWkvXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5ZmYWlyeWd1aei1hOa6kOe7hFxyXG4gICAgICogQHBhcmFtIG5hbWUgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0RmFpcnlHcm91cCggbmFtZTpzdHJpbmcgKTpBcnJheTxzdHJpbmc+e1xyXG5cclxuICAgICAgICByZXR1cm4gWyBVcmxVdGlscy5GQUlSVUkgKyBuYW1lICsgXCJfYXRsYXMwLnBuZ1wiICwgVXJsVXRpbHMuRkFJUlVJICsgbmFtZSArIFwiLm1hcFwiIF07XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICog6Z2i5p2/5rOo5YaMIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFuZWxSZWdpc3RlciB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOazqOWGjOe7hOS7tuexu+S4jmZhaXJ5Z3Vp57yW6L6R5Zmo5Lit57G75a+55bqUXHJcbiAgICAgKiBAcGFyYW0gcGtnTmFtZSDljIXlkI1cclxuICAgICAqIEBwYXJhbSByZXNOYW1lIOi1hOa6kOWQjVxyXG4gICAgICogQHBhcmFtIGNsc1x0ICDlr7nlupTljIXkuK3nsbvlkI1cdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyQ2xhc3MocGtnTmFtZTogc3RyaW5nLCByZXNOYW1lOiBzdHJpbmcsIGNsczogYW55KTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmIChwa2dOYW1lICYmICFmYWlyeWd1aS5VSVBhY2thZ2UuZ2V0QnlJZChwa2dOYW1lKSkge1xyXG4gICAgICAgICAgICBmYWlyeWd1aS5VSVBhY2thZ2UuYWRkUGFja2FnZShwa2dOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHVybDogc3RyaW5nID0gZmFpcnlndWkuVUlQYWNrYWdlLmdldEl0ZW1VUkwocGtnTmFtZSwgcmVzTmFtZSk7XHJcbiAgICAgICAgZmFpcnlndWkuVUlPYmplY3RGYWN0b3J5LnNldFBhY2thZ2VJdGVtRXh0ZW5zaW9uKHVybCwgY2xzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uuiHquWumuS5iWZhaXJ5Z3Vp57uE5Lu277yM5b+F6aG755So5q2k5pa55byPLOS4juS7peS4iuaWueazleWvueW6lOS9v+eUqCzkuI3og73nm7TmjqXkvb/nlKhuZXcgY2xzKCnnmoTmlrnlvI/liJvlu7rkuIDkuKrnu5HlrppmYWlyeWd1aeeahOexu++8gVxyXG4gICAgICogQHBhcmFtIHBrZ05hbWUg5YyF5ZCNXHJcbiAgICAgKiBAcGFyYW0gcmVzTmFtZSDotYTmupDlkI1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVHT2JqZWN0KHBrZ05hbWU6IHN0cmluZywgcmVzTmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICByZXR1cm4gZmFpcnlndWkuVUlQYWNrYWdlLmNyZWF0ZU9iamVjdEZyb21VUkwoZmFpcnlndWkuVUlQYWNrYWdlLmdldEl0ZW1VUkwocGtnTmFtZSwgcmVzTmFtZSkpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFBhbmVsUmVnaXN0ZXIgZnJvbSBcIi4uL1BhbmVsUmVnaXN0ZXJcIjtcclxuaW1wb3J0IEVCdXR0b24gZnJvbSBcIi4uL3ZpZXcvY29tcG9uZW50L0VCdXR0b25cIjtcclxuaW1wb3J0IEJhc2VTcHJpdGUgZnJvbSBcIi4uL3ZpZXcvY29tcG9uZW50L0Jhc2VTcHJpdGVcIjtcclxuXHJcbi8qKlxyXG4gKiBGYWlyeWd1aeeuoeeQhlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmFpcnlVSU1hbmFnZXIge1xyXG5cclxuICAgIC8qKuijhei9vSAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcGFyZW50OiBMYXlhLlNwcml0ZSA9IG51bGw7XHJcblxyXG4gICAgLyoq5Li755WM6Z2i5bGCICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG1haW5MYXllcjogQmFzZVNwcml0ZTtcclxuICAgIC8qKueVjOmdouWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB3aW5kb3dMYXllcjogQmFzZVNwcml0ZTtcclxuICAgIC8qKiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBwcm9tcHRMYXllcjogQmFzZVNwcml0ZTtcclxuICAgIC8qKuW8ueahhuWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhbGVydExheWVyOiBCYXNlU3ByaXRlO1xyXG4gICAgLyoq6aG25bGCICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvcExheWVyOiBCYXNlU3ByaXRlO1xyXG4gICAgLyoqdGlw5bGCICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRpcExheWVyOiBCYXNlU3ByaXRlID0gbnVsbDtcclxuICAgIC8qKuW8leWvvOWxgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBndWlkZUxheWVyOiBCYXNlU3ByaXRlID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0KCBjb250YWluZXI6TGF5YS5TcHJpdGUgKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmKCAhdGhpcy5wYXJlbnQgKXtcdFx0XHRcdFxyXG4gICAgICAgICAgICBGYWlyeVVJTWFuYWdlci5tYWluTGF5ZXIgPSBuZXcgQmFzZVNwcml0ZSgpO1xyXG4gICAgICAgICAgICBGYWlyeVVJTWFuYWdlci53aW5kb3dMYXllciA9IG5ldyBCYXNlU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIEZhaXJ5VUlNYW5hZ2VyLnByb21wdExheWVyID0gbmV3IEJhc2VTcHJpdGUoKTtcclxuICAgICAgICAgICAgRmFpcnlVSU1hbmFnZXIudG9wTGF5ZXIgPSBuZXcgQmFzZVNwcml0ZSgpO1xyXG4gICAgICAgICAgICBGYWlyeVVJTWFuYWdlci5hbGVydExheWVyID0gbmV3IEJhc2VTcHJpdGUoKTtcclxuICAgICAgICAgICAgRmFpcnlVSU1hbmFnZXIudGlwTGF5ZXIgPSBuZXcgQmFzZVNwcml0ZSgpO1xyXG4gICAgICAgICAgICBGYWlyeVVJTWFuYWdlci5ndWlkZUxheWVyID0gbmV3IEJhc2VTcHJpdGUoKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQoIGZhaXJ5Z3VpLkdSb290Lmluc3QuZGlzcGxheU9iamVjdCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250YWluZXIuYWRkQ2hpbGQoZmFpcnlndWkuR1Jvb3QuaW5zdC5kaXNwbGF5T2JqZWN0KTtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IGNvbnRhaW5lcjtcclxuICAgICAgICBcclxuICAgICAgICBmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKEZhaXJ5VUlNYW5hZ2VyLm1haW5MYXllcik7XHJcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZChGYWlyeVVJTWFuYWdlci53aW5kb3dMYXllcik7XHJcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZChGYWlyeVVJTWFuYWdlci5wcm9tcHRMYXllcik7XHJcbiAgICAgICAgZmFpcnlndWkuR1Jvb3QuaW5zdC5hZGRDaGlsZChGYWlyeVVJTWFuYWdlci5hbGVydExheWVyKTtcclxuICAgICAgICBmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKEZhaXJ5VUlNYW5hZ2VyLnRvcExheWVyKTtcdFx0XHRcclxuICAgICAgICBmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKEZhaXJ5VUlNYW5hZ2VyLnRpcExheWVyKTtcclxuICAgICAgICBmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKEZhaXJ5VUlNYW5hZ2VyLmd1aWRlTGF5ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBGYWlyeVVJTWFuYWdlcjtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogRmFpcnlVSU1hbmFnZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlID0gdGhpcy5pbnN0YW5jZSB8fCBuZXcgRmFpcnlVSU1hbmFnZXIoKTtcclxuICAgIH1cclxufSIsIi8qKlxyXG4gKiBGYWlyeUdVSee6ueeQhumbhuWkhOeQhuW3peWFt+exu1xyXG4gKiBAYXV0aG9yIGNsIDIwMTkuMi4yMFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEZhaXJ5VGV4dHVyZVV0aWxzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlui1hOa6kOWcsOWdgFxyXG4gICAgICogQHBhcmFtIHBrZ05hbWUgICDljIXlkI1cclxuICAgICAqIEBwYXJhbSByZXNOYW1lICAg6LWE5rqQ5ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VXJsKHBrZ05hbWU6IHN0cmluZywgcmVzTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgbGV0IHVybDogc3RyaW5nID0gZmFpcnlndWkuVUlQYWNrYWdlLmdldEl0ZW1VUkwocGtnTmFtZSwgcmVzTmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIHVybDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlkZhaXJ56LWE5rqQ5YyF6YeM55qE5Zu+54mH6LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gcGtnTmFtZSAgIOWMheWQjVxyXG4gICAgICogQHBhcmFtIHJlc05hbWUgICDotYTmupDlkI1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRUZXh0dXJlQnkocGtnTmFtZTogc3RyaW5nLCByZXNOYW1lOiBzdHJpbmcpOiBMYXlhLlRleHR1cmUge1xyXG5cclxuICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSBmYWlyeWd1aS5VSVBhY2thZ2UuZ2V0SXRlbVVSTChwa2dOYW1lLCByZXNOYW1lKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZXh0dXJlKHVybCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLnmja5GYWlyeWd1aeeahFVSTOWcsOWdgOiOt+WPluWvueW6lOe6ueeQhlxyXG4gICAgICogQHBhcmFtIHVpVXJsICAgICDlpoJ1aTovL3E0ZXZsd2NqZG1vYzJpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VGV4dHVyZSh1cmw6IHN0cmluZyk6IExheWEuVGV4dHVyZSB7XHJcblxyXG4gICAgICAgIGxldCBpdGVtOiBmYWlyeWd1aS5QYWNrYWdlSXRlbSA9IGZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRJdGVtQnlVUkwodXJsKTtcclxuICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpdGVtLmxvYWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW0gPyBpdGVtLnRleHR1cmUgOiBudWxsO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJhc2VTcHJpdGUgZnJvbSBcIi4uL3ZpZXcvY29tcG9uZW50L0Jhc2VTcHJpdGVcIjtcclxuaW1wb3J0IHsgRUdMaXN0IH0gZnJvbSBcIi4uL3ZpZXcvY29tcG9uZW50L0VHTGlzdFwiO1xyXG5cclxuLyoqXHJcbiAqIEZhaXJ5R1VJ5bel5YW3XHJcbiAqIEBhdXRob3IgY2wgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRmFpcnlVdGlscyB7XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDlo7DmmI7lrrnlmajlr7nlupTlj5jph49cclxuXHQgICogQHBhcmFtIHBhcmVudCBcdFx05a655ZmoXHJcblx0ICAqIEBwYXJhbSB0aGlzT2JqZWN0IFx0dGhpc+WvueixoVxyXG5cdCAgKi9cclxuXHRwdWJsaWMgc3RhdGljIHNldFZhcihwYXJlbnQ6IGZhaXJ5Z3VpLkdDb21wb25lbnQsIHRoaXNPYmplY3Q6IGFueSk6IHZvaWQge1xyXG5cclxuXHRcdGlmIChwYXJlbnQgIT0gbnVsbCAmJiB0aGlzT2JqZWN0ICE9IG51bGwpIHtcclxuXHRcdFx0bGV0IGRpc09iajogZmFpcnlndWkuR09iamVjdDtcclxuXHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHBhcmVudC5udW1DaGlsZHJlbjsgaSsrKSB7IC8vb2JqZWN0c1xyXG5cdFx0XHRcdGRpc09iaiA9IHBhcmVudC5nZXRDaGlsZEF0KGkpO1xyXG5cdFx0XHRcdGlmIChkaXNPYmoubmFtZSA9PSBcImljb25cIiB8fCBkaXNPYmoubmFtZSA9PSBcInRpdGxlXCIpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZGlzT2JqLm5hbWUgJiYgZGlzT2JqLm5hbWUuaW5kZXhPZihcInRhYl9cIikgPT0gMCAmJiBkaXNPYmogaW5zdGFuY2VvZiBmYWlyeWd1aS5HR3JvdXApIHtcclxuXHRcdFx0XHRcdC8vIHRoaXNPYmplY3RbZGlzT2JqLm5hbWVdID0gbmV3IGZhaXJ1aS5FVGFiKGRpc09iaiwgdGhpc09iamVjdCk7XHJcblx0XHRcdFx0XHQvLyBpZiAodGhpc09iamVjdCBpbnN0YW5jZW9mIEJhc2VTcHJpdGUpIHRoaXNPYmplY3QuYWRkQ29tcG9uZW50KHRoaXNPYmplY3RbZGlzT2JqLm5hbWVdKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGRpc09iai5uYW1lICYmIGRpc09iai5uYW1lLmluZGV4T2YoXCJlZ2xpc3RfXCIpID09IDAgJiYgZGlzT2JqIGluc3RhbmNlb2YgZmFpcnlndWkuR0xpc3QpIHtcclxuXHRcdFx0XHRcdHRoaXNPYmplY3RbZGlzT2JqLm5hbWVdID0gbmV3IEVHTGlzdChkaXNPYmosIHRoaXNPYmplY3QpO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXNPYmplY3QgaW5zdGFuY2VvZiBCYXNlU3ByaXRlKSB0aGlzT2JqZWN0LmFkZENvbXBvbmVudCh0aGlzT2JqZWN0W2Rpc09iai5uYW1lXSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXNPYmplY3RbZGlzT2JqLm5hbWVdID0gZGlzT2JqO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHBhcmVudC5fdHJhbnNpdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRsZXQgdHJhbnNPYmo6IGZhaXJ5Z3VpLlRyYW5zaXRpb247XHJcblx0XHRcdFx0dHJhbnNPYmogPSBwYXJlbnQuX3RyYW5zaXRpb25zW2ldO1xyXG5cdFx0XHRcdHRoaXNPYmplY3RbdHJhbnNPYmoubmFtZV0gPSB0cmFuc09iajtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufSIsImltcG9ydCBCYXNlU3ByaXRlIGZyb20gXCIuL2NvbXBvbmVudC9CYXNlU3ByaXRlXCI7XHJcblxyXG4vKipcclxuICAqIFVJ5pi+56S65Luj55CG57G7XHJcbiAgKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gICovXHJcbmV4cG9ydCBjbGFzcyBVSUNvbXBvbmVudCBleHRlbmRzIEJhc2VTcHJpdGUge1xyXG5cclxuXHQvKirmmK/lkKbmiZPlvIDov4fnlYzpnaIgKi9cclxuXHRwcm90ZWN0ZWQgaXNPcGVuZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHQvKirmmK/lkKbliJ3lp4vljJbmiafooYznu5PmnZ8gKi9cclxuXHRwcm90ZWN0ZWQgaXNDb21wbHllZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdC8qKuWPguaVsCAqL1xyXG5cdHB1YmxpYyBwYXJhbTogYW55O1xyXG5cclxuXHRwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcblxyXG5cdFx0c3VwZXIoKTtcclxuXHR9XHJcblxyXG5cdHByb3RlY3RlZCBjb25zdHJ1Y3RGcm9tWE1MKHhtbDogYW55KTogdm9pZCB7XHJcblxyXG5cdFx0c3VwZXIuY29uc3RydWN0RnJvbVhNTCh4bWwpO1xyXG5cclxuXHRcdHRoaXMuaW5pdChudWxsKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBpc0luaXRlZCgpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiAhdGhpcy5pc0NvbXBseWVkO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGluaXRDb21wbGV0ZSgpOiBib29sZWFuIHtcclxuXHJcblx0XHQvL+ajgOa1i+WIneWni+WMluaYr+WQpuWujOaIkFxyXG5cdFx0aWYgKCF0aGlzLmlzSW5pdGVkKCkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghdGhpcy5pc09wZW5lZCkge1xyXG5cdFx0XHR0aGlzLmlzT3BlbmVkID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5pbml0VUkoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmluaXREYXRhKHRoaXMucGFyYW0pO1xyXG5cdFx0dGhpcy5hZGRBbGxMaXN0ZW5lcigpO1xyXG5cclxuXHRcdHRoaXMuaXNDb21wbHllZCA9IHRydWU7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDlpJbpg6jkuI3opoHosIPnlKhcclxuXHQgICovXHJcblx0cHVibGljIGluaXQocGFyYW06IGFueSk6IHZvaWQge1xyXG5cdFx0dGhpcy5wYXJhbSA9IHBhcmFtO1xyXG5cdFx0dGhpcy5pbml0Q29tcGxldGUoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDliJ3lp4vljJZVSeeVjOmdolxyXG5cdCAgKi9cclxuXHRwdWJsaWMgaW5pdFVJKCk6IHZvaWQge1xyXG5cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDliJ3lp4vljJblj4LmlbBcclxuXHQgICovXHJcblx0cHVibGljIGluaXREYXRhKHBhcmFtOiBhbnkgPSBudWxsKTogdm9pZCB7XHJcblxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOWFs+mXreeVjOmdouaXtuiwg+eUqFxyXG5cdCAgKi9cclxuXHRwdWJsaWMgY2xlYXIoKTogdm9pZCB7XHJcblxyXG5cdFx0c3VwZXIuY2xlYXIoKTtcclxuXHJcblx0XHR0aGlzLnBhcmFtID0gbnVsbDtcclxuXHRcdHRoaXMuaXNDb21wbHllZCA9IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGRpc3Bvc2UoKTogdm9pZCB7XHJcblxyXG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xyXG5cclxuXHRcdHRoaXMucGFyYW0gPSBudWxsO1xyXG5cdH1cclxufSIsIi8qKlxyXG4gKiDln7rkuo5mYWlyeWd1aS5HQnV0dG9u55qE5Z+657G75oyJ6ZKuXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQnV0dG9uIGV4dGVuZHMgZmFpcnlndWkuR0J1dHRvbiB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBcclxuICAgICAgICBzdXBlcigpOyBcclxuICAgIH1cclxufSIsImltcG9ydCB7IEZhaXJ5VXRpbHMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvRmFpcnlVdGlsc1wiO1xyXG5pbXBvcnQgR2xvYmFsIGZyb20gXCIuLi8uLi8uLi9HbG9iYWxcIjtcclxuXHJcbi8qKlxyXG4gKiBmYWlyeWd1aeWOn+S7tuWfuuexu1xyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVNwcml0ZSBleHRlbmRzIGZhaXJ5Z3VpLkdDb21wb25lbnQgaW1wbGVtZW50cyBJQ29tcG9uZW50e1xyXG5cclxuICAgIC8qKuaVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIF9kYXRhOiBhbnkgPSBudWxsO1xyXG4gICAgLyoq5piv5ZCm5Y+Y54GwICovXHJcbiAgICBwcm90ZWN0ZWQgX2lzR3JheTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLyoqXHJcbiAgICAgKiDnlKjkvKDlhaXnmoRmYWlyeXVpLkdDb21wb25lbnTovazljJbkuLpCYXNlU3ByaXRlXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBvd2VyOiBmYWlyeWd1aS5HQ29tcG9uZW50ID0gbnVsbDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2ljb25Mb2FkZXI6ZmFpcnlndWkuR0xvYWRlcjtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2N1cnJlbnRTdGF0ZTpzdHJpbmcgPSBcIlwiO1xyXG5cclxuXHRwcm90ZWN0ZWQgX2J1dHRvbkNvbnRyb2xsZXI6ZmFpcnlndWkuQ29udHJvbGxlcjtcclxuXHJcbiAgICAvL+S6i+S7tue8k+WtmOaxoFxyXG4gICAgcHJvdGVjdGVkIG1fZXZlbnRQb29sOiBFdmVudFBvb2wgPSBudWxsO1xyXG4gICAgLy/nu4Tku7bnvJPlrZjmsaBcclxuXHRwcm90ZWN0ZWQgbV9jb21wb25lbnREaWM6IExheWEuV2Vha09iamVjdCA9IG51bGw7XHJcbiAgICAgICAgXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY29tcDogZmFpcnlndWkuR0NvbXBvbmVudCA9IG51bGwpIHtcclxuXHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5vd2VyID0gY29tcDtcclxuXHJcbiAgICAgICAgdGhpcy5tX2V2ZW50UG9vbCA9IEV2ZW50UG9vbC5jcmVhdGUoKTtcclxuICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljID0gbmV3IExheWEuV2Vha09iamVjdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RGcm9tWE1MKHhtbDogYW55KTogdm9pZCB7XHJcblxyXG4gICAgICAgIHN1cGVyLmNvbnN0cnVjdEZyb21YTUwoeG1sKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0Q29udHJvbGxlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIEZhaXJ5VXRpbHMuc2V0VmFyKHRoaXMsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWIneWni+WMluaOp+WItuWZqCAqL1xyXG4gICAgcHJvdGVjdGVkIGluaXRDb250cm9sbGVyKCk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5fYnV0dG9uQ29udHJvbGxlciA9IHRoaXMuZ2V0Q29udHJvbGxlcihcImJ1dHRvblwiKTtcclxuICAgICAgICB0aGlzLl9pY29uTG9hZGVyID0gPGZhaXJ5Z3VpLkdMb2FkZXI+dGhpcy5nZXRDaGlsZChcImljb25cIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBjdXJyZW50U3RhdGUodmFsdWU6IHN0cmluZykge1xyXG5cdFx0XHRcclxuICAgICAgICB0aGlzLl9jdXJyZW50U3RhdGUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuX2J1dHRvbkNvbnRyb2xsZXIgKXtcclxuICAgICAgICAgICAgdGhpcy5fYnV0dG9uQ29udHJvbGxlci5zZWxlY3RlZFBhZ2UgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKirlvZPliY3nirbmgIEgKi9cclxuICAgIHB1YmxpYyBnZXQgY3VycmVudFN0YXRlKCk6IHN0cmluZyB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50U3RhdGU7XHJcbiAgICB9XHRcdFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5YyF5ZCr5YWo5bGA5Z2Q5qCH54K5XHJcbiAgICAgKiBAcGFyYW0gZ3gg5YWo5bGAWOWdkOagh1xyXG4gICAgICogQHBhcmFtIGd5IOWFqOWxgFnlnZDmoIdcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnRhaW5zR2xvYmFsUG9pbnQoZ3g6IG51bWJlciwgZ3k6IG51bWJlcik6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICBsZXQgbHA6IExheWEuUG9pbnQgPSB0aGlzLmdsb2JhbFRvTG9jYWwoZ3gsIGd5KTtcclxuICAgICAgICBsZXQgYm91bmRzOiBMYXlhLlJlY3RhbmdsZSA9IG5ldyBMYXlhLlJlY3RhbmdsZSgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgcmV0dXJuIGJvdW5kcy5jb250YWlucyhscC54LCBscC55KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2hpbGQoY2hpbGQ6IGZhaXJ5Z3VpLkdPYmplY3QpOiBmYWlyeWd1aS5HT2JqZWN0IHtcclxuXHJcbiAgICAgICAgaWYgKCBHbG9iYWwuaXMoIGNoaWxkICwgXCJJQ29tcG9uZW50XCIgKSApIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoPGFueT5jaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdXBlci5hZGRDaGlsZChjaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENoaWxkQXQoY2hpbGQ6IGZhaXJ5Z3VpLkdPYmplY3QsIGluZGV4OiBudW1iZXIpOiBmYWlyeWd1aS5HT2JqZWN0IHtcclxuXHJcbiAgICAgICAgaWYgKCBHbG9iYWwuaXMoIGNoaWxkICwgXCJJQ29tcG9uZW50XCIgKSApIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoPGFueT5jaGlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdXBlci5hZGRDaGlsZEF0KGNoaWxkLCBpbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmnaHnm65cclxuICAgICAqIEBwYXJhbSBuYW1lIOe7hOS7tuWQjeWtl1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RWxlbWVudChuYW1lOiBzdHJpbmcsIGNvbnRhaW5lcjogZmFpcnlndWkuR0NvbXBvbmVudCA9IG51bGwpOiBhbnkge1xyXG5cclxuICAgICAgICBjb250YWluZXIgPSBjb250YWluZXIgfHwgdGhpcztcclxuICAgICAgICByZXR1cm4gY29udGFpbmVyLmdldENoaWxkKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5piv5ZCm5YyF5ZCr5p+Q5Liq5a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb250YWlucyhjaGlsZDogZmFpcnlndWkuR09iamVjdCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRDaGlsZEluZGV4KGNoaWxkKSAhPSAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoExheWHljp/nlJ/lhYPku7ZcclxuICAgICAqIEBwYXJhbSBjaGlsZCBMYXlh5Y6f55Sf5pi+56S65a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRFZ3JldENoaWxkKGNoaWxkOiBMYXlhLk5vZGUpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmFkZENoaWxkKGNoaWxkKTtcclxuICAgIH1cclxuICAgIC8qKua3u+WKoExheWHljp/nlJ/lhYPku7ZcclxuICAgICAqIEBwYXJhbSBjaGlsZCBMYXlh5Y6f55Sf5pi+56S65a+56LGhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRFZ3JldENoaWxkQXQoY2hpbGQ6IExheWEuTm9kZSwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hZGRDaGlsZEF0KGNoaWxkLCBpbmRleCk7ICAgICAgICBcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog56e76ZmkTGF5YeWOn+eUn+WFg+S7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlRWdyZXRDaGlsZChjaGlsZDogTGF5YS5Ob2RlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmIChjaGlsZCAmJiB0aGlzLl9jb250YWluZXIuY29udGFpbnMoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZW1vdmVDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjaGlsZCAmJiBjaGlsZC5wYXJlbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjaGlsZC5wYXJlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHRvdWNoRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXIubW91c2VFbmFibGVkID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0b3VjaEVuYWJsZWQoKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250YWluZXIubW91c2VFbmFibGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdG91Y2hDaGlsZHJlbih2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuICAgICAgICB0aGlzLl9jb250YWluZXIubW91c2VUaHJvdWdoID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB0b3VjaENoaWxkcmVuKCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGFpbmVyLm1vdXNlVGhyb3VnaDtcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICBwdWJsaWMgYWRkRXZlbnRMaXN0ZW5lciggdHlwZTpzdHJpbmcgLCBsaXN0ZW5lcjpGdW5jdGlvbiAsIHRoaXNPYmplY3Q6YW55ICwgYXJnczpBcnJheTxhbnk+ID0gbnVsbCApOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMub24oIHR5cGUgLCB0aGlzT2JqZWN0ICwgbGlzdGVuZXIgLCBhcmdzIClcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZTpzdHJpbmcgLCBsaXN0ZW5lcjpGdW5jdGlvbiAsIHRoaXNPYmplY3Q6YW55ICk6dm9pZHtcclxuXHJcbiAgICAgICAgdGhpcy5vZmYoIHR5cGUgLCB0aGlzT2JqZWN0ICwgbGlzdGVuZXIgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWinuWKoOebkeWQrOS6i+S7tuWHveaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkQWxsTGlzdGVuZXIoKTp2b2lkIHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLnJlbGlzdGVuZXJBbGwoKTtcclxuICAgICAgICAgICAgZm9yKCBsZXQga2V5IGluIHRoaXMubV9jb21wb25lbnREaWMgKXtcclxuICAgICAgICAgICAgICAgIGxldCBkYXRhOmFueSA9IHRoaXMubV9jb21wb25lbnREaWMuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgICAgIGlmKCBHbG9iYWwuaXMoIGRhdGEgLCBcIklDb21wb25lbnRcIiApKXtcclxuICAgICAgICAgICAgICAgICAgICAoPElDb21wb25lbnQ+ZGF0YSkuYWRkQWxsTGlzdGVuZXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cdFx0XHRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOebkeWQrOS6i+S7tuWHveaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQWxsTGlzdGVuZXIoKTp2b2lkIHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YTphbnkgPSB0aGlzLm1fY29tcG9uZW50RGljLmdldCgga2V5ICk7XHJcbiAgICAgICAgICAgICAgICBpZiggR2xvYmFsLmlzKCBkYXRhICwgXCJJQ29tcG9uZW50XCIgKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgKDxJQ29tcG9uZW50PmRhdGEpLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHRcdFx0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDkuovku7bnm5HlkKxcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEdhbWVMaXN0ZW5lcih0eXBlOiBzdHJpbmcsIGxpc3RlbmVyOiBGdW5jdGlvbiwgdGhpc09iamVjdDogYW55ICwgdGFyZ2V0PzogYW55KSB7XHJcbiAgICAgICAgaWYoIHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLmFkZExpc3RlbmVyKCB0eXBlICwgbGlzdGVuZXIgLCB0YXJnZXQgLCB0aGlzT2JqZWN0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5LqL5Lu255uR5ZCsXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVHYW1lTGlzdGVuZXIodHlwZTogc3RyaW5nLCBsaXN0ZW5lcjogRnVuY3Rpb24sIHRoaXNPYmplY3Q6IGFueSAsIHRhcmdldD86IGFueSkge1xyXG4gICAgICAgIGlmKCB0aGlzLm1fZXZlbnRQb29sICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5tX2V2ZW50UG9vbC5yZW1vdmVMaXN0ZW5lciggdHlwZSAsIGxpc3RlbmVyICwgdGFyZ2V0ICwgdGhpc09iamVjdCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOe7hOS7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkQ29tcG9uZW50KGNvbXBvbmVudDogSUNvbXBvbmVudCk6IGFueSB7XHJcblxyXG4gICAgICAgIGlmKCBjb21wb25lbnQgKXtcclxuICAgICAgICAgICAgbGV0IGhhc2hDb2RlOm51bWJlciA9IGNvbXBvbmVudC5nZXRIYXNoQ29kZSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljLnNldCggaGFzaENvZGUgLCBjb21wb25lbnQgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOe7hOS7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudDogSUNvbXBvbmVudCk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiggY29tcG9uZW50ICE9IG51bGwgKXtcclxuICAgICAgICAgICAgbGV0IGhhc2hDb2RlOm51bWJlciA9IGNvbXBvbmVudC5nZXRIYXNoQ29kZSgpO1xyXG4gICAgICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljLmRlbCggaGFzaENvZGUgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5omA5pyJ57uE5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVBbGxDb21wb25lbnQoKTp2b2lke1xyXG5cclxuICAgICAgICBmb3IobGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgIHRoaXMubV9jb21wb25lbnREaWMuZGVsKCBrZXkgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdGhpcy5tX2NvbXBvbmVudERpYy5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6YeN572u55WM6Z2iXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubV9ldmVudFBvb2wgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLnJlbW92ZUFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOmFueSA9IHRoaXMubV9jb21wb25lbnREaWMuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgaWYoIEdsb2JhbC5pcyggZGF0YSAsIFwiSUNvbXBvbmVudFwiICkgKXtcclxuICAgICAgICAgICAgICAgICg8SUNvbXBvbmVudD5kYXRhKS5jbGVhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBkZXN0cm95Q29tcG9uZW50KCk6IHZvaWQge1xyXG4gICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgIGxldCBkYXRhOmFueSA9IHRoaXMubV9jb21wb25lbnREaWMuZ2V0KCBrZXkgKTtcclxuICAgICAgICAgICAgaWYoIEdsb2JhbC5pcyggZGF0YSAsIFwiSUNvbXBvbmVudFwiICkgKXtcclxuICAgICAgICAgICAgICAgICg8SUNvbXBvbmVudD5kYXRhKS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bllK/kuIBoYXNoQ29kZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0SGFzaENvZGUoKTogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXNbXCIkX0dJRFwiXSA9IHRoaXNbXCIkX0dJRFwiXSB8fCBMYXlhLlV0aWxzLmdldEdJRCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNEaXNwb3NlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpc1tcIl9kaXNwb3NlZFwiXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHiuaUvuaJgOaciei1hOa6kFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpOnZvaWR7XHJcblxyXG4gICAgICAgIGlmICh0aGlzW1wiX2Rpc3Bvc2VkXCJdKXsgLy9mYWlyeWd1aSDkuK3nmoTnp4HmnInlsZ7mgKdcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3VwZXIuZGlzcG9zZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1fZXZlbnRQb29sKSB7XHJcbiAgICAgICAgICAgIHRoaXMubV9ldmVudFBvb2wuZGlzcG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljID0gbnVsbDtcclxuICAgICAgICB0aGlzLm1fZXZlbnRQb29sID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJhc2VCdXR0b24gZnJvbSBcIi4vQmFzZUJ1dHRvblwiO1xyXG4vKipcclxuICog5bCB6KOFZmFpcnlndWnmjInpkq5cclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVCdXR0b24gZXh0ZW5kcyBCYXNlQnV0dG9uIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJhc2VTcHJpdGUgZnJvbSBcIi4vQmFzZVNwcml0ZVwiO1xyXG5pbXBvcnQgRUJ1dHRvbiBmcm9tIFwiLi9FQnV0dG9uXCI7XHJcbmltcG9ydCBHbG9iYWwgZnJvbSBcIi4uLy4uLy4uL0dsb2JhbFwiO1xyXG5pbXBvcnQgeyBVSUVMaXN0UmVuZGVySXRlbSB9IGZyb20gXCIuL1VJRUxpc3RSZW5kZXJJdGVtXCI7XHJcbmltcG9ydCBCYXNlQnV0dG9uIGZyb20gXCIuL0Jhc2VCdXR0b25cIjtcclxuaW1wb3J0IHsgRmFpcnlUZXh0dXJlVXRpbHMgfSBmcm9tIFwiLi4vLi4vdXRpbHMvRmFpcnlUZXh0dXJlVXRpbHNcIjtcclxuXHJcblxyXG4vKipcclxuICAqIOWwgeijhUZhaXJ5R3Vp5YiX6KGoLOmcgOe8lui+keWZqOS4rWZhaXJ5Z3VpLkdMaXN05ZG95ZCN5Li6ZWdsaXN0X+W8gOWktFxyXG4gICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICAqL1xyXG5leHBvcnQgY2xhc3MgRUdMaXN0IGV4dGVuZHMgQmFzZVNwcml0ZSB7XHJcblxyXG5cdHByb3RlY3RlZCBsaXN0OiBmYWlyeWd1aS5HTGlzdDtcclxuXHRwcm90ZWN0ZWQgX2FycmF5OiBBcnJheTxhbnk+O1xyXG5cdHByb3RlY3RlZCBfdGhpc09iamVjdDogYW55O1xyXG5cdHByb3RlY3RlZCBfaXRlbVJlbmRlcmVyOiBMYXlhLkhhbmRsZXIgPSBudWxsO1xyXG5cdHByb3RlY3RlZCBfY2xpY2tIYW5kbGVyOiBGdW5jdGlvbiA9IG51bGw7Ly/ngrnlh7vkuovku7ZcclxuXHRwcm90ZWN0ZWQgX3NlbGVjdGVkUGFnZTogRnVuY3Rpb24gPSBudWxsOy8v5YiG6aG16YCJ5Lit5p+Q5LiA6aG16Kem5Y+R55qE5LqL5Lu2XHJcblx0cHJvdGVjdGVkIF9lbGVtZW50czogQXJyYXk8ZmFpcnlndWkuR09iamVjdD4gPSBudWxsO1xyXG5cdHByb3RlY3RlZCBfbGFzdGNsaWNrSXRlbTogZmFpcnlndWkuR09iamVjdCA9IG51bGw7XHJcblx0cHJpdmF0ZSBfaXNTaG93RG9TcGVjaWFsRWZmZWN0OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdC8qKuWIhumhtee7hOS7tiAqL1xyXG5cdHByb3RlY3RlZCBjdXJyZW50cGFnZTogbnVtYmVyID0gMDtcclxuXHRwcm90ZWN0ZWQgaXNGaXJzdDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdC8qKuWQkeW3puaMiemSriAqL1xyXG5cdHByb3RlY3RlZCBfYnRuX2xlZnQ6IEVCdXR0b24gfCBmYWlyeWd1aS5HQnV0dG9uO1xyXG5cdC8qKuWQkeWPs+aMiemSriAqL1xyXG5cdHByb3RlY3RlZCBfYnRuX3JpZ2h0OiBFQnV0dG9uIHwgZmFpcnlndWkuR0J1dHRvbjtcclxuXHJcblx0Lyoq5piv5ZCm6Ieq5Yqo5ruR5Yqo5Yiw5bqV6YOoICovXHJcblx0cHVibGljIGlzQXV0b0JvdHRvbTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRwdWJsaWMgY29uc3RydWN0b3IobGlzdDogZmFpcnlndWkuR0xpc3QsIHRoaXNPYmplY3Q6IGFueSA9IG51bGwpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHR0aGlzLmxpc3QgPSBsaXN0O1xyXG5cdFx0aWYgKHRoaXMubGlzdCAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuY2FsbGJhY2tUaGlzT2JqID0gdGhpc09iamVjdCB8fCB0aGlzO1xyXG5cdFx0XHQvLyB0aGlzLmxpc3QuY2FsbGJhY2tUaGlzT2JqID0gdGhpcztcclxuXHRcdFx0dGhpcy5saXN0Lml0ZW1SZW5kZXJlciA9IExheWEuSGFuZGxlci5jcmVhdGUoIHRoaXMgLCB0aGlzLmxpc3RJdGVtUmVuZGVyICk7XHJcblx0XHRcdC8vIHRoaXMubGlzdC5hZGRFdmVudExpc3RlbmVyKGZhaXJ5Z3VpLkl0ZW1FdmVudC5DTElDSywgdGhpcy5jbGlja0l0ZW0sIHRoaXMpO1xyXG5cdFx0XHR0aGlzLmxpc3Qub24oIExheWEuRXZlbnQuQ0xJQ0sgLCB0aGlzICwgdGhpcy5jbGlja0l0ZW0gKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBJc0luaXRlZCgpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFkZEFsbExpc3RlbmVyKCk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmFkZEFsbExpc3RlbmVyKCk7XHJcblx0fVxyXG5cclxuXHQvKirorr7nva7kuIrkuIDpobXmjInpkq4gKi9cclxuXHRwdWJsaWMgc2V0IGJ0bl9sZWZ0KHZhbHVlOiBFQnV0dG9uIHwgZmFpcnlndWkuR0J1dHRvbikge1xyXG5cdFx0aWYgKHZhbHVlKSB7XHJcblx0XHRcdHRoaXMuX2J0bl9sZWZ0ID0gdmFsdWU7XHJcblx0XHRcdHRoaXMuX2J0bl9sZWZ0Lm9uKCBMYXlhLkV2ZW50LkNMSUNLICwgdGhpcyAsIHRoaXMudG91Y2hMZWZ0QnRuSGFuZGxlciApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHRoaXMuX2J0bl9sZWZ0KSB7XHJcblx0XHRcdFx0dGhpcy5fYnRuX2xlZnQub2ZmKExheWEuRXZlbnQuQ0xJQ0ssIHRoaXMsIHRoaXMudG91Y2hMZWZ0QnRuSGFuZGxlciApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQqIOS4iuS4gOmhtVxyXG5cdCovXHJcblx0cHJpdmF0ZSB0b3VjaExlZnRCdG5IYW5kbGVyKGU6IExheWEuRXZlbnQpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLmN1cnJlbnRwYWdlID4gMCkge1xyXG5cdFx0XHRsZXQgaW5kZXg6IG51bWJlciA9IHRoaXMuY3VycmVudHBhZ2UgLSAxO1xyXG5cdFx0XHR0aGlzLnRvUGFnZShpbmRleCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKirorr7nva7kuIvkuIDpobXmjInpkq4gKi9cclxuXHRwdWJsaWMgc2V0IGJ0bl9yaWdodCh2YWx1ZTogRUJ1dHRvbiB8IGZhaXJ5Z3VpLkdCdXR0b24pIHtcclxuXHRcdGlmICh2YWx1ZSkge1xyXG5cdFx0XHR0aGlzLl9idG5fcmlnaHQgPSB2YWx1ZTtcclxuXHRcdFx0dGhpcy5fYnRuX3JpZ2h0Lm9uKExheWEuRXZlbnQuQ0xJQ0sgLCB0aGlzICwgdGhpcy50b3VjaFJpZ2h0QnRuSGFuZGxlciApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHRoaXMuX2J0bl9yaWdodCkge1xyXG5cdFx0XHRcdHRoaXMuX2J0bl9yaWdodC5vZmYoTGF5YS5FdmVudC5DTElDSywgdGhpcywgdGhpcy50b3VjaFJpZ2h0QnRuSGFuZGxlciApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiDkuIvkuIDpobVcclxuXHQgKi9cclxuXHRwcml2YXRlIHRvdWNoUmlnaHRCdG5IYW5kbGVyKGU6IExheWEuRXZlbnQpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLmN1cnJlbnRwYWdlIDwgdGhpcy5hcnJheS5sZW5ndGggLSAxKSB7XHJcblx0XHRcdGxldCBpbmRleDogbnVtYmVyID0gdGhpcy5jdXJyZW50cGFnZSArIDE7XHJcblx0XHRcdHRoaXMudG9QYWdlKGluZGV4KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKui3s+i9rOWIsOafkOS4gOmhtSAwfm4qL1xyXG5cdHByaXZhdGUgdG9QYWdlKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdGluZGV4ID0gaW5kZXggPCAwID8gMCA6IGluZGV4O1xyXG5cdFx0aWYgKHRoaXMuX3NlbGVjdGVkUGFnZSkge1xyXG5cdFx0XHR0aGlzLl9zZWxlY3RlZFBhZ2UuYXBwbHkodGhpcy5jYWxsYmFja1RoaXNPYmosIDApO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5zY3JvbGxUb1ZpZXcoaW5kZXgsIHRydWUpOy8v5rua5Yqo5Yiw5p+Q5LiA5LiqaXRlbVxyXG5cdH1cclxuXHJcblx0Lyoq5ruR5YqobGlzdCAqL1xyXG5cdHByaXZhdGUgc2Nyb2xsTGlzdFBhZ2UoKTogdm9pZCB7XHJcblxyXG5cdFx0bGV0IGluZGV4OiBudW1iZXIgPSAoKHRoaXMubGlzdC5nZXRGaXJzdENoaWxkSW5WaWV3KCkpICUgdGhpcy5saXN0Lm51bUl0ZW1zKTsvL+iOt+WPlumhteaVsFxyXG5cclxuXHRcdHRoaXMuY3VycmVudHBhZ2UgPSBpbmRleDtcclxuXHJcblx0XHRpZiAodGhpcy5fYnRuX2xlZnQpIHtcclxuXHRcdFx0dGhpcy5fYnRuX2xlZnQuZW5hYmxlZCA9IHRoaXMuY3VycmVudHBhZ2UgPiAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9idG5fcmlnaHQpIHtcclxuXHRcdFx0dGhpcy5fYnRuX3JpZ2h0LmVuYWJsZWQgPSB0aGlzLmN1cnJlbnRwYWdlIDwgKHRoaXMuYXJyYXkubGVuZ3RoIC0gMSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3NlbGVjdGVkUGFnZSkge1xyXG5cdFx0XHR0aGlzLl9zZWxlY3RlZFBhZ2UuYXBwbHkodGhpcy5jYWxsYmFja1RoaXNPYmosIDApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBpc1Nob3dEb1NwZWNpYWxFZmZlY3QoYm9vbDogYm9vbGVhbikge1xyXG5cdFx0dGhpcy5faXNTaG93RG9TcGVjaWFsRWZmZWN0ID0gYm9vbDtcclxuXHRcdGlmICh0aGlzLl9pc1Nob3dEb1NwZWNpYWxFZmZlY3QpIHtcclxuXHRcdFx0dGhpcy5saXN0Lm9uKGZhaXJ5Z3VpLkV2ZW50cy5TQ1JPTEwsIHRoaXMsIHRoaXMuZG9TcGVjaWFsRWZmZWN0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMubGlzdC5vZmYoZmFpcnlndWkuRXZlbnRzLlNDUk9MTCwgdGhpcywgdGhpcy5kb1NwZWNpYWxFZmZlY3QpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOa7keWKqGxpc3RcclxuXHQgICovXHJcblx0cHJpdmF0ZSBkb1NwZWNpYWxFZmZlY3QoKTogdm9pZCB7XHJcblx0XHR2YXIgbWlkWDogbnVtYmVyID0gdGhpcy5saXN0LnNjcm9sbFBhbmUucG9zWCArIHRoaXMubGlzdC52aWV3V2lkdGggLyAyO1xyXG5cdFx0dmFyIGNudDogbnVtYmVyID0gdGhpcy5saXN0Lm51bUNoaWxkcmVuO1xyXG5cdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IGNudDsgaSsrKSB7XHJcblx0XHRcdHZhciBvYmo6IGZhaXJ5Z3VpLkdPYmplY3QgPSB0aGlzLmxpc3QuZ2V0Q2hpbGRBdChpKTtcclxuXHRcdFx0dmFyIGRpc3Q6IG51bWJlciA9IE1hdGguYWJzKG1pZFggLSBvYmoueCAtIG9iai53aWR0aCAvIDIpO1xyXG5cdFx0XHRpZiAoZGlzdCA8PSBvYmoud2lkdGggKiAwLjUpIC8v5q2k5p2h55uu5Zyo5Lit6Ze0XHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAodGhpcy5fbGFzdGNsaWNrSXRlbSAmJiBvYmogJiYgdGhpcy5fbGFzdGNsaWNrSXRlbSA9PSBvYmopIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLmNsaWNrSW5kZXggPSB0aGlzLmdldFNob3dJdGVtSW5kZXgob2JqKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRTaG93SXRlbShpbmRleDogbnVtYmVyKTogYW55IHtcclxuXHRcdHJldHVybiB0aGlzLmxpc3QuZ2V0Q2hpbGRBdChpbmRleCk7XHJcblx0fVxyXG5cclxuXHQvKiog5pu05YW35p2h55uuIOiOt+WPlue0ouW8le+8jOaYr+WQpuS4uuadoeebrue0ouW8lSovXHJcblx0cHVibGljIGdldFNob3dJdGVtSW5kZXgoaXRlbTogZmFpcnlndWkuR09iamVjdCwgaXNDaGluZEluZGV4OiBib29sZWFuID0gdHJ1ZSk6IG51bWJlciB7XHJcblx0XHRpZiAoaXNDaGluZEluZGV4KSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmxpc3QuZ2V0Q2hpbGRJbmRleChpdGVtKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmxpc3QuY2hpbGRJbmRleFRvSXRlbUluZGV4KHRoaXMubGlzdC5nZXRDaGlsZEluZGV4KGl0ZW0pKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKui9rOaNouWIsOaYvuekuuWvueixoee0ouW8lSovXHJcblx0cHVibGljIGl0ZW1JbmRleFRvQ2hpbGRJbmRleChpbmRleDogbnVtYmVyKTogbnVtYmVyIHtcclxuXHRcdGxldCBuZXdJbmRleDogbnVtYmVyID0gdGhpcy5saXN0Lml0ZW1JbmRleFRvQ2hpbGRJbmRleChpbmRleCk7XHJcblx0XHRyZXR1cm4gbmV3SW5kZXg7XHJcblx0fVxyXG5cclxuXHQvKirovazmjaLmmL7npLrlr7nosaHntKLlvJXkuLrpobnnm67ntKLlvJXjgIIqL1xyXG5cdHB1YmxpYyBjaGlsZEluZGV4VG9JdGVtSW5kZXgoaW5kZXg6IG51bWJlcik6IG51bWJlciB7XHJcblx0XHRsZXQgbmV3SW5kZXg6IG51bWJlciA9IHRoaXMubGlzdC5jaGlsZEluZGV4VG9JdGVtSW5kZXgoaW5kZXgpO1xyXG5cdFx0cmV0dXJuIG5ld0luZGV4O1xyXG5cdH1cclxuXHJcblx0Lyoq6K6+572u6Jma5ouf5YiX6KGoICovXHJcblx0cHVibGljIHNldFZpcnR1YWwoKTogdm9pZCB7XHJcblx0XHR0aGlzLmxpc3Quc2V0VmlydHVhbCgpO1xyXG5cdFx0dGhpcy5zZXRTY3JvbGwoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRTY3JvbGwoKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5saXN0KSB7XHJcblx0XHRcdHRoaXMubGlzdC5vbihmYWlyeWd1aS5FdmVudHMuU0NST0xMLCB0aGlzLCB0aGlzLnNjcm9sbExpc3RQYWdlICk7Ly/ov5nkuKrlh73mlbDkuLvopoHmmK/mnaXlpITnkIbmu5rliqjliIbpobVcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDorr7nva5MaXN05piv5ZCm6IO95aSf5rua5YqoXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBzZXQgaXNEcmFnZ2VkKHZhbHVlOiBib29sZWFuKSB7XHJcblx0XHRpZiAodGhpcy5saXN0LnNjcm9sbFBhbmUpIHtcclxuXHRcdFx0dGhpcy5saXN0LnNjcm9sbFBhbmUudG91Y2hFZmZlY3QgPSB2YWx1ZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzeW5jKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5saXN0LmVuc3VyZUJvdW5kc0NvcnJlY3QoKTtcclxuXHR9XHJcblxyXG5cdC8qKum7mOiupOmAieaLqeesrOWHoOS4qiAqL1xyXG5cdHB1YmxpYyBzZXQgY2xpY2tJbmRleChpbmRleDogbnVtYmVyKSB7XHJcblx0XHRsZXQgbmV3SW5kZXg6IG51bWJlciA9IHRoaXMuaXRlbUluZGV4VG9DaGlsZEluZGV4KGluZGV4KTtcclxuXHRcdGlmIChuZXdJbmRleCA8IDApIHtcclxuXHRcdFx0bmV3SW5kZXggPSAwO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMubGlzdC5udW1DaGlsZHJlbiA+IDApIHtcclxuXHRcdFx0Ly8gbGV0IGl0ZW06IGZhaXJ5Z3VpLkdPYmplY3QgPSB0aGlzLmxpc3QuZ2V0Q2hpbGRBdChuZXdJbmRleCk7XHJcblx0XHRcdC8vIGxldCBpZTogZmFpcnlndWkuSXRlbUV2ZW50ID0gbmV3IGZhaXJ5Z3VpLkl0ZW1FdmVudChmYWlyeWd1aS5JdGVtRXZlbnQuQ0xJQ0ssIGl0ZW0pO1xyXG5cdFx0XHQvLyB0aGlzLmxpc3QuZGlzcGF0Y2hFdmVudChpZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGNhbGxiYWNrVGhpc09iaih2YWx1ZTogYW55KSB7XHJcblxyXG5cdFx0dGhpcy5fdGhpc09iamVjdCA9IHZhbHVlO1xyXG5cdH1cclxuXHQvKipUaGlzICovXHJcblx0cHVibGljIGdldCBjYWxsYmFja1RoaXNPYmooKTogYW55IHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fdGhpc09iamVjdDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDorr7nva7muLLmn5PmnaHnm65cclxuXHQgICovXHJcblx0cHVibGljIHNldFJlbmRlckl0ZW0ocGtnTmFtZTogc3RyaW5nLCByZXNOYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmxpc3QuZGVmYXVsdEl0ZW0gPSBGYWlyeVRleHR1cmVVdGlscy5nZXRVcmwocGtnTmFtZSwgcmVzTmFtZSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGl0ZW1Qcm92aWRlcih2YWx1ZTogTGF5YS5IYW5kbGVyKSB7XHJcblxyXG5cdFx0aWYgKHRoaXMubGlzdCAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMubGlzdC5pdGVtUHJvdmlkZXIgPSB2YWx1ZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgaXRlbVJlbmRlcmVyKHZhbHVlOiBMYXlhLkhhbmRsZXIpIHtcclxuXHJcblx0XHR0aGlzLl9pdGVtUmVuZGVyZXIgPSB2YWx1ZTtcclxuXHRcdGlmICh0aGlzLmxpc3QgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLmxpc3QuaXRlbVJlbmRlcmVyID0gdmFsdWU7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8qKua4suafk+aWueazlSAqL1xyXG5cdHB1YmxpYyBnZXQgaXRlbVJlbmRlcmVyKCk6TGF5YS5IYW5kbGVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5faXRlbVJlbmRlcmVyO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBjbGlja0hhbmRsZXIodmFsdWU6IEZ1bmN0aW9uKSB7XHJcblxyXG5cdFx0dGhpcy5fY2xpY2tIYW5kbGVyID0gdmFsdWU7XHJcblx0fVxyXG5cdC8qKueCueWHu+S6i+S7tiAqL1xyXG5cdHB1YmxpYyBnZXQgY2xpY2tIYW5kbGVyKCk6IEZ1bmN0aW9uIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fY2xpY2tIYW5kbGVyO1xyXG5cdH1cclxuXHJcblx0Lyoq6K6+572u5YiG6aG15LqL5Lu2ICovXHJcblx0cHVibGljIHNldCBzZWxlY3RlZFBhZ2UodmFsdWU6IEZ1bmN0aW9uKSB7XHJcblxyXG5cdFx0dGhpcy5fc2VsZWN0ZWRQYWdlID0gdmFsdWU7XHJcblx0fVxyXG5cdC8qKuiOt+WPluWIhumhteS6i+S7tiAqL1xyXG5cdHB1YmxpYyBnZXQgc2VsZWN0ZWRQYWdlKCk6IEZ1bmN0aW9uIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fc2VsZWN0ZWRQYWdlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBzZWxlY3Rpb25Nb2RlKCk6bnVtYmVyICB7Ly9mYWlyeWd1aS5MaXN0U2VsZWN0aW9uTW9kZVxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5zZWxlY3Rpb25Nb2RlO1xyXG5cdH1cclxuXHQvKirpgInmi6nmqKHlvI8gKi9cclxuXHRwdWJsaWMgc2V0IHNlbGVjdGlvbk1vZGUodmFsdWU6IG51bWJlcikgey8vZmFpcnlndWkuTGlzdFNlbGVjdGlvbk1vZGVcclxuXHRcdHRoaXMubGlzdC5zZWxlY3Rpb25Nb2RlID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKirmmK/lkKbkuLrljZXpgInmqKHlvI8gKi9cclxuXHRwdWJsaWMgZ2V0IGlzU2luZ2xlU2VsZWN0KCk6IGJvb2xlYW4ge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLnNlbGVjdGlvbk1vZGUgPT0gZmFpcnlndWkuTGlzdFNlbGVjdGlvbk1vZGUuU2luZ2xlO1xyXG5cdH1cclxuXHJcblx0Lyoq5piv5ZCm5Li65aSa6YCJ5qih5byPICovXHJcblx0cHVibGljIGdldCBpc011bHRTZWxlY3QoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuc2VsZWN0aW9uTW9kZSA9PSBmYWlyeWd1aS5MaXN0U2VsZWN0aW9uTW9kZS5NdWx0aXBsZTtcclxuXHR9XHJcblxyXG5cdC8qKuavj+asoeaVsOWAvOaUueWPmOS5i+WJjeS8muinpuWPkeavj+S4quaYvuekuuS4reWtkOe7hOS7tueahGRhdGE9bnVsbOeahOaWueazle+8jOmHjeWGmXNldCBkYXRh6Ieq5bex5aSE55CG5pWw5o2u5byV55SoLOafkOS6m+aDheWGteWmguaenOaYvuekuuS4reeahOWtkOe7hOS7tumcgOimgeaVsOaNruabtOaWsO+8jFxyXG5cdCAgKiDor7fkvb/nlKhlbGVtZW50c+WxnuaAp+iHquihjOi/m+ihjOe7hOS7tuabtOaWsO+8jOS4jeimgee7mWFycmF56LWL5YC877yM5Y+v5Lul5o+Q5Y2H5pWI546HKi9cclxuXHRwdWJsaWMgc2V0IGFycmF5KHZhbHVlOiBBcnJheTxhbnk+KSB7XHJcblxyXG5cdFx0dGhpcy5yZW1vdmVBbGxDb21wb25lbnQoKTtcclxuXHJcblx0XHR0aGlzLmNsZWFyRGF0YSgpO1xyXG5cdFx0dGhpcy5fYXJyYXkgPSB2YWx1ZSB8fCBbXTtcclxuXHRcdHRoaXMudXBkYXRlTGlzdCgpO1xyXG5cdH1cclxuXHQvKipcclxuXHQgICog6K6+572u5a+55bqU5pWw5o2uXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBnZXQgYXJyYXkoKTogQXJyYXk8YW55PiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX2FycmF5O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFkZEl0ZW0odmFsdWU6IGFueSwgaXNVbnNoaWZ0OiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuXHJcblx0XHRpZiAodGhpcy5fYXJyYXkgJiYgdGhpcy5fYXJyYXkuaW5kZXhPZih2YWx1ZSkgPT0gLTEpIHtcclxuXHRcdFx0aWYgKGlzVW5zaGlmdCkge1xyXG5cdFx0XHRcdHRoaXMuX2FycmF5LnVuc2hpZnQodmFsdWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuX2FycmF5LnB1c2godmFsdWUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMudXBkYXRlTGlzdCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Lyoq56e76Zmk5p2h55uuICovXHJcblx0cHVibGljIHJlbW92ZUl0ZW0odmFsdWU6IGFueSk6IHZvaWQge1xyXG5cclxuXHRcdGxldCBpdGVtOiBhbnkgPSBudWxsO1xyXG5cdFx0bGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLl9hcnJheS5pbmRleE9mKHZhbHVlKTtcclxuXHRcdGlmICh0aGlzLl9hcnJheSAmJiBpbmRleCAhPSAtMSkge1xyXG5cdFx0XHRpdGVtID0gdGhpcy5fYXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcclxuXHRcdFx0dGhpcy51cGRhdGVMaXN0KCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gaXRlbTtcclxuXHR9XHJcblxyXG5cclxuXHQvKirmm7TmlrDliJfooaggKi9cclxuXHRwcml2YXRlIHVwZGF0ZUxpc3QoKTogdm9pZCB7XHJcblxyXG5cdFx0aWYgKHRoaXMubGlzdCAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMubGlzdC5udW1JdGVtcyA9IHRoaXMuX2FycmF5Lmxlbmd0aDtcclxuXHRcdFx0aWYgKHRoaXMuaXNBdXRvQm90dG9tKSB7XHJcblx0XHRcdFx0dGhpcy5zY3JvbGxUb0JvdHRvbSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYWRkSXRlbUxpc3QobGlzdDogQXJyYXk8YW55Pik6IHZvaWQge1xyXG5cclxuXHRcdGlmICh0aGlzLl9hcnJheSAhPSBudWxsICYmIGxpc3QgJiYgbGlzdC5sZW5ndGggPiAwKSB7XHJcblx0XHRcdHRoaXMuX2FycmF5ID0gdGhpcy5fYXJyYXkuY29uY2F0KGxpc3QpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy51cGRhdGVMaXN0KCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgcmVwbGFjZUFsbChsaXN0OiBBcnJheTxhbnk+KTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5fYXJyYXkgPSBsaXN0O1xyXG5cdFx0dGhpcy51cGRhdGVMaXN0KCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IG51bUl0ZW1zKHZhbHVlOiBudW1iZXIpIHtcclxuXHJcblx0XHQvLyB0aGlzLl9hcnJheSA9IFtdO1xyXG5cdFx0dGhpcy5jbGVhckRhdGEoKTtcclxuXHRcdHRoaXMuX2FycmF5Lmxlbmd0aCA9IHZhbHVlO1xyXG5cdFx0dGhpcy51cGRhdGVMaXN0KCk7XHJcblx0fVxyXG5cdC8qKuiuvue9ruadoeebriAqL1xyXG5cdHB1YmxpYyBnZXQgbnVtSXRlbXMoKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0Lm51bUl0ZW1zO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOeCueWHu+adoeebrlxyXG5cdCAgKi9cclxuXHRwcm90ZWN0ZWQgY2xpY2tJdGVtKGU6IGFueSk6IHZvaWQgey8vZmFpcnlndWkuSXRlbUV2ZW50XHJcblx0XHR0aGlzLnNlbGVjdEl0ZW0oZS5pdGVtT2JqZWN0KTtcclxuXHR9XHJcblxyXG5cdC8qKumAieaLqeadoeebriAqL1xyXG5cdHB1YmxpYyBzZWxlY3RJdGVtKGl0ZW06IGFueSk6IHZvaWQge1xyXG5cclxuXHRcdC8v5aSN6YCJ5Y+v6YCJ5oup5aSa5Liq5Y+v6YeN5aSN6YCJ5oupXHJcblx0XHRpZiAoKHRoaXMuc2VsZWN0aW9uTW9kZSA9PSBmYWlyeWd1aS5MaXN0U2VsZWN0aW9uTW9kZS5TaW5nbGUpXHJcblx0XHRcdCYmIHRoaXMuX2xhc3RjbGlja0l0ZW1cclxuXHRcdFx0JiYgaXRlbVxyXG5cdFx0XHQmJiB0aGlzLl9sYXN0Y2xpY2tJdGVtID09IGl0ZW1cclxuXHRcdCkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX2xhc3RjbGlja0l0ZW0pIHtcclxuXHRcdFx0dGhpcy5fbGFzdGNsaWNrSXRlbVtcInNlbGVjdFwiXSA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGl0ZW0pIHtcclxuXHRcdFx0aXRlbVtcInNlbGVjdFwiXSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9sYXN0Y2xpY2tJdGVtID0gaXRlbTtcclxuXHJcblx0XHRpZiAoaXRlbS5kYXRhKSB0aGlzLl9zZWxlY3RJbmRleCA9IHRoaXMuX2FycmF5LmluZGV4T2YoaXRlbS5kYXRhKTtcclxuXHRcdGVsc2UgdGhpcy5fc2VsZWN0SW5kZXggPSBwYXJzZUludChpdGVtLm5hbWUpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9jbGlja0hhbmRsZXIpIHtcclxuXHRcdFx0dGhpcy5fY2xpY2tIYW5kbGVyLmFwcGx5KHRoaXMuY2FsbGJhY2tUaGlzT2JqLCBbaXRlbV0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Lyoq6I635Y+W6YCJ5oup55qE5p2h55uuICovXHJcblx0cHVibGljIGdldCBsYXN0Q2xpY2tJdGVtKCk6IGZhaXJ5Z3VpLkdPYmplY3Qge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2xhc3RjbGlja0l0ZW07XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5riy5p+T5p2h55uuXHJcblx0ICAqL1xyXG5cdHByb3RlY3RlZCBsaXN0SXRlbVJlbmRlcihpbmRleDogbnVtYmVyLCBvYmo6IGZhaXJ5Z3VpLkdPYmplY3QpOiB2b2lkIHtcclxuXHJcblx0XHRpZiAoaW5kZXggPT0gMCkge1xyXG5cdFx0XHR0aGlzLl9lbGVtZW50cyA9IFtdO1xyXG5cdFx0fVxyXG5cclxuXHRcdGxldCBpdGVtOiBhbnkgPSBvYmo7XHJcblx0XHRpZiAoaXRlbSAmJiBpdGVtW1wic2hvd1wiXSAhPSB1bmRlZmluZWQpIHtcclxuXHRcdFx0aXRlbS5zaG93KHRoaXMuX2FycmF5W2luZGV4XSk7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5lbGVtZW50cy5pbmRleE9mKGl0ZW0pID09IC0xKSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudHMucHVzaChpdGVtKTtcclxuXHRcdH1cclxuXHRcdC8v5YiX6KGo5riy5p+T5Y2V5Liq5p2h55uuXHJcblx0XHRsZXQgZXZ0OiBHYW1lRXZlbnQgPSBuZXcgR2FtZUV2ZW50KEdhbWVFdmVudC5FR0xJU1RfUkVOREVSKTtcclxuXHRcdGV2dC5kYXRhID0geyBcImluZGV4XCI6IGluZGV4LCBcIm9ialwiOiBvYmogfTtcclxuXHRcdGV2dC50aGlzT2JqZWN0ID0gdGhpcy5fdGhpc09iamVjdDtcclxuXHRcdC8vIHRoaXMuZGlzcGF0Y2hFdmVudChldnQpO1xyXG5cdFx0ZmFpcnlndWkuRXZlbnRzLmRpc3BhdGNoKCBHYW1lRXZlbnQuRUdMSVNUX1JFTkRFUiAsIHRoaXMuX2Rpc3BsYXlPYmplY3QgLCBldnQgKTtcclxuXHRcdC8v5YiX6KGo5riy5p+T5a6M5oiQXHJcblx0XHRpZiAoaW5kZXggPT0gKHRoaXMuX2FycmF5Lmxlbmd0aCAtIDEpKSB7XHJcblxyXG5cdFx0XHRsZXQgY29tcGxldGVFdnQ6IEdhbWVFdmVudCA9IG5ldyBHYW1lRXZlbnQoR2FtZUV2ZW50LkVHTElTVF9DT01QTEVURSk7XHJcblx0XHRcdGNvbXBsZXRlRXZ0LnRoaXNPYmplY3QgPSB0aGlzLl90aGlzT2JqZWN0O1xyXG5cdFx0XHQvLyB0aGlzLmRpc3BhdGNoRXZlbnQoY29tcGxldGVFdnQpO1xyXG5cdFx0XHRmYWlyeWd1aS5FdmVudHMuZGlzcGF0Y2goIEdhbWVFdmVudC5FR0xJU1RfQ09NUExFVEUgLCB0aGlzLl9kaXNwbGF5T2JqZWN0ICwgZXZ0ICk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX3NlbGVjdGVkUGFnZSkge1xyXG5cdFx0XHQvL+WkhOeQhuWIhumhteeahOaXtuWAmVxyXG5cdFx0XHRpZiAoaW5kZXggPT0gMCAmJiAhdGhpcy5pc0ZpcnN0KSB7XHJcblx0XHRcdFx0dGhpcy5pc0ZpcnN0ID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLl9zZWxlY3RlZFBhZ2UuYXBwbHkodGhpcy5jYWxsYmFja1RoaXNPYmosIDApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCBHbG9iYWwuaXMob2JqLCBcIklDb21wb25lbnRcIikgKSB7XHJcblx0XHRcdHRoaXMuYWRkQ29tcG9uZW50KDxhbnk+b2JqKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKuWIl+ihqOa4suafk+aJgOacieadoeebriAg6Jma5ouf5YiX6KGo5LiN5Y+v5Lul6L+Z5qC35Y+WKi9cclxuXHRwdWJsaWMgZ2V0IGVsZW1lbnRzKCk6IEFycmF5PGFueT4ge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnRzO1xyXG5cdFx0Ly/ovazmjaLpobnnm67ntKLlvJXkuLrmmL7npLrlr7nosaHntKLlvJXjgIJcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3NlbGVjdEluZGV4OiBudW1iZXIgPSAwO1xyXG5cclxuXHRwdWJsaWMgc2V0IHNlbGVjdGVkSW5kZXgodmFsdWU6IG51bWJlcikge1xyXG5cclxuXHRcdGlmICh0aGlzLmlzU2luZ2xlU2VsZWN0KSB7XHJcblxyXG5cdFx0XHR0aGlzLmxpc3Quc2VsZWN0ZWRJbmRleCA9IHZhbHVlOy8v5Z2R77yM5pyJ5pe25Y+WIHRoaXMubGlzdC5zZWxlY3RlZEluZGV45pyJ6Zeu6aKYXHJcblx0XHRcdHRoaXMuX3NlbGVjdEluZGV4ID0gdmFsdWU7XHJcblx0XHRcdC8vY2xvbmcgMjAxOS4yLjEyXHJcblx0XHRcdGxldCBpdGVtOiBhbnkgPSB2YWx1ZSA8IHRoaXMubGlzdC5udW1DaGlsZHJlbiA/IHRoaXMubGlzdC5nZXRDaGlsZEF0KHZhbHVlKSA6IG51bGw7XHJcblx0XHRcdGlmIChpdGVtIGluc3RhbmNlb2YgVUlFTGlzdFJlbmRlckl0ZW0gfHwgaXRlbSBpbnN0YW5jZW9mIEJhc2VCdXR0b24gKSB7XHJcblx0XHRcdFx0dGhpcy5zZWxlY3RJdGVtKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLl9zZWxlY3RJbmRleCA9IC0xO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvKirlvZPliY3pgInmi6nmnaHnm67ntKLlvJUgKi9cclxuXHRwdWJsaWMgZ2V0IHNlbGVjdGVkSW5kZXgoKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fc2VsZWN0SW5kZXg7Ly8gdGhpcy5saXN0LnNlbGVjdGVkSW5kZXg7XHJcblx0fVxyXG5cclxuXHQvKirlvZPliY3pgInmi6nmlbDmja4gKi9cclxuXHRwdWJsaWMgZ2V0IHNlbGVjdGVkSXRlbSgpOiBhbnkge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLl9zZWxlY3RJbmRleCA8IDAgPyBudWxsIDogdGhpcy5fYXJyYXlbdGhpcy5fc2VsZWN0SW5kZXhdO1xyXG5cdH1cclxuXHJcblx0Lyoq5re75Yqg6YCJ5oupICovXHJcblx0cHVibGljIGFkZFNlbGVjdGlvbihpbmRleDogbnVtYmVyLCBzY3JvbGxJdFRvVmlldz86IGJvb2xlYW4pOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmxpc3QuYWRkU2VsZWN0aW9uKGluZGV4LCBzY3JvbGxJdFRvVmlldyk7XHJcblx0fVxyXG5cclxuXHQvKirnp7vpmaTpgInmi6kgKi9cclxuXHRwdWJsaWMgcmVtb3ZlU2VsZWN0aW9uKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmxpc3QucmVtb3ZlU2VsZWN0aW9uKGluZGV4KTtcclxuXHR9XHJcblxyXG5cdC8qKuWFqOmAiSAqL1xyXG5cdHB1YmxpYyBzZWxlY3RBbGwoKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5saXN0LnNlbGVjdEFsbCgpO1xyXG5cdH1cclxuXHJcblx0Lyoq5LiN6YCJ5oupICovXHJcblx0cHVibGljIHNlbGVjdE5vbmUoKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5saXN0LnNlbGVjdE5vbmUoKTtcclxuXHR9XHJcblxyXG5cdC8qKuWPjemAiSAqL1xyXG5cdHB1YmxpYyBzZWxlY3RSZXZlcnNlKCk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMubGlzdC5zZWxlY3RSZXZlcnNlKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5b2T5YmN6L+b5bqm5p2h5rua5Yqo55m+5YiG5q+UXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBnZXQgcHJvZ3Jlc3MoKTogbnVtYmVyIHtcclxuXHJcblx0XHRpZiAodGhpcy5pc0hvcml6b250YWwpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubGlzdC5zY3JvbGxQYW5lLnBlcmNYO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubGlzdC5zY3JvbGxQYW5lLnBlcmNZO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gcHVibGljIHNldCBpc0hvcml6b250YWwodmFsdWU6Ym9vbGVhbil7XHJcblx0Ly8gXHRpZiggdmFsdWUgKXtcclxuXHQvLyBcdFx0dGhpcy5saXN0LnNjcm9sbFBhbmUuc2NyXHJcblx0Ly8gXHR9XHJcblx0Ly8gfVxyXG5cclxuXHQvKirmqKrlkJHmu5rliqjmnaEgKi9cclxuXHRwdWJsaWMgZ2V0IGlzSG9yaXpvbnRhbCgpOiBib29sZWFuIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LnNjcm9sbFBhbmUgPyB0aGlzLmxpc3Quc2Nyb2xsUGFuZVtcIl9zY3JvbGxUeXBlXCJdID09IGZhaXJ5Z3VpLlNjcm9sbFR5cGUuSG9yaXpvbnRhbCA6IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOa7keWKqOWIsFxyXG5cdCAgKiBAcGFyYW0gcHJvZ3Jlc3MgMCB+IDFcclxuXHQgICovXHJcblx0cHVibGljIHNsaWRlclRvKHByb2dyZXNzOiBudW1iZXIsIGFuaTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuXHJcblx0XHQvLyB0aGlzLmxpc3Quc2Nyb2xsUGFuZS5zY3JvbGxEb3duKCBwcm9ncmVzcyAsIGFuaSApO1xyXG5cdFx0aWYgKHRoaXMubGlzdC5zY3JvbGxQYW5lKSB7XHJcblx0XHRcdGlmICh0aGlzLmlzSG9yaXpvbnRhbCkge1xyXG5cdFx0XHRcdHRoaXMubGlzdC5zY3JvbGxQYW5lLnNldFBlcmNYKHByb2dyZXNzLCBhbmkpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMubGlzdC5zY3JvbGxQYW5lLnNldFBlcmNZKHByb2dyZXNzLCBhbmkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5rua5Yqo5YiwXHJcblx0ICAqIEBwYXJhbXMgaW5kZXhcclxuXHQgICogQHBhcmFtcyBhbmlcclxuXHQgICogQHBhcmFtcyBzZXRGaXJzdFxyXG5cdCAgKi9cclxuXHRwdWJsaWMgc2Nyb2xsVG9WaWV3KGluZGV4OiBudW1iZXIsIGFuaTogYm9vbGVhbiA9IGZhbHNlLCBzZXRGaXJzdDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5saXN0LnNjcm9sbFRvVmlldyhpbmRleCwgYW5pLCBzZXRGaXJzdCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHNjcm9sbFBhbmUoKTogZmFpcnlndWkuU2Nyb2xsUGFuZSB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5zY3JvbGxQYW5lO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldEZpcnN0Q2hpbGRJblZpZXcoKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmdldEZpcnN0Q2hpbGRJblZpZXcoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRMaXN0Q29tcG9uZXQoKTogZmFpcnlndWkuR0xpc3Qge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3Q7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog5ruR5Yqo5Yiw6aG26YOoXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBzY3JvbGxUb1RvcChhbmk6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMubGlzdC5zY3JvbGxQYW5lLnNjcm9sbFRvcChhbmkpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOa7muWKqOWIsOW6lemDqFxyXG5cdCAgKi9cclxuXHRwdWJsaWMgc2Nyb2xsVG9Cb3R0b20oYW5pOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmxpc3Quc2Nyb2xsUGFuZS5zY3JvbGxCb3R0b20oYW5pKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgdG91Y2hFbmFibGVkKHZhbHVlOiBib29sZWFuKSB7XHJcblxyXG5cdFx0dGhpcy5saXN0Ll9jb250YWluZXIubW91c2VFbmFibGVkID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHRvdWNoRW5hYmxlZCgpOiBib29sZWFuIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0Ll9jb250YWluZXIubW91c2VFbmFibGVkO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBlbmFibGVkKCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5lbmFibGVkO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBlbmFibGVkKHZhbDogYm9vbGVhbikge1xyXG5cdFx0dGhpcy5saXN0LmVuYWJsZWQgPSB2YWw7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHRvdWNoQ2hpbGRyZW4odmFsdWU6IGJvb2xlYW4pIHtcclxuXHJcblx0XHR0aGlzLmxpc3QuX2NvbnRhaW5lci5tb3VzZVRocm91Z2ggPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgdG91Y2hDaGlsZHJlbigpOiBib29sZWFuIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0Ll9jb250YWluZXIubW91c2VUaHJvdWdoO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldENoaWxkQXQoaW5kZXg6IG51bWJlcik6IGZhaXJ5Z3VpLkdPYmplY3Qge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QuZ2V0Q2hpbGRBdChpbmRleClcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgbnVtQ2hpbGRyZW4oKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0Lm51bUNoaWxkcmVuO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBsaW5lQ291bnQodmFsdWU6IG51bWJlcikge1xyXG5cclxuXHRcdHRoaXMubGlzdC5saW5lQ291bnQgPSB2YWx1ZTtcclxuXHR9XHJcblx0Lyoq6K6+572u6KGM5pWwICovXHJcblx0cHVibGljIGdldCBsaW5lQ291bnQoKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmxpbmVDb3VudDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgY29sdW1uQ291bnQodmFsdWU6IG51bWJlcikge1xyXG5cclxuXHRcdHRoaXMubGlzdC5jb2x1bW5Db3VudCA9IHZhbHVlO1xyXG5cdH1cclxuXHQvKirorr7nva7liJfmlbAgKi9cclxuXHRwdWJsaWMgZ2V0IGNvbHVtbkNvdW50KCk6IG51bWJlciB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5jb2x1bW5Db3VudDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgdmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuXHRcdHRoaXMubGlzdC52aXNpYmxlID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHZpc2libGUoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC52aXNpYmxlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB4KHZhbHVlOiBudW1iZXIpIHtcclxuXHJcblx0XHR0aGlzLmxpc3QueCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB4KCk6IG51bWJlciB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC54O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB5KHZhbHVlOiBudW1iZXIpIHtcclxuXHJcblx0XHR0aGlzLmxpc3QueSA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB5KCk6IG51bWJlciB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC55O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBzY3JvbGxUeXBlKHZhbHVlOiBmYWlyeWd1aS5TY3JvbGxUeXBlKSB7XHJcblxyXG5cdFx0aWYgKHRoaXMubGlzdC5zY3JvbGxQYW5lKSB7XHJcblx0XHRcdHRoaXMubGlzdC5zY3JvbGxQYW5lW1wiX3Njcm9sbFR5cGVcIl0gPSB2YWx1ZTtcclxuXHRcdH1cclxuXHR9XHJcblx0Lyoq5YiX6KGo5rua5Yqo5qih5byPICovXHJcblx0cHVibGljIGdldCBzY3JvbGxUeXBlKCk6IGZhaXJ5Z3VpLlNjcm9sbFR5cGUge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3Quc2Nyb2xsUGFuZSA/IHRoaXMubGlzdC5zY3JvbGxQYW5lW1wiX3Njcm9sbFR5cGVcIl0gOiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgbGF5b3V0KHZhbHVlOm51bWJlciApIHsvL2ZhaXJ5Z3VpLkxpc3RMYXlvdXRUeXBlXHJcblxyXG5cdFx0dGhpcy5saXN0LmxheW91dCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBhbGlnbih2YWx1ZTpzdHJpbmcgKSB7Ly9mYWlyeWd1aS5BbGlnblR5cGVcclxuXHJcblx0XHR0aGlzLmxpc3QuYWxpZ24gPSB2YWx1ZTtcclxuXHR9XHJcblx0Lyoq5bem5Y+z5biD5bGAICovXHJcblx0cHVibGljIGdldCBhbGlnbigpOiBzdHJpbmcgey8vZmFpcnlndWkuQWxpZ25UeXBlXHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5hbGlnbjtcclxuXHR9XHJcblxyXG5cdC8vIHB1YmxpYyBzZXQgdmVydGljYWxBbGlnbih2YWx1ZTogZmFpcnlndWkuVmVydEFsaWduVHlwZSkge1xyXG5cclxuXHQvLyBcdHRoaXMubGlzdC52ZXJ0aWNhbEFsaWduID0gdmFsdWU7XHJcblx0Ly8gfVxyXG5cdC8vIC8qKuS4iuS4iyAqL1xyXG5cdC8vIHB1YmxpYyBnZXQgdmVydGljYWxBbGlnbigpOiBmYWlyeWd1aS5WZXJ0QWxpZ25UeXBlIHtcclxuXHQvLyBcdHJldHVybiB0aGlzLmxpc3QudmVydGljYWxBbGlnbjtcclxuXHQvLyB9XHJcblxyXG5cdHB1YmxpYyBzZXQgY29sdW1uR2FwKHZhbHVlOiBudW1iZXIpIHtcclxuXHJcblx0XHR0aGlzLmxpc3QuY29sdW1uR2FwID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvKirliJfot50gKi9cclxuXHRwdWJsaWMgZ2V0IGNvbHVtbkdhcCgpOiBudW1iZXIge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QuY29sdW1uR2FwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBsaW5lR2FwKGdhcDogbnVtYmVyKSB7XHJcblxyXG5cdFx0dGhpcy5saXN0LmxpbmVHYXAgPSBnYXA7XHJcblx0fVxyXG5cclxuXHQvKirooYzot50gKi9cclxuXHRwdWJsaWMgZ2V0IGxpbmVHYXAoKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmxpbmVHYXA7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0U2l6ZSh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgaWdub3JlUGl2b3Q6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMubGlzdC5zZXRTaXplKHdpZHRoLCBoZWlnaHQsIGlnbm9yZVBpdm90KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdXBlclNldFNpemUod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGlnbm9yZVBpdm90OiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuXHJcblx0XHRzdXBlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQsIGlnbm9yZVBpdm90KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgd2lkdGgoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLmxpc3Qud2lkdGg7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHdpZHRoKHZhbHVlOiBudW1iZXIpIHtcclxuXHRcdHRoaXMubGlzdC53aWR0aCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBoZWlnaHQoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLmxpc3QuaGVpZ2h0O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBoZWlnaHQodmFsdWU6IG51bWJlcikge1xyXG5cdFx0dGhpcy5saXN0LmhlaWdodCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB2aWV3V2lkdGgoKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiB0aGlzLmxpc3Qudmlld1dpZHRoO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB2aWV3SGVpZ2h0KCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LnZpZXdIZWlnaHQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGdyYXllZCh2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuXHRcdHRoaXMubGlzdC5ncmF5ZWQgPSB2YWx1ZTtcclxuXHR9XHJcblx0Lyoq572u54GwICovXHJcblx0cHVibGljIGdldCBncmF5ZWQoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5ncmF5ZWQ7XHJcblx0fVxyXG5cclxuXHQvKirniLblrrnlmaggKi9cclxuXHRwdWJsaWMgZ2V0IHBhcmVudCgpOiBmYWlyeWd1aS5HQ29tcG9uZW50IHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LnBhcmVudDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBsb2NhbFRvR2xvYmFsKGF4PzogbnVtYmVyLCBheT86IG51bWJlciwgcmVzdWx0UG9pbnQ/OiBMYXlhLlBvaW50KTogTGF5YS5Qb2ludCB7XHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmxvY2FsVG9HbG9iYWwoYXgsIGF5LCByZXN1bHRQb2ludCk7XHJcblx0fVxyXG5cclxuXHQvKirmuIXnkIbmlbDmja4gKi9cclxuXHRwdWJsaWMgY2xlYXJEYXRhKCkge1xyXG5cdFx0aWYgKHRoaXMuZWxlbWVudHMpIHtcclxuXHRcdFx0Zm9yIChsZXQgaW5kZXggaW4gdGhpcy5lbGVtZW50cykge1xyXG5cdFx0XHRcdGlmICh0aGlzLmVsZW1lbnRzW2luZGV4XSBpbnN0YW5jZW9mIEJhc2VTcHJpdGUpIHtcclxuXHRcdFx0XHRcdHRoaXMuZWxlbWVudHNbaW5kZXhdW1wiaGlkZVwiXSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuX2xhc3RjbGlja0l0ZW0pIHtcclxuXHRcdFx0dGhpcy5fbGFzdGNsaWNrSXRlbVtcInNlbGVjdFwiXSA9IGZhbHNlO1xyXG5cdFx0XHR0aGlzLl9sYXN0Y2xpY2tJdGVtID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLl9idG5fbGVmdCkge1xyXG5cdFx0XHR0aGlzLl9idG5fbGVmdC5vZmYoTGF5YS5FdmVudC5DTElDSywgdGhpcywgdGhpcy50b3VjaExlZnRCdG5IYW5kbGVyICk7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5fYnRuX3JpZ2h0KSB7XHJcblx0XHRcdHRoaXMuX2J0bl9yaWdodC5vZmYoTGF5YS5FdmVudC5DTElDSywgdGhpcywgdGhpcy50b3VjaFJpZ2h0QnRuSGFuZGxlciApO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fYnRuX2xlZnQgPSBudWxsO1xyXG5cdFx0dGhpcy5fYnRuX3JpZ2h0ID0gbnVsbDtcclxuXHRcdHRoaXMuX2VsZW1lbnRzID0gW107XHJcblx0XHR0aGlzLl9hcnJheSA9IFtdO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOmHjee9rlxyXG5cdCAgKi9cclxuXHRwdWJsaWMgY2xlYXIoKTogdm9pZCB7XHJcblxyXG5cdFx0c3VwZXIuY2xlYXIoKTtcclxuXHJcblx0XHR0aGlzLnNsaWRlclRvKDAsIGZhbHNlKTtcclxuXHJcblx0XHR0aGlzLmNsZWFyRGF0YSgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOmHiuaUvlxyXG5cdCAgKi9cclxuXHRwdWJsaWMgZGlzcG9zZSgpOiB2b2lkIHtcclxuXHJcblx0XHRzdXBlci5kaXNwb3NlKCk7XHJcblxyXG5cdFx0dGhpcy5jbGVhcigpO1xyXG5cclxuXHRcdGlmICh0aGlzLmxpc3QgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLmxpc3Qub2ZmKExheWEuRXZlbnQuQ0xJQ0sgLCB0aGlzICwgdGhpcy5jbGlja0l0ZW0pO1xyXG5cdFx0XHR0aGlzLmxpc3Qub2ZmKGZhaXJ5Z3VpLkV2ZW50cy5TQ1JPTEwgLCB0aGlzICwgdGhpcy5zY3JvbGxMaXN0UGFnZSApO1xyXG5cdFx0XHR0aGlzLmxpc3QuZGlzcG9zZSgpO1xyXG5cdFx0XHR0aGlzLmxpc3QgPSBudWxsO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fYnRuX2xlZnQgPSBudWxsO1xyXG5cdFx0dGhpcy5fYnRuX3JpZ2h0ID0gbnVsbDtcclxuXHRcdHRoaXMuX3RoaXNPYmplY3QgPSBudWxsO1xyXG5cdFx0dGhpcy5faXRlbVJlbmRlcmVyID0gbnVsbDtcclxuXHRcdHRoaXMuX2NsaWNrSGFuZGxlciA9IG51bGw7XHJcblx0XHR0aGlzLl9zZWxlY3RlZFBhZ2UgPSBudWxsO1xyXG5cdFx0dGhpcy5fYXJyYXkgPSBudWxsO1xyXG5cdFx0dGhpcy5fZWxlbWVudHMgPSBudWxsO1xyXG5cdFx0dGhpcy5fbGFzdGNsaWNrSXRlbSA9IG51bGw7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IFVJQ29tcG9uZW50IH0gZnJvbSBcIi4uL1VJQ29tcG9uZW50XCI7XHJcblxyXG4vKipcclxuICAqIOWIl+ihqOa4suafk+adoeebrlxyXG4gICogQGF1dGhvciBjbCAyMDE5LjUuMThcclxuICAqL1xyXG5leHBvcnQgY2xhc3MgVUlFTGlzdFJlbmRlckl0ZW0gZXh0ZW5kcyBVSUNvbXBvbmVudCB7XHJcblxyXG5cdC8qKuaYr+WQpuacieWPr+mAieS4reeKtuaAgSAqL1xyXG5cdHB1YmxpYyBjYW5TZWxlY3Q6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0cHJvdGVjdGVkIF9fZGF0YTogYW55ID0gbnVsbDtcclxuXHJcblx0cHJvdGVjdGVkIF9zZWxlY3Q6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0cHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuXHRcdHN1cGVyKCk7XHJcblx0fVxyXG5cclxuXHRwcm90ZWN0ZWQgY29uc3RydWN0RnJvbVhNTCh4bWw6IGFueSk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmNvbnN0cnVjdEZyb21YTUwoeG1sKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBpbml0Q29tcGxldGUoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0Ly/mo4DmtYvliJ3lp4vljJbmmK/lkKblrozmiJBcclxuXHRcdGlmICghdGhpcy5pc0luaXRlZCgpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMuaXNPcGVuZWQpIHtcclxuXHRcdFx0dGhpcy5pc09wZW5lZCA9IHRydWU7XHJcblx0XHRcdHRoaXMuaW5pdFVJKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5pbml0RGF0YSh0aGlzLnBhcmFtKTtcclxuXHRcdC8vIHRoaXMuQWRkUm9vdExpc3RlbmVyKCk7Ly/mraTmlrnms5XlnKhzaG935pa55rOV55qE5pe25YCZ6LCD55SoXHJcblxyXG5cdFx0dGhpcy5pc0NvbXBseWVkID0gdHJ1ZTtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOaYr+WQpuWMheWQq+WFqOWxgOWdkOagh+eCuVxyXG5cdCAgKiBAcGFyYW0gZ3gg5YWo5bGAWOWdkOagh1xyXG5cdCAgKiBAcGFyYW0gZ3kg5YWo5bGAWeWdkOagh1xyXG5cdCAgKi9cclxuXHRwdWJsaWMgY29udGFpbnNHbG9iYWxQb2ludChneDogbnVtYmVyLCBneTogbnVtYmVyKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0bGV0IGxwOiBMYXlhLlBvaW50ID0gdGhpcy5nbG9iYWxUb0xvY2FsKGd4LCBneSk7XHJcblx0XHRsZXQgYm91bmRzOiBMYXlhLlJlY3RhbmdsZSA9IG5ldyBMYXlhLlJlY3RhbmdsZSgwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblx0XHRyZXR1cm4gYm91bmRzLmNvbnRhaW5zKGxwLngsIGxwLnkpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBzZWxlY3QodmFsdWU6IGJvb2xlYW4pIHtcclxuXHJcblx0XHRpZiAodGhpcy5jYW5TZWxlY3QpIHtcclxuXHRcdFx0dGhpcy5jdXJyZW50U3RhdGUgPSB2YWx1ZSA/IFwiZG93blwiIDogXCJ1cFwiO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBzZWxlY3QoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuY2FuU2VsZWN0ID8gdGhpcy5jdXJyZW50U3RhdGUgPT0gXCJkb3duXCIgOiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzaG93KGRhdGE6IGFueSk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMuZGF0YSA9IHRoaXMuX2RhdGEgPSBkYXRhO1xyXG5cdFx0dGhpcy5hZGRBbGxMaXN0ZW5lcigpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGhpZGUoKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5jbGVhcigpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOmHjee9rlxyXG5cdCAgKi9cclxuXHRwdWJsaWMgY2xlYXIoKTogdm9pZCB7XHJcblxyXG5cdFx0c3VwZXIuY2xlYXIoKTtcclxuXHRcdHRoaXMucmVtb3ZlQWxsTGlzdGVuZXIoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDph4rmlL7otYTmupBcclxuXHQgICovXHJcblx0cHVibGljIGRpc3Bvc2UoKTogdm9pZCB7XHJcblxyXG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xyXG5cdH1cclxufSJdfQ==
