import Collection from "./Collection";
import type Death from "./Death";

export default class Subject extends Collection<Death> {

    constructor(name: string, deaths: Death[] = []) {
        super();
        this.name = name;
        this.items = deaths;
        this.type = "subject";
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