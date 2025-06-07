import { create } from 'zustand';
import toast from 'react-hot-toast';
import { ContentState, ContentGenerationResult } from '../types';
import { callEdgeFunction } from '../lib/supabase';
import { generatePlaceholderImages } from '../lib/utils';
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
  
  // Current content being displayed
  currentText: '',
  currentImages: [],
  currentMcqs: [],
  
  setMode: (mode) => set({ mode }),
  setPrompt: (prompt) => set({ prompt }),
  setPastedText: (text) => set({ pastedText: text }),
  
  clearContent: () => set({
    result: null,
    error: null,
    isGeneratingText: false,
    isGeneratingImages: false,
    isGeneratingMcqs: false,
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
      set({ 
        loading: true, 
        error: null,
        isGeneratingText: true,
        isGeneratingImages: true,
        isGeneratingMcqs: true,
        currentText: 'Text is getting generated...',
        currentImages: [generatePlaceholderImages(1, 10)[0]], // Single placeholder image
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
      });
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while generating content';
      set({
        error: errorMessage,
        loading: false,
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
      
      set({ 
        loading: true, 
        error: null,
        isGeneratingText: false, // Text is already available
        isGeneratingImages: true,
        isGeneratingMcqs: true,
        currentText: pastedText,
        currentImages: [generatePlaceholderImages(1, textLines.length)[0]], // Single placeholder image
        currentMcqs: [],
      });
      
      // Process images and MCQs in parallel
      const [imageResponse, mcqResponse] = await Promise.allSettled([
        callEdgeFunction('generate-images', { text: pastedText }),
        callEdgeFunction('generate-mcqs', { text: pastedText })
      ]);
      
      // Handle image generation result
      let finalImages = get().currentImages; // Keep placeholders as fallback
      if (imageResponse.status === 'fulfilled') {
        finalImages = imageResponse.value.images || [];
      }
      
      // Handle MCQ generation result
      let finalMcqs: any[] = [];
      if (mcqResponse.status === 'fulfilled') {
        finalMcqs = mcqResponse.value.mcqs || [];
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
        isGeneratingImages: false,
        isGeneratingMcqs: false,
      });
    } catch (error) {
      console.error('Error processing text:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your text';
      set({
        error: errorMessage,
        loading: false,
        // Keep loading indicators active to show persistent loading state
        // isGeneratingImages: false,
        // isGeneratingMcqs: false,
      });
      toast.error(errorMessage);
    }
  },
}));

export default useContentStore;