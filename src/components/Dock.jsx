// src/components/Dock.jsx
import { FaFolder, FaUser, FaWrench, FaEnvelope, FaTerminal, FaRegFolderOpen, FaChartLine, FaStickyNote } from "react-icons/fa";
import { motion } from "framer-motion"; // Import motion

// We will wrap your original DockIcon with animation capabilities
const AnimatedDockIcon = ({ children, onClick, title }) => (
  <motion.div
    onClick={onClick}
    title={title}
    className="w-14 h-14 bg-black/20 backdrop-blur-lg rounded-xl flex items-center justify-center cursor-pointer"
    // Add hover animations
    whileHover={{
      scale: 1.2,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    }}
    // Add a tap animation
    whileTap={{ scale: 0.9 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    {children}
  </motion.div>
);


const Dock = ({ openWindow, isActivitiesView }) => {
  return (
    // This is your original container, unchanged, so it stays on the left
    <div className={`absolute top-1/2 -translate-y-1/2 left-2 flex flex-col items-center justify-center gap-3 p-2 bg-black/30 backdrop-blur-xl rounded-2xl z-50 border border-white/10 transition-transform duration-300 ${isActivitiesView ? 'scale-95 -translate-x-24' : ''}`}>
      
      {/* Now we use the new AnimatedDockIcon component */}
      <AnimatedDockIcon onClick={() => openWindow('about')} title="About Me">
        <FaUser size={28} color="white" />
      </AnimatedDockIcon>
      
      <AnimatedDockIcon onClick={() => openWindow('fileExplorer')} title="File Explorer">
        <FaRegFolderOpen size={28} color="white" />
      </AnimatedDockIcon>

      <AnimatedDockIcon onClick={() => openWindow('projects')} title="Projects">
         <FaFolder size={28} color="white" />
      </AnimatedDockIcon>

      <AnimatedDockIcon onClick={() => openWindow('contact')} title="Contact">
        <FaEnvelope size={28} color="white" />
      </AnimatedDockIcon>
      
      <div className="w-10 h-px bg-white/20 my-1"></div> {/* Separator */}
      
      <AnimatedDockIcon onClick={() => openWindow('terminal')} title="Terminal">
        <FaTerminal size={28} color="white" />
      </AnimatedDockIcon>
      
      <AnimatedDockIcon onClick={() => openWindow('systemMonitor')} title="System Monitor">
        <FaChartLine size={28} color="white" />
      </AnimatedDockIcon>

      <AnimatedDockIcon onClick={() => openWindow('notepad')} title="Notepad">
        <FaStickyNote size={28} color="white" />
      </AnimatedDockIcon>

      <AnimatedDockIcon onClick={() => openWindow('settings')} title="Settings">
        <FaWrench size={28} color="white" />
      </AnimatedDockIcon>
    </div>
  );
};

export default Dock;