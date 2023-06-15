import { ACTIVE_TAB } from "./TabsActions";

export function tabsReducer(
    state = {
        label: "",
        //score: 0,
        isActive: false,
    },
    action
) {
    switch (action.type) {
        case ACTIVE_TAB:
            return {
                ...state,
                label: action.label,
                //score: state.score + 1,
                isActive: !state.isActive,
            };

        default:
            // 기본값 세팅
            return { ...state };
    }
}
