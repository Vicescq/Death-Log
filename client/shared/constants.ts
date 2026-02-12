export const CONSTANTS = {
	DOMAIN: "http://localhost:5173",
	ERROR: {
		URL: "URL not found!",
		HOME: "Click me to go back home!",
		MAX_LENGTH: "Too long!",
		DATE: "Invalid date!",
		TIME: "Invalid time!",
		EMPTY: "Cannot be empty!",
	},
	NUMS: {
		INPUT_MAX: 60,
		TEXTAREA_MAX: 1000,
		TEXTAREA_ROW_MAX: 6,
		DEATH_REMARK_MAX: 20,
	},
	INFO: {
		RELIABILITY:
			"A reliable date will be displayed when graphed. An unreliable date will be omitted by default but still can be shown.",
	},
	DEATH_LOG_EDITOR: {
		DEL_PH: "Type DEL to delete",
		DEL_SUBMIT_ARIA: "Delete Entry",
		SUBMIT: "Save",
		RESET: "Reset",
		RETURN: "Return",
	},
	DEATH_LOG_FAB: {
		OPEN_ARIA: "Open FAB",
		ADD_ARIA: "Add item",
		ADD_PH: "Type here",
		ADD_SUBMIT: "+",
	},
	DEATH_LOG_CARD: {
		ENTRY_CHILDREN_ARIA: "Folder Button",
		EDIT_MODE_ARIA: "Edit Button",
	},
	START: {
		GUEST_BTN: "Continue as guest",
	},
	PAGINATION_NAV: {
		TURN_RIGHT_ARIA: "Turn Right Page",
		TURN_LEFT_ARIA: "Turn Left Page",
	},
} as const;
