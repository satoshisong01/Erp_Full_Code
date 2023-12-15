import React from "react";
import styled from "styled-components";

export default function BasicButton({ label, onClick }) {
    return (
        <button onClick={onClick} className="table-btn table-btn-basic">
            {label}
        </button>
    );
}