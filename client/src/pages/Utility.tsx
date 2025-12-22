import LocalDB from "../services/LocalDB";

type Props = {};

export default function Utility({}: Props) {
	function migrate() {}

	function exportDL() {
		LocalDB.getNodes().then((nodes) => {
			
			const blob = new Blob([JSON.stringify(nodes)], {
				type: "application/json",
			});
			const url = URL.createObjectURL(blob);

			const a = document.createElement("a");
			a.href = url;
			const iso = new Date().toISOString();
			a.download = `deathLog_${iso}.json`;
			a.click();
			URL.revokeObjectURL(url);
		});
	}

	async function importDL(){
		// await LocalDB.clearDataByEmail()
		// await 
	}

	return (
		<div className="flex flex-col">
			<button
				className="bg-hunyadi min-w-40 rounded-2xl border-4 border-black p-1 font-bold text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:min-w-80"
				onClick={() => migrate()}
			>
				MIGRATE TO ACCOUNT
			</button>
			<button
				className="bg-hunyadi min-w-40 rounded-2xl border-4 border-black p-1 font-bold text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:min-w-80"
				onClick={() => exportDL()}
			>
				EXPORT!
			</button>
			<button
				className="bg-hunyadi min-w-40 rounded-2xl border-4 border-black p-1 font-bold text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:min-w-80"
				onClick={() => importDL()}
			>
				IMPORT!
			</button>
		</div>
	);
}
