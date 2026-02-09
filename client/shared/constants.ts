export const CONSTANTS = {
	DOMAIN: "http://localhost:5173",
	DEATH_LOG_MODAL: {
		DEL_PH: "Type DEL to delete",
		DEL_SUBMIT: "Delete Entry",
		TURN_RIGHT: "Modal Right Page",
		TURN_LEFT: "Modal Left Page",
		SUBMIT: "Save edits",
		CLOSE: "Cancel",
	},
	DEATH_LOG_FAB: {
		OPEN: "Open FAB",
		ADD: "Add item",
		ADD_PH: "Type here",
		ADD_SUBMIT: "Confirm",
	},
	DEATH_LOG_CARD: {
		ENTRY_CHILDREN: "Folder Button",
		EDIT_MODE: "Edit Button",
	},
	START: {
		GUEST_BTN: "Continue as guest",
	},
	ERROR: {
		URL: "URL not found!",
		HOME: "Click me to go back home!",
		MAX_LENGTH: "Max Length Reached!",
	},
	INPUT_TEXT_ERROR: {
		EMPTY: "Name cannot be empty!",
		NON_UNIQUE: "Name has to be unique!",
		STR: "Name has to be of type string!",
		ELP: "Please use another name!",
	},
	INPUT_MAX: 60,
	TEXTAREA: {
		TEXTAREA_MAX: 1000,
		TEXTAREA_ROWS: 6,
	},
	RELIABILITY:
		"A reliable date will be displayed when graphed. An unreliable date will be omitted by default but still can be shown.",
	DEATH_REMARK_MAX: 20,
	DELAY: 150
} as const;
