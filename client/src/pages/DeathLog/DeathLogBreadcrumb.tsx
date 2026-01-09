import useMediaQuery from "../../hooks/useMediaQuery";

export type BreadcrumbMember = {
	link: string;
	name: string;
};

type Props = {
	breadcrumbMembers: BreadcrumbMember[];
};

export default function DeathLogBreadcrumb({ breadcrumbMembers }: Props) {
	const breakPoint = "(width >= 775px)";
	const { vpMatched } = useMediaQuery(breakPoint);

	let formattedBreadcrumbMembers: BreadcrumbMember[] = [
		{ name: "Death Log", link: "/log" },
		...breadcrumbMembers,
	];
	// if (!vpMatched) {
	// 	formattedBreadcrumbMembers = formattedBreadcrumbMembers.slice(1);
	// 	formattedBreadcrumbMembers = [{link: "", name: "..."}, ...formattedBreadcrumbMembers.slice(1)]
	// }


	return (
		<div className="breadcrumbs border-b-1 text-sm">
			<ul>
				{formattedBreadcrumbMembers.map((member, i) => {
					return (
						<li key={i}>
							<a href={member.link}>{member.name}</a>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
