import React from 'react';
import { Provider } from 'react-redux';

import RootRoutes from './routes';
import store from "./store/configureStore";

import './css/base.css';
import './css/layout.css';
import './css/component.css';
import './css/page.css';
import './css/response.css';


function App() {
  return (
    <div className="wrap">
      <Provider store={store}>
        <RootRoutes />
      </Provider>
    </div>
  );
}

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('process.env.REACT_APP_EGOV_CONTEXT_URL', process.env.REACT_APP_EGOV_CONTEXT_URL);

export default App;
