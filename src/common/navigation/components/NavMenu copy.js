import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { navigationInit } from "../NavigationActions";
import NavMenuList from "./NavMenuList";
import { config } from "../../../config/config";
import store from "../../../store/configureStore";

const navItems = require("../../../config/navigation.json").items.map(addId);

class NavMenu extends Component {
    componentDidMount() {
        const defaults = {
            accordion: true,
            speed: config.menu_speed,
            closedSign: "[+]",
            openedSign: "[-]",
        };

        const { navigationInit } = this.props;
        navigationInit(navItems);

        const { accordion, speed, closedSign, openedSign } = this.props;
        const menuItems = Array.from(this.menuRef.querySelectorAll("li"));

        // Add a mark [+] to a multilevel menu
        menuItems.forEach((menuItem) => {
            if (menuItem.querySelector("ul")) {
                // Add the multilevel sign next to the link
                const anchor = menuItem.querySelector("a:first-child");
                const collapseSign = document.createElement("b");
                collapseSign.className = "collapse-sign";
                collapseSign.innerHTML = closedSign;
                anchor.appendChild(collapseSign);

                // Avoid jumping to the top of the page when the href is an #
                if (anchor.getAttribute("href") === "#") {
                    anchor.addEventListener("click", (e) => {
                        e.preventDefault();
                    });
                }
            }
        });

        // Open active level
        menuItems.forEach((menuItem) => {
            const anchor = menuItem.querySelector("a.active");
            if (anchor) {
                const ul = anchor.parentNode.querySelector("ul");
                const parentLi = ul.parentNode;
                ul.style.display = "block";
                parentLi.querySelector("b:first-child").innerHTML = openedSign;
                parentLi.classList.add("open");
            }
        });

        menuItems.forEach((menuItem) => {
            const anchor = menuItem.querySelector("a");
            if (anchor.parentNode.querySelector("ul")) {
                anchor.addEventListener("click", (e) => {
                    e.preventDefault();

                    const ul = anchor.parentNode.querySelector(
                        "ul:first-child"
                    );
                    const parentLi = ul.parentNode;

                    if (accordion) {
                        if (!ul.style.display) {
                            const parents = Array.from(
                                menuItem.querySelectorAll("ul")
                            ).map((ul) => ul.parentNode);
                            const visible = Array.from(
                                this.menuRef.querySelectorAll("ul:visible")
                            );
                            visible.forEach((visibleUl) => {
                                let close = true;
                                parents.forEach((parent) => {
                                    if (parent === visibleUl) {
                                        close = false;
                                        return;
                                    }
                                });
                                if (close) {
                                    if (ul !== visibleUl) {
                                        visibleUl.style.display = "none";
                                        visibleUl.parentNode.querySelector(
                                            "b:first-child"
                                        ).innerHTML = closedSign;
                                        visibleUl.parentNode.classList.remove(
                                            "open"
                                        );
                                    }
                                }
                            });
                        }
                    }

                    if (
                        ul.style.display === "block" &&
                        !ul.classList.contains("active")
                    ) {
                        ul.style.display = "none";
                        parentLi.classList.remove("open");
                        parentLi.querySelector(
                            "b:first-child"
                        ).style.animationDelay = `${speed}ms`;
                        parentLi.querySelector(
                            "b:first-child"
                        ).innerHTML = closedSign;
                    } else {
                        ul.style.display = "block";
                        parentLi.classList.add("open");
                        parentLi.querySelector(
                            "b:first-child"
                        ).style.animationDelay = `${speed}ms`;
                        parentLi.querySelector(
                            "b:first-child"
                        ).innerHTML = openedSign;
                    }
                });
            }
        });
    }

    render() {
        const { navItems } = this.props;
        return navItems ? (
            <NavMenuList items={navItems} />
        ) : (
            this.props.children
        );
    }
}

NavMenu.propTypes = {
    accordion: PropTypes.bool,
    speed: PropTypes.number,
    closedSign: PropTypes.string,
    openedSign: PropTypes.string,
    navigationInit: PropTypes.func,
    navItems: PropTypes.arrayOf(PropTypes.object),
};

const mapDispatchToProps = {
    navigationInit,
};

const mapStateToProps = (state) => ({
    navItems: state.navigation.items,
});

function addId(item) {
    if (item.items) {
        item.items = item.items.map(addId);
    }

    if (!item.id) {
        item.id = Math.random()
            .toString(36)
            .slice(2);
    }
    return item;
}

export default connect(mapStateToProps, mapDispatchToProps)(NavMenu);
