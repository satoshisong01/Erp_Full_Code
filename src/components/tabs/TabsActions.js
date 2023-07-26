export const ACTIVE_TAB = 'ACTIVE_TAB';
export const SELECT_TAB = 'SELECT_TAB';
export const SELECT_HEADER = 'SELECT_HEADER';

/** 네비게이션에서 클릭 된 label을 넘겨줌 */
export function tabActive(label) {
	return dispatch => {
		return dispatch({
			type: ACTIVE_TAB,
			label: label
		})
	} 
}
export function tabSelect(label) {
	return dispatch => {
		return dispatch({
			type: SELECT_TAB,
			label: label
		})
	} 
}
export function headerSelect(header) {
	return dispatch => {
		return dispatch({
			type: SELECT_HEADER,
			header: header
		})
	} 
}
