export const SET_LOGIN = 'SET_LOGIN';

/**
 * 네비게이션에서 클릭 된 label을 넘겨줌
 */
export function loginActive(isLogin) {
	return dispatch => {
		return dispatch({
			type: SET_LOGIN,
			isLogin: isLogin
		})
	} 
}
