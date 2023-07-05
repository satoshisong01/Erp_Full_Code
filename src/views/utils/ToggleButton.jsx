import React, { useState } from "react";
import PersonalInfoUi from "../Execution/PersonalInfo/PersonalInfoUi";

function ToggleButton() {
    const [showContent, setShowContent] = useState(false);

    const toggleContent = () => {
        setShowContent(!showContent);
    };

    return (
        <div>
            <button onClick={toggleContent}>토글 버튼</button>
            {showContent && (
                <div>
                    <PersonalInfoUi />
                </div>
            )}
        </div>
    );
}

export default ToggleButton;
