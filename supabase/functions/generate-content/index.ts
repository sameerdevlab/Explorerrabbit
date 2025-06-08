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

    // Get API keys
    const groqApiKey = Deno.env.get("GROQ_API_KEY");
    const deepAiApiKey = Deno.env.get("DEEPAI_API_KEY");
    
    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: "Groq API key is not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    if (!deepAiApiKey) {
      return new Response(
        JSON.stringify({ error: "DeepAI API key is not configured" }),
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
    const { prompt } = requestData;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Generate text content with Groq
    const textResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
            content: "You are a helpful assistant who provides informative and educational content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const textData = await textResponse.json();

    if (!textResponse.ok) {
      console.error("Groq API error:", textData);
      throw new Error(textData.error?.message || "Failed to generate text");
    }

    const generatedText = textData.choices[0].message.content;

    // Generate image prompts using Groq
    const imagePromptResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
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

    // Generate images with DeepAI
    const images = [];
    const textLines = generatedText.split('\n').filter(line => line.trim().length > 0);
    const interval = Math.max(Math.floor(textLines.length / (imagePrompts.length + 1)), 5);

    for (let i = 0; i < imagePrompts.length && i < 3; i++) {
      try {
        const imageResponse = await fetch("https://api.deepai.org/api/text2img", {
          method: "POST",
          headers: {
            "Api-Key": deepAiApiKey,
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

    // Generate MCQs using Groq
    const mcqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Create 5 multiple-choice questions based on the given text. Each question should have 4 options with only one correct answer. Format the response as a JSON array of objects, each with: 'question' (string), 'options' (array of 4 strings), and 'correctAnswer' (index of correct option from 0 to 3)."
          },
          {
            role: "user",
            content: generatedText
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    const mcqData = await mcqResponse.json();
    let mcqs;
    try {
      const parsedContent = JSON.parse(mcqData.choices[0].message.content);
      // Handle both array format and object with questions property
      mcqs = Array.isArray(parsedContent) ? parsedContent : (parsedContent.questions || []);
    } catch (error) {
      console.error("Error parsing MCQs:", error);
      mcqs = [];
    }

    // Combine everything into a response
    const result = {
      text: generatedText,
      images,
      mcqs
    };

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
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