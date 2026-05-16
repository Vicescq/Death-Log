export default function ToolbarSort() {
	return (
		<form onSubmit={() => 1}>
			<div className="flex flex-col gap-1">
				<div className="my-1">
					<label>
						<div className="flex gap-4">
							<input
								type="checkbox"
								className="checkbox checkbox-info"
								// {...form.register("uncompleted")}
							/>
							Ascending
						</div>
					</label>
				</div>

				<div className="my-1">
					<div className="text-info mb-2">Contexts</div>
					<ul className="flex flex-col gap-2">
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="radio"
										name="radio-4"
										className="radio radio-primary"
										defaultChecked
									/>
									Date Created
								</div>
							</label>
						</li>
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="radio"
										name="radio-4"
										className="radio radio-primary"
									/>
									Date Completed
								</div>
							</label>
						</li>
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="radio"
										name="radio-4"
										className="radio radio-primary"
										defaultChecked
									/>
									Name
								</div>
							</label>
						</li>
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="radio"
										name="radio-4"
										className="radio radio-primary"
										defaultChecked
									/>
									Death Count
								</div>
							</label>
						</li>
						<li>
							<label>
								<div className="flex gap-4">
									<input
										type="radio"
										name="radio-4"
										className="radio radio-primary"
										defaultChecked
									/>
									Time Spent
								</div>
							</label>
						</li>
					</ul>
				</div>

				<div className="my-1 text-sm">
					Note that if sorting based on Date Completed, it will put
					uncompleted items always at the end of the list!
				</div>

				<button
					type="submit"
					className="btn btn-success mt-2 w-full"
					// disabled={
					// 	!form.formState.isValid || !form.formState.isDirty
					// }
				>
					Confirm
				</button>
				<button
					type="reset"
					className="btn btn-info w-full"
					// onClick={(e) => {
					// 	e.preventDefault();
					// 	onReset();
					// }}
				>
					Reset to defaults
				</button>
			</div>
		</form>
	);
}
