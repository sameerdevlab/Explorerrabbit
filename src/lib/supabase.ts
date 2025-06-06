import { createClient } from '@supabase/supabase-js';

// Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to call Supabase Edge Functions
export async function callEdgeFunction(
  functionName: string,
  payload: any,
  options?: { auth?: boolean }
) {
  try {
    const { auth = true } = options || {};
    const url = `${supabaseUrl}/functions/v1/${functionName}`;
    
    // Headers setup
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add auth token if required and available
    if (auth) {
      const session = supabase.auth.getSession();
      const token = (await session).data.session?.access_token;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Make the request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      // Try to parse the error response as JSON to get detailed error message
      let errorMessage = `Error: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } catch (parseError) {
        // If JSON parsing fails, fall back to response text
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        } catch (textError) {
          // Keep the default error message if both JSON and text parsing fail
        }
      }
      
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Edge function error:', error);
    throw error;
  }
}