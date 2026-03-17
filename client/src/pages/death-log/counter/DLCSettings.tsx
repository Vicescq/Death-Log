import type { UseFormReturn } from "react-hook-form";
import type { Subject } from "../../../model/tree-node-model/SubjectSchema";
import type { DeathCounterForm } from "../formSchemas";
import { CONSTANTS } from "../../../../shared/constants";
import TooltipButton from "../../../components/TooltipButton";

type Props = {
	subject: Subject;
	form: UseFormReturn<DeathCounterForm>;
};

export default function DLCSettings({ subject, form }: Props) {
	return (
		<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full rounded-2xl border p-4">
			<legend className="fieldset-legend">Death Settings</legend>

			{!subject.completed ? (
				<>
					<label className="floating-label">
						<span>Death Remark (Optional)</span>
						<input
							type="search"
							placeholder="Died to a bug!"
							className="input w-full"
							{...form.register("remark")}
						/>
					</label>

					{form.formState.errors.remark && (
						<div className="text-error">
							{form.formState.errors.remark.message}
						</div>
					)}

					<div className="mt-4 flex">
						<span className="my-auto">Is Timestamp Reliable?</span>
						<TooltipButton
							tooltip={CONSTANTS.INFO.RELIABILITY}
							css="tooltip-primary"
						/>
						<div className="ml-auto">
							<div className="flex gap-2">
								<div className="flex items-center justify-center gap-1">
									Yes
									<input
										type="radio"
										className="radio"
										{...form.register("timestampRel")}
										value={"T"}
									/>
								</div>

								<div className="flex items-center justify-center gap-1">
									No
									<input
										type="radio"
										className="radio"
										{...form.register("timestampRel")}
										value={"F"}
									/>
								</div>
							</div>
						</div>
					</div>
				</>
			) : null}
		</fieldset>
	);
}
