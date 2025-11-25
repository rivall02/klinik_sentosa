import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

console.log("update-staff-user function initialized");

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id, updates } = await req.json();
    if (!user_id || !updates) {
      throw new Error("User ID and updates object are required.");
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Separate updates for auth and profiles table
    const authUpdates: { [key: string]: any } = {};
    const profileUpdates: { [key: string]: any } = {};

    if (updates.email) authUpdates.email = updates.email;
    if (updates.password) authUpdates.password = updates.password;
    
    if (updates.full_name) profileUpdates.full_name = updates.full_name;
    if (updates.role) profileUpdates.role = updates.role;
    if (updates.phone_number) profileUpdates.phone_number = updates.phone_number;
    if (updates.address) profileUpdates.address = updates.address;

    // Update auth user if there are any auth-related updates
    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(user_id, authUpdates);
      if (authError) throw authError;
    }

    // Update profile if there are any profile-related updates
    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user_id);
      if (profileError) throw profileError;
    }

    return new Response(JSON.stringify({ message: "User updated successfully" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

