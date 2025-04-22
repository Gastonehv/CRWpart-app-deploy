import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zpemooeavslkxmlqbfpe.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwZW1vb2VhdnNsa3htbHFiZnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzMxODksImV4cCI6MjA2MDY0OTE4OX0.ui4B8uoM6LUJLnuWklr8KDHHWq3vgMe3ks46XIXZi6Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
