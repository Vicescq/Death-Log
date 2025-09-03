import { useLocation } from "react-router";
import { useTreeStore } from "../../stores/useTreeStore";
import type { Subject } from "../../model/TreeNodeModel";
import add from "../../assets/add.svg";
import minus from "../../assets/minus.svg";
import { assertIsNonNull, assertIsSubject } from "../../utils";

export default function DeathCounter() {
	const location = useLocation();
	const nodeID: string = location.state;
	const updateNodeDeaths = useTreeStore((state) => state.updateNodeDeaths);
    const node = useTreeStore((state) => state.tree.get(nodeID));
    assertIsNonNull(node);
    assertIsSubject(node);

	return (
		<div className="flex flex-col items-center justify-center">
			<h1 className="mt-4 w-70 text-center text-4xl sm:w-120 md:w-180">
				{node.name}
			</h1>
			<div className="mt-38 mb-28 flex text-6xl">
				<div className="m-auto">
					<img
						className="bg-hunyadi border-hunyadi w-10 rounded-2xl border-4 shadow-[6px_4px_0px_rgba(0,0,0,1)]"
						src={minus}
						onClick={() => updateNodeDeaths(node, "subtract")}
					/>
				</div>
                <span className="w-50 text-center">{node.deaths}</span>
				
				<div className="m-auto">
					<img
						className="bg-hunyadi border-hunyadi w-10 rounded-2xl border-4 shadow-[6px_4px_0px_rgba(0,0,0,1)]"
						src={add}
						onClick={() => updateNodeDeaths(node, "add")}
					/>
				</div>
			</div>
		</div>
	);
}
