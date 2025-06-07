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
  isProcessingPastedText: false,
  
  // Current content being displayed
  currentText: '',
  currentImages: [],
  currentMcqs: [],
  
  setMode: (mode) => set({ mode }),
  setPrompt: (prompt) => set({ prompt }),
  setPastedText: (text) => {
    console.log('📝 setPastedText called with:', text);
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
      set({ 
        loading: true, 
        error: null,
        isGeneratingText: true,
        isGeneratingImages: true,
        isGeneratingMcqs: true,
        isProcessingPastedText: false,
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
    console.log('🚀 processExistingText function called');
    const { pastedText } = get();
    
    console.log('📝 pastedText in processExistingText:', pastedText);
    console.log('📏 pastedText length:', pastedText.length);
    console.log('🧹 pastedText trimmed:', pastedText.trim());
    console.log('📏 pastedText trimmed length:', pastedText.trim().length);
    
    // Check if user is authenticated
    const { user } = useAuthStore.getState();
    console.log('👤 User authentication status:', !!user);
    if (!user) {
      console.log('❌ User not authenticated, returning early');
      set({ error: 'Please sign in to process text' });
      toast.error('Please sign in to process text');
      return;
    }
    
    if (!pastedText.trim()) {
      console.log('❌ No text provided, returning early');
      set({ error: 'Please paste some text to process' });
      toast.error('Please paste some text to process');
      return;
    }
    
    console.log('✅ Validation passed, proceeding with text processing');
    
    try {
      const textLines = pastedText.split('\n').filter(line => line.trim().length > 0);
      console.log('📄 Text lines count:', textLines.length);
      
      const placeholderImages = [generatePlaceholderImages(1, textLines.length)[0]];
      
      console.log('🔄 Setting initial loading states...');
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
      
      console.log('✅ Initial loading states set successfully');
      
      // Log the state immediately after setting initial values
      const stateAfterInitialSet = get();
      console.log('📊 STATE AFTER INITIAL SET:');
      console.log('  - currentImages length:', stateAfterInitialSet.currentImages.length);
      console.log('  - currentMcqs length:', stateAfterInitialSet.currentMcqs.length);
      console.log('  - isGeneratingImages:', stateAfterInitialSet.isGeneratingImages);
      console.log('  - isGeneratingMcqs:', stateAfterInitialSet.isGeneratingMcqs);
      console.log('  - isProcessingPastedText:', stateAfterInitialSet.isProcessingPastedText);
      console.log('  - currentImages:', stateAfterInitialSet.currentImages);
      
      // Process images and MCQs in parallel
      console.log('🔄 Starting parallel API calls...');
      const [imageResponse, mcqResponse] = await Promise.allSettled([
        callEdgeFunction('generate-images', { text: pastedText }),
        callEdgeFunction('generate-mcqs', { text: pastedText })
      ]);
      
      console.log('📸 Image response status:', imageResponse.status);
      console.log('❓ MCQ response status:', mcqResponse.status);
      
      // Handle image generation result
      let finalImages = placeholderImages; // Keep placeholders as fallback
      if (imageResponse.status === 'fulfilled') {
        console.log('✅ Images generated successfully');
        finalImages = imageResponse.value.images || placeholderImages;
      } else {
        console.log('❌ Image generation failed:', imageResponse.reason);
        console.log('🖼️ Keeping placeholder images');
      }
      
      // Handle MCQ generation result
      let finalMcqs: any[] = [];
      let shouldKeepMcqLoading = false;
      if (mcqResponse.status === 'fulfilled') {
        console.log('✅ MCQs generated successfully');
        finalMcqs = mcqResponse.value.mcqs || [];
      } else {
        console.log('❌ MCQ generation failed:', mcqResponse.reason);
        shouldKeepMcqLoading = true; // Keep loading indicator active when MCQ generation fails
      }
      
      // Log the calculated values before final set
      console.log('📊 CALCULATED VALUES BEFORE FINAL SET:');
      console.log('  - finalImages length:', finalImages.length);
      console.log('  - finalMcqs length:', finalMcqs.length);
      console.log('  - shouldKeepMcqLoading:', shouldKeepMcqLoading);
      console.log('  - finalImages:', finalImages);
      
      // Combine the results
      const result: ContentGenerationResult = {
        text: pastedText,
        images: finalImages,
        mcqs: finalMcqs,
      };
      
      console.log('🎯 Setting final results...');
      // Set the final result
      set({
        result,
        currentText: pastedText,
        currentImages: finalImages,
        currentMcqs: finalMcqs,
        loading: false,
        isGeneratingImages: false, // Always hide image loading, even if failed (placeholder remains)
        isGeneratingMcqs: shouldKeepMcqLoading, // Keep MCQ loading active if generation failed
        isProcessingPastedText: false,
      });
      
      // Log the state after final set
      const stateAfterFinalSet = get();
      console.log('📊 STATE AFTER FINAL SET (SUCCESS):');
      console.log('  - currentImages length:', stateAfterFinalSet.currentImages.length);
      console.log('  - currentMcqs length:', stateAfterFinalSet.currentMcqs.length);
      console.log('  - isGeneratingImages:', stateAfterFinalSet.isGeneratingImages);
      console.log('  - isGeneratingMcqs:', stateAfterFinalSet.isGeneratingMcqs);
      console.log('  - isProcessingPastedText:', stateAfterFinalSet.isProcessingPastedText);
      console.log('  - currentImages:', stateAfterFinalSet.currentImages);
      
      console.log('✅ processExistingText completed successfully');
    } catch (error) {
      console.error('❌ Error processing text:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your text';
      
      // Keep placeholder images and show MCQ loading on general error
      const currentState = get();
      const placeholderImages = currentState.currentImages.length > 0 ? currentState.currentImages : [generatePlaceholderImages(1, 10)[0]];
      
      set({
        error: errorMessage,
        loading: false,
        isProcessingPastedText: false,
        isGeneratingImages: false, // Hide image loading on general error
        isGeneratingMcqs: true, // Keep MCQ loading active on general error
        currentImages: placeholderImages, // Ensure placeholder images remain
      });
      
      // Log the state after error handling
      const stateAfterError = get();
      console.log('📊 STATE AFTER ERROR HANDLING:');
      console.log('  - currentImages length:', stateAfterError.currentImages.length);
      console.log('  - currentMcqs length:', stateAfterError.currentMcqs.length);
      console.log('  - isGeneratingImages:', stateAfterError.isGeneratingImages);
      console.log('  - isGeneratingMcqs:', stateAfterError.isGeneratingMcqs);
      console.log('  - isProcessingPastedText:', stateAfterError.isProcessingPastedText);
      console.log('  - currentImages:', stateAfterError.currentImages);
      
      toast.error(errorMessage);
    }
  },
}));

export default useContentStore;