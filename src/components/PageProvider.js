import React, { createContext, useEffect, useState } from "react";

export const PageContext = createContext();

/**
 * tabs 안에 띄어지는 모든 page에서 공유하는 상태 값
 * 외부에서 <PageProvider>로 감싸야 children으로 인정 됨
 */
export function PageProvider({ children }) {
    const [nameOfButton, setNameOfButton] = useState(""); // 클릭된 데이터 테이블의 CRUD 버튼 이름
    const [isSaveFormTable, setIsSaveFormTable] = useState(true); // 버튼 on/off, false일때 저장 실행
    const [newRowData, setNewRowData] = useState({}); // 외부에서 추가된 table row data (수주등록, 팝업으로 추가)
    const [searchData, setSearchData] = useState(""); // 검색 조건

    const [projectItem, setProjectItem] = useState([]); //프로젝트 id, 이름, 코드 저장(프로젝트 수주발주)
    const [projectInfo, setProjectInfo] = useState({ poiId: "", poiNm: "", poiCode: "", poiVersion: "", poId: "", isPoIdSelected: false }); // 선택한 프로젝트 이름, id,코드,버전 저장

    const [pgNmList, setPgNmList] = useState([]); // 품목그룹 ID, 품목그룹명 저장
    const [projectPgNm, setProjectPgNm] = useState({ pgNm: "", pgId: "" }); // 클릭한 품목그룹명, 품목그룹id 저장

    const [pdiNmList, setPdiNmList] = useState([]); // 품목ID,품명,(품목그룹명),단위,규격,제조사
    const [projectPdiNm, setProjectPdiNm] = useState({ pdiId: "", pdiNm: "", pgNm: "", pdiWght: "", pdiStnd: "", pdiMenufut: "" }); // 선택한 id 저장

    const [unitPriceList, setUnitPriceList] = useState([]); // 급별단가 목록

    const [addPgNm, setAddPgNm] = useState("");
    const [currentTable, setCurrentTable] = useState(null); // 유니크한 현재 데이터 테이블
    const [isOpenModalPgNm, setIsOpenModalPgNm] = useState(false);
    const [returnKeyWord, setReturnKeyWord] = useState(""); //pmNm검색어 저장

    const [saveCompany, setSaveCompany] = useState({ cltNm: "", esntlId: "", esntlNm: "" }); // 선택한 id 저장
    const [companyList, setCompanyList] = useState([]); // 회사명 선택
    const [companyInfo, setCompanyInfo] = useState({ esntlId: "", companyId: "" }); // 선택한 id 저장
    const [isOpenModalCompany, setIsOpenModalCompany] = useState(false);

    const [addPdiNm, setAddPdiNm] = useState("");

    const [returnKeyWordPdiNm, setReturnKeyWordPdiNm] = useState(""); //pdiNm검색어 저장
    const [isOpenModalPdiNm, setIsOpenModalPdiNm] = useState(false);

    const [currentPageName, setCurrentPageName] = useState(""); // tab 현재페이지
    const [prevCurrentPageName, setPrevCurrentPageName] = useState(""); // tab 이전페이지
    const [innerPageName, setInnerPageName] = useState(""); // snbLabel과 같은 역할. 컴포넌트 안의 탭 라벨
    const [prevInnerPageName, setPrevInnerPageName] = useState("");
    const [modalPageName, setModalPageName] = useState("");
    const [modalLengthSelectRow, setModalLengthSelectRow] = useState(0); //모달 테이블의 버튼 플래그
    const [lengthSelectRow, setLengthSelectRow] = useState(0); // 테이블 버튼 플래그
    const [isModalTable, setIsModalTable] = useState(false);

    const [saveSaleManCost, setSaveSaleManCost] = useState([]);
    const [isCancelTable, setIsCancelTable] = useState(false); // 테이블 초기값으로 돌리기

    const contextValue = {
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
        currentPageName,
        setCurrentPageName,
        prevCurrentPageName,
        setPrevCurrentPageName,
        innerPageName,
        setInnerPageName,
        prevInnerPageName,
        setPrevInnerPageName,
        modalPageName,
        setModalPageName,
        modalLengthSelectRow,
        setModalLengthSelectRow,
        lengthSelectRow,
        setLengthSelectRow,
        isCancelTable,
        setIsCancelTable,
        isModalTable,
        setIsModalTable,
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
        unitPriceList,
        setUnitPriceList,
        companyList,
        setCompanyList,
        companyInfo,
        setCompanyInfo,
        isOpenModalCompany,
        setIsOpenModalCompany,
        saveCompany,
        setSaveCompany,

        saveSaleManCost,
        setSaveSaleManCost,
    };

    return <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>;
}
