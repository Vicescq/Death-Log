import { useLocation } from "react-router";
import Card from "../components/Card";
import Game from "../classes/Game";
import { reconstructCollection } from "../utils";
import { useState } from "react";
import Profile from "../classes/Profile";
import UtilityCard from "../components/UtilityCard";

export default function GameProfiles() {
    const location = useLocation();
    let objContext = new Game("sdasdsadsadsadsa", []);
    if (location.state) {
        objContext = reconstructCollection(location.state, Game)
    }

    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [addProfileText, setaddProfileText] = useState("");
    const [delProfileText, setdelProfileText] = useState("");

    function handleAddProfileBtn() {
        if (addProfileText != "") {
            const newProfile = new Profile(addProfileText, []);
            setProfiles((prevProfiles) => [...prevProfiles, newProfile]);
        }
    }

    function handelDelProfileBtn() {
        if (delProfileText != "") {
            setProfiles((prevProfiles) => prevProfiles.filter(
                (_, index) => index !== Number(delProfileText)
            ));
        }
    }


    if (location.state) {
        return (
            <div className="flex items-center justify-center gap-2 m-8">
                <UtilityCard addOrDelStr="Add game" handleBtn={handleAddProfileBtn} handleTextChange={(event) => setaddProfileText(event.target.value)} />

                {
                    profiles.map(
                        (profile, index) => (<Card key={index} objContext={profile} />)
                    )
                }
            </div>
        )
    }
}