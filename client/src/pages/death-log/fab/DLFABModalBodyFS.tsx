type Props = {
	type: "flt" | "sort";
};

export default function DLFABModalBodyFS({ type }: Props) {
	return (
		<div className="flex flex-col gap-1">
			<div className="my-1">
				<label className="label mb-2" htmlFor="">
					Displayed Statuses
				</label>
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
				</ul>
			</div>

			{type == "flt" ? (
				<div className="my-1">
					<label className="label mb-2" htmlFor="">
						Filter options
					</label>
				</div>
			) : (
				<div className="my-1">
					<label className="label mb-2" htmlFor="">
						Sort options
					</label>
				</div>
			)}

			<button disabled className="btn btn-success w-full">
				Confirm
			</button>
			<button disabled className="btn btn-success w-full">
				Reset to Defaults
			</button>
		</div>
	);
}
