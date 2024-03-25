import React from "react";

/** 결재선 목록 */
function SignStateLine(props) {
    const {
        children, //자식
        signStateData, //승인자목록
    } = props;

    const formattedDate = (date) => {
        const datePart = date.split(" ")[0];
        return datePart;
    };

    return (
        <>
            <div className="form-style mg-t-10">
                <div className="flex-between mg-b-20" style={{ width: "100%" }}>
                    <div className="box-container">
                        {signStateData && signStateData.length > 0 && (
                            <div className="box box-3">
                                결<br />재<br />선
                            </div>
                        )}
                        {signStateData &&
                            signStateData.map((send, index) => (
                                <div key={index} className="box-group">
                                    <div className="box box-1">{send.posNm}</div>
                                    <div className="box box-2">
                                        <p>{send.empNm}</p>
                                        <p style={{ fontWeight: "bold" }}>{send.sttApproverAt}</p>
                                        {send.sttPaymentDate && <p style={{ fontSize: 10.5 }}>({formattedDate(send.sttPaymentDate)})</p>}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="form-children">{children}</div>
            </div>
        </>
    );
}

export default SignStateLine;
