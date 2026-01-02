import { useRef, useState } from "react";
import LocalDB from "../services/LocalDB";
import { assertIsNonNull, refreshTree } from "../utils";
import Modal, { type ModalBtn } from "../components/modal/Modal";
import { useDeathLogStore } from "../stores/useDeathLogStore";
import NavBar from "../components/navBar/NavBar";
import skull from "../assets/skull.svg";
import { db } from "../model/LocalDBSchema";
import FeedbackToast from "../components/FeedbackToast";
import type { DistinctTreeNode, TreeNode } from "../model/TreeNodeModel";

type DeathLogBackup = {
	type: "DEATH-LOG Backup";
	version: number;
	details: "Please do not edit this JSON in a significant way. Doing so might corrupt the data and importing this file in the site will no longer work.";
	date: string;
	data: DistinctTreeNode[];
};

export default function DataManagement() {
	const initTree = useDeathLogStore((state) => state.initTree);
	const importRef = useRef<HTMLInputElement>(null);
	const ref = useRef<HTMLDialogElement>(null);

	const [feedbackToastMsg, setFeedbackToastMsg] = useState("");
	const [feedbackToastDisplay, setFeedbackToastDisplay] = useState(false);
	const [feedbackToastCSS, setFeedbackToastCSS] = useState("success");

	const [modalContent, setModalContent] = useState<React.JSX.Element>(<></>);
	const [modalHeader, setModalHeader] = useState("");
	const [modalCloseBtnName, setModalCloseBtnName] = useState("Close");
	const [modalBtns, setModalBtns] = useState<ModalBtn[]>([]);

	const deleteModalProps = {
		content: <></>,
		header: "Are you sure you want to clear all your data for the current account? Guest data will be deleted if no account is logged in.",
		closeBtnName: "CANCEL",
		modalBtns: [
			{
				text: "DELETE",
				fn: async () => {
					try {
						await LocalDB.clearData();
						await refreshTree(initTree);
						ref.current?.close();
						setFeedbackToastMsg("Deletion process was a success!");
						setFeedbackToastCSS("success");
					} catch (e) {
						if (e instanceof Error) {
							ref.current?.close();
							setFeedbackToastMsg(
								"Something unexpected happened during the deletion process. Please try again.",
							);
							setFeedbackToastCSS("error");
						}
					} finally {
						setFeedbackToastDisplay(true);
					}
				},
				css: "mt-8 btn-error",
			},
		],
	} as const;

	const eraseAllModalProps = {
		content: <></>,
		header: "Are you sure you want to erase all Death Log data including other accounts? This should be done if the app does not work and as a worst case scenario if other methods can't fix your data.",
		closeBtnName: "CANCEL",
		modalBtns: [
			{
				text: "ERASE ALL",
				fn: async () => {
					try {
						await db.delete();
						await db.open();
						await refreshTree(initTree);
						ref.current?.close();
						setFeedbackToastMsg("Deletion process was a success!");
						setFeedbackToastCSS("success");
					} catch (e) {
						if (e instanceof Error) {
							ref.current?.close();
							setFeedbackToastMsg(
								"Something unexpected happened during the deletion process. Please try again.",
							);
							setFeedbackToastCSS("error");
						}
					} finally {
						setFeedbackToastDisplay(true);
					}
				},
				css: "mt-8 btn-error",
			},
		],
	} as const;

	const importModalProps = {
		content: <></>,
		header: "Importing a file will clear your current account data and will replace it with its contents. Do you want to proceed?",
		closeBtnName: "CANCEL",
		modalBtns: [
			{
				text: "PROCEED",
				fn: () => {
					importRef.current?.click();
					ref.current?.close();
				},
				css: "mt-8 btn-info",
			},
		],
	} as const;

	function migrateGuest() {}

	async function exportDL() {
		try {
			const date = new Date();
			const iso = date.toISOString();
			const nodes = await LocalDB.getNodes();
			const finalJSON: DeathLogBackup = {
				type: "DEATH-LOG Backup",
				version: db.verno,
				details:
					"Please do not edit this JSON in a significant way. Doing so might corrupt the data and importing this file in the site will no longer work.",
				date: iso,
				data: nodes,
			};

			const blob = new Blob([JSON.stringify(finalJSON)], {
				type: "application/json",
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `Death Log ${date.toString()}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			setFeedbackToastMsg("Successful export!");
			setFeedbackToastCSS("success");
			setFeedbackToastDisplay(true);
		} catch (e) {
			if (e instanceof Error) {
				setFeedbackToastMsg(
					"The export could not be completed, please try again.",
				);
				setFeedbackToastCSS("error");
				setFeedbackToastDisplay(true);
			}
		}
	}

	async function importDL() {
		assertIsNonNull(importRef.current);
		assertIsNonNull(importRef.current.files);
		if (importRef.current.files.length > 0) {
			try {
				const importedFile = importRef.current.files[0];
				importRef.current.value = ""; // refire input tag onChange, edge case: user imports same invalid file multiple times
				const importedFileTxt = await importedFile.text();
				const importedFileFinal = JSON.parse(importedFileTxt);

				validateJSON(importedFileFinal);

				await LocalDB.clearAndInsertData(importedFileFinal.data);
				await refreshTree(initTree);
				setFeedbackToastMsg("Successful import!");
				setFeedbackToastCSS("success");
				setFeedbackToastDisplay(true);
			} catch (e) {
				if (e instanceof Error) {
					setFeedbackToastMsg(
						"The import could not be completed, please try again. Make sure to give a valid JSON file. For more info make sure to read the FAQ.",
					);
					setFeedbackToastCSS("error");
					setFeedbackToastDisplay(true);
				}
			}
		}
	}

	function validateJSON(parsedJSON: any) {
		const deathLogBackupKeys = [
			"type",
			"version",
			"details",
			"date",
			"data",
		];
		const keys = Object.keys(parsedJSON);
		console.log(keys);
		if (keys.length != deathLogBackupKeys.length) {
			throw new Error("Invalid JSON");
		}
		keys.forEach((key) => {
			if (!deathLogBackupKeys.includes(key)) {
				throw new Error("Invalid JSON");
			}
		});

		if (parsedJSON.type != "DEATH-LOG Backup") {
			throw new Error("Invalid JSON");
		}

		if (
			parsedJSON.details !=
			"Please do not edit this JSON in a significant way. Doing so might corrupt the data and importing this file in the site will no longer work."
		) {
			throw new Error("Invalid JSON");
		}

		// light validation!
		if (parsedJSON.data.length > 0) {
			parsedJSON.data.forEach((supposedNode: TreeNode) => {
				if (
					!(supposedNode.type && supposedNode.id && supposedNode.name)
				)
					throw new Error("Invalid JSON");
			});
		}

		if (parsedJSON.version != db.verno) {
			throw new Error("Invalid JSON"); // temp
			// implement migrations
		}
	}

	return (
		<>
			<NavBar />
			<FeedbackToast
				msg={feedbackToastMsg}
				bgCSS={feedbackToastCSS}
				displayed={feedbackToastDisplay}
				handleDisplay={() => setFeedbackToastDisplay((val) => !val)}
			/>
			<Modal
				ref={ref}
				content={modalContent}
				header={modalHeader}
				closeBtnName={modalCloseBtnName}
				modalBtns={modalBtns}
			/>
			<div className="bg-base-100 flex mt-14 items-center justify-center">
				<div className="sm:w-md w-[19rem]">
					<h1 className="mb-10 text-5xl font-bold sm:text-center  underline">
						Data Management
					</h1>
					<div className="flex flex-col gap-4">
						<button
							className="btn btn-success text-xl"
							onClick={() => {
								setModalHeader(importModalProps.header);
								setModalBtns([...importModalProps.modalBtns]);
								setModalCloseBtnName(
									importModalProps.closeBtnName,
								);
								setModalContent(importModalProps.content);
								ref.current?.showModal();
							}}
						>
							IMPORT
						</button>

						<button
							className="btn btn-success text-xl"
							onClick={exportDL}
						>
							EXPORT
						</button>
						<button className="btn btn-success text-xl">
							MIGRATE TO ACCOUNT
						</button>
						<div className="divider">
							<img src={skull} alt="" />
						</div>
						<button
							className="btn btn-error text-xl"
							onClick={() => {
								setModalHeader(deleteModalProps.header);
								setModalBtns([...deleteModalProps.modalBtns]);
								setModalCloseBtnName(
									deleteModalProps.closeBtnName,
								);
								setModalContent(deleteModalProps.content);
								ref.current?.showModal();
							}}
						>
							DELETE
						</button>
						<button
							className="btn btn-error text-xl"
							onClick={() => {
								setModalHeader(eraseAllModalProps.header);
								setModalBtns([...eraseAllModalProps.modalBtns]);
								setModalCloseBtnName(
									eraseAllModalProps.closeBtnName,
								);
								setModalContent(eraseAllModalProps.content);
								ref.current?.showModal();
							}}
						>
							ERASE ALL
						</button>
					</div>
				</div>
			</div>

			<input
				type="file"
				className="hidden"
				ref={importRef}
				onChange={importDL}
				accept="application/json"
			/>
		</>
	);
}
