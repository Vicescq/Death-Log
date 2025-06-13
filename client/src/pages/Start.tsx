
import EntryHeader from "../components/EntryHeader";
import SignIn from "../components/SignIn";

export default function Start() {
	return (
		<div className="mt-10 flex flex-col gap-20">
			<EntryHeader />
			<SignIn/>
		</div>
	);
}
