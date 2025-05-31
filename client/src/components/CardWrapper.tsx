export default function CardWrapper({ cards }: { cards: React.JSX.Element[] | undefined }) {
    return (
        <>
            {cards
                ? (
                    <div className="grid gap-7 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2  grid-cols-1">
                        {cards}
                    </div>
                ) : ("No cards rendered!")
            }
        </>
    )
}