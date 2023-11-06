import React, { useContext, useEffect, useRef, useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageContext } from "components/PageProvider";
import SearchListpdiNm from "components/SearchListpdiNm";

export default function ModalPagePdiNm({ rowIndex }) {
    const { pdiNmList, setProjectPdiNm, setIsOpenModalPdiNm, setReturnKeyWordPdiNm, setAddPdiNm } = useContext(PageContext);
    const [savePdiNm, setSavePdiNm] = useState("");

    useEffect(() => {
        setReturnKeyWordPdiNm("");
    }, []);

    const conditionList = [
        {
            title: "품명",
            colName: " pdiNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "5",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWordPdiNm(value);
        console.log(value, "제대로 들어오냐");
    };

    function handleItemClick(pdiNm, pgNm, pdiWght, pdiStnd, pdiMenufut, pdiId) {
        setProjectPdiNm({ pdiNm, pgNm, pdiWght, pdiStnd, pdiMenufut, pdiId });
        setIsOpenModalPdiNm(false);
    }

    //function handleItemClick(pgNm) {
    //    // stableData 배열의 길이만큼의 임시 데이터 배열을 생성합니다.
    //    let temporaryData = Array.from({ length: stableData.length }, (_, index) => ({
    //        pgNm: "A" // 원하는 초기값 설정
    //    }));

    //    // 원하는 rowIndex 값을 사용하여 임시 데이터 배열을 수정합니다.
    //    const rowIndexToModify = rowIndex; // 원하는 rowIndex 값
    //    temporaryData[rowIndexToModify].pgNm = pgNm;

    //    // 수정된 임시 데이터 배열을 setProjectInfo에 저장합니다.
    //    setProjectInfo({ pgNm: pgNm });
    //    setIsOpenModalPgNm(false);
    //}

    const handleClose = () => {
        setReturnKeyWordPdiNm("");
        //setProjectPgNm("");
        setIsOpenModalPdiNm(false);
    };

    const inputChange = (e) => {
        const a = e.target.value;
        console.log(a);
        setSavePdiNm(a);
    };

    const onAdd = async (e) => {
        e.preventDefault();
        setAddPdiNm({ pdiNm: savePdiNm });
    };

    return (
        <>
            <div className="modal-dialog demo-modal" style={{ margin: "0", zIndex: "9999" }}>
                <div className="modal-content">
                    <article className="product-modal">
                        <div className="product-modal-inner">
                            {/*<button
                        style={{textAlign:"right"}}
                        onClick={() => handleClose()}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>*/}
                            <SearchListpdiNm conditionList={conditionList} onSearch={handleReturn} />
                            <div style={{ display: "flex", justifyContent: "space-between", margin: "10px" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span className="redStar" style={{ marginLeft: "10px" }}>
                                        *
                                    </span>
                                    <span style={{ fontWeight: "700" }}>품명</span>
                                    <input
                                        style={{ marginLeft: "8px", width: "300px" }}
                                        className="form-control flex-item"
                                        type="text"
                                        placeholder="추가할 품명을 입력해 주세요"
                                        onChange={inputChange}
                                    />
                                </div>
                                <button type="button" className="btn btn-primary modal-btn-close" id="modalSubmitBtn" onClick={onAdd}>
                                    추가
                                </button>
                            </div>
                            {/*<div className="product-modal-header">
                            <div className="modal-header">
                                <span className="modal-title">
                                </span>
                            </div>
                        </div>*/}
                            <div className="modalBody">
                                <div className="modalContent">
                                    {pdiNmList.map((item, index) => (
                                        <div
                                            className="listItems"
                                            key={index}
                                            onClick={() => handleItemClick(item.pdiNm, item.pgNm, item.pdiWght, item.pdiStnd, item.pdiMenufut, item.pdiId)}>
                                            <p className="listItem">{item.pdiNm}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <form className="product-modal-body">
                                <div className="submitProduct">
                                    <div className="modal-footer flex-between">
                                        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={() => handleClose()}>
                                            Close
                                        </button>
                                        <button type="button" className="btn btn-primary" style={{ margin: "0" }}>
                                            Save changes
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
}
