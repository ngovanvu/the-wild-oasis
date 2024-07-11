import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://fztavaqtmhlozmwsqctc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dGF2YXF0bWhsb3ptd3NxY3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIxNDAzMzQsImV4cCI6MjAyNzcxNjMzNH0.gqyKK88of7n1rxj14dfe-4PRIZj1BnXJFQsCp4yY4bc";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
