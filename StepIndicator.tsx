import React from 'react';
import { AppStep, ImageAsset } from '../types';

interface StepIndicatorProps {
  currentStep: AppStep;
  face: ImageAsset | null;
  cloth: ImageAsset | null;
  result: ImageAsset | null;
  onStepClick: (step: AppStep) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, face, cloth, result, onStepClick }) => {
  
  const getCardStyle = (step: AppStep) => {
    const isActive = currentStep === step;
    
    // Modern Glassmorphism Base
    let baseClasses = "relative w-28 h-40 md:w-36 md:h-48 rounded-2xl transition-all duration-700 ease-cubic-bezier(0.34, 1.56, 0.64, 1) cursor-pointer overflow-hidden border border-white/40 shadow-lg ";
    
    if (isActive) {
      // Active: Center, Larger, Glow
      baseClasses += "scale-110 z-30 bg-white/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] ring-1 ring-white/50 ";
    } else {
      // Inactive: Dimmer, Smaller
      baseClasses += "scale-95 z-10 bg-white/30 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 hover:bg-white/50 hover:scale-100 ";
    }

    // Spatial positioning
    if (step === AppStep.SELECT_FACE) {
      if (currentStep === step) return baseClasses; // Center
      if (currentStep > step) return baseClasses + "-translate-x-4 rotate-y-12 opacity-50"; // Move left
      return baseClasses; 
    }
    
    if (step === AppStep.SELECT_CLOTH) {
       // If this is active, it's center. 
       // If face is active (step 1), this is to the right.
       // If result is active (step 3), this is to the left.
       return baseClasses; 
    }

    if (step === AppStep.GENERATE_RESULT) {
      if (currentStep === step) return baseClasses;
      return baseClasses + "translate-x-4 -rotate-y-12"; // Move right
    }

    return baseClasses;
  };

  const renderCard = (step: AppStep, image: ImageAsset | null, label: string, icon: string) => {
    const isActive = currentStep === step;
    const hasImage = !!image;

    return (
      <div 
        className={getCardStyle(step)}
        onClick={() => step <= currentStep ? onStepClick(step) : null}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {hasImage ? (
          <img src={image.url} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
            <div className={`text-3xl filter ${isActive ? 'drop-shadow-md' : ''}`}>{icon}</div>
            <div className="text-[10px] font-medium uppercase tracking-widest opacity-60">{label}</div>
          </div>
        )}

        {/* Glass Overlay Highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Status Indicator Dot */}
        <div className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-colors duration-500 
          ${isActive ? 'bg-slate-800 shadow-[0_0_8px_rgba(0,0,0,0.3)]' : 'bg-slate-300'}`}>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center space-x-6 md:space-x-12 perspective-1000">
      {renderCard(AppStep.SELECT_FACE, face, "Model", "👤")}
      
      {/* Connector Line - Subtle */}
      <div className={`h-[2px] w-8 rounded-full transition-colors duration-500 ${currentStep >= 2 ? 'bg-slate-300' : 'bg-slate-200/50'}`}></div>
      
      {renderCard(AppStep.SELECT_CLOTH, cloth, "Outfit", "👕")}
      
      <div className={`h-[2px] w-8 rounded-full transition-colors duration-500 ${currentStep >= 3 ? 'bg-slate-300' : 'bg-slate-200/50'}`}></div>
      
      {renderCard(AppStep.GENERATE_RESULT, result, "Result", "✨")}
    </div>
  );
};

export default StepIndicator;