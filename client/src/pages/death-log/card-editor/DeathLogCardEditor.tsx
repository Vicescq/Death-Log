import NavBar from "../../../components/navBar/NavBar";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import DeathLogBreadcrumb from "../breadcrumb/DeathLogBreadcrumb";
import DLCEDate from "./DLCEDate";
import DLCEDel from "./DLCEDel";

type Props = {
	node: DistinctTreeNode;
};

export default function DeathLogCardEditor({ node }: Props) {
	return (
		<>
			<NavBar
				endNavContent={<DeathLogBreadcrumb />}
				endNavContentCSS="w-[70%]"
				startNavContentCSS="w-[30%]"
			/>

			<div className="m-auto mb-8 w-[90%] sm:max-w-[75%] lg:max-w-[40rem]">
				<form action="">
					<h1 className="my-6 text-center text-4xl font-bold">
						Editing: {node.name}
					</h1>
					<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
						<legend className="fieldset-legend">
							View & Edit Fields
						</legend>

						<div className="flex flex-col gap-6">
							<label className="floating-label">
								<span>Name</span>
								<input type="search" className="input w-full" />
							</label>
							<DLCEDate node={node} />
						</div>

						<label className="floating-label">
							<span>Notes</span>
							<textarea className="textarea w-full" />
						</label>

						<DLCEDel node={node} />

						<button
							type="submit"
							className="btn btn-success mt-4 w-full"
						>
							Save Changes
						</button>
					</fieldset>
				</form>
			</div>
		</>
	);
}
