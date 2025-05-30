import { useState } from "react"
import type { TreeNodeSerializableType } from "../classes/TreeNode";

type Props = {
    handleAdd: (inputText: string, autoDate?: boolean, notable?: boolean) => void;
    itemType: TreeNodeSerializableType;
}


export default function AddItemCard({ handleAdd, itemType }: Props) {

    const [inputText, setInputText] = useState("");

    const firstLetterCapitalized = itemType[0].toUpperCase() + itemType.slice(1);

    return (

        <header className="flex flex-col w-72 md:w-lg gap-4 border-4 p-4 mb-8 border-black text-black bg-amber-200 shadow-[8px_5px_0px_rgba(0,0,0,1)]">
            <input type="search" className="border-2 rounded-xl p-1 shadow-[8px_5px_0px_rgba(0,0,0,1)]" onChange={((e) => setInputText(e.target.value))} />
            <button className="font-bold bg-zomp text-2xl border-4 rounded-2xl shadow-[4px_2px_0px_rgba(0,0,0,1)] " onClick={() => handleAdd(inputText)}>
                Add {firstLetterCapitalized}
            </button>
            <div className="flex items-center">
                <span className="font-bold text-lg bg-indianred border-2 rounded-2xl px-2 shadow-[8px_5px_0px_rgba(0,0,0,1)]">Auto Date Time</span>
                <span className="ml-auto items-center">abc</span>
            </div>
            <div className="flex items-center">
                <span className="font-bold text-lg bg-indianred border-2 rounded-2xl px-2 shadow-[8px_5px_0px_rgba(0,0,0,1)]">Notable</span>
                <span className="ml-auto items-center">abc</span>
            </div>

        </header>
    )
}