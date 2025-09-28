// src/components/Terminal.jsx
import { useState, useRef, forwardRef, useEffect } from "react";
import Draggable from "react-draggable";

// ... AsciiArt component and terminal logic remains the same
const AsciiArt = () => (
  <pre className="text-teal-300 font-mono text-sm leading-tight">
{`
    .--.
   |o_o |
   |:_/ |
  //   \\ \\
 (|     | )
/'\\_   _/ \`\\
\\___)=(___/
`}
  </pre>
);

const Terminal = forwardRef(({ onClose, isActive, onFocus, position, onDrag, isActivitiesView, style, isDragging, onDragStart, onDragStop }, ref) => {
  const inputRef = useRef(null);
  const contentRef = useRef(null);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'text', content: "Welcome to my portfolio! Type 'help' to begin." }
  ]);
  const yourName = "[Your Name]";

  const files = {
    'about.txt': `Hello, I'm ${yourName}! I'm a passionate Java developer focused on building scalable web applications with Spring Boot.`,
    'projects.txt': `* LinkPress - URL Shortener\n* CoinTrack - Expense Tracker API\n\n(Use the 'Projects' window for more details)`,
    'skills.txt': `* Languages: Java, SQL, JavaScript\n* Frameworks: Spring Boot, React\n* Tools: Docker, Git, Maven`,
    'contact.txt': `* Email: youremail@example.com\n* LinkedIn: linkedin.com/in/yourprofile`
  };

  const commands = {
    help: () => "Available commands: ls, cat [filename], neofetch, whoami, date, clear",
    ls: () => Object.keys(files).join('\n'),
    cat: (args) => {
      const filename = args[0];
      if (!filename) return "Usage: cat [filename]";
      return files[filename] || `cat: ${filename}: No such file or directory`;
    },
    whoami: () => yourName.toLowerCase().replace(' ', ''),
    date: () => new Date().toString(),
    neofetch: () => ({ type: 'neofetch' }),
    clear: () => {
      setHistory([]);
      return "";
    }
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      const command = input.trim().toLowerCase();
      
      if (command === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }

      const parts = command.split(' ');
      const commandName = parts[0];
      const args = parts.slice(1);
      
      const newHistory = [...history, { type: 'text', content: `guest@portfolio:~$ ${input}`, isCommand: true }];
      
      if (commandName in commands) {
        const output = commands[commandName](args);
        if (output) {
          newHistory.push(typeof output === 'string' ? { type: 'text', content: output } : output);
        }
      } else if (commandName) {
        newHistory.push({ type: 'text', content: `command not found: ${commandName}` });
      }
      
      setHistory(newHistory);
      setInput('');
    }
  };
  
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [history]);

  const dynamicStyles = isActivitiesView 
    ? style 
    : { transition: isDragging ? 'none' : 'transform 300ms ease-in-out' };

  return (
    <Draggable 
        nodeRef={ref} 
        handle=".handle" 
        bounds="parent" 
        onStart={() => { onFocus(); onDragStart(); }}
        onStop={onDragStop}
        position={position} 
        onDrag={onDrag}
        disabled={isActivitiesView}
    >
      <div 
        ref={ref} 
        onClick={onFocus} 
        className={`glass-window terminal-window absolute w-[800px] h-[550px] 
                   rounded-xl shadow-2xl flex flex-col z-30 overflow-hidden 
                   min-w-[400px] min-h-[300px] ${isActive ? 'z-40' : 'z-30'}`}
        style={dynamicStyles}
      >
        <div className="handle window-title-bar text-gray-200 flex items-center justify-center p-2 rounded-t-lg cursor-move relative">
           <div className="absolute left-3 flex items-center gap-2">
            <button onClick={onClose} className="w-3.5 h-3.5 bg-red-500 rounded-full hover:bg-red-400 transition-colors"></button>
            <div className="w-3.5 h-3.5 bg-yellow-500 rounded-full"></div>
            <div className="w-3.5 h-3.5 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm font-semibold">Terminal</span>
        </div>
        <div ref={contentRef} className="p-2 text-white font-mono flex-grow overflow-y-auto text-sm" onClick={() => inputRef.current.focus()}>
          {history.map((line, index) => {
            if (line.type === 'neofetch') {
              return (
                <div key={index} className="flex gap-4">
                  <AsciiArt />
                  <div>
                    <p className="text-teal-300 font-bold">{yourName}@Portfolio</p>
                    <p>--------------------</p>
                    <p><span className="text-teal-300">OS:</span> Portfolio OS (Linux)</p>
                    <p><span className="text-teal-300">Host:</span> Personal Portfolio</p>
                    <p><span className="text-teal-300">Shell:</span> bash 5.1</p>
                    <p><span className="text-teal-300">Resolution:</span> 1920x1080</p>
                    <p><span className="text-teal-300">DE:</span> GNOME (Simulated)</p>
                    <p><span className="text-teal-300">Terminal:</span> MyTerminal</p>
                  </div>
                </div>
              );
            }
            return (
              <div key={index} className={line.isCommand ? "text-green-400" : "text-gray-300"} style={{ whiteSpace: 'pre-wrap' }}>{line.content}</div>
            );
          })}
          <div className="flex">
            <span className="text-green-400 shrink-0">guest@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="flex-grow bg-transparent text-white outline-none pl-2 caret-white"
              autoFocus
            />
          </div>
        </div>
      </div>
    </Draggable>
  );
});

export default Terminal;