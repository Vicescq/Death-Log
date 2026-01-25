import { useEffect, useRef, useState } from "react";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import useMediaQuery from "../../hooks/useMediaQuery";
import Modal from "../../components/Modal";
import navIcon from "../../assets/arrow_forward.svg";
import { Link } from "react-router";
import useBreadcrumbMembers from "./useBreadcrumbMembers";

export type BreadcrumbMember = {
	link: string;
	name: string;
	condensedMembers?: BreadcrumbMember[];
};

export default function DeathLogBreadcrumb() {
	const breadcrumbMembers = useBreadcrumbMembers();
	const condensedMembersModalRef = useRef<HTMLDialogElement>(null);
	const [modalCSS, setModalCSS] = useState("");

	const breakpointHighest = "(width >= 920px)";
	const breakpointHigh = "(width >= 700px)";
	const breakpointMid = "(width >= 500px)";
	const onBreakpontChange = () => {
		condensedMembersModalRef.current?.close();
		setModalCSS("transition-none");
	};
	const { vpMatched: vpMatchedHighest } = useMediaQuery(
		breakpointHighest,
		onBreakpontChange,
	);
	const { vpMatched: vpMatchedHigh } = useMediaQuery(
		breakpointHigh,
		onBreakpontChange,
	);
	const { vpMatched: vpMatchedMid } = useMediaQuery(
		breakpointMid,
		onBreakpontChange,
	);

	function condenseBreadcrumb(
		formattedBreadcrumbMembers: BreadcrumbMember[],
		toBeCondensed: number,
	) {
		formattedBreadcrumbMembers = [
			{
				link: "",
				name: "...",
				condensedMembers: [
					...formattedBreadcrumbMembers.slice(0, toBeCondensed),
				],
			},
			...formattedBreadcrumbMembers.slice(toBeCondensed),
		];
		return formattedBreadcrumbMembers;
	}

	let formattedBreadcrumbMembers: BreadcrumbMember[] = [
		{ name: "Death Log", link: "/log" },
		...breadcrumbMembers,
	];

	if (formattedBreadcrumbMembers.length == 4) {
		if (!vpMatchedMid) {
			formattedBreadcrumbMembers = condenseBreadcrumb(
				formattedBreadcrumbMembers,
				3,
			);
		} else if (!vpMatchedHigh) {
			formattedBreadcrumbMembers = condenseBreadcrumb(
				formattedBreadcrumbMembers,
				2,
			);
		} else if (!vpMatchedHighest) {
			formattedBreadcrumbMembers = condenseBreadcrumb(
				formattedBreadcrumbMembers,
				1,
			);
		}
	} else if (formattedBreadcrumbMembers.length == 3) {
		if (!vpMatchedMid) {
			formattedBreadcrumbMembers = condenseBreadcrumb(
				formattedBreadcrumbMembers,
				2,
			);
		} else if (!vpMatchedHigh) {
			formattedBreadcrumbMembers = condenseBreadcrumb(
				formattedBreadcrumbMembers,
				1,
			);
		}
	} else if (formattedBreadcrumbMembers.length == 2) {
		if (!vpMatchedMid) {
			formattedBreadcrumbMembers = condenseBreadcrumb(
				formattedBreadcrumbMembers,
				1,
			);
		}
	}
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
