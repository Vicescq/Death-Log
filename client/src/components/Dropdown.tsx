import type { ReactNode } from "react";

type Props = {
	trigger: ReactNode;
	children: ReactNode;
	className?: string;
	triggerClassName?: string;
	contentClassName?: string;
};

export default function Dropdown({
	trigger,
	children,
	className = "",
	triggerClassName = "",
	contentClassName = "",
}: Props) {
	return (
		<details className={`dropdown ${className}`}>
			<summary className={`list-none ${triggerClassName}`}>
				{trigger}
			</summary>
			<ul
				className={`dropdown-content ${contentClassName}`}
				onClick={(e) => {
					const details = e.currentTarget.closest("details");
					if (details) details.open = false;
				}}
			>
				{children}
			</ul>
		</details>
	);
}
