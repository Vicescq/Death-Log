import { v4 as uuid4 } from "uuid";
import TreeNode from "./TreeNode";

export type DeathType = "fullTry" | "reset";

export default class Subject extends TreeNode {

    constructor(
        name: string,
        parentID: string,
        notable: boolean = true,
        fullTries: number = 0,
        resets: number = 0,
        id: string = uuid4(),
        date: string | null = new Date().toString(),
        completed: boolean = false
    ) {
        super();
        this.name = name;
        this.type = "subject";
        this.id = id;
        this.date = date;
        this.notable = notable;
        this.parentID = parentID;
        this.fullTries = fullTries;
        this.resets = resets;
        this.path = "";
        this.childIDS = [];
        this.completed = completed;
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
    
    getDeaths() {
        return this.resets + this.fullTries;
    }
}