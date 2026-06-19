import { useLocation } from "react-router";

const STEPS = ["/stats/build", "/stats/build/chart", "/stats/build/data"];

export default function BuildSteps() {
	const location = useLocation();
	const currentIndex = STEPS.findLastIndex((s) =>
		location.pathname.startsWith(s),
	);
	return (
		<ul className="steps steps-horizontal">
			{STEPS.map((step, i) => (
				<li
					key={step}
					className={`step ${i <= currentIndex ? "step-primary" : ""}`}
				/>
			))}
		</ul>
	);
}
