
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured) {
    console.warn('Supabase URL and Anon Key are missing. Check your .env file.')
} else {
    console.log('Supabase Initialized with URL:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key')

export const checkConnection = async () => {
    if (!isConfigured) return { success: false, message: "Missing Environment Variables (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY)" };
    try {
        const { error } = await supabase.from('portfolio').select('count', { count: 'exact', head: true });
        if (error) return { success: false, message: error.message };
        return { success: true, message: "Connected to Supabase!" };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};
