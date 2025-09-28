// src/components/FileExplorer.jsx
import { FaUser, FaRegFolderOpen, FaWrench, FaEnvelope, FaFileCode } from 'react-icons/fa';

const files = [
  { name: 'About Me', icon: <FaUser />, id: 'about' },
  { name: 'Projects', icon: <FaFileCode />, id: 'projects' },
  { name: 'Settings', icon: <FaWrench />, id: 'settings' },
  { name: 'Contact', icon: <FaEnvelope />, id: 'contact' },
];

const FileExplorer = ({ onOpenFile }) => {
  return (
    <div className="p-2">
      <div className="grid grid-cols-4 gap-4">
        {files.map((file) => (
          <div
            key={file.id}
            onDoubleClick={() => onOpenFile(file.id)}
            className="flex flex-col items-center justify-center p-4 rounded-md hover:bg-white/10 cursor-pointer text-center"
            title={`Double-click to open ${file.name}`}
          >
            <div className="text-4xl text-teal-300 mb-2">{file.icon}</div>
            <span className="text-sm text-gray-200">{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;