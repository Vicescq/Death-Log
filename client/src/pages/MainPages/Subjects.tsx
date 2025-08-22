import Card from "../../components/card/Card";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import CardWrapper from "../../components/card/CardWrapper";
import type { DeathCountOperation, DeathType, Subject } from "../../model/TreeNodeModel";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import type { HandleAddSubject } from "../../components/addItemCard/AddItemCardTypes";
import HistoryContextManager from "../../contexts/managers/HistoryContextManager";
import TreeContextManager from "../../contexts/managers/TreeContextManager";
import IndexedDBService from "../../services/IndexedDBService";

export default function Subjects({ profileID }: { profileID: string }) {
	// const { tree, setTree, urlMap, setURLMap, history, setHistory } =
	// 	useMainPageContexts();

	// const {
	// 	handleAdd,
	// 	handleDelete,
	// 	handleCompletedStatus,
	// 	handleDeathCount,
	// 	handleDetailsEdit,
	// } = subjectsHandlers(tree, setTree, history, setHistory, profileID);

	// const handleAdd: HandleAddSubject = (
	// 	inputText,
	// 	dateStartR,
	// 	dateEndR,
	// 	boss,
	// 	location,
	// 	other,
	// 	composite,
	// 	reoccurring,
	// ) => {
	// 	const node = TreeContextManager.createSubject(inputText, profileID, {
	// 		dateStartR: dateStartR,
	// 		dateEndR: dateEndR,
	// 		boss: boss,
	// 		location: location,
	// 		other: other,
	// 		composite: composite,
	// 		reoccurring: reoccurring,
	// 	});

	// 	// memory data structures
	// 	const { updatedTree: updatedTreeIP, action: actionAdd } =
	// 		TreeContextManager.addNode(tree, node);
	// 	const { updatedTree, action: actionUpdate } =
	// 		TreeContextManager.updateNodeParent(node, updatedTreeIP, "add");
	// 	const updatedHistory = HistoryContextManager.updateActionHistory(
	// 		history,
	// 		[actionAdd, actionUpdate],
	// 	);

	// 	// db's
	// 	try {
	// 		IndexedDBService.addNode(
	// 			actionAdd.targets,
	// 			localStorage.getItem("email")!,
	// 		);
	// 		IndexedDBService.updateNode(
	// 			actionUpdate.targets,
	// 			localStorage.getItem("email")!,
	// 		);
	// 	} catch (error) {
	// 		console.error(error);
	// 	}

	// 	setTree(updatedTree);
	// 	setHistory(updatedHistory);
	// };

	// function handleDelete(node: Subject) {
	// 	const bool = window.confirm();
	// 	if (bool) {
	// 		// memory data structures
	// 		const { updatedTree: updatedTreeIP, action: actionDelete } =
	// 			TreeContextManager.deleteNode(tree, node);
	// 		const { updatedTree, action: actionUpdate } =
	// 			TreeContextManager.updateNodeParent(
	// 				node,
	// 				updatedTreeIP,
	// 				"delete",
	// 			);
	// 		const updatedHistory = HistoryContextManager.updateActionHistory(
	// 			history,
	// 			[actionDelete, actionUpdate],
	// 		);

	// 		// db's
	// 		try {
	// 			IndexedDBService.deleteNode(actionDelete.targets);
	// 			IndexedDBService.updateNode(
	// 				actionUpdate.targets,
	// 				localStorage.getItem("email")!,
	// 			);
	// 		} catch (error) {
	// 			console.error(error);
	// 		}

	// 		setTree(updatedTree);
	// 		setHistory(updatedHistory);
	// 	}
	// }

	// function handleDeathCount(
	// 	subject: Subject,
	// 	deathType: DeathType,
	// 	operation: DeathCountOperation,
	// ) {
	// 	let updatedSubject: Subject = { ...subject };
	// 	if (operation == "add") {
	// 		deathType == "fullTries"
	// 			? updatedSubject.fullTries++
	// 			: updatedSubject.resets++;
	// 	} else {
	// 		deathType == "fullTries"
	// 			? updatedSubject.fullTries--
	// 			: updatedSubject.resets--;
	// 	}
	// 	updatedSubject.fullTries < 0 ? (updatedSubject.fullTries = 0) : null;
	// 	updatedSubject.resets < 0 ? (updatedSubject.resets = 0) : null;

	// 	// memory data structures
	// 	const { updatedTree: updatedTreeIP, action: actionUpdateSelf } =
	// 		TreeContextManager.updateNode(tree, updatedSubject);
	// 	const { updatedTree, action: actionUpdateParent } =
	// 		TreeContextManager.updateNodeParent(
	// 			updatedSubject,
	// 			updatedTreeIP,
	// 			"update",
	// 		);
	// 	const updatedHistory = HistoryContextManager.updateActionHistory(
	// 		history,
	// 		[actionUpdateSelf, actionUpdateParent],
	// 	);

	// 	// db's
	// 	try {
	// 		IndexedDBService.updateNode(
	// 			actionUpdateSelf.targets,
	// 			localStorage.getItem("email")!,
	// 		);
	// 		IndexedDBService.updateNode(
	// 			actionUpdateParent.targets,
	// 			localStorage.getItem("email")!,
	// 		);
	// 	} catch (error) {
	// 		console.error(error);
	// 	}

	// 	setTree(updatedTree);
	// 	setHistory(updatedHistory);
	// }

	// function handleCompletedStatus(subject: Subject, newStatus: boolean) {
	// 	// memory data structures
	// 	const { updatedTree: updatedTreeIP, action: actionUpdateSelf } =
	// 		TreeContextManager.updateNodeCompletion(subject, newStatus, tree);
	// 	const { updatedTree, action: actionUpdateParent } =
	// 		TreeContextManager.updateNodeParent(
	// 			subject,
	// 			updatedTreeIP,
	// 			"update",
	// 		);
	// 	const updatedHistory = HistoryContextManager.updateActionHistory(
	// 		history,
	// 		[actionUpdateSelf, actionUpdateParent],
	// 	);

	// 	// db's
	// 	try {
	// 		IndexedDBService.updateNode(
	// 			actionUpdateSelf.targets,
	// 			localStorage.getItem("email")!,
	// 		);
	// 		IndexedDBService.updateNode(
	// 			actionUpdateParent.targets,
	// 			localStorage.getItem("email")!,
	// 		);
	// 	} catch (error) {
	// 		console.error(error);
	// 	}

	// 	setTree(updatedTree);
	// 	setHistory(updatedHistory);
	// }

	// function handleDetailsEdit(
	// 	subject: Subject,
	// 	modalState: ModalListItemDistinctState[],
	// ) {
	// 	const updatedSubject = { ...subject };
	// 	modalState.forEach((state) => {
	// 		if (state.type == "inputEdit") {
	// 			updatedSubject.name =
	// 				state.change != "" ? state.change : updatedSubject.name;
	// 		}
	// 	});

	// 	// memory data structures
	// 	const { updatedTree: updatedTreeIP, action: actionUpdateSelf } =
	// 		TreeContextManager.updateNode(tree, updatedSubject);
	// 	const { updatedTree, action: actionUpdateParent } =
	// 		TreeContextManager.updateNodeParent(
	// 			subject,
	// 			updatedTreeIP,
	// 			"update",
	// 		);
	// 	const updatedHistory = HistoryContextManager.updateActionHistory(
	// 		history,
	// 		[actionUpdateSelf, actionUpdateParent],
	// 	);

	// 	// db's
	// 	try {
	// 		IndexedDBService.updateNode(
	// 			actionUpdateSelf.targets,
	// 			localStorage.getItem("email")!,
	// 		);
	// 		IndexedDBService.updateNode(
	// 			actionUpdateParent.targets,
	// 			localStorage.getItem("email")!,
	// 		);
	// 	} catch (error) {
	// 		console.error(error);
	// 	}

	// 	setTree(updatedTree);
	// 	setHistory(updatedHistory);
	// }

	// function createCards() {
	// 	return tree.get(profileID)?.childIDS.map((nodeID, index) => {
	// 		const subject = tree.get(nodeID) as Subject;
	// 		return (
	// 			<Card
	// 				key={index}
	// 				tree={tree}
	// 				node={subject}
	// 				handleDeathCount={(deathType, operation) =>
	// 					handleDeathCount(subject, deathType, operation)
	// 				}
	// 				handleCompletedStatus={(newStatus) =>
	// 					handleCompletedStatus(subject, newStatus)
	// 				}
	// 				handleDelete={() => handleDelete(subject)}
	// 				modalSchema={"Card-Subject"}
	// 				handleDetailsEdit={(modalState) =>
	// 					handleDetailsEdit(subject, modalState)
	// 				}
	// 			/>
	// 		);
	// 	});
	// }

	return (
		<>
			{/* <AddItemCard
				pageType="subject"
				handleAdd={handleAdd}
				tree={tree}
				parentID={profileID}
			/>

			<CardWrapper cards={createCards()} /> */}
		</>
	);
}
