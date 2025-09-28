// src/components/UIComponents.jsx
import { FaGithub, FaExternalLinkAlt, FaJava, FaReact, FaDatabase, FaDocker } from "react-icons/fa";

export const ProjectCard = ({ title, description, imageSrc, liveUrl, githubUrl }) => {
  return (
    <div className="bg-black/20 backdrop-blur-lg rounded-lg border border-white/10 overflow-hidden group flex flex-col">
      <img 
        src={imageSrc || `https://placehold.co/400x200/94a3b8/ffffff?text=${title.replace(/-/g, ' ')}`} 
        alt={title} 
        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-bold text-teal-300">{title}</h3>
        <p className="text-sm text-gray-300 mt-1 flex-grow">{description || "No description provided."}</p>
        <div className="mt-4 flex gap-4">
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white flex items-center gap-2 text-sm">
              <FaExternalLinkAlt /> Demo
            </a>
          )}
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white flex items-center gap-2 text-sm">
            <FaGithub /> Code
          </a>
        </div>
      </div>
    </div>
  );
};

export const SkillCategory = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="text-lg font-bold text-teal-300 mb-2">{title}</h3>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

export const SkillTag = ({ name, icon }) => (
  <div className="bg-white/5 backdrop-blur-lg text-gray-200 flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 hover:border-white/20 transition-colors cursor-default">
    {icon}
    <span>{name}</span>
  </div>
);