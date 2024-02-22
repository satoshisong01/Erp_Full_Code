import AddButton from "components/button/AddButton";
import BasicButton from "components/button/BasicButton";
import React, { useContext, useEffect, useState } from "react";

/** 원가서 결재 폼 */
function ApprovalFormCost(props) {
    const {
        children, //자식
        receiveInfo, //주관부서(승인자)
        sendInfo //발신부서(결재선)
    } = props;

    return (
        <>
            <div className="form-style mg-t-20">
                <div className="flex-between mg-b-20" style={{width: "100%"}}>
                    <div className="box-container">
                        {receiveInfo && receiveInfo.length > 0 && <div class="box box-3">주<br/>관<br/>부<br/>서</div>}
                        {receiveInfo && receiveInfo.map((rec) => (
                            <div class="box-group">
                                <div class="box box-1">
                                    {rec.posNm}
                                </div>
                                <div class="box box-2">
                                    <p>{rec.empNm}</p>
                                    <p>{rec.state}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                        <div className="box-container">
                            {sendInfo && sendInfo.length > 0 && <div className="box box-3">발<br/>신<br/>부<br/>서</div>}
                            {sendInfo && sendInfo.map((send) => (
                                <div class="box-group">
                                    <div class="box box-1">
                                        {send.posNm}
                                    </div>
                                    <div class="box box-2">
                                        <p>{send.empNm}</p>
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