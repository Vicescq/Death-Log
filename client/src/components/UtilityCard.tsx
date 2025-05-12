export default function UtilityCard({ addOrDelStr, handleBtn, handleTextChange }: { addOrDelStr: string, handleBtn: () => void, handleTextChange: (event) => void }) {
    return (
        <div className="flex rounded-lg border p-3 gap-2">

            <button type="button" onClick={handleBtn} className="rounded-lg border p-3 cursor-pointer bg-amber-800"> {addOrDelStr}</button>
            <input type="text" onChange={handleTextChange} className=" focus:outline-none border" />

        </div>
    )
}