// src/components/Settings.jsx

const wallpapers = [
  { name: 'Default', path: '/wallpaper.jpg' },
  { name: 'Mountain', path: '/wallpapers/mountain.jpg' },
  { name: 'Forest', path: '/wallpapers/forest.jpg' },
  { name: 'City', path: '/wallpapers/city.jpg' },
];

// NOTE: You need to add these wallpaper images to your `public/wallpapers/` directory.

const Settings = ({ currentTheme, onThemeChange, onWallpaperChange }) => {
  const toggleTheme = () => {
    onThemeChange(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="p-4 text-gray-800 dark:text-gray-200">
      <h2 className="text-xl font-bold mb-4 border-b border-gray-500 pb-2">Appearance</h2>
      
      {/* Theme Toggle */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-semibold">Theme</span>
        <div className="flex items-center gap-4">
          <span className="capitalize">{currentTheme} Mode</span>
          <button
            onClick={toggleTheme}
            className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-400 dark:bg-teal-500"
          >
            <span className="inline-block w-4 h-4 transform bg-white rounded-full transition-transform translate-x-1 dark:translate-x-6" />
          </button>
        </div>
      </div>

      {/* Wallpaper Selection */}
      <div>
        <h3 className="font-semibold mb-3">Wallpaper</h3>
        <div className="grid grid-cols-2 gap-4">
          {wallpapers.map((wallpaper) => (
            <div 
              key={wallpaper.name} 
              className="cursor-pointer group"
              onClick={() => onWallpaperChange(wallpaper.path)}
            >
              <img 
                src={wallpaper.path} 
                alt={wallpaper.name}
                className="w-full h-24 object-cover rounded-md border-2 border-transparent group-hover:border-teal-400 transition-all"
              />
              <p className="text-center text-sm mt-1">{wallpaper.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;