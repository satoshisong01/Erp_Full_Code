import React from "react";

const PersonnelInfo = (props) => {
    console.log(props.data);
    const { data } = props;
    //const values = Object.values(data);
    //const keys = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <>
            <div>
                <div>{data.dpmCd}</div>
                <div>{data.dpmNm}</div>
                <div>{data.dpmLv}</div>
            </div>
        </>
    );
};

export default PersonnelInfo;
