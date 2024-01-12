import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";

/** 기준정보관리-원가기준관리-업무회원관리 */
function WorkMemberMgmt() {
    const { setNameOfButton } = useContext(PageContext);
    const WorkMemberTable = useRef(null);
    const [groupIdArray, setGroupIdArray] = useState([]);

    const columns = [
        {
            header: "고유ID",
            col: "uniqId",
            cellWidth: "20%",
            enable: false,
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "업무회원ID",
            col: "empId",
            cellWidth: "30%",
            enable: false,
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "사용자명",
            col: "empNm",
            cellWidth: "25%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "사원번호",
            col: "empNum",
            cellWidth: "25%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "비밀번호",
            col: "password",
            cellWidth: "25%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "상태",
            col: "usrSttCd",
            itemType: ["타입을 선택해 주세요", "가입신청", "가입삭제", "가입승인"],
            itemTypeSymbol: ["", "A", "D", "P"],
            cellWidth: "15%",
            modify: true,
            add: true,
            require: true,
        },
        { header: "나이", col: "birthday", cellWidth: "20%" },
        { header: "전화번호", col: "mbTelNm", cellWidth: "25%" },
        { header: "직위", col: "posNm", cellWidth: "20%" },
        { header: "소속기관", col: "aflOrgCd", cellWidth: "25%" },
        { header: "입사일", col: "joiningDt", cellWidth: "20%" },
        { header: "잠금여부", col: "lockAt", cellWidth: "25%" },
        { header: "작성일", col: "createDate", cellWidth: "20%" },
        { header: "작성자", col: "createIdBy", cellWidth: "20%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "20%" },
        { header: "수정자", col: "lastModifiedUserName", cellWidth: "20%" },
        {
            header: "그룹ID",
            col: "groupId",
            cellWidth: "20%",
            enable: false,
            type: "select",
            option: groupIdArray,
            modify: true,
            add: true,
            require: true,
        },
    ];

    const conditionList = [
        {
            title: "업무회원ID",
            colName: "empId", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "사용자명",
            colName: "empNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "소속기관",
            colName: "aflOrgCd", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
        {
            title: "작성일",
            colName: "createDate",
            type: "datepicker",
            searchLevel: "1",
        },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const url = `/api/baseInfrm/member/authorGroup/totalListAll.do`;
        const requestData = { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);
        if (resultData) {
            const ArrayList = resultData.map((item, index) => ({
                value: index + 1,
                label: item.groupId, // 원하는 속성 이름을 여기에 추가
            }));
            setGroupIdArray(ArrayList);
        }
    };

    const [length, setLength] = useState(0);
    const setLengthSelectRow = (length) => {
        setLength(length);
    };

    return (
        <>
            <Location pathList={locationPath.WorkMemberMgmt} />
            <SearchList conditionList={conditionList} />
            <div className="table-buttons">
                <AddButton label={"추가"} onClick={() => setNameOfButton("add")} />
                <ModButton label={"수정"} length={length} onClick={() => setNameOfButton("modify")} />
                <DelButton label={"삭제"} length={length} onClick={() => setNameOfButton("delete")} />
                <RefreshButton onClick={() => setNameOfButton("refresh")} />
            </div>
            <ReactDataTable
                columns={columns}
                suffixUrl="/baseInfrm/member/employMember"
                tableRef={WorkMemberTable}
                setLengthSelectRow={setLengthSelectRow}
                viewPageName={{ name: "업무회원관리", id: "WorkMemberMgmt" }}
            />
        </>
    );
}

export default WorkMemberMgmt;
