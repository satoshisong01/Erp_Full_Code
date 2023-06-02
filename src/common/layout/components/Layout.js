import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";

import { Navigation } from "../../navigation";
import Ribbon from "./Ribbon";
import LayoutSwitcher from "./LayoutSwitcher";

import Header from "./Header";
import Footer from "./Footer";

import { routes } from "../../../routes";
import Testing from "../../../views/Testing";
//import Testing2 from "../../../views/Testing2";
//import TopTabs from "./TopTabs";

class Layout extends React.Component {
    state = {
        titleData: null,
    };

    handleBackData = (data) => {
        console.log(data);
        this.setState({ titleData: data });
    };

    render() {
        return (
            <div>
                <Header />
                <Navigation onDataReceived={this.handleBackData} />
                <div id="main" role="main">
                    <LayoutSwitcher />
                    <Ribbon />
                    <Testing title={this.state.titleData} />
                    {/*<Testing2 title={this.state.titleData}/>*/}
                </div>
                <Footer />
            </div>
        );
    }
}

export default Layout;

{
    /*<Switch>
                        {routes.map((route, idx) => {
                            return route.component ? (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    exact={route.exact}
                                    name={route.name}
                                    // render={props => <route.component {...props}/>}
                                    render={(props) => (
                                        //<TopTabs name={route.name}>
                                        <route.component {...props} />
                                        //</TopTabs>
                                    )}
                                />
                            ) : null;
                        })}
                        <Redirect from="/" to="/misc/404" />
                    </Switch>*/
}
