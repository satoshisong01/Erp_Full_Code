import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill 스타일 시트 임포트

const QuillEditor = ({ tableData }) => {
    const [content, setContent] = useState("");

    useEffect(() => {
        if (tableData && tableData.length > 0) {
            setContent(tableData[0].sgnDesc);
        }
    }, [tableData]);

    const handleContentChange = (value) => {
        setContent(value);
    };

    // Quill의 옵션 설정
    const quillOptions = {
        modules: {
            toolbar: [
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                // ['link', 'image', 'video'],
                ["clean"],
            ],
            clipboard: {
                matchVisual: false,
            },
        },
        formats: ["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video"],
    };

    return (
        <div>
            <ReactQuill value={content} onChange={handleContentChange} modules={quillOptions.modules} formats={quillOptions.formats} />
        </div>
    );
};

export default QuillEditor;
