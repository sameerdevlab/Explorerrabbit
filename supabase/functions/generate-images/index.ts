import { createClient } from 'npm:@supabase/supabase-js@2.39.8';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: "Supabase configuration is missing" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Verify the user is authenticated
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - please sign in" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const apiKey = Deno.env.get("DEEPAI_API_KEY");
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key is not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Parse request body
    const requestData = await req.json();
    const { text } = requestData;

    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text content is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Generate image prompts based on the text
    const imageApiKey = Deno.env.get("DEEPAI_API_KEY");
const imagePromptResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${imageApiKey}`, // this is Groq API key now
  },
  body: JSON.stringify({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "Create 3 detailed image prompts for fantasy or realistic visuals based on this text. Return only a JSON array of 3 strings."
      },
      {
        role: "user",
        content: generatedText
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
  }),
});

const imagePromptData = await imagePromptResponse.json();

let imagePrompts;
try {
  imagePrompts = JSON.parse(imagePromptData.choices[0].message.content);
  if (!Array.isArray(imagePrompts)) throw new Error("Invalid prompt format");
} catch (error) {
  console.error("Error parsing image prompts:", error);
  imagePrompts = ["A visual representation related to " + prompt];
}

// Step 2: Generate images with DeepAI
const images = [];
const textLines = generatedText.split('\n').filter(line => line.trim().length > 0);
const interval = Math.max(Math.floor(textLines.length / (imagePrompts.length + 1)), 5);

for (let i = 0; i < imagePrompts.length && i < 3; i++) {
  try {
    const imageResponse = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: {
        "Api-Key": deepAiApiKey, // You must define this elsewhere (DeepAI key)
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ text: imagePrompts[i] }),
    });

    const imageData = await imageResponse.json();

    if (!imageResponse.ok || !imageData.output_url) {
      console.error("DeepAI API error:", imageData);
      continue;
}

    images.push({
      url: imageData.output_url,
      alt: imagePrompts[i].substring(0, 100),
      position: (i + 1) * interval,
    });
  } catch (error) {
    console.error("Error generating image:", error);
  }
}

    return new Response(
      JSON.stringify({ images }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unknown error occurred"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});