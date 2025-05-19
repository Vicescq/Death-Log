import Collection from "./Collection";
import type Death from "./Death";

export default class Subject extends Collection<Death> {

    private _fullTries: number = 0;
    get fullTries() {
        return this._fullTries;
    }
    set fullTries(value: number) {
        this._fullTries = value;
    }

    private _resets: number = 0;
    get resets() {
        return this._resets;
    }
    set resets(value: number) {
        this._resets = value;
    }

    constructor(name: string, deaths: Death[] = [], fullTries: number = 0, resets: number = 0) {
        super();
        this.name = name;
        this.items = deaths;
        this.type = "subject";
        this._fullTries = fullTries;
        this._resets = resets;
    }

    getCount() {
        return this._fullTries + this._resets;;
    }
}