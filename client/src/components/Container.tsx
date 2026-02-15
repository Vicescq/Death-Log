type Props = {
	children: React.ReactNode;
	className?: string;
	noBotMargin?: boolean;
};

export default function Container({
	children,
	className = "",
	noBotMargin = false,
}: Props) {
	return (
		<div
			className={`${className} m-auto ${noBotMargin ? "mb-0" : "mb-8"} w-[90%] sm:max-w-[75%] lg:max-w-[40rem]`}
		>
			{children}
		</div>
	);
}
