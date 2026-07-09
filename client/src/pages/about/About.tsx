import NavBar from "../../components/nav-bar/NavBar";
import Availability from "./Availability";
import ChangelogContainer from "./ChangelogContainer";

const REPO_URL = "https://github.com/Vicescq/Death-Log";

export default function About() {
	return (
		<>
			<NavBar />
			<div className="mx-auto max-w-2xl px-4 py-10">
				<h1 className="mb-6 text-3xl font-bold">About Death Log</h1>

				<div className="flex flex-col gap-8">
					<Availability />

					<ChangelogContainer />

					<div>
						<h2 className="mb-3 text-xl font-semibold">
							Source code (suggest new features, and report bugs)
						</h2>
						<a
							href={REPO_URL}
							target="_blank"
							rel="noreferrer"
							className="btn btn-outline w-full"
						>
							View on GitHub
						</a>
					</div>

					<div className="border-base-300 bg-base-200 flex items-center justify-between rounded-2xl border p-4">
						<h2 className="text-xl font-semibold">
							Support the project
						</h2>
						<a href="https://ko-fi.com/L0W522OMFY" target="_blank">
							<img
								src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
								alt="Buy Me a Coffee at ko-fi.com"
								className="h-9 w-auto"
							/>
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
