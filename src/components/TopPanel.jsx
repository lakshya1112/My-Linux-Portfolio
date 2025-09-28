// src/components/TopPanel.jsx
import { useState, useEffect } from "react";

const TopPanel = ({ onActivitiesClick }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-8 bg-black/80 text-white flex items-center justify-between px-4 text-sm font-semibold z-50">
      <button onClick={onActivitiesClick} className="px-3 py-1 hover:bg-white/10 rounded">
        Activities
      </button>
      <div className="font-bold">
        {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="flex items-center space-x-2">
        <span>EN</span>
      </div>
    </div>
  );
};
export default TopPanel;