export default function ErrorPage({ error, resetErrorBoundary }: {error: Error, resetErrorBoundary: any}) {

    return (

        <div className="flex flex-col items-center justify-center">
            <button onClick={() => resetErrorBoundary()}>ERROR! Click me to go back to home!</button>
            <span className="my-9">{error.message}</span>
        </div>
    )
}

export function ForceError({msg}: {msg: string}){
    throw new Error(msg);
    return(
        <>
        </>
    )
}