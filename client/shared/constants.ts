export const CONSTANTS = {
	DOMAIN: "http://localhost:5173",
	DEATH_LOG_MODAL: {
		DEL_PH: "Type DEL to delete",
		DEL_SUBMIT: "Delete Entry",
		TURN_RIGHT: "Modal Turn Right",
		EDIT_NAME: "Edit Name",
		SUBMIT: "Save edits",
		CLOSE: "Cancel"
	},
	DEATH_LOG_FAB: {
		OPEN: "Open FAB",
		ADD: "Add item",
		ADD_PH: "Type here",
		ADD_SUBMIT: "Confirm",
	},
	DEATH_LOG_CARD: {
		ENTRY_CHILDREN: "Folder Button",
		EDIT_MODAL: "Edit Button",
	},
	START: {
		GUEST_BTN: "Continue as guest",
	},
	ERROR: {
		URL: "URL not found!",
		HOME: "Click me to go back home!",
	},
	INPUT_TEXT_ERROR: {
		EMPTY: "Name cannot be empty!",
		NON_UNIQUE: "Name has to be unique!",
		STR: "Name has to be of type string!",
		ELP: "Please use another name!",
	},
} as const;
