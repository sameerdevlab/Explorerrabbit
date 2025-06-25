// Shared utility for image generation with keyword filtering
const pexelsUnfriendlyKeywords = [
  "ai", "artificial intelligence", "neural", "robot", "cyber", "cyberpunk",
  "hologram", "matrix", "metaverse", "machine learning",
  "deep learning", "quantum", "simulation", "biotech", "genetics", "spaceship"
];

const pexelsFriendlyKeywords = [
  "nature", "flower", "forest", "tree", "sunset", "mountain", "animal",
  "horse", "cat", "dog", "bird", "person", "people", "man", "woman", "child", "kids",
  "travel", "beach", "car", "road", "building", "city", "landscape", "food",
  "sky", "river", "street", "garden", "park", "bridge", "boat", "bicycle", "field",
  "lake", "snow", "rain", "umbrella", "coffee", "desk", "laptop", "phone", "books",
  "writing", "reading", "studying", "shopping", "cooking", "walking", "running",
  "friends", "family", "vacation", "countryside", "market", "cafe", "sunrise", "sunlight"
];

interface ImageData {
  url: string;
  alt: string;
  position: number;
}

export async function generateImagesFromText(
  text: string,
  groqApiKey: string,
  pexelsApiKey: string
): Promise<ImageData[]> {
  // Convert text to lowercase for keyword checking
  const lowerText = text.toLowerCase();
  
  // Check if text contains any unfriendly keywords
  const containsUnfriendlyKeywords = pexelsUnfriendlyKeywords.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  // Check if text contains any friendly keywords
  const containsFriendlyKeywords = pexelsFriendlyKeywords.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  // Generate images if:
  // 1. Text doesn't contain unfriendly keywords, OR
  // 2. Text contains at least one friendly keyword (even if it also has unfriendly ones)
  if (containsUnfriendlyKeywords && !containsFriendlyKeywords) {
    console.log('🚫 Text contains Pexels-unfriendly keywords and no friendly keywords. Skipping image generation.');
    return [];
  }
  
  if (containsFriendlyKeywords) {
    console.log('✅ Text contains Pexels-friendly keywords. Proceeding with image generation...');
  } else {
    console.log('✅ Text is suitable for Pexels image generation. Proceeding...');
  }
  
  try {
    // Generate image prompts using Groq
    const imagePromptResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Based on the given text, generate 3 simple and realistic photography-style prompts suitable for stock image websites like Pexels. Avoid fantasy, AI, digital art, or abstract visuals. Each prompt should describe real-world scenes, people, objects, nature, or places. Return only a JSON array of 3 strings."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const imagePromptData = await imagePromptResponse.json();

    let imagePrompts: string[];
    try {
      imagePrompts = JSON.parse(imagePromptData.choices[0].message.content);
      if (!Array.isArray(imagePrompts)) throw new Error("Invalid prompt format");
    } catch (error) {
      console.error("Error parsing image prompts:", error);
      imagePrompts = ["A visual representation related to the provided text"];
    }

    // Generate images with Pexels
    const images: ImageData[] = [];
    const textLines = text.split('\n').filter(line => line.trim().length > 0);
    
    // Calculate positions to place images (roughly every 5-6 lines)
    const interval = Math.max(Math.floor(textLines.length / (imagePrompts.length + 1)), 5);

    for (let i = 0; i < imagePrompts.length && i < 3; i++) {
      try {
        const imageResponse = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(imagePrompts[i])}&per_page=1`, {
          method: "GET",
          headers: {
            Authorization: pexelsApiKey,
          },
        });
    
        const imageData = await imageResponse.json();
    
        if (!imageResponse.ok || !imageData.photos || imageData.photos.length === 0) {
          console.error("Pexels API error:", imageData);
          continue;
        }
    
        images.push({
          url: imageData.photos[0].src.large,
          alt: imagePrompts[i].substring(0, 100),
          position: (i + 1) * interval
        });
    
      } catch (error) {
        console.error("Error fetching from Pexels:", error);
      }
    }

    return images;
  } catch (error) {
    console.error("Error in generateImagesFromText:", error);
    return [];
  }
}