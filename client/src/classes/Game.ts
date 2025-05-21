import Profile from "./Profile"
import Collection from "./Collection";
import { v4 as uuid4 } from "uuid";

export default class Game extends Collection<Profile>{
    
    constructor(name: string, profiles: Profile[] = [], path: string, id: string = uuid4()){
        super();
        this.name = name;
        this.items = profiles;
        this.type = "game";
        this.path = path;
        this.id = id;
    }
}