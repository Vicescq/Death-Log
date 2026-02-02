import { useDeathLogStore } from "../../stores/useDeathLogStore";
import up from "../../assets/up.svg";
import down from "../../assets/down.svg";
import DeathLogBreadcrumb from "./DeathLogBreadcrumb";
import NavBar from "../../components/navBar/NavBar";
import type { Subject } from "../../model/TreeNodeModel";
import { createDeath } from "../../stores/utils";
import { useState } from "react";
import { formatUTCDate } from "./utils";

type Props = {
	subject: Subject;
};

export default function DeathLogCounter({ subject }: Props) {
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const [remark, setRemark] = useState<string | null>(null);
	return (
		<>
			<NavBar
				midNavContent={<></>}
				endNavContent={<DeathLogBreadcrumb />}
				endNavContentCSS="w-[70%]"
				startNavContentCSS="w-[30%]"
			/>

			<div className="bg-base-300 m-auto mt-4 flex w-[85%] flex-col items-center justify-center rounded-4xl p-8 md:w-3xl">
				<h1 className="mx-6 w-fit rounded-2xl p-8 text-center text-4xl md:text-6xl">
					{subject.name}
				</h1>

				<div className="my-8 flex flex-col gap-4">
					<img
						src={up}
						className="w-8"
						onClick={() => {
							updateNode(subject, {
								...subject,
								log: [
									...subject.log,
									createDeath(subject.id, remark),
								],
							});
							setRemark(null);
						}}
					/>

					<span className={`text-center text-6xl`}>
						{subject.log.length}
					</span>

					<img
						src={down}
						className="w-8"
						onClick={() => {
							if (subject.log.length > 0) {
								const log = [...subject.log];
								log.pop();
								updateNode(subject, {
									...subject,
									log: log,
								});
							}
						}}
					/>
				</div>

				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
					<legend className="fieldset-legend">
						Remarks & Death History
					</legend>
					<label className="label">Death Remark</label>
					<input
						type="search"
						placeholder="Type your remark here and add a death"
						className="input w-full"
						value={remark == null ? "" : remark}
						onChange={(e) => {
							if (e.currentTarget.value == "") {
								setRemark(null);
							} else {
								setRemark(e.currentTarget.value);
							}
						}}
					/>
					<label className="label mt-8">Death History</label>
					<ul className="list">
						<li className="list-row flex">
							<div className="flex-1">Date</div>
							<div className="flex-2">Remark</div>
							<div className="flex-1 text-end">Edit & Delete</div>
						</li>

						<li className="list-row flex">
							<div className="flex-1">
								{formatUTCDate(new Date().toISOString())}
							</div>
							<div className="text-neutral flex-2">None</div>
							<div className="flex-1 text-end">
								<button className="cursor-pointer">✕</button>
							</div>
						</li>
					</ul>
				</fieldset>
			</div>
		</>
	);
}
