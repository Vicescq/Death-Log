import { useRef, useState } from "react";
import { Link } from "react-router";
import LocalDB from "../../services/LocalDB";
import Modal from "../../components/Modal";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import skull from "../../assets/skull.svg";
import NavBar from "../../components/nav-bar/NavBar";
import DataManagementModalBody from "./DataManagementModalBody";
import StorageUsage from "./StorageUsage";
import type { FeedbackToastState } from "../../components/FeedbackToast";
import FeedbackToast from "../../components/FeedbackToast";
import { createDeathLogBackup, processImportedFile } from "./utils";
import FakeData from "../../services/fake-data-gen/FakeData";

export type DataManagementAction =
	| "import"
	| "delete"
	| "seed"
	| "undo"
	| "keep";

export default function DataManagement() {
	const tree = useDeathLogStore((state) => state.tree);
	const refreshTree = useDeathLogStore((state) => state.refreshTree);
	const importRef = useRef<HTMLInputElement>(null);
	const modalRef = useRef<HTMLDialogElement>(null);

	const [action, setAction] = useState<DataManagementAction>("import");
	const [feedbackToast, setFeedbackToast] = useState<FeedbackToastState>({
		displayed: false,
		msg: "",
		css: "success",
	});

	async function handleImport() {
		// cant condense into handleXYZ naming pattern because have to invoke click(), 2 steps
		if (
			importRef.current &&
			importRef.current.files &&
			importRef.current.files.length > 0
		) {
			try {
				const importedFile = importRef.current.files[0];
				importRef.current.value = ""; // refire input tag onChange, edge case: user imports same invalid file multiple times => import a.json -> closes err msg -> import a.json again -> err msg wont appear if this line is commented out

				await processImportedFile(importedFile);
				await refreshTree();

				setFeedbackToast({
					displayed: true,
					msg: "Successful import!",
					css: "success",
				});
			} catch (e) {
				if (e instanceof Error) {
					setFeedbackToast({
						displayed: true,
						msg: "The import could not be completed, please try again. Make sure to give a valid JSON file. For more info make sure to read the FAQ.",
						css: "error",
					});
				}
			}
		}
	}

	async function handleExport() {
		try {
			const deathLogBackup = await createDeathLogBackup();

			const blob = new Blob([JSON.stringify(deathLogBackup.json)], {
				type: "application/json",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;

			a.download = `${deathLogBackup.name}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			setFeedbackToast({
				displayed: true,
				css: "success",
				msg: "Successful export!",
			});
		} catch (e) {
			if (e instanceof Error) {
				setFeedbackToast({
					displayed: true,
					css: "error",
					msg: "The export could not be completed, please try again.",
				});
			}
		}
	}

	async function handleDelete() {
		try {
			// Full teardown: drop & recreate the DB (repairs corruption /
			// version mismatch, and nukes every table) + clear all prefs.
			await LocalDB.resetDatabase();
			LocalDB.clearAllLocalPrefs();

			await refreshTree();
			modalRef.current?.close();

			setFeedbackToast({
				displayed: true,
				css: "success",
				msg: "Deletion process was a success!",
			});
		} catch (e) {
			if (e instanceof Error) {
				modalRef.current?.close();

				setFeedbackToast({
					displayed: true,
					css: "error",
					msg: "Something unexpected happened during the deletion process. Please try again.",
				});
			}
		}
	}

	async function handleSeed() {
		try {
			await LocalDB.clearAndInsertData(FakeData.generate());
			await refreshTree();
			modalRef.current?.close();

			setFeedbackToast({
				displayed: true,
				css: "success",
				msg: "Sample data generated! Check out the stats page.",
			});
		} catch (e) {
			if (e instanceof Error) {
				modalRef.current?.close();

				setFeedbackToast({
					displayed: true,
					css: "error",
					msg: "Something unexpected happened while generating sample data. Please try again.",
				});
			}
		}
	}

	async function handleUndoFakeData() {
		try {
			const currentNodes = Array.from(tree.values()).filter(
				(node) => node.id !== "ROOT_NODE",
			);
			await LocalDB.clearAndInsertData(
				FakeData.removeFakeNodes(currentNodes),
			);
			await refreshTree();
			modalRef.current?.close();

			setFeedbackToast({
				displayed: true,
				css: "success",
				msg: "Fake data removed!",
			});
		} catch (e) {
			if (e instanceof Error) {
				modalRef.current?.close();

				setFeedbackToast({
					displayed: true,
					css: "error",
					msg: "Something unexpected happened while removing fake data. Please try again.",
				});
			}
		}
	}

	async function handleKeepFakeData() {
		try {
			const currentNodes = Array.from(tree.values()).filter(
				(node) => node.id !== "ROOT_NODE",
			);
			await LocalDB.clearAndInsertData(FakeData.keepFakeNodes(currentNodes));
			await refreshTree();
			modalRef.current?.close();

			setFeedbackToast({
				displayed: true,
				css: "success",
				msg: "Fake data is now permanent!",
			});
		} catch (e) {
			if (e instanceof Error) {
				modalRef.current?.close();

				setFeedbackToast({
					displayed: true,
					css: "error",
					msg: "Something unexpected happened. Please try again.",
				});
			}
		}
	}

	let templateHeader = "Confirm";
	let header = "";
	if (action == "delete") {
		header = `${templateHeader} Deletion`;
	} else if (action == "import") {
		header = `${templateHeader} Import`;
	} else if (action == "seed") {
		header = `${templateHeader} Sample Data`;
	} else if (action == "undo") {
		header = `${templateHeader} Undo`;
	} else if (action == "keep") {
		header = `${templateHeader} Keep`;
	} else {
		header = "__DEV_ERROR__";
	}

	return (
		<>
			<NavBar />
			<FeedbackToast
				msg={feedbackToast.msg}
				bgCSS={feedbackToast.css}
				displayed={feedbackToast.displayed}
				onClose={() =>
					setFeedbackToast((prev) => ({ ...prev, displayed: false }))
				}
			/>
			<Modal
				ref={modalRef}
				content={
					<DataManagementModalBody
						action={action}
						onImport={() => {
							importRef.current?.click();
							modalRef.current?.close();
						}}
						onDelete={handleDelete}
						onSeed={handleSeed}
						onUndoFakeData={handleUndoFakeData}
						onKeepFakeData={handleKeepFakeData}
					/>
				}
				header={header}
				closeBtnName={"CANCEL"}
			/>
			<div className="bg-base-100 mt-14 flex items-center justify-center">
				<div className="w-76 sm:w-md">
					<h1 className="mb-10 text-5xl font-bold underline sm:text-center">
						Data Management
					</h1>

					<div className="flex flex-col gap-4">
						<button
							className="btn btn-success text-xl"
							onClick={() => {
								setAction("import");
								modalRef.current?.showModal();
							}}
						>
							IMPORT
						</button>

						<button
							className="btn btn-success text-xl"
							onClick={handleExport}
						>
							EXPORT
						</button>

						<StorageUsage />

						<div className="divider" />

						<button
							className="btn btn-info text-xl"
							onClick={() => {
								setAction("seed");
								modalRef.current?.showModal();
							}}
						>
							SEED FAKE DATA
						</button>

						<button
							className="btn btn-info text-xl"
							onClick={() => {
								setAction("undo");
								modalRef.current?.showModal();
							}}
						>
							UNDO FAKE DATA
						</button>

						<button
							className="btn btn-info text-xl"
							onClick={() => {
								setAction("keep");
								modalRef.current?.showModal();
							}}
						>
							KEEP FAKE DATA
						</button>

						<div className="divider">
							<img src={skull} alt="" />
						</div>

						<button
							className="btn btn-error text-xl"
							onClick={() => {
								setAction("delete");
								modalRef.current?.showModal();
							}}
						>
							DELETE LOCAL DATA
						</button>
					</div>

					<div className="divider"></div>
					<p className="mb-3 text-sm opacity-70 sm:text-center">
						Looking to manage your account or remote data (sign out,
						delete account)?
					</p>
					<Link
						to={{ pathname: "/user-settings" }}
						className="btn btn-outline w-full"
					>
						GO TO USER SETTINGS
					</Link>

					<div className="divider"></div>
					<p className="mb-3 text-sm opacity-70 sm:text-center">
						Not sure what any of these buttons do? Check the{" "}
						<Link to="/faq" className="link link-primary">
							FAQ
						</Link>
						.
					</p>
				</div>
			</div>

			<input
				type="file"
				className="hidden"
				ref={importRef}
				onChange={handleImport}
				accept="application/json"
			/>
		</>
	);
}
