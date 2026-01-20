import { useEffect, useRef, useState } from "react";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import useMediaQuery from "../../hooks/useMediaQuery";
import * as Utils from "./utils";
import Modal from "../../components/Modal";
import navIcon from "../../assets/arrow_forward.svg";
import { Link } from "react-router";

export type BreadcrumbMember = {
	link: string;
	name: string;
	condensedMembers?: BreadcrumbMember[];
};

type Props = {
	breadcrumbMembers: BreadcrumbMember[];
};

export default function DeathLogBreadcrumb({ breadcrumbMembers }: Props) {
	const condensedMembersModalRef = useRef<HTMLDialogElement>(null);

	const [modalCSS, setModalCSS] = useState("");

	const breakpointHighest = "(width >= 920px)";
	const breakpointHigh = "(width >= 700px)";
	const breakpointMid = "(width >= 500px)";
	const { vpMatched: vpMatchedHighest } = useMediaQuery(breakpointHighest);
	const { vpMatched: vpMatchedHigh } = useMediaQuery(breakpointHigh);
	const { vpMatched: vpMatchedMid } = useMediaQuery(breakpointMid);

	const formattedBreadcrumbMembers = Utils.formatBreadcrumbMembers(
		breadcrumbMembers,
		vpMatchedHighest,
		vpMatchedHigh,
		vpMatchedMid,
	);

	useEffect(() => {
		condensedMembersModalRef.current?.close();
		setModalCSS("transition-none");
	}, [vpMatchedHighest, vpMatchedHigh, vpMatchedMid]);

	return (
		<>
			<div className="breadcrumbs border-b-1 text-sm">
				<ul>
					{formattedBreadcrumbMembers.map((member, i) => {
						if (member.name == "...") {
							return (
								<li
									onClick={() => {
										setModalCSS("");
										condensedMembersModalRef.current?.showModal();
									}}
									className="btn btn-xs btn-ghost"
									key={i}
								>
									{member.name}
								</li>
							);
						}
						return (
							<li key={i}>
								{i == formattedBreadcrumbMembers.length - 1 ? (
									<div className="status status-primary mr-2 animate-bounce"></div>
								) : null}
								<Link to={{ pathname: member.link }}>
									{member.name}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
			<Modal
				css={modalCSS}
				closeBtnName="Close"
				content={
					<ul className="rounded-box my-2 flex flex-col gap-4">
						{formattedBreadcrumbMembers[0].condensedMembers?.map(
							(member, i) => {
								return (
									<li className="rounded-xl p-0.5" key={i}>
										<Link
											className="flex gap-2"
											to={{ pathname: member.link }}
										>
											<span className="text-accent w-2">
												{i + 1}
											</span>
											<span className="flex-1">
												{member.name}
											</span>
											<img
												src={navIcon}
												className="w-5"
												alt=""
											/>
										</Link>
									</li>
								);
							},
						)}
					</ul>
				}
				header="Navigation"
				modalBtns={[]}
				ref={condensedMembersModalRef}
			/>
		</>
	);
}
