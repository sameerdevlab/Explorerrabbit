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
      throw new Error(`Error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Edge function error:', error);
    throw error;
  }
}