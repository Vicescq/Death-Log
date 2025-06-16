import Card from "../../components/card/Card";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import usePostDeathLog from "../../hooks/usePostDeathLog";
import CardWrapper from "../../components/card/CardWrapper";
import type { Subject } from "../../model/TreeNodeModel";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import profileSubjectsHandlers from "./profileSubjectsHandlers";

export default function ProfileSubjects({ profileID }: { profileID: string }) {
	const { tree, setTree, urlMap, setURLMap, history, setHistory } =
		useMainPageContexts();

	const {
		handleAdd,
		handleDelete,
		handleCompletedStatus,
		handleDeathCount,
		handleDetailsEdit,
	} = profileSubjectsHandlers(
		tree,
		setTree,
		history,
		setHistory,
		profileID,
	);

	function createCards() {
		return tree.get(profileID)?.childIDS.map((nodeID, index) => {
			const subject = tree.get(nodeID) as Subject;
			return (
				<Card
					key={index}
					tree={tree}
					treeNode={subject}
					handleDeathCount={(deathType, operation) =>
						handleDeathCount(subject, deathType, operation)
					}
					handleCompletedStatus={(newStatus) =>
						handleCompletedStatus(subject, newStatus)
					}
					handleDelete={() => handleDelete(subject)}
					modalSchema={"Card-Subject"}
					handleDetailsEdit={(modalState) =>
						handleDetailsEdit(subject, modalState)
					}
				/>
			);
		});
	}

	return (
		<>
			<AddItemCard
				pageType="Subject"
				modalSchema={"AddItemCard-Subject"}
				handleAdd={handleAdd}
				tree={tree}
				parentID={profileID}
			/>

			<CardWrapper cards={createCards()} />
		</>
	);
}
