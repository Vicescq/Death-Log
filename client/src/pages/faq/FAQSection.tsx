import type { QA } from "./FAQ";

type Props = {
	title: string;
	items: QA;
};

export default function FAQSection({ title, items }: Props) {
	return (
		<div>
			<h2 className="mb-3 text-xl font-semibold">{title}</h2>
			<div className="flex flex-col gap-2">
				{items.map((term) => (
					<details
						key={term.question}
						className="collapse-arrow border-base-300 bg-base-200 collapse border"
					>
						<summary className="collapse-title font-semibold">
							{term.question}
						</summary>
						<div className="collapse-content text-sm whitespace-pre-line opacity-80">
							{term.answer}
						</div>
					</details>
				))}
			</div>
		</div>
	);
}
