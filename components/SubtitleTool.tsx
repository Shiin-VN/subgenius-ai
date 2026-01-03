
import React, { useState, useRef } from 'react';
import { generateSrtFromVideo } from '../services/gemini';

const SubtitleTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'audio' | 'visual'>('audio');
  const [srtOutput, setSrtOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 300 * 1024 * 1024) {
        setError('Video file size exceeds 300MB limit.');
        return;
      }
      setFile(selectedFile);
      setVideoUrl(URL.createObjectURL(selectedFile));
      setError(null);
      setSrtOutput('');
    }
  };

  const processVideo = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await generateSrtFromVideo(base64, file.type, mode);
        setSrtOutput(result);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Error processing video.');
      setIsProcessing(false);
    }
  };

  const downloadSRT = () => {
    const blob = new Blob([srtOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.split('.')[0] || 'subtitles'}.srt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Upload & Options */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Subtitle Extraction</h2>
            <p className="text-slate-400 text-sm">Upload video (Max 300MB) and use AI to generate SRT files.</p>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
              file ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="video/*" 
              className="hidden" 
            />
            {file ? (
              <div className="text-center">
                <i className="fas fa-file-video text-4xl text-indigo-500 mb-3"></i>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-slate-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="text-center">
                <i className="fas fa-cloud-upload-alt text-4xl text-slate-700 mb-3"></i>
                <p className="text-slate-400 font-medium">Click to upload video</p>
                <p className="text-xs text-slate-600 mt-1">MP4, MKV, AVI up to 300MB</p>
              </div>
            )}
          </div>

          {videoUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-black">
              <video src={videoUrl} controls className="w-full max-h-[300px]" />
            </div>
          )}

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Extraction Mode</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setMode('audio')}
                className={`flex-1 p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                  mode === 'audio' ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}
              >
                <i className="fas fa-microphone-alt"></i>
                <span className="text-xs font-semibold uppercase tracking-wider">Audio Transcription</span>
              </button>
              <button 
                onClick={() => setMode('visual')}
                className={`flex-1 p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                  mode === 'visual' ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}
              >
                <i className="fas fa-eye"></i>
                <span className="text-xs font-semibold uppercase tracking-wider">Hard-sub OCR</span>
              </button>
            </div>
          </div>

          <button
            onClick={processVideo}
            disabled={!file || isProcessing}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
              !file || isProcessing 
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20'
            }`}
          >
            {isProcessing ? (
              <>
                <i className="fas fa-circle-notch fa-spin"></i>
                Processing Video...
              </>
            ) : (
              <>
                <i className="fas fa-magic"></i>
                Generate SRT File
              </>
            )}
          </button>
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="flex flex-col h-full space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <i className="fas fa-list-ol text-indigo-500"></i>
              SRT Output
            </h3>
            {srtOutput && (
              <button 
                onClick={downloadSRT}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-500/30 font-bold flex items-center gap-2 transition-all"
              >
                <i className="fas fa-download"></i>
                Download .srt
              </button>
            )}
          </div>

          <div className="flex-grow bg-slate-950 border border-slate-800 rounded-3xl p-6 font-mono text-sm overflow-auto max-h-[600px] shadow-inner relative">
            {!srtOutput && !isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 opacity-50 space-y-4">
                <i className="fas fa-code text-6xl"></i>
                <p>SRT content will appear here after processing</p>
              </div>
            )}
            {isProcessing && (
              <div className="space-y-4">
                <div className="h-4 bg-slate-900 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-slate-900 rounded animate-pulse w-1/2"></div>
                <div className="h-4 bg-slate-900 rounded animate-pulse w-5/6"></div>
              </div>
            )}
            <pre className="whitespace-pre-wrap text-slate-300">{srtOutput}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtitleTool;
