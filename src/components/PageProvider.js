import React, { createContext, useState } from "react";

export const PageContext = createContext();

/**
 * children인 RootRoutes에서 선언된 모든 컴포넌트에서 공유하는 상태 값
 */
export function PageProvider({ children }) {
    const [nameOfButton, setNameOfButton] = useState(""); // 클릭된 데이터 테이블의 CRUD 버튼 이름
    const [isSaveFormTable, setIsSaveFormTable] = useState(true); // row 수정 테이블 저장, 수정 플래그
    const [newRowData, setNewRowData] = useState({}); // 외부에서 추가된 table row data (수주등록, 팝업으로 추가)
    const [searchData, setSearchData] = useState(""); // 검색 조건
    const [projectItem, setProjectItem] = useState([]); //프로젝트 목록
    const [projectInfo, setProjectInfo] = useState({poiId: '', poiNm: '', poiCode: ''}); // 선택한 프로젝트
    const [currentTable, setCurrentTable] = useState(null); // 유니크한 현재 데이터 테이블
    const [isOpenModal, setIsOpenModal] = useState(false); // 팝업 flag
    const [currentPageName, setCurrentPageName] = useState(''); // tab 현재페이지
    const [prevCurrentPageName, setPrevCurrentPageName] = useState(''); // tab 이전페이지
    const [innerPageName, setInnerPageName] = useState(''); // snbLabel과 같은 역할. 컴포넌트 안의 탭 라벨
    const [prevInnerPageName, setPrevInnerPageName] = useState('');
    const [lengthSelectRow, setLengthSelectRow] = useState(0); // 테이블 버튼 플래그

    const contextValue = {
        nameOfButton, setNameOfButton,
        isSaveFormTable, setIsSaveFormTable,
        newRowData, setNewRowData,
        searchData, setSearchData,
        projectItem, setProjectItem,
        projectInfo, setProjectInfo,
        currentTable, setCurrentTable,
        isOpenModal, setIsOpenModal,
        currentPageName, setCurrentPageName,
        prevCurrentPageName , setPrevCurrentPageName,
        innerPageName, setInnerPageName,
        prevInnerPageName, setPrevInnerPageName,
        lengthSelectRow, setLengthSelectRow,
    };

    return (
        <PageContext.Provider value={contextValue}>
            {children}
        </PageContext.Provider>
    );
}
