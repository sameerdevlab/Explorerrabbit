import { create } from 'zustand';
import toast from 'react-hot-toast';
import { ContentState, ContentGenerationResult, SocialMediaPostType, UserLevel, SavedContentItem } from '../types';
import { callEdgeFunction } from '../lib/supabase';
import { generatePlaceholderImages, generateInitialPlaceholderImages } from '../lib/utils';
import useAuthStore from './authStore';
import { DifficultyLevel } from '../components/content/MCQDifficultyModal';
import delay from '../../lib/utils'

// Social Media Post Type Prompts
const SOCIAL_MEDIA_PROMPTS = {
  'informative-summary': 'Summarize the following content into a short, informative social media post. Use clear, professional language and include 1–2 relevant emojis. Highlight key facts or takeaways in 2–3 sentences. Avoid fluff, and format it for LinkedIn or Instagram, At the end of the post, include 3–5 relevant and topic-specific hashtags in lowercase with no spaces. Avoid generic hashtags like #foryou or #viral. Format hashtags naturally on a new line or after the main content. Content: {{USER_CONTENT}}',
  
  'tips-carousel': 'Turn the following content into a clean, structured social media post with helpful tips or steps. Start with a short hook or headline, followed by 5–7 numbered or bulleted tips. Use friendly, educational language and 1–2 emojis. Format it for Instagram or LinkedIn. Do not format as slides, At the end of the post, include 3–5 relevant and topic-specific hashtags in lowercase with no spaces. Avoid generic hashtags like #foryou or #viral. Format hashtags naturally on a new line or after the main content. Content: {{USER_CONTENT}}',
  
  'motivational-quote': 'Create a motivational social media post based on the following content. Begin with a powerful quote or emotional hook, then write a short, inspiring message related to the content\'s theme. Add 1–2 relevant emojis. Keep the tone positive, creator-style, and punchy, At the end of the post, include 3–5 relevant and topic-specific hashtags in lowercase with no spaces. Avoid generic hashtags like #foryou or #viral. Format hashtags naturally on a new line or after the main content. Content: {{USER_CONTENT}}',
  
  'stats-based': 'Extract the most surprising or impactful statistics or facts from the following content and turn them into a "Did You Know?" style social media post. Use 1–2 emojis and a clear, bold tone. Format it for Instagram, X (Twitter), or LinkedIn. Make it eye-catching and easy to skim, At the end of the post, include 3–5 relevant and topic-specific hashtags in lowercase with no spaces. Avoid generic hashtags like #foryou or #viral. Format hashtags naturally on a new line or after the main content. Content: {{USER_CONTENT}}',
  
  'personal-journey': 'Write a social media post in the style of a personal reflection or journey. Start with a relatable hook or emotional thought, then share insights or lessons based on the content. End with an encouraging call to action. Use 1–2 emojis and keep the tone humble, honest, and human, At the end of the post, include 3–5 relevant and topic-specific hashtags in lowercase with no spaces. Avoid generic hashtags like #foryou or #viral. Format hashtags naturally on a new line or after the main content. Content: {{USER_CONTENT}}',
  
  'experimental-remix': 'Rewrite the following content in a bold, creative, Gen Z–friendly or poetic style. Use emojis, metaphors, rhymes, humor, or slang to make it stand out. Keep the message clear but add a modern, edgy twist for Instagram or Twitter/X. Have fun with the style, At the end of the post, include 3–5 relevant and topic-specific hashtags in lowercase with no spaces. Avoid generic hashtags like #foryou or #viral. Format hashtags naturally on a new line or after the main content. Content: {{USER_CONTENT}}'
};

// User level specific prompts for personal journey posts
const PERSONAL_JOURNEY_USER_LEVEL_PROMPTS = {
  'beginner': 'Write a social media post from the perspective of someone just starting their journey. Use a humble, curious tone that shows vulnerability and eagerness to learn. Start with a relatable beginner struggle or realization, then share insights from the content that would help other beginners. End with an encouraging message about taking the first steps. Use 1–2 emojis and keep the tone honest, hopeful, and inspiring for fellow beginners, At the end of the post, include 3–5 relevant and topic-specific hashtags in lowercase with no spaces. Avoid generic hashtags like #foryou or #viral. Format hashtags naturally on a new line or after the main content. Content: {{USER_CONTENT}}',
  
  'intermediate': 'Write a social media post from the perspective of someone who has made some progress but is still growing. Use a tone that balances confidence with humility, showing both achievements and ongoing challenges. Start with a reflection on the journey so far, then share insights from the content that would help others at a similar stage. End with encouragement about continuing to grow and learn. Use 1–2 emojis and keep the tone relatable, motivating, and authentic, At the end of the post, include 3–5 relevant and topic-specific hashtags in lowercase with no spaces. Avoid generic hashtags like #foryou or #viral. Format hashtags naturally on a new line or after the main content. Content: {{USER_CONTENT}}',
  
  'experienced': 'Write a social media post from the perspective of someone who has achieved success and wants to give back. Use a wise, mentoring tone that shares hard-earned wisdom without being preachy. Start with a reflection on the journey and lessons learned, then share key insights from the content that would benefit others. End with an inspiring call to action that encourages others to pursue their goals. Use 1–2 emojis and keep the tone generous, inspiring, and authentic, At the end of the post, include 3–5 relevant and topic-specific hashtags in lowercase with no spaces. Avoid generic hashtags like #foryou or #viral. Format hashtags naturally on a new line or after the main content. Content: {{USER_CONTENT}}'
};

const useContentStore = create<ContentState & {
  setMode: (mode: 'generate' | 'paste') => void;
  setPrompt: (prompt: string) => void;
  setPastedText: (text: string) => void;
  clearContent: () => void;
  generateContent: () => Promise<void>;
  processExistingText: () => Promise<void>;
  generateSocialMediaPost: (postType: SocialMediaPostType, userLevel?: UserLevel) => Promise<void>;
  retryMcqGeneration: () => Promise<void>;
  generateMcqs: (difficulty: DifficultyLevel) => Promise<void>;
  saveContent: () => Promise<void>;
  loadSavedContent: () => Promise<void>;
  loadSavedContentItem: (item: SavedContentItem) => void;
  deleteSavedContent: (id: string) => Promise<void>;
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
  
  // Save content functionality
  isSaving: false,
  savedContent: [],
  isLoadingSavedContent: false,
  isDeletingContent: false,
  
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
    isSaving: false,
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
        isGeneratingMcqs: false,
        isProcessingPastedText: false,
        currentText: '', // Start with empty text to show blinking lines
        currentImages: [], // Start with empty images to show placeholder loading
        currentMcqs: [],
        socialMediaPost: null,
        mcqGenerationStatus: 'idle',
        mcqErrorMessage: null,
      });
      
      // Call the Supabase Edge Function for content generation
      const data = await callEdgeFunction('generate-content', {
        prompt,
      });
      
      // Set the final result and clear the prompt field
      set({
        result: data as ContentGenerationResult,
        currentText: data.text,
        currentImages: data.images,
        currentMcqs: [], // No MCQs generated automatically
        loading: false,
        isGeneratingText: false,
        isGeneratingImages: false,
        isGeneratingMcqs: false,
        isProcessingPastedText: false,
        mcqGenerationStatus: 'idle',
        mcqErrorMessage: null,
        prompt: '', // Clear the prompt field after successful generation
      });
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while generating content';
      set({
        error: errorMessage,
        loading: false,
        isProcessingPastedText: false,
        mcqGenerationStatus: 'idle',
        mcqErrorMessage: null,
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
        isGeneratingMcqs: false,
        isProcessingPastedText: true,
        currentText: pastedText,
        currentImages: placeholderImages,
        currentMcqs: [],
        socialMediaPost: null,
        mcqGenerationStatus: 'idle',
        mcqErrorMessage: null,
      });
      
      // Process images only
      const [imageResponse] = await Promise.allSettled([
        callEdgeFunction('generate-images', { text: pastedText }),
      ]);
      
      console.log('🔍 Image response:', imageResponse);
      
      // Handle image generation result
      let finalImages = placeholderImages; // Keep placeholders as fallback
      if (imageResponse.status === 'fulfilled' && imageResponse.value.images && imageResponse.value.images.length > 0) {
        finalImages = imageResponse.value.images;
        console.log('✅ Images generated successfully:', finalImages);
      } else {
        console.log('❌ Image generation failed or returned empty:', imageResponse);
      }
      
      // Combine the results
      const result: ContentGenerationResult = {
        text: pastedText,
        images: finalImages,
        mcqs: [], // No MCQs generated automatically
      };
      
      // Set the final result - ALWAYS turn off loading states and clear the pasted text field
      set({
        result,
        currentText: pastedText,
        currentImages: finalImages,
        currentMcqs: [], // No MCQs generated automatically
        loading: false,
        isGeneratingImages: false,
        isGeneratingMcqs: false, // Always turn off MCQ loading
        isProcessingPastedText: false,
        mcqGenerationStatus: 'idle',
        mcqErrorMessage: null,
        pastedText: '', // Clear the pasted text field after successful processing
      });
      
      // Show success message
      toast.success('Content processed successfully!');
      
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
        mcqGenerationStatus: 'idle',
        mcqErrorMessage: null,
      });
      
      toast.error(errorMessage);
    }
  },

  generateMcqs: async (difficulty: DifficultyLevel) => {
    const { currentText } = get();
    
    // Check if user is authenticated
    const { user } = useAuthStore.getState();
    if (!user) {
      set({ mcqErrorMessage: 'Please sign in to generate MCQs' });
      toast.error('Please sign in to generate MCQs');
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
      
      // Call the MCQ generation edge function with difficulty
      const data = await callEdgeFunction('generate-mcqs', {
        text: currentText,
        difficulty: difficulty,
      });
      
      console.log('🔄 MCQ generation response:', data);
      
      if (data.mcqs && data.mcqs.length > 0) {
        // Generation successful
        set({
          currentMcqs: data.mcqs,
          mcqGenerationStatus: 'success',
          mcqErrorMessage: null,
          isGeneratingMcqs: false,
        });
        
        toast.success(`Generated ${data.mcqs.length} ${difficulty} questions successfully!`);
      } else {
        // Generation failed - first attempt
        set({
          mcqGenerationStatus: 'failed_first_attempt',
          mcqErrorMessage: 'Failed to generate MCQs. Click retry to try again.',
          isGeneratingMcqs: false,
        });
        
        toast.error('Failed to generate MCQs. Please try again.');
      }
    } catch (error) {
      console.error('Error generating MCQs:', error);
      
      // First attempt failed
      set({
        mcqGenerationStatus: 'failed_first_attempt',
        mcqErrorMessage: 'Failed to generate MCQs. Click retry to try again.',
        isGeneratingMcqs: false,
      });
      
      toast.error('Failed to generate MCQs. Please try again.');
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
      
      // Call the MCQ generation edge function without difficulty (default)
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
  
  generateSocialMediaPost: async (postType: SocialMediaPostType, userLevel?: UserLevel) => {
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
      
      // Get the appropriate prompt template
      let promptTemplate: string;
      
      if (postType === 'personal-journey' && userLevel) {
        // Use user level specific prompt for personal journey posts
        promptTemplate = PERSONAL_JOURNEY_USER_LEVEL_PROMPTS[userLevel];
      } else {
        // Use default prompt for other post types
        promptTemplate = SOCIAL_MEDIA_PROMPTS[postType];
      }
      
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
  
  saveContent: async () => {
    const { currentText, currentImages, currentMcqs, socialMediaPost } = get();
    
    // Check if user is authenticated
    const { user } = useAuthStore.getState();
    if (!user) {
      toast.error('Please sign in to save content');
      return;
    }
    
    if (!currentText.trim()) {
      toast.error('No content available to save');
      return;
    }
    
    try {
      set({ isSaving: true });
      
      // Generate a title from the first 50 characters of the text
      const title = currentText.substring(0, 50).trim() + (currentText.length > 50 ? '...' : '');
      
      // Call the save-content edge function
      const data = await callEdgeFunction('save-content', {
        title,
        generatedText: currentText,
        generatedImages: currentImages,
        generatedMcqs: currentMcqs,
        generatedSocialMediaPost: socialMediaPost || '',
      });
      
      // Add the new saved content to the local state
      const currentSavedContent = get().savedContent;
      set({
        savedContent: [data.savedContent, ...currentSavedContent],
        isSaving: false,
      });
      
      toast.success('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save content';
      set({ isSaving: false });
      toast.error(errorMessage);
    }
  },
  
  loadSavedContent: async () => {
    // Check if user is authenticated
    const { user } = useAuthStore.getState();
    if (!user) {
      return;
    }
    
    try {
      set({ isLoadingSavedContent: true, savedContent: [] });
      await delay(300);
      
      // Call the get-saved-content edge function
      const data = await callEdgeFunction('get-saved-content', {});
      
      set({
        savedContent: data.savedContent || [],
        isLoadingSavedContent: false,
      });
    } catch (error) {
      console.error('Error loading saved content:', error);
      set({ isLoadingSavedContent: false });
      toast.error('Failed to load saved content');
    }
  },
  
  loadSavedContentItem: (item: SavedContentItem) => {
    // Load the saved content item into the current state
    set({
      currentText: item.generated_text,
      currentImages: item.generated_images,
      currentMcqs: item.generated_mcqs,
      socialMediaPost: item.generated_social_media_post || null,
      result: {
        text: item.generated_text,
        images: item.generated_images,
        mcqs: item.generated_mcqs,
      },
      // Reset loading states
      loading: false,
      isGeneratingText: false,
      isGeneratingImages: false,
      isGeneratingMcqs: false,
      isProcessingPastedText: false,
      isGeneratingSocialMediaPost: false,
      mcqGenerationStatus: 'success',
      mcqErrorMessage: null,
    });
    
    toast.success(`Loaded: ${item.title}`);
  },
  
  deleteSavedContent: async (id: string) => {
    // Check if user is authenticated
    const { user } = useAuthStore.getState();
    if (!user) {
      toast.error('Please sign in to delete content');
      return;
    }
    
    try {
      set({ isDeletingContent: true });
      
      // Call the delete-saved-content edge function
      await callEdgeFunction('delete-saved-content', { id });
      
      // Remove the deleted content from the local state
      const currentSavedContent = get().savedContent;
      set({
        savedContent: currentSavedContent.filter(item => item.id !== id),
        isDeletingContent: false,
      });
      
      toast.success('Content deleted successfully!');
    } catch (error) {
      console.error('Error deleting content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete content';
      set({ isDeletingContent: false });
      toast.error(errorMessage);
    }
  },
}));

export default useContentStore;