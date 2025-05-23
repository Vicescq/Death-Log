import type { TreeStateType } from "../context";
import Collection from "./Collection";
import { v4 as uuid4 } from "uuid";
import type Death from "./Death";

export default class Subject extends Collection {

    constructor(
        name: string,
        path: string,
        parentID: string,
        notable: boolean = true,
        id: string = uuid4(),
        childIDS: string[] = [],
        date: string = new Date().toString(),
    ) {
        super();
        this.name = name;
        this.type = "subject";
        this.path = path;
        this.id = id;
        this.childIDS = childIDS
        this.date = date;
        this._notable = notable;
        this.parentID = parentID;
    }

    private _notable: boolean;
    get notable(){
        return this._notable;
    }
    set notable(value){
        this._notable = value;
    }

    getCount() {
        return this.childIDS.length;
    }

    getFullTries(tree: TreeStateType){
        let counter = 0; 
        for (let deathID of this.childIDS){
            const node = tree.get(deathID);
            const deathObj = node as Death;
            if (deathObj.deathType == "fullTry"){
                counter++;
            }
        }
        return counter;
    }

    getResets(tree: TreeStateType){
        let counter = 0; 
        for (let deathID of this.childIDS){
            const node = tree.get(deathID);
            const deathObj = node as Death;
            if (deathObj.deathType == "reset"){
                counter++;
            }
        }
        return counter;
    }
}