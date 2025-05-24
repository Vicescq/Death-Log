import Collection from "./Collection";
import { v4 as uuid4 } from "uuid";

export default class Profile extends Collection {

    constructor(
        name: string,
        path: string,
        parentID: string,
        id: string = uuid4(),
        childIDS: string[] = [],
        date: string | null = new Date().toString(),
    ) {
        super();
        this.name = name;
        this.type = "profile";
        this.path = path;
        this.id = id;
        this.childIDS = childIDS
        this.date = date;
        this.parentID = parentID;
    }
}