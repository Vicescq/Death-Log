import Collection from "./Collection";
import type Death from "./Death";
import { v4 as uuid4 } from "uuid";

export default class Subject extends Collection<Death> {

    constructor(name: string, deaths: Death[] = [], path: string, id: string = uuid4()) {
        super();
        this.name = name;
        this.items = deaths;
        this.type = "subject";
        this.path = path;
        this.id = id;
    }

    getCount() {
        return this.items.length;
    }

    getFullTries(){
        let counter = 0; 
        for (let death of this.items){
            if (death.deathType == "fullTry"){
                counter++;
            }
        }
        return counter;
    }

    getResets(){
        let counter = 0; 
        for (let death of this.items){
            if (death.deathType == "reset"){
                counter++;
            }
        }
        return counter;
    }
}