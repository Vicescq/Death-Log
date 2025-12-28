import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { assertIsNonNull, assertIsSubject } from "../../utils";
import useLoadDeathLogCorrectly from "../deathLog/useLoadDeathLogCorrectly";
import ErrorPage from "../ErrorPage";
import up from "../../assets/up.svg";
import down from "../../assets/down.svg";

type Props = {
	subjectID: string;
};

export default function DeathCounter({ subjectID }: Props) {
	const node = useDeathLogStore((state) => state.tree.get(subjectID));
	const tree = useDeathLogStore((state) => state.tree);
	const updateNodeDeaths = useDeathLogStore(
		(state) => state.updateNodeDeaths,
	);
	const updateNodeTimeSpent = useDeathLogStore(
		(state) => state.updateNodeTimeSpent,
	);
	const { loading, deletedID } = useLoadDeathLogCorrectly(tree, subjectID);

	function getSubjectDeaths() {
		// had to make this because of typescript errors and JSX syntax
		assertIsNonNull(node);
		assertIsSubject(node);
		return node.deaths;
	}

	return (
		<>
			{loading ? null : deletedID ? (
				<ErrorPage
					error={
						new Error(
							"This page does not exist anymore! You probably deleted something and pressed forward in the browser history!",
						)
					}
				/>
			) : node ? (
				<div className="flex flex-col">
					<h1 className="mx-6 mt-4 text-center text-4xl break-all md:text-6xl">
						{node.name}
					</h1>

					<div className="mt-8 mb-16 flex flex-col gap-4">
						<span>
							<img
								src={up}
								className="border-hunyadi m-auto mt-15 w-8 rounded-2xl border-3 shadow-[6px_4px_0px_rgba(0,0,0,1)]"
								onClick={() => {
									assertIsSubject(node);
									updateNodeDeaths(node, "add");
								}}
							/>
						</span>
						<span className={`text-center text-6xl`}>
							{getSubjectDeaths()}
						</span>
						<span>
							<img
								src={down}
								className="border-indianred m-auto w-8 rounded-2xl border-3 shadow-[6px_4px_0px_rgba(0,0,0,1)]"
								onClick={() => {
									assertIsSubject(node);
									if (node.deaths > 0) {
										updateNodeDeaths(node, "subtract");
									}
								}}
							/>
						</span>
					</div>
				</div>
			) : null}
		</>
	);
}
