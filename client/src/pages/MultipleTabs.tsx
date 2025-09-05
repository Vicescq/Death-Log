export default function MultipleTabs() {
	return (
		<div className="flex   items-center justify-center text-3xl ">
			MULTIPLE TABS DETECTED! Please close THIS TAB and use only one!
			Otherwise your data get corrupted due to multiple tabs possbily
			referencing to 'orphaned' cards.
		</div>
	);
}
