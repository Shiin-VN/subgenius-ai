
import React, { useState, useEffect } from 'react';
import { generateVeoVideo } from '../services/gemini';

const VideoGenTool: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    if (window.aistudio?.hasSelectedApiKey) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(selected);
    } else {
      setHasApiKey(true); // Fallback if API is handled elsewhere
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const videoBlob = await generateVeoVideo(prompt, aspectRatio);
      setVideoUrl(URL.createObjectURL(videoBlob));
    } catch (err: any) {
      if (err.message.includes('Requested entity was not found')) {
        setError('Please select a valid paid API key for video generation.');
        setHasApiKey(false);
      } else {
        setError(err.message || 'Video generation failed.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="p-12 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-key text-amber-500 text-3xl"></i>
        </div>
        <h2 className="text-2xl font-bold">API Key Required for Video Gen</h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Generating high-quality video with Veo requires a specific paid API key. 
          Please visit the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-400 underline">billing documentation</a> for details.
        </p>
        <button 
          onClick={handleSelectKey}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-500/20"
        >
          Select API Key
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Prompt to Video</h2>
        <p className="text-slate-400">Bring your ideas to life with cinematic AI video generation.</p>
      </div>

      <div className="space-y-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A neon hologram of a cybernetic tiger walking through a rainy Tokyo street at night..."
          className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 h-40 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700 text-slate-200"
        ></textarea>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-slate-400">Aspect Ratio</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setAspectRatio('16:9')}
                className={`flex-1 py-2 rounded-xl border transition-all ${aspectRatio === '16:9' ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
              >
                16:9 Landscape
              </button>
              <button 
                onClick={() => setAspectRatio('9:16')}
                className={`flex-1 py-2 rounded-xl border transition-all ${aspectRatio === '9:16' ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
              >
                9:16 Portrait
              </button>
            </div>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`md:w-64 py-4 md:mt-7 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
              isGenerating || !prompt.trim()
              ? 'bg-slate-800 text-slate-600'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20'
            }`}
          >
            {isGenerating ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-play"></i>}
            Generate Video
          </button>
        </div>

        {isGenerating && (
          <div className="p-10 border border-indigo-500/20 bg-indigo-500/5 rounded-3xl flex flex-col items-center gap-6 text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <i className="fas fa-film text-indigo-500 animate-pulse"></i>
              </div>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-lg">Brewing your cinematic masterpiece...</p>
              <p className="text-slate-500 text-sm">Video generation usually takes 1-2 minutes. Stay tuned!</p>
            </div>
          </div>
        )}

        {videoUrl && (
          <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-black group relative">
            <video src={videoUrl} controls autoPlay loop className="w-full" />
            <a 
              href={videoUrl} 
              download="generated-video.mp4"
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all opacity-0 group-hover:opacity-100"
            >
              <i className="fas fa-download"></i> Save Video
            </a>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGenTool;
