/**
 * 资源接口
 * @author clong 2019.5.18
 */
interface IResource extends IPool{

    url;

    dispose():void;

    getRes( isCount:boolean ):any;

    canGc():boolean;

    load():void;

    isLoaded():boolean;
}