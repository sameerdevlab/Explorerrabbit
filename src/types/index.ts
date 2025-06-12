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

export type SocialMediaPostType = 
  | 'informative-summary'
  | 'tips-carousel'
  | 'motivational-quote'
  | 'stats-based'
  | 'personal-journey'
  | 'experimental-remix';

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
  isProcessingPastedText: boolean;
  isGeneratingSocialMediaPost: boolean;
  
  // Current content being displayed
  currentText: string;
  currentImages: ImageData[];
  currentMcqs: MCQuestion[];
  socialMediaPost: string | null;
  
  // MCQ generation status and retry logic
  mcqGenerationStatus: 'idle' | 'generating' | 'failed_first_attempt' | 'failed_second_attempt' | 'success';
  mcqErrorMessage: string | null;
}

export interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  error: string | null;
}