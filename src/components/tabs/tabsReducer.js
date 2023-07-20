import { ACTIVE_TAB, SELECT_TAB, SELECT_HEADER } from "./TabsActions";

export function tabsReducer(
    state = {
        label: "",
        selectLabel: "",
        header: ""
    },
    action
) {
    switch (action.type) {
        case ACTIVE_TAB:
            return {
                ...state,
                label: action.label,
                selectLabel: ""
            };

        case SELECT_TAB:
            return {
                ...state,
                selectLabel: action.label,
                label: ""
            };

        case SELECT_HEADER:
            return {
                ...state,
                header: action.header,
            };

        default:
            // 기본값 세팅
            return { ...state };
    }
}
