import React from "react";
import DataTable from "components/DataTable/DataTable";
import Location from "components/Location/Location";
import DataTableButton from "components/button/DataTableButton";
import GeneralMembers from "./UserManagement/GeneralMember/GeneralMembers";

/** 기준정보관리-원가기준관리-일반회원관리 */
function RegularMemberMgmt() {
    const columns = [
        { header: "ID", col: "mbId", cellWidth: "20%" },
        { header: "이름", col: "mbNm", cellWidth: "20%" },
        { header: "비밀번호", col: "password", cellWidth: "20%" },
        { header: "주소", col: "address", cellWidth: "20%" },
        { header: "전화번호", col: "mbTelNm", cellWidth: "20%" },
        { header: "이메일", col: "mbEmAdr", cellWidth: "20%" },
        { header: "가입일", col: "sbsDt", cellWidth: "20%" },
        { header: "작성자", col: "createIdBy", cellWidth: "20%" },
        { header: "작성일", col: "createDate", cellWidth: "20%" },
        { header: "수정자", col: "lastModifiedIdBy", cellWidth: "20%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "20%" },
    ];

    return (
        <>
            <Location />
            {/* 검색 조건 */}
            {/* 데이터테이블 버튼 */}
            {/*<DataTableButton />
            <DataTable
                columns={columns}
                suffixUrl="/baseInfrm/member"
                currentPage="generalMember"
            />*/}
            <GeneralMembers />
        </>
    );
}

export default RegularMemberMgmt;
