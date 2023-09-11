import React, { useState, useEffect, useCallback, useContext } from "react";
import { useLocation } from "react-router-dom";
import { axiosFetch } from "api/axiosFetch";

import ReactDataTableRowEdit from "components/DataTable/ReactDataTableRowEdit";
import { PageContext } from "components/PageProvider";

function EgovMain(props) {
    //const { projectName, setProjectName, projectCode, setProjectCode } =
    //    useContext(PageContext);

    console.group("EgovMain");
    console.log("[Start] EgovMain ------------------------------");
    console.log("EgovMain [props] : ", props);

    const location = useLocation();
    console.log("EgovMain [location] : ", location);

    console.log("------------------------------EgovMain [End]");
    console.groupEnd("EgovMain");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = "assets/images/mecca_logo.png";
        img.onload = () => {
            setIsLoaded(true);
        };
    }, []);

    //useEffect(() => {
    //    basicFetchData();
    //}, []);
    //const basicFetchData = async () => {
    //    const url = `/api/baseInfrm/product/pjOrdrInfo/totalList.do`;
    //    const requestData = { useAt: "Y" };
    //    const resultData = await axiosFetch(url, requestData);
    //    console.log(resultData, "나온값은?");
    //    console.log(resultData.content, "나온값은?");
    //    setProjectName(
    //        resultData.content.map((item) => ({
    //            poiNm: item.poiNm,
    //            poiCode: item.poiCode,
    //        }))
    //    );
    //};

    //console.log(projectCode, "나온코드만 모아둔것");
    return (
        <div className="egov-container">
            <div className="c_wrap">
                <div className="logo-center-container">
                    <img
                        src="assets/images/mecca_logo.png"
                        alt="로고"
                        className={`logo-main ${isLoaded ? "loaded" : ""}`}
                    />
                </div>
            </div>
        </div>
    );
}

export default EgovMain;
