import Card from "../../components/card/Card";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import CardWrapper from "../../components/card/CardWrapper";
import type { Subject } from "../../model/TreeNodeModel";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import useMainPageStates from "../../hooks/useMainPageStates";
import {
	handleDelete,
	handleAdd,
} from "./eventHandlers";

export default function Subjects({ profileID }: { profileID: string }) {
	const { tree, setTree, history, setHistory } = useMainPageContexts();
	const { modalRef, alert, setAlert } = useMainPageStates();

	function createCards() {
		return tree.get(profileID)?.childIDS.map((nodeID, index) => {
			const subject = tree.get(nodeID) as Subject;
			return (
				<Card
					key={index}
					tree={tree}
					node={subject}
					handleDelete={() => handleDelete(subject)}
				/>
			);
		});
	}

	return (
		<>
			<AddItemCard
				pageType="subject"
				handleAdd={handleAdd}
				tree={tree}
				parentID={profileID}
			/>

			<CardWrapper cards={createCards()} />
		</>
	);
}
