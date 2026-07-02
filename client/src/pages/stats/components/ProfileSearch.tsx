import search from "../../../assets/search_black.svg";
import Pagination from "../../../components/Pagination";

export default function ProfileSearch() {
	return (
		<div className="border-base-300 bg-base-300 rounded-2xl border p-5 shadow-sm">
			<label className="fieldset-label mb-2 text-sm font-semibold">
				Searching for a specific profile?
			</label>
			<div className="join w-full">
				<input
					type="search"
					placeholder="Enter a username"
					className="input join-item w-full"
				/>
				<button
					type="button"
					className="btn btn-accent join-item btn-square"
				>
					<img src={search} className="h-5 w-5" alt="Search" />
				</button>
			</div>
			<div className="my-4 flex items-center justify-center">
				<Pagination
					currentPage={1}
					onPageChange={() => 1}
					totalPages={50}
				/>
			</div>
		</div>
	);
}
 