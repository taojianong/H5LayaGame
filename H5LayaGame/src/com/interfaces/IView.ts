/**
 * 界面接口
 * @author clong 2019.5.18
 */
interface IView extends IComponent{

	/**加载初始化资源 */
	load( data:any ):void;
	/**初始化界面 */
	initUI():void;
	/**初始化界面相关数据 */
	init( data:any );
	/**自适应接口 */
	onResize():void;
	/**是否可回收 */
	isCanGc(): boolean;
}