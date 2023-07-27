import { createStore, combineReducers } from "redux";

import { tabsReducer } from "components/tabs/tabsReducer";

export const rootReducer = combineReducers({
    tabs: tabsReducer,
});

const store = createStore(rootReducer);

export default store;
