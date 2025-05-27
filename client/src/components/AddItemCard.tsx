import { useState } from "react"
import type { TreeNodeSerializableType } from "../classes/TreeNode";
type Props = {
    handleAdd(inputText: string, autoDate?: boolean, notable?: boolean): void;
    itemType: TreeNodeSerializableType;
}


export default function AddItemCard({ handleAdd, itemType }: Props) {

    const [inputText, setInputText] = useState("");



    return (
        <div className="flex rounded-lg border p-3 gap-2">
            {itemType == "subject" ?
                (
                    <button type="button" onClick={() => handleAdd(inputText, false, false)} className="rounded-lg border p-1 cursor-pointer bg-amber-800">Add Non Notable</button>
                )
                : null}
            <button type="button" onClick={() => handleAdd(inputText, false)} className="rounded-lg border p-1 cursor-pointer bg-amber-800">No Date Time</button>
            <button type="button" onClick={() => handleAdd(inputText)} className="rounded-lg border p-3 cursor-pointer bg-amber-800">Add {itemType}</button>
            <input type="text" onChange={(event) => setInputText((event.target.value))} className=" focus:outline-none border" />

        </div>
    )
}