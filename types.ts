export interface ImageAsset {
  id: string;
  url: string; // Data URL or Remote URL
  type: 'preset' | 'upload' | 'generated';
  category: 'face' | 'cloth' | 'result';
}

export enum AppStep {
  SELECT_FACE = 1,
  SELECT_CLOTH = 2,
  GENERATE_RESULT = 3
}

export interface AppState {
  currentStep: AppStep;
  selectedFace: ImageAsset | null;
  selectedCloth: ImageAsset | null;
  generatedResult: ImageAsset | null;
  history: ImageAsset[];
}