import React, { useState } from 'react';
import { AppState, AppStep, ImageAsset } from './types';
import StepIndicator from './components/StepIndicator';
import StepOneFace from './components/StepOneFace';
import StepTwoCloth from './components/StepTwoCloth';
import StepThreeResult from './components/StepThreeResult';
import Gallery from './components/Gallery';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentStep: AppStep.SELECT_FACE,
    selectedFace: null,
    selectedCloth: null,
    generatedResult: null,
    history: []
  });

  const handleStepClick = (step: AppStep) => {
    if (step <= state.currentStep) {
      setState(prev => ({ ...prev, currentStep: step }));
    }
  };

  const handleFaceSelect = (face: ImageAsset) => {
    setState(prev => ({
      ...prev,
      selectedFace: face,
      currentStep: AppStep.SELECT_CLOTH
    }));
  };

  const handleClothSelect = (cloth: ImageAsset) => {
    setState(prev => ({
      ...prev,
      selectedCloth: cloth,
      currentStep: AppStep.GENERATE_RESULT
    }));
  };

  const handleResultGenerated = (result: ImageAsset) => {
    setState(prev => ({
      ...prev,
      generatedResult: result,
      history: [result, ...prev.history]
    }));
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#e0e5ec] flex items-center justify-center relative font-sans">
      {/* Immersive Wallpaper: Abstract Mesh Gradient */}
      <div className="absolute inset-0 z-0 bg-slate-50">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-pink-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Application Container - Frameless Glass */}
      <div className="relative z-10 w-full h-full md:h-[95vh] md:w-[95%] max-w-7xl bg-white/40 backdrop-blur-3xl md:rounded-[2.5rem] shadow-2xl border border-white/40 flex flex-col overflow-hidden transition-all duration-500">
        
        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Immersive Header */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/40 to-transparent pointer-events-none z-0"></div>
          <div className="relative z-10 pt-8 pb-4 px-8 flex flex-col items-center">
             <h1 className="text-2xl font-light tracking-tight text-slate-800/80 mb-6 font-display">AI Magic Wardrobe</h1>
             <StepIndicator 
              currentStep={state.currentStep}
              face={state.selectedFace}
              cloth={state.selectedCloth}
              result={state.generatedResult}
              onStepClick={handleStepClick}
            />
          </div>

          {/* Lower Section: Operation Area */}
          <div className="flex-1 overflow-y-auto mac-scrollbar px-4 md:px-12 pb-32 relative z-10 scroll-smooth">
            <div className="max-w-5xl mx-auto mt-2 min-h-[400px] flex flex-col items-center">
              
              {state.currentStep === AppStep.SELECT_FACE && (
                <div className="w-full bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/50">
                  <StepOneFace onSelect={handleFaceSelect} />
                </div>
              )}

              {state.currentStep === AppStep.SELECT_CLOTH && state.selectedFace && (
                <div className="w-full bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/50">
                  <StepTwoCloth 
                    onSelect={handleClothSelect} 
                    selectedFace={state.selectedFace}
                  />
                </div>
              )}

              {state.currentStep === AppStep.GENERATE_RESULT && state.selectedFace && state.selectedCloth && (
                <div className="w-full h-full flex flex-col">
                   <StepThreeResult 
                    face={state.selectedFace}
                    cloth={state.selectedCloth}
                    onResultGenerated={handleResultGenerated}
                  />
                </div>
              )}
              
              {(state.currentStep === AppStep.SELECT_CLOTH && !state.selectedFace) && (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <p>请先选择模特</p>
                </div>
              )}
            </div>
          </div>

          {/* Floating Dock Gallery */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-20">
             <Gallery images={state.history} />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default App;