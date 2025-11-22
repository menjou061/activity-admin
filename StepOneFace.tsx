import React, { useState } from 'react';
import { ImageAsset } from '../types';

interface StepOneFaceProps {
  onSelect: (asset: ImageAsset) => void;
}

const PRESETS: ImageAsset[] = [
  { id: 'p1', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80', type: 'preset', category: 'face' },
  { id: 'p2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', type: 'preset', category: 'face' },
  { id: 'p3', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', type: 'preset', category: 'face' },
];

const StepOneFace: React.FC<StepOneFaceProps> = ({ onSelect }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const asset: ImageAsset = {
          id: Date.now().toString(),
          url: reader.result as string,
          type: 'upload',
          category: 'face'
        };
        onSelect(asset);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">选择模特</h2>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Step 1/3</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        {/* Upload Card - Glassmorphism */}
        <label className="aspect-[3/4] rounded-2xl border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group relative overflow-hidden">
           <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
           <div className="w-10 h-10 rounded-full bg-white/80 shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
             <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
             </svg>
           </div>
           <span className="text-xs font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
             {uploading ? '处理中...' : '上传照片'}
           </span>
           {/* Shine effect */}
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </label>

        {/* Preset Cards */}
        {PRESETS.map((asset) => (
          <button 
            key={asset.id}
            onClick={() => onSelect(asset)}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <img src={asset.url} alt="Preset" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-lg">
                 <span className="text-xs font-bold text-slate-900">使用</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepOneFace;