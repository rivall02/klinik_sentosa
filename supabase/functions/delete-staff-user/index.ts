import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

console.log("delete-staff-user function initialized");

Deno.serve(async (req) => {
  console.log("Request received for delete-staff-user.");
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    console.log(`Parsed user_id to delete: ${user_id}`);
    if (!user_id) {
      throw new Error("User ID is required in the request body.");
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    console.log("Supabase admin client created for deletion.");

    console.log(`Attempting to delete user with ID: ${user_id}`);
    const { data: deleteData, error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id);

    console.log("deleteUser call finished. Error:", deleteError);
    console.log("deleteUser call data:", deleteData);

    if (deleteError) {
      throw deleteError;
    }

    return new Response(JSON.stringify({ message: "User deleted successfully" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Caught error in delete-staff-user:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

