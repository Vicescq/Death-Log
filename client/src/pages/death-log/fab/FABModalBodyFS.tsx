import type { DistinctTreeNode } from "../../../model/tree-node-model/TreeNodeSchema";
import FABModalBodyFSRange from "./FABModalBodyFSRange";

type Props = {
	type: "flt" | "sort";
	nodeType: Exclude<DistinctTreeNode["type"], "ROOT_NODE">;
};

export default function FABModalBodyFS({ type, nodeType }: Props) {
	return (
		<div className="flex flex-col gap-1">
			<div className="my-1">
				<div className="text-info mb-2">Displayed Statuses</div>
				<ul className="flex flex-col gap-2">
					<li>
						<label>
							<div className="flex gap-4">
								<input
									type="checkbox"
									defaultChecked
									className="checkbox checkbox-info"
								/>
								Uncompleted
							</div>
						</label>
					</li>
					<li>
						<label>
							<div className="flex gap-4">
								<input
									type="checkbox"
									defaultChecked
									className="checkbox checkbox-info"
								/>
								Completed
							</div>
						</label>
					</li>

					{nodeType == "subject" ? (
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="checkbox"
										defaultChecked
										className="checkbox checkbox-info"
									/>
									Reoccurring
								</div>
							</label>
						</li>
					) : null}
				</ul>
			</div>

			<div className="my-1">
				<div className="text-info mb-3">Alphabet Range</div>

				<label className="floating-label w-full" htmlFor="">
					<input type="text" className="input" />
				</label>
			</div>

			<FABModalBodyFSRange label="Date Range" />

			<div className="my-1">
				<div className="text-info mb-3">Death Range</div>
				<label className="floating-label w-full" htmlFor="">
					<input type="text" className="input" />
				</label>
			</div>

			<div className="my-1">
				<div className="text-info mb-3">
					Date Reliability Flags Display
				</div>
				<ul className="flex flex-col gap-2">
					<li>
						<label>
							<div className="flex gap-4">
								<input
									type="checkbox"
									defaultChecked
									className="checkbox checkbox-info"
								/>
								Show entries flagged as reliable
							</div>
						</label>
					</li>
					<li>
						<label>
							<div className="flex gap-4">
								<input
									type="checkbox"
									defaultChecked
									className="checkbox checkbox-info"
								/>
								Show entries flagged as unreliable
							</div>
						</label>
					</li>
				</ul>
			</div>

			<div className="my-1">
				<div className="text-info mb-3">Notes Display</div>
				<ul className="flex flex-col gap-2">
					<li>
						<label>
							<div className="flex gap-4">
								<input
									type="checkbox"
									defaultChecked
									className="checkbox checkbox-info"
								/>
								Show entries that have notes
							</div>
						</label>
					</li>
					<li>
						<label>
							<div className="flex gap-4">
								<input
									type="checkbox"
									defaultChecked
									className="checkbox checkbox-info"
								/>
								Show entries that have no notes
							</div>
						</label>
					</li>
				</ul>
			</div>

			<button disabled className="btn btn-success mt-2 w-full">
				Confirm
			</button>
			<button disabled className="btn btn-success w-full">
				Reset to Defaults
			</button>
		</div>
	);
}
