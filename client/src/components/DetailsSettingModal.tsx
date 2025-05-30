export default function DetailsSettingModal({ addItemCardModalRef }: { addItemCardModalRef: React.RefObject<HTMLDialogElement | null> }) {
    return (
        <dialog ref={addItemCardModalRef} className="m-auto text-xl bg-zomp backdrop-blur-3xl  p-10 border-black border-4 shadow-[8px_5px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col gap-8">

                <div >
                    <span className="mr-auto">ENTER NAME</span>
                    <input type="text" className="border-4 rounded-xl bg-amber-200" />
                </div>
                <button className=" outline-0 border-4 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[8px_5px_0px_rgba(0,0,0,1)] border- rounded-2xl p-2 font-bold bg-amber-200" onClick={() => addItemCardModalRef.current?.close()}>CLOSE</button>

            </div>
        </dialog>
    )
}