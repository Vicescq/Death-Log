import type { TreeStateType } from "../context";
import Collection from "./Collection";
import { v4 as uuid4 } from "uuid";
import type Death from "./Death";

export default class Subject extends Collection {

    constructor(
        name: string,
        path: string,
        ancestry: string[],
        id: string = uuid4(),
        childIDS: string[] = [],
        date: string = new Date().toString(),
    ) {
        super();
        this.name = name;
        this.type = "subject";
        this.path = path;
        this.id = id;
        this.ancestry = ancestry;
        this.childIDS = childIDS
        this.date = date;
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