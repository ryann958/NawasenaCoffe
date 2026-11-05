export default function handler(_request, response) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

  response.setHeader("Cache-Control", "no-store");

  if (!supabaseUrl || !supabaseKey) {
    response.status(503).json({
      configured: false,
      message: "Supabase belum dikonfigurasi untuk deployment ini.",
    });
    return;
  }

  response.status(200).json({
    configured: true,
    supabaseUrl,
    supabaseKey,
  });
}
