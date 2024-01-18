import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
    const [uploadedFileName, setUploadedFileName] = useState("");

    const onDrop = useCallback((acceptedFiles) => {
        // 업로드할 파일에 대한 처리를 수행
        console.log(acceptedFiles);

        // 파일명을 상태에 저장
        if (acceptedFiles.length > 0) {
            setUploadedFileName(acceptedFiles[0].name);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "image/*", // 원하는 파일 형식으로 수정
    });

    return (
        <div {...getRootProps()} style={dropzoneStyles(isDragActive)}>
            <input {...getInputProps()} />
            {isDragActive ? <p>파일을 놓아주세요!</p> : <p>파일을 끌어서 놓거나 클릭하여 업로드하세요.</p>}
            {uploadedFileName && (
                <p>
                    업로드된 파일: <span style={{ backgroundColor: "yellow" }}>{uploadedFileName}</span>
                </p>
            )}
        </div>
    );
};

const dropzoneStyles = (isDragActive) => ({
    width: "100%",
    height: "200px",
    border: `2px dashed ${isDragActive ? "green" : "#ddd"}`,
    backgroundColor: `${isDragActive ? "pink" : "#fff"}`,
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    cursor: "pointer",
});

export default FileUpload;
