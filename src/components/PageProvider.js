import React, { createContext, useState } from "react";

export const PageContext = createContext();

/**
 * tabs 안에 띄어지는 모든 page에서 공유하는 상태 값
 * 외부에서 <PageProvider>로 감싸야 children으로 인정 됨
 */
export function PageProvider({ children }) {
    const [nameOfButton, setNameOfButton] = useState(""); // 클릭된 데이터 테이블의 CRUD 버튼 이름
    const [isSaveFormTable, setIsSaveFormTable] = useState(true); // row 수정 테이블 저장, 수정 플래그
    const [newRowData, setNewRowData] = useState({}); // 외부에서 추가된 table row data (수주등록, 팝업으로 추가)
    const [searchData, setSearchData] = useState(""); // 검색 조건
    const [openModal, setOpenModal] = useState({ type: "", isOpen: false }); // 모달창 open 조건  // type: add, modify
    const [projectItem, setProjectItem] = useState([]); //프로젝트 id, 이름, 코드 저장
    const [projectInfo, setProjectInfo] = useState({ poiId: "", poiNm: "", poiCode: "" }); // 선택한 id 저장
    const [projectPgNm, setProjectPgNm] = useState({ pgNm: "" }); // 선택한 id 저장
    const [addPgNm, setAddPgNm] = useState("");
    const [currentTable, setCurrentTable] = useState(null); // 유니크한 현재 데이터 테이블
    const [isOpenModalPgNm, setIsOpenModalPgNm] = useState(false);
    const [pgNmList, setPgNmList] = useState([]); // 품목그룹명 선택
    const [returnKeyWord, setReturnKeyWord] = useState(""); //pmNm검색어 저장

    const [addPdiNm, setAddPdiNm] = useState("");
    const [pdiNmList, setPdiNmList] = useState([]); // 품목 선택
    const [projectPdiNm, setProjectPdiNm] = useState({ pdiNm: "" }); // 선택한 id 저장
    const [returnKeyWordPdiNm, setReturnKeyWordPdiNm] = useState(""); //pdiNm검색어 저장
    const [isOpenModalPdiNm, setIsOpenModalPdiNm] = useState(false);

    const [isOpenModal, setIsOpenModal] = useState(false); // 팝업 flag
    const [currentPageName, setCurrentPageName] = useState(""); // tab 현재페이지
    const [prevCurrentPageName, setPrevCurrentPageName] = useState(""); // tab 이전페이지
    const [innerPageName, setInnerPageName] = useState(""); // snbLabel과 같은 역할. 컴포넌트 안의 탭 라벨
    const [prevInnerPageName, setPrevInnerPageName] = useState("");
    const [lengthSelectRow, setLengthSelectRow] = useState(0); // 테이블 버튼 플래그

    const [isCancelTable, setIsCancelTable] = useState(false); // 테이블 초기값으로 돌리기

    const contextValue = {
        openModal,
        setOpenModal,
        isOpenModalPgNm,
        setIsOpenModalPgNm,
        returnKeyWord,
        setReturnKeyWord,
        pgNmList,
        setPgNmList,
        addPgNm,
        setAddPgNm,
        projectPgNm,
        setProjectPgNm,
        nameOfButton,
        setNameOfButton,
        isSaveFormTable,
        setIsSaveFormTable,
        newRowData,
        setNewRowData,
        searchData,
        setSearchData,
        projectItem,
        setProjectItem,
        projectInfo,
        setProjectInfo,
        currentTable,
        setCurrentTable,
        isOpenModal,
        setIsOpenModal,
        currentPageName,
        setCurrentPageName,
        prevCurrentPageName,
        setPrevCurrentPageName,
        innerPageName,
        setInnerPageName,
        prevInnerPageName,
        setPrevInnerPageName,
        lengthSelectRow,
        setLengthSelectRow,
        isCancelTable,
        setIsCancelTable,

        pdiNmList,
        setPdiNmList,
        projectPdiNm,
        setProjectPdiNm,
        returnKeyWordPdiNm,
        setReturnKeyWordPdiNm,
        isOpenModalPdiNm,
        setIsOpenModalPdiNm,
        addPdiNm,
        setAddPdiNm,
    };

    return <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>;
}
