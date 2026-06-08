import { useRef, useState } from "react";
import LocalDB from "../../services/LocalDB";
import { refreshTree } from "../../stores/utils";
import Modal from "../../components/Modal";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import skull from "../../assets/skull.svg";
import { db } from "../../model/LocalDBSchema";
import NavBar from "../../components/nav-bar/NavBar";
import DataManagementModalBody from "./DataManagementModalBody";
import type { FeedbackToastState } from "../../components/FeedbackToast";
import FeedbackToast from "../../components/FeedbackToast";
import { createDeathLogBackup, processImportedFile } from "./utils";

export type DataManagementAction = "import" | "delete" | "migrate" | "reset";

export default function DataManagement() {
	const initTree = useDeathLogStore((state) => state.initTree);
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
				await refreshTree(initTree);

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
			await LocalDB.clearData();
			await refreshTree(initTree);
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

	async function handleReset() {
		try {
			await db.delete();
			await db.open();
			await refreshTree(initTree);
			modalRef.current?.close();

			setFeedbackToast({
				displayed: true,
				css: "success",
				msg: "The application has been reset!",
			});
		} catch (e) {
			if (e instanceof Error) {
				modalRef.current?.close();
				setFeedbackToast({
					displayed: true,
					css: "error",
					msg: "Something unexpected happened during the reset process. Please try again.",
				});
			}
		}
	}

	async function handleMigration() {}

	let templateHeader = "Confirm";
	let header = "";
	if (action == "delete") {
		header = `${templateHeader} Deletion`;
	} else if (action == "import") {
		header = `${templateHeader} Import`;
	} else if (action == "migrate") {
		header = `${templateHeader} Migration`;
	} else if (action == "reset") {
		header = `${templateHeader} Reset`;
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
						onMigrate={handleMigration}
						onReset={handleReset}
					/>
				}
				header={header}
				closeBtnName={"CANCEL"}
			/>
			<div className="bg-base-100 mt-14 flex items-center justify-center">
				<div className="w-[19rem] sm:w-md">
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
						<button
							onClick={() => {
								setAction("migrate");
								modalRef.current?.showModal();
							}}
							className="btn btn-success text-xl"
						>
							MIGRATE TO ACCOUNT
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
							DELETE
						</button>
						<button
							className="btn btn-error text-xl"
							onClick={() => {
								setAction("reset");
								modalRef.current?.showModal();
							}}
						>
							RESET
						</button>
					</div>
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
