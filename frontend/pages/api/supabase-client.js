import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dlrtyhioxlzyyzlpvjis.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscnR5aGlveGx6eXl6bHB2amlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAyNjgwODAsImV4cCI6MTk4NTg0NDA4MH0.FP8GXpXvxZzJRT0FmqjOQyqSokEgprzBLCBn4LBSokM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
