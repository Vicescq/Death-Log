export default abstract class Collection<T>{
    private _items: T[] = [];
    get items(){
        return this._items
    }
    set items(value){
        this._items = value;
    }

    private _name: string = "";
    get name(){
        return this._name;
    }
    set name(value){
        this._name = value;
    }
}