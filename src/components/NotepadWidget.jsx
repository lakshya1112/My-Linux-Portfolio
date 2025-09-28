// src/components/NotepadWidget.jsx
import { useState, useEffect } from 'react';

const NotepadWidget = () => {
    // Load content from localStorage or default to empty string
    const [content, setContent] = useState(() => {
        return localStorage.getItem('notepadContent') || '';
    });

    // Save content to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('notepadContent', content);
    }, [content]);

    return (
        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Your notes are saved automatically..."
            className="w-full h-full bg-transparent text-gray-200 p-4 resize-none outline-none placeholder-gray-500"
        />
    );
};

export default NotepadWidget;