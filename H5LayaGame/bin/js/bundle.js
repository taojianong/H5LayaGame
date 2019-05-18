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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L015V29ybGQvbGF5YS9MYXlhQWlySURFX2JldGEvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0dhbWVDbGllbnQudHMiLCJzcmMvR2xvYmFsLnRzIiwic3JjL01haW4udHMiLCJzcmMvY29tL2xvYWQvTG9hZFNvdXJjZU1hbmFnZXIudHMiLCJzcmMvY29tL2xvYWQvZXZlbnQvTG9hZGVyRXZlbnQudHMiLCJzcmMvY29tL2xvYWQvcmVzb3VyY2UvR3JvdXBSZXNvdXJjZS50cyIsInNyYy9jb20vbG9hZC9yZXNvdXJjZS9SZXNvdXJjZS50cyIsInNyYy9jb20vbG9hZC9yZXNvdXJjZS9UeHRSZXNvdXJjZS50cyIsInNyYy9jb20vbG9hZC91dGlscy9Mb2FkVXRpbHMudHMiLCJzcmMvY29tL2xvYWQvdXRpbHMvVXJsVXRpbHMudHMiLCJzcmMvZmFpcnVpL1BhbmVsUmVnaXN0ZXIudHMiLCJzcmMvZmFpcnVpL21hbmFnZXIvRmFpcnlVSU1hbmFnZXIudHMiLCJzcmMvZmFpcnVpL3V0aWxzL0ZhaXJ5VGV4dHVyZVV0aWxzLnRzIiwic3JjL2ZhaXJ1aS91dGlscy9GYWlyeVV0aWxzLnRzIiwic3JjL2ZhaXJ1aS92aWV3L1VJQ29tcG9uZW50LnRzIiwic3JjL2ZhaXJ1aS92aWV3L2NvbXBvbmVudC9CYXNlQnV0dG9uLnRzIiwic3JjL2ZhaXJ1aS92aWV3L2NvbXBvbmVudC9CYXNlU3ByaXRlLnRzIiwic3JjL2ZhaXJ1aS92aWV3L2NvbXBvbmVudC9FQnV0dG9uLnRzIiwic3JjL2ZhaXJ1aS92aWV3L2NvbXBvbmVudC9FR0xpc3QudHMiLCJzcmMvZmFpcnVpL3ZpZXcvY29tcG9uZW50L1VJRUxpc3RSZW5kZXJJdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1ZBLGtFQUE2RDtBQUM3RCx3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Q0FBQyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELHNCQUFXLHFDQUFNO2FBT2pCO1lBRUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzdELENBQUM7YUFWRCxVQUFrQixLQUFjO1lBRS9CLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2FBQzFDO1FBQ0YsQ0FBQzs7O09BQUE7SUFPTSxnQ0FBSSxHQUFYLFVBQVksSUFBUztRQUVwQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQzlCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRU0sZ0NBQUksR0FBWDtRQUVDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRDs7UUFFSTtJQUNHLGlDQUFLLEdBQVo7UUFFQyxpQkFBTSxLQUFLLFdBQUUsQ0FBQztRQUNkLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRDs7UUFFSTtJQUNHLG1DQUFPLEdBQWQ7UUFFQyxpQkFBTSxPQUFPLFdBQUUsQ0FBQztJQUNqQixDQUFDO0lBQ0Ysd0JBQUM7QUFBRCxDQXpGQSxBQXlGQyxDQXpGc0MseUJBQVcsR0F5RmpEO0FBekZZLDhDQUFpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgRmFpcnlVSU1hbmFnZXIgZnJvbSBcIi4vZmFpcnVpL21hbmFnZXIvRmFpcnlVSU1hbmFnZXJcIjtcclxuaW1wb3J0IFBhbmVsUmVnaXN0ZXIgZnJvbSBcIi4vZmFpcnVpL1BhbmVsUmVnaXN0ZXJcIjtcclxuaW1wb3J0IEVCdXR0b24gZnJvbSBcIi4vZmFpcnVpL3ZpZXcvY29tcG9uZW50L0VCdXR0b25cIjtcclxuaW1wb3J0IExvYWRTb3VyY2VNYW5hZ2VyLCB7IExvYWRlck1hbmFnZXIgfSBmcm9tIFwiLi9jb20vbG9hZC9Mb2FkU291cmNlTWFuYWdlclwiO1xyXG5pbXBvcnQgVXJsVXRpbHMgZnJvbSBcIi4vY29tL2xvYWQvdXRpbHMvVXJsVXRpbHNcIjtcclxuXHJcbi8qKlxyXG4gKiDmuLjmiI/kuLvlrqLmiLfnq69cclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDbGllbnQgZXh0ZW5kcyBMYXlhLlNwcml0ZSB7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICBzdXBlcigpOyBcclxuXHJcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZChmYWlyeWd1aS5HUm9vdC5pbnN0LmRpc3BsYXlPYmplY3QpO1xyXG5cclxuICAgICAgICAvLyBMYXlhLmxvYWRlci5sb2FkKFtcclxuXHRcdC8vIFx0eyB1cmw6IFwicmVzL2ZhaXJ1aS9jb21tb25fYXRsYXMwLnBuZ1wiLCB0eXBlOiBMYXlhLkxvYWRlci5JTUFHRSB9LFxyXG5cdFx0Ly8gXHR7IHVybDogXCJyZXMvZmFpcnVpL2NvbW1vbi5tYXBcIiwgdHlwZTogTGF5YS5Mb2FkZXIuQlVGRkVSIH1cclxuICAgICAgICAvLyAgICAgXSwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uTG9hZGVkKSk7XHJcbiAgICAgICAgbGV0IHVybHM6QXJyYXk8c3RyaW5nPiA9IFVybFV0aWxzLmdldEZhaXJ5R3JvdXAoIFwiY29tbW9uXCIgKTtcclxuICAgICAgICBMb2FkU291cmNlTWFuYWdlci5sb2FkR3JvdXAoIFwiY29tbW9uXCIgLCB1cmxzICwgTGF5YS5IYW5kbGVyLmNyZWF0ZSggdGhpcyAsIHRoaXMub25Mb2FkZWQgKSApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Mb2FkZWQoKTp2b2lke1xyXG5cclxuXHRcdGZhaXJ5Z3VpLlVJUGFja2FnZS5hZGRQYWNrYWdlKFwicmVzL2ZhaXJ1aS9jb21tb25cIik7XHRcdFxyXG4gICAgICAgIC8vIGZhaXJ5Z3VpLlVJQ29uZmlnLmRlZmF1bHRGb250ID0gXCJNaWNyb3NvZnQgWWFIZWlcIjtcclxuICAgICAgICAvLyBmYWlyeWd1aS5VSUNvbmZpZy52ZXJ0aWNhbFNjcm9sbEJhciA9IFwidWk6Ly9CYXNpYy9TY3JvbGxCYXJfVlRcIjtcclxuICAgICAgICAvLyBmYWlyeWd1aS5VSUNvbmZpZy5ob3Jpem9udGFsU2Nyb2xsQmFyID0gXCJ1aTovL0Jhc2ljL1Njcm9sbEJhcl9IWlwiO1xyXG4gICAgICAgIC8vIGZhaXJ5Z3VpLlVJQ29uZmlnLnBvcHVwTWVudSA9IFwidWk6Ly9CYXNpYy9Qb3B1cE1lbnVcIjtcclxuXHJcbiAgICAgICAgUGFuZWxSZWdpc3Rlci5yZWdpc3RlckNsYXNzKFwiY29tbW9uXCIsIFwiRUJ1dHRvblwiLCBFQnV0dG9uICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgRmFpcnlVSU1hbmFnZXIuaW5pdCggTGF5YS5zdGFnZSApO1xyXG5cdH1cclxufSIsIi8qKlxyXG4gKiDlhajlsYDlj4LmlbBcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdsb2JhbCB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyB3aWR0aDpudW1iZXI9NjQwO1xyXG4gICAgcHVibGljIHN0YXRpYyBoZWlnaHQ6bnVtYmVyPTExMzY7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJmaXhlZHdpZHRoXCI7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNjcmVlbk1vZGU6c3RyaW5nPVwibm9uZVwiOy8vaG9yaXpvbnRhbFxyXG4gICAgcHVibGljIHN0YXRpYyBhbGlnblY6c3RyaW5nPVwidG9wXCI7XHJcbiAgICBwdWJsaWMgc3RhdGljIGFsaWduSDpzdHJpbmc9XCJsZWZ0XCI7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgcHVibGljIHN0YXRpYyBzdGF0OmJvb2xlYW49ZmFsc2U7XHJcbiAgICBwdWJsaWMgc3RhdGljIHBoeXNpY3NEZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgcHVibGljIHN0YXRpYyBleHBvcnRTY2VuZVRvSnNvbjpib29sZWFuPXRydWU7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkgeyBcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhajlsYDliJ3lp4vljJZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpbml0KCk6dm9pZHtcclxuXHJcbiAgICAgICAgTGF5YS5pbml0KDExMzYsIDY0MCwgTGF5YS5XZWJHTCk7XHJcbiAgICAgICAgbGF5YS51dGlscy5TdGF0LnNob3coMCwgMCk7XHJcbiAgICAgICAgLy/orr7nva7pgILphY3mqKHlvI9cclxuICAgICAgICBMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IFwic2hvd2FsbFwiO1xyXG4gICAgICAgIExheWEuc3RhZ2UuYWxpZ25IID0gXCJsZWZ0XCI7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5hbGlnblYgPSBcInRvcFwiO1xyXG4gICAgICAgIC8v6K6+572u5qiq56uW5bGPXHJcbiAgICAgICAgTGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2xvYmFsLnNjcmVlbk1vZGU7Ly8gXCJob3Jpem9udGFsXCI7XHJcblxyXG4gICAgICAgIC8v5qC55o2uSURF6K6+572u5Yid5aeL5YyW5byV5pOOXHRcdFxyXG5cdFx0aWYgKHdpbmRvd1tcIkxheWEzRFwiXSl7XHJcbiAgICAgICAgICAgIExheWEzRC5pbml0KEdsb2JhbC53aWR0aCwgR2xvYmFsLmhlaWdodCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIExheWEuaW5pdChHbG9iYWwud2lkdGgsIEdsb2JhbC5oZWlnaHQsIExheWFbXCJXZWJHTFwiXSk7XHJcbiAgICAgICAgfSBcclxuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IEdsb2JhbC5zY2FsZU1vZGU7XHJcblx0XHRMYXlhLnN0YWdlLnNjcmVlbk1vZGUgPSBHbG9iYWwuc2NyZWVuTW9kZTtcclxuXHRcdC8v5YW85a655b6u5L+h5LiN5pSv5oyB5Yqg6L29c2NlbmXlkI7nvIDlnLrmma9cclxuICAgICAgICAvL0xheWEuVVJMLmV4cG9ydFNjZW5lVG9Kc29uID0gR2xvYmFsLmV4cG9ydFNjZW5lVG9Kc29uO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8v5omT5byA6LCD6K+V6Z2i5p2/77yI6YCa6L+HSURF6K6+572u6LCD6K+V5qih5byP77yM5oiW6ICFdXJs5Zyw5Z2A5aKe5YqgZGVidWc9dHJ1ZeWPguaVsO+8jOWdh+WPr+aJk+W8gOiwg+ivlemdouadv++8iVxyXG5cdFx0aWYgKEdsb2JhbC5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG5cdFx0aWYgKEdsb2JhbC5waHlzaWNzRGVidWcgJiYgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0pIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdLmVuYWJsZSgpO1xyXG5cdFx0aWYgKEdsb2JhbC5zdGF0KSBMYXlhLlN0YXQuc2hvdygpO1xyXG5cdFx0TGF5YS5hbGVydEdsb2JhbEVycm9yID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuXHQgKiDliKTmlq3lr7nosaHmmK/lkKbkuLrlr7nlupTnsbvmiJbmjqXlj6NcclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIGlzKCB0YXJnZXQ6YW55ICwgY2xzOmFueSApOmJvb2xlYW57XHJcblxyXG4gICAgICAgIGlmKCAhdGFyZ2V0ICl7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblx0XHRyZXR1cm4gTGF5YVtcIl9fdHlwZW9mXCJdKCB0YXJnZXQgLCBjbHMgKTtcclxuXHR9XHJcbn0iLCJpbXBvcnQgR2FtZUNsaWVudCBmcm9tIFwiLi9HYW1lQ2xpZW50XCI7XHJcbmltcG9ydCBHbG9iYWwgZnJvbSBcIi4vR2xvYmFsXCI7XHJcbmNsYXNzIE1haW4ge1xyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHJcblx0XHRHbG9iYWwuaW5pdCgpO1xyXG5cclxuXHRcdC8v5r+A5rS76LWE5rqQ54mI5pys5o6n5Yi277yMdmVyc2lvbi5qc29u55SxSURF5Y+R5biD5Yqf6IO96Ieq5Yqo55Sf5oiQ77yM5aaC5p6c5rKh5pyJ5Lmf5LiN5b2x5ZON5ZCO57ut5rWB56iLXHJcblx0XHRMYXlhLlJlc291cmNlVmVyc2lvbi5lbmFibGUoXCJ2ZXJzaW9uLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uVmVyc2lvbkxvYWRlZCksIExheWEuUmVzb3VyY2VWZXJzaW9uLkZJTEVOQU1FX1ZFUlNJT04pO1xyXG5cdH1cclxuXHJcblx0b25WZXJzaW9uTG9hZGVkKCk6IHZvaWQge1xyXG5cdFx0Ly/mv4DmtLvlpKflsI/lm77mmKDlsITvvIzliqDovb3lsI/lm77nmoTml7blgJnvvIzlpoLmnpzlj5HnjrDlsI/lm77lnKjlpKflm77lkIjpm4bph4zpnaLvvIzliJnkvJjlhYjliqDovb3lpKflm77lkIjpm4bvvIzogIzkuI3mmK/lsI/lm75cclxuXHRcdC8vTGF5YS5BdGxhc0luZm9NYW5hZ2VyLmVuYWJsZShcImZpbGVjb25maWcuanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Db25maWdMb2FkZWQpKTtcclxuXHJcblx0XHRMYXlhLnN0YWdlLmFkZENoaWxkKCBuZXcgR2FtZUNsaWVudCgpICk7XHJcblx0fVxyXG5cclxuXHQvLyBvbkNvbmZpZ0xvYWRlZCgpOiB2b2lkIHtcclxuXHQvLyBcdC8v5Yqg6L29SURF5oyH5a6a55qE5Zy65pmvXHJcblx0Ly8gXHRHYW1lQ29uZmlnLnN0YXJ0U2NlbmUgJiYgTGF5YS5TY2VuZS5vcGVuKEdhbWVDb25maWcuc3RhcnRTY2VuZSk7XHJcblx0Ly8gfVxyXG59XHJcbi8v5r+A5rS75ZCv5Yqo57G7XHJcbm5ldyBNYWluKCk7XHJcbiIsImltcG9ydCBSZXNvdXJjZSBmcm9tIFwiLi9yZXNvdXJjZS9SZXNvdXJjZVwiO1xyXG5pbXBvcnQgTG9hZGVyRXZlbnQgZnJvbSBcIi4vZXZlbnQvTG9hZGVyRXZlbnRcIjtcclxuaW1wb3J0IEdyb3VwUmVzb3VyY2UgZnJvbSBcIi4vcmVzb3VyY2UvR3JvdXBSZXNvdXJjZVwiO1xyXG5cclxuLyoqXHJcbiAqIOWKoOi9vei1hOa6kOeuoeeQhlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZFNvdXJjZU1hbmFnZXIge1xyXG5cclxuICAgIC8qKuWKoOi9vei1hOa6kOeuoeeQhiAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9hZE1hcDpMYXlhLldlYWtPYmplY3QgPSBuZXcgTGF5YS5XZWFrT2JqZWN0KCk7XHJcbiAgICAvKirotYTmupDnu4TlrZflhbggKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGdyb3VwTWFwOkxheWEuV2Vha09iamVjdCA9IG5ldyBMYXlhLldlYWtPYmplY3QoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIneWni+WMllxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXQoKTp2b2lke1xyXG5cclxuICAgICAgICBFdmVudE1hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lciggTG9hZGVyRXZlbnQuTE9BRF9TSU5HTEVfQ09NUExFVEUgLCB0aGlzLmxvYWRTaW5nbGVDb21wbGV0ZSAsIHRoaXMgKTtcclxuICAgICAgICBFdmVudE1hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lciggTG9hZGVyRXZlbnQuTE9BRF9HUk9VUF9DT01QTEVURSAsIHRoaXMubG9hZEdyb3VwQ29tcGxldGUgLCB0aGlzICk7XHJcblxyXG4gICAgICAgIExheWEudGltZXIubG9vcCggMTAwMDAgLCB0aGlzICwgdGhpcy5jaGVja1JlcyApOy8v5qOA5rWL6LWE5rqQ5piv5ZCm5Zue5pS2LOaaguWumjEw56eS6ZKf5Zue5pS25LiA5qyhXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3ljZXkuKrotYTmupDlrozmiJBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9hZFNpbmdsZUNvbXBsZXRlKCBzb3VyY2U6c3RyaW5nfFJlc291cmNlICk6dm9pZHtcclxuXHJcbiAgICAgICAgbGV0IHJlczpSZXNvdXJjZSA9IHR5cGVvZiBzb3VyY2UgPT09IFwic3RyaW5nXCIgPyB0aGlzLmdldFJlcyggc291cmNlICkgOiBzb3VyY2U7XHJcbiAgICAgICAgaWYoIHJlcyAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIGxldCBncm91cFJlczpHcm91cFJlc291cmNlID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yKCBsZXQga2V5IGluIHRoaXMuZ3JvdXBNYXAgKXtcclxuICAgICAgICAgICAgICAgIGdyb3VwUmVzID0gdGhpcy5ncm91cE1hcC5nZXQoIGtleSApO1xyXG4gICAgICAgICAgICAgICAgaWYoIGdyb3VwUmVzICYmIGdyb3VwUmVzLmhhc1VybCggcmVzLnVybCApICYmIGdyb3VwUmVzLmlzTG9hZGVkKCkgKXtcclxuICAgICAgICAgICAgICAgICAgICBFdmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudCggTG9hZGVyRXZlbnQuTE9BRF9HUk9VUF9DT01QTEVURSAsIGdyb3VwUmVzICk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliqDovb3nu4TotYTmupDlrozmiJBcclxuICAgICAqIEBwYXJhbSBncm91cE5hbWUgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGxvYWRHcm91cENvbXBsZXRlKCBzb3VyY2U6c3RyaW5nIHwgR3JvdXBSZXNvdXJjZSApOnZvaWR7XHJcblxyXG4gICAgICAgIGxldCBncm91cFJlczpHcm91cFJlc291cmNlID0gdHlwZW9mIHNvdXJjZSA9PT0gXCJzdHJpbmdcIiA/ICA8R3JvdXBSZXNvdXJjZT50aGlzLmdldFJlcyggc291cmNlICkgOiBzb3VyY2U7XHJcbiAgICAgICAgaWYoIGdyb3VwUmVzICE9IG51bGwgKXtcclxuICAgICAgICAgICAgaWYoIGdyb3VwUmVzLmNvbXBsZXRlICE9IG51bGwgKXtcclxuICAgICAgICAgICAgICAgIGdyb3VwUmVzLmNvbXBsZXRlLnJ1bigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L2957uE6LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gZ3JvdXBOYW1lIOi1hOa6kOe7hOWQjeWtlyzluLjop4TkuI3luKbnrKblj7fnmoTlrZfnrKbkuLLvvIzlrZfmr40r5pWw57uEXHJcbiAgICAgKiBAcGFyYW0gdXJsbGlzdCDotYTmupDlnLDlnYDliJfooahcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsb2FkR3JvdXAoIGdyb3VwTmFtZTpzdHJpbmcgPSBcIlwiICwgdXJsbGlzdDpBcnJheTxzdHJpbmc+ICwgY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbCAsIHByb2dyZXNzOkxheWEuSGFuZGxlciA9IG51bGwgKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggIWdyb3VwTmFtZSApIHJldHVybjtcclxuICAgICAgICBsZXQgZ3JvdXBsaXN0OkFycmF5PFJlc291cmNlPiA9IHRoaXMubG9hZE1hcC5nZXQoIGdyb3VwTmFtZSApO1xyXG4gICAgICAgIGlmKCBncm91cGxpc3QgPT0gbnVsbCApe1xyXG4gICAgICAgICAgICBncm91cGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgaWYoIHVybGxpc3QgIT0gbnVsbCAmJiB1cmxsaXN0Lmxlbmd0aCA+IDAgKXtcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8dXJsbGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdXJsOnN0cmluZyA9IHVybGxpc3RbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlczpSZXNvdXJjZSA9IHRoaXMubG9hZE1hcC5nZXQoIHVybCApIHx8IFJlc291cmNlLmNyZWF0ZSggdXJsICk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBsaXN0LnB1c2goIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZE1hcC5zZXQoIHJlcy51cmwgLCByZXMgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGdyb3VwUmVzOkdyb3VwUmVzb3VyY2UgPSBSZXNvdXJjZS5jcmVhdGUoIGdyb3VwbGlzdCAsIGNvbXBsZXRlICwgcHJvZ3Jlc3MgICk7XHJcbiAgICAgICAgICAgIGdyb3VwUmVzLmxvYWQoKTtcclxuICAgICAgICAgICAgdGhpcy5ncm91cE1hcC5zZXQoIGdyb3VwTmFtZSAsIGdyb3VwUmVzICk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIExheWEuTG9nLnByaW50KCBcIuW3sue7j+acieivpei1hOa6kOe7hOS6hu+8gVwiICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L296LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gc291cmNlIOi1hOa6kFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvYWQoIHNvdXJjZTpzdHJpbmd8UmVzb3VyY2UgLCBjb21wbGV0ZTpMYXlhLkhhbmRsZXIgPSBudWxsICwgZXJyb3I6TGF5YS5IYW5kbGVyID0gbnVsbCAgKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggIXNvdXJjZSApe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCByZXM6UmVzb3VyY2UgPSBudWxsO1xyXG4gICAgICAgIGlmKCB0eXBlb2Ygc291cmNlID09PSBcInN0cmluZ1wiICl7XHJcbiAgICAgICAgICAgIHJlcyA9IHRoaXMubG9hZE1hcC5nZXQoIHNvdXJjZSApO1xyXG4gICAgICAgICAgICBpZiggcmVzICE9IG51bGwgKXtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXMgPSBSZXNvdXJjZS5jcmVhdGUoIHNvdXJjZSAsIGNvbXBsZXRlICwgZXJyb3IgKTtcclxuICAgICAgICB9ZWxzZSBpZiggc291cmNlIGluc3RhbmNlb2YgUmVzb3VyY2UgKXsgICAgICAgICAgICBcclxuICAgICAgICAgICAgcmVzID0gc291cmNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiggcmVzID09IG51bGwgKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggcmVzLmdldFJlcyhmYWxzZSkgIT0gbnVsbCApey8v6LWE5rqQ5bey5Yqg6L295a6M5oiQXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzLmxvYWQoKTtcclxuICAgICAgICB0aGlzLmxvYWRNYXAuc2V0KCByZXMudXJsICwgcmVzICk7XHJcbiAgICAgICAgbGV0IGlzQnJlYWs6Ym9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLmxvYWRNYXAgKXtcclxuICAgICAgICAgICAgcmVzID0gdGhpcy5sb2FkTWFwLmdldCgga2V5ICk7XHJcbiAgICAgICAgICAgIGlmKCByZXMgKXtcclxuICAgICAgICAgICAgICAgIGlzQnJlYWsgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIGlzQnJlYWsgKXtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5sb29wKCAxMDAwICwgdGhpcyAsIHRoaXMuY2hlY2tSZXMgKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5jbGVhciggdGhpcyAsIHRoaXMuY2hlY2tSZXMgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmo4DmtYvotYTmupDmmK/lkKblj6/lm57mlLZcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY2hlY2tSZXMoKTp2b2lke1xyXG5cclxuICAgICAgICBsZXQgcmVzOlJlc291cmNlO1xyXG4gICAgICAgIGZvciggbGV0IHVybCBpbiB0aGlzLmxvYWRNYXAgKXtcclxuICAgICAgICAgICAgcmVzID0gdGhpcy5sb2FkTWFwLmdldCggdXJsICk7XHJcbiAgICAgICAgICAgIGlmKCByZXMgJiYgcmVzLmNhbkdjKCkgKXtcclxuICAgICAgICAgICAgICAgIHJlcy5yZWNvdmVyKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRNYXAuZGVsKCB1cmwgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/mo4DmtYvnu4TotYTmupAgVE9ET1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W6LWE5rqQ5pWw5o2uXHJcbiAgICAgKiBAcGFyYW0gdXJsIOi1hOa6kOWcsOWdgCzmiJbogIXnu4TotYTmupDlkI1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSZXMoIHVybDpzdHJpbmcgKTpSZXNvdXJjZXxHcm91cFJlc291cmNle1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5sb2FkTWFwLmdldCggdXJsICkgfHwgdGhpcy5ncm91cE1hcC5nZXQoIHVybCApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W6LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gdXJsIOi1hOa6kOWcsOWdgFxyXG4gICAgICogQHBhcmFtIGlzQ291bnQg5piv5ZCm6K6h5pWwXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0U291cmNlKCB1cmw6c3RyaW5nICwgaXNDb3VudDpib29sZWFuID0gZmFsc2UgKTphbnl7XHJcblxyXG4gICAgICAgIGxldCByZXM6UmVzb3VyY2UgPSB0aGlzLmxvYWRNYXAuZ2V0KCB1cmwgKTtcclxuICAgICAgICByZXR1cm4gcmVzICYmIHJlcy5nZXRSZXMoIGlzQ291bnQgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHiuaUvui1hOa6kFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGRlc3Ryb3lSZXMoIHVybDpzdHJpbmcgKTp2b2lke1xyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDnuq/nsrnliqDovb3otYTmupDnrqHnkIZcclxuICovXHJcbmV4cG9ydCBjbGFzcyBMb2FkZXJNYW5hZ2Vye1xyXG5cclxuICAgIC8qKuWKoOi9vemYn+WIl+S4iumZkCAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBMT0FEX0xJTUlUOm51bWJlciA9IDU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlh4blpIfliqDovb3liJfooahcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZHlMb2FkTGlzdDpBcnJheTxSZXNvdXJjZT4gPSBbXTtcclxuXHJcbiAgICAvKirmraPlnKjliqDovb3nmoTliJfooaggKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGxvYWRpbmdMaXN0OkFycmF5PFJlc291cmNlPiA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yqg6L296LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gc291cmNlIOi1hOa6kOWcsOWdgOaIllJlc291cmNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9hZCggc291cmNlOnN0cmluZyB8IFJlc291cmNlICk6dm9pZHtcclxuXHJcbiAgICAgICAgbGV0IHJlczpSZXNvdXJjZSA9IHR5cGVvZiBzb3VyY2UgPT09IFwic3RyaW5nXCIgPyBMb2FkU291cmNlTWFuYWdlci5nZXRSZXMoIHNvdXJjZSApIDogc291cmNlO1xyXG4gICAgICAgIGlmKCByZXMgKXtcclxuICAgICAgICAgICAgaWYoIHRoaXMubG9hZGluZ0xpc3QubGVuZ3RoIDwgdGhpcy5MT0FEX0xJTUlUICl7XHJcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5sb2FkaW5nTGlzdC5pbmRleE9mKCByZXMgKSAhPSAtMSApe1xyXG4gICAgICAgICAgICAgICAgICAgIC8v6LWE5rqQ5q2j5Zyo5Yqg6L29XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkaW5nTGlzdC5wdXNoKCByZXMgKTtcclxuICAgICAgICAgICAgICAgIExheWEubG9hZGVyLmxvYWQoIHt1cmw6cmVzLnVybCx0eXBlOnJlcy50eXBlfSAsIExheWEuSGFuZGxlci5jcmVhdGUoIHRoaXMgLCB0aGlzLm9uTG9hZGVkICwgW3Jlc10gLCB0cnVlICApICAsIHJlcy5wcm9ncmVzcyAgKTtcclxuICAgICAgICAgICAgfWVsc2UgaWYoIHRoaXMucmVhZHlMb2FkTGlzdC5pbmRleE9mKCByZXMgKSA9PSAtMSApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeUxvYWRMaXN0LnB1c2goIHJlcyApO1xyXG4gICAgICAgICAgICAgICAgLy/ov5nph4zmoLnmja7kvJjlhYjnuqfmjpLluo9cclxuICAgICAgICAgICAgICAgIC8vIHRoaXMucmVhZHlMb2FkTGlzdCA9IHRoaXMucmVhZHlMb2FkTGlzdC5zb3J0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBvbkxvYWRlZCggcmVzOlJlc291cmNlICk6dm9pZHtcclxuXHJcbiAgICAgICAgcmVzLmxvYWRDb21wbGV0ZSgpO1xyXG4gICAgICAgIC8v5LuO5Yqg6L295YiX6KGo56e76ZmkXHJcbiAgICAgICAgbGV0IGluZGV4Om51bWJlciA9IHRoaXMubG9hZGluZ0xpc3QuaW5kZXhPZiggcmVzICk7XHJcbiAgICAgICAgaWYoIGluZGV4ICE9IC0xICl7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGluZ0xpc3Quc3BsaWNlKCBpbmRleCAsIDEgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgRXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQoIExvYWRlckV2ZW50LkxPQURfU0lOR0xFX0NPTVBMRVRFICwgcmVzICk7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZE5leHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBsb2FkTmV4dCgpOnZvaWR7XHJcblxyXG4gICAgICAgIGxldCByZXM6UmVzb3VyY2UgPSB0aGlzLnJlYWR5TG9hZExpc3Quc2hpZnQoKTtcclxuICAgICAgICBpZiggcmVzICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5sb2FkKCByZXMgKTtcclxuICAgICAgICB9XHJcbiAgICB9ICAgIFxyXG59IiwiLyoqXHJcbiAqIOWKoOi9veS6i+S7tlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZGVyRXZlbnQgIHtcclxuICAgIFxyXG4gICAgLyoq5Yqg6L295Y2V5Liq6LWE5rqQ5a6M5oiQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IExPQURfU0lOR0xFX0NPTVBMRVRFOnN0cmluZyA9IFwiTG9hZGVyRXZlbnQubG9hZFNpbmdsZUNvbXBsZXRlXCI7XHJcbiAgICAvKirliqDovb3nu4TotYTmupDlrozmiJAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTE9BRF9HUk9VUF9DT01QTEVURTpzdHJpbmcgPSBcIkxvYWRlckV2ZW50LmxvYWRHcm91cENvbXBsZXRlXCI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCAgKXtcclxuXHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IFJlc291cmNlIGZyb20gXCIuL1Jlc291cmNlXCI7XHJcbmltcG9ydCB7IExvYWRlck1hbmFnZXIgfSBmcm9tIFwiLi4vTG9hZFNvdXJjZU1hbmFnZXJcIjtcclxuXHJcbi8qKlxyXG4gKiDnu4TotYTmupBcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyb3VwUmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgS0VZOnN0cmluZyA9IFwiR3JvdXBSZXNvdXJjZVwiO1xyXG5cclxuICAgIHByaXZhdGUgX2xpc3Q6QXJyYXk8UmVzb3VyY2U+ID0gbnVsbDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSB7IFxyXG5cclxuICAgICAgICBzdXBlcigpOyBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlKCB1cmw6QXJyYXk8UmVzb3VyY2U+ID0gbnVsbCAsIGNvbXBsZXRlOkxheWEuSGFuZGxlciA9IG51bGwgLCBwcm9ncmVzczpMYXlhLkhhbmRsZXIgPSBudWxsICwgZXJyb3I6TGF5YS5IYW5kbGVyID0gbnVsbCAgKTp2b2lke1xyXG5cclxuICAgICAgICAvLyB0aGlzLnVybCA9IHVybDtcclxuICAgICAgICB0aGlzLl9saXN0ID0gdXJsO1xyXG4gICAgICAgIHRoaXMuX2NvbXBsZXRlID0gY29tcGxldGU7XHJcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3MgPSBwcm9ncmVzcztcclxuICAgICAgICB0aGlzLl9lcnJvciA9IGVycm9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb2FkKCk6dm9pZHtcclxuXHJcbiAgICAgICAgaWYoIHRoaXMuX2xpc3QgJiYgdGhpcy5fbGlzdC5sZW5ndGggPiAwICl7XHJcbiAgICAgICAgICAgIGxldCBpc0JyZWFrOmJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IHJlczpSZXNvdXJjZTtcclxuICAgICAgICAgICAgZm9yKCByZXMgb2YgdGhpcy5fbGlzdCApe1xyXG4gICAgICAgICAgICAgICAgaWYoIHJlcyAmJiByZXMuZ2V0UmVzKCBmYWxzZSApID09IG51bGwgKXtcclxuICAgICAgICAgICAgICAgICAgICBMb2FkZXJNYW5hZ2VyLmxvYWQoIHJlcy51cmwgKTtcclxuICAgICAgICAgICAgICAgICAgICBpZighaXNCcmVhayl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQnJlYWsgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZighaXNCcmVhayAmJiB0aGlzLl9jb21wbGV0ZSAhPSBudWxsICl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21wbGV0ZS5ydW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi1hOa6kOe7hOaYr+WQpuWKoOi9veWujOaIkFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaXNMb2FkZWQoKTpib29sZWFue1xyXG5cclxuICAgICAgICBpZiggdGhpcy5fbGlzdCAmJiB0aGlzLl9saXN0Lmxlbmd0aCA+IDAgKXtcclxuICAgICAgICAgICAgbGV0IHJlczpSZXNvdXJjZTtcclxuICAgICAgICAgICAgZm9yKCByZXMgb2YgdGhpcy5fbGlzdCApe1xyXG4gICAgICAgICAgICAgICAgaWYoIHJlcyAmJiByZXMuZ2V0UmVzKCBmYWxzZSApID09IG51bGwgKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmK/lkKbmnInlr7nlupTlnLDlnYDotYTmupBcclxuICAgICAqIEBwYXJhbSB1cmwg6LWE5rqQ5Zyw5Z2AXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBoYXNVcmwoIHVybDpzdHJpbmcgKTpib29sZWFue1xyXG5cclxuICAgICAgICBsZXQgcmVzOlJlc291cmNlO1xyXG4gICAgICAgIGZvciggcmVzIG9mIHRoaXMuX2xpc3QgKXtcclxuICAgICAgICAgICAgaWYoIHJlcyAmJiByZXMudXJsID09IHVybCApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6LWE5rqQ5piv5ZCm5bey5Yqg6L29XHJcbiAgICAgKiBAcGFyYW0gdXJsIOi1hOa6kOWcsOWdgFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaGFzTG9hZGVkKCB1cmw6c3RyaW5nICk6Ym9vbGVhbntcclxuXHJcbiAgICAgICAgbGV0IHJlczpSZXNvdXJjZTtcclxuICAgICAgICBmb3IoIHJlcyBvZiB0aGlzLl9saXN0ICl7XHJcbiAgICAgICAgICAgIGlmKCByZXMgJiYgcmVzLnVybCA9PSB1cmwgJiYgcmVzLmdldFJlcyggZmFsc2UgKSAhPSBudWxsICl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgTG9hZFV0aWxzIGZyb20gXCIuLi91dGlscy9Mb2FkVXRpbHNcIjtcclxuaW1wb3J0IFR4dFJlc291cmNlIGZyb20gXCIuL1R4dFJlc291cmNlXCI7XHJcbmltcG9ydCBHcm91cFJlc291cmNlIGZyb20gXCIuL0dyb3VwUmVzb3VyY2VcIjtcclxuaW1wb3J0IHsgTG9hZGVyTWFuYWdlciB9IGZyb20gXCIuLi9Mb2FkU291cmNlTWFuYWdlclwiO1xyXG5cclxuLyoqXHJcbiAqIOi1hOa6kOWfuuexu1xyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzb3VyY2UgaW1wbGVtZW50cyBJUmVzb3VyY2Uge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgS0VZOnN0cmluZyA9IFwiUmVzb3VyY2VcIjtcclxuXHJcbiAgICAvKirlm57mlLbpl7TpmpTml7bpl7TvvIzmr6vnp5IgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgR0NfR0FQVElNRTpudW1iZXIgPSAxMDAwMDtcclxuXHJcbiAgICAvKirlm77niYfotYTmupAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVFlQRV9JTUFHRTpzdHJpbmcgPSBcImltYWdlXCI7XHJcbiAgICAvKirmlofmnKzotYTmupAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVFBZRV9URVhUOnN0cmluZyA9IFwidGV4dFwiO1xyXG4gICAgLyoq5LqM6L+b5Yi26LWE5rqQICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRZUEVfQklOOnN0cmluZyA9IFwiYmluXCI7XHJcbiAgICAvKirnu4TotYTmupAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVFlQRV9HUk9VUDpzdHJpbmcgPSBcImdyb3VwXCI7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoIHVybDphbnkgLCBjb21wbGV0ZTpMYXlhLkhhbmRsZXIgPSBudWxsICwgcHJvZ3Jlc3M6TGF5YS5IYW5kbGVyID0gbnVsbCAsIGVycm9yOkxheWEuSGFuZGxlciA9IG51bGwgKTphbnl7XHJcblxyXG4gICAgICAgIGxldCByZXM6UmVzb3VyY2UgPSBudWxsO1xyXG4gICAgICAgIGxldCBleHQ6c3RyaW5nID0gTG9hZFV0aWxzLmdldEZpbGVFeHQoIHVybCApO1xyXG4gICAgICAgIGlmKCBleHQgPT0gXCJwbmdcIiB8fCBleHQgPT0gXCJqcGdcIiB8fCBleHQgPT0gXCJibXBcIiApe1xyXG4gICAgICAgICAgICByZXMgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q2xhc3MoIFJlc291cmNlLktFWSAsIFJlc291cmNlICk7XHJcbiAgICAgICAgICAgIHJlcy50eXBlID0gTGF5YS5Mb2FkZXIuSU1BR0U7XHJcbiAgICAgICAgfWVsc2UgaWYoIGV4dCA9PSBcInR4dFwiIHx8IGV4dCA9PSBcImpzb25cIiApe1xyXG4gICAgICAgICAgICByZXMgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q2xhc3MoIFR4dFJlc291cmNlLktFWSAsIFR4dFJlc291cmNlICk7XHJcbiAgICAgICAgICAgIHJlcy50eXBlID0gTGF5YS5Mb2FkZXIuVEVYVDtcclxuICAgICAgICB9ZWxzZSBpZiggdXJsIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgICAgICByZXMgPSBMYXlhLlBvb2wuZ2V0SXRlbUJ5Q2xhc3MoIEdyb3VwUmVzb3VyY2UuS0VZICwgR3JvdXBSZXNvdXJjZSApO1xyXG4gICAgICAgICAgICByZXMudHlwZSA9IFJlc291cmNlLlRZUEVfR1JPVVA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHJlcyl7XHJcbiAgICAgICAgICAgIHJlcy5jcmVhdGUoIHVybCAsIGNvbXBsZXRlICwgcHJvZ3Jlc3MgLCBlcnJvciApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Zue5pS26LWE5rqQXHJcbiAgICAgKiBAcGFyYW0gcmVzIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlY292ZXIoIHJlczpSZXNvdXJjZSApOnZvaWR7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoIHJlcyApe1xyXG4gICAgICAgICAgICByZXMuY2xlYXIoKTtcclxuICAgICAgICAgICAgTGF5YS5Qb29sLnJlY292ZXIoIHR5cGVvZiByZXMgLCByZXMgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIC8qKui1hOa6kOWQjeWtlyAqL1xyXG4gICAgcHVibGljIG5hbWU6c3RyaW5nID0gXCJcIjtcclxuICAgIC8qKuWKoOi9veWcsOWdgCAqL1xyXG4gICAgcHVibGljIHVybDpzdHJpbmcgPSBcIlwiO1xyXG4gICAgLyoq6LWE5rqQ57G75Z6LICovXHJcbiAgICBwdWJsaWMgdHlwZTpzdHJpbmcgPSBcIlwiO1xyXG4gICAgLyoq5LiL6L295LyY5YWI57qnICovXHJcbiAgICBwdWJsaWMgcHJpb3JpdHk6bnVtYmVyID0gMDtcclxuICAgIC8qKuWKoOi9veWujOaIkOS6i+S7tiAqL1xyXG4gICAgcHJvdGVjdGVkIF9jb21wbGV0ZTpMYXlhLkhhbmRsZXIgPSBudWxsO1xyXG4gICAgLyoq6L+b5bqm5LqL5Lu2ICovXHJcbiAgICBwcm90ZWN0ZWQgX3Byb2dyZXNzOkxheWEuSGFuZGxlciA9IG51bGw7XHJcbiAgICAvKirplJnor6/kuovku7YgKi9cclxuICAgIHByb3RlY3RlZCBfZXJyb3I6TGF5YS5IYW5kbGVyID0gbnVsbDtcclxuICAgIC8qKui1hOa6kOaVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIF9kYXRhOmFueSA9IG51bGw7XHJcbiAgICAvKirkvb/nlKjorqHmlbAgKi9cclxuICAgIHByb3RlY3RlZCBfdXNlQ291bnQ6bnVtYmVyID0gMDtcclxuICAgIC8qKuWbnuaUtuaXtumXtCAqL1xyXG4gICAgcHJvdGVjdGVkIF9nY1RpbWU6bnVtYmVyID0gMDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoIHVybDpzdHJpbmcgPSBcIlwiICwgY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbCAsIGVycm9yOkxheWEuSGFuZGxlciA9IG51bGwgKSB7IFxyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSggdXJsICwgY29tcGxldGUgLCBlcnJvciApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoIHVybDphbnkgPSBcIlwiICwgY29tcGxldGU6TGF5YS5IYW5kbGVyID0gbnVsbCAsIHByb2dyZXNzOkxheWEuSGFuZGxlciA9IG51bGwgLCBlcnJvcjpMYXlhLkhhbmRsZXIgPSBudWxsICApOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgICAgIHRoaXMuX2NvbXBsZXRlID0gY29tcGxldGU7XHJcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3MgPSBwcm9ncmVzcztcclxuICAgICAgICB0aGlzLl9lcnJvciA9IGVycm9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsb2FkKCk6dm9pZHtcclxuXHJcbiAgICAgICAgLy8gTGF5YS5sb2FkZXIubG9hZChbXHJcblx0XHQvLyBcdHsgdXJsOiBcInJlcy9mYWlydWkvY29tbW9uX2F0bGFzMC5wbmdcIiwgdHlwZTogTGF5YS5Mb2FkZXIuSU1BR0UgfSxcclxuXHRcdC8vIFx0eyB1cmw6IFwicmVzL2ZhaXJ1aS9jb21tb24ubWFwXCIsIHR5cGU6IExheWEuTG9hZGVyLkJVRkZFUiB9XHJcbiAgICAgICAgLy8gICAgIF0sIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkxvYWRlZCkpO1xyXG5cclxuICAgICAgICBMb2FkZXJNYW5hZ2VyLmxvYWQoIHRoaXMudXJsICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlY292ZXIoKTp2b2lke1xyXG5cclxuICAgICAgICBpZiggdGhpcy5fdXNlQ291bnQgPD0gMCApe1xyXG4gICAgICAgICAgICBSZXNvdXJjZS5yZWNvdmVyKCB0aGlzICk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGxvYWRDb21wbGV0ZSgpOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMuX2RhdGEgPSBMYXlhLmxvYWRlci5nZXRSZXMoIHRoaXMudXJsICk7XHJcbiAgICAgICAgdGhpcy5fdXNlQ291bnQgPSAwO1xyXG4gICAgICAgIGlmKCB0aGlzLl9jb21wbGV0ZSAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbXBsZXRlLnJ1bigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlui1hOa6kFxyXG4gICAgICogQHBhcmFtIGlzQ291bnQg5piv5ZCm6K6h5pWwXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRSZXMoIGlzQ291bnQ6Ym9vbGVhbiA9IHRydWUgKTphbnl7XHJcblxyXG4gICAgICAgIGlmKCBpc0NvdW50ICl7XHJcbiAgICAgICAgICAgIHRoaXMuX3VzZUNvdW50Kys7XHJcbiAgICAgICAgICAgIHRoaXMuX2djVGltZSA9IExheWEudGltZXIuY3VyckZyYW1lICsgUmVzb3VyY2UuR0NfR0FQVElNRTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHVzZUNvdW50KCk6bnVtYmVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fdXNlQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5piv5ZCm5Y+v5Zue5pS2ICovXHJcbiAgICBwdWJsaWMgY2FuR2MoKTpib29sZWFue1xyXG5cclxuICAgICAgICByZXR1cm4gTGF5YS50aW1lci5jdXJyRnJhbWUgPiB0aGlzLl9nY1RpbWUgJiYgdGhpcy5fdXNlQ291bnQgPD0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNMb2FkZWQoKTpib29sZWFue1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YSAhPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjaGVjaygpOnZvaWR7XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLmNhbkdjKCkgKXtcclxuICAgICAgICAgICAgdGhpcy5yZWNvdmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY29tcGxldGUoKTpMYXlhLkhhbmRsZXJ7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21wbGV0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHByb2dyZXNzKCk6TGF5YS5IYW5kbGVye1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3Jlc3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyKCk6dm9pZHtcclxuICAgICAgICBcclxuICAgICAgICBpZiggdGhpcy5fY29tcGxldGUgIT0gbnVsbCApe1xyXG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZS5yZWNvdmVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLl9wcm9ncmVzcyAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMuX3Byb2dyZXNzLnJlY292ZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoIHRoaXMuX2Vycm9yICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5fZXJyb3IucmVjb3ZlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb21wbGV0ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3MgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2Vycm9yID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9kYXRhID0gbnVsbDtcclxuICAgICAgICB0aGlzLnVybCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5fZ2NUaW1lID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcG9zZSgpOnZvaWR7XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLl91c2VDb3VudCA+IDAgKXtcclxuICAgICAgICAgICAgdGhpcy5fdXNlQ291bnQtLTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwiaW1wb3J0IFJlc291cmNlIGZyb20gXCIuL1Jlc291cmNlXCI7XHJcblxyXG4vKipcclxuICog5paH5pys6LWE5rqQXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUeHRSZXNvdXJjZSBleHRlbmRzIFJlc291cmNlIHsgICAgXHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgS0VZOnN0cmluZyA9IFwiVHh0UmVzb3VyY2VcIjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgXHJcbiAgICAgICAgc3VwZXIoKTsgXHJcbiAgICB9XHJcblxyXG5cclxufSIsIi8qKlxyXG4gKiDliqDovb3lt6XlhbdcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRVdGlsc3tcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflvpfmlofku7blkI7nvIDlkI1cclxuICAgICAqIEBwYXJhbSB1cmwg5paH5Lu26Lev5b6EXHJcbiAgICAgKiBAcmV0dXJuIDxiPlN0cmluZzwvYj4g5paH5Lu25ZCO57yA5ZCNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0RmlsZUV4dCh1cmw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgLy/liIfmjonot6/lvoTlkI7pnaLnmoTlj4LmlbBcclxuICAgICAgICBsZXQgZXh0OiBzdHJpbmcgPSB1cmwuaW5kZXhPZihcIj9cIikgPiAtMSA/IHVybC5zdWJzdHJpbmcoMCwgdXJsLmluZGV4T2YoXCI/XCIpKSA6IHVybDtcclxuICAgICAgICAvL+aIquWPluWQjue8gFxyXG4gICAgICAgIGxldCBsYXN0OiBzdHJpbmcgPSBleHQuc3Vic3RyaW5nKGV4dC5sYXN0SW5kZXhPZihcIi9cIikpO1xyXG4gICAgICAgIHJldHVybiBsYXN0Lmxhc3RJbmRleE9mKFwiLlwiKSA9PSAtMSA/IFwiXCIgOiBsYXN0LnN1YnN0cmluZyhsYXN0Lmxhc3RJbmRleE9mKFwiLlwiKSArIDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICog6LWE5rqQ5Zyw5Z2A566h55CG57G7XHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVcmxVdGlscyB7XHJcbiAgICBcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJFUzpzdHJpbmcgPSBcInJlcy9cIjtcclxuICAgIC8qKmZhaXJ5Z3Vp5Y+R5biD6LWE5rqQ55uu5b2VICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEZBSVJVSTpzdHJpbmcgPSBVcmxVdGlscy5SRVMgKyBcImZhaXJ1aS9cIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlmZhaXJ5Z3Vp6LWE5rqQ57uEXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRGYWlyeUdyb3VwKCBuYW1lOnN0cmluZyApOkFycmF5PHN0cmluZz57XHJcblxyXG4gICAgICAgIHJldHVybiBbIFVybFV0aWxzLkZBSVJVSSArIG5hbWUgKyBcIl9hdGxhczAucG5nXCIgLCBVcmxVdGlscy5GQUlSVUkgKyBuYW1lICsgXCIubWFwXCIgXTtcclxuICAgIH1cclxufSIsIi8qKlxyXG4gKiDpnaLmnb/ms6jlhowgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbFJlZ2lzdGVyIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5rOo5YaM57uE5Lu257G75LiOZmFpcnlndWnnvJbovpHlmajkuK3nsbvlr7nlupRcclxuICAgICAqIEBwYXJhbSBwa2dOYW1lIOWMheWQjVxyXG4gICAgICogQHBhcmFtIHJlc05hbWUg6LWE5rqQ5ZCNXHJcbiAgICAgKiBAcGFyYW0gY2xzXHQgIOWvueW6lOWMheS4reexu+WQjVx0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJDbGFzcyhwa2dOYW1lOiBzdHJpbmcsIHJlc05hbWU6IHN0cmluZywgY2xzOiBhbnkpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKHBrZ05hbWUgJiYgIWZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRCeUlkKHBrZ05hbWUpKSB7XHJcbiAgICAgICAgICAgIGZhaXJ5Z3VpLlVJUGFja2FnZS5hZGRQYWNrYWdlKHBrZ05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSBmYWlyeWd1aS5VSVBhY2thZ2UuZ2V0SXRlbVVSTChwa2dOYW1lLCByZXNOYW1lKTtcclxuICAgICAgICBmYWlyeWd1aS5VSU9iamVjdEZhY3Rvcnkuc2V0UGFja2FnZUl0ZW1FeHRlbnNpb24odXJsLCBjbHMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu66Ieq5a6a5LmJZmFpcnlndWnnu4Tku7bvvIzlv4XpobvnlKjmraTmlrnlvI8s5LiO5Lul5LiK5pa55rOV5a+55bqU5L2/55SoLOS4jeiDveebtOaOpeS9v+eUqG5ldyBjbHMoKeeahOaWueW8j+WIm+W7uuS4gOS4que7keWummZhaXJ5Z3Vp55qE57G777yBXHJcbiAgICAgKiBAcGFyYW0gcGtnTmFtZSDljIXlkI1cclxuICAgICAqIEBwYXJhbSByZXNOYW1lIOi1hOa6kOWQjVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUdPYmplY3QocGtnTmFtZTogc3RyaW5nLCByZXNOYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiBmYWlyeWd1aS5VSVBhY2thZ2UuY3JlYXRlT2JqZWN0RnJvbVVSTChmYWlyeWd1aS5VSVBhY2thZ2UuZ2V0SXRlbVVSTChwa2dOYW1lLCByZXNOYW1lKSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgUGFuZWxSZWdpc3RlciBmcm9tIFwiLi4vUGFuZWxSZWdpc3RlclwiO1xyXG5pbXBvcnQgRUJ1dHRvbiBmcm9tIFwiLi4vdmlldy9jb21wb25lbnQvRUJ1dHRvblwiO1xyXG5pbXBvcnQgQmFzZVNwcml0ZSBmcm9tIFwiLi4vdmlldy9jb21wb25lbnQvQmFzZVNwcml0ZVwiO1xyXG5cclxuLyoqXHJcbiAqIEZhaXJ5Z3Vp566h55CGXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGYWlyeVVJTWFuYWdlciB7XHJcblxyXG4gICAgLyoq6KOF6L29ICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBwYXJlbnQ6IExheWEuU3ByaXRlID0gbnVsbDtcclxuXHJcbiAgICAvKirkuLvnlYzpnaLlsYIgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbWFpbkxheWVyOiBCYXNlU3ByaXRlO1xyXG4gICAgLyoq55WM6Z2i5bGCICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHdpbmRvd0xheWVyOiBCYXNlU3ByaXRlO1xyXG4gICAgLyoqICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHByb21wdExheWVyOiBCYXNlU3ByaXRlO1xyXG4gICAgLyoq5by55qGG5bGCICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFsZXJ0TGF5ZXI6IEJhc2VTcHJpdGU7XHJcbiAgICAvKirpobblsYIgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdG9wTGF5ZXI6IEJhc2VTcHJpdGU7XHJcbiAgICAvKip0aXDlsYIgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdGlwTGF5ZXI6IEJhc2VTcHJpdGUgPSBudWxsO1xyXG4gICAgLyoq5byV5a+85bGCICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGd1aWRlTGF5ZXI6IEJhc2VTcHJpdGUgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXQoIGNvbnRhaW5lcjpMYXlhLlNwcml0ZSApOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYoICF0aGlzLnBhcmVudCApe1x0XHRcdFx0XHJcbiAgICAgICAgICAgIEZhaXJ5VUlNYW5hZ2VyLm1haW5MYXllciA9IG5ldyBCYXNlU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIEZhaXJ5VUlNYW5hZ2VyLndpbmRvd0xheWVyID0gbmV3IEJhc2VTcHJpdGUoKTtcclxuICAgICAgICAgICAgRmFpcnlVSU1hbmFnZXIucHJvbXB0TGF5ZXIgPSBuZXcgQmFzZVNwcml0ZSgpO1xyXG4gICAgICAgICAgICBGYWlyeVVJTWFuYWdlci50b3BMYXllciA9IG5ldyBCYXNlU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIEZhaXJ5VUlNYW5hZ2VyLmFsZXJ0TGF5ZXIgPSBuZXcgQmFzZVNwcml0ZSgpO1xyXG4gICAgICAgICAgICBGYWlyeVVJTWFuYWdlci50aXBMYXllciA9IG5ldyBCYXNlU3ByaXRlKCk7XHJcbiAgICAgICAgICAgIEZhaXJ5VUlNYW5hZ2VyLmd1aWRlTGF5ZXIgPSBuZXcgQmFzZVNwcml0ZSgpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVDaGlsZCggZmFpcnlndWkuR1Jvb3QuaW5zdC5kaXNwbGF5T2JqZWN0ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRhaW5lci5hZGRDaGlsZChmYWlyeWd1aS5HUm9vdC5pbnN0LmRpc3BsYXlPYmplY3QpO1xyXG4gICAgICAgIHRoaXMucGFyZW50ID0gY29udGFpbmVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoRmFpcnlVSU1hbmFnZXIubWFpbkxheWVyKTtcclxuICAgICAgICBmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKEZhaXJ5VUlNYW5hZ2VyLndpbmRvd0xheWVyKTtcclxuICAgICAgICBmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKEZhaXJ5VUlNYW5hZ2VyLnByb21wdExheWVyKTtcclxuICAgICAgICBmYWlyeWd1aS5HUm9vdC5pbnN0LmFkZENoaWxkKEZhaXJ5VUlNYW5hZ2VyLmFsZXJ0TGF5ZXIpO1xyXG4gICAgICAgIGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoRmFpcnlVSU1hbmFnZXIudG9wTGF5ZXIpO1x0XHRcdFxyXG4gICAgICAgIGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoRmFpcnlVSU1hbmFnZXIudGlwTGF5ZXIpO1xyXG4gICAgICAgIGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoRmFpcnlVSU1hbmFnZXIuZ3VpZGVMYXllcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEZhaXJ5VUlNYW5hZ2VyO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBGYWlyeVVJTWFuYWdlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlIHx8IG5ldyBGYWlyeVVJTWFuYWdlcigpO1xyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIEZhaXJ5R1VJ57q555CG6ZuG5aSE55CG5bel5YW357G7XHJcbiAqIEBhdXRob3IgY2wgMjAxOS4yLjIwXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRmFpcnlUZXh0dXJlVXRpbHMge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W6LWE5rqQ5Zyw5Z2AXHJcbiAgICAgKiBAcGFyYW0gcGtnTmFtZSAgIOWMheWQjVxyXG4gICAgICogQHBhcmFtIHJlc05hbWUgICDotYTmupDlkI1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRVcmwocGtnTmFtZTogc3RyaW5nLCByZXNOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICBsZXQgdXJsOiBzdHJpbmcgPSBmYWlyeWd1aS5VSVBhY2thZ2UuZ2V0SXRlbVVSTChwa2dOYW1lLCByZXNOYW1lKTtcclxuICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+WRmFpcnnotYTmupDljIXph4znmoTlm77niYfotYTmupBcclxuICAgICAqIEBwYXJhbSBwa2dOYW1lICAg5YyF5ZCNXHJcbiAgICAgKiBAcGFyYW0gcmVzTmFtZSAgIOi1hOa6kOWQjVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFRleHR1cmVCeShwa2dOYW1lOiBzdHJpbmcsIHJlc05hbWU6IHN0cmluZyk6IExheWEuVGV4dHVyZSB7XHJcblxyXG4gICAgICAgIGxldCB1cmw6IHN0cmluZyA9IGZhaXJ5Z3VpLlVJUGFja2FnZS5nZXRJdGVtVVJMKHBrZ05hbWUsIHJlc05hbWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFRleHR1cmUodXJsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOagueaNrkZhaXJ5Z3Vp55qEVVJM5Zyw5Z2A6I635Y+W5a+55bqU57q555CGXHJcbiAgICAgKiBAcGFyYW0gdWlVcmwgICAgIOWmgnVpOi8vcTRldmx3Y2pkbW9jMmlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRUZXh0dXJlKHVybDogc3RyaW5nKTogTGF5YS5UZXh0dXJlIHtcclxuXHJcbiAgICAgICAgbGV0IGl0ZW06IGZhaXJ5Z3VpLlBhY2thZ2VJdGVtID0gZmFpcnlndWkuVUlQYWNrYWdlLmdldEl0ZW1CeVVSTCh1cmwpO1xyXG4gICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGl0ZW0ubG9hZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbSA/IGl0ZW0udGV4dHVyZSA6IG51bGw7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQmFzZVNwcml0ZSBmcm9tIFwiLi4vdmlldy9jb21wb25lbnQvQmFzZVNwcml0ZVwiO1xyXG5pbXBvcnQgeyBFR0xpc3QgfSBmcm9tIFwiLi4vdmlldy9jb21wb25lbnQvRUdMaXN0XCI7XHJcblxyXG4vKipcclxuICogRmFpcnlHVUnlt6XlhbdcclxuICogQGF1dGhvciBjbCAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBjbGFzcyBGYWlyeVV0aWxzIHtcclxuXHJcblx0LyoqXHJcblx0ICAqIOWjsOaYjuWuueWZqOWvueW6lOWPmOmHj1xyXG5cdCAgKiBAcGFyYW0gcGFyZW50IFx0XHTlrrnlmahcclxuXHQgICogQHBhcmFtIHRoaXNPYmplY3QgXHR0aGlz5a+56LGhXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgc2V0VmFyKHBhcmVudDogZmFpcnlndWkuR0NvbXBvbmVudCwgdGhpc09iamVjdDogYW55KTogdm9pZCB7XHJcblxyXG5cdFx0aWYgKHBhcmVudCAhPSBudWxsICYmIHRoaXNPYmplY3QgIT0gbnVsbCkge1xyXG5cdFx0XHRsZXQgZGlzT2JqOiBmYWlyeWd1aS5HT2JqZWN0O1xyXG5cdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgcGFyZW50Lm51bUNoaWxkcmVuOyBpKyspIHsgLy9vYmplY3RzXHJcblx0XHRcdFx0ZGlzT2JqID0gcGFyZW50LmdldENoaWxkQXQoaSk7XHJcblx0XHRcdFx0aWYgKGRpc09iai5uYW1lID09IFwiaWNvblwiIHx8IGRpc09iai5uYW1lID09IFwidGl0bGVcIikge1xyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChkaXNPYmoubmFtZSAmJiBkaXNPYmoubmFtZS5pbmRleE9mKFwidGFiX1wiKSA9PSAwICYmIGRpc09iaiBpbnN0YW5jZW9mIGZhaXJ5Z3VpLkdHcm91cCkge1xyXG5cdFx0XHRcdFx0Ly8gdGhpc09iamVjdFtkaXNPYmoubmFtZV0gPSBuZXcgZmFpcnVpLkVUYWIoZGlzT2JqLCB0aGlzT2JqZWN0KTtcclxuXHRcdFx0XHRcdC8vIGlmICh0aGlzT2JqZWN0IGluc3RhbmNlb2YgQmFzZVNwcml0ZSkgdGhpc09iamVjdC5hZGRDb21wb25lbnQodGhpc09iamVjdFtkaXNPYmoubmFtZV0pO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZGlzT2JqLm5hbWUgJiYgZGlzT2JqLm5hbWUuaW5kZXhPZihcImVnbGlzdF9cIikgPT0gMCAmJiBkaXNPYmogaW5zdGFuY2VvZiBmYWlyeWd1aS5HTGlzdCkge1xyXG5cdFx0XHRcdFx0dGhpc09iamVjdFtkaXNPYmoubmFtZV0gPSBuZXcgRUdMaXN0KGRpc09iaiwgdGhpc09iamVjdCk7XHJcblx0XHRcdFx0XHRpZiAodGhpc09iamVjdCBpbnN0YW5jZW9mIEJhc2VTcHJpdGUpIHRoaXNPYmplY3QuYWRkQ29tcG9uZW50KHRoaXNPYmplY3RbZGlzT2JqLm5hbWVdKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpc09iamVjdFtkaXNPYmoubmFtZV0gPSBkaXNPYmo7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgcGFyZW50Ll90cmFuc2l0aW9ucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGxldCB0cmFuc09iajogZmFpcnlndWkuVHJhbnNpdGlvbjtcclxuXHRcdFx0XHR0cmFuc09iaiA9IHBhcmVudC5fdHJhbnNpdGlvbnNbaV07XHJcblx0XHRcdFx0dGhpc09iamVjdFt0cmFuc09iai5uYW1lXSA9IHRyYW5zT2JqO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59IiwiaW1wb3J0IEJhc2VTcHJpdGUgZnJvbSBcIi4vY29tcG9uZW50L0Jhc2VTcHJpdGVcIjtcblxuLyoqXG4gICogVUnmmL7npLrku6PnkIbnsbtcbiAgKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxuICAqL1xuZXhwb3J0IGNsYXNzIFVJQ29tcG9uZW50IGV4dGVuZHMgQmFzZVNwcml0ZSB7XG5cblx0Lyoq5piv5ZCm5omT5byA6L+H55WM6Z2iICovXG5cdHByb3RlY3RlZCBpc09wZW5lZDogYm9vbGVhbiA9IGZhbHNlO1xuXHQvKirmmK/lkKbliJ3lp4vljJbmiafooYznu5PmnZ8gKi9cblx0cHJvdGVjdGVkIGlzQ29tcGx5ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblx0Lyoq5Y+C5pWwICovXG5cdHB1YmxpYyBwYXJhbTogYW55O1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcblxuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgY29uc3RydWN0RnJvbVhNTCh4bWw6IGFueSk6IHZvaWQge1xuXG5cdFx0c3VwZXIuY29uc3RydWN0RnJvbVhNTCh4bWwpO1xuXG5cdFx0dGhpcy5pbml0KG51bGwpO1xuXHR9XG5cblx0cHVibGljIGlzSW5pdGVkKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiAhdGhpcy5pc0NvbXBseWVkO1xuXHR9XG5cblx0cHVibGljIGluaXRDb21wbGV0ZSgpOiBib29sZWFuIHtcblxuXHRcdC8v5qOA5rWL5Yid5aeL5YyW5piv5ZCm5a6M5oiQXG5cdFx0aWYgKCF0aGlzLmlzSW5pdGVkKCkpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuaXNPcGVuZWQpIHtcblx0XHRcdHRoaXMuaXNPcGVuZWQgPSB0cnVlO1xuXHRcdFx0dGhpcy5pbml0VUkoKTtcblx0XHR9XG5cblx0XHR0aGlzLmluaXREYXRhKHRoaXMucGFyYW0pO1xuXHRcdHRoaXMuYWRkQWxsTGlzdGVuZXIoKTtcblxuXHRcdHRoaXMuaXNDb21wbHllZCA9IHRydWU7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICAqIOWklumDqOS4jeimgeiwg+eUqFxuXHQgICovXG5cdHB1YmxpYyBpbml0KHBhcmFtOiBhbnkpOiB2b2lkIHtcblx0XHR0aGlzLnBhcmFtID0gcGFyYW07XG5cdFx0dGhpcy5pbml0Q29tcGxldGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgICog5Yid5aeL5YyWVUnnlYzpnaJcblx0ICAqL1xuXHRwdWJsaWMgaW5pdFVJKCk6IHZvaWQge1xuXG5cdH1cblxuXHQvKipcblx0ICAqIOWIneWni+WMluWPguaVsFxuXHQgICovXG5cdHB1YmxpYyBpbml0RGF0YShwYXJhbTogYW55ID0gbnVsbCk6IHZvaWQge1xuXG5cdH1cblxuXHQvKipcblx0ICAqIOWFs+mXreeVjOmdouaXtuiwg+eUqFxuXHQgICovXG5cdHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcblxuXHRcdHN1cGVyLmNsZWFyKCk7XG5cblx0XHR0aGlzLnBhcmFtID0gbnVsbDtcblx0XHR0aGlzLmlzQ29tcGx5ZWQgPSBmYWxzZTtcblx0fVxuXG5cdHB1YmxpYyBkaXNwb3NlKCk6IHZvaWQge1xuXG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xuXG5cdFx0dGhpcy5wYXJhbSA9IG51bGw7XG5cdH1cbn0iLCIvKipcclxuICog5Z+65LqOZmFpcnlndWkuR0J1dHRvbueahOWfuuexu+aMiemSrlxyXG4gKiBAYXV0aG9yIGNsb25nIDIwMTkuNS4xOFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUJ1dHRvbiBleHRlbmRzIGZhaXJ5Z3VpLkdCdXR0b24ge1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgXHJcbiAgICAgICAgc3VwZXIoKTsgXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBGYWlyeVV0aWxzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL0ZhaXJ5VXRpbHNcIjtcclxuaW1wb3J0IEdsb2JhbCBmcm9tIFwiLi4vLi4vLi4vR2xvYmFsXCI7XHJcblxyXG4vKipcclxuICogZmFpcnlndWnljp/ku7bln7rnsbtcclxuICogQGF1dGhvciBjbG9uZyAyMDE5LjUuMThcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VTcHJpdGUgZXh0ZW5kcyBmYWlyeWd1aS5HQ29tcG9uZW50IGltcGxlbWVudHMgSUNvbXBvbmVudHtcclxuXHJcbiAgICAvKirmlbDmja4gKi9cclxuICAgIHByb3RlY3RlZCBfZGF0YTogYW55ID0gbnVsbDtcclxuICAgIC8qKuaYr+WQpuWPmOeBsCAqL1xyXG4gICAgcHJvdGVjdGVkIF9pc0dyYXk6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIC8qKlxyXG4gICAgICog55So5Lyg5YWl55qEZmFpcnl1aS5HQ29tcG9uZW506L2s5YyW5Li6QmFzZVNwcml0ZVxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgb3dlcjogZmFpcnlndWkuR0NvbXBvbmVudCA9IG51bGw7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9pY29uTG9hZGVyOmZhaXJ5Z3VpLkdMb2FkZXI7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jdXJyZW50U3RhdGU6c3RyaW5nID0gXCJcIjtcclxuXHJcblx0cHJvdGVjdGVkIF9idXR0b25Db250cm9sbGVyOmZhaXJ5Z3VpLkNvbnRyb2xsZXI7XHJcblxyXG4gICAgLy/kuovku7bnvJPlrZjmsaBcclxuICAgIHByb3RlY3RlZCBtX2V2ZW50UG9vbDogRXZlbnRQb29sID0gbnVsbDtcclxuICAgIC8v57uE5Lu257yT5a2Y5rGgXHJcblx0cHJvdGVjdGVkIG1fY29tcG9uZW50RGljOiBMYXlhLldlYWtPYmplY3QgPSBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGNvbXA6IGZhaXJ5Z3VpLkdDb21wb25lbnQgPSBudWxsKSB7XHJcblxyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMub3dlciA9IGNvbXA7XHJcblxyXG4gICAgICAgIHRoaXMubV9ldmVudFBvb2wgPSBFdmVudFBvb2wuY3JlYXRlKCk7XHJcbiAgICAgICAgdGhpcy5tX2NvbXBvbmVudERpYyA9IG5ldyBMYXlhLldlYWtPYmplY3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0RnJvbVhNTCh4bWw6IGFueSk6IHZvaWQge1xyXG5cclxuICAgICAgICBzdXBlci5jb25zdHJ1Y3RGcm9tWE1MKHhtbCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdENvbnRyb2xsZXIoKTtcclxuICAgICAgICBcclxuICAgICAgICBGYWlyeVV0aWxzLnNldFZhcih0aGlzLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirliJ3lp4vljJbmjqfliLblmaggKi9cclxuICAgIHByb3RlY3RlZCBpbml0Q29udHJvbGxlcigpOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMuX2J1dHRvbkNvbnRyb2xsZXIgPSB0aGlzLmdldENvbnRyb2xsZXIoXCJidXR0b25cIik7XHJcbiAgICAgICAgdGhpcy5faWNvbkxvYWRlciA9IDxmYWlyeWd1aS5HTG9hZGVyPnRoaXMuZ2V0Q2hpbGQoXCJpY29uXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgY3VycmVudFN0YXRlKHZhbHVlOiBzdHJpbmcpIHtcclxuXHRcdFx0XHJcbiAgICAgICAgdGhpcy5fY3VycmVudFN0YXRlID0gdmFsdWU7XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLl9idXR0b25Db250cm9sbGVyICl7XHJcbiAgICAgICAgICAgIHRoaXMuX2J1dHRvbkNvbnRyb2xsZXIuc2VsZWN0ZWRQYWdlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoq5b2T5YmN54q25oCBICovXHJcbiAgICBwdWJsaWMgZ2V0IGN1cnJlbnRTdGF0ZSgpOiBzdHJpbmcge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFN0YXRlO1xyXG4gICAgfVx0XHRcclxuXHJcbiAgICAvKipcclxuICAgICAqIOaYr+WQpuWMheWQq+WFqOWxgOWdkOagh+eCuVxyXG4gICAgICogQHBhcmFtIGd4IOWFqOWxgFjlnZDmoIdcclxuICAgICAqIEBwYXJhbSBneSDlhajlsYBZ5Z2Q5qCHXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb250YWluc0dsb2JhbFBvaW50KGd4OiBudW1iZXIsIGd5OiBudW1iZXIpOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgbGV0IGxwOiBMYXlhLlBvaW50ID0gdGhpcy5nbG9iYWxUb0xvY2FsKGd4LCBneSk7XHJcbiAgICAgICAgbGV0IGJvdW5kczogTGF5YS5SZWN0YW5nbGUgPSBuZXcgTGF5YS5SZWN0YW5nbGUoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgIHJldHVybiBib3VuZHMuY29udGFpbnMobHAueCwgbHAueSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZENoaWxkKGNoaWxkOiBmYWlyeWd1aS5HT2JqZWN0KTogZmFpcnlndWkuR09iamVjdCB7XHJcblxyXG4gICAgICAgIGlmICggR2xvYmFsLmlzKCBjaGlsZCAsIFwiSUNvbXBvbmVudFwiICkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KDxhbnk+Y2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3VwZXIuYWRkQ2hpbGQoY2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDaGlsZEF0KGNoaWxkOiBmYWlyeWd1aS5HT2JqZWN0LCBpbmRleDogbnVtYmVyKTogZmFpcnlndWkuR09iamVjdCB7XHJcblxyXG4gICAgICAgIGlmICggR2xvYmFsLmlzKCBjaGlsZCAsIFwiSUNvbXBvbmVudFwiICkgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KDxhbnk+Y2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3VwZXIuYWRkQ2hpbGRBdChjaGlsZCwgaW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5p2h55uuXHJcbiAgICAgKiBAcGFyYW0gbmFtZSDnu4Tku7blkI3lrZdcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEVsZW1lbnQobmFtZTogc3RyaW5nLCBjb250YWluZXI6IGZhaXJ5Z3VpLkdDb21wb25lbnQgPSBudWxsKTogYW55IHtcclxuXHJcbiAgICAgICAgY29udGFpbmVyID0gY29udGFpbmVyIHx8IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lci5nZXRDaGlsZChuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaYr+WQpuWMheWQq+afkOS4quWvueixoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29udGFpbnMoY2hpbGQ6IGZhaXJ5Z3VpLkdPYmplY3QpOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2hpbGRJbmRleChjaGlsZCkgIT0gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqBMYXlh5Y6f55Sf5YWD5Lu2XHJcbiAgICAgKiBAcGFyYW0gY2hpbGQgTGF5YeWOn+eUn+aYvuekuuWvueixoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkRWdyZXRDaGlsZChjaGlsZDogTGF5YS5Ob2RlKTogdm9pZCB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hZGRDaGlsZChjaGlsZCk7XHJcbiAgICB9XHJcbiAgICAvKirmt7vliqBMYXlh5Y6f55Sf5YWD5Lu2XHJcbiAgICAgKiBAcGFyYW0gY2hpbGQgTGF5YeWOn+eUn+aYvuekuuWvueixoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkRWdyZXRDaGlsZEF0KGNoaWxkOiBMYXlhLk5vZGUsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9jb250YWluZXIuYWRkQ2hpbGRBdChjaGlsZCwgaW5kZXgpOyAgICAgICAgXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpExheWHljp/nlJ/lhYPku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUVncmV0Q2hpbGQoY2hpbGQ6IExheWEuTm9kZSk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAoY2hpbGQgJiYgdGhpcy5fY29udGFpbmVyLmNvbnRhaW5zKGNoaWxkKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIucmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY2hpbGQgJiYgY2hpbGQucGFyZW50ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY2hpbGQucGFyZW50LnJlbW92ZUNoaWxkKGNoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB0b3VjaEVuYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLm1vdXNlRW5hYmxlZCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdG91Y2hFbmFibGVkKCk6IGJvb2xlYW4ge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGFpbmVyLm1vdXNlRW5hYmxlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHRvdWNoQ2hpbGRyZW4odmFsdWU6IGJvb2xlYW4pIHtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLm1vdXNlVGhyb3VnaCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdG91Y2hDaGlsZHJlbigpOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lci5tb3VzZVRocm91Z2g7XHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgcHVibGljIGFkZEV2ZW50TGlzdGVuZXIoIHR5cGU6c3RyaW5nICwgbGlzdGVuZXI6RnVuY3Rpb24gLCB0aGlzT2JqZWN0OmFueSAsIGFyZ3M6QXJyYXk8YW55PiA9IG51bGwgKTp2b2lke1xyXG5cclxuICAgICAgICB0aGlzLm9uKCB0eXBlICwgdGhpc09iamVjdCAsIGxpc3RlbmVyICwgYXJncyApXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGU6c3RyaW5nICwgbGlzdGVuZXI6RnVuY3Rpb24gLCB0aGlzT2JqZWN0OmFueSApOnZvaWR7XHJcblxyXG4gICAgICAgIHRoaXMub2ZmKCB0eXBlICwgdGhpc09iamVjdCAsIGxpc3RlbmVyICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlop7liqDnm5HlkKzkuovku7blh73mlbBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEFsbExpc3RlbmVyKCk6dm9pZCB7XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLm1fZXZlbnRQb29sICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5tX2V2ZW50UG9vbC5yZWxpc3RlbmVyQWxsKCk7XHJcbiAgICAgICAgICAgIGZvciggbGV0IGtleSBpbiB0aGlzLm1fY29tcG9uZW50RGljICl7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGF0YTphbnkgPSB0aGlzLm1fY29tcG9uZW50RGljLmdldCgga2V5ICk7XHJcbiAgICAgICAgICAgICAgICBpZiggR2xvYmFsLmlzKCBkYXRhICwgXCJJQ29tcG9uZW50XCIgKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgKDxJQ29tcG9uZW50PmRhdGEpLmFkZEFsbExpc3RlbmVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHRcdFx0XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTnm5HlkKzkuovku7blh73mlbBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUFsbExpc3RlbmVyKCk6dm9pZCB7XHJcblxyXG4gICAgICAgIGlmKCB0aGlzLm1fZXZlbnRQb29sICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5tX2V2ZW50UG9vbC5yZW1vdmVBbGxMaXN0ZW5lcigpO1xyXG4gICAgICAgICAgICBmb3IoIGxldCBrZXkgaW4gdGhpcy5tX2NvbXBvbmVudERpYyApe1xyXG4gICAgICAgICAgICAgICAgbGV0IGRhdGE6YW55ID0gdGhpcy5tX2NvbXBvbmVudERpYy5nZXQoIGtleSApO1xyXG4gICAgICAgICAgICAgICAgaWYoIEdsb2JhbC5pcyggZGF0YSAsIFwiSUNvbXBvbmVudFwiICkpe1xyXG4gICAgICAgICAgICAgICAgICAgICg8SUNvbXBvbmVudD5kYXRhKS5yZW1vdmVBbGxMaXN0ZW5lcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVx0XHRcdFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg5LqL5Lu255uR5ZCsXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRHYW1lTGlzdGVuZXIodHlwZTogc3RyaW5nLCBsaXN0ZW5lcjogRnVuY3Rpb24sIHRoaXNPYmplY3Q6IGFueSAsIHRhcmdldD86IGFueSkge1xyXG4gICAgICAgIGlmKCB0aGlzLm1fZXZlbnRQb29sICE9IG51bGwgKXtcclxuICAgICAgICAgICAgdGhpcy5tX2V2ZW50UG9vbC5hZGRMaXN0ZW5lciggdHlwZSAsIGxpc3RlbmVyICwgdGFyZ2V0ICwgdGhpc09iamVjdCApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOS6i+S7tuebkeWQrFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlR2FtZUxpc3RlbmVyKHR5cGU6IHN0cmluZywgbGlzdGVuZXI6IEZ1bmN0aW9uLCB0aGlzT2JqZWN0OiBhbnkgLCB0YXJnZXQ/OiBhbnkpIHtcclxuICAgICAgICBpZiggdGhpcy5tX2V2ZW50UG9vbCAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIHRoaXMubV9ldmVudFBvb2wucmVtb3ZlTGlzdGVuZXIoIHR5cGUgLCBsaXN0ZW5lciAsIHRhcmdldCAsIHRoaXNPYmplY3QgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDnu4Tku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZENvbXBvbmVudChjb21wb25lbnQ6IElDb21wb25lbnQpOiBhbnkge1xyXG5cclxuICAgICAgICBpZiggY29tcG9uZW50ICl7XHJcbiAgICAgICAgICAgIGxldCBoYXNoQ29kZTpudW1iZXIgPSBjb21wb25lbnQuZ2V0SGFzaENvZGUoKTtcclxuICAgICAgICAgICAgdGhpcy5tX2NvbXBvbmVudERpYy5zZXQoIGhhc2hDb2RlICwgY29tcG9uZW50ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb21wb25lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTnu4Tku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUNvbXBvbmVudChjb21wb25lbnQ6IElDb21wb25lbnQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYoIGNvbXBvbmVudCAhPSBudWxsICl7XHJcbiAgICAgICAgICAgIGxldCBoYXNoQ29kZTpudW1iZXIgPSBjb21wb25lbnQuZ2V0SGFzaENvZGUoKTtcclxuICAgICAgICAgICAgdGhpcy5tX2NvbXBvbmVudERpYy5kZWwoIGhhc2hDb2RlICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOaJgOaciee7hOS7tlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQWxsQ29tcG9uZW50KCk6dm9pZHtcclxuXHJcbiAgICAgICAgZm9yKGxldCBrZXkgaW4gdGhpcy5tX2NvbXBvbmVudERpYyApe1xyXG4gICAgICAgICAgICB0aGlzLm1fY29tcG9uZW50RGljLmRlbCgga2V5ICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHRoaXMubV9jb21wb25lbnREaWMucmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHjee9rueVjOmdolxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm1fZXZlbnRQb29sICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5tX2V2ZW50UG9vbC5yZW1vdmVBbGxMaXN0ZW5lcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IoIGxldCBrZXkgaW4gdGhpcy5tX2NvbXBvbmVudERpYyApe1xyXG4gICAgICAgICAgICBsZXQgZGF0YTphbnkgPSB0aGlzLm1fY29tcG9uZW50RGljLmdldCgga2V5ICk7XHJcbiAgICAgICAgICAgIGlmKCBHbG9iYWwuaXMoIGRhdGEgLCBcIklDb21wb25lbnRcIiApICl7XHJcbiAgICAgICAgICAgICAgICAoPElDb21wb25lbnQ+ZGF0YSkuY2xlYXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZGVzdHJveUNvbXBvbmVudCgpOiB2b2lkIHtcclxuICAgICAgICBmb3IoIGxldCBrZXkgaW4gdGhpcy5tX2NvbXBvbmVudERpYyApe1xyXG4gICAgICAgICAgICBsZXQgZGF0YTphbnkgPSB0aGlzLm1fY29tcG9uZW50RGljLmdldCgga2V5ICk7XHJcbiAgICAgICAgICAgIGlmKCBHbG9iYWwuaXMoIGRhdGEgLCBcIklDb21wb25lbnRcIiApICl7XHJcbiAgICAgICAgICAgICAgICAoPElDb21wb25lbnQ+ZGF0YSkuZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5ZSv5LiAaGFzaENvZGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEhhc2hDb2RlKCk6IG51bWJlciB7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzW1wiJF9HSURcIl0gPSB0aGlzW1wiJF9HSURcIl0gfHwgTGF5YS5VdGlscy5nZXRHSUQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzRGlzcG9zZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbXCJfZGlzcG9zZWRcIl07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDph4rmlL7miYDmnInotYTmupBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRpc3Bvc2UoKTp2b2lke1xyXG5cclxuICAgICAgICBpZiAodGhpc1tcIl9kaXNwb3NlZFwiXSl7IC8vZmFpcnlndWkg5Lit55qE56eB5pyJ5bGe5oCnXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1cGVyLmRpc3Bvc2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5tX2V2ZW50UG9vbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1fZXZlbnRQb29sLmRpc3Bvc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tX2NvbXBvbmVudERpYyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5tX2V2ZW50UG9vbCA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBCYXNlQnV0dG9uIGZyb20gXCIuL0Jhc2VCdXR0b25cIjtcclxuLyoqXHJcbiAqIOWwgeijhWZhaXJ5Z3Vp5oyJ6ZKuXHJcbiAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFQnV0dG9uIGV4dGVuZHMgQmFzZUJ1dHRvbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxufSIsImltcG9ydCBCYXNlU3ByaXRlIGZyb20gXCIuL0Jhc2VTcHJpdGVcIjtcclxuaW1wb3J0IEVCdXR0b24gZnJvbSBcIi4vRUJ1dHRvblwiO1xyXG5pbXBvcnQgR2xvYmFsIGZyb20gXCIuLi8uLi8uLi9HbG9iYWxcIjtcclxuaW1wb3J0IHsgVUlFTGlzdFJlbmRlckl0ZW0gfSBmcm9tIFwiLi9VSUVMaXN0UmVuZGVySXRlbVwiO1xyXG5pbXBvcnQgQmFzZUJ1dHRvbiBmcm9tIFwiLi9CYXNlQnV0dG9uXCI7XHJcbmltcG9ydCB7IEZhaXJ5VGV4dHVyZVV0aWxzIH0gZnJvbSBcIi4uLy4uL3V0aWxzL0ZhaXJ5VGV4dHVyZVV0aWxzXCI7XHJcblxyXG5cclxuLyoqXHJcbiAgKiDlsIHoo4VGYWlyeUd1aeWIl+ihqCzpnIDnvJbovpHlmajkuK1mYWlyeWd1aS5HTGlzdOWRveWQjeS4umVnbGlzdF/lvIDlpLRcclxuICAqIEBhdXRob3IgY2xvbmcgMjAxOS41LjE4XHJcbiAgKi9cclxuZXhwb3J0IGNsYXNzIEVHTGlzdCBleHRlbmRzIEJhc2VTcHJpdGUge1xyXG5cclxuXHRwcm90ZWN0ZWQgbGlzdDogZmFpcnlndWkuR0xpc3Q7XHJcblx0cHJvdGVjdGVkIF9hcnJheTogQXJyYXk8YW55PjtcclxuXHRwcm90ZWN0ZWQgX3RoaXNPYmplY3Q6IGFueTtcclxuXHRwcm90ZWN0ZWQgX2l0ZW1SZW5kZXJlcjogTGF5YS5IYW5kbGVyID0gbnVsbDtcclxuXHRwcm90ZWN0ZWQgX2NsaWNrSGFuZGxlcjogRnVuY3Rpb24gPSBudWxsOy8v54K55Ye75LqL5Lu2XHJcblx0cHJvdGVjdGVkIF9zZWxlY3RlZFBhZ2U6IEZ1bmN0aW9uID0gbnVsbDsvL+WIhumhtemAieS4reafkOS4gOmhteinpuWPkeeahOS6i+S7tlxyXG5cdHByb3RlY3RlZCBfZWxlbWVudHM6IEFycmF5PGZhaXJ5Z3VpLkdPYmplY3Q+ID0gbnVsbDtcclxuXHRwcm90ZWN0ZWQgX2xhc3RjbGlja0l0ZW06IGZhaXJ5Z3VpLkdPYmplY3QgPSBudWxsO1xyXG5cdHByaXZhdGUgX2lzU2hvd0RvU3BlY2lhbEVmZmVjdDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHQvKirliIbpobXnu4Tku7YgKi9cclxuXHRwcm90ZWN0ZWQgY3VycmVudHBhZ2U6IG51bWJlciA9IDA7XHJcblx0cHJvdGVjdGVkIGlzRmlyc3Q6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHQvKirlkJHlt6bmjInpkq4gKi9cclxuXHRwcm90ZWN0ZWQgX2J0bl9sZWZ0OiBFQnV0dG9uIHwgZmFpcnlndWkuR0J1dHRvbjtcclxuXHQvKirlkJHlj7PmjInpkq4gKi9cclxuXHRwcm90ZWN0ZWQgX2J0bl9yaWdodDogRUJ1dHRvbiB8IGZhaXJ5Z3VpLkdCdXR0b247XHJcblxyXG5cdC8qKuaYr+WQpuiHquWKqOa7keWKqOWIsOW6lemDqCAqL1xyXG5cdHB1YmxpYyBpc0F1dG9Cb3R0b206IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0cHVibGljIGNvbnN0cnVjdG9yKGxpc3Q6IGZhaXJ5Z3VpLkdMaXN0LCB0aGlzT2JqZWN0OiBhbnkgPSBudWxsKSB7XHJcblx0XHRzdXBlcigpO1xyXG5cdFx0dGhpcy5saXN0ID0gbGlzdDtcclxuXHRcdGlmICh0aGlzLmxpc3QgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLmNhbGxiYWNrVGhpc09iaiA9IHRoaXNPYmplY3QgfHwgdGhpcztcclxuXHRcdFx0Ly8gdGhpcy5saXN0LmNhbGxiYWNrVGhpc09iaiA9IHRoaXM7XHJcblx0XHRcdHRoaXMubGlzdC5pdGVtUmVuZGVyZXIgPSBMYXlhLkhhbmRsZXIuY3JlYXRlKCB0aGlzICwgdGhpcy5saXN0SXRlbVJlbmRlciApO1xyXG5cdFx0XHQvLyB0aGlzLmxpc3QuYWRkRXZlbnRMaXN0ZW5lcihmYWlyeWd1aS5JdGVtRXZlbnQuQ0xJQ0ssIHRoaXMuY2xpY2tJdGVtLCB0aGlzKTtcclxuXHRcdFx0dGhpcy5saXN0Lm9uKCBMYXlhLkV2ZW50LkNMSUNLICwgdGhpcyAsIHRoaXMuY2xpY2tJdGVtICk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgSXNJbml0ZWQoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhZGRBbGxMaXN0ZW5lcigpOiB2b2lkIHtcclxuXHJcblx0XHRzdXBlci5hZGRBbGxMaXN0ZW5lcigpO1xyXG5cdH1cclxuXHJcblx0Lyoq6K6+572u5LiK5LiA6aG15oyJ6ZKuICovXHJcblx0cHVibGljIHNldCBidG5fbGVmdCh2YWx1ZTogRUJ1dHRvbiB8IGZhaXJ5Z3VpLkdCdXR0b24pIHtcclxuXHRcdGlmICh2YWx1ZSkge1xyXG5cdFx0XHR0aGlzLl9idG5fbGVmdCA9IHZhbHVlO1xyXG5cdFx0XHR0aGlzLl9idG5fbGVmdC5vbiggTGF5YS5FdmVudC5DTElDSyAsIHRoaXMgLCB0aGlzLnRvdWNoTGVmdEJ0bkhhbmRsZXIgKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICh0aGlzLl9idG5fbGVmdCkge1xyXG5cdFx0XHRcdHRoaXMuX2J0bl9sZWZ0Lm9mZihMYXlhLkV2ZW50LkNMSUNLLCB0aGlzLCB0aGlzLnRvdWNoTGVmdEJ0bkhhbmRsZXIgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0KiDkuIrkuIDpobVcclxuXHQqL1xyXG5cdHByaXZhdGUgdG91Y2hMZWZ0QnRuSGFuZGxlcihlOiBMYXlhLkV2ZW50KTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5jdXJyZW50cGFnZSA+IDApIHtcclxuXHRcdFx0bGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmN1cnJlbnRwYWdlIC0gMTtcclxuXHRcdFx0dGhpcy50b1BhZ2UoaW5kZXgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Lyoq6K6+572u5LiL5LiA6aG15oyJ6ZKuICovXHJcblx0cHVibGljIHNldCBidG5fcmlnaHQodmFsdWU6IEVCdXR0b24gfCBmYWlyeWd1aS5HQnV0dG9uKSB7XHJcblx0XHRpZiAodmFsdWUpIHtcclxuXHRcdFx0dGhpcy5fYnRuX3JpZ2h0ID0gdmFsdWU7XHJcblx0XHRcdHRoaXMuX2J0bl9yaWdodC5vbihMYXlhLkV2ZW50LkNMSUNLICwgdGhpcyAsIHRoaXMudG91Y2hSaWdodEJ0bkhhbmRsZXIgKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICh0aGlzLl9idG5fcmlnaHQpIHtcclxuXHRcdFx0XHR0aGlzLl9idG5fcmlnaHQub2ZmKExheWEuRXZlbnQuQ0xJQ0ssIHRoaXMsIHRoaXMudG91Y2hSaWdodEJ0bkhhbmRsZXIgKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog5LiL5LiA6aG1XHJcblx0ICovXHJcblx0cHJpdmF0ZSB0b3VjaFJpZ2h0QnRuSGFuZGxlcihlOiBMYXlhLkV2ZW50KTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5jdXJyZW50cGFnZSA8IHRoaXMuYXJyYXkubGVuZ3RoIC0gMSkge1xyXG5cdFx0XHRsZXQgaW5kZXg6IG51bWJlciA9IHRoaXMuY3VycmVudHBhZ2UgKyAxO1xyXG5cdFx0XHR0aGlzLnRvUGFnZShpbmRleCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKirot7PovazliLDmn5DkuIDpobUgMH5uKi9cclxuXHRwcml2YXRlIHRvUGFnZShpbmRleDogbnVtYmVyKTogdm9pZCB7XHJcblx0XHRpbmRleCA9IGluZGV4IDwgMCA/IDAgOiBpbmRleDtcclxuXHRcdGlmICh0aGlzLl9zZWxlY3RlZFBhZ2UpIHtcclxuXHRcdFx0dGhpcy5fc2VsZWN0ZWRQYWdlLmFwcGx5KHRoaXMuY2FsbGJhY2tUaGlzT2JqLCAwKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuc2Nyb2xsVG9WaWV3KGluZGV4LCB0cnVlKTsvL+a7muWKqOWIsOafkOS4gOS4qml0ZW1cclxuXHR9XHJcblxyXG5cdC8qKua7keWKqGxpc3QgKi9cclxuXHRwcml2YXRlIHNjcm9sbExpc3RQYWdlKCk6IHZvaWQge1xyXG5cclxuXHRcdGxldCBpbmRleDogbnVtYmVyID0gKCh0aGlzLmxpc3QuZ2V0Rmlyc3RDaGlsZEluVmlldygpKSAlIHRoaXMubGlzdC5udW1JdGVtcyk7Ly/ojrflj5bpobXmlbBcclxuXHJcblx0XHR0aGlzLmN1cnJlbnRwYWdlID0gaW5kZXg7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2J0bl9sZWZ0KSB7XHJcblx0XHRcdHRoaXMuX2J0bl9sZWZ0LmVuYWJsZWQgPSB0aGlzLmN1cnJlbnRwYWdlID4gMDtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fYnRuX3JpZ2h0KSB7XHJcblx0XHRcdHRoaXMuX2J0bl9yaWdodC5lbmFibGVkID0gdGhpcy5jdXJyZW50cGFnZSA8ICh0aGlzLmFycmF5Lmxlbmd0aCAtIDEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9zZWxlY3RlZFBhZ2UpIHtcclxuXHRcdFx0dGhpcy5fc2VsZWN0ZWRQYWdlLmFwcGx5KHRoaXMuY2FsbGJhY2tUaGlzT2JqLCAwKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgaXNTaG93RG9TcGVjaWFsRWZmZWN0KGJvb2w6IGJvb2xlYW4pIHtcclxuXHRcdHRoaXMuX2lzU2hvd0RvU3BlY2lhbEVmZmVjdCA9IGJvb2w7XHJcblx0XHRpZiAodGhpcy5faXNTaG93RG9TcGVjaWFsRWZmZWN0KSB7XHJcblx0XHRcdHRoaXMubGlzdC5vbihmYWlyeWd1aS5FdmVudHMuU0NST0xMLCB0aGlzLCB0aGlzLmRvU3BlY2lhbEVmZmVjdCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmxpc3Qub2ZmKGZhaXJ5Z3VpLkV2ZW50cy5TQ1JPTEwsIHRoaXMsIHRoaXMuZG9TcGVjaWFsRWZmZWN0KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDmu5HliqhsaXN0XHJcblx0ICAqL1xyXG5cdHByaXZhdGUgZG9TcGVjaWFsRWZmZWN0KCk6IHZvaWQge1xyXG5cdFx0dmFyIG1pZFg6IG51bWJlciA9IHRoaXMubGlzdC5zY3JvbGxQYW5lLnBvc1ggKyB0aGlzLmxpc3Qudmlld1dpZHRoIC8gMjtcclxuXHRcdHZhciBjbnQ6IG51bWJlciA9IHRoaXMubGlzdC5udW1DaGlsZHJlbjtcclxuXHRcdGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBjbnQ7IGkrKykge1xyXG5cdFx0XHR2YXIgb2JqOiBmYWlyeWd1aS5HT2JqZWN0ID0gdGhpcy5saXN0LmdldENoaWxkQXQoaSk7XHJcblx0XHRcdHZhciBkaXN0OiBudW1iZXIgPSBNYXRoLmFicyhtaWRYIC0gb2JqLnggLSBvYmoud2lkdGggLyAyKTtcclxuXHRcdFx0aWYgKGRpc3QgPD0gb2JqLndpZHRoICogMC41KSAvL+atpOadoeebruWcqOS4remXtFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKHRoaXMuX2xhc3RjbGlja0l0ZW0gJiYgb2JqICYmIHRoaXMuX2xhc3RjbGlja0l0ZW0gPT0gb2JqKSB7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5jbGlja0luZGV4ID0gdGhpcy5nZXRTaG93SXRlbUluZGV4KG9iaik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0U2hvd0l0ZW0oaW5kZXg6IG51bWJlcik6IGFueSB7XHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmdldENoaWxkQXQoaW5kZXgpO1xyXG5cdH1cclxuXHJcblx0LyoqIOabtOWFt+adoeebriDojrflj5bntKLlvJXvvIzmmK/lkKbkuLrmnaHnm67ntKLlvJUqL1xyXG5cdHB1YmxpYyBnZXRTaG93SXRlbUluZGV4KGl0ZW06IGZhaXJ5Z3VpLkdPYmplY3QsIGlzQ2hpbmRJbmRleDogYm9vbGVhbiA9IHRydWUpOiBudW1iZXIge1xyXG5cdFx0aWYgKGlzQ2hpbmRJbmRleCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5saXN0LmdldENoaWxkSW5kZXgoaXRlbSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5saXN0LmNoaWxkSW5kZXhUb0l0ZW1JbmRleCh0aGlzLmxpc3QuZ2V0Q2hpbGRJbmRleChpdGVtKSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKirovazmjaLliLDmmL7npLrlr7nosaHntKLlvJUqL1xyXG5cdHB1YmxpYyBpdGVtSW5kZXhUb0NoaWxkSW5kZXgoaW5kZXg6IG51bWJlcik6IG51bWJlciB7XHJcblx0XHRsZXQgbmV3SW5kZXg6IG51bWJlciA9IHRoaXMubGlzdC5pdGVtSW5kZXhUb0NoaWxkSW5kZXgoaW5kZXgpO1xyXG5cdFx0cmV0dXJuIG5ld0luZGV4O1xyXG5cdH1cclxuXHJcblx0Lyoq6L2s5o2i5pi+56S65a+56LGh57Si5byV5Li66aG555uu57Si5byV44CCKi9cclxuXHRwdWJsaWMgY2hpbGRJbmRleFRvSXRlbUluZGV4KGluZGV4OiBudW1iZXIpOiBudW1iZXIge1xyXG5cdFx0bGV0IG5ld0luZGV4OiBudW1iZXIgPSB0aGlzLmxpc3QuY2hpbGRJbmRleFRvSXRlbUluZGV4KGluZGV4KTtcclxuXHRcdHJldHVybiBuZXdJbmRleDtcclxuXHR9XHJcblxyXG5cdC8qKuiuvue9ruiZmuaLn+WIl+ihqCAqL1xyXG5cdHB1YmxpYyBzZXRWaXJ0dWFsKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5saXN0LnNldFZpcnR1YWwoKTtcclxuXHRcdHRoaXMuc2V0U2Nyb2xsKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0U2Nyb2xsKCk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMubGlzdCkge1xyXG5cdFx0XHR0aGlzLmxpc3Qub24oZmFpcnlndWkuRXZlbnRzLlNDUk9MTCwgdGhpcywgdGhpcy5zY3JvbGxMaXN0UGFnZSApOy8v6L+Z5Liq5Ye95pWw5Li76KaB5piv5p2l5aSE55CG5rua5Yqo5YiG6aG1XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog6K6+572uTGlzdOaYr+WQpuiDveWkn+a7muWKqFxyXG5cdCAgKi9cclxuXHRwdWJsaWMgc2V0IGlzRHJhZ2dlZCh2YWx1ZTogYm9vbGVhbikge1xyXG5cdFx0aWYgKHRoaXMubGlzdC5zY3JvbGxQYW5lKSB7XHJcblx0XHRcdHRoaXMubGlzdC5zY3JvbGxQYW5lLnRvdWNoRWZmZWN0ID0gdmFsdWU7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3luYygpOiB2b2lkIHtcclxuXHRcdHRoaXMubGlzdC5lbnN1cmVCb3VuZHNDb3JyZWN0KCk7XHJcblx0fVxyXG5cclxuXHQvKirpu5jorqTpgInmi6nnrKzlh6DkuKogKi9cclxuXHRwdWJsaWMgc2V0IGNsaWNrSW5kZXgoaW5kZXg6IG51bWJlcikge1xyXG5cdFx0bGV0IG5ld0luZGV4OiBudW1iZXIgPSB0aGlzLml0ZW1JbmRleFRvQ2hpbGRJbmRleChpbmRleCk7XHJcblx0XHRpZiAobmV3SW5kZXggPCAwKSB7XHJcblx0XHRcdG5ld0luZGV4ID0gMDtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLmxpc3QubnVtQ2hpbGRyZW4gPiAwKSB7XHJcblx0XHRcdC8vIGxldCBpdGVtOiBmYWlyeWd1aS5HT2JqZWN0ID0gdGhpcy5saXN0LmdldENoaWxkQXQobmV3SW5kZXgpO1xyXG5cdFx0XHQvLyBsZXQgaWU6IGZhaXJ5Z3VpLkl0ZW1FdmVudCA9IG5ldyBmYWlyeWd1aS5JdGVtRXZlbnQoZmFpcnlndWkuSXRlbUV2ZW50LkNMSUNLLCBpdGVtKTtcclxuXHRcdFx0Ly8gdGhpcy5saXN0LmRpc3BhdGNoRXZlbnQoaWUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBjYWxsYmFja1RoaXNPYmoodmFsdWU6IGFueSkge1xyXG5cclxuXHRcdHRoaXMuX3RoaXNPYmplY3QgPSB2YWx1ZTtcclxuXHR9XHJcblx0LyoqVGhpcyAqL1xyXG5cdHB1YmxpYyBnZXQgY2FsbGJhY2tUaGlzT2JqKCk6IGFueSB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX3RoaXNPYmplY3Q7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgICog6K6+572u5riy5p+T5p2h55uuXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBzZXRSZW5kZXJJdGVtKHBrZ05hbWU6IHN0cmluZywgcmVzTmFtZTogc3RyaW5nKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5saXN0LmRlZmF1bHRJdGVtID0gRmFpcnlUZXh0dXJlVXRpbHMuZ2V0VXJsKHBrZ05hbWUsIHJlc05hbWUpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBpdGVtUHJvdmlkZXIodmFsdWU6IExheWEuSGFuZGxlcikge1xyXG5cclxuXHRcdGlmICh0aGlzLmxpc3QgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLmxpc3QuaXRlbVByb3ZpZGVyID0gdmFsdWU7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGl0ZW1SZW5kZXJlcih2YWx1ZTogTGF5YS5IYW5kbGVyKSB7XHJcblxyXG5cdFx0dGhpcy5faXRlbVJlbmRlcmVyID0gdmFsdWU7XHJcblx0XHRpZiAodGhpcy5saXN0ICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5saXN0Lml0ZW1SZW5kZXJlciA9IHZhbHVlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvKirmuLLmn5Pmlrnms5UgKi9cclxuXHRwdWJsaWMgZ2V0IGl0ZW1SZW5kZXJlcigpOkxheWEuSGFuZGxlciB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX2l0ZW1SZW5kZXJlcjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgY2xpY2tIYW5kbGVyKHZhbHVlOiBGdW5jdGlvbikge1xyXG5cclxuXHRcdHRoaXMuX2NsaWNrSGFuZGxlciA9IHZhbHVlO1xyXG5cdH1cclxuXHQvKirngrnlh7vkuovku7YgKi9cclxuXHRwdWJsaWMgZ2V0IGNsaWNrSGFuZGxlcigpOiBGdW5jdGlvbiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX2NsaWNrSGFuZGxlcjtcclxuXHR9XHJcblxyXG5cdC8qKuiuvue9ruWIhumhteS6i+S7tiAqL1xyXG5cdHB1YmxpYyBzZXQgc2VsZWN0ZWRQYWdlKHZhbHVlOiBGdW5jdGlvbikge1xyXG5cclxuXHRcdHRoaXMuX3NlbGVjdGVkUGFnZSA9IHZhbHVlO1xyXG5cdH1cclxuXHQvKirojrflj5bliIbpobXkuovku7YgKi9cclxuXHRwdWJsaWMgZ2V0IHNlbGVjdGVkUGFnZSgpOiBGdW5jdGlvbiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX3NlbGVjdGVkUGFnZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgc2VsZWN0aW9uTW9kZSgpOm51bWJlciAgey8vZmFpcnlndWkuTGlzdFNlbGVjdGlvbk1vZGVcclxuXHRcdHJldHVybiB0aGlzLmxpc3Quc2VsZWN0aW9uTW9kZTtcclxuXHR9XHJcblx0Lyoq6YCJ5oup5qih5byPICovXHJcblx0cHVibGljIHNldCBzZWxlY3Rpb25Nb2RlKHZhbHVlOiBudW1iZXIpIHsvL2ZhaXJ5Z3VpLkxpc3RTZWxlY3Rpb25Nb2RlXHJcblx0XHR0aGlzLmxpc3Quc2VsZWN0aW9uTW9kZSA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0Lyoq5piv5ZCm5Li65Y2V6YCJ5qih5byPICovXHJcblx0cHVibGljIGdldCBpc1NpbmdsZVNlbGVjdCgpOiBib29sZWFuIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5zZWxlY3Rpb25Nb2RlID09IGZhaXJ5Z3VpLkxpc3RTZWxlY3Rpb25Nb2RlLlNpbmdsZTtcclxuXHR9XHJcblxyXG5cdC8qKuaYr+WQpuS4uuWkmumAieaooeW8jyAqL1xyXG5cdHB1YmxpYyBnZXQgaXNNdWx0U2VsZWN0KCk6IGJvb2xlYW4ge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLnNlbGVjdGlvbk1vZGUgPT0gZmFpcnlndWkuTGlzdFNlbGVjdGlvbk1vZGUuTXVsdGlwbGU7XHJcblx0fVxyXG5cclxuXHQvKirmr4/mrKHmlbDlgLzmlLnlj5jkuYvliY3kvJrop6blj5Hmr4/kuKrmmL7npLrkuK3lrZDnu4Tku7bnmoRkYXRhPW51bGznmoTmlrnms5XvvIzph43lhplzZXQgZGF0YeiHquW3seWkhOeQhuaVsOaNruW8leeUqCzmn5Dkupvmg4XlhrXlpoLmnpzmmL7npLrkuK3nmoTlrZDnu4Tku7bpnIDopoHmlbDmja7mm7TmlrDvvIxcclxuXHQgICog6K+35L2/55SoZWxlbWVudHPlsZ7mgKfoh6rooYzov5vooYznu4Tku7bmm7TmlrDvvIzkuI3opoHnu5lhcnJheei1i+WAvO+8jOWPr+S7peaPkOWNh+aViOeOhyovXHJcblx0cHVibGljIHNldCBhcnJheSh2YWx1ZTogQXJyYXk8YW55Pikge1xyXG5cclxuXHRcdHRoaXMucmVtb3ZlQWxsQ29tcG9uZW50KCk7XHJcblxyXG5cdFx0dGhpcy5jbGVhckRhdGEoKTtcclxuXHRcdHRoaXMuX2FycmF5ID0gdmFsdWUgfHwgW107XHJcblx0XHR0aGlzLnVwZGF0ZUxpc3QoKTtcclxuXHR9XHJcblx0LyoqXHJcblx0ICAqIOiuvue9ruWvueW6lOaVsOaNrlxyXG5cdCAgKi9cclxuXHRwdWJsaWMgZ2V0IGFycmF5KCk6IEFycmF5PGFueT4ge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLl9hcnJheTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhZGRJdGVtKHZhbHVlOiBhbnksIGlzVW5zaGlmdDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2FycmF5ICYmIHRoaXMuX2FycmF5LmluZGV4T2YodmFsdWUpID09IC0xKSB7XHJcblx0XHRcdGlmIChpc1Vuc2hpZnQpIHtcclxuXHRcdFx0XHR0aGlzLl9hcnJheS51bnNoaWZ0KHZhbHVlKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLl9hcnJheS5wdXNoKHZhbHVlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnVwZGF0ZUxpc3QoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKuenu+mZpOadoeebriAqL1xyXG5cdHB1YmxpYyByZW1vdmVJdGVtKHZhbHVlOiBhbnkpOiB2b2lkIHtcclxuXHJcblx0XHRsZXQgaXRlbTogYW55ID0gbnVsbDtcclxuXHRcdGxldCBpbmRleDogbnVtYmVyID0gdGhpcy5fYXJyYXkuaW5kZXhPZih2YWx1ZSk7XHJcblx0XHRpZiAodGhpcy5fYXJyYXkgJiYgaW5kZXggIT0gLTEpIHtcclxuXHRcdFx0aXRlbSA9IHRoaXMuX2FycmF5LnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRcdHRoaXMudXBkYXRlTGlzdCgpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGl0ZW07XHJcblx0fVxyXG5cclxuXHJcblx0Lyoq5pu05paw5YiX6KGoICovXHJcblx0cHJpdmF0ZSB1cGRhdGVMaXN0KCk6IHZvaWQge1xyXG5cclxuXHRcdGlmICh0aGlzLmxpc3QgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLmxpc3QubnVtSXRlbXMgPSB0aGlzLl9hcnJheS5sZW5ndGg7XHJcblx0XHRcdGlmICh0aGlzLmlzQXV0b0JvdHRvbSkge1xyXG5cdFx0XHRcdHRoaXMuc2Nyb2xsVG9Cb3R0b20oKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIGFkZEl0ZW1MaXN0KGxpc3Q6IEFycmF5PGFueT4pOiB2b2lkIHtcclxuXHJcblx0XHRpZiAodGhpcy5fYXJyYXkgIT0gbnVsbCAmJiBsaXN0ICYmIGxpc3QubGVuZ3RoID4gMCkge1xyXG5cdFx0XHR0aGlzLl9hcnJheSA9IHRoaXMuX2FycmF5LmNvbmNhdChsaXN0KTtcclxuXHRcdH1cclxuXHRcdHRoaXMudXBkYXRlTGlzdCgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHJlcGxhY2VBbGwobGlzdDogQXJyYXk8YW55Pik6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMuX2FycmF5ID0gbGlzdDtcclxuXHRcdHRoaXMudXBkYXRlTGlzdCgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBudW1JdGVtcyh2YWx1ZTogbnVtYmVyKSB7XHJcblxyXG5cdFx0Ly8gdGhpcy5fYXJyYXkgPSBbXTtcclxuXHRcdHRoaXMuY2xlYXJEYXRhKCk7XHJcblx0XHR0aGlzLl9hcnJheS5sZW5ndGggPSB2YWx1ZTtcclxuXHRcdHRoaXMudXBkYXRlTGlzdCgpO1xyXG5cdH1cclxuXHQvKirorr7nva7mnaHnm64gKi9cclxuXHRwdWJsaWMgZ2V0IG51bUl0ZW1zKCk6IG51bWJlciB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5udW1JdGVtcztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDngrnlh7vmnaHnm65cclxuXHQgICovXHJcblx0cHJvdGVjdGVkIGNsaWNrSXRlbShlOiBhbnkpOiB2b2lkIHsvL2ZhaXJ5Z3VpLkl0ZW1FdmVudFxyXG5cdFx0dGhpcy5zZWxlY3RJdGVtKGUuaXRlbU9iamVjdCk7XHJcblx0fVxyXG5cclxuXHQvKirpgInmi6nmnaHnm64gKi9cclxuXHRwdWJsaWMgc2VsZWN0SXRlbShpdGVtOiBhbnkpOiB2b2lkIHtcclxuXHJcblx0XHQvL+WkjemAieWPr+mAieaLqeWkmuS4quWPr+mHjeWkjemAieaLqVxyXG5cdFx0aWYgKCh0aGlzLnNlbGVjdGlvbk1vZGUgPT0gZmFpcnlndWkuTGlzdFNlbGVjdGlvbk1vZGUuU2luZ2xlKVxyXG5cdFx0XHQmJiB0aGlzLl9sYXN0Y2xpY2tJdGVtXHJcblx0XHRcdCYmIGl0ZW1cclxuXHRcdFx0JiYgdGhpcy5fbGFzdGNsaWNrSXRlbSA9PSBpdGVtXHJcblx0XHQpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9sYXN0Y2xpY2tJdGVtKSB7XHJcblx0XHRcdHRoaXMuX2xhc3RjbGlja0l0ZW1bXCJzZWxlY3RcIl0gPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGlmIChpdGVtKSB7XHJcblx0XHRcdGl0ZW1bXCJzZWxlY3RcIl0gPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5fbGFzdGNsaWNrSXRlbSA9IGl0ZW07XHJcblxyXG5cdFx0aWYgKGl0ZW0uZGF0YSkgdGhpcy5fc2VsZWN0SW5kZXggPSB0aGlzLl9hcnJheS5pbmRleE9mKGl0ZW0uZGF0YSk7XHJcblx0XHRlbHNlIHRoaXMuX3NlbGVjdEluZGV4ID0gcGFyc2VJbnQoaXRlbS5uYW1lKTtcclxuXHJcblx0XHRpZiAodGhpcy5fY2xpY2tIYW5kbGVyKSB7XHJcblx0XHRcdHRoaXMuX2NsaWNrSGFuZGxlci5hcHBseSh0aGlzLmNhbGxiYWNrVGhpc09iaiwgW2l0ZW1dKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKuiOt+WPlumAieaLqeeahOadoeebriAqL1xyXG5cdHB1YmxpYyBnZXQgbGFzdENsaWNrSXRlbSgpOiBmYWlyeWd1aS5HT2JqZWN0IHtcclxuXHRcdHJldHVybiB0aGlzLl9sYXN0Y2xpY2tJdGVtO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOa4suafk+adoeebrlxyXG5cdCAgKi9cclxuXHRwcm90ZWN0ZWQgbGlzdEl0ZW1SZW5kZXIoaW5kZXg6IG51bWJlciwgb2JqOiBmYWlyeWd1aS5HT2JqZWN0KTogdm9pZCB7XHJcblxyXG5cdFx0aWYgKGluZGV4ID09IDApIHtcclxuXHRcdFx0dGhpcy5fZWxlbWVudHMgPSBbXTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgaXRlbTogYW55ID0gb2JqO1xyXG5cdFx0aWYgKGl0ZW0gJiYgaXRlbVtcInNob3dcIl0gIT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdGl0ZW0uc2hvdyh0aGlzLl9hcnJheVtpbmRleF0pO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuZWxlbWVudHMuaW5kZXhPZihpdGVtKSA9PSAtMSkge1xyXG5cdFx0XHR0aGlzLmVsZW1lbnRzLnB1c2goaXRlbSk7XHJcblx0XHR9XHJcblx0XHQvL+WIl+ihqOa4suafk+WNleS4quadoeebrlxyXG5cdFx0bGV0IGV2dDogR2FtZUV2ZW50ID0gbmV3IEdhbWVFdmVudChHYW1lRXZlbnQuRUdMSVNUX1JFTkRFUik7XHJcblx0XHRldnQuZGF0YSA9IHsgXCJpbmRleFwiOiBpbmRleCwgXCJvYmpcIjogb2JqIH07XHJcblx0XHRldnQudGhpc09iamVjdCA9IHRoaXMuX3RoaXNPYmplY3Q7XHJcblx0XHQvLyB0aGlzLmRpc3BhdGNoRXZlbnQoZXZ0KTtcclxuXHRcdGZhaXJ5Z3VpLkV2ZW50cy5kaXNwYXRjaCggR2FtZUV2ZW50LkVHTElTVF9SRU5ERVIgLCB0aGlzLl9kaXNwbGF5T2JqZWN0ICwgZXZ0ICk7XHJcblx0XHQvL+WIl+ihqOa4suafk+WujOaIkFxyXG5cdFx0aWYgKGluZGV4ID09ICh0aGlzLl9hcnJheS5sZW5ndGggLSAxKSkge1xyXG5cclxuXHRcdFx0bGV0IGNvbXBsZXRlRXZ0OiBHYW1lRXZlbnQgPSBuZXcgR2FtZUV2ZW50KEdhbWVFdmVudC5FR0xJU1RfQ09NUExFVEUpO1xyXG5cdFx0XHRjb21wbGV0ZUV2dC50aGlzT2JqZWN0ID0gdGhpcy5fdGhpc09iamVjdDtcclxuXHRcdFx0Ly8gdGhpcy5kaXNwYXRjaEV2ZW50KGNvbXBsZXRlRXZ0KTtcclxuXHRcdFx0ZmFpcnlndWkuRXZlbnRzLmRpc3BhdGNoKCBHYW1lRXZlbnQuRUdMSVNUX0NPTVBMRVRFICwgdGhpcy5fZGlzcGxheU9iamVjdCAsIGV2dCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9zZWxlY3RlZFBhZ2UpIHtcclxuXHRcdFx0Ly/lpITnkIbliIbpobXnmoTml7blgJlcclxuXHRcdFx0aWYgKGluZGV4ID09IDAgJiYgIXRoaXMuaXNGaXJzdCkge1xyXG5cdFx0XHRcdHRoaXMuaXNGaXJzdCA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5fc2VsZWN0ZWRQYWdlLmFwcGx5KHRoaXMuY2FsbGJhY2tUaGlzT2JqLCAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggR2xvYmFsLmlzKG9iaiwgXCJJQ29tcG9uZW50XCIpICkge1xyXG5cdFx0XHR0aGlzLmFkZENvbXBvbmVudCg8YW55Pm9iaik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKirliJfooajmuLLmn5PmiYDmnInmnaHnm64gIOiZmuaLn+WIl+ihqOS4jeWPr+S7pei/meagt+WPliovXHJcblx0cHVibGljIGdldCBlbGVtZW50cygpOiBBcnJheTxhbnk+IHtcclxuXHRcdHJldHVybiB0aGlzLl9lbGVtZW50cztcclxuXHRcdC8v6L2s5o2i6aG555uu57Si5byV5Li65pi+56S65a+56LGh57Si5byV44CCXHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9zZWxlY3RJbmRleDogbnVtYmVyID0gMDtcclxuXHJcblx0cHVibGljIHNldCBzZWxlY3RlZEluZGV4KHZhbHVlOiBudW1iZXIpIHtcclxuXHJcblx0XHRpZiAodGhpcy5pc1NpbmdsZVNlbGVjdCkge1xyXG5cclxuXHRcdFx0dGhpcy5saXN0LnNlbGVjdGVkSW5kZXggPSB2YWx1ZTsvL+Wdke+8jOacieaXtuWPliB0aGlzLmxpc3Quc2VsZWN0ZWRJbmRleOaciemXrumimFxyXG5cdFx0XHR0aGlzLl9zZWxlY3RJbmRleCA9IHZhbHVlO1xyXG5cdFx0XHQvL2Nsb25nIDIwMTkuMi4xMlxyXG5cdFx0XHRsZXQgaXRlbTogYW55ID0gdmFsdWUgPCB0aGlzLmxpc3QubnVtQ2hpbGRyZW4gPyB0aGlzLmxpc3QuZ2V0Q2hpbGRBdCh2YWx1ZSkgOiBudWxsO1xyXG5cdFx0XHRpZiAoaXRlbSBpbnN0YW5jZW9mIFVJRUxpc3RSZW5kZXJJdGVtIHx8IGl0ZW0gaW5zdGFuY2VvZiBCYXNlQnV0dG9uICkge1xyXG5cdFx0XHRcdHRoaXMuc2VsZWN0SXRlbShpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5fc2VsZWN0SW5kZXggPSAtMTtcclxuXHRcdH1cclxuXHR9XHJcblx0Lyoq5b2T5YmN6YCJ5oup5p2h55uu57Si5byVICovXHJcblx0cHVibGljIGdldCBzZWxlY3RlZEluZGV4KCk6IG51bWJlciB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX3NlbGVjdEluZGV4Oy8vIHRoaXMubGlzdC5zZWxlY3RlZEluZGV4O1xyXG5cdH1cclxuXHJcblx0Lyoq5b2T5YmN6YCJ5oup5pWw5o2uICovXHJcblx0cHVibGljIGdldCBzZWxlY3RlZEl0ZW0oKTogYW55IHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5fc2VsZWN0SW5kZXggPCAwID8gbnVsbCA6IHRoaXMuX2FycmF5W3RoaXMuX3NlbGVjdEluZGV4XTtcclxuXHR9XHJcblxyXG5cdC8qKua3u+WKoOmAieaLqSAqL1xyXG5cdHB1YmxpYyBhZGRTZWxlY3Rpb24oaW5kZXg6IG51bWJlciwgc2Nyb2xsSXRUb1ZpZXc/OiBib29sZWFuKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5saXN0LmFkZFNlbGVjdGlvbihpbmRleCwgc2Nyb2xsSXRUb1ZpZXcpO1xyXG5cdH1cclxuXHJcblx0Lyoq56e76Zmk6YCJ5oupICovXHJcblx0cHVibGljIHJlbW92ZVNlbGVjdGlvbihpbmRleDogbnVtYmVyKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5saXN0LnJlbW92ZVNlbGVjdGlvbihpbmRleCk7XHJcblx0fVxyXG5cclxuXHQvKirlhajpgIkgKi9cclxuXHRwdWJsaWMgc2VsZWN0QWxsKCk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMubGlzdC5zZWxlY3RBbGwoKTtcclxuXHR9XHJcblxyXG5cdC8qKuS4jemAieaLqSAqL1xyXG5cdHB1YmxpYyBzZWxlY3ROb25lKCk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMubGlzdC5zZWxlY3ROb25lKCk7XHJcblx0fVxyXG5cclxuXHQvKirlj43pgIkgKi9cclxuXHRwdWJsaWMgc2VsZWN0UmV2ZXJzZSgpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmxpc3Quc2VsZWN0UmV2ZXJzZSgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOW9k+WJjei/m+W6puadoea7muWKqOeZvuWIhuavlFxyXG5cdCAgKi9cclxuXHRwdWJsaWMgZ2V0IHByb2dyZXNzKCk6IG51bWJlciB7XHJcblxyXG5cdFx0aWYgKHRoaXMuaXNIb3Jpem9udGFsKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmxpc3Quc2Nyb2xsUGFuZS5wZXJjWDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmxpc3Quc2Nyb2xsUGFuZS5wZXJjWTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIHB1YmxpYyBzZXQgaXNIb3Jpem9udGFsKHZhbHVlOmJvb2xlYW4pe1xyXG5cdC8vIFx0aWYoIHZhbHVlICl7XHJcblx0Ly8gXHRcdHRoaXMubGlzdC5zY3JvbGxQYW5lLnNjclxyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxuXHJcblx0Lyoq5qiq5ZCR5rua5Yqo5p2hICovXHJcblx0cHVibGljIGdldCBpc0hvcml6b250YWwoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5zY3JvbGxQYW5lID8gdGhpcy5saXN0LnNjcm9sbFBhbmVbXCJfc2Nyb2xsVHlwZVwiXSA9PSBmYWlyeWd1aS5TY3JvbGxUeXBlLkhvcml6b250YWwgOiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDmu5HliqjliLBcclxuXHQgICogQHBhcmFtIHByb2dyZXNzIDAgfiAxXHJcblx0ICAqL1xyXG5cdHB1YmxpYyBzbGlkZXJUbyhwcm9ncmVzczogbnVtYmVyLCBhbmk6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcblxyXG5cdFx0Ly8gdGhpcy5saXN0LnNjcm9sbFBhbmUuc2Nyb2xsRG93biggcHJvZ3Jlc3MgLCBhbmkgKTtcclxuXHRcdGlmICh0aGlzLmxpc3Quc2Nyb2xsUGFuZSkge1xyXG5cdFx0XHRpZiAodGhpcy5pc0hvcml6b250YWwpIHtcclxuXHRcdFx0XHR0aGlzLmxpc3Quc2Nyb2xsUGFuZS5zZXRQZXJjWChwcm9ncmVzcywgYW5pKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmxpc3Quc2Nyb2xsUGFuZS5zZXRQZXJjWShwcm9ncmVzcywgYW5pKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOa7muWKqOWIsFxyXG5cdCAgKiBAcGFyYW1zIGluZGV4XHJcblx0ICAqIEBwYXJhbXMgYW5pXHJcblx0ICAqIEBwYXJhbXMgc2V0Rmlyc3RcclxuXHQgICovXHJcblx0cHVibGljIHNjcm9sbFRvVmlldyhpbmRleDogbnVtYmVyLCBhbmk6IGJvb2xlYW4gPSBmYWxzZSwgc2V0Rmlyc3Q6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG5cclxuXHRcdHRoaXMubGlzdC5zY3JvbGxUb1ZpZXcoaW5kZXgsIGFuaSwgc2V0Rmlyc3QpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBzY3JvbGxQYW5lKCk6IGZhaXJ5Z3VpLlNjcm9sbFBhbmUge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3Quc2Nyb2xsUGFuZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRGaXJzdENoaWxkSW5WaWV3KCk6IG51bWJlciB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5nZXRGaXJzdENoaWxkSW5WaWV3KCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0TGlzdENvbXBvbmV0KCk6IGZhaXJ5Z3VpLkdMaXN0IHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0O1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICAqIOa7keWKqOWIsOmhtumDqFxyXG5cdCAgKi9cclxuXHRwdWJsaWMgc2Nyb2xsVG9Ub3AoYW5pOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmxpc3Quc2Nyb2xsUGFuZS5zY3JvbGxUb3AoYW5pKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDmu5rliqjliLDlupXpg6hcclxuXHQgICovXHJcblx0cHVibGljIHNjcm9sbFRvQm90dG9tKGFuaTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcblxyXG5cdFx0dGhpcy5saXN0LnNjcm9sbFBhbmUuc2Nyb2xsQm90dG9tKGFuaSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHRvdWNoRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xyXG5cclxuXHRcdHRoaXMubGlzdC5fY29udGFpbmVyLm1vdXNlRW5hYmxlZCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB0b3VjaEVuYWJsZWQoKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5fY29udGFpbmVyLm1vdXNlRW5hYmxlZDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgZW5hYmxlZCgpOiBib29sZWFuIHtcclxuXHRcdHJldHVybiB0aGlzLmxpc3QuZW5hYmxlZDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgZW5hYmxlZCh2YWw6IGJvb2xlYW4pIHtcclxuXHRcdHRoaXMubGlzdC5lbmFibGVkID0gdmFsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB0b3VjaENoaWxkcmVuKHZhbHVlOiBib29sZWFuKSB7XHJcblxyXG5cdFx0dGhpcy5saXN0Ll9jb250YWluZXIubW91c2VUaHJvdWdoID0gdmFsdWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHRvdWNoQ2hpbGRyZW4oKTogYm9vbGVhbiB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5fY29udGFpbmVyLm1vdXNlVGhyb3VnaDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRDaGlsZEF0KGluZGV4OiBudW1iZXIpOiBmYWlyeWd1aS5HT2JqZWN0IHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmdldENoaWxkQXQoaW5kZXgpXHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IG51bUNoaWxkcmVuKCk6IG51bWJlciB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5udW1DaGlsZHJlbjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgbGluZUNvdW50KHZhbHVlOiBudW1iZXIpIHtcclxuXHJcblx0XHR0aGlzLmxpc3QubGluZUNvdW50ID0gdmFsdWU7XHJcblx0fVxyXG5cdC8qKuiuvue9ruihjOaVsCAqL1xyXG5cdHB1YmxpYyBnZXQgbGluZUNvdW50KCk6IG51bWJlciB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5saW5lQ291bnQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGNvbHVtbkNvdW50KHZhbHVlOiBudW1iZXIpIHtcclxuXHJcblx0XHR0aGlzLmxpc3QuY29sdW1uQ291bnQgPSB2YWx1ZTtcclxuXHR9XHJcblx0Lyoq6K6+572u5YiX5pWwICovXHJcblx0cHVibGljIGdldCBjb2x1bW5Db3VudCgpOiBudW1iZXIge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QuY29sdW1uQ291bnQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHZpc2libGUodmFsdWU6IGJvb2xlYW4pIHtcclxuXHJcblx0XHR0aGlzLmxpc3QudmlzaWJsZSA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4ge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QudmlzaWJsZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgeCh2YWx1ZTogbnVtYmVyKSB7XHJcblxyXG5cdFx0dGhpcy5saXN0LnggPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgeCgpOiBudW1iZXIge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QueDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgeSh2YWx1ZTogbnVtYmVyKSB7XHJcblxyXG5cdFx0dGhpcy5saXN0LnkgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgeSgpOiBudW1iZXIge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QueTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgc2Nyb2xsVHlwZSh2YWx1ZTogZmFpcnlndWkuU2Nyb2xsVHlwZSkge1xyXG5cclxuXHRcdGlmICh0aGlzLmxpc3Quc2Nyb2xsUGFuZSkge1xyXG5cdFx0XHR0aGlzLmxpc3Quc2Nyb2xsUGFuZVtcIl9zY3JvbGxUeXBlXCJdID0gdmFsdWU7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8qKuWIl+ihqOa7muWKqOaooeW8jyAqL1xyXG5cdHB1YmxpYyBnZXQgc2Nyb2xsVHlwZSgpOiBmYWlyeWd1aS5TY3JvbGxUeXBlIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LnNjcm9sbFBhbmUgPyB0aGlzLmxpc3Quc2Nyb2xsUGFuZVtcIl9zY3JvbGxUeXBlXCJdIDogZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGxheW91dCh2YWx1ZTpudW1iZXIgKSB7Ly9mYWlyeWd1aS5MaXN0TGF5b3V0VHlwZVxyXG5cclxuXHRcdHRoaXMubGlzdC5sYXlvdXQgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgYWxpZ24odmFsdWU6c3RyaW5nICkgey8vZmFpcnlndWkuQWxpZ25UeXBlXHJcblxyXG5cdFx0dGhpcy5saXN0LmFsaWduID0gdmFsdWU7XHJcblx0fVxyXG5cdC8qKuW3puWPs+W4g+WxgCAqL1xyXG5cdHB1YmxpYyBnZXQgYWxpZ24oKTogc3RyaW5nIHsvL2ZhaXJ5Z3VpLkFsaWduVHlwZVxyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QuYWxpZ247XHJcblx0fVxyXG5cclxuXHQvLyBwdWJsaWMgc2V0IHZlcnRpY2FsQWxpZ24odmFsdWU6IGZhaXJ5Z3VpLlZlcnRBbGlnblR5cGUpIHtcclxuXHJcblx0Ly8gXHR0aGlzLmxpc3QudmVydGljYWxBbGlnbiA9IHZhbHVlO1xyXG5cdC8vIH1cclxuXHQvLyAvKirkuIrkuIsgKi9cclxuXHQvLyBwdWJsaWMgZ2V0IHZlcnRpY2FsQWxpZ24oKTogZmFpcnlndWkuVmVydEFsaWduVHlwZSB7XHJcblx0Ly8gXHRyZXR1cm4gdGhpcy5saXN0LnZlcnRpY2FsQWxpZ247XHJcblx0Ly8gfVxyXG5cclxuXHRwdWJsaWMgc2V0IGNvbHVtbkdhcCh2YWx1ZTogbnVtYmVyKSB7XHJcblxyXG5cdFx0dGhpcy5saXN0LmNvbHVtbkdhcCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0Lyoq5YiX6LedICovXHJcblx0cHVibGljIGdldCBjb2x1bW5HYXAoKTogbnVtYmVyIHtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmNvbHVtbkdhcDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgbGluZUdhcChnYXA6IG51bWJlcikge1xyXG5cclxuXHRcdHRoaXMubGlzdC5saW5lR2FwID0gZ2FwO1xyXG5cdH1cclxuXHJcblx0Lyoq6KGM6LedICovXHJcblx0cHVibGljIGdldCBsaW5lR2FwKCk6IG51bWJlciB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5saW5lR2FwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFNpemUod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGlnbm9yZVBpdm90OiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuXHJcblx0XHR0aGlzLmxpc3Quc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0LCBpZ25vcmVQaXZvdCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3VwZXJTZXRTaXplKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBpZ25vcmVQaXZvdDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcblxyXG5cdFx0c3VwZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0LCBpZ25vcmVQaXZvdCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0IHdpZHRoKCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LndpZHRoO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB3aWR0aCh2YWx1ZTogbnVtYmVyKSB7XHJcblx0XHR0aGlzLmxpc3Qud2lkdGggPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgaGVpZ2h0KCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LmhlaWdodDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgaGVpZ2h0KHZhbHVlOiBudW1iZXIpIHtcclxuXHRcdHRoaXMubGlzdC5oZWlnaHQgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgdmlld1dpZHRoKCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5saXN0LnZpZXdXaWR0aDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXQgdmlld0hlaWdodCgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC52aWV3SGVpZ2h0O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCBncmF5ZWQodmFsdWU6IGJvb2xlYW4pIHtcclxuXHJcblx0XHR0aGlzLmxpc3QuZ3JheWVkID0gdmFsdWU7XHJcblx0fVxyXG5cdC8qKue9rueBsCAqL1xyXG5cdHB1YmxpYyBnZXQgZ3JheWVkKCk6IGJvb2xlYW4ge1xyXG5cclxuXHRcdHJldHVybiB0aGlzLmxpc3QuZ3JheWVkO1xyXG5cdH1cclxuXHJcblx0Lyoq54i25a655ZmoICovXHJcblx0cHVibGljIGdldCBwYXJlbnQoKTogZmFpcnlndWkuR0NvbXBvbmVudCB7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5wYXJlbnQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgbG9jYWxUb0dsb2JhbChheD86IG51bWJlciwgYXk/OiBudW1iZXIsIHJlc3VsdFBvaW50PzogTGF5YS5Qb2ludCk6IExheWEuUG9pbnQge1xyXG5cdFx0cmV0dXJuIHRoaXMubGlzdC5sb2NhbFRvR2xvYmFsKGF4LCBheSwgcmVzdWx0UG9pbnQpO1xyXG5cdH1cclxuXHJcblx0Lyoq5riF55CG5pWw5o2uICovXHJcblx0cHVibGljIGNsZWFyRGF0YSgpIHtcclxuXHRcdGlmICh0aGlzLmVsZW1lbnRzKSB7XHJcblx0XHRcdGZvciAobGV0IGluZGV4IGluIHRoaXMuZWxlbWVudHMpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5lbGVtZW50c1tpbmRleF0gaW5zdGFuY2VvZiBCYXNlU3ByaXRlKSB7XHJcblx0XHRcdFx0XHR0aGlzLmVsZW1lbnRzW2luZGV4XVtcImhpZGVcIl0oKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLl9sYXN0Y2xpY2tJdGVtKSB7XHJcblx0XHRcdHRoaXMuX2xhc3RjbGlja0l0ZW1bXCJzZWxlY3RcIl0gPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5fbGFzdGNsaWNrSXRlbSA9IG51bGw7XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5fYnRuX2xlZnQpIHtcclxuXHRcdFx0dGhpcy5fYnRuX2xlZnQub2ZmKExheWEuRXZlbnQuQ0xJQ0ssIHRoaXMsIHRoaXMudG91Y2hMZWZ0QnRuSGFuZGxlciApO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuX2J0bl9yaWdodCkge1xyXG5cdFx0XHR0aGlzLl9idG5fcmlnaHQub2ZmKExheWEuRXZlbnQuQ0xJQ0ssIHRoaXMsIHRoaXMudG91Y2hSaWdodEJ0bkhhbmRsZXIgKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX2J0bl9sZWZ0ID0gbnVsbDtcclxuXHRcdHRoaXMuX2J0bl9yaWdodCA9IG51bGw7XHJcblx0XHR0aGlzLl9lbGVtZW50cyA9IFtdO1xyXG5cdFx0dGhpcy5fYXJyYXkgPSBbXTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDph43nva5cclxuXHQgICovXHJcblx0cHVibGljIGNsZWFyKCk6IHZvaWQge1xyXG5cclxuXHRcdHN1cGVyLmNsZWFyKCk7XHJcblxyXG5cdFx0dGhpcy5zbGlkZXJUbygwLCBmYWxzZSk7XHJcblxyXG5cdFx0dGhpcy5jbGVhckRhdGEoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAgKiDph4rmlL5cclxuXHQgICovXHJcblx0cHVibGljIGRpc3Bvc2UoKTogdm9pZCB7XHJcblxyXG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xyXG5cclxuXHRcdHRoaXMuY2xlYXIoKTtcclxuXHJcblx0XHRpZiAodGhpcy5saXN0ICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5saXN0Lm9mZihMYXlhLkV2ZW50LkNMSUNLICwgdGhpcyAsIHRoaXMuY2xpY2tJdGVtKTtcclxuXHRcdFx0dGhpcy5saXN0Lm9mZihmYWlyeWd1aS5FdmVudHMuU0NST0xMICwgdGhpcyAsIHRoaXMuc2Nyb2xsTGlzdFBhZ2UgKTtcclxuXHRcdFx0dGhpcy5saXN0LmRpc3Bvc2UoKTtcclxuXHRcdFx0dGhpcy5saXN0ID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdHRoaXMuX2J0bl9sZWZ0ID0gbnVsbDtcclxuXHRcdHRoaXMuX2J0bl9yaWdodCA9IG51bGw7XHJcblx0XHR0aGlzLl90aGlzT2JqZWN0ID0gbnVsbDtcclxuXHRcdHRoaXMuX2l0ZW1SZW5kZXJlciA9IG51bGw7XHJcblx0XHR0aGlzLl9jbGlja0hhbmRsZXIgPSBudWxsO1xyXG5cdFx0dGhpcy5fc2VsZWN0ZWRQYWdlID0gbnVsbDtcclxuXHRcdHRoaXMuX2FycmF5ID0gbnVsbDtcclxuXHRcdHRoaXMuX2VsZW1lbnRzID0gbnVsbDtcclxuXHRcdHRoaXMuX2xhc3RjbGlja0l0ZW0gPSBudWxsO1xyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgeyBVSUNvbXBvbmVudCB9IGZyb20gXCIuLi9VSUNvbXBvbmVudFwiO1xuXG4vKipcbiAgKiDliJfooajmuLLmn5PmnaHnm65cbiAgKiBAYXV0aG9yIGNsIDIwMTkuNS4xOFxuICAqL1xuZXhwb3J0IGNsYXNzIFVJRUxpc3RSZW5kZXJJdGVtIGV4dGVuZHMgVUlDb21wb25lbnQge1xuXG5cdC8qKuaYr+WQpuacieWPr+mAieS4reeKtuaAgSAqL1xuXHRwdWJsaWMgY2FuU2VsZWN0OiBib29sZWFuID0gZmFsc2U7XG5cblx0cHJvdGVjdGVkIF9fZGF0YTogYW55ID0gbnVsbDtcblxuXHRwcm90ZWN0ZWQgX3NlbGVjdDogYm9vbGVhbiA9IGZhbHNlO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcblxuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgY29uc3RydWN0RnJvbVhNTCh4bWw6IGFueSk6IHZvaWQge1xuXG5cdFx0c3VwZXIuY29uc3RydWN0RnJvbVhNTCh4bWwpO1xuXHR9XG5cblx0cHVibGljIGluaXRDb21wbGV0ZSgpOiBib29sZWFuIHtcblxuXHRcdC8v5qOA5rWL5Yid5aeL5YyW5piv5ZCm5a6M5oiQXG5cdFx0aWYgKCF0aGlzLmlzSW5pdGVkKCkpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuaXNPcGVuZWQpIHtcblx0XHRcdHRoaXMuaXNPcGVuZWQgPSB0cnVlO1xuXHRcdFx0dGhpcy5pbml0VUkoKTtcblx0XHR9XG5cblx0XHR0aGlzLmluaXREYXRhKHRoaXMucGFyYW0pO1xuXHRcdC8vIHRoaXMuQWRkUm9vdExpc3RlbmVyKCk7Ly/mraTmlrnms5XlnKhzaG935pa55rOV55qE5pe25YCZ6LCD55SoXG5cblx0XHR0aGlzLmlzQ29tcGx5ZWQgPSB0cnVlO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAgKiDmmK/lkKbljIXlkKvlhajlsYDlnZDmoIfngrlcblx0ICAqIEBwYXJhbSBneCDlhajlsYBY5Z2Q5qCHXG5cdCAgKiBAcGFyYW0gZ3kg5YWo5bGAWeWdkOagh1xuXHQgICovXG5cdHB1YmxpYyBjb250YWluc0dsb2JhbFBvaW50KGd4OiBudW1iZXIsIGd5OiBudW1iZXIpOiBib29sZWFuIHtcblxuXHRcdGxldCBscDogTGF5YS5Qb2ludCA9IHRoaXMuZ2xvYmFsVG9Mb2NhbChneCwgZ3kpO1xuXHRcdGxldCBib3VuZHM6IExheWEuUmVjdGFuZ2xlID0gbmV3IExheWEuUmVjdGFuZ2xlKDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcblx0XHRyZXR1cm4gYm91bmRzLmNvbnRhaW5zKGxwLngsIGxwLnkpO1xuXHR9XG5cblx0cHVibGljIHNldCBzZWxlY3QodmFsdWU6IGJvb2xlYW4pIHtcblxuXHRcdGlmICh0aGlzLmNhblNlbGVjdCkge1xuXHRcdFx0dGhpcy5jdXJyZW50U3RhdGUgPSB2YWx1ZSA/IFwiZG93blwiIDogXCJ1cFwiO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBnZXQgc2VsZWN0KCk6IGJvb2xlYW4ge1xuXG5cdFx0cmV0dXJuIHRoaXMuY2FuU2VsZWN0ID8gdGhpcy5jdXJyZW50U3RhdGUgPT0gXCJkb3duXCIgOiBmYWxzZTtcblx0fVxuXG5cdHB1YmxpYyBzaG93KGRhdGE6IGFueSk6IHZvaWQge1xuXG5cdFx0dGhpcy5kYXRhID0gdGhpcy5fZGF0YSA9IGRhdGE7XG5cdFx0dGhpcy5hZGRBbGxMaXN0ZW5lcigpO1xuXHR9XG5cblx0cHVibGljIGhpZGUoKTogdm9pZCB7XG5cblx0XHR0aGlzLmNsZWFyKCk7XG5cdH1cblxuXHQvKipcblx0ICAqIOmHjee9rlxuXHQgICovXG5cdHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcblxuXHRcdHN1cGVyLmNsZWFyKCk7XG5cdFx0dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcigpO1xuXHR9XG5cblx0LyoqXG5cdCAgKiDph4rmlL7otYTmupBcblx0ICAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpOiB2b2lkIHtcblxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcblx0fVxufSJdfQ==
