import React, { useState, useEffect } from 'react';
import { ImageAsset } from '../types';
import { generateTryOn } from '../services/geminiService';

interface StepThreeResultProps {
  face: ImageAsset;
  cloth: ImageAsset;
  onResultGenerated: (asset: ImageAsset) => void;
}

const StepThreeResult: React.FC<StepThreeResultProps> = ({ face, cloth, onResultGenerated }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [resultImage, setResultImage] = useState<ImageAsset | null>(null);

  useEffect(() => {
    const doGenerate = async () => {
      setStatus('processing');
      try {
        const resultBase64 = await generateTryOn(face.url, cloth.url);
        const resultAsset: ImageAsset = {
          id: `res-${Date.now()}`,
          url: resultBase64,
          type: 'generated',
          category: 'result'
        };
        setResultImage(resultAsset);
        onResultGenerated(resultAsset);
        setStatus('success');
      } catch (e) {
        setStatus('error');
        setErrorMessage("生成失败，请检查网络或稍后重试。");
      }
    };

    if (status === 'idle') {
      doGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    setResultImage(null);
    setStatus('idle');
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage.url;
    link.download = `ai-fashion-tryon-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full bg-white/30 backdrop-blur-sm rounded-3xl border border-white/40">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-200/50 rounded-full"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-blue-500/80 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h2 className="mt-8 text-xl font-light text-slate-700 tracking-wide">AI 正在编织魔法</h2>
        <p className="text-sm text-slate-500 mt-2">正在为模特试穿新衣...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full bg-white/30 backdrop-blur-sm rounded-3xl border border-white/40">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 shadow-sm">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <p className="text-slate-700 font-medium mb-8 text-lg">{errorMessage}</p>
        <button onClick={handleRetry} className="px-8 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-full font-medium transition-all shadow-sm hover:shadow-md">
          重试
        </button>
      </div>
    );
  }

  if (status === 'success' && resultImage) {
    return (
      <div className="w-full h-full flex flex-col items-center animate-fade-in">
        
        {/* Main Result Viewer - Scaled Card Style */}
        <div className="relative w-full flex items-center justify-center py-6">
          <div className="relative h-[55vh] aspect-[3/4] rounded-2xl shadow-2xl border border-white/50 bg-white/20 overflow-hidden group">
             <img 
               src={resultImage.url} 
               alt="AI Try-on Result" 
               className="w-full h-full object-cover"
             />
             
             {/* Floating Action Button on Image */}
             <button 
               onClick={() => window.open(resultImage.url, '_blank')} 
               className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100"
               title="全屏预览"
             >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
             </button>
          </div>
        </div>

        {/* Control Bar */}
        <div className="mb-8 flex items-center space-x-6 bg-white/60 backdrop-blur-xl px-8 py-4 rounded-full shadow-lg border border-white/40">
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-2 px-6 py-2 bg-slate-900 hover:bg-black text-white rounded-full font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            <span>保存图片</span>
          </button>
      
          <div className="h-6 w-[1px] bg-slate-300"></div>

          <button 
            onClick={handleRetry}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            重新生成
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default StepThreeResult;