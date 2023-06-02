import React from "react";

import { Navigation } from "../../navigation";
import Ribbon from "./Ribbon";
import LayoutSwitcher from "./LayoutSwitcher";

import Header from "./Header";
import Footer from "./Footer";
import { TabPanes } from "../../tabs";

// import Testing from "../../../views/Testing";

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
                    <TabPanes />
                    {/* <Testing title={this.state.titleData} /> */}
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
