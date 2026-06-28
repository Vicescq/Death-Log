import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import NavBar from "../../components/nav-bar/NavBar";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import AccountSettings from "./AccountSettings";
import SignInCard from "./SignInCard";

export default function UserSettings() {
	const { isLoaded, isSignedIn } = useUser();
	const online = useOnlineStatus();

	return (
		<>
			<NavBar />
			<div className="bg-base-100 mt-14 flex items-center justify-center">
				<div className="w-76 sm:w-md">
					<h1 className="mb-10 text-5xl font-bold underline sm:text-center">
						{isSignedIn ? "User Settings" : "Account"}
					</h1>

					{isSignedIn ? (
						<AccountSettings />
					) : !isLoaded && online ? (
						<div className="flex justify-center py-8">
							<span className="loading loading-spinner loading-lg" />
						</div>
					) : (
						<SignInCard />
					)}

					<div className="divider"></div>
					<p className="mb-3 text-sm opacity-70 sm:text-center">
						Looking to manage local data on this device (import,
						export, reset)?
					</p>
					<Link
						to={{ pathname: "/data-management" }}
						className="btn btn-outline w-full"
					>
						GO TO DATA MANAGEMENT
					</Link>
				</div>
			</div>
		</>
	);
}
