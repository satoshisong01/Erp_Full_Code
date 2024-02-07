import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill 스타일 시트 임포트

const QuillEditor = () => {
    const [content, setContent] = useState('');

    const handleContentChange = (value) => {
        setContent(value);
    };

    // Quill의 옵션 설정
    const quillOptions = {
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                // ['link', 'image', 'video'],
                ['clean'],
            ],
            clipboard: {
                matchVisual: false,
            },
        },
        formats: [
            'header', 'font', 'size',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image', 'video',
        ],
    };

    return (
            <div>
                {/* ReactQuill 컴포넌트 */}
                <ReactQuill
                    value={content}
                    onChange={handleContentChange}
                    modules={quillOptions.modules}
                    formats={quillOptions.formats}
                />
                <button onClick={() => console.log(content)}>확인</button>
            </div>
    );
};

export default QuillEditor;
