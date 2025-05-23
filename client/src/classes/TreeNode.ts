export type TreeNodeSerializableType = "root" | "game" | "profile" | "subject" | "death";

export default abstract class TreeNode {

    private _type!: TreeNodeSerializableType;
    get type() {
        return this._type
    }
    set type(value) {
        this._type = value;
    }

    private _id!: string;
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }

    private _childIDS!: string[];
    get childIDS() {
        return this._childIDS;
    }
    set childIDS(value) {
        this._childIDS = value;
    }

    private _date!: string | null;
    get date() {
        return this._date;
    }
    set date(value) {
        this._date = value;
    }

    private _parentID!: string | null;
    get parentID(){
        return this._parentID;
    }
    set parentID(value){
        this._parentID = value;
    }

}