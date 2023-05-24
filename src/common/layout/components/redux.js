import { createStore } from "redux";

// 액션 타입 정의
const UPDATE_VALUE = "UPDATE_VALUE";

// 액션 생성 함수
export const updateValue = (value) => {
    return {
        type: UPDATE_VALUE,
        payload: value,
    };
};

// 초기 상태 정의
const initialState = {
    value: "",
};

// 리듀서 함수
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_VALUE:
            return {
                ...state,
                value: action.payload,
            };
        default:
            return state;
    }
};

// 스토어 생성
const store = createStore(reducer);

export default store;
