import React, { createContext, useState } from "react";

export const PageContext = createContext();

/**
 * tabs 안에 띄어지는 모든 page에서 공유하는 상태 값
 * 외부에서 <PageProvider>로 감싸야 children으로 인정 됨
 * ㅇㅋㅇㅋ
 */
export function PageProvider({ children }) {
    const [nameOfButton, setNameOfButton] = useState(""); // 클릭된 데이터 테이블의 CRUD 버튼 이름
    const [isSaveFormTable, setIsSaveFormTable] = useState(true); // row 수정 테이블 저장, 수정 플래그
    const [newRowData, setNewRowData] = useState({}); // 외부에서 추가된 table row data (수주등록, 팝업으로 추가)
    const [searchData, setSearchData] = useState(""); // 검색 조건
    const [isOpenModal, setIsOpenModal] = useState(false); // 모달창
    const [projectItem, setProjectItem] = useState([]); //프로젝트이름, 코드 받는 변수
    const [projectId, setProjectId] = useState([]); //선택한 프로젝트이름, 코드 저장

    const contextValue = {
        nameOfButton,
        setNameOfButton,
        isSaveFormTable,
        setIsSaveFormTable,
        newRowData,
        setNewRowData,
        searchData,
        setSearchData,
        isOpenModal,
        setIsOpenModal,
        projectItem,
        setProjectItem,
        projectId,
        setProjectId,
    };

    return (
        <PageContext.Provider value={contextValue}>
            {children}
        </PageContext.Provider>
    );
}
