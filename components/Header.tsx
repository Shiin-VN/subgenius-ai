
import React from 'react';
import { ToolMode } from '../types';

interface HeaderProps {
  activeMode: ToolMode;
  onModeChange: (mode: ToolMode) => void;
}

const Header: React.FC<HeaderProps> = ({ activeMode, onModeChange }) => {
  const navItems = [
    { mode: ToolMode.SUBTITLE, label: 'Subtitle AI', icon: 'fa-closed-captioning' },
    { mode: ToolMode.VIDEO_GEN, label: 'Video Gen (Veo)', icon: 'fa-film' },
    { mode: ToolMode.IMAGE_ANALYSIS, label: 'Image Analysis', icon: 'fa-wand-magic-sparkles' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-brain text-white"></i>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            SubGenius AI
          </h1>
        </div>
        
        <nav className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => onModeChange(item.mode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                activeMode === item.mode
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <i className={`fas ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
