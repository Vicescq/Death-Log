import { useRef, useState } from "react";

export function useReliabilityOverride() {
	const modalRef = useRef<HTMLDialogElement>(null);
	const [overrideVersion, setOverrideVersion] = useState(0);

	return {
		modalRef,
		overrideVersion,
		openSettings: () => modalRef.current?.showModal(),
		onModalClose: () => setOverrideVersion((v) => v + 1),
	};
}
