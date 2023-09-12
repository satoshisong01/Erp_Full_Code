import React from "react";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function RefreshButton({ label, onClick }) {
    return (
        <button onClick={onClick} className="table-btn table-btn-default refresh">
            <FontAwesomeIcon icon={faArrowRotateRight} className="refresh-Icon" />
            {label}
        </button>
    );
}