export default function MultipleTabs() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center p-70 text-4xl tracking-wider">
			MULTIPLE TABS DETECTED! Please close THIS TAB and use only one!
			Otherwise your data WILL be corrupted due to multiple tabs possbily
			referencing to 'orphaned' cards. Not following this will lead to
			data loss and it will suck! Unless you dont care about your
			DeathLog... which will make me sad :(
		</div>
	);
}
