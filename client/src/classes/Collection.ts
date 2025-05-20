import type { GamesStateCustomTypes } from "../context";
import type Game from "./Game";
import type Profile from "./Profile";
import type Subject from "./Subject";

export type GamesStateParentNodes = Game | Profile | Subject | null;

export default abstract class Collection<T>{
    private _items!: T[];
    get items(){
        return this._items
    }
    set items(value){
        this._items = value;
    }

    private _name!: string;
    get name(){
        return this._name;
    }
    set name(value){
        this._name = value;
    }

    private _type!: GamesStateCustomTypes; // make sure to implement death as a collection subclass!
    get type(){
        return this._type;
    }
    set type(value: GamesStateCustomTypes){
        this._type = value;
    }

    getSlug(){
        return this._name.replaceAll(" ", "-");
    }
}