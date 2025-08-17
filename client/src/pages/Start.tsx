
import EntryHeader from "../components/start/EntryHeader";
import SignIn from "../components/start/SignIn";

export default function Start() {
	return (
		<div className="mt-10 flex flex-col gap-20">
			<EntryHeader />
			<SignIn/>
		</div>
	);
}
