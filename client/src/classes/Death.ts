import type Collection from "./Collection";

export default class Death{
    private _date: Date | null;
    get date(){
        return this._date;
    }
    set date(value){
        this._date = value;
    }

    private _note: string | null;
    get note(){
        return this._note;
    }
    set note(value){
        this._note = value;
    }

    private _tags: Collection<string>;
    get tags(){
        return this._tags;
    }
    set tags(value){
        this._tags = value;
    }

    constructor(date: Date, note: string, tags: Collection<string>){
        this._date = date;
        this._note = note;
        this._tags = tags;
    }
}