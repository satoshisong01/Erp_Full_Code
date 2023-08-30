// import { ACTIVE_TAB, SELECT_TAB, SELECT_HEADER } from "./TabsActions";
import { SELECT_GNB, SELECT_LNB, SELECT_SNB } from "./TabsActions";
import { Children } from "./Children";

export function tabsReducer(
    state = {
        gnbLabel: "",
        lnbLabel: "",
        snbLabel: "",
    },
    action
) {
    switch (action.type) {
        case SELECT_GNB:
            return {
                ...state,
                gnbLabel: action.gnbLabel,
            };

        case SELECT_LNB:
            return {
                ...state,
                lnbLabel: action.lnbLabel,
                snbLabel: ""
                // gnbLabel: Children.find((item) => item.label === action.lnbLabel).pLabel
            };

        case SELECT_SNB:
            return {
                ...state,
                snbLabel: action.snbLabel,
                lnbLabel: ""
                // gnbLabel: Children.find((item) => item.label === action.snbLabel).pLabel
            };
        default:
            // 기본값 세팅
            return { ...state };
    }
}
