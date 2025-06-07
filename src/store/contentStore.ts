import { create } from 'zustand';
import toast from 'react-hot-toast';
import { ContentState, ContentGenerationResult } from '../types';
import { callEdgeFunction } from '../lib/supabase';
import { generatePlaceholderImages, generateInitialPlaceholderImages } from '../lib/utils';
import useAuthStore from './authStore';

const useContentStore = create<ContentState & {
  setMode: (mode: 'generate' | 'paste') => void;
  setPrompt: (prompt: string) => void;
  setPastedText: (text: string) => void;
  clearContent: () => void;
  generateContent: () => Promise<void>;
  processExistingText: () => Promise<void>;
}>((set, get) => ({
  mode: 'generate',
  prompt: '',
  pastedText: '',
  result: null,
  loading: false,
  error: null,
  
  // Progressive loading states
  isGeneratingText: false,
  isGeneratingImages: false,
  isGeneratingMcqs: false,
  isProcessingPastedText: false,
  
  // Current content being displayed
  currentText: '',
  currentImages: [],
  currentMcqs: [],
  
  setMode: (mode) => set({ mode }),
  setPrompt: (prompt) => set({ prompt }),
  setPastedText: (text) => {
    set({ pastedText: text });
  },
  
  clearContent: () => set({
    result: null,
    error: null,
    isGeneratingText: false,
    isGeneratingImages: false,
    isGeneratingMcqs: false,
    isProcessingPastedText: false,
    currentText: '',
    currentImages: [],
    currentMcqs: [],
  }),
  
  generateContent: async () => {
    const { prompt } = get();
    
    // Check if user is authenticated
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ error: 'Please sign in to generate content' });
      toast.error('Please sign in to generate content');
      return;
    }
    
    if (!prompt.trim()) {
      set({ error: 'Please enter a prompt to generate content' });
      toast.error('Please enter a prompt to generate content');
      return;
    }
    
    try {
      // Set initial loading state with empty content and loading flags
      set({ 
        loading: true, 
        error: null,
        isGeneratingText: true,
        isGeneratingImages: true,
        isGeneratingMcqs: true,
        isProcessingPastedText: false,
        currentText: '', // Start with empty text to show blinking lines
        currentImages: [], // Start with empty images to show placeholder loading
        currentMcqs: [],
      });
      
      // Call the Supabase Edge Function for content generation
      const data = await callEdgeFunction('generate-content', {
        prompt,
      });
      
      // Set the final result
      set({
        result: data as ContentGenerationResult,
        currentText: data.text,
        currentImages: data.images,
        currentMcqs: data.mcqs,
        loading: false,
        isGeneratingText: false,
        isGeneratingImages: false,
        isGeneratingMcqs: false,
        isProcessingPastedText: false,
      });
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while generating content';
      set({
        error: errorMessage,
        loading: false,
        isProcessingPastedText: false,
        // Keep loading indicators active to show persistent loading state
        // isGeneratingText: false,
        // isGeneratingImages: false,
        // isGeneratingMcqs: false,
      });
      toast.error(errorMessage);
    }
  },
  
  processExistingText: async () => {
    const { pastedText } = get();
    
    // Check if user is authenticated
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ error: 'Please sign in to process text' });
      toast.error('Please sign in to process text');
      return;
    }
    
    if (!pastedText.trim()) {
      set({ error: 'Please paste some text to process' });
      toast.error('Please paste some text to process');
      return;
    }
    
    try {
      const textLines = pastedText.split('\n').filter(line => line.trim().length > 0);
      const placeholderImages = generatePlaceholderImages(1, textLines.length);
      
      set({ 
        loading: true, 
        error: null,
        isGeneratingText: false, // Text is already available
        isGeneratingImages: true,
        isGeneratingMcqs: true,
        isProcessingPastedText: true,
        currentText: pastedText,
        currentImages: placeholderImages,
        currentMcqs: [],
      });
      
      // Process images and MCQs in parallel
      const [imageResponse, mcqResponse] = await Promise.allSettled([
        callEdgeFunction('generate-images', { text: pastedText }),
        callEdgeFunction('generate-mcqs', { text: pastedText })
      ]);
      
      // Handle image generation result
      let finalImages = placeholderImages; // Keep placeholders as fallback
      if (imageResponse.status === 'fulfilled' && imageResponse.value.images && imageResponse.value.images.length > 0) {
        finalImages = imageResponse.value.images;
      }
      
      // Handle MCQ generation result
      let finalMcqs: any[] = [];
      let shouldKeepMcqLoading = false;
      if (mcqResponse.status === 'fulfilled' && mcqResponse.value.mcqs && mcqResponse.value.mcqs.length > 0) {
        finalMcqs = mcqResponse.value.mcqs;
      } else {
        shouldKeepMcqLoading = true; // Keep loading indicator active when MCQ generation fails or returns empty
      }
      
      // Combine the results
      const result: ContentGenerationResult = {
        text: pastedText,
        images: finalImages,
        mcqs: finalMcqs,
      };
      
      // Set the final result
      set({
        result,
        currentText: pastedText,
        currentImages: finalImages,
        currentMcqs: finalMcqs,
        loading: false,
        isGeneratingImages: false, // Always hide image loading (placeholder remains if needed)
        isGeneratingMcqs: shouldKeepMcqLoading, // Keep MCQ loading active if generation failed or returned empty
        isProcessingPastedText: false,
      });
      
    } catch (error) {
      console.error('Error processing text:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your text';
      
      // Keep placeholder images and show MCQ loading on general error
      const currentState = get();
      const placeholderImages = currentState.currentImages.length > 0 ? currentState.currentImages : generatePlaceholderImages(1, 10);
      
      set({
        error: errorMessage,
        loading: false,
        isProcessingPastedText: false,
        isGeneratingImages: false, // Hide image loading on general error
        isGeneratingMcqs: true, // Keep MCQ loading active on general error
        currentImages: placeholderImages, // Ensure placeholder images remain
      });
      
      toast.error(errorMessage);
    }
  },
}));

export default useContentStore;