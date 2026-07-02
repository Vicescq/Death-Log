import type { ReactNode } from "react";
import NavBar from "../../components/nav-bar/NavBar";
import { CRUD_QA } from "./crud-qa";
import { KEY_TERMS } from "./key-terms";
import { ACCOUNT_QA } from "./account-qa";
import { DATA_QA } from "./data-qa";
import { VISUALIZATION_QA } from "./visualization-qa";
import { MISC_QA } from "./misc-qa";
import FAQSection from "./FAQSection";

export type QA = {
	question: string;
	answer: ReactNode;
}[];

export default function FAQ() {
	return (
		<>
			<NavBar midNavContent={<></>} />
			<div className="mx-auto max-w-2xl px-4 py-10">
				<h1 className="mb-6 text-3xl font-bold">
					Frequently Asked Questions
				</h1>

				<div className="flex flex-col gap-12">
					<FAQSection title="Using the app" items={CRUD_QA} />
					<FAQSection title="Key Terms" items={KEY_TERMS} />
					<FAQSection title="Managing Data" items={DATA_QA} />
					<FAQSection title="Account Related" items={ACCOUNT_QA} />
					<FAQSection
						title="Visualization"
						items={VISUALIZATION_QA}
					/>
					<FAQSection title="Misc" items={MISC_QA} />
				</div>
			</div>
		</>
	);
}
