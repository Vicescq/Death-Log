import TreeNode from "./TreeNode";
import { v4 as uuid4 } from "uuid";

export type DeathType = "reset" | "fullTry"

export default class Death extends TreeNode {

    constructor(
        ancestry: string[] = [],
        note: string | null = null,
        tags: string[] = [],
        deathType: DeathType = "fullTry",
        date: string = new Date().toString(),
        id: string = uuid4(),
    ) {
        super();
        this.date = date;
        this._note = note;
        this._tags = tags;
        this._deathType = deathType;
        this.type = "death";
        this.id = id;
        this.ancestry = ancestry;
        this.childIDS = [];
    }


    private _note: string | null;
    get note() {
        return this._note;
    }
    set note(value) {
        this._note = value;
    }

    private _tags: string[];
    get tags() {
        return this._tags;
    }
    set tags(value) {
        this._tags = value;
    }

    private _deathType: DeathType;
    get deathType() {
        return this._deathType;
    }
    set deathType(value: DeathType) {
        this._deathType = value;
    }
}