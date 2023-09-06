import React, { useState } from "react";
import Location from "components/Location/Location";
import ApprovalForm from "components/form/ApprovalForm";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { locationPath } from "constants/locationPath";

/** 영업관리-수주계획관리 */
function DraftQuotation() {
    const laborColumns = [ // 인건비
        { header: "품목그룹명", col: "poiTitle", cellWidth: "20%", type: "select", options:[]},
        { header: "연월", col: "poiNm", cellWidth: "10%", type: "input"},
        { header: "M/M계", col: "poiCode", cellWidth: "10%", type: "input"},
        { header: "인건비계", col: "poiBeginDt1", cellWidth: "10%", type: "input"},
        { header: "특급기술사", col: "poiBeginDt2", cellWidth: "10%", type: "input"},
        { header: "고급기술사", col: "poiBeginDt3", cellWidth: "10%", type: "input"},
        { header: "중급기술사", col: "poiBeginDt4", cellWidth: "10%", type: "input"},
        { header: "초급기술사", col: "poiBeginDt5", cellWidth: "10%", type: "input"},
        { header: "중급기술사", col: "poiBeginDt6", cellWidth: "10%", type: "input"},
        { header: "고급기능사", col: "poiBeginDt7", cellWidth: "10%", type: "input"},
    ];
    const expensesColumns = [ // 경비
        { header: "경비목록", col: "poiTitle", cellWidth: "25%", type: "input"},
        { header: "비고", col: "poiTitle2", cellWidth: "50%", type: "input"},
        { header: "금액", col: "poiTitle3", cellWidth: "25%", type: "input"},
    ];
    const purchaseColumns = [ // 구매비
        { header: "품목그룹명", col: "poiTitle", cellWidth: "20%", type: "input"},
        { header: "품명", col: "poiTitle1", cellWidth: "20%", type: "input"},
        { header: "규격", col: "poiTitle2", cellWidth: "20%", type: "input"},
        { header: "수량", col: "poiTitle3", cellWidth: "10%", type: "input"},
        { header: "단위", col: "poiTitle4", cellWidth: "10%", type: "input"},
        { header: "소비자\n단가", col: "poiTitle5", cellWidth: "14%", type: "input"},
        { header: "소비자\n금액", col: "poiTitle6", cellWidth: "14%", type: "input"},
        { header: "단가", col: "poiTitle7", cellWidth: "10%", type: "input"},
        { header: "금액", col: "poiTitle8", cellWidth: "10%", type: "input"},
        { header: "제조사", col: "poiTitle9", cellWidth: "12%", type: "input"},
        { header: "금액", col: "poiTitle11", cellWidth: "10%", type: "input"},
        { header: "제조사", col: "poiTitle12", cellWidth: "12%", type: "input"},
        { header: "비고", col: "poiTitle13", cellWidth: "20%", type: "input"},
        { header: "원단가", col: "poiTitle111", cellWidth: "12%", type: "input"},
        { header: "원가", col: "poiTitle15", cellWidth: "10%", type: "input"},
        { header: "이익금", col: "poiTitle16", cellWidth: "12%", type: "input"},
        { header: "이익률", col: "poiTitle17", cellWidth: "12%", type: "input"},
        { header: "기준\n이익률", col: "poiTitle88", cellWidth: "15%", type: "input"},
        { header: "소비자가\n산출률", col: "poiTitle99", cellWidth: "15%", type: "input"},
    ];

    const [currentTask, setCurrentTask] = useState("인건비")
    const [flag, setFlag] = useState(true)
    
    const save = (flag) => {
        setFlag(flag === true ? true : false)
    }

    return (
        <>
            <Location pathList={locationPath.DraftQuotation} />
            <div className="mini_board_2">
                <ul className="tab">
                    <li onClick={() => setCurrentTask("인건비")}><a href="#인건비" className="on">인건비</a></li>
                    <li onClick={() => setCurrentTask("경비")}><a href="#경비">경비</a></li>
                    <li onClick={() => setCurrentTask("구매(재료비)")} ><a href="#구매(재료비)">구매(재료비)</a></li>
                </ul>
                <div className="list">
                    <div className="first">
                        <ApprovalForm title={currentTask +' 초안 등록'} save={save}>
                            <h2 className="blind">인건비</h2>
                            <ul>
                                <ReactDataTable
                                    columns={laborColumns}
                                    suffixUrl="/baseInfrm/product"
                                    currentPage="pjOrdrInfo"
                                    flag={currentTask === '인건비' && flag}
                                    currentTask={currentTask}
                                />
                            </ul>
                        </ApprovalForm>
                    </div>
                    <div className="second">
                        <ApprovalForm title={currentTask +' 초안 등록'} save={save}>
                            <h2 className="blind">경비</h2>
                            <ul>
                                <ReactDataTable
                                    columns={expensesColumns}
                                    suffixUrl="/baseInfrm/product"
                                    currentPage="pjOrdrInfo"
                                    flag={currentTask === '경비' && flag}
                                    currentTask={currentTask}
                                />
                            </ul>
                        </ApprovalForm>
                    </div>
                    <div className="third">
                        <ApprovalForm title={currentTask +' 초안 등록'} save={save}>
                            <h2 className="blind">구매(재료비)</h2>
                            <ul>
                                <ReactDataTable
                                    columns={purchaseColumns}
                                    suffixUrl="/baseInfrm/product"
                                    currentPage="pjOrdrInfo"
                                    flag={currentTask === '구매(재료비)' && flag}
                                    currentTask={currentTask}
                                />
                            </ul>
                        </ApprovalForm>
                    </div>
                </div>
            </div>

            
        </>
    );
}

export default DraftQuotation;
