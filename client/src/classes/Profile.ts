import Collection from "./Collection";
import { v4 as uuid4 } from "uuid";

export default class Profile extends Collection {

    constructor(
        name: string,
        path: string,
        ancestry: string[],
        id: string = uuid4(),
        childIDS: string[] = [],
        date: string = new Date().toString(),
    ) {
        super();
        this.name = name;
        this.type = "profile";
        this.path = path;
        this.id = id;
        this.ancestry = ancestry;
        this.childIDS = childIDS
        this.date = date;
    }
}