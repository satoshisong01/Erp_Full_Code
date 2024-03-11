import React, { useContext, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import { PageContext } from "components/PageProvider";
import ReactDataTable from "components/DataTable/ReactDataTable";

/** 기준정보관리-원가기준관리-협력사 */
function PartnerMgmt() {
    const { setNameOfButton } = useContext(PageContext);
    const itemDetailMgmtTable = useRef(null);
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "거래처ID",
            col: "cltId",
            cellWidth: "0",
            modify: true,
            add: true,
            notView: true,
        },
        {
            header: "거래처명",
            col: "cltNm",
            cellWidth: "150",
            modify: true,
            add: true,
            require: true,
            textAlign: "left",
        },
        {
            header: "대표자",
            col: "cltOwnrnm",
            cellWidth: "100",
            modify: true,
            add: true,
        },
        {
            header: "거래처타입",
            col: "cltType",
            cellWidth: "0",
            enable: false,
            itemType: ["거래처타입을 선택해 주세요", "고객사", "협력사"],
            itemTypeSymbol: ["", "C", "P"],
            modify: true,
            add: true,
            require: true,
            notView: true,
        },
        {
            header: "업태",
            col: "cltBusstype",
            cellWidth: "200",
            modify: true,
            add: true,
            textAlign: "left",
        },
        {
            header: "사업자번호",
            col: "cltBussnum",
            cellWidth: "120",
            modify: true,
            add: true,
        },
        {
            header: "법인번호",
            col: "cltCprtnum",
            cellWidth: "120",
            modify: true,
            add: true,
        },
        // {
        //     header: "우편번호",
        //     col: "cltZip",
        //     cellWidth: "150",
        //     modify: true,
        //     add: true,
        // },
        {
            header: "주소",
            col: "cltAddr",
            cellWidth: "300",
            modify: true,
            add: true,
            textAlign: "left",
        },
        // {
        //     header: "상세주소",
        //     col: "cltDetailAddr",
        //     cellWidth: "150",
        //     modify: true,
        //     add: true,
        // },
        {
            header: "회사번호",
            col: "cltTelno",
            cellWidth: "120",
            modify: true,
            add: true,
        },
        {
            header: "FAX번호",
            col: "cltFaxnum",
            cellWidth: "120",
            modify: true,
            add: true,
        },
        {
            header: "이메일",
            col: "cltEmail",
            cellWidth: "200",
            modify: true,
            add: true,
            textAlign: "left",
        },
        // {
        //     header: "계산서 담당자",
        //     col: "cltTaxBillManagerNm",
        //     cellWidth: "100",
        //     modify: true,
        // },
        // {
        //     header: "계산서 담당자 번호",
        //     col: "cltTaxBillManagerTelno",
        //     cellWidth: "150",
        //     modify: true,
        //     add: true,
        // },
        // {
        //     header: "계산서 담당자 이메일",
        //     col: "cltTaxBillManagerEmail",
        //     cellWidth: "150",
        //     modify: true,
        //     add: true,
        // },
        // {
        //     header: "설립일자",
        //     col: "setUpDate",
        //     cellWidth: "100",
        //     modify: true,
        //     add: true,
        //     require: true,
        // },
        // {
        //     header: "기업회원ID",
        //     col: "esntlId",
        //     cellWidth: "100",
        //     modify: true,
        //     add: true,
        //     require: true,
        // },
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "140",
            modify: true,
            add: true,
            require: true,
            textAlign: "left",
        },
        {
            header: "품목그룹명2",
            col: "pgNm2",
            cellWidth: "140",
            modify: true,
            add: true,
            require: true,
            textAlign: "left",
        },
        {
            header: "품목그룹명3",
            col: "pgNm3",
            cellWidth: "140",
            modify: true,
            add: true,
            require: true,
            textAlign: "left",
        },
        {
            header: "품목그룹명4",
            col: "pgNm4",
            cellWidth: "140",
            modify: true,
            add: true,
            require: true,
            textAlign: "left",
        },
        {
            header: "품목그룹명5",
            col: "pgNm5",
            cellWidth: "140",
            modify: true,
            add: true,
            require: true,
            textAlign: "left",
        },

        {
            header: "품목ID",
            col: "pdiId",
            cellWidth: "0",
            enable: false,
            modify: false,
            add: true,
            selectOption: true,
            notView: true,
            listItem: "pdiId",
            addListURL: "/baseInfrm/product/productInfo",
        },
        {
            header: "비고",
            col: "cltDesc",
            cellWidth: "200",
            modify: true,
            add: true,
            textAlign: "left",
        },
    ];

    const conditionList = [
        {
            title: "거래처명",
            colName: "cltNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "대표자",
            colName: "cltOwnrnm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "주소",
            colName: "cltAddr", //컬럼명
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

    const handleReturn = (value) => {
        setReturnKeyWord(value);
    };

    const addBtn = [""];

    const [length, setLength] = useState(0);
    const setLengthSelectRow = (length) => {
        setLength(length);
    };

    return (
        <>
            <Location pathList={locationPath.PartnerMgmt} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <div className="table-buttons">
                <AddButton label={"추가"} onClick={() => setNameOfButton("add")} />
                <ModButton label={"수정"} length={length} onClick={() => setNameOfButton("modify")} />
                <DelButton label={"삭제"} length={length} onClick={() => setNameOfButton("delete")} />
                <RefreshButton onClick={() => setNameOfButton("refresh")} />
            </div>
            <ReactDataTable
                returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/baseInfrm/client/client/type/p"
                tableRef={itemDetailMgmtTable}
                setLengthSelectRow={setLengthSelectRow}
                viewPageName={{ name: "협력사", id: "PartnerMgmt" }}
            />
        </>
    );
}

export default PartnerMgmt;
