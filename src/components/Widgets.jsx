// src/components/Widgets.jsx
import { useState, useEffect } from "react";

const Widgets = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
      <div className="bg-black/20 backdrop-blur-md text-white p-4 rounded-2xl text-right">
        <p className="text-4xl font-bold">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <p className="text-sm">{time.toLocaleDateString([], { weekday: 'long' })}</p>
      </div>
       <div className="bg-black/20 backdrop-blur-md text-white p-4 rounded-2xl text-right">
        <p className="text-4xl font-bold">{time.getDate()}</p>
        <p className="text-sm">{time.toLocaleDateString([], { month: 'short', year: 'numeric' })}</p>
      </div>
    </div>
  );
};
export default Widgets;