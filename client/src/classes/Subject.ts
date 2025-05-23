import Collection from "./Collection";
import { v4 as uuid4 } from "uuid";

export default class Subject extends Collection {

    constructor(
        name: string,
        path: string,
        parentID: string,
        notable: boolean = true,
        fullTries: number = 0,
        resets: number = 0,
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
        this.notable = notable;
        this.parentID = parentID;
        this.fullTries = fullTries;
        this.resets = resets;
    }

    private _notable!: boolean;
    get notable(){
        return this._notable;
    }
    set notable(value){
        this._notable = value;
    }

    private _fullTries!: number;
    get fullTries(){
        return this._fullTries;
    }
    set fullTries(value){
        this._fullTries = value;
    }

    private _resets!: number;
    get resets(){
        return this._resets;
    }
    set resets(value){
        this._resets = value;
    }
    
    getCount() {
        return this.childIDS.length;
    }
}