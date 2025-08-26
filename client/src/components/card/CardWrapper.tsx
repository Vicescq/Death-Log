export default function CardWrapper({
	cards,
}: {
	cards: React.JSX.Element[] | React.JSX.Element | undefined;
}) {
	return (
		<>
			<div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
				{cards}
			</div>
		</>
	);
}
