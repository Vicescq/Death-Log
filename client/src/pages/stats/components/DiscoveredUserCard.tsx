import { Link } from "react-router";
import type { DiscoveredUser } from "../../../model/discovered-users";

export default function DiscoveredUserCard({ user }: { user: DiscoveredUser }) {
	return (
		<Link to={"/"}>
			<div className="border-base-300 bg-base-300 hover:bg-primary rounded-2xl border p-5 shadow-sm hover:border-2 hover:text-black">
				<div className="flex items-start justify-between gap-3">
					<h3 className="truncate text-lg font-bold">
						{user.username}
					</h3>
					<div className="my-auto shrink-0 text-sm">
						<span className="font-semibold">
							{user.followerCount}
						</span>{" "}
						{user.followerCount === 1 ? "follower" : "followers"}
					</div>
				</div>
			</div>
		</Link>
	);
}
