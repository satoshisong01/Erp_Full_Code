import React, { useRef, useState } from "react";
import AntTree from "components/antTree/AntTree";
import { menuTreeData } from "./menuTreeData.js";
import InnerForm from "components/antTree/InnerForm.jsx";
import { Resizable } from "re-resizable";
import CustomRModal from "components/modal/CustomRModal";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";

/** 시스템관리-메뉴관리-메뉴정보관리 */
const MenuInfo = () => {
    const [treeNode, setTreeNode] = useState({
        title: "",
        isParent: false,
        key: "",
    });

    const getTreeNode = (data) => {
        setTreeNode(data);
    };

    const containerRef = useRef(null);
    const resizableRef = useRef(null);
    const [leftWidth, setLeftWidth] = useState("50%");
    const [rightWidth, setRightWidth] = useState("50%");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalClose, setIsModalClose] = useState(false);

    const handleResize = (event, direction, ref, delta) => {
        const containerWidth = containerRef.current.offsetWidth;
        const resizableWidth = resizableRef.current.offsetWidth;
        const newLeftWidth = `${(resizableWidth / containerWidth) * 100}%`;
        const newRightWidth = `${
            ((containerWidth - resizableWidth) / containerWidth) * 100
        }%`;

        console.log(
            " containerWidth: ",
            containerWidth,
            " resizableWidth: ",
            resizableWidth,
            ", newLeftWidth: ",
            newLeftWidth
        );

        setLeftWidth(newLeftWidth);
        setRightWidth(newRightWidth);
    };

    const treeOpen = () => {
        setIsModalOpen(true);
    };
    const treeClose = () => {
        setIsModalClose(true);
    };

    return (
        <>
            <div className="location">
                <ul>
                    <li>
                        <Link to="/" className="home">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to=""
                            onClick={(e) =>
                                store.dispatch(tabActive("권한관리"))
                            }>
                            시스템관리
                        </Link>
                    </li>
                    <li>메뉴정보관리</li>
                </ul>
            </div>

            <CustomRModal isModalOpen={isModalOpen} onClose={isModalClose} />
            <div
                ref={containerRef}
                style={{
                    display: "flex",
                    height: "100vh",
                    position: "relative",
                }}>
                {/* 왼쪽 영역 */}
                <Resizable
                    ref={resizableRef}
                    style={{
                        backgroundColor: "white",
                        overflow: "hidden",
                        paddingRight: 10,
                        width: leftWidth,
                    }}
                    onResize={handleResize}>
                    <AntTree treeData={menuTreeData} selectData={getTreeNode} />
                </Resizable>

                {/* 오른쪽 영역 */}
                <div
                    style={{
                        backgroundColor: "white",
                        overflow: "hidden",
                        position: "relative",
                        flex: "1",
                        minWidth: 0,
                        padding: "0px 20px",
                        borderLeft: "1px solid #ccc",
                        width: rightWidth,
                    }}>
                    <InnerForm treeNode={treeNode} />
                </div>
            </div>
        </>
    );
};

export default MenuInfo;
