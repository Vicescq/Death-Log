export default function Container({children}: {children: React.ReactNode}) {
    return (
        <div className="flex items-center justify-center gap-2 m-8">
            {children}
        </div>
    )
}