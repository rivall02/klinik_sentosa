import { createClient } from '@supabase/supabase-js'

// Ganti dengan URL dan Anon Key dari proyek Supabase Anda
const supabaseUrl = 'https://xviynzdyuvqzkcfpdowr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2aXluemR5dXZxemtjZnBkb3dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTg5MDcsImV4cCI6MjA3OTQ3NDkwN30.EwMsTmq4TWJMQsEVOZkzE4F0XTft25kVuvJQAsnGmEs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
