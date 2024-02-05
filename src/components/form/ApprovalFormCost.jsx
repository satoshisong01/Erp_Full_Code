import AddButton from "components/button/AddButton";
import BasicButton from "components/button/BasicButton";
import React, { useContext, useEffect, useState } from "react";

/** 원가서 결재 폼 */
function ApprovalFormCost({ children }) {
    const receiveInfo = [
        {name: "손영훈", state: "진행", position: "PM"},
    ]
    const sendInfo = [
        {name: "유지수", state: "승인", position: "팀원"},
        {name: "손영훈", state: "진행", position: "PM"},
    ]
    return (
        <>
            <div className="form-style mg-t-20">
                <div className="form-buttons mg-b-20">
                    <AddButton label="결재선" />
                    <AddButton label="결재요청" />
                    <BasicButton label="닫기" />
                </div>

                <div class="flex-between mg-b-20" style={{width: "90%"}}>
                    <div class="box-container">
                        <div class="box box-3">주<br/>관<br/>부<br/>서</div>
                        {receiveInfo.map((rec) => (
                            <div class="box-group">
                                <div class="box box-1">
                                    {rec.position}
                                </div>
                                <div class="box box-2">
                                    <p>{rec.name}</p>
                                    <p>{rec.state}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                        <div class="box-container">
                            <div class="box box-3">발<br/>신<br/>부<br/>서</div>
                            {sendInfo.map((send) => (
                                <div class="box-group">
                                    <div class="box box-1">
                                        {send.position}
                                    </div>
                                    <div class="box box-2">
                                        <p>{send.name}</p>
                                        <p>{send.state}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                </div>
                <div className="form-children">
                    {children}
                </div>
            </div>
        </>
    );
}

export default ApprovalFormCost;


                {/* <div className="dome-structure">
                    <div className="box">
                        <h2>발신부서</h2>
                    </div>


                    {sendInfo.map((send, idx) => (
                        <div className="box">
                            <h2>{send.position}</h2>
                            <ul>
                                <li key={idx}>{send.name}</li>
                                <li key={idx}>{send.state}</li>
                            </ul>
                        </div>
                    ))}
                </div> */}
