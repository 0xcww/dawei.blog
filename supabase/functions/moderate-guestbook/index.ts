import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const profanityList = [
  'fuck', 'shit', 'ass', 'bitch', 'damn', 'crap', 'piss', 'dick', 'cock', 'pussy',
  'asshole', 'bastard', 'slut', 'whore', 'fag', 'nigger', 'nigga', 'cunt', 'motherfucker',
  'prick', 'retard', 'douche', 'twat', 'wanker', 'bollocks', 'bugger', 'bloody',
  'chink', 'spic', 'kike', 'wetback', 'gook', 'retarded', 'nazi', 'rape'
];

function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return profanityList.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText) || lowerText.includes(word);
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { name, message } = await req.json();

    if (!name || !message) {
      return new Response(
        JSON.stringify({ error: 'Name and message are required.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (name.length > 50 || message.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Name or message is too long.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (containsProfanity(name) || containsProfanity(message)) {
      return new Response(
        JSON.stringify({ error: 'Your message contains inappropriate language. Please be respectful.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from('guestbook')
      .insert([{ name, message }]);

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Error saving your message. Please try again.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});