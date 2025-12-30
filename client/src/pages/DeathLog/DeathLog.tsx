import { useMemo } from "react";
import AddItemCard from "../../components/addItemCard/AddItemCard";
import Card from "../../components/card/Card";
import CardWrapper from "../../components/card/CardWrapper";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import NavBar from "../../components/navBar/NavBar";

type Props = {
	type: "game" | "profile" | "subject";
	parentID: string;
};

export default function DeathLog({ type, parentID }: Props) {
	const tree = useDeathLogStore((state) => state.tree);

	const childIDS = tree.get(parentID)?.childIDS || [];
	const cards = useMemo(() => {
		return childIDS.map((nodeID) => <Card key={nodeID} id={nodeID} />);
	}, [childIDS, parentID]);

	return (
		<>
			<NavBar />
			{/* <div className="mb-8 flex flex-col items-center justify-center">
				<AddItemCard pageType={type} parentID={parentID} />

			<CardWrapper cards={cards} />
			</div> */}
			{/* <div className="grid">
				<div className="card bg-base-100 w-96 shadow-sm">
					<figure>
						<img
							src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
							alt="Shoes"
						/>
					</figure>
					<div className="card-body">
						<h2 className="card-title">Card Title</h2>
						<p>
							A card component has a figure, a body part, and
							inside body there are title and actions parts
						</p>
						<div className="card-actions justify-end">
							<button className="btn btn-primary">Buy Now</button>
						</div>
					</div>
				</div>
			</div> */}
		</>
	);
}
