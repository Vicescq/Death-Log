export type TreeNodeSerializableType = "game" | "profile" | "subject" | "death";

export default abstract class TreeNode {

    private _type!: TreeNodeSerializableType;
    get type() {
        return this._type
    }
    set type(value){
        this._type = value;
    }

    private _id!: string;
    get id(){
        return this._id;
    }
    set id(value){
        this._id = value;
    }
}