import Collection from "./Collection";
import Subject from "./Subject";

export default class Profile extends Collection<Subject>{
  
    constructor(name: string, subjects: Subject[]){
        super();
        this.name = name;
        this.collection = subjects;
    }
}