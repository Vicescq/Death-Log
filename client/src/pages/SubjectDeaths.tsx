import useGamesContext from "../hooks/useTreeContext"


export default function SubjectDeaths({subjectID}: {subjectID: string}){

    const [games, setGames] = useGamesContext()

    return (
        <>
        SubjectDeaths
        </>
    )
}