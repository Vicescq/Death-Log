import { CHANGELOG } from "./changelog";
export default function ChangelogContainer() {
	return (
		<div>
			<h2 className="mb-3 text-xl font-semibold">Changelog</h2>
			<div className="flex flex-col gap-4">
				{CHANGELOG.map((entry) => (
					<div
						key={entry.date + entry.title}
						className="border-base-300 bg-base-200 rounded-2xl border p-4"
					>
						<div className="mb-2 flex items-baseline justify-between gap-2">
							<h3 className="font-semibold">{entry.title}</h3>
							<span className="text-xs opacity-60">
								{entry.date}
							</span>
						</div>
						<ul className="list-inside list-disc text-sm opacity-80">
							{entry.changes.map((change) => (
								<li key={change}>{change}</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}
