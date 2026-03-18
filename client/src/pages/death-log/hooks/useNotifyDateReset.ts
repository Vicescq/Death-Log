import { useState } from "react";

export default function useNotifyDateReset() {
	const [timeNotice, setTimeNotice] = useState<string | null>(null);

	function handleReset() {
		setTimeNotice(null);
	}

	function handleTimeNoticeChange(notice: string | null) {
		setTimeNotice(notice);
	}

	return {
		timeNotice,
		onResetNotice: handleReset,
		onTimeNoticeChange: handleTimeNoticeChange,
	};
}
