
import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/gemini';

const ImageTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Analyze this image in detail and describe what you see.');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
      setResult('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const text = await analyzeImage(base64, file.type, prompt);
        setResult(text);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Image AI Assistant</h2>
            <p className="text-slate-400 text-sm">Understand visuals with Gemini 3 Pro reasoning.</p>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900 transition-all aspect-square relative overflow-hidden"
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            {imageUrl ? (
              <img src={imageUrl} className="absolute inset-0 w-full h-full object-cover rounded-3xl" alt="Preview" />
            ) : (
              <div className="text-center text-slate-500">
                <i className="fas fa-camera text-4xl mb-4"></i>
                <p>Click to upload image</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              placeholder="Ask anything about the image..."
            ></textarea>
            <button
              onClick={handleAnalyze}
              disabled={!file || isProcessing}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 transition-all disabled:bg-slate-800 disabled:text-slate-600"
            >
              {isProcessing ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-search"></i>}
              Analyze Image
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <i className="fas fa-comment-dots text-indigo-500"></i>
            AI Analysis Result
          </h3>
          <div className="flex-grow bg-slate-950 border border-slate-800 rounded-3xl p-6 text-slate-300 leading-relaxed overflow-auto max-h-[600px] prose prose-invert">
            {!result && !isProcessing && (
              <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-50 space-y-4">
                <i className="fas fa-brain text-5xl"></i>
                <p>Upload an image to start analysis</p>
              </div>
            )}
            {isProcessing && (
              <div className="space-y-4">
                <div className="h-4 bg-slate-900 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-slate-900 rounded animate-pulse w-11/12"></div>
                <div className="h-4 bg-slate-900 rounded animate-pulse w-3/4"></div>
              </div>
            )}
            {result && <div className="whitespace-pre-wrap">{result}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTool;
