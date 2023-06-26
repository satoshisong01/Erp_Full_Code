import React, { useState, useEffect } from "react";
import {
    HashRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import { authRoutes, routes } from "./routes";
import { Layout } from "./common/layout";
import Login from "./views/auth/components/Login";
//import MenuMng from "./views/sysadmin/components/MenuMng";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuthentication = (value) => {
        setIsAuthenticated(value);
    };

    const renderLogin = () => {
        return isAuthenticated ? (
            <Layout />
        ) : (
            <Login loginCheck={checkAuthentication} />
        );
    };

    return (
        <Provider store={store}>
            <Router>
                <Switch>
                    <Route path="/login" render={renderLogin} />
                    {/* 기존의 authRoutes 매핑 */}
                    {authRoutes.map((route, idx) => (
                        <Route
                            key={idx}
                            path={route.path}
                            exact={route.exact}
                            name={route.name}
                            render={(props) => <route.component {...props} />}
                        />
                    ))}
                    {/* 기존의 routes 매핑 */}
                    {routes.map((route, idx) => (
                        <Route
                            key={idx}
                            path={route.path}
                            exact={route.exact}
                            name={route.name}
                            render={(props) => <route.component {...props} />}
                        />
                    ))}
                    <Redirect from="/" to="/login" />
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;
