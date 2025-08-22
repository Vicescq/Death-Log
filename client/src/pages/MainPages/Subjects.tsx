import Card from "../../components/card/Card";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import CardWrapper from "../../components/card/CardWrapper";
import type { Subject } from "../../model/TreeNodeModel";
import useMainPageContexts from "../../hooks/useMainPageContexts";
import useMainPageStates from "../../hooks/useMainPageStates";
import {
	handleDelete,
	handleAdd,
	handleCompletedStatus,
	handleModalSave,
	handleDeathCount,
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
					handleCompletedStatus={() =>
						handleCompletedStatus(
							subject,
							!subject.completed,
							tree,
							setTree,
							history,
							setHistory,
							profileID,
						)
					}
					handleDelete={() =>
						handleDelete(
							subject,
							tree,
							setTree,
							history,
							setHistory,
							profileID,
						)
					}
					handleModalSave={(overrides) =>
						handleModalSave(
							subject,
							overrides,
							tree,
							setTree,
							history,
							setHistory,
							setAlert,
							modalRef,
							profileID,
						)
					}
					handleDeathCount={(deathType, operation) =>
						handleDeathCount(
							subject,
							deathType,
							operation,
							tree,
							setTree,
							history,
							setHistory,
							profileID,
						)
					}
				/>
			);
		});
	}

	return (
		<>
			<AddItemCard
				pageType="subject"
				handleAdd={(inputText) =>
					handleAdd(
						inputText,
						"subject",
						tree,
						setTree,
						history,
						setHistory,
						setAlert,
						modalRef,
						profileID,
					)
				}
			/>

			<CardWrapper cards={createCards()} />
		</>
	);
}
