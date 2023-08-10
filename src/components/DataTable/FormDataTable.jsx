import Status from "components/button/Status";
import React, { useEffect, useState } from "react";

export default function FormDataTable ({ formTableColumns, newProject }) {

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        startDate: "",
        currency: "",
        vendor: "",
        contactPerson: "",
        endDate: "",
        orderAmount: "",
        Invoice: "",
        status: ""

    });
        
    const inputChange = (fieldName, value) => {
        // console.log('⭕ fieldName:'+fieldName+' value:'+value)
        
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const InputField = ({ key, type, value, colSpan, option }) => {
        if(key === 'status') {
            return (
                <td colSpan={colSpan || '1'}>
                    <Status status="작성중" />
                </td>
            );
        }
        if (type === 'input') {
            return (
                <td colSpan={colSpan || '1'}>
                    <input type="text" value={value} onChange={(e) => inputChange(key, e.target.value)} />
                </td>
            );
        } else if (type === 'select') {
            return (
                <td colSpan={colSpan || '1'}>
                    <select value={value} onChange={(e) => inputChange(key, e.target.value)}>
                        {option.map((op) => (
                            <option key={op} value={op}>{op}</option>
                        ))}
                    </select>
                </td>
            );
        }
    };

    const onClick = () => {
        newProject(formData)
    }

    return (
        <>
            <div className="flex-between mg-b-10">
                <span className="table-title">프로젝트 신규 등록</span>
                <button onClick={onClick} className="btn-outline">신규</button>
            </div>
            <div className="table-Container">
                <table className="table-styled">
                    <tbody>
                        {formTableColumns.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map(({ label, key, type, colSpan, option}, colIndex) => {
                                    return (
                                        <React.Fragment key={colIndex}>
                                            <th>{label}</th>
                                            {InputField({key, type, value:formData[key], colSpan, option})}
                                        </React.Fragment>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}