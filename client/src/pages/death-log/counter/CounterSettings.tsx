import type { UseFormReturn } from "react-hook-form";
import type { DeathCounterForm } from "../formSchemas";
import { CONSTANTS } from "../../../../shared/constants";
import TooltipButton from "../../../components/TooltipButton";

type Props = {
	form: UseFormReturn<DeathCounterForm>;
};

export default function CounterSettings({ form }: Props) {
	return (
		<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full rounded-2xl border p-4">
			<legend className="fieldset-legend">Death Settings</legend>

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
							<label htmlFor="timestampRelYes">Yes</label>

							<input
								type="radio"
								className="radio"
								{...form.register("timestampRel")}
								value={"T"}
								id="timestampRelYes"
								data-testid="timestampRelYes"
							/>
						</div>

						<div className="flex items-center justify-center gap-1">
							<label htmlFor="timestampRelNo">No</label>
							<input
								type="radio"
								className="radio"
								{...form.register("timestampRel")}
								value={"F"}
								id="timestampRelNo"
								data-testid="timestampRelNo"
							/>
						</div>
					</div>
				</div>
			</div>
		</fieldset>
	);
}
