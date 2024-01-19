import { axiosFileUpload } from "api/axiosFetch";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUpload = ({ onFileSelect }) => {
    const [uploadedFileName, setUploadedFileName] = useState("");

    const onDrop = useCallback(
        (acceptedFiles) => {
            console.log(acceptedFiles);

            if (onFileSelect && acceptedFiles.length > 0) {
                onFileSelect(acceptedFiles[0]);
                setUploadedFileName(acceptedFiles[0].name);
            }
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: "image/*",
        onDrop,
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
