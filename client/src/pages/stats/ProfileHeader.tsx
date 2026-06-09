export default function ProfileHeader() {
	return (
		<div className="border-base-300 bg-base-300 rounded-2xl border p-6 shadow-sm">
			<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="border-accent border-b-2 pb-2">
					<h1 className="text-3xl font-bold">abcdefg</h1>
				</div>

				<button className="btn btn-primary">Follow</button>
			</div>

			<div className="mt-6">
				<div className="bg-accent/10 inline-block rounded-lg px-4 py-3">
					<div className="text-accent text-2xl font-bold">42</div>
					<div className="text-xs font-semibold uppercase opacity-70">
						Followers
					</div>
				</div>
			</div>
		</div>
	);
}
