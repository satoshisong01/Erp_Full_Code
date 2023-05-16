import React from "react";

export default function Search(props) {
    let searchName = props.searchTitle;
    return (
        <div className="col-12 userTable" style={{ height: "100%" }}>
            {/* <table className="table table-bordered table-striped"> */}
            <div
                className="searchTable"
                style={{
                    display: "flex",
                    alignItems: "center",
                    borderTop: "solid #DDDDDD 1px",
                    borderBottom: "solid #DDDDDD 1px",
                    marginLeft: "auto",
                    backgroundColor: "white",
                }}
            >
                <span
                    style={{
                        display: "flex",
                        padding: "7px",
                        width: "15rem",
                        height: "40px",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#E3E3E3",
                    }}
                >
                    {searchName}
                </span>
                {/*<td colSpan={2}>*/}
                <input
                    style={{ height: "26px", marginLeft: "7px" }}
                    type="text"
                    placeholder="검색어를 입력하세요"
                />
                {/*</td>*/}
            </div>
        </div>
    );
}
