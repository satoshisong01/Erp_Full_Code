import React, { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import "../../components/modal/ModalCss.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { axiosFetch } from "api/axiosFetch";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { Resizable } from "re-resizable";
import AntTree from "components/antTree/AntTree";
import DelButton from "components/button/DelButton";

Modal.setAppElement("#root"); // Set the root element for accessibility

/* 결재선 목록 모달 */
export default function ApprovalLineModal(props) {
    const { width, height, isOpen, title, onClose } = props;
    const { setModalPageName, setIsModalTable } = useContext(PageContext);

    const [approvalList, setApprovalList] = useState([]);
    const [nodes, setNodes] = useState([]); //트리에서 선택한 값
    const [selectList, setSelectList] = useState([]); //테이블에서 선택한 값
    const bodyRef = useRef(null);
    const containerRef = useRef(null);
    const resizableRef = useRef(null);
    const [leftWidth, setLeftWidth] = useState("50%");
    const [rightWidth, setRightWidth] = useState("50%");

    useEffect(() => {
        if (isOpen) {
            getApprovalList();
            setModalPageName("결재선팝업");
            setIsModalTable(true);
        }
        return () => {
            setIsModalTable(false);
            setModalPageName("");
        };
    }, [isOpen]);

    /* 왼쪽, 오른쪽 사이즈 재설정 */
    const handleResize = (event, direction, ref, delta) => {
        const containerWidth = containerRef.current.offsetWidth;
        const resizableWidth = resizableRef.current.offsetWidth;
        const newLeftWidth = `${(resizableWidth / containerWidth) * 100}%`;
        const newRightWidth = `${
            ((containerWidth - resizableWidth) / containerWidth) * 100
        }%`;
        setLeftWidth(newLeftWidth);
        setRightWidth(newRightWidth);
    };

    /* me-modal-body 높이 동적 계산 */
    useEffect(() => {
        
        if (bodyRef.current) {
            const headerHeight = document.querySelector(".me-modal-header")?.clientHeight || 0;
            const footerHeight = document.querySelector(".me-modal-footer")?.clientHeight || 0;
            const calculatedHeight = height - headerHeight - footerHeight;
            bodyRef.current.style.height = `${calculatedHeight}px`;
        }
    }, [height]);

    /* 데이터 불러오기 */
    const getApprovalList = async (requestData) => {
        const resultData = await axiosFetch("/api/baseInfrm/member/employMember/totalListAll.do", requestData || {});

        let index = 0;
        const groupData = resultData.reduce((result, current) => {
            let existingGroup = result.find(item => item.groupId === current.groupId);
        
            if (existingGroup) {
                // 이미 있는 그룹인 경우, 해당 그룹에 새로운 직원 정보를 추가
                existingGroup.children.push({
                    title: current.empNm + " " + current.posNm,
                    key: `${existingGroup.key}-${existingGroup.children.length + 1}`,
                    empId: current.empId,
                    uniqId: current.uniqId,
                    empNm: current.empNm,
                    posNm: current.posNm, //직급
                });
            } else {
                index++;
                // 새로운 그룹을 생성하고 직원 정보를 추가
                result.push({
                    title: current.groupNm,
                    key: index,
                    groupId: current.groupId,
                    children: [{
                        title: current.empNm + " " + current.posNm,
                        key: `${index}-${1}`,
                        empId: current.empId,
                        uniqId: current.uniqId,
                        empNm: current.empNm,
                        posNm: current.posNm,
                    }],
                });
            }
            
            return result;
        }, []);

        setApprovalList(groupData);
    };

    /* 결재선 저장 */
    const onClick = () => {
        //결재선 리스트 저장 구현 필요
        onClose();
    };

    const selectData = (data) => {
        if(nodes && nodes.length >= 3) {
            alert("결재선은 최대 세 명까지 입니다.")
            return;
        }
        setNodes(prev => {
            const existingNode = prev.find(item => item.empId === data.empId);
            if (existingNode) {
                return prev;
            }
            const newNodes = [...prev, data];
            return newNodes;
        });
    };

    const columns = [
        { header: "고유ID", col: "uniqId", notView: true },
        { header: "업무회원ID", col: "empId", notView: true },
        { header: "사용자명", col: "empNm", cellWidth: "120" },
        { header: "직위", col: "posNm", cellWidth: "80" },
    ]

    const isEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) {
            return false;
        }
    
        for (let i = 0; i < arr1.length; i++) {
            const empId1 = arr1[i].empId;
            const matchFound = arr2.some(item => item.empId === empId1);
            if (!matchFound) {
                return false; // 일치하는 것을 찾지 못했을 때 false 반환
            }
        }

         // 모든 요소가 일치하면 true 반환
        return true;
    }

    const returnList = (list) => {
        const values = list.map(item => item.values); //신규선택
        const flag = isEqual(values, selectList);
        if(!flag) {
            setSelectList(values);
        }
    };

    // 선택된 데이터 nods에서 삭제
    const deleteData = () => {
        const remainder = nodes.filter(item => !selectList.map(selectItem => selectItem.empId).includes(item.empId));
        setNodes(remainder);
    }


    return (
        <Modal
            appElement={document.getElementById("root")}
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={title}
            style={{ content: { width, height } }}>
            <div className="me-modal">
                <div className="me-modal-container" style={{ width, height }}>
                    <div className="me-modal-inner">
                        <div className="me-modal-header">
                            <h4 className="header-title">{title}</h4>
                            <div className="header-close" onClick={onClose}>
                                <FontAwesomeIcon icon={faTimes} className="button" size="lg" />
                            </div>
                        </div>

                        <div className="me-modal-body" ref={bodyRef}>
                            <div className="body-area" style={{ gap: 0 }}>
                                <div
                                    ref={containerRef}
                                    style={{
                                        display: "flex",
                                        minHeight: "42vh",
                                        position: "relative",
                                    }}
                                >
                                    {/* 왼쪽 영역 */}
                                    <Resizable
                                        ref={resizableRef}
                                        style={{
                                            backgroundColor: "white",
                                            overflow: "hidden",
                                            paddingRight: 10,
                                            width: leftWidth,
                                        }}
                                        onResize={handleResize}
                                        minWidth={280}
                                    >
                                        <AntTree treeData={approvalList} selectData={selectData} />
                                    </Resizable>

                                    {/* 오른쪽 영역 */}
                                    <div
                                        style={{
                                            backgroundColor: "white",
                                            overflow: "hidden",
                                            position: "relative",
                                            flex: "1",
                                            minWidth: 0,
                                            padding: "0px 20px",
                                            borderLeft: "1px solid #ccc",
                                            width: rightWidth,
                                        }}>
                                            <div className="table-buttons mg-t-10 mg-b-10">
                                                <DelButton label={"결재선 제외"} onClick={deleteData} />
                                            </div>
                                            <ReactDataTable
                                                columns={columns}
                                                customDatas={nodes}
                                                returnList={returnList}
                                                viewPageName={{ name: "결재선팝업", id: "결재선팝업" }}
                                            />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="me-modal-footer mg-t-10 mg-b-20">
                            <div className="table-buttons" style={{ justifyContent: "center" }}>
                                <button className="table-btn table-btn-default" style={{ width: "100%" }} onClick={onClose}>
                                    취소
                                </button>
                                <button className="table-btn table-btn-primary" style={{ width: "100%" }} onClick={onClick}>
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
