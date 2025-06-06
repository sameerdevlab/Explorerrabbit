import { create } from 'zustand';
import { ContentState, ContentGenerationResult } from '../types';
import { callEdgeFunction } from '../lib/supabase';
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
  
  setMode: (mode) => set({ mode }),
  setPrompt: (prompt) => set({ prompt }),
  setPastedText: (text) => set({ pastedText: text }),
  
  clearContent: () => set({
    result: null,
    error: null,
  }),
  
  generateContent: async () => {
    const { prompt } = get();
    
    // Check if user is authenticated
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ error: 'Please sign in to generate content' });
      return;
    }
    
    if (!prompt.trim()) {
      set({ error: 'Please enter a prompt to generate content' });
      return;
    }
    
    try {
      set({ loading: true, error: null });
      
      // Call the Supabase Edge Function for content generation
      const data = await callEdgeFunction('generate-content', {
        prompt,
      });
      
      // Set the result
      set({
        result: data as ContentGenerationResult,
        loading: false,
      });
    } catch (error) {
      console.error('Error generating content:', error);
      set({
        error: error instanceof Error ? error.message : 'An error occurred while generating content',
        loading: false,
      });
    }
  },
  
  processExistingText: async () => {
    const { pastedText } = get();
    
    // Check if user is authenticated
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ error: 'Please sign in to process text' });
      return;
    }
    
    if (!pastedText.trim()) {
      set({ error: 'Please paste some text to process' });
      return;
    }
    
    try {
      set({ loading: true, error: null });
      
      // Process the user's pasted text
      // 1. Generate images based on the text
      const imageResponse = await callEdgeFunction('generate-images', {
        text: pastedText,
      });
      
      // 2. Generate MCQs from the text
      const mcqResponse = await callEdgeFunction('generate-mcqs', {
        text: pastedText,
      });
      
      // 3. Combine the results
      const result: ContentGenerationResult = {
        text: pastedText,
        images: imageResponse.images || [],
        mcqs: mcqResponse.mcqs || [],
      };
      
      // Set the result
      set({
        result,
        loading: false,
      });
    } catch (error) {
      console.error('Error processing text:', error);
      set({
        error: error instanceof Error ? error.message : 'An error occurred while processing your text',
        loading: false,
      });
    }
  },
}));

export default useContentStore;