import Collection from "./Collection";
import type Death from "./Death";

export default class Subject extends Collection<Death>{
    
    constructor(name: string, deaths: Death[]){
        super();
        this.name = name;
        this.items = deaths;
    }
}