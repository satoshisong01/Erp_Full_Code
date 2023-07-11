import React, { useState } from "react";

const TableExample = () => {
    const [data, setData] = useState([
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 30 },
        { id: 3, name: "Bob", age: 35 },
    ]);

    const openPopup = (item) => {
        const windowWidth = 400;
        const windowHeight = 300;
        const left = window.screen.width / 2 - windowWidth / 2;
        const top = window.screen.height / 2 - windowHeight / 2;

        const popupWindow = window.open(
            "",
            "_blank",
            `width=${windowWidth},height=${windowHeight},left=${left},top=${top}`
        );
        popupWindow.document.write(`
      <html>
        <head>
          <title>Data Details</title>
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 20px;
            }
            h3, p {
              margin: 0;
            }
          </style>
        </head>
        <body>
          <h3>Data Details</h3>
          <p>ID: ${item.id}</p>
          <p>Name: ${item.name}</p>
          <p>Age: ${item.age}</p>
        </body>
      </html>
    `);
        popupWindow.document.close();
    };

    return (
        <div>
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
        </div>
    );
};

export default TableExample;
