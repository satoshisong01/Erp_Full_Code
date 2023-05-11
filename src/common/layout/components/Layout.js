import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";

import { Navigation } from "../../navigation";
import Ribbon from "./Ribbon";
import LayoutSwitcher from "./LayoutSwitcher";

import Header from "./Header";
import Footer from "./Footer";

import { routes } from "../../../routes";
import TopTabs from "./TopTabs";

class Layout extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Navigation />
        <div id="main" role="main">

          {/* LayoutSwitcher -> Layout Options */}
          <LayoutSwitcher />

          {/* Ribbon -> Home */}
          <Ribbon />
          
          <Switch>
            {routes.map((route, idx) => {
              return route.component ? (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  // render={props => <route.component {...props}/>}
                  render={ props => 
                      <TopTabs name={route.name}>
                        <route.component {...props} /> 
                      </TopTabs>
                  }
                />
              ) : null;
              
          })}
            <Redirect from="/" to="/misc/404" />
          </Switch>


        </div>

        <Footer />
      </div>
    );
  }
}

export default Layout;
