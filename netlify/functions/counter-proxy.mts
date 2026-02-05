import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const supabaseUrl = Netlify.env.get("VITE_SUPABASE_URL");
  const supabaseKey = Netlify.env.get("VITE_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: "Configuration error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/increment_visitor_count`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify({ count: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Counter proxy error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch counter" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/counter",
};
