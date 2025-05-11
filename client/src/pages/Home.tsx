import { useState } from "react"

export default function Home(){
    const [games, setGames] = useState([])
    const [isOpen, setIsOpen] = useState(false);


    return (

        <div className="flex items-center justify-center gap-2 m-8">
            <button onClick={() => setIsOpen(true)} type="button" className="rounded-lg border p-3 cursor-pointer"> Add game </button>
            <AddGameModal isOpen={isOpen} onClose={() => setIsOpen(false)}/>
            
        </div>
    )
}

function AddGameModal({isOpen, onClose}: {isOpen: boolean, onClose: () => void}){
    return(
        <div className={`${isOpen ? "flex" : "hidden"} justify-center items-center fixed left-0 top-0 bg-black/50  w-screen h-screen`}>
            <div className="bg-white rounded-2xl p-4 text-black flex flex-col gap-1">
                <button onClick={onClose} className="border-2 rounded-2xl p-1">Close</button>
                <button onClick={onClose} className="border-2 rounded-2xl p-1">Confirm</button>
                <input type="text" className="border-2 focus:outline-none"/>
            </div>
        </div>
    )
}