import { useLocation } from "react-router";
import Card from "../components/Card";
import Game from "../classes/Game";
import { reconstructCollection } from "../utils";

export default function GameProfiles() {
    const location = useLocation();
    let objContext = new Game("sdasdsadsadsadsa", []);
    if (location.state) {
        objContext = reconstructCollection(location.state, Game)
    }
    console.log(objContext)
    if (location.state) {
        return (
            <div className="flex items-center justify-center gap-2 m-8">
                <Card objContext={objContext} />
            </div>
        )
    }
}