export const SELECT_GNB = 'SELECT_GNB';
export const SELECT_LNB = 'SELECT_LNB';
export const SELECT_SNB = 'SELECT_SNB';

/* global(header) navi bar */
export function selectGnb(label) {
	return dispatch => {
		return dispatch({
			type: SELECT_GNB,
			gnbLabel: label
		})
	} 
}

/* local(site map) navi bar */
export function selectLnb(label) {
	return dispatch => {
		return dispatch({
			type: SELECT_LNB,
			lnbLabel: label
		})
	} 
}

/* side(left) navi bar */
export function selectSnb(label) {
	return dispatch => {
		return dispatch({
			type: SELECT_SNB,
			snbLabel: label
		})
	} 
}

