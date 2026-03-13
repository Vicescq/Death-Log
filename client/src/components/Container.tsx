type Props = {
	children: React.ReactNode;
	css?: string;
};

export default function Container({ children, css = "" }: Props) {
	return (
		<div
			className={`${css} m-auto w-[90%] sm:max-w-[75%] lg:max-w-[40rem]`}
		>
			{children}
		</div>
	);
}
