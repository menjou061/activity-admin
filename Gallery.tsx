import React from 'react';
import { ImageAsset } from '../types';

interface GalleryProps {
  images: ImageAsset[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  if (images.length === 0) return null;

  return (
    <div className="pointer-events-auto">
      {/* Dock Container */}
      <div className="mx-auto flex items-end px-4 pb-2 pt-4 space-x-3 bg-white/40 backdrop-blur-xl border border-white/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all hover:scale-105 hover:bg-white/50 duration-300 mb-4 max-w-[90vw] overflow-x-auto scrollbar-hide">
        
        {images.map((img, index) => (
          <div key={img.id} className="group relative flex-shrink-0 transition-all duration-300 hover:-translate-y-4 pb-2">
             {/* Tooltip */}
             <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
               Result #{images.length - index}
             </div>

             {/* Image */}
             <div 
               className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-md border border-white/20 cursor-pointer"
               onClick={() => window.open(img.url, '_blank')}
             >
               <img src={img.url} alt="History" className="w-full h-full object-cover" />
             </div>

             {/* Reflection Effect */}
             <div className="absolute -bottom-3 left-0 right-0 h-4 bg-gradient-to-b from-white/30 to-transparent transform scale-y-[-0.5] opacity-0 group-hover:opacity-40 transition-opacity rounded-b-xl"></div>
             
             {/* Active Dot indicator style (decorative) */}
             <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-slate-400 rounded-full opacity-0 group-hover:opacity-100"></div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Gallery;