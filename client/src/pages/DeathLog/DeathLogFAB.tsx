import { useEffect, useRef, useState } from "react";
import add from "../../assets/add.svg";
import fabEdit from "../../assets/fab_edit.svg";
import filter from "../../assets/filter.svg";
import sort from "../../assets/sort.svg";
import up from "../../assets/up.svg";
import down from "../../assets/down.svg";
import Modal from "../../components/Modal";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import useInputTextError from "./card/useInputTextError";
import type { VirtuosoHandle } from "react-virtuoso";
import type { Subject, SubjectContext } from "../../model/TreeNodeModel";
import * as Utils from "./utils";

export type EditableSubjectField = Pick<Subject, "reoccurring" | "context">;

type Props = {
	type: "game" | "profile" | "subject";
	parentID: string;
	handleFabOnFocus: () => void;
	handleFabOnBlur: () => void;
	virtuosoRef: React.RefObject<VirtuosoHandle | null>;
};

export default function DeathLogFAB({
	type,
	parentID,
	handleFabOnFocus,
	handleFabOnBlur,
	virtuosoRef,
}: Props) {
	const addNode = useDeathLogStore((state) => state.addNode);
	const modalRef = useRef<HTMLDialogElement>(null);
	const [inputText, setInputText] = useState("");
	const [subjectContext, setSubjectContext] =
		useState<SubjectContext>("boss");
	const [reoccurring, setReoccurring] = useState(false);

	const {
		inputTextError,
		setInputTextError,
		inputTextErrorIsDisplayed,
		setInputTextErrorIsDisplayed,
	} = useInputTextError(inputText);

	const header =
		type != "subject"
			? type[0].toUpperCase() + type.slice(1) + " title"
			: type[0].toUpperCase() +
				type.slice(1) +
				" title & Characteristics";

	return (
		<>
			<div className="fab">
				<div
					tabIndex={0}
					role="button"
					className="btn btn-lg btn-circle bg-success"
					onFocus={handleFabOnFocus}
					onBlur={handleFabOnBlur}
				>
					<img src={fabEdit} alt="" />
				</div>

				<div className="fab-close">
					Close
					<span className="btn btn-circle btn-lg btn-error">✕</span>
				</div>

				<div>
					Add {type}
					<button
						className="btn btn-lg btn-circle btn-success"
						onClick={() => modalRef.current?.showModal()}
					>
						<img src={add} alt="" />
					</button>
				</div>
				<div>
					Sort {type}s
					<button
						className="btn btn-lg btn-circle btn-neutral"
						onClick={() => modalRef.current?.showModal()}
					>
						<img src={sort} alt="" />
					</button>
				</div>
				<div>
					Filter {type}s
					<button
						className="btn btn-lg btn-circle"
						onClick={() => modalRef.current?.showModal()}
					>
						<img src={filter} alt="" />
					</button>
				</div>
				<div>
					Bottom
					<button
						className="btn btn-lg btn-circle btn-accent"
						onClick={() => {
							virtuosoRef.current?.scrollToIndex({
								index: "LAST",
								behavior: "smooth",
							});

							if (document.activeElement instanceof HTMLElement) {
								document.activeElement.blur();
							}
						}}
					>
						<img src={down} alt="" />
					</button>
				</div>
				<div>
					Top
					<button
						className="btn btn-lg btn-circle btn-accent"
						onClick={() => {
							window.scrollTo({
								top: 0,
								left: 0,
								behavior: "smooth",
							});
							if (document.activeElement instanceof HTMLElement) {
								document.activeElement.blur();
							}
						}}
					>
						<img src={up} alt="" />
					</button>
				</div>
			</div>
			<Modal
				ref={modalRef}
				header={header}
				content={
					<>
						<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
							<legend className="fieldset-legend"></legend>

							<div className="join w-full">
								<div className="join-item w-full">
									<input
										type="search"
										placeholder="Type here"
										className="input"
										onChange={(e) =>
											setInputText(e.currentTarget.value)
										}
										onBlur={(e) =>
											setInputText(
												e.currentTarget.value
													.replace(/\s+/g, " ")
													.trim(),
											)
										}
										value={inputText}
									/>
									<div
										className={`text-error mt-2 ml-2 ${inputTextErrorIsDisplayed ? "" : "hidden"} text-sm`}
									>
										{inputTextError}
									</div>
								</div>

								<button
									className="btn join-item btn-neutral"
									onClick={() => {
										try {
											if (type != "subject") {
												addNode(
													type,
													inputText,
													parentID,
												);
											} else {
												addNode(
													type,
													inputText,
													parentID,
													{
														context: subjectContext,
														reoccurring:
															reoccurring,
													},
												);
											}
											modalRef.current?.close();
											setInputTextErrorIsDisplayed(false);
										} catch (e) {
											if (e instanceof Error) {
												setInputTextError(e.message);
												setInputTextErrorIsDisplayed(
													true,
												);
											}
										}
									}}
								>
									Confirm
								</button>
							</div>

							{type == "subject" ? (
								<>
									<fieldset className="fieldset">
										<legend className="fieldset-legend"></legend>
										<select
											className="select"
											value={Utils.mapContextKeyToProperStr(
												subjectContext,
											)}
											onChange={(e) =>
												setSubjectContext(
													Utils.mapProperStrToContextKey(
														e.currentTarget.value,
													),
												)
											}
										>
											<option>Boss</option>
											<option>Location</option>
											<option>Generic Enemy</option>
											<option>Mini Boss</option>
											<option>Other</option>
										</select>
									</fieldset>
									<div className="flex">
										<span className="text-[1rem]">
											Reoccurring
										</span>
										<input
											type="checkbox"
											checked={reoccurring}
											className="toggle toggle-primary ml-auto"
											onChange={(e) =>
												setReoccurring(
													e.currentTarget.checked,
												)
											}
										/>
									</div>
								</>
							) : null}
						</fieldset>
					</>
				}
				closeBtnName="Close"
				modalBtns={[]}
				handleOnClose={() => {
					setInputText("");
					setInputTextErrorIsDisplayed(false);
					setSubjectContext("boss");
					setReoccurring(false);
				}}
			/>
		</>
	);
}
