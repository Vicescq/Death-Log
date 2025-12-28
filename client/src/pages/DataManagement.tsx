import { useRef, useState } from "react";
import LocalDB from "../services/LocalDB";
import { assertIsNonNull, refreshTree } from "../utils";
import Modal from "../components/modal/Modal";
import AlertModalBody from "../components/modal/AlertModalBody";
import { useDeathLogStore } from "../stores/useDeathLogStore";
import type { ModalFn } from "../components/modal/types";

type Props = {};

export default function DataManagement({}: Props) {
	const initTree = useDeathLogStore((state) => state.initTree);
	const importRef = useRef<HTMLInputElement>(null);
	const modalRef = useRef<HTMLDialogElement>(null);

	const deleteNotify = {
		msg: "Are you sure you want clear all your DeathLog data for the current account? Guest data will be deleted if no account is logged in.",
		modalFn: {
			fn: async () => {
				await LocalDB.clearData();
				await refreshTree(initTree);
				modalRef.current?.close();
			},
			label: "CONFIRM",
			btnCol: "bg-orange-600",
		},
		modalCloseFn: {
			fn: () => modalRef.current?.close(),
			label: "CANCEL",
		},
	} as const;

	const importProblem = {
		msg: "The import could not be completed, please try again. Make sure to give a valid JSON file.",
		modalFn: undefined,
		modalCloseFn: {
			fn: () => modalRef.current?.close(),
			label: "CLOSE",
		},
	} as const;

	const [modalMsg, setModalMsg] = useState<string>(deleteNotify.msg);
	const [modalFn, setModalFn] = useState<ModalFn | undefined>(deleteNotify.modalFn);
	const [modalCloseFn, setModalCloseFn] = useState<ModalFn>(
		deleteNotify.modalCloseFn,
	);

	function migrateGuest() {}

	async function exportDL() {
		const date = new Date();
		const iso = date.toISOString();

		const nodes = await LocalDB.getNodes();
		const finalJSON = {
			type: "DEATH-LOG Backup",
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
		a.download = `Death-Log ${date.toString()}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	async function importDL() {
		assertIsNonNull(importRef.current);
		assertIsNonNull(importRef.current.files);
		if (importRef.current.files.length > 0) {
			try {
				const importedFile = importRef.current.files[0];
				importRef.current.value = '';   // refire input tag onChange, edge case: user imports same invalid file multiple times
				const importedFileTxt = await importedFile.text();
				const importedFileFinal = JSON.parse(importedFileTxt);

				validateJSON(importedFileFinal);

				await LocalDB.clearAndInsertData(importedFileFinal.data);
				refreshTree(initTree);
			} catch (e) {
				if (e instanceof Error) {
					setModalMsg(importProblem.msg);
					setModalFn(importProblem.modalFn);
					setModalCloseFn(importProblem.modalCloseFn);
					modalRef.current?.showModal();
				}
			}
		}
	}

	function validateJSON(parsedJSON: any) {
		// light validation!

		if (!(parsedJSON.type == "DEATH-LOG Backup")) {
			throw new Error();
		}

		if (parsedJSON.data.length > 0) {
			const supposedNode = parsedJSON.data[0];
			if (!(supposedNode.type || supposedNode.id || supposedNode.name))
				throw new Error();
		}
	}

	return (
		<div className="mt-24 flex flex-col items-center justify-center gap-3">
			<h1 className="mb-12 text-4xl underline">Manage your data</h1>

			<button
				className="bg-hunyadi min-w-40 rounded-2xl border-4 border-black p-1 font-bold text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:min-w-80"
				onClick={migrateGuest}
			>
				MIGRATE TO ACCOUNT
			</button>
			<button
				className="bg-hunyadi min-w-40 rounded-2xl border-4 border-black p-1 font-bold text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:min-w-80"
				onClick={exportDL}
			>
				EXPORT
			</button>

			<input
				type="file"
				className="hidden"
				ref={importRef}
				onChange={importDL}
				accept="application/json"
			/>
			<button
				className="bg-hunyadi min-w-40 rounded-2xl border-4 border-black p-1 font-bold text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:min-w-80"
				onClick={() => importRef.current?.click()}
			>
				IMPORT
			</button>
			<button
				className="bg-indianred min-w-40 rounded-2xl border-4 border-black p-1 font-bold text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:min-w-80"
				onClick={() => {
					setModalFn(deleteNotify.modalFn);
					modalRef.current?.showModal();
				}}
			>
				DELETE
			</button>

			<Modal
				modalStyle="alert"
				body={<AlertModalBody msg={modalMsg} />}
				modalRef={modalRef}
				closeFn={modalCloseFn}
				fn={modalFn}
			/>
		</div>
	);
}
