import type { ReactNode } from "react";

type Props = {
	trigger: ReactNode;
	children: ReactNode;
	triggerClassName?: string;
	contentClassName?: string;
};

export default function Dropdown({
	trigger,
	children,
	triggerClassName = "",
	contentClassName = "",
}: Props) {
	return (
		<details className="dropdown">
			<summary className={`list-none ${triggerClassName}`}>
				{trigger}
			</summary>
			<ul className={`dropdown-content ${contentClassName}`}>
				{children}
			</ul>
		</details>
	);
}
