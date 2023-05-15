import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store/configureStore";
import { authRoutes } from "./routes";
import { Layout } from "./common/layout";
import CommonCodeManagement1 from "./views/components/sysadmin/CommonCodeManagement1";
import CommonCodeManagement2 from "./views/components/sysadmin/CommonCodeManagement2";
import ProgramManagement from "./views/components/sysadmin/ProgramManagement";
import ErrorlogManagement from "./views/components/sysadmin/ErrorlogManagement";
import UserManagement from "./views/components/sysadmin/UserManagement";
import UserManagementInfo from "./views/components/sysadmin/UserManagementInfo";

class App extends Component {
    render() {
        return (
            //<Provider store={store}>
            //  <HashRouter>
            //    <Switch>
            //      {authRoutes.map((route, idx) => {
            //        return route.component ? (
            //          <Route
            //            key={idx}
            //            path={route.path}
            //            exact={route.exact}
            //            name={route.name}
            //            render={props => <route.component {...props} />}
            //          />
            //        ) : null;
            //      })}

            //      <Route path="/" name="Home" component={Layout} />
            //    </Switch>
            //  </HashRouter>
            //</Provider>
            <>
                <CommonCodeManagement1 />
                <CommonCodeManagement2 />
                <ProgramManagement />
                <ErrorlogManagement />
                <UserManagement />
                <UserManagementInfo />
            </>
        );
    }
}

export default App;
