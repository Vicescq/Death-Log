type Props = {};

export default function Utility({}: Props) {

    function migrate(){
        
    }

	return (
		<div className="flex flex-col">
			<button
				className="bg-hunyadi min-w-40 rounded-2xl border-4 border-black p-1 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:min-w-80 text-black"
				onClick={() => migrate()}
			>
				MIGRATE TO ACCOUNT
			</button>
		</div>
	);
}
