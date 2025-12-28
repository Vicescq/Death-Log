import { useMemo } from "react";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import Card from "../../components/card/Card";
import CardWrapper from "../../components/card/CardWrapper";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import ErrorPage from "../ErrorPage";
import useLoadDeathLogCorrectly from "./useLoadDeathLogCorrectly";

type Props = {
	type: "game" | "profile" | "subject";
	parentID: string;
};

export default function DeathLog({ type, parentID }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const { loading, deletedID } = useLoadDeathLogCorrectly(tree, parentID);
	
	const childIDS = tree.get(parentID)?.childIDS || [];
	const cards = useMemo(() => {
		return childIDS.map((nodeID) => <Card key={nodeID} id={nodeID} />);
	}, [childIDS, parentID]);

	

	return (
		<>
			{/* {loading ? null : deletedID ? (
				<ForceError msg="This page does not exist anymore! You probably deleted something and pressed forward in the browser history!" />
			) : (
				<div className="mb-8 flex flex-col items-center justify-center">
					<AddItemCard pageType={type} parentID={parentID} />

					<CardWrapper cards={cards} />
				</div>
			)} */}
			{deletedID ? (
				<ErrorPage error={new Error("This page does not exist anymore! You probably deleted something and pressed forward in the browser history!")} />
			) : (
				<div className="mb-8 flex flex-col items-center justify-center">
					<AddItemCard pageType={type} parentID={parentID} />

					<CardWrapper cards={cards} />
				</div>
			)}
			
		</>
	);
}
