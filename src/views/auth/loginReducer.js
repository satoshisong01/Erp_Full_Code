import { SET_LOGIN } from "./LoginActions";

export default function loginReducer (
	state = {
		isLogin: false,
	},
	action
) {
	switch (action.type) {
		case SET_LOGIN: 
			return {
				...state,
				isLogin: action.isLogin
			}

		default: //기본값 세팅
		  return state;
	}
}