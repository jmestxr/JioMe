import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = "https://srvrelwrbtcqkozbprvh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNydnJlbHdyYnRjcWtvemJwcnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMwMjM5OTMsImV4cCI6MTk2ODU5OTk5M30.VSrUmrmMCj5JskNGtIiYUFh5fTgsh8_0cOUO-fG9vwQ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    localStorage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  });
