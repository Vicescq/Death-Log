import { useLocation } from "react-router";
import { useTreeStore } from "../../stores/useTreeStore";
import type { Subject } from "../../model/TreeNodeModel";
import add from "../../assets/add.svg";
import minus from "../../assets/minus.svg";
import {
	assertIsDistinctTreeNode,
	assertIsNonNull,
	assertIsSubject,
} from "../../utils";
import useLoadDeathLog from "../deathLog/useLoadDeathLog";
import { ForceError } from "../ErrorPage";

export default function DeathCounter() {
	const location = useLocation();
	const nodeID: string = location.state;

	const node = useTreeStore((state) => state.tree.get(nodeID));
	const tree = useTreeStore((state) => state.tree);
	const updateNodeDeaths = useTreeStore((state) => state.updateNodeDeaths);
	const { loading, deletedID } = useLoadDeathLog(tree, nodeID);

	function getSubjectDeaths() {
		// had to make this because of typescript errors and JSX syntax
		assertIsNonNull(node);
		assertIsSubject(node);
		return node.deaths;
	}

	return (
		<>
			{loading ? null : deletedID ? (
				<ForceError
					msg={
						"This page does not exist anymore! You probably deleted something and pressed forward in the browser history!"
					}
				/>
			) : node ? (
				<div className="flex flex-col items-center justify-center">
					<h1 className="mt-4 w-70 text-center text-4xl sm:w-120 md:w-180">
						{node.name}
					</h1>
					<div className="mt-38 mb-28 flex text-6xl">
						<div className="m-auto">
							<img
								className="bg-hunyadi border-hunyadi w-10 rounded-2xl border-4 shadow-[6px_4px_0px_rgba(0,0,0,1)]"
								src={minus}
								onClick={() => {
									assertIsSubject(node);
									if (node.deaths > 0) {
										updateNodeDeaths(node, "subtract");
									}
								}}
							/>
						</div>
						<span className="w-50 text-center">
							{getSubjectDeaths()}
						</span>
						<div className="m-auto">
							<img
								className="bg-hunyadi border-hunyadi w-10 rounded-2xl border-4 shadow-[6px_4px_0px_rgba(0,0,0,1)]"
								src={add}
								onClick={() => {
									assertIsSubject(node);
									updateNodeDeaths(node, "add");
								}}
							/>
						</div>
					</div>
				</div>
			) : null}
		</>
	);
}
