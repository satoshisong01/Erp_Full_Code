import React from "react";
import $ from "jquery";
//import "datatables.net-dt/css/jquery.dataTables.css";
//import "datatables.net-dt/js/dataTables.dataTables";

const ReSearchBtn = ({
    //searchKeyword,
    //searchCondition,
    dataTableRef,
    fetchAllData,
}) => {
    const handleRefreshClick = async () => {
        //searchKeyword("");
        //searchCondition("");
        if (
            dataTableRef.current &&
            $.fn.DataTable.isDataTable(dataTableRef.current)
        ) {
            $(dataTableRef.current).DataTable().destroy();
        }
        //setIsSearching(!isSearching); // 로딩 상태 활성화
        await fetchAllData();
    };

    return <button onClick={handleRefreshClick}>클릭</button>;
};

export default ReSearchBtn;
