import React, { useState } from "react";
import Location from "components/Location/Location";
import ReactDataTableRowEdit from "components/DataTable/ReactDataTableRowEdit";
import ApprovalForm from "components/form/ApprovalForm";
import ModalSearch from "components/modal/ModalSearch";

/** 영업관리-수주계획관리 */
function OrderPlanMgmt() {
    const columns = [
        { header: "프로젝트 이름", col: "poiNm", cellWidth: "50%", type: "input"},
        { header: "프로젝트 코드", col: "poiCode", cellWidth: "25%", type: "input"},
        { header: "수주시작일", col: "poiBeginDt", cellWidth: "25%", type: "select", options: [{value: '1', label: 'op1'}, {value: '2', label: 'op2'}]},
    ];

    const path = [
        { title: "수주(사업)관리", middleName: "영업관리",  detailName: "수주(사업)관리",  },
    ];

    const [projectName, setProjectName] = useState("FOMC")
    const [currentTask, setCurrentTask] = useState("인건비")
    const [flag, setFlag] = useState(false)

    
    const saveDraft = (flag) => {
        setFlag(flag === true ? true : false)
    }

    const onChange = (e) => {
        const temp = e.target.value;
        if(temp === "1") {
            setCurrentTask("인건비");
        } else if(temp === "2") {
            setCurrentTask("경비");
        } else if(temp === "3") {
            setCurrentTask("구매(재료비)");
        }
    }

    const handleSelect = (value) => {
        if(value && typeof value === "string") {
            setProjectName(value);
        }
    }

    return (
        <>
            <div className="flex-group"> 
                <ModalSearch onSelect={handleSelect}/>
                <select onChange={onChange} >
                    <option value={1}>인건비</option>
                    <option value={2}>경비</option>
                    <option value={3}>구매(재료비)</option>
                </select>
            </div>

            <Location tableList={path} />

            <ApprovalForm title={currentTask} saveDraft={saveDraft}>
                <ReactDataTableRowEdit columns={columns} saveDraft={flag} />
            </ApprovalForm>
        </>
    );
}

export default OrderPlanMgmt;
