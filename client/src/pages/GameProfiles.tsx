import Card from "../components/Card";
import useTreeContext from "../hooks/useTreeContext";
import useURLMapContext from "../hooks/useURLMapContext";
import useHistoryContext from "../hooks/useHistoryContext";
import usePostDeathLog from "../hooks/usePostDeathLog";
import CardWrapper from "../components/CardWrapper";
import AddItemCard from "../components/addItemCard/AddItemCard";
import type { HandleAddProfile } from "../components/addItemCard/AddItemCardProps";
import { changeCompletedStatus } from "../utils/eventHandlers";
import useUpdateURLMap from "../hooks/useUpdateURLMap";
import useUUIDContext from "../hooks/useUUIDContext";
import type { Profile } from "../model/TreeNodeModel";
import TreeContextManager from "../features/TreeContextManager";
import HistoryContextManager from "../features/HistoryContextManager";

export default function GameProfiles({ gameID }: { gameID: string }) {
	const [tree, setTree] = useTreeContext();
	const [urlMap, setURLMap] = useURLMapContext();
	const [history, setHistory] = useHistoryContext();
	const [uuid] = useUUIDContext();

	const handleAdd: HandleAddProfile = (
		inputText: string,
		dateStartR: boolean | undefined,
		dateEndR: boolean | undefined,
	) => {
		const node = TreeContextManager.createProfile(inputText, tree, gameID, {
			dateStartR: dateStartR,
			dateEndR: dateEndR,
		});
		const { treeCopy, actions } = TreeContextManager.addNode(tree, node);
		setTree(treeCopy);
		setHistory(HistoryContextManager.updateActionHistory(history, actions));
	};

	function handleDelete(node: Profile) {
		const bool = window.confirm();
		if (bool) {
			const { treeCopy, actions } = TreeContextManager.deleteNode(
				tree,
				node,
			);
			setTree(treeCopy);
			setHistory(
				HistoryContextManager.updateActionHistory(history, actions),
			);
		}
	}

	function handleCompletedStatus(profile: Profile, newStatus: boolean) {
		const { treeCopy, actions } = changeCompletedStatus(
			profile,
			newStatus,
			tree,
		);
		setTree(treeCopy);
		setHistory(HistoryContextManager.updateActionHistory(history, actions));
	}

	function createCards() {
		return tree.get(gameID)?.childIDS.map((nodeID, index) => {
			const profile = tree.get(nodeID) as Profile;
			return (
				<Card
					key={index}
					tree={tree}
					treeNode={profile}
					handleCompletedStatus={(newStatus) =>
						handleCompletedStatus(profile, newStatus)
					}
					modalSchema={"Card-Profile"}
					handleDelete={() => handleDelete(profile)}
				/>
			);
		});
	}

	useUpdateURLMap(tree, urlMap, setURLMap);
	usePostDeathLog(uuid, history, setHistory);

	return (
		<>
			<AddItemCard pageType="Profile" modalSchema={"AddItemCard-Profile"} handleAdd={handleAdd}/>
			<CardWrapper cards={createCards()} />
		</>
	);
}
