export const ADD_TAB = 'ADD_TAB';
export const REMOVE_TAB = 'REMOVE_TAB';

/**
 * 네비게이션에서 클릭 된 label을 넘겨줌
 */
export function onTabAdd(label) {
	return dispatch => {
		return dispatch({
			type: ADD_TAB,
			label: label
		})
	} 
}

export function onTabRemove(index) {
	return dispatch => {
		return dispatch({
			type: REMOVE_TAB,
			index: index
		})
	} 
}