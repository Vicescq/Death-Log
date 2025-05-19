type DeathType = "reset" | "fullTry"

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

    private _tags: string[];
    get tags(){
        return this._tags;
    }
    set tags(value){
        this._tags = value;
    }

    private _deathType: DeathType;
    get resets(){
        return this._deathType;
    }
    set resets(value: DeathType){
        this._deathType = value;
    }

    constructor(date: Date, note: string, tags: string[], deathType: DeathType = "fullTry"){
        this._date = date;
        this._note = note;
        this._tags = tags;
        this._deathType = deathType;
    }
}