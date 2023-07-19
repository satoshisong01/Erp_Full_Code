import React from "react";

import NavMenuItem from "./NavMenuItem";

export default function SmartMenuList(props) {
    const { onDataReceived, items, ...p } = props;
    return (
        <ul {...p}>
            {items.map((item) => {
                return (
                    <NavMenuItem
                        item={item}
                        key={item.id}
                        onDataReceived={onDataReceived}
                    />
                );
            })}
        </ul>
    );
}
