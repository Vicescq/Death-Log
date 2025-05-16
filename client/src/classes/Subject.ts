import Collection from "./Collection";
import type Death from "./Death";

export default class Subject extends Collection<Death>{
    
    private _count: number = 0;
    get count(){
        return this._count;
    }
    set count(value: number){
        this._count = value;
    }

    constructor(name: string, deaths: Death[]){
        super();
        this.name = name;
        this.items = deaths;
    }
}