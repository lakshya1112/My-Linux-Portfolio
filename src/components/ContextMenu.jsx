// src/components/ContextMenu.jsx
const ContextMenu = ({ x, y, items }) => {
  return (
    <div 
      className="absolute bg-white/60 dark:bg-black/40 backdrop-blur-lg rounded-md shadow-2xl z-[100] border border-gray-300 dark:border-white/10"
      style={{ top: y, left: x }}
    >
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            onClick={item.action}
            className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-teal-500/50 cursor-pointer first:rounded-t-md last:rounded-b-md"
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;