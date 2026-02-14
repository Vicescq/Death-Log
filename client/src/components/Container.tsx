type Props = {
	children: React.ReactNode;
	className?: string;
};

export default function Container({ children, className = "" }: Props) {
	return (
		<div
			className={`${className} m-auto mb-8 w-[90%] sm:max-w-[75%] lg:max-w-[40rem]`}
		>
			{children}
		</div>
	);
}
