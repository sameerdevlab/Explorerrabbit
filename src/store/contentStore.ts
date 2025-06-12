import { create } from 'zustand';
import toast from 'react-hot-toast';
import { ContentState, ContentGenerationResult, SocialMediaPostType } from '../types';
import { callEdgeFunction } from '../lib/supabase';
import { generatePlaceholderImages, generateInitialPlaceholderImages } from '../lib/utils';
import useAuthStore from './authStore';

// Social Media Post Type Prompts
const SOCIAL_MEDIA_PROMPTS = {
  'informative-summary': 'Summarize the following content into a short, informative social media post. Use clear, professional language and include 1–2 relevant emojis. Highlight key facts or takeaways in 2–3 sentences. Avoid fluff, and format it for LinkedIn or Instagram. Content: {{USER_CONTENT}}',
  
  'tips-carousel': 'Turn the following content into a clean, structured social media post with helpful tips or steps. Start with a short hook or headline, followed by 5–7 numbered or bulleted tips. Use friendly, educational language and 1–2 emojis. Format it for Instagram or LinkedIn. Do not format as slides. Content: {{USER_CONTENT}}',
  
  'motivational-quote': 'Create a motivational social media post based on the following content. Begin with a powerful quote or emotional hook, then write a short, inspiring message related to the content\'s theme. Add 1–2 relevant emojis. Keep the tone positive, creator-style, and punchy. Content: {{USER_CONTENT}}',
  
  'stats-based': 'Extract the most surprising or impactful statistics or facts from the following content and turn them into a "Did You Know?" style social media post. Use 1–2 emojis and a clear, bold tone. Format it for Instagram, X (Twitter), or LinkedIn. Make it eye-catching and easy to skim. Content: {{USER_CONTENT}}',
  
  'personal-journey': 'Write a social media post in the style of a personal reflection or journey. Start with a relatable hook or emotional thought, then share insights or lessons based on the content. End with an encouraging call to action. Use 1–2 emojis and keep the tone humble, honest, and human. Content: {{USER_CONTENT}}',
  
  'experimental-remix': 'Rewrite the following content in a bold, creative, Gen Z–friendly or poetic style. Use emojis, metaphors, rhymes, humor, or slang to make it stand out. Keep the message clear but add a modern, edgy twist for Instagram or Twitter/X. Have fun with the style. Content: {{USER_CONTENT}}'
};

const useContentStore = create<ContentState & {
  setMode: (mode: 'generate' | 'paste') => void;
  setPrompt: (prompt: string) => void;
  setPastedText: (text: string) => void;
  clearContent: () => void;
  generateContent: () => Promise<void>;
  processExistingText: () => Promise<void>;
  generateSocialMediaPost: (postType: SocialMediaPostType) => Promise<void>;
  retryMcqGeneration: () => Promise<void>;
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
  isGeneratingSocialMediaPost: false,
  
  // Current content being displayed
  currentText: '',
  currentImages: [],
  currentMcqs: [],
  socialMediaPost: null,
  
  // MCQ generation status and retry logic
  mcqGenerationStatus: 'idle',
  mcqErrorMessage: null,
  
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
    isGeneratingSocialMediaPost: false,
    currentText: '',
    currentImages: [],
    currentMcqs: [],
    socialMediaPost: null,
    mcqGenerationStatus: 'idle',
    mcqErrorMessage: null,
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
        socialMediaPost: null,
        mcqGenerationStatus: 'generating',
        mcqErrorMessage: null,
      });
      
      // Call the Supabase Edge Function for content generation
      const data = await callEdgeFunction('generate-content', {
        prompt,
      });
      
      // Check MCQ generation success
      let mcqStatus: 'success' | 'failed_first_attempt' = 'success';
      let mcqError: string | null = null;
      
      if (!data.mcqs || data.mcqs.length === 0) {
        mcqStatus = 'failed_first_attempt';
        mcqError = 'Failed to generate MCQs. Click retry to try again.';
      }
      
      // Set the final result and clear the prompt field
      set({
        result: data as ContentGenerationResult,
        currentText: data.text,
        currentImages: data.images,
        currentMcqs: data.mcqs || [],
        loading: false,
        isGeneratingText: false,
        isGeneratingImages: false,
        isGeneratingMcqs: false,
        isProcessingPastedText: false,
        mcqGenerationStatus: mcqStatus,
        mcqErrorMessage: mcqError,
        prompt: '', // Clear the prompt field after successful generation
      });
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while generating content';
      set({
        error: errorMessage,
        loading: false,
        isProcessingPastedText: false,
        mcqGenerationStatus: 'failed_first_attempt',
        mcqErrorMessage: 'Failed to generate MCQs. Click retry to try again.',
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
        socialMediaPost: null,
        mcqGenerationStatus: 'generating',
        mcqErrorMessage: null,
      });
      
      // Process images and MCQs in parallel
      const [imageResponse, mcqResponse] = await Promise.allSettled([
        callEdgeFunction('generate-images', { text: pastedText }),
        callEdgeFunction('generate-mcqs', { text: pastedText })
      ]);
      
      console.log('🔍 Image response:', imageResponse);
      console.log('🔍 MCQ response:', mcqResponse);
      
      // Handle image generation result
      let finalImages = placeholderImages; // Keep placeholders as fallback
      if (imageResponse.status === 'fulfilled' && imageResponse.value.images && imageResponse.value.images.length > 0) {
        finalImages = imageResponse.value.images;
        console.log('✅ Images generated successfully:', finalImages);
      } else {
        console.log('❌ Image generation failed or returned empty:', imageResponse);
      }
      
      // Handle MCQ generation result
      let finalMcqs: any[] = [];
      let mcqStatus: 'success' | 'failed_first_attempt' = 'success';
      let mcqError: string | null = null;
      
      if (mcqResponse.status === 'fulfilled' && mcqResponse.value.mcqs && mcqResponse.value.mcqs.length > 0) {
        finalMcqs = mcqResponse.value.mcqs;
        console.log('✅ MCQs generated successfully:', finalMcqs);
      } else {
        console.log('❌ MCQ generation failed or returned empty:', mcqResponse);
        if (mcqResponse.status === 'rejected') {
          console.error('MCQ generation error:', mcqResponse.reason);
        }
        mcqStatus = 'failed_first_attempt';
        mcqError = 'Failed to generate MCQs. Click retry to try again.';
      }
      
      // Combine the results
      const result: ContentGenerationResult = {
        text: pastedText,
        images: finalImages,
        mcqs: finalMcqs,
      };
      
      // Set the final result - ALWAYS turn off loading states and clear the pasted text field
      set({
        result,
        currentText: pastedText,
        currentImages: finalImages,
        currentMcqs: finalMcqs,
        loading: false,
        isGeneratingImages: false,
        isGeneratingMcqs: false, // Always turn off MCQ loading
        isProcessingPastedText: false,
        mcqGenerationStatus: mcqStatus,
        mcqErrorMessage: mcqError,
        pastedText: '', // Clear the pasted text field after successful processing
      });
      
      // Show success message
      if (finalMcqs.length > 0) {
        toast.success(`Generated ${finalMcqs.length} questions successfully!`);
      } else {
        toast.error('MCQ generation failed - please try again');
      }
      
    } catch (error) {
      console.error('Error processing text:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your text';
      
      // Keep placeholder images and turn off all loading states on error
      const currentState = get();
      const placeholderImages = currentState.currentImages.length > 0 ? currentState.currentImages : generatePlaceholderImages(1, 10);
      
      set({
        error: errorMessage,
        loading: false,
        isProcessingPastedText: false,
        isGeneratingImages: false,
        isGeneratingMcqs: false, // Turn off MCQ loading on error
        currentImages: placeholderImages,
        currentMcqs: [], // Ensure MCQs are empty on error
        mcqGenerationStatus: 'failed_first_attempt',
        mcqErrorMessage: 'Failed to generate MCQs. Click retry to try again.',
      });
      
      toast.error(errorMessage);
    }
  },
  
  retryMcqGeneration: async () => {
    const { currentText, mcqGenerationStatus } = get();
    
    // Only allow retry if we're in the first failure state
    if (mcqGenerationStatus !== 'failed_first_attempt') {
      return;
    }
    
    // Check if user is authenticated
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ mcqErrorMessage: 'Please sign in to retry MCQ generation' });
      toast.error('Please sign in to retry MCQ generation');
      return;
    }
    
    if (!currentText.trim()) {
      set({ mcqErrorMessage: 'No content available to generate MCQs' });
      toast.error('No content available to generate MCQs');
      return;
    }
    
    try {
      set({ 
        mcqGenerationStatus: 'generating',
        mcqErrorMessage: null,
        isGeneratingMcqs: true,
      });
      
      // Call the MCQ generation edge function
      const data = await callEdgeFunction('generate-mcqs', {
        text: currentText,
      });
      
      console.log('🔄 MCQ retry response:', data);
      
      if (data.mcqs && data.mcqs.length > 0) {
        // Retry successful
        set({
          currentMcqs: data.mcqs,
          mcqGenerationStatus: 'success',
          mcqErrorMessage: null,
          isGeneratingMcqs: false,
        });
        
        toast.success(`Generated ${data.mcqs.length} questions successfully!`);
      } else {
        // Retry failed - second attempt
        set({
          mcqGenerationStatus: 'failed_second_attempt',
          mcqErrorMessage: 'MCQs cannot be generated from this content.',
          isGeneratingMcqs: false,
        });
        
        toast.error('MCQs cannot be generated from this content');
      }
    } catch (error) {
      console.error('Error retrying MCQ generation:', error);
      
      // Second attempt failed
      set({
        mcqGenerationStatus: 'failed_second_attempt',
        mcqErrorMessage: 'MCQs cannot be generated from this content.',
        isGeneratingMcqs: false,
      });
      
      toast.error('MCQs cannot be generated from this content');
    }
  },
  
  generateSocialMediaPost: async (postType: SocialMediaPostType) => {
    const { currentText } = get();
    
    // Check if user is authenticated
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ error: 'Please sign in to generate social media post' });
      toast.error('Please sign in to generate social media post');
      return;
    }
    
    if (!currentText.trim()) {
      set({ error: 'No content available to generate social media post' });
      toast.error('No content available to generate social media post');
      return;
    }
    
    try {
      set({ 
        isGeneratingSocialMediaPost: true,
        error: null,
      });
      
      // Get the prompt template for the selected post type
      const promptTemplate = SOCIAL_MEDIA_PROMPTS[postType];
      const prompt = promptTemplate.replace('{{USER_CONTENT}}', currentText);
      
      // Call the Supabase Edge Function for social media post generation
      const data = await callEdgeFunction('generate-social-media-post', {
        prompt,
      });
      
      set({
        socialMediaPost: data.post,
        isGeneratingSocialMediaPost: false,
      });
      
      toast.success('Social media post generated successfully!');
    } catch (error) {
      console.error('Error generating social media post:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while generating social media post';
      set({
        error: errorMessage,
        isGeneratingSocialMediaPost: false,
      });
      toast.error(errorMessage);
    }
  },
}));

export default useContentStore;