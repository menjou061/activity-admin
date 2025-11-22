import React, { useState } from 'react';
import { ImageAsset } from '../types';
import { generateClothingFromText } from '../services/geminiService';

interface StepTwoClothProps {
  onSelect: (asset: ImageAsset) => void;
  selectedFace: ImageAsset;
}

const PRESET_CLOTHES: ImageAsset[] = [
  { id: 'c1', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', type: 'preset', category: 'cloth' }, // White T-Shirt
  { id: 'c2', url: 'https://images.unsplash.com/photo-1551028919-ac66c9a3d683?auto=format&fit=crop&w=800&q=80', type: 'preset', category: 'cloth' }, // Leather Jacket
  { id: 'c3', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80', type: 'preset', category: 'cloth' }, // Denim Jacket
];

const StepTwoCloth: React.FC<StepTwoClothProps> = ({ onSelect, selectedFace }) => {
  const [activeTab, setActiveTab] = useState<'select' | 'generate'>('select');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedClothes, setGeneratedClothes] = useState<ImageAsset[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const asset: ImageAsset = {
          id: Date.now().toString(),
          url: reader.result as string,
          type: 'upload',
          category: 'cloth'
        };
        onSelect(asset);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const base64Image = await generateClothingFromText(prompt);
      const newAsset: ImageAsset = {
        id: `gen-${Date.now()}`,
        url: base64Image,
        type: 'generated',
        category: 'cloth'
      };
      setGeneratedClothes(prev => [newAsset, ...prev]);
      onSelect(newAsset);
      setActiveTab('select');
    } catch (err) {
      alert("生成失败");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full animate-fade-in">
      
      {/* Header with Segmented Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
         <div>
           <h2 className="text-xl font-semibold text-slate-800">选择衣物</h2>
           <p className="text-xs text-slate-400 mt-1">为您的模特搭配一套服装</p>
         </div>
         
         {/* MacOS Segmented Control */}
         <div className="bg-slate-200/60 p-1 rounded-lg inline-flex relative shadow-inner">
            {/* Sliding Background for animation could be added here with absolute positioning */}
            <button 
              onClick={() => setActiveTab('select')}
              className={`relative z-10 px-6 py-1.5 rounded-[6px] text-sm font-medium transition-all duration-200 ${
                activeTab === 'select' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              图库选择
            </button>
            <button 
              onClick={() => setActiveTab('generate')}
              className={`relative z-10 px-6 py-1.5 rounded-[6px] text-sm font-medium transition-all duration-200 ${
                activeTab === 'generate' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              AI 设计
            </button>
         </div>
      </div>

      {activeTab === 'select' ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {/* Upload Card */}
          <label className="aspect-[3/4] rounded-2xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/50 transition-colors cursor-pointer flex flex-col items-center justify-center group">
             <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
             <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                <span className="text-xl text-slate-400 group-hover:text-blue-500">+</span>
             </div>
             <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600">上传</span>
          </label>

          {/* Generated Items */}
          {generatedClothes.map((asset) => (
            <button key={asset.id} onClick={() => onSelect(asset)} className="relative aspect-[3/4] rounded-2xl overflow-hidden group ring-2 ring-pink-100">
              <img src={asset.url} alt="AI Generated" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full shadow-sm"></div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-lg">使用</div>
              </div>
            </button>
          ))}

          {/* Presets */}
          {PRESET_CLOTHES.map((asset) => (
            <button key={asset.id} onClick={() => onSelect(asset)} className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
              <img src={asset.url} alt="Preset cloth" className="w-full h-full object-cover bg-white/50 backdrop-blur-sm" />
              <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none"></div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
            </button>
          ))}
        </div>
      ) : (
        /* AI Generation Panel - Glass Card style */
        <div className="bg-white/50 p-1 rounded-2xl border border-white/60 shadow-sm">
          <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
             <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-slate-700 mb-3">描述设计灵感</label>
                <div className="relative group">
                  <textarea 
                    className="w-full h-32 p-4 rounded-xl border-0 bg-white/80 focus:bg-white shadow-inner text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none outline-none"
                    placeholder="例如：波西米亚风格的长裙，带有碎花图案..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-white/50 px-2 py-1 rounded-md">Nano Banana Model</div>
                </div>
                
                <div className="mt-6 flex justify-end">
                   <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className={`
                      flex items-center space-x-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-lg
                      ${isGenerating || !prompt 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                        : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 hover:shadow-xl'
                      }
                    `}
                   >
                     {isGenerating ? (
                       <>
                         <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                         </svg>
                         <span>设计中...</span>
                       </>
                     ) : (
                       <>
                         <span>✨ 开始生成</span>
                       </>
                     )}
                   </button>
                </div>
             </div>
             
             {/* Visual Hint */}
             <div className="hidden md:flex flex-col items-center justify-center w-40 h-40 bg-white/40 rounded-full border border-white shadow-inner">
                <span className="text-4xl opacity-50">🎨</span>
                <span className="text-[10px] text-slate-500 mt-2 font-medium">AI 创意工坊</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepTwoCloth;