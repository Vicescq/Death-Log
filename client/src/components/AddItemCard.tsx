import { useState } from "react"
import type { TreeNodeSerializableType } from "../classes/TreeNode";
import CheckMark from "./CheckMark";
import gear from "../assets/gear.svg"
import filter from "../assets/filter.svg"

type Props = {
    handleAdd: (inputText: string, autoDate?: boolean, notable?: boolean) => void;
    itemType: TreeNodeSerializableType;
}


export default function AddItemCard({ handleAdd, itemType }: Props) {

    const [inputText, setInputText] = useState("");

    const firstLetterCapitalized = itemType[0].toUpperCase() + itemType.slice(1);

    return (

        <header className="flex flex-col w-72 md:w-lg gap-4 border-4 p-4 mb-8 border-black text-black bg-amber-200 shadow-[8px_5px_0px_rgba(0,0,0,1)]">
            <div className="flex gap-4">
                <input type="search" className="w-full border-2 rounded-xl p-1 shadow-[8px_5px_0px_rgba(0,0,0,1)]" onChange={((e) => setInputText(e.target.value))} />
                <button className=" font-bold ml-auto bg-zomp text-2xl border-4 shadow-[4px_2px_0px_rgba(0,0,0,1)] " >
                    <img src={gear} alt="" className="w-10"/>
                </button>

            </div>
            <div className="flex gap-4">
                <button className="font-bold bg-zomp w-full text-2xl border-4 rounded-2xl shadow-[4px_2px_0px_rgba(0,0,0,1)] " onClick={() => handleAdd(inputText)}>
                    Add {firstLetterCapitalized}
                </button>
                <button className="font-bold ml-auto bg-zomp text-2xl border-4 shadow-[4px_2px_0px_rgba(0,0,0,1)] " >
                    <img src={filter} alt="" className="w-10"/>
                </button>

            </div>

            {/* <div className="flex items-center">
                <span className="font-bold text-lg bg-indianred border-2 rounded-2xl px-2 w-37 shadow-[8px_5px_0px_rgba(0,0,0,1)]">Auto Date Time</span>
                <CheckMark/>
            </div>
            <div className="flex items-center">
                <span className="font-bold text-lg bg-indianred border-2 w-37 rounded-2xl px-2 shadow-[8px_5px_0px_rgba(0,0,0,1)]">Notable</span>
                <CheckMark/>
            </div> */}

        </header>
    )
}