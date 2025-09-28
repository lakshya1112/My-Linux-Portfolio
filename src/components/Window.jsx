// src/components/Window.jsx
import { forwardRef } from "react";
import Draggable from "react-draggable";
import { FaTimes } from "react-icons/fa";

const Window = forwardRef(({ title, onClose, children, isActive, onFocus, position, onDrag, isActivitiesView, style, isDragging, onDragStart, onDragStop }, ref) => {
  
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
        className={`glass-window absolute w-[700px] h-[500px] 
                   rounded-lg shadow-2xl flex flex-col 
                   min-w-[400px] min-h-[300px]
                   ${isActive ? 'z-40' : 'z-30'}`}
        style={dynamicStyles}
      >
        <div className="handle window-title-bar text-gray-200 flex items-center justify-between p-2 rounded-t-lg cursor-move relative">
          <span className="font-bold text-sm absolute left-1/2 -translate-x-1/2">{title}</span>
          <button onClick={onClose} className="ml-auto p-1 rounded-full hover:bg-white/10">
            <FaTimes />
          </button>
        </div>
        
        <div className="p-4 text-gray-100 flex-grow overflow-y-auto">
          {children}
        </div>
      </div>
    </Draggable>
  );
});

export default Window;