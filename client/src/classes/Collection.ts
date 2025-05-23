import TreeNode from "./TreeNode";

export default abstract class Collection extends TreeNode {
    
    private _path!: string;
    get path() {
        return this._path;
    }
    set path(value) {
        this._path = value;
    }

    private _name!: string;
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
}