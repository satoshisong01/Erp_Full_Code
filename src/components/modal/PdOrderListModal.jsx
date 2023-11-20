import React, { useContext, useEffect, useRef, useState } from "react";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import AddPdOrderModal from "./AddPdOrderModal";
import ModPdOrderModal from "./ModPdOrderModal";

/* 구매 종류(품목수주) 목록 CRUD 팝업 */
export default function PdOrderListModal({onClose}) {
    const { projectInfo, setProjectInfo, setModalPageName, setIsModalTable } = useContext(PageContext);
    const {setNameOfButton} = useContext(PageContext);
    const pdOrderTable = useRef(null);
    const [ pdOrderList, setPdOrderList ] = useState([]);
    const [isOpenAddModal, setIsOpenAddModal] = useState(false)
    const [isOpenModModal, setIsOpenModModal] = useState(false)
    const [row, setRow] = useState({});

    const columns = [
        {
            header: "구매 아이디",
            col: "poId",
            cellWidth: "50%",
        },
        {
            header: "거래처",
            col: "cltNm",
            cellWidth: "50%",
            modify: true,
            add: true,
            require: true,
            type: "buttonCompany"
        },
        {
            header: "구매 종류",
            col: "poDesc",
            cellWidth: "50%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "수주 아이디",
            col: "poiId",
            notView: true,
        },
    ]

    useEffect(() => {
        setModalPageName("품목수주관리");
        setIsModalTable(true);
        getData();
    }, []);

    const selected = (value) => {
        if(typeof value === 'object') {
            setRow({...value});
        }
        if(value === "close") {
            setProjectInfo(prev => ({...prev, poDesc: row.poDesc}))
            onClose();
        }
    }

    const getData = async () => {
        const requestData = {
            useAt: "Y",
            deleteAt: "N",
            searchCondition: "0",
            searchKeyword: "",
            poiId: projectInfo.poiId 
        };
        const dataList = await axiosFetch("/api/baseInfrm/product/pdOrdr/totalListAll.do", requestData);
        setPdOrderList(dataList);
    }

    const refresh = () => {
        getData();
    }

    const modalClose = () => {
        setIsOpenAddModal(false);
        setIsOpenModModal(false);
        refresh();
    }

    return (
        <>
            <div className="modal-dialog demo-modal" style={{ margin: "0", zIndex: "9999" }}>
                <div className="modal-content">
                    <article className="product-modal">
                        <div className="product-modal-inner">
                            <div className="product-modal-header mg-t-10 mg-b-10">
                                <div className="modal-header">
                                    <span className="modal-title">구매 종류 목록</span>
                                </div>
                                <button onClick={() => onClose()}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="modal-table-Body">
                                    <div className="table-buttons modal-table-buttons">
                                        <AddButton label={'추가'} onClick={() => setIsOpenAddModal(true)} />
                                        <ModButton label={'수정'} onClick={() => setIsOpenModModal(true)} />
                                        <DelButton label={'삭제'} onClick={() => setNameOfButton('delete')} />
                                        <RefreshButton onClick={refresh} />
                                    </div>
                                    <ReactDataTable
                                        columns={columns}
                                        singleUrl="/baseInfrm/product/pdOrdr"
                                        tableRef={pdOrderTable}
                                        viewPageName="품목수주관리"
                                        customDatas={pdOrderList}
                                        customDatasRefresh={refresh}
                                        sendSelected={selected}
                                    />
                            </div>
                            <div className="modal-table-Body">
                                <button className="btn full-width-button mg-b-20" onClick={() => selected("close")}>종료</button>
                            </div>
                        </div>
                    </article> 
                </div>
                {
                    isOpenAddModal && (
                        <AddPdOrderModal
                            columns={columns}
                            onClose={modalClose}
                        />
                    )
                }
                {
                    isOpenModModal && (
                        <ModPdOrderModal
                            columns={columns}
                            onClose={modalClose}
                            updateData={row}
                        />
                    )
                }
            </div>

        </>
    );
}
