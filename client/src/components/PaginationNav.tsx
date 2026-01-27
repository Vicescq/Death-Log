import { CONSTANTS } from "../../shared/constants";

type Props = {
	handlePageTurn: (isRight: boolean) => void;
	page: number;
	css: string;
};

export default function PaginationNav({ handlePageTurn, page, css }: Props) {
	return (
		<div className={`join ${css} flex`}>
			<button
				aria-label="Modal Turn Left"
				className="join-item btn"
				onClick={() => {
					handlePageTurn(false);
				}}
			>
				«
			</button>
			<button className="join-item btn flex-1">Page {page}</button>
			<button
				aria-label={CONSTANTS.DEATH_LOG_MODAL.TURN_RIGHT}
				className="join-item btn"
				onClick={() => {
					handlePageTurn(true);
				}}
			>
				»
			</button>
		</div>
	);
}
