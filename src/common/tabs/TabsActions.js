export const ACTIVE_TAB = 'ACTIVE_TAB';

/**
 * 네비게이션에서 클릭 된 label을 넘겨줌
 */
export function tabActive(label) {
	return dispatch => {
		return dispatch({
			type: ACTIVE_TAB,
			label: label
		})
	} 
}
