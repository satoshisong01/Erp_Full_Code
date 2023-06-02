import { ACTIVE_TAB } from "./TabsActions";

export function tabsReducer (
	state = {
		label: "",
	},
	action
) {
	switch (action.type) {
		case ACTIVE_TAB: 
			return {
				...state,
				label: action.label
			}

		default: //기본값 세팅
		  return { ...state };
	}
}