import { useAuth, useUser } from "@clerk/react";
import { UserProfile } from "@clerk/react";

export default function AccountSettings() {
	const { signOut } = useAuth();
	const { user } = useUser();
	return (
		<>
			<div className="bg-base-200 rounded-box mb-8 flex items-baseline gap-2 p-5">
				<div className="text-sm opacity-70">Signed in as</div>
				<div className="text-xl font-semibold">{user?.username}</div>
			</div>

			<div className="divider"></div>
			<div className="bg-base-200 rounded-2xl p-4">
				<UserProfile />
			</div>
			<div className="divider"></div>

			<div className="flex flex-col gap-4">
				<button
					className="btn btn-success text-xl"
					onClick={() => signOut({ redirectUrl: "/user-settings" })}
				>
					SIGN OUT
				</button>
			</div>
		</>
	);
}
