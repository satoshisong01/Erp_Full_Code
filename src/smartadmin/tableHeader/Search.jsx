import React from "react";

export default function Search({ searchTitle }) {
    return (
        <div
            className="col-12 userTable"
            style={{ height: "100%", marginBottom: "10px" }}
        >
            {/* <table className="table table-bordered table-striped"> */}
            <div
                className="searchTable"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "solid #DDDDDD 1px",
                    borderBottom: "solid #DDDDDD 1px",
                    marginLeft: "auto",
                    backgroundColor: "white",
                }}
            >
                <div style={{ display: "flex", alignItems: "center" }}>
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
                        {searchTitle}
                    </span>
                    {/*<td colSpan={2}>*/}
                    <input
                        style={{
                            height: "26px",
                            marginLeft: "7px",
                            zIndex: "1",
                        }}
                        type="text"
                        placeholder="검색어를 입력하세요"
                    />
                </div>
                {/*</td>*/}
            </div>
        </div>
    );
}
