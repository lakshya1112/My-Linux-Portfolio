// src/App.jsx
import { useState, useRef, useEffect } from "react";
import TopPanel from './components/TopPanel';
import Dock from './components/Dock';
import Window from './components/Window';
import Terminal from './components/Terminal';
import Settings from "./components/Settings";
import FileExplorer from "./components/FileExplorer";
import ContextMenu from "./components/ContextMenu";
import WeatherWidget from "./components/WeatherWidget";
import { ProjectCard, SkillCategory, SkillTag } from './components/UIComponents';
import { CSSTransition } from "react-transition-group";
// THIS IS THE CORRECTED LINE
import { FaJava, FaReact, FaDatabase, FaDocker, FaGithub, FaLinkedin, FaEnvelope, FaDownload } from "react-icons/fa";

import SystemMonitor from "./components/SystemMonitor";
import NotepadWidget from "./components/NotepadWidget";
import SpotifyWidget from "./components/SpotifyWidget";

// --- Desktop Component ---
const Desktop = ({ children, wallpaper, onContextMenu }) => {
  return (
    <div
      className="w-screen h-screen bg-cover bg-center overflow-hidden transition-background-image duration-500"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onContextMenu={onContextMenu}
    >
      {children}
    </div>
  );
};

// --- Main App ---
function App() {
  const [windows, setWindows] = useState({
    about: true,
    projects: false,
    skills: false,
    contact: false,
    terminal: false,
    settings: false,
    fileExplorer: false,
    systemMonitor: false,
    notepad: false,
  });
  
  const [activeWindow, setActiveWindow] = useState('about');
  const [isActivitiesView, setIsActivitiesView] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [wallpaper, setWallpaper] = useState('/wallpaper.jpg');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);
  const terminalRef = useRef(null);
  const settingsRef = useRef(null);
  const fileExplorerRef = useRef(null);
  
  const systemMonitorRef = useRef(null);
  const notepadRef = useRef(null);

  const initialPositions = {
    about: { x: 100, y: 50 },
    projects: { x: 150, y: 100 },
    skills: { x: 200, y: 150 },
    contact: { x: 250, y: 200 },
    terminal: { x: 300, y: 250 },
    settings: { x: 350, y: 120 },
    fileExplorer: { x: 120, y: 180 },
    systemMonitor: { x: 400, y: 180 },
    notepad: { x: 450, y: 220 },
  };

  const [windowPositions, setWindowPositions] = useState(initialPositions);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const handleClick = () => setContextMenu({ ...contextMenu, visible: false });
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [contextMenu]);

  const openWindow = (windowName) => {
    if (isActivitiesView) setIsActivitiesView(false);
    setWindows(prev => ({ ...prev, [windowName]: true }));
    setActiveWindow(windowName);
  };


  // NEW: State to hold your GitHub projects
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // NEW: useEffect to fetch repositories from GitHub
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const response = await fetch("https://api.github.com/users/lakshya1112/repos?sort=updated");
        const data = await response.json();
        // Filter out forked repos if you want
        const nonForkedRepos = data.filter(repo => !repo.fork);
        setProjects(nonForkedRepos);
      } catch (error) {
        console.error("Failed to fetch GitHub projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []); // The empty array ensures this runs only once when the component mounts

  const closeWindow = (windowName) => {
    setWindowPositions(prev => ({ ...prev, [windowName]: initialPositions[windowName] }));
    setTimeout(() => {
      setWindows(prev => ({ ...prev, [windowName]: false }));
    }, 300);
  };
  
  const focusWindow = (windowName) => {
    if (isActivitiesView) setIsActivitiesView(false);
    setActiveWindow(windowName);
  };

  const handleDrag = (windowName, ui) => {
    const { x, y } = windowPositions[windowName];
    setWindowPositions(prev => ({
      ...prev,
      [windowName]: { x: x + ui.deltaX, y: y + ui.deltaY },
    }));
  };
  
  const onDragStart = () => setIsDragging(true);
  const onDragStop = () => setIsDragging(false);

  const toggleActivitiesView = () => setIsActivitiesView(!isActivitiesView);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
  };

  const getActivitiesStyle = (windowName) => {
    const openWindows = Object.keys(windows).filter(key => windows[key]);
    const index = openWindows.indexOf(windowName);
    if (index === -1) return { opacity: 0, transform: 'scale(0.95)' };
    
    const numOpen = openWindows.length;
    const cols = Math.ceil(Math.sqrt(numOpen));
    const rows = Math.ceil(numOpen / cols);
    const colIndex = index % cols;
    const rowIndex = Math.floor(index / cols);
    
    const scale = 0.4;
    const scaledWidth = 700 * scale;
    const scaledHeight = 500 * scale;

    const x = (window.innerWidth / (cols + 1)) * (colIndex + 1) - scaledWidth / 2;
    const y = (window.innerHeight / (rows + 1)) * (rowIndex + 1) - scaledHeight / 2;
    
    return {
      transform: `translate(${x}px, ${y}px) scale(${scale})`,
    };
  };

  const contextMenuItems = [
    { label: 'Open Terminal', action: () => openWindow('terminal') },
    { label: 'Open Settings', action: () => openWindow('settings') },
    { label: 'Change Wallpaper', action: () => openWindow('settings') },
  ];

  return (
    <Desktop wallpaper={wallpaper} onContextMenu={handleContextMenu}>
      <TopPanel onActivitiesClick={toggleActivitiesView} />
      <Dock openWindow={openWindow} isActivitiesView={isActivitiesView} />
      <WeatherWidget />
      <SpotifyWidget />
      
      {contextMenu.visible && <ContextMenu x={contextMenu.x} y={contextMenu.y} items={contextMenuItems} />}
      {isActivitiesView && <div className="activities-overlay absolute inset-0 z-40" onClick={toggleActivitiesView}></div>}

      <CSSTransition nodeRef={aboutRef} in={windows.about} timeout={300} classNames="window" unmountOnExit>
        <Window 
          ref={aboutRef} 
          title="About Me" 
          onClose={() => closeWindow('about')} 
          isActive={activeWindow === 'about'} 
          onFocus={() => focusWindow('about')}
          position={windowPositions.about}
          onDrag={(e, ui) => handleDrag('about', ui)}
          isActivitiesView={isActivitiesView}
          style={isActivitiesView ? getActivitiesStyle('about') : {}}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-4">
              <img src="/profile-pic.jpg" alt="Lakshya Saxena" className="w-24 h-26 rounded-full border-2 border-teal-300 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-teal-300">Hello, I'm Lakshya Saxena!</h2>
                <p className="text-gray-300 dark:text-gray-300 mt-2">
                  I'm a passionate Java developer focused on building scalable and efficient web applications. This portfolio is my digital playground, designed to look and feel like a Linux desktop.
                </p>
              </div>
            </div>
            <div className="mt-6 flex-grow"></div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-center">
              <a 
                href="/resume.pdf" 
                download="LakshyaSaxena_Resume.pdf"
                className="flex items-center gap-3 px-6 py-2 bg-teal-500/80 text-white font-semibold rounded-lg hover:bg-teal-500 transition-colors"
              >
                <FaDownload />
                <span>Download Resume</span>
              </a>
            </div>
          </div>
        </Window>
      </CSSTransition>

      {/* THIS IS THE MODIFIED PROJECTS WINDOW */}
      <CSSTransition nodeRef={projectsRef} in={windows.projects} timeout={300} classNames="window" unmountOnExit>
        <Window 
          ref={projectsRef} 
          title="My Projects" 
          onClose={() => closeWindow('projects')} 
          isActive={activeWindow === 'projects'} 
          onFocus={() => focusWindow('projects')}
          position={windowPositions.projects}
          onDrag={(e, ui) => handleDrag('projects', ui)}
          isActivitiesView={isActivitiesView}
          style={isActivitiesView ? getActivitiesStyle('projects') : {}}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
        >
          {loadingProjects ? (
            <p className="text-center">Loading projects from GitHub...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(repo => (
                <ProjectCard
                  key={repo.id}
                  title={repo.name}
                  description={repo.description}
                  githubUrl={repo.html_url}
                  liveUrl={repo.homepage} // This will only show if you've set a homepage URL in your repo settings
                />
              ))}
            </div>
          )}
        </Window>
      </CSSTransition>

      <CSSTransition nodeRef={skillsRef} in={windows.skills} timeout={300} classNames="window" unmountOnExit>
        <Window 
          ref={skillsRef} 
          title="Skills" 
          onClose={() => closeWindow('skills')} 
          isActive={activeWindow === 'skills'} 
          onFocus={() => focusWindow('skills')}
          position={windowPositions.skills}
          onDrag={(e, ui) => handleDrag('skills', ui)}
          isActivitiesView={isActivitiesView}
          style={isActivitiesView ? getActivitiesStyle('skills') : {}}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
        >
          <SkillCategory title="Languages & Databases"><SkillTag name="Java" icon={<FaJava />} /><SkillTag name="SQL" icon={<FaDatabase />} /></SkillCategory>
          <SkillCategory title="Frameworks & Libraries"><SkillTag name="Spring Boot" /><SkillTag name="React" icon={<FaReact />} /></SkillCategory>
          <SkillCategory title="Tools & Technologies"><SkillTag name="Docker" icon={<FaDocker />} /><SkillTag name="Git & GitHub" icon={<FaGithub />} /></SkillCategory>
        </Window>
      </CSSTransition>
      
      <CSSTransition nodeRef={contactRef} in={windows.contact} timeout={300} classNames="window" unmountOnExit>
        <Window 
          ref={contactRef} 
          title="Contact" 
          onClose={() => closeWindow('contact')} 
          isActive={activeWindow === 'contact'} 
          onFocus={() => focusWindow('contact')}
          position={windowPositions.contact}
          onDrag={(e, ui) => handleDrag('contact', ui)}
          isActivitiesView={isActivitiesView}
          style={isActivitiesView ? getActivitiesStyle('contact') : {}}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
        >
          <h2 className="text-2xl font-bold text-teal-300">Get In Touch</h2>
          <div className="flex flex-col gap-3">
            <a target="_blank" href="mailto:lakshyasaxena272@gmail.com" className="text-gray-200 hover:text-teal-300 flex items-center gap-3"><FaEnvelope size={20} /><span>lakshyasaxena272@gmail.com</span></a>
            <a target="_blank" href="http://www.linkedin.com/in/lakshya-saxena-188273364" className="text-gray-200 hover:text-teal-300 flex items-center gap-3"><FaLinkedin size={20} /><span>linkedin.com/in/lakshya-saxena-188273364</span></a>
          </div>
        </Window>
      </CSSTransition>
      
      <CSSTransition nodeRef={terminalRef} in={windows.terminal} timeout={300} classNames="window" unmountOnExit>
        <Terminal 
          ref={terminalRef} 
          onClose={() => closeWindow('terminal')} 
          isActive={activeWindow === 'terminal'} 
          onFocus={() => focusWindow('terminal')}
          position={windowPositions.terminal}
          onDrag={(e, ui) => handleDrag('terminal', ui)}
          isActivitiesView={isActivitiesView}
          style={isActivitiesView ? getActivitiesStyle('terminal') : {}}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
        />
      </CSSTransition>

      <CSSTransition nodeRef={settingsRef} in={windows.settings} timeout={300} classNames="window" unmountOnExit>
        <Window 
          ref={settingsRef} 
          title="Settings" 
          onClose={() => closeWindow('settings')} 
          isActive={activeWindow === 'settings'} 
          onFocus={() => focusWindow('settings')}
          position={windowPositions.settings}
          onDrag={(e, ui) => handleDrag('settings', ui)}
          isActivitiesView={isActivitiesView}
          style={isActivitiesView ? getActivitiesStyle('settings') : {}}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
        >
          <Settings 
            currentTheme={theme} 
            onThemeChange={setTheme} 
            onWallpaperChange={setWallpaper}
          />
        </Window>
      </CSSTransition>

      <CSSTransition nodeRef={fileExplorerRef} in={windows.fileExplorer} timeout={300} classNames="window" unmountOnExit>
        <Window 
          ref={fileExplorerRef} 
          title="File Explorer" 
          onClose={() => closeWindow('fileExplorer')} 
          isActive={activeWindow === 'fileExplorer'} 
          onFocus={() => focusWindow('fileExplorer')}
          position={windowPositions.fileExplorer}
          onDrag={(e, ui) => handleDrag('fileExplorer', ui)}
          isActivitiesView={isActivitiesView}
          style={isActivitiesView ? getActivitiesStyle('fileExplorer') : {}}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
        >
          <FileExplorer onOpenFile={openWindow} />
        </Window>
      </CSSTransition>

      <CSSTransition nodeRef={systemMonitorRef} in={windows.systemMonitor} timeout={300} classNames="window" unmountOnExit>
        <Window 
          ref={systemMonitorRef} 
          title="System Monitor" 
          onClose={() => closeWindow('systemMonitor')} 
          isActive={activeWindow === 'systemMonitor'} 
          onFocus={() => focusWindow('systemMonitor')}
          position={windowPositions.systemMonitor}
          onDrag={(e, ui) => handleDrag('systemMonitor', ui)}
          isActivitiesView={isActivitiesView}
          style={isActivitiesView ? getActivitiesStyle('systemMonitor') : {}}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
        >
          <SystemMonitor />
        </Window>
      </CSSTransition>

      <CSSTransition nodeRef={notepadRef} in={windows.notepad} timeout={300} classNames="window" unmountOnExit>
        <Window 
          ref={notepadRef} 
          title="Notepad" 
          onClose={() => closeWindow('notepad')} 
          isActive={activeWindow === 'notepad'} 
          onFocus={() => focusWindow('notepad')}
          position={windowPositions.notepad}
          onDrag={(e, ui) => handleDrag('notepad', ui)}
          isActivitiesView={isActivitiesView}
          style={isActivitiesView ? getActivitiesStyle('notepad') : {}}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
        >
          <NotepadWidget />
        </Window>
      </CSSTransition>
    </Desktop>
  );
}
export default App;