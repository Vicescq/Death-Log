import { useState } from "react";
import Game from "../classes/Game";

export default function Home(){

    // add init for games for persistence

    const [games, setGames] = useState<Game[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    function handleCloseTextModal(){
        const input = document.getElementById("addGameModalInput") as HTMLInputElement;
        input.value = "";
        setIsOpen(false);
    }

    function handleConfirmTextModal(){
        const input = document.getElementById("addGameModalInput") as HTMLInputElement;
        if (input.value){
            const newGame = new Game(input.value, []);
            setGames(prevGames => [...prevGames, newGame]);
        }
        handleCloseTextModal()

    }

    console.log(games)
    return (

        <div className="flex items-center justify-center gap-2 m-8">
            <button onClick={() => setIsOpen(true)} type="button" className="rounded-lg border p-3 cursor-pointer"> Add game </button>
            <button type="button" className="rounded-lg border p-3 cursor-pointer"> Delete game </button>
            <AddGameModal isOpen={isOpen} onClose={() => handleCloseTextModal()} onConfirm={() => handleConfirmTextModal()}/>
            {games.map((game, index) => (
                <GameCard 
                key={index}
                name={game.name}
                />
            ))}
        </div>
    )
}

function AddGameModal({isOpen, onClose, onConfirm}: {isOpen: boolean, onClose: () => void, onConfirm: () => void}){
    return(
        <div className={`${isOpen ? "flex" : "hidden"} justify-center items-center fixed left-0 top-0 bg-black/50  w-screen h-screen`}>
            <div className="bg-white rounded-2xl p-4 text-black flex flex-col gap-1">
                <button onClick={onClose} className="border-2 rounded-2xl p-1">Close</button>
                <button onClick={onConfirm} className="border-2 rounded-2xl p-1">Confirm</button>
                <input type="text" id="addGameModalInput" className="border-2 focus:outline-none"/>
            </div>
        </div>
    )
}

function DeleteGameModal({isOpen}: {isOpen: boolean}){
    <div className={`${isOpen ? "flex" : "hidden"} justify-center items-center fixed left-0 top-0 bg-black/50  w-screen h-screen`}>
        abc
    </div>
}

function GameCard({name}: {name: string}){
    return(
        <div className="rounded-lg border p-3 cursor-pointer">{name}</div>
    )
}

