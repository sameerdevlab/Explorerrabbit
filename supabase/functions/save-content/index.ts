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
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
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

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Parse request body
    const requestData = await req.json();
    const { 
      title, 
      generatedText, 
      generatedImages, 
      generatedMcqs, 
      generatedSocialMediaPost 
    } = requestData;

    if (!title || !generatedText) {
      return new Response(
        JSON.stringify({ error: "Title and generated text are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    console.log('🔍 Saving content for user:', user.id);
    console.log('🔍 Content title:', title);
    console.log('🔍 Text length:', generatedText.length);
    console.log('🔍 Images count:', generatedImages?.length || 0);
    console.log('🔍 MCQs count:', generatedMcqs?.length || 0);
    console.log('🔍 Has social media post:', !!generatedSocialMediaPost);

    // Insert the saved content into the database
    const { data, error } = await supabase
      .from('saved_content')
      .insert({
        user_id: user.id,
        title: title,
        generated_text: generatedText,
        generated_images: generatedImages || [],
        generated_mcqs: generatedMcqs || [],
        generated_social_media_post: generatedSocialMediaPost || '',
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(error.message);
    }

    console.log('✅ Content saved successfully:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        savedContent: data,
        message: 'Content saved successfully!'
      }),
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