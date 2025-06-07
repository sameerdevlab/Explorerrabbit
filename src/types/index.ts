export interface User {
  id: string;
  email: string;
}

export interface ContentGenerationResult {
  text: string;
  images: ImageData[];
  mcqs: MCQuestion[];
}

export interface ImageData {
  url: string;
  alt: string;
  position: number; // Line number after which to insert the image
}

export interface MCQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer
}

export interface ContentState {
  mode: 'generate' | 'paste';
  prompt: string;
  pastedText: string;
  result: ContentGenerationResult | null;
  loading: boolean;
  error: string | null;
  
  // Progressive loading states
  isGeneratingText: boolean;
  isGeneratingImages: boolean;
  isGeneratingMcqs: boolean;
  
  // Current content being displayed
  currentText: string;
  currentImages: ImageData[];
  currentMcqs: MCQuestion[];
}

export interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  error: string | null;
}