import { useLocation } from "react-router";
import type { CardMainPageTransitionState } from "../components/card/types";
import DeathLog from "./DeathLog/DeathLog";

export default function MainPageRouter() {
	let location = useLocation();
	let mainPageState: CardMainPageTransitionState | undefined = location.state;

	if (!mainPageState) {
		return <DeathLog key={"ROOT_NODE"} type="game" parentID="ROOT_NODE" />;
	}

	switch (mainPageState?.type) {
		case "GameToProfiles":
			return (
				<DeathLog key={mainPageState.parentID} type="profile" parentID={mainPageState.parentID} />
			);

		case "ProfileToSubjects":
			return (
				<DeathLog key={mainPageState.parentID} type="subject" parentID={mainPageState.parentID} />
			);
	}
}
