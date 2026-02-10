import { CONSTANTS } from "../../shared/constants";

type Props = {
	onPageTurn: (isRight: boolean) => void;
	page: number;
	css: string;
};

export default function PaginationNav({ onPageTurn, page, css }: Props) {
	return (
		<div className={`join ${css} flex`}>
			<button
				aria-label={CONSTANTS.PAGINATION_NAV.TURN_LEFT_ARIA}
				className="join-item btn"
				onClick={(e) => {
					e.preventDefault();
					onPageTurn(false);
				}}
			>
				«
			</button>
			<button
				onClick={(e) => e.preventDefault()}
				className="join-item btn flex-1"
			>
				Page {page}
			</button>
			<button
				aria-label={CONSTANTS.PAGINATION_NAV.TURN_RIGHT_ARIA}
				className="join-item btn"
				onClick={(e) => {
					e.preventDefault();
					onPageTurn(true);
				}}
			>
				»
			</button>
		</div>
	);
}
