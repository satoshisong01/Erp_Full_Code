import React, { useEffect, useState } from "react";
import Location from "components/Location/Location";
import ApprovalForm from "components/form/ApprovalForm";
import ReactDataTable from "components/DataTable/ReactDataTable";
import axios from "axios";
import {
    axiosDelete,
    axiosFetch,
    axiosPost,
    axiosScan,
    axiosUpdate,
} from "api/axiosFetch";

/** 영업관리-수주계획관리 */
function OrderPlanMgmt() {
    const [planData, setPlanData] = useState([]);
    // { header: "수주시작일", col: "poiBeginDt", cellWidth: "25%", type: "select", options: [{value: '1', label: 'op1'}, {value: '2', label: 'op2'}]},

    const laborColumns = [
        // 인건비
        {
            header: "품목그룹명",
            col: "poiTitle",
            cellWidth: "20%",
            type: "select",
            options: [],
        },
        { header: "연월", col: "poiNm", cellWidth: "10%", type: "input" },
        { header: "M/M계", col: "poiCode", cellWidth: "10%", type: "input" },
        {
            header: "인건비계",
            col: "poiBeginDt1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "특급기술사",
            col: "poiBeginDt2",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "고급기술사",
            col: "poiBeginDt3",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "중급기술사",
            col: "poiBeginDt4",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "초급기술사",
            col: "poiBeginDt5",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "중급기술사",
            col: "poiBeginDt6",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "고급기능사",
            col: "poiBeginDt7",
            cellWidth: "10%",
            type: "input",
        },
    ];
    const expensesColumns = [
        // 경비
        {
            header: "경비목록",
            col: "poiTitle",
            cellWidth: "25%",
            type: "input",
        },
        { header: "비고", col: "poiTitle2", cellWidth: "50%", type: "input" },
        { header: "금액", col: "poiTitle3", cellWidth: "25%", type: "input" },
    ];
    const purchaseColumns = [
        // 구매비
        {
            header: "품목그룹명",
            col: "poiTitle",
            cellWidth: "20%",
            type: "input",
        },
        { header: "품명", col: "poiTitle1", cellWidth: "20%", type: "input" },
        { header: "규격", col: "poiTitle2", cellWidth: "20%", type: "input" },
        { header: "수량", col: "poiTitle3", cellWidth: "10%", type: "input" },
        { header: "단위", col: "poiTitle4", cellWidth: "10%", type: "input" },
        {
            header: "소비자\n단가",
            col: "poiTitle5",
            cellWidth: "14%",
            type: "input",
        },
        {
            header: "소비자\n금액",
            col: "poiTitle6",
            cellWidth: "14%",
            type: "input",
        },
        { header: "단가", col: "poiTitle7", cellWidth: "10%", type: "input" },
        { header: "금액", col: "poiTitle8", cellWidth: "10%", type: "input" },
        { header: "제조사", col: "poiTitle9", cellWidth: "12%", type: "input" },
        { header: "금액", col: "poiTitle11", cellWidth: "10%", type: "input" },
        {
            header: "제조사",
            col: "poiTitle12",
            cellWidth: "12%",
            type: "input",
        },
        { header: "비고", col: "poiTitle13", cellWidth: "20%", type: "input" },
        {
            header: "원단가",
            col: "poiTitle111",
            cellWidth: "12%",
            type: "input",
        },
        { header: "원가", col: "poiTitle15", cellWidth: "10%", type: "input" },
        {
            header: "이익금",
            col: "poiTitle16",
            cellWidth: "12%",
            type: "input",
        },
        {
            header: "이익률",
            col: "poiTitle17",
            cellWidth: "12%",
            type: "input",
        },
        {
            header: "기준\n이익률",
            col: "poiTitle88",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "소비자가\n산출률",
            col: "poiTitle99",
            cellWidth: "15%",
            type: "input",
        },
    ];
    const companyProfitColumns = [
        // 기업이윤
        { header: "금액", col: "poiTitle1", cellWidth: "50%", type: "input" },
        { header: "비고", col: "poiTitle2", cellWidth: "50%", type: "input" },
    ];
    const generalExpensesColumns = [
        // 일반관리비
        { header: "금액", col: "poiTitle1", cellWidth: "50%", type: "input" },
        { header: "비고", col: "poiTitle2", cellWidth: "50%", type: "input" },
    ];
    const negoColumns = [
        // 네고
        { header: "금액", col: "poiTitle1", cellWidth: "50%", type: "input" },
        { header: "비고", col: "poiTitle2", cellWidth: "50%", type: "input" },
    ];

    const path = [
        {
            title: "수주(사업)관리",
            middleName: "영업관리",
            detailName: "수주(사업)관리",
        },
    ];

    const [projectName, setProjectName] = useState("");
    const [currentTask, setCurrentTask] = useState("인건비");
    const [flag, setFlag] = useState(true);

    const [mainProjectName, setMainProjectName] = useState("");
    const [mainProjectCode, setMainProjectCode] = useState("");

    const save = (flag) => {
        setFlag(flag === true ? true : false);
    };

    const handleProjectName = (name) => {
        if (name && typeof name === "string") {
            setProjectName(name);
        }
    };

    const handleChangeName = (value, value2) => {
        setMainProjectName(value);
        setMainProjectCode(value2);
    };

    //수주계획 관리 데이터 불러오기

    //const headers = {
    //    Authorization: process.env.REACT_APP_POST,
    //};

    //const orderPlanListData = async () => {
    //    try {
    //        const options = {
    //            headers: headers,
    //        };
    //        const requestData = {
    //            useAt: "Y",
    //        };
    //        const response = await axios.post(
    //            `http://192.168.0.162:8888/api/baseInfrm/product/pjOrdrInfo/totallistAll.do`,
    //            requestData,
    //            options
    //        );
    //        console.log(response);
    //        setPlanData(response.data.result.resultData);
    //    } catch (error) {
    //        console.log(error, "계획불러오는데 에러");
    //    } finally {
    //    }
    //};

    const menuList = [
        { title: "인건비", columns: laborColumns },
        { title: "경비", columns: expensesColumns },
        { title: "구매(재료비)", columns: purchaseColumns },
        { title: "기업이윤", columns: companyProfitColumns },
        { title: "일반관리비", columns: generalExpensesColumns },
        { title: "네고", columns: negoColumns },
    ];

    const orderPlanListData = async () => {
        try {
            const requestData = {
                useAt: "Y",
            };
            const url = `/api/baseInfrm/product/pjOrdrInfo/totalListAll.do`;

            const response = await axiosFetch(url, requestData);
            console.log(response);
            setPlanData(response);
        } catch (error) {
            console.log(error, "계획불러오는데 에러");
        } finally {
        }
    };

    useEffect(() => {
        orderPlanListData();
    }, []);

    return (
        <>
            <Location tableList={path} />

            <div className="mini_board">
                <ul className="tab">
                    {menuList.map((menuItem) => (
                        <li
                            key={menuItem.title}
                            onClick={() => setCurrentTask(menuItem.title)}>
                            <a
                                href={`#${menuItem.title}`}
                                className={
                                    currentTask === menuItem.title ? "on" : ""
                                }>
                                {menuItem.title}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="list">
                    {menuList.map((menuItem) => (
                        <div
                            key={menuItem.title}
                            className={menuItem.title.toLowerCase()}>
                            <ApprovalForm
                                title={currentTask + " 계획 등록"}
                                save={save}
                                listData={planData}
                                handleChangeName={handleChangeName}
                                mainProjectName={mainProjectName}
                                mainProjectCode={mainProjectCode}>
                                <h2 className="blind">{menuItem.title}</h2>
                                <ul>
                                    <ReactDataTable
                                        columns={menuItem.columns}
                                        suffixUrl="/baseInfrm/product"
                                        currentPage="pjOrdrInfo"
                                        flag={
                                            currentTask === menuItem.title &&
                                            flag
                                        }
                                        currentTask={currentTask}
                                        projectName={
                                            menuItem.title === "네고"
                                                ? projectName
                                                : null
                                        }
                                    />
                                </ul>
                            </ApprovalForm>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default OrderPlanMgmt;
