import React, { useState } from 'react';
import { ToolMode } from './types';
import Header from './components/Header'; // Chỉ giữ 1 dòng import này
import SubtitleTool from './components/SubtitleTool';
import VideoGenTool from './components/VideoGenTool';
import ImageTool from './components/ImageTool';
import { ApiKeyManager } from './components/ApiKeyManager'; // Thêm import này

// XÓA phần này (dòng 7-17 trong code của bạn):
// import { ApiKeyManager } from './components/ApiKeyManager';
// import { Header } from './components/Header';
// function App() {
//   return (
//     <div className="App">
//       <Header />
//       <ApiKeyManager />
//       ...
//     </div>
//   );
// }

// CHỈ GIỮ phần này:
const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<ToolMode>(ToolMode.SUBTITLE);

  const renderContent = () => {
    switch (activeMode) {
      case ToolMode.SUBTITLE:
        return <SubtitleTool />;
      case ToolMode.VIDEO_GEN:
        return <VideoGenTool />;
      case ToolMode.IMAGE_ANALYSIS:
        return <ImageTool />;
      default:
        return <SubtitleTool />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header activeMode={activeMode} onModeChange={setActiveMode} />
      
      {/* THÊM ApiKeyManager vào đây */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <ApiKeyManager /> {/* Thêm dòng này */}
        
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {renderContent()}
        </div>
      </main>
      
      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-900">
        &copy; 2024 SubGenius AI. Powered by Google Gemini.
      </footer>
    </div>
  );
};

export default App;
