import Collection from "./Collection";
import { v4 as uuid4 } from "uuid";

export default class Game extends Collection {

    constructor(
        name: string, 
        path: string, 
        parentID: string,
        childIDS: string[] = [],
        id: string = uuid4(), 
        date: string | null = new Date().toString(),
    ) {
        super();
        this.name = name;
        this.type = "game";
        this.path = path;
        this.childIDS = childIDS
        this.id = id;
        this.date = date;
        this.parentID = parentID;
    }
}