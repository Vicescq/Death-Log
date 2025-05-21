import useGamesContext from "../hooks/useGamesContext"


export default function SubjectDeaths({gameID, profileID, subjectID}: {gameID: string, profileID: string, subjectID: string}){

    const [games, setGames] = useGamesContext()

    return (
        <>
        SubjectDeaths
        </>
    )
}