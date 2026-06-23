import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
	ClerkDegraded,
	ClerkFailed,
	ClerkLoaded,
	ClerkLoading,
	useClerk,
	useUser,
} from "@clerk/clerk-react";
import { isClerkAPIResponseError } from "@clerk/clerk-react/errors";
import NavBar from "../components/nav-bar/NavBar";
import Modal from "../components/Modal";
import skull from "../assets/skull.svg";

const USERNAME_MIN = 4;
const USERNAME_MAX = 20;

export default function UserSettings() {
	const { signOut, status } = useClerk();
	const { user } = useUser();
	const navigate = useNavigate();
	const modalRef = useRef<HTMLDialogElement>(null);
	const [modalMode, setModalMode] = useState<"confirm" | "error">("confirm");

	const [username, setUsername] = useState("");
	const [saving, setSaving] = useState(false);
	const [feedback, setFeedback] = useState<{
		text: string;
		ok: boolean;
	} | null>(null);

	const accountUnavailable = status === "degraded" || status === "error";

	useEffect(() => {
		if (user?.username) setUsername(user.username);
	}, [user?.username]);

	async function handleUpdateUsername() {
		if (!user) return;

		const next = username.trim();
		if (next.length < USERNAME_MIN || next.length > USERNAME_MAX) {
			setFeedback({
				text: `Username must be ${USERNAME_MIN}–${USERNAME_MAX} characters.`,
				ok: false,
			});
			return;
		}
		if (next === user.username) {
			setFeedback({ text: "That is already your username.", ok: false });
			return;
		}

		setSaving(true);
		setFeedback(null);
		try {
			await user.update({ username: next });
			setFeedback({ text: "Username updated!", ok: true });
		} catch (err) {
			setFeedback({ text: getUpdateErrorMessage(err), ok: false });
		} finally {
			setSaving(false);
		}
	}

	async function handleDeleteAccount() {
		if (!user) return;

		try {
			await user.delete();
			modalRef.current?.close();
			navigate("/");
		} catch {
			setModalMode("error");
		}
	}

	function getUpdateErrorMessage(err: unknown): string {
		if (isClerkAPIResponseError(err)) {
			const first = err.errors[0];
			return (
				first?.longMessage ??
				first?.message ??
				"Could not update username."
			);
		}
		return "Could not update username. Please try again.";
	}

	return (
		<>
			<NavBar />
			<Modal
				ref={modalRef}
				header={
					modalMode === "error"
						? "Deletion Failed"
						: "Confirm Account Deletion"
				}
				content={
					modalMode === "error" ? (
						<div className="my-2">
							Could not delete your account. Please try again
							later.
						</div>
					) : (
						<>
							<div className="my-2">
								This permanently deletes your account and its
								server data. This cannot be undone. Your local
								data on this device is not affected.
							</div>
							<button
								onClick={handleDeleteAccount}
								className="btn btn-error w-full"
							>
								DELETE ACCOUNT
							</button>
						</>
					)
				}
				closeBtnName={modalMode === "error" ? "CLOSE" : "CANCEL"}
				onClose={() => setModalMode("confirm")}
			/>
			<div className="bg-base-100 mt-14 flex items-center justify-center">
				<div className="w-76 sm:w-md">
					<h1 className="mb-10 text-5xl font-bold underline sm:text-center">
						User Settings
					</h1>

					<ClerkLoading>
						<div className="flex justify-center py-8">
							<span className="loading loading-spinner loading-lg" />
						</div>
					</ClerkLoading>

					<ClerkFailed>
						<div className="alert alert-error mb-8">
							Account services are unavailable right now. Please
							try again later.
						</div>
					</ClerkFailed>

					<ClerkLoaded>
						<div className="bg-base-200 rounded-box mb-8 flex items-baseline gap-2 p-5">
							<div className="text-sm opacity-70">
								Signed in as
							</div>
							<div className="text-xl font-semibold">
								{user?.username}
							</div>
						</div>

						<ClerkDegraded>
							<div className="alert alert-warning mb-4 text-sm">
								Account services are degraded — changes may not
								save right now.
							</div>
						</ClerkDegraded>

						<div className="flex flex-col gap-4">
							<div>
								<label className="mb-1 block text-sm opacity-70">
									Update username ({USERNAME_MIN}–
									{USERNAME_MAX} characters)
								</label>
								<input
									type="text"
									className="input w-full"
									value={username}
									minLength={USERNAME_MIN}
									maxLength={USERNAME_MAX}
									placeholder="New username"
									disabled={accountUnavailable}
									onChange={(e) => {
										setUsername(e.target.value);
										setFeedback(null);
									}}
								/>
								{feedback && (
									<p
										className={`mt-2 text-sm ${
											feedback.ok
												? "text-success"
												: "text-error"
										}`}
									>
										{feedback.text}
									</p>
								)}
							</div>
							<button
								className="btn btn-success mt-3 w-full text-xl"
								onClick={handleUpdateUsername}
								disabled={saving || accountUnavailable}
							>
								{saving ? "SAVING…" : "UPDATE USERNAME"}
							</button>
							<button
								className="btn btn-success text-xl"
								onClick={() => signOut({ redirectUrl: "/" })}
								disabled={accountUnavailable}
							>
								SIGN OUT
							</button>

							<div className="divider">
								<img src={skull} alt="" />
							</div>

							<button
								className="btn btn-error text-xl"
								onClick={() => modalRef.current?.showModal()}
								disabled={accountUnavailable}
							>
								DELETE ACCOUNT
							</button>
						</div>
					</ClerkLoaded>

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
