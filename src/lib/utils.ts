import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ImageData, SavedContentItem } from '../types';

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

// Generate initial placeholder images for loading state (without needing text lines)
export function generateInitialPlaceholderImages(numImages: number = 3): ImageData[] {
  const images: ImageData[] = [];
  
  for (let i = 0; i < numImages; i++) {
    images.push({
      url: PLACEHOLDER_IMAGE_URL,
      alt: 'Loading image...',
      position: (i + 1) * 3 // Place images every 3 lines during loading
    });
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

// PDF Generation Utilities
export function generateHtmlForSavedContentItem(item: SavedContentItem): string {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  let html = `
    <div style="margin-bottom: 40px; page-break-after: auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Title Section -->
      <div style="border-bottom: 3px solid #8b5cf6; padding-bottom: 15px; margin-bottom: 25px; page-break-inside: avoid; page-break-after: avoid;">
        <h1 style="color: #1f2937; font-size: 28px; font-weight: bold; margin: 0 0 8px 0; line-height: 1.2;">${item.title}</h1>
        <p style="color: #6b7280; font-size: 14px; margin: 0; font-style: italic;">Created on ${formatDate(item.created_at)}</p>
      </div>

      <!-- Generated Text Content -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h2 style="color: #374151; font-size: 20px; font-weight: 600; margin: 0 0 15px 0; border-left: 4px solid #ec4899; padding-left: 12px; page-break-after: avoid;">Content</h2>
        <div style="line-height: 1.8; color: #374151; font-size: 16px; text-align: justify;">
          ${item.generated_text.split('\n').map(paragraph => 
            paragraph.trim() ? `<p style="margin: 0 0 16px 0; page-break-inside: avoid;">${paragraph}</p>` : ''
          ).join('')}
        </div>
      </div>
  `;

  // Add Images Section
  if (item.generated_images && item.generated_images.length > 0) {
    html += `
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h2 style="color: #374151; font-size: 20px; font-weight: 600; margin: 0 0 15px 0; border-left: 4px solid #3b82f6; padding-left: 12px; page-break-after: avoid;">Generated Images</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    `;
    
    item.generated_images.forEach((image, index) => {
      html += `
        <div style="border: 2px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); page-break-inside: avoid; margin-bottom: 20px;">
          <img src="${image.url}" alt="${image.alt}" style="width: 100%; height: 200px; object-fit: cover; display: block;" />
          <div style="padding: 12px; background-color: #f9fafb;">
            <p style="margin: 0; font-size: 14px; color: #6b7280; font-style: italic;">${image.alt}</p>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  }

  // Add MCQs Section
  if (item.generated_mcqs && item.generated_mcqs.length > 0) {
    html += `
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h2 style="color: #374151; font-size: 20px; font-weight: 600; margin: 0 0 15px 0; border-left: 4px solid #10b981; padding-left: 12px; page-break-after: avoid;">Quiz Questions</h2>
    `;
    
    item.generated_mcqs.forEach((mcq, index) => {
      html += `
        <div style="margin-bottom: 25px; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; background-color: #f9fafb; page-break-inside: avoid;">
          <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 15px 0; page-break-after: avoid;">Question ${index + 1}</h3>
          <p style="color: #374151; font-size: 16px; margin: 0 0 15px 0; font-weight: 500; page-break-inside: avoid;">${mcq.question}</p>
          <div style="margin-left: 20px; page-break-inside: avoid;">
      `;
      
      mcq.options.forEach((option, optionIndex) => {
        const isCorrect = optionIndex === mcq.correctAnswer;
        const optionLetter = String.fromCharCode(65 + optionIndex);
        
        html += `
          <div style="margin-bottom: 8px; display: flex; align-items: center; page-break-inside: avoid;">
            <span style="
              display: inline-block; 
              width: 24px; 
              height: 24px; 
              border-radius: 50%; 
              text-align: center; 
              line-height: 24px; 
              font-size: 12px; 
              font-weight: bold; 
              margin-right: 10px;
              ${isCorrect ? 
                'background-color: #10b981; color: white;' : 
                'background-color: #e5e7eb; color: #6b7280;'
              }
            ">${isCorrect ? '✓' : optionLetter}</span>
            <span style="color: ${isCorrect ? '#059669' : '#374151'}; font-weight: ${isCorrect ? '600' : '400'};">${option}</span>
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
  }

  // Add Social Media Post Section - Enhanced with avoid-break class and improved styling
  if (item.generated_social_media_post && item.generated_social_media_post.trim()) {
    html += `
      <div class="avoid-break social-media-post" style="margin-bottom: 30px; page-break-inside: avoid; page-break-before: avoid; page-break-after: avoid;">
        <h2 style="color: #374151; font-size: 20px; font-weight: 600; margin: 0 0 15px 0; border-left: 4px solid #f59e0b; padding-left: 12px; page-break-after: avoid;">Social Media Post</h2>
        <div class="avoid-break" style="border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; background-color: #fffbeb; border-left: 4px solid #f59e0b; page-break-inside: avoid; page-break-before: avoid; page-break-after: avoid;">
          <div style="color: #92400e; font-size: 16px; line-height: 1.6; word-wrap: break-word; overflow-wrap: break-word; white-space: pre-line; page-break-inside: avoid;">${item.generated_social_media_post}</div>
        </div>
      </div>
    `;
  }

  html += `</div>`;
  return html;
}

export function generateHtmlForAllSavedContent(savedContent: SavedContentItem[]): string {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px;">
      <!-- Main Header -->
      <div style="text-align: center; margin-bottom: 50px; border-bottom: 4px solid #8b5cf6; padding-bottom: 30px; page-break-inside: avoid; page-break-after: avoid;">
        <h1 style="color: #1f2937; font-size: 36px; font-weight: bold; margin: 0 0 10px 0; background: linear-gradient(135deg, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          My Saved Content Collection
        </h1>
        <p style="color: #6b7280; font-size: 18px; margin: 0; font-style: italic;">Generated on ${currentDate}</p>
        <p style="color: #9ca3af; font-size: 14px; margin: 10px 0 0 0;">Total Items: ${savedContent.length}</p>
      </div>

      <!-- Content Items -->
      <div>
  `;

  savedContent.forEach((item, index) => {
    html += generateHtmlForSavedContentItem(item);
    
    // Add page break after each item except the last one
    if (index < savedContent.length - 1) {
      html += `<div style="page-break-before: always;"></div>`;
    }
  });

  html += `
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e5e7eb; page-break-inside: avoid;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">Generated by Explorer AI Content Generator</p>
        <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">© ${new Date().getFullYear()} - All rights reserved</p>
      </div>
    </div>
  `;

  return html;
}