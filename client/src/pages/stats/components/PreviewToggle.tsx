import { useNavigate } from "react-router";
import { useUser } from "@clerk/react";
import { useStatsContext } from "../hooks/useStatsContext";

export default function PreviewToggle() {
	const ctx = useStatsContext();
	const { user } = useUser();
	const navigate = useNavigate();

	const myUsername = user?.username;
	if (!myUsername) return null;

	if (ctx.isSharedPage && ctx.username !== myUsername) return null;

	const previewing = ctx.isSharedPage;

	return (
		<div className="mb-4 flex justify-end">
			<label className="flex cursor-pointer items-center gap-2">
				<span className="text-sm font-semibold">Public preview</span>
				<input
					type="checkbox"
					className="toggle toggle-sm"
					checked={previewing}
					onChange={() =>
						navigate(
							previewing
								? "/stats"
								: `/profiles/${myUsername}/stats`,
						)
					}
				/>
			</label>
		</div>
	);
}
