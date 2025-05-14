import { useLocation } from "react-router";
import Card from "../components/Card";
import Game from "../classes/Game";

export default function GameProfiles() {
    const location = useLocation();
    let objContext = new Game("sdasdsadsadsadsa", []);
    if(location.state){
         objContext = new Game(location.state._name, []); 
    }

    if (location.state) {
        return (
            <div className="flex items-center justify-center gap-2 m-8">
                <Card objContext={objContext}/>
            </div>
        )
    }
}