import { useState } from "react"
import type { TreeNodeSerializableType } from "../classes/TreeNode";
type Props = {
    handleAdd: (inputText: string, autoDate?: boolean, notable?: boolean) => void;
    itemType: TreeNodeSerializableType;
}


export default function AddItemCard({ handleAdd, itemType }: Props) {

    const [inputText, setInputText] = useState("");



    return (

        <header className="flex gap-10 border-4 p-4 mb-8 border-black text-black bg-amber-200 shadow-[8px_5px_0px_rgba(0,0,0,1)]">
                <button className="font-bold text-2xl border-4 rounded-2xl p-1 sm:px-10 shadow-[8px_5px_0px_rgba(0,0,0,1)] hover:shadow-[15px_8px_0px_rgba(0,0,0,1)]" onClick={() => {handleAdd(inputText)}}>
                    Add
                </button>
                <button className="font-bold text-2xl border-4 rounded-2xl p-1 px-10 shadow-[8px_5px_0px_rgba(0,0,0,1)] hover:shadow-[15px_8px_0px_rgba(0,0,0,1)]">
                    Add
                </button>
                <button className="font-bold text-2xl border-4 rounded-2xl p-1 px-10 shadow-[8px_5px_0px_rgba(0,0,0,1)] hover:shadow-[15px_8px_0px_rgba(0,0,0,1)]">
                    Add
                </button>
                <input type="text" className="border-2" onChange={((e) => setInputText(e.target.value))}/>
        </header>
    )
}