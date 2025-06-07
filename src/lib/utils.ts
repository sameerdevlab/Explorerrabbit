import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ImageData } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Local placeholder image
export const PLACEHOLDER_IMAGE_URL = '/ExplorerPlaceHolderImage.png';

export function generatePlaceholderImages(numImages: number, textLines: number): ImageData[] {
  const images: ImageData[] = [];
  
  if (textLines <= 5) {
    // If text is very short, place one image after all text
    images.push({
      url: PLACEHOLDER_IMAGE_URL,
      alt: 'Loading image...',
      position: textLines
    });
    return images;
  }
  
  // Place images roughly every 5-6 lines
  const interval = Math.max(Math.floor(textLines / (numImages + 1)), 5);
  
  for (let i = 1; i <= numImages; i++) {
    const position = i * interval;
    if (position < textLines) {
      images.push({
        url: PLACEHOLDER_IMAGE_URL,
        alt: 'Loading image...',
        position
      });
    }
  }
  
  return images;
}

export function splitTextForImages(text: string, numImages: number): { text: string, positions: number[] } {
  const lines = text.split('\n');
  const positions: number[] = [];
  
  if (lines.length <= 5) {
    // If text is very short, place one image after all text
    positions.push(lines.length);
    return { text, positions };
  }
  
  // Place an image roughly every 5-6 lines
  const interval = Math.floor(lines.length / (numImages + 1));
  
  for (let i = 1; i <= numImages; i++) {
    const position = i * interval;
    if (position < lines.length) {
      positions.push(position);
    }
  }
  
  return { text, positions };
}

// Generate a prompt for DALL-E based on a section of text
export function generateImagePrompt(text: string): string {
  // Take first 100 characters to avoid being too specific
  const shortText = text.substring(0, 100).trim();
  
  // Create a basic prompt that will generate a relevant image
  return `Create a detailed, realistic illustration representing this concept: ${shortText}`;
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 9);
}