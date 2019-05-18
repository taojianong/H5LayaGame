import BaseSprite from "../view/component/BaseSprite";
import { EGList } from "../view/component/EGList";

/**
 * FairyGUI工具
 * @author cl 2019.5.18
 */
export class FairyUtils {

	/**
	  * 声明容器对应变量
	  * @param parent 		容器
	  * @param thisObject 	this对象
	  */
	public static setVar(parent: fairygui.GComponent, thisObject: any): void {

		if (parent != null && thisObject != null) {
			let disObj: fairygui.GObject;
			for (let i: number = 0; i < parent.numChildren; i++) { //objects
				disObj = parent.getChildAt(i);
				if (disObj.name == "icon" || disObj.name == "title") {
					continue;
				}
				if (disObj.name && disObj.name.indexOf("tab_") == 0 && disObj instanceof fairygui.GGroup) {
					// thisObject[disObj.name] = new fairui.ETab(disObj, thisObject);
					// if (thisObject instanceof BaseSprite) thisObject.addComponent(thisObject[disObj.name]);
				} else if (disObj.name && disObj.name.indexOf("eglist_") == 0 && disObj instanceof fairygui.GList) {
					thisObject[disObj.name] = new EGList(disObj, thisObject);
					if (thisObject instanceof BaseSprite) thisObject.addComponent(thisObject[disObj.name]);
				} else {
					thisObject[disObj.name] = disObj;
				}
			}

			for (let i: number = 0; i < parent._transitions.length; i++) {
				let transObj: fairygui.Transition;
				transObj = parent._transitions[i];
				thisObject[transObj.name] = transObj;
			}
		}
	}
}