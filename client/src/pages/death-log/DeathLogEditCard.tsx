import NavBar from "../../components/navBar/NavBar";
import DeathLogBreadcrumb from "./DeathLogBreadcrumb";

export default function DeathLogEditCard() {
	return (
		<>
			<NavBar
				endNavContent={<DeathLogBreadcrumb />}
				endNavContentCSS="w-[70%]"
				startNavContentCSS="w-[30%]"
			/>

			<div className="m-auto mb-8 w-[90%] lg:max-w-[45rem]">
				<h1 className="text-center text-4xl font-bold">
					sdasdsad Profile Groups
				</h1>
			</div>
		</>
	);
}
