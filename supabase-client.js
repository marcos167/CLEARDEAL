// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gjpmhgqdqnqgjwwaljkx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcG1oZ3FkcW5xZ2p3d2Fsamt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDM5MTEsImV4cCI6MjA4MjUxOTkxMX0.p1-FND-PRllv9zzvsB06YCBDfbk2P2yJ2CG9te8UmAY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Helper: Get current session
export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
}

// Helper: Get current user
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// Export for global access
window.supabase = supabase
