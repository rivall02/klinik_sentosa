// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

console.log("create-staff-user function initialized");

Deno.serve(async (req) => {
  console.log("Request received");
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Request body parsed:", body);
    const { email, password, role, full_name } = body;

    if (!email) throw new Error("Email is required.");
    if (!password) throw new Error("Password is required.");
    if (!role) throw new Error("Role is required.");
    if (!full_name) throw new Error("Full name is required.");
    console.log("Validation passed.");

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    console.log("Supabase admin client created.");

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { full_name, role, phone_number: body.phone_number, address: body.address, gender: body.gender, date_of_birth: body.date_of_birth },
    });
    console.log("createUser call finished. Error:", authError);

    if (authError) {
      throw authError;
    }
    
    return new Response(JSON.stringify({ message: "User created successfully", userId: authData.user.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Caught error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

