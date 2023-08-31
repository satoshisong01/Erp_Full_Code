import Status from "components/button/Status";
import React, { useState } from "react";

export default function FormDataTable({ formTableColumns, onAddRow }) {
    const initialFormData = {}; // 폼 초기 데이터

    formTableColumns.forEach((row) => {
        row.forEach(({ key }) => {
            initialFormData[key] = "";
        });
    });

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    const inputChange = (fieldName, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
        setErrors((prevErrors) => ({ //에러 초기화
            ...prevErrors,
            [fieldName]: "",
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        formTableColumns.forEach((row) => {
            row.forEach(({ key, require }) => {
                if (require && !formData[key]) {
                    newErrors[key] = "This field is required.";
                    isValid = false;
                }
            });
        });

        setErrors(newErrors);
        return isValid;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const updatedFormData = { ...formData, poiStatus: "작성완료" }; // state 속성 변경
            onAddRow(updatedFormData);
            setFormData(initialFormData); // 초기화
        }
    };

    const onReset = () => {
        setFormData(initialFormData); // 초기화
        setErrors({});
    }

    return (
        <>
            <div className="flex-between mg-b-10">
                <span className="table-title">프로젝트 신규 등록</span>
                <span>
                    <button onClick={onReset} className="btn-outline mg-r-10" type="submit">
                        초기화
                    </button>
                    <button onClick={onSubmit} className="btn-outline" type="submit">
                        등록
                    </button>
                </span>
            </div>
            <div className="table-Container">
                <form onSubmit={onSubmit}>
                    <table className="table-styled">
                        <tbody>
                            {formTableColumns.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map(
                                        ({ label, key, type, colSpan, option, require }, colIndex) => {
                                            return (
                                                <React.Fragment key={colIndex}>
                                                    <th>
                                                        <span>{label}</span>
                                                        {require && (
                                                            <span className="text-danger mg-l-5">*</span>
                                                        )}
                                                    </th>
                                                    {type === 'input' ? (
                                                        <td colSpan={colSpan || '1'}>
                                                            <input
                                                                type="text"
                                                                value={formData[key]}
                                                                onChange={(e) => inputChange(key, e.target.value)}
                                                            />
                                                            {errors[key] && (
                                                                <div className="text-error">{errors[key]}</div>
                                                            )}
                                                        </td>
                                                    ) : type === 'select' ? (
                                                        <td colSpan={colSpan || '1'}>
                                                            <select
                                                                value={formData[key]}
                                                                onChange={(e) => inputChange(key, e.target.value)}
                                                            >
                                                                <option value="">선택</option>
                                                                {option.map((op) => (
                                                                    <option key={op} value={op}>
                                                                        {op}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {errors[key] && (
                                                                <div className="text-error">{errors[key]}</div>
                                                            )}
                                                        </td>
                                                    ) : label === '상태' ? (
                                                        <td colSpan={colSpan || '1'}>
                                                            <span><Status status="작성중" /></span>
                                                        </td>
                                                    ) : null}
                                                </React.Fragment>
                                            );
                                        }
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>
            </div>
        </>
    );
}
