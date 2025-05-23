import { useState } from "react"
import type { TreeNodeSerializableType } from "../classes/TreeNode";
export default function AddItemCard({handleAdd, itemType}: {handleAdd: (inputText: string) => void, itemType: TreeNodeSerializableType}) {

    const [inputText, setInputText] = useState("");



    return (
        <div className="flex rounded-lg border p-3 gap-2">

            <button type="button" onClick={() => handleAdd(inputText)} className="rounded-lg border p-3 cursor-pointer bg-amber-800">Add {itemType}</button>
            <input type="text" onChange={(event) => setInputText((event.target.value))} className=" focus:outline-none border" />

        </div>
    )
}