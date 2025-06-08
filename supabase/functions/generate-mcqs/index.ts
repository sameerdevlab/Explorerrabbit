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

    console.log('🔍 Generating MCQs for text length:', text.length);

    // Generate MCQs using Groq
    const mcqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
            content: "Create 3 multiple-choice questions based on the given text. Each question should have 4 options with only one correct answer. Return ONLY a valid JSON array of objects, each with: 'question' (string), 'options' (array of 4 strings), and 'correctAnswer' (index of correct option from 0 to 3). Do not include any other text or formatting."
          },
          {
            role: "user",
            content: text
          }
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    const mcqData = await mcqResponse.json();
    
    console.log('🔍 Groq MCQ response status:', mcqResponse.ok);
    console.log('🔍 Groq MCQ response data:', mcqData);
    
    if (!mcqResponse.ok) {
      console.error("Groq API error:", mcqData);
      throw new Error(mcqData.error?.message || "Failed to generate MCQs");
    }

    let mcqs;
    try {
      const responseContent = mcqData.choices[0].message.content;
      console.log('🔍 Raw MCQ content:', responseContent);
      
      // Clean the response content to extract JSON
      let cleanContent = responseContent.trim();
      
      // Remove any markdown code blocks
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const parsedContent = JSON.parse(cleanContent);
      console.log('🔍 Parsed MCQ content:', parsedContent);
      
      // Handle both array format and object with questions property
      mcqs = Array.isArray(parsedContent) ? parsedContent : (parsedContent.questions || []);
      
      console.log('🔍 Final MCQs:', mcqs);
      
      // Validate MCQ structure
      if (mcqs.length > 0) {
        mcqs = mcqs.filter(mcq => 
          mcq.question && 
          Array.isArray(mcq.options) && 
          mcq.options.length === 4 && 
          typeof mcq.correctAnswer === 'number' &&
          mcq.correctAnswer >= 0 && 
          mcq.correctAnswer < 4
        );
      }
      
      console.log('🔍 Validated MCQs:', mcqs);
      
    } catch (error) {
      console.error("Error parsing MCQs:", error);
      mcqs = [];
    }

    return new Response(
      JSON.stringify({ mcqs }),
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