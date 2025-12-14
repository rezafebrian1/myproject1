export type WorkflowMode = 'FOOD_DRINK' | 'FASHION' | null;

export type AspectRatio = '4:5' | '9:16' | '16:9';

export interface StyleOption {
  id: string;
  name: string;
  description: string; // 2-3 words Indonesian
  previewColor: string;
}

export interface AngleShot {
  id: string;
  name: string;
  description: string;
}

export interface FashionModelOptions {
  gender: 'Male' | 'Female';
  ethnicity: 'Southeast Asian' | 'East Asian' | 'Caucasian' | 'European' | 'Latin' | 'Abstract Mannequin';
  pose: 'Standing Casual' | 'Dynamic Movement' | 'Sitting Elegant' | 'Close-up Detail';
  isHijab: boolean;
  referenceImage: string | null; // base64
}

export interface GenerationRequest {
  images: string[]; // base64
  mode: WorkflowMode;
  style: StyleOption;
  aspectRatio: AspectRatio;
  background: string; // User input or "AI Generated"
  bokehLevel?: number; // Food only 0-100
  fashionOptions?: FashionModelOptions;
  instructions: string;
}

export interface GeneratedImage {
  angleId: string;
  angleName: string;
  imageUrl: string | null;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
  retryCount: number;
}
