import { ADD_TAB, REMOVE_TAB } from "./TabsActions";

export function tabsReducer(
    state = {
        isAdd: false,
        isActive: false,
        // isRemove: false,
        activeIndex: 0,
        label: "",
        children: null, //여기서 컴포넌트를 넣어주자??
        key: 0,
    },
    action
) {
    switch (action.type) {
        case ADD_TAB:
            alert("label: " + action.label); //네비게이션에서 누른거 이름
            return {
                ...state,
                label: action.label,
            };

        case REMOVE_TAB:
            return true;

        case "test":
            return true;

        default:
            //기본값 세팅
            return true;
    }
}
