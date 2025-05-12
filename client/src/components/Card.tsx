export default function Card({name}: {name: string}) {

    return (
        <>
            <div className="flex rounded-lg border p-3 gap-2">
                {name}
            </div>
        </>
    )
}