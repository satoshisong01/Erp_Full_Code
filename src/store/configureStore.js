import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { composeWithDevTools } from "redux-devtools-extension";

import {
  handleBodyClasses,
  dumpLayoutToStorage,
  layoutReducer,
  layoutInit
} from "../smartadmin/layout";

import { tabsReducer } from "components/tabs/tabsReducer";
import { navigationReducer } from "smartadmin/navigation";
import { todoReducer } from "smartadmin/todo";


export const rootReducer = combineReducers({
  navigation: navigationReducer,
  layout: layoutReducer,
  todo: todoReducer,
  tabs: tabsReducer
});

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(
      thunk,
      handleBodyClasses,
      dumpLayoutToStorage,
    )
  )
);

store.dispatch(layoutInit());

export default store;
