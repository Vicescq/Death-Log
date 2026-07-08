export const CONSTANTS = {
	DOMAIN: "http://localhost:5173",
	ERROR: {
		URL: "URL not found!",
		HOME: "Click me to go back home!",
		MAX_LENGTH: "Too long!",
		DATE: "Invalid date!",
		TIME: "Invalid time!",
		EMPTY: "Cannot be empty!",
		DATETIME_START_SURPASSED_END:
			"Created date time cannot surpass completed date time!",
		DATETIME_SURPASSED_TODAY: "Date time cannot be set in the future!",
		NON_UNIQUE: "Name already exists!",
		TIMESPENT: "Invalid time format!",
		GEN_FORMAT: "Invalid format!",
	},
	NUMS: {
		INPUT_MAX: 60,
		TEXTAREA_MAX: 1000,
		TEXTAREA_ROW_MAX: 6,
		INPUT_MAX_LESSER: 20,
	},
	INFO: {
		RELIABILITY:
			"A reliable date will be displayed when graphed. An unreliable date will be omitted by default but still can be shown.",
		TIME_RESET_NOTICE:
			"You have changed a date field, time has been reset to 12:00:00 AM for a clean slate!",
		TIMESPENT:
			"Time format has to be the following: HH:MM:SS or N / A. Minutes and seconds have to have a leading zero if 1 digit only. Hours can have more than 2 digits if needed.",
		AZ_RANGE:
			"Format has to be X-Y where X and Y can be any character (a-z) case insensitive.",
		DEATH_RANGE:
			"Format has to be X-Y where X and Y can be any integer. Or in another format: ~X, where ~ represents an operator (=, >=, >, <, <=) and X is an integer.",
		DATE_RANGE:
			"Will filter based on completion time if completed, otherwise it filters on creation time.",
		GROUP_FILTER:
			"Selecting one or more groups shows only subjects belonging to at least one of them. Selecting none shows subjects regardless of group.",
	},
	DEATH_LOG_EDITOR: {
		DEL_PH: "Type DEL to delete",
		DEL_SUBMIT_ARIA: "Delete Entry",
		SUBMIT: "Save",
		RESET: "Reset",
		RETURN: "Return",
	},
	DEATH_LOG_CARD: {
		ENTRY_CHILDREN_ARIA: "Folder Button",
		EDIT_MODE_ARIA: "Edit Button",
		COMPLETION_CONFIRM: "Confirm",
		COMPLETION_CANCEL: "Cancel",
	},
	START: {
		CONTINUE: "Continue",
	},
	PAGINATION_NAV: {
		TURN_RIGHT_ARIA: "Turn Right Page",
		TURN_LEFT_ARIA: "Turn Left Page",
	},
	TOOLBAR: {
		ADD_BTN_ARIA: "Add entry",
		ADD_MODAL_NAME_LABEL: "Name",
		ADD_MODAL_CTX_LABEL: "Context",
		ADD_MODAL_REOCC_LABEL: "Reoccurring",
		ADD_MODAL_SUBMIT: "+",
		EXIT_SEARCH_ARIA: "Exit searching",
		FILTER_BTN_ARIA: "Filter",
		SORT_BTN_ARIA: "Sort",
		SEARCH_BTN_ARIA: "Search list",
		SEARCH_PH: "Search for title",
	},
} as const;
