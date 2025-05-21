import TreeNode from "./TreeNode";

export default abstract class Collection<T> extends TreeNode{
    private _items!: T[];
    get items(){
        return this._items
    }
    set items(value){
        this._items = value;
    }
}