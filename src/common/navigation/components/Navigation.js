import React from "react";
import NavMenu from "./NavMenu";
import MinifyMenu from "./MinifyMenu";
import Testing from "../../../views/Testing";

const Navigation = ({ parentFn }) => {
    console.log(parentFn, "2번계층");
    return (
        <>
            <aside id="left-panel">
                <nav>
                    <NavMenu
                        parentFn={parentFn}
                        openedSign={<i className="fa fa-minus-square-o"></i>}
                        closedSign={<i className="fa fa-plus-square-o"></i>}
                    />
                </nav>
                <MinifyMenu />
            </aside>
        </>
    );
};

export default Navigation;

{
    /*<aside id="left-panel">
                    <nav></nav>
                </aside>
                <Testing />*/
}
