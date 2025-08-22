import { useLocation } from "react-router";
import Games from "./MainPages/Games";
import type { CardMainPageTransitionState } from "../components/card/CardTypes";
import Profiles from "./MainPages/Profiles";
import Subjects from "./MainPages/Subjects";

export default function MainPageRouter() {
	let location = useLocation();
	let mainPageState: CardMainPageTransitionState | undefined = location.state;

	if (!mainPageState) {
		return <Games />;
	}

	switch (mainPageState?.type) {
		case "GameToProfiles":
			return <Profiles gameID={mainPageState.parentID} />;

		case "ProfileToSubjects":
			return <Subjects profileID={mainPageState.parentID} />;
	}
}
