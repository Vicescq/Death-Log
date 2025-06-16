import Card from "../../components/card/Card";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import CardWrapper from "../../components/card/CardWrapper";
import type { Subject } from "../../model/TreeNodeModel";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import subjectsHandlers from "./subjectsHandlers";

export default function Subjects({ profileID }: { profileID: string }) {
	const { tree, setTree, urlMap, setURLMap, history, setHistory } =
		useMainPageContexts();

	const {
		handleAdd,
		handleDelete,
		handleCompletedStatus,
		handleDeathCount,
		handleDetailsEdit,
	} = subjectsHandlers(tree, setTree, history, setHistory, profileID);

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
