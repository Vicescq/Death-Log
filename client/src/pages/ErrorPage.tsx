export default function ErrorPage({ error, resetErrorBoundary }) {

    return (

        <div className="flex items-center justify-center">
            <button onClick={() => resetErrorBoundary()}>ERROR! Click me to go back to home!</button>
        </div>


    )
}