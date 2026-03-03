import { useEffect } from "react";
import { useParams } from "react-router";

/**
 * Due to DL's route structure: /:id representing different tree depths, certain UI like navigation dialog for breadcrumbs stay rendered on page transition. This unrenders that dialog for better UX
 */
export default function useRenderDLCorrectly(onCloseModal: () => void) {
	const { id } = useParams();
	useEffect(() => {
		onCloseModal();
	}, [id]);
}
