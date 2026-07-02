import { Link } from "react-router";

export default function FAQSuggest() {
	return (
		<div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
			<h2 className="text-xl font-bold">New to Death Log?</h2>
			<p className="text-sm opacity-70">
				Get familiar with the terms we use here, like games, profiles,
				and subjects, before you dive in.
			</p>
			<Link to="/faq" className="btn btn-accent">
				Visit the FAQ
			</Link>
		</div>
	);
}
