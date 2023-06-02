import React, { useState } from "react";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

const ResizableTable = () => {
    const [columnWidths, setColumnWidths] = useState([100, 100, 100, 100]);

    const onResize = (index, event, { size }) => {
        // 조정된 크기를 처리하는 로직
        const newColumnWidths = [...columnWidths];
        newColumnWidths[index] = size.width;
        setColumnWidths(newColumnWidths);
    };

    return (
        <div className="page-container">
            <h1>jquery-resizable - Table Column Resizing</h1>
            <hr />
            <p>
                This example makes the first two columns of the table resizable.
            </p>
            <hr />

            <table style={{ tableLayout: "fixed" }}>
                <thead>
                    <tr>
                        <th className="firstth">
                            <div className="tt">1</div>
                            <div className="tt">2</div>
                            <div className="tt">3</div>
                        </th>
                        <th>col 2</th>
                        <th>col 3</th>
                        <th>col 4</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <Resizable
                                width={columnWidths[0]}
                                height={40}
                                onResize={(event, { size }) =>
                                    onResize(0, event, { size })
                                }
                            >
                                <div>Column 1</div>
                            </Resizable>
                        </td>
                        <td>
                            <Resizable
                                width={columnWidths[1]}
                                height={40}
                                onResize={(event, { size }) =>
                                    onResize(1, event, { size })
                                }
                            >
                                <div>Column 2</div>
                            </Resizable>
                        </td>
                        <td>
                            <Resizable
                                width={columnWidths[2]}
                                height={40}
                                onResize={(event, { size }) =>
                                    onResize(2, event, { size })
                                }
                            >
                                <div>Column 3</div>
                            </Resizable>
                        </td>
                        <td>
                            <Resizable
                                width={columnWidths[3]}
                                height={40}
                                onResize={(event, { size }) =>
                                    onResize(3, event, { size })
                                }
                            >
                                <div>Column 4</div>
                            </Resizable>
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr />
        </div>
    );
};

export default ResizableTable;
