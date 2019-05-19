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
// import BaseSprite from "./fairui/view/component/BaseSprite";
// import Global from "./Global";
var Main = /** @class */ (function () {
    function Main() {
        // Laya.init(1136, 640, Laya.WebGL);
        // laya.utils.Stat.show(0, 0);
        // //设置适配模式
        // Laya.stage.scaleMode = "showall";
        // Laya.stage.alignH = "left";
        // Laya.stage.alignV = "top";
        // //设置横竖屏
        // Laya.stage.screenMode = "horizontal";//Global.screenMode;//
        //根据IDE设置初始化引擎		
        if (window["Laya3D"]) {
            Laya3D.init(1136, 640);
        }
        else {
            Laya.init(1136, 640, Laya["WebGL"]);
        }
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.scaleMode = "showall"; //Global.scaleMode;
        Laya.stage.screenMode = "horizontal"; //Global.screenMode;
        //兼容微信不支持加载scene后缀场景
        //Laya.URL.exportSceneToJson = Global.exportSceneToJson;
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    }
    Main.prototype.onVersionLoaded = function () {
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        //Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        Laya.loader.load([
            { url: "res/fairui/common_atlas0.png", type: Laya.Loader.IMAGE },
            { url: "res/fairui/common.map", type: Laya.Loader.BUFFER }
        ], Laya.Handler.create(this, this.onLoaded));
        // let gameClient:GameClient = new GameClient();
        // gameClient.init();
        // Laya.stage.addChild( gameClient );
    };
    Main.prototype.onLoaded = function () {
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
        // let container:BaseSprite = new BaseSprite();//这里换成BaseSprite就会出问题！
        var container = new fairygui.GComponent();
        fairygui.GRoot.inst.addChild(container);
        fairygui.UIConfig.packageFileExtension = "map";
        fairygui.UIPackage.addPackage("res/fairui/common");
        // PanelRegister.registerClass( "common" , "BaseSprite" , BaseSprite );
        var obj = fairygui.UIPackage.createObject("common", "UIGMView");
        var comp = obj.asCom;
        container.addChild(comp);
        // FairyUIManager.init( Laya.stage );
        // Laya.stage.addChild( new GameClient() );
    };
    return Main;
}());
//激活启动类
new Main();
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L1Byb2dyYW0gRmlsZXMvTGF5YUFpcklERV9iZXRhL3Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9NYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1JBLCtEQUErRDtBQUMvRCxpQ0FBaUM7QUFDakM7SUFFQztRQUVDLG9DQUFvQztRQUM5Qiw4QkFBOEI7UUFDOUIsV0FBVztRQUNYLG9DQUFvQztRQUNwQyw4QkFBOEI7UUFDOUIsNkJBQTZCO1FBQzdCLFVBQVU7UUFDViw4REFBOEQ7UUFFOUQsZ0JBQWdCO1FBQ3RCLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFDO1lBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDMUI7YUFBSTtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUN2QztRQUNQLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQSxtQkFBbUI7UUFDcEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDLENBQUEsb0JBQW9CO1FBQ3pELG9CQUFvQjtRQUNwQix3REFBd0Q7UUFFeEQsZ0RBQWdEO1FBQ2hELElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNySSxDQUFDO0lBRUQsOEJBQWUsR0FBZjtRQUNDLCtDQUErQztRQUMvQyxrR0FBa0c7UUFFbEcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDakIsRUFBRSxHQUFHLEVBQUUsOEJBQThCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2hFLEVBQUUsR0FBRyxFQUFFLHVCQUF1QixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtTQUN6RCxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUU3QyxnREFBZ0Q7UUFDaEQscUJBQXFCO1FBQ3JCLHFDQUFxQztJQUN0QyxDQUFDO0lBRUQsdUJBQVEsR0FBUjtRQUVDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXZELHFFQUFxRTtRQUNyRSxJQUFJLFNBQVMsR0FBdUIsSUFBSSxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDOUQsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFFLFNBQVMsQ0FBRSxDQUFDO1FBRTFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO1FBQy9DLFFBQVEsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFFLG1CQUFtQixDQUFFLENBQUM7UUFFckQsdUVBQXVFO1FBRXZFLElBQUksR0FBRyxHQUFxQixRQUFRLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBRSxRQUFRLEVBQUcsVUFBVSxDQUFFLENBQUM7UUFDckYsSUFBSSxJQUFJLEdBQU8sR0FBRyxDQUFDLEtBQUssQ0FBQztRQUN6QixTQUFTLENBQUMsUUFBUSxDQUFFLElBQUksQ0FBRSxDQUFDO1FBRzNCLHFDQUFxQztRQUVyQywyQ0FBMkM7SUFDNUMsQ0FBQztJQU1GLFdBQUM7QUFBRCxDQXZFQSxBQXVFQyxJQUFBO0FBQ0QsT0FBTztBQUNQLElBQUksSUFBSSxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEdhbWVDbGllbnQgZnJvbSBcIi4vR2FtZUNsaWVudFwiO1xyXG5pbXBvcnQgUGFuZWxSZWdpc3RlciBmcm9tIFwiLi9mYWlydWkvUGFuZWxSZWdpc3RlclwiO1xyXG4vLyBpbXBvcnQgQmFzZVNwcml0ZSBmcm9tIFwiLi9mYWlydWkvdmlldy9jb21wb25lbnQvQmFzZVNwcml0ZVwiO1xyXG4vLyBpbXBvcnQgR2xvYmFsIGZyb20gXCIuL0dsb2JhbFwiO1xyXG5jbGFzcyBNYWluIHtcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblxyXG5cdFx0Ly8gTGF5YS5pbml0KDExMzYsIDY0MCwgTGF5YS5XZWJHTCk7XHJcbiAgICAgICAgLy8gbGF5YS51dGlscy5TdGF0LnNob3coMCwgMCk7XHJcbiAgICAgICAgLy8gLy/orr7nva7pgILphY3mqKHlvI9cclxuICAgICAgICAvLyBMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IFwic2hvd2FsbFwiO1xyXG4gICAgICAgIC8vIExheWEuc3RhZ2UuYWxpZ25IID0gXCJsZWZ0XCI7XHJcbiAgICAgICAgLy8gTGF5YS5zdGFnZS5hbGlnblYgPSBcInRvcFwiO1xyXG4gICAgICAgIC8vIC8v6K6+572u5qiq56uW5bGPXHJcbiAgICAgICAgLy8gTGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gXCJob3Jpem9udGFsXCI7Ly9HbG9iYWwuc2NyZWVuTW9kZTsvL1xyXG5cclxuICAgICAgICAvL+agueaNrklEReiuvue9ruWIneWni+WMluW8leaTjlx0XHRcclxuXHRcdGlmICh3aW5kb3dbXCJMYXlhM0RcIl0pe1xyXG4gICAgICAgICAgICBMYXlhM0QuaW5pdCgxMTM2LCA2NDApO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBMYXlhLmluaXQoMTEzNiwgNjQwLCBMYXlhW1wiV2ViR0xcIl0pO1xyXG4gICAgICAgIH0gXHJcblx0XHRMYXlhW1wiUGh5c2ljc1wiXSAmJiBMYXlhW1wiUGh5c2ljc1wiXS5lbmFibGUoKTtcclxuXHRcdExheWFbXCJEZWJ1Z1BhbmVsXCJdICYmIExheWFbXCJEZWJ1Z1BhbmVsXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBcInNob3dhbGxcIjsvL0dsb2JhbC5zY2FsZU1vZGU7XHJcblx0XHRMYXlhLnN0YWdlLnNjcmVlbk1vZGUgPSBcImhvcml6b250YWxcIjsvL0dsb2JhbC5zY3JlZW5Nb2RlO1xyXG5cdFx0Ly/lhbzlrrnlvq7kv6HkuI3mlK/mjIHliqDovb1zY2VuZeWQjue8gOWcuuaZr1xyXG5cdFx0Ly9MYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdsb2JhbC5leHBvcnRTY2VuZVRvSnNvbjtcclxuXHRcdFxyXG5cdFx0Ly/mv4DmtLvotYTmupDniYjmnKzmjqfliLbvvIx2ZXJzaW9uLmpzb27nlLFJREXlj5HluIPlip/og73oh6rliqjnlJ/miJDvvIzlpoLmnpzmsqHmnInkuZ/kuI3lvbHlk43lkI7nu63mtYHnqItcclxuXHRcdExheWEuUmVzb3VyY2VWZXJzaW9uLmVuYWJsZShcInZlcnNpb24uanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25WZXJzaW9uTG9hZGVkKSwgTGF5YS5SZXNvdXJjZVZlcnNpb24uRklMRU5BTUVfVkVSU0lPTik7XHJcblx0fVxyXG5cclxuXHRvblZlcnNpb25Mb2FkZWQoKTogdm9pZCB7XHJcblx0XHQvL+a/gOa0u+Wkp+Wwj+WbvuaYoOWwhO+8jOWKoOi9veWwj+WbvueahOaXtuWAme+8jOWmguaenOWPkeeOsOWwj+WbvuWcqOWkp+WbvuWQiOmbhumHjOmdou+8jOWImeS8mOWFiOWKoOi9veWkp+WbvuWQiOmbhu+8jOiAjOS4jeaYr+Wwj+WbvlxyXG5cdFx0Ly9MYXlhLkF0bGFzSW5mb01hbmFnZXIuZW5hYmxlKFwiZmlsZWNvbmZpZy5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkNvbmZpZ0xvYWRlZCkpO1xyXG5cclxuXHRcdExheWEubG9hZGVyLmxvYWQoW1xyXG5cdFx0eyB1cmw6IFwicmVzL2ZhaXJ1aS9jb21tb25fYXRsYXMwLnBuZ1wiLCB0eXBlOiBMYXlhLkxvYWRlci5JTUFHRSB9LFxyXG5cdFx0eyB1cmw6IFwicmVzL2ZhaXJ1aS9jb21tb24ubWFwXCIsIHR5cGU6IExheWEuTG9hZGVyLkJVRkZFUiB9XHJcblx0XHRdLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Mb2FkZWQpKTtcclxuXHJcblx0XHQvLyBsZXQgZ2FtZUNsaWVudDpHYW1lQ2xpZW50ID0gbmV3IEdhbWVDbGllbnQoKTtcclxuXHRcdC8vIGdhbWVDbGllbnQuaW5pdCgpO1xyXG5cdFx0Ly8gTGF5YS5zdGFnZS5hZGRDaGlsZCggZ2FtZUNsaWVudCApO1xyXG5cdH1cclxuXHJcblx0b25Mb2FkZWQoKTp2b2lke1xyXG5cclxuXHRcdExheWEuc3RhZ2UuYWRkQ2hpbGQoZmFpcnlndWkuR1Jvb3QuaW5zdC5kaXNwbGF5T2JqZWN0KTtcclxuXHJcblx0XHQvLyBsZXQgY29udGFpbmVyOkJhc2VTcHJpdGUgPSBuZXcgQmFzZVNwcml0ZSgpOy8v6L+Z6YeM5o2i5oiQQmFzZVNwcml0ZeWwseS8muWHuumXrumimO+8gVxyXG5cdFx0bGV0IGNvbnRhaW5lcjpmYWlyeWd1aS5HQ29tcG9uZW50ID0gbmV3IGZhaXJ5Z3VpLkdDb21wb25lbnQoKTtcclxuXHRcdGZhaXJ5Z3VpLkdSb290Lmluc3QuYWRkQ2hpbGQoIGNvbnRhaW5lciApO1xyXG5cclxuXHRcdGZhaXJ5Z3VpLlVJQ29uZmlnLnBhY2thZ2VGaWxlRXh0ZW5zaW9uID0gXCJtYXBcIjtcclxuXHRcdGZhaXJ5Z3VpLlVJUGFja2FnZS5hZGRQYWNrYWdlKCBcInJlcy9mYWlydWkvY29tbW9uXCIgKTtcclxuXHRcdFxyXG5cdFx0Ly8gUGFuZWxSZWdpc3Rlci5yZWdpc3RlckNsYXNzKCBcImNvbW1vblwiICwgXCJCYXNlU3ByaXRlXCIgLCBCYXNlU3ByaXRlICk7XHJcblxyXG5cdFx0bGV0IG9iajogZmFpcnlndWkuR09iamVjdCA9IGZhaXJ5Z3VpLlVJUGFja2FnZS5jcmVhdGVPYmplY3QoIFwiY29tbW9uXCIgLCBcIlVJR01WaWV3XCIgKTtcclxuXHRcdGxldCBjb21wOmFueSA9IG9iai5hc0NvbTtcclxuXHRcdGNvbnRhaW5lci5hZGRDaGlsZCggY29tcCApO1xyXG5cclxuXHJcblx0XHQvLyBGYWlyeVVJTWFuYWdlci5pbml0KCBMYXlhLnN0YWdlICk7XHJcblxyXG5cdFx0Ly8gTGF5YS5zdGFnZS5hZGRDaGlsZCggbmV3IEdhbWVDbGllbnQoKSApO1xyXG5cdH1cclxuXHJcblx0Ly8gb25Db25maWdMb2FkZWQoKTogdm9pZCB7XHJcblx0Ly8gXHQvL+WKoOi9vUlEReaMh+WumueahOWcuuaZr1xyXG5cdC8vIFx0R2FtZUNvbmZpZy5zdGFydFNjZW5lICYmIExheWEuU2NlbmUub3BlbihHYW1lQ29uZmlnLnN0YXJ0U2NlbmUpO1xyXG5cdC8vIH1cclxufVxyXG4vL+a/gOa0u+WQr+WKqOexu1xyXG5uZXcgTWFpbigpO1xyXG4iXX0=
