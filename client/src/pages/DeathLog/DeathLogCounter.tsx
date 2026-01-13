import { useDeathLogStore } from "../../stores/useDeathLogStore";
import up from "../../assets/up.svg";
import down from "../../assets/down.svg";
import useBreadcrumbMembers from "./useBreadcrumbMembers";
import DeathLogBreadcrumb from "./DeathLogBreadcrumb";
import NavBar from "../../components/navBar/NavBar";

type Props = {
	subjectID: string;
};

export default function DeathLogCounter({ subjectID }: Props) {
	const node = useDeathLogStore((state) => state.tree.get(subjectID));
	const updateNode = useDeathLogStore((state) => state.updateNode);

	const breadcrumbMembers = useBreadcrumbMembers();
	return (
		<>
			{node && node.type == "subject" ? (
				<>
					<NavBar
						midNavContent={<></>}
						endNavContent={
							<DeathLogBreadcrumb
								breadcrumbMembers={breadcrumbMembers}
							/>
						}
						endNavContentCSS="mr-0.5 w-[60%]"
						startNavContentCSS="w-[40%]"
					/>
					<div className="flex flex-col">
						<h1 className="mx-6 mt-4 text-center text-4xl break-all md:text-6xl">
							{node.name}
						</h1>

						<div className="mt-8 mb-16 flex flex-col gap-4">
							<span>
								<img
									src={up}
									className="border-hunyadi m-auto mt-15 w-8 rounded-2xl border-3 shadow-[6px_4px_0px_rgba(0,0,0,1)]"
									onClick={() => {
										updateNode(node, {
											...node,
											deaths: node.deaths + 1,
										});
									}}
								/>
							</span>
							<span className={`text-center text-6xl`}>
								{node.deaths}
							</span>
							<span>
								<img
									src={down}
									className="border-indianred m-auto w-8 rounded-2xl border-3 shadow-[6px_4px_0px_rgba(0,0,0,1)]"
									onClick={() => {
										if (node.deaths > 0) {
											updateNode(node, {
												...node,
												deaths: node.deaths - 1,
											});
										}
									}}
								/>
							</span>
						</div>
					</div>
				</>
			) : null}
		</>
	);
}
