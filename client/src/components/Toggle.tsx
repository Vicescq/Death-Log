import { useState } from "react";

export default function Toggle() {
	const [translate, setTranslate] = useState(false);
	const circleCSS = translate ? "translate-x-6" : null;
	const bgCSS = translate ? "bg-blue-700" : "bg-gray-700";

	return (
		<button
			className={`${bgCSS} h-8 w-14 rounded-2xl border-3 p-1 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)]`}
			onClick={() => setTranslate((prev) => !prev)}
		>
			<div
				className={`${circleCSS} transition duration-300 h-4 w-4 transform rounded-2xl bg-white`}
			></div>
		</button>
	);
}
