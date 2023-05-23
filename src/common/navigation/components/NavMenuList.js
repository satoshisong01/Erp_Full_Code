import React from "react";
import NavMenuItem from "./NavMenuItem";

export default function SmartMenuList(props) {
    const { items, parentFn, ...restProps } = props;
    console.log(parentFn, "4번계층");
    return (
        <ul {...restProps}>
            {items.map((item) => (
                <NavMenuItem item={item} key={item.id} parentFn={parentFn} />
            ))}
        </ul>
    );
}
