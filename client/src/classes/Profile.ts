import Collection from "./Collection";
import Subject from "./Subject";
import { v4 as uuid4 } from "uuid";

export default class Profile extends Collection<Subject>{
  
    constructor(name: string, subjects: Subject[] = [], path: string, id: string = uuid4()){
        super();
        this.name = name;
        this.items = subjects;
        this.type = "profile";
        this.path = path;
        this.id = id;
    }
}