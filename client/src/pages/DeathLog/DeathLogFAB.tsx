import { useEffect, useRef, useState } from "react";
import add from "../../assets/add.svg";
import fabEdit from "../../assets/fab_edit.svg";
import filter from "../../assets/filter.svg";
import sort from "../../assets/sort.svg";
import up from "../../assets/up.svg";
import Modal from "../../components/Modal";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import useInputTextError from "./Card/useInputTextError";

type Props = {
	type: "game" | "profile" | "subject";
	parentID: string;
	handleFabOnFocus: () => void;
	handleFabOnBlur: () => void;
};

export default function DeathLogFAB({
	type,
	parentID,
	handleFabOnFocus,
	handleFabOnBlur,
}: Props) {
	const addNode = useDeathLogStore((state) => state.addNode);
	const modalRef = useRef<HTMLDialogElement>(null);
	const [inputText, setInputText] = useState("");

	const {
		inputTextError,
		setInputTextError,
		inputTextErrorIsDisplayed,
		setInputTextErrorIsDisplayed,
	} = useInputTextError(inputText);

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
					Back to top
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
				header={`${type[0].toUpperCase() + type.slice(1)} title`}
				content={
					<div className="join mt-6 w-full">
						<div className="join-item w-full">
							<input
								type="search"
								placeholder="Type here"
								className="input"
								onChange={(e) =>
									setInputText(e.currentTarget.value)
								}
								onBlur={(e) =>
									setInputText(e.currentTarget.value.trim())
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
							className="btn join-item"
							onClick={() => {
								try {
									addNode(type, inputText, parentID);
									modalRef.current?.close();
									setInputTextErrorIsDisplayed(false);
								} catch (e) {
									if (e instanceof Error) {
										setInputTextError(e.message);
										setInputTextErrorIsDisplayed(true);
									}
								}
							}}
						>
							Confirm
						</button>
					</div>
				}
				closeBtnName="Close"
				modalBtns={[]}
				handleOnClose={() => {
					setInputText("");
					setInputTextErrorIsDisplayed(false);
				}}
			/>
		</>
	);
}
