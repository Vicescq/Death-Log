import ArrowLeftIcon from "../../../components/icons/ArrowLeftIcon";
import ArrowRightIcon from "../../../components/icons/ArrowRightIcon";
import RefreshIcon from "../../../components/icons/RefreshIcon";

type Props = {
	currentDate: Date;
	onChange: (date: Date) => void;
};

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export default function CalendarHeader({ currentDate, onChange }: Props) {
	const baseYear = new Date().getFullYear();
	const years = Array.from({ length: 5 }, (_, i) => baseYear - 2 + i);

	return (
		<div className="mb-4 flex gap-2">
			<button
				onClick={() =>
					onChange(
						new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
					)
				}
				className="btn btn-sm gap-2"
				aria-label="Previous month"
			>
				<ArrowLeftIcon />
				<span className="hidden sm:inline">Back</span>
			</button>

			<select
				value={currentDate.getMonth()}
				onChange={(e) =>
					onChange(
						new Date(currentDate.getFullYear(), parseInt(e.target.value), 1),
					)
				}
				className="select select-sm select-bordered max-w-xs flex-1"
			>
				{MONTHS.map((m, i) => (
					<option key={m} value={i}>
						{m}
					</option>
				))}
			</select>

			<select
				value={currentDate.getFullYear()}
				onChange={(e) =>
					onChange(
						new Date(parseInt(e.target.value), currentDate.getMonth(), 1),
					)
				}
				className="select select-sm select-bordered max-w-xs flex-1"
			>
				{years.map((y) => (
					<option key={y} value={y}>
						{y}
					</option>
				))}
			</select>

			<button
				onClick={() =>
					onChange(
						new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
					)
				}
				className="btn btn-sm gap-2"
				aria-label="Next month"
			>
				<span className="hidden sm:inline">Next</span>
				<ArrowRightIcon />
			</button>

			<button
				onClick={() => {
					const today = new Date();
					onChange(new Date(today.getFullYear(), today.getMonth(), 1));
				}}
				className="btn btn-sm btn-ghost gap-1"
				aria-label="Reset to current month"
				title="Reset to current month"
			>
				<RefreshIcon />
				<span className="hidden sm:inline">Today</span>
			</button>
		</div>
	);
}
