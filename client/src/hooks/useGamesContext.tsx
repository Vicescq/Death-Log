import { useContext } from "react";
import { GamesContext } from "../context";

export default function useGamesContext() {
    const gamesContext = useContext(GamesContext);
    if (gamesContext === undefined) {
        throw new Error("DEVELOPMENT ERROR! MAKE SURE TO INSTANTIATE GamesContext to be undefined in context.tsx!");
    }
    return gamesContext;
}