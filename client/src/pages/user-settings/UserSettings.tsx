import { Link } from "react-router";
import { ClerkLoaded, useUser } from "@clerk/react";
import NavBar from "../../components/nav-bar/NavBar";
import Spinner from "../../components/Spinner";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import AccountSettings from "./AccountSettings";
import AuthCard from "./AuthCard";

export default function UserSettings() {
	const { isLoaded, isSignedIn } = useUser();
	const online = useOnlineStatus();

	return (
		<>
			<NavBar />
			<div className="bg-base-100 mt-14 flex flex-col items-center justify-center">
				<div className="mb-12">
					<h1 className="mb-10 text-center text-5xl font-bold underline">
						User Settings
					</h1>

					{!online ? (
						<div className="btn-warning btn w-full text-sm">
							You're offline, reconnect in order to access these
							settings.
						</div>
					) : isSignedIn ? (
						<ClerkLoaded>
							<AccountSettings />
						</ClerkLoaded>
					) : !isLoaded ? (
						<Spinner className="flex justify-center py-8" />
					) : (
						<AuthCard />
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
