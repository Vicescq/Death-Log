import { useLocation } from "react-router";
import Games from "./Games";

export default function MainPageRouter() {
	let location = useLocation();
	let renderedMainPage: React.JSX.Element;

	if (!location.state) {
		renderedMainPage = <Games />;
	}
    else if (location.state)
	renderedMainPage = <Games />;
	return renderedMainPage;
}
