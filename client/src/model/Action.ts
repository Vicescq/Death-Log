import type TreeNode from "./TreeNode";

export type ActionType = "add" | "delete" | "update" | "toBeUpdated";

export default class Action {
    constructor(type: ActionType, targets: (TreeNode | string)[]) {
        this._type = type;
        this._targets = targets;
    };

    private _type: ActionType;
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }

    private _targets: (TreeNode | string)[];
    public get targets() {
        return this._targets;
    }
    public set targets(value) {
        this._targets = value;
    }
}