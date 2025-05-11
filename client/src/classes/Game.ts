import Profile from "./Profile"
import Collection from "./Collection";

export default class Game extends Collection<Profile>{
    
    constructor(name: string, profiles: Profile[]){
        super();
        this.name = name;
        this.collection = profiles;
    }
}