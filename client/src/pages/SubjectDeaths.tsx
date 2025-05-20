import useGamesContext from "../hooks/useGamesContext"


export default function SubjectDeaths({gi, pi, si}: {gi: number, pi: number, si: number}){

    const [games, setGames] = useGamesContext()

    return (
        <>
        SubjectDeaths
        {gi}
        {pi}
        {si}
        </>
    )
}