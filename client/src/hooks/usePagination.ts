import { useState } from "react";

export default function usePagination(maxPage: number) {
    const [page, setPage] = useState(1);

    function handlePageTurn(isRight: boolean) {
        if (isRight) {
            setPage((prev) => (prev + 1 > maxPage ? prev : prev + 1));
        } else {
            setPage((prev) => (prev - 1 < 1 ? prev : prev - 1));
        }
    }

    return {page, setPage, handlePageTurn}
}