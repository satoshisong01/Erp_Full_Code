import React, { useState } from "react";
import Draggable from "react-draggable";

const TableExample = () => {
    const [data, setData] = useState([
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 30 },
        { id: 3, name: "Bob", age: 35 },
    ]);

    const [selectedItem, setSelectedItem] = useState(null);

    const addRandomData = () => {
        const randomId = Math.floor(Math.random() * 1000);
        const randomAge = Math.floor(Math.random() * 50) + 20;
        const newData = { id: randomId, name: "Random", age: randomAge };
        setData([...data, newData]);
    };

    const openPopup = (item) => {
        setSelectedItem(item);
    };

    const closePopup = () => {
        setSelectedItem(null);
    };

    return (
        <div>
            <button onClick={addRandomData}>Add Random Data</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} onClick={() => openPopup(item)}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.age}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedItem && (
                <Draggable axis="both">
                    <div className="popup">
                        <button className="close-button" onClick={closePopup}>
                            X
                        </button>
                        <h3>Data Details</h3>
                        <p>ID: {selectedItem.id}</p>
                        <p>Name: {selectedItem.name}</p>
                        <p>Age: {selectedItem.age}</p>
                    </div>
                </Draggable>
            )}

            <style jsx>{`
                .popup {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: white;
                    padding: 20px;
                    border: 1px solid black;
                }

                .close-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                }
            `}</style>
        </div>
    );
};

export default TableExample;
