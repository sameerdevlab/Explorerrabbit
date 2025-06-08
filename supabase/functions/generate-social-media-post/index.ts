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

    const groqApiKey = Deno.env.get("GROQ_API_KEY");
    
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

    console.log('🔍 Generating social media post for text length:', text.length);

    // Generate social media post using Groq
    const socialMediaResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
            content: "Create an engaging social media post based on the provided content. The post should be concise, attention-grabbing, and suitable for platforms like Twitter/X, Instagram, or LinkedIn. Include relevant hashtags and emojis where appropriate. Keep it under 280 characters for Twitter compatibility, but make it engaging and shareable. Focus on the key insights or most interesting points from the content."
          },
          {
            role: "user",
            content: `Create a social media post based on this content:\n\n${text}`
          }
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    const socialMediaData = await socialMediaResponse.json();
    
    console.log('🔍 Groq social media response status:', socialMediaResponse.ok);
    console.log('🔍 Groq social media response data:', socialMediaData);
    
    if (!socialMediaResponse.ok) {
      console.error("Groq API error:", socialMediaData);
      throw new Error(socialMediaData.error?.message || "Failed to generate social media post");
    }

    const generatedPost = socialMediaData.choices[0].message.content;
    console.log('🔍 Generated social media post:', generatedPost);

    return new Response(
      JSON.stringify({ post: generatedPost }),
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