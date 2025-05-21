import type Collection from "./Collection";
import type Death from "./Death";
import type Game from "./Game";
import type Profile from "./Profile";
import type Subject from "./Subject";

export type TreeNodeSerializableType = "game" | "profile" | "subject" | "death";
export type TreeNodeType<T> = Collection<T> | Death;
export type TreeNodeParentType = Game | Profile | Subject | null;

export default abstract class TreeNode {
    private _name!: string;
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }

    private _type!: TreeNodeSerializableType;
    get type() {
        return this._type
    }
    set type(value){
        this._type = value;
    }

    private _path!: string;
    get path(){
        return this._path;
    }
    set path(value){
        this._path = value;
    }

    private _id!: string;
    get id(){
        return this._id;
    }
    set id(value){
        this._id = value;
    }
}