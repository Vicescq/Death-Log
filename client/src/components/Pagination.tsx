import useMediaQuery from "../hooks/useMediaQuery";

const ELLIPSIS = "ellipsis" as const;

type PageItem = number | typeof ELLIPSIS;

type Props = {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

const breakpointLg = "(width >= 1024px)";
const breakpointMd = "(width >= 768px)";

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: Props) {
	const { vpMatched: vpLg } = useMediaQuery(breakpointLg);
	const { vpMatched: vpMd } = useMediaQuery(breakpointMd);

	function getPageRange(
		currentPage: number,
		totalPages: number,
		siblingCount: number,
	): PageItem[] {
		const totalNumbers = siblingCount * 2 + 5;

		if (totalPages <= totalNumbers) {
			return range(1, totalPages);
		}

		const leftSibling = Math.max(currentPage - siblingCount, 1);
		const rightSibling = Math.min(currentPage + siblingCount, totalPages);

		const showLeftEllipsis = leftSibling > 2;
		const showRightEllipsis = rightSibling < totalPages - 1;

		if (!showLeftEllipsis && showRightEllipsis) {
			const leftRange = range(1, 3 + 2 * siblingCount);
			return [...leftRange, ELLIPSIS, totalPages];
		}

		if (showLeftEllipsis && !showRightEllipsis) {
			const rightRange = range(
				totalPages - (2 + 2 * siblingCount),
				totalPages,
			);
			return [1, ELLIPSIS, ...rightRange];
		}

		return [
			1,
			ELLIPSIS,
			...range(leftSibling, rightSibling),
			ELLIPSIS,
			totalPages,
		];
	}

	function range(start: number, end: number): number[] {
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	}

	const siblingCount = vpLg ? 3 : vpMd ? 2 : 1;

	if (totalPages <= 1) return null;

	const pages = getPageRange(currentPage, totalPages, siblingCount);

	return (
		<div className="join flex-wrap justify-center">
			{pages.map((page, i) =>
				page === ELLIPSIS ? (
					<button
						key={`ellipsis-${i}`}
						className="join-item btn btn-disabled"
					>
						...
					</button>
				) : (
					<button
						key={page}
						className={`join-item btn ${page === currentPage ? "btn-info" : ""}`}
						onClick={() => onPageChange(page)}
					>
						{page}
					</button>
				),
			)}
		</div>
	);
}
