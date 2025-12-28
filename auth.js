// Authentication Module
import { supabase } from './supabase-client.js'

const Auth = {
    // ========================================
    // SIGN UP
    // ========================================
    async signUp(email, password, fullName) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    },
                    emailRedirectTo: window.location.origin + '/app.html'
                }
            })

            if (error) throw error

            // Profile é criado automaticamente via trigger
            return { success: true, data }
        } catch (error) {
            console.error('Sign up error:', error)
            return { success: false, error: error.message }
        }
    },

    // ========================================
    // SIGN IN (Email/Password)
    // ========================================
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error

            return { success: true, data }
        } catch (error) {
            console.error('Sign in error:', error)
            return { success: false, error: error.message }
        }
    },

    // ========================================
    // SIGN IN WITH GOOGLE
    // ========================================
    async signInWithGoogle() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/app.html',
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent'
                    }
                }
            })

            if (error) throw error

            return { success: true, data }
        } catch (error) {
            console.error('Google sign in error:', error)
            return { success: false, error: error.message }
        }
    },

    // ========================================
    // SIGN OUT
    // ========================================
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error

            // Redirect to landing page
            window.location.href = '/index.html'

            return { success: true }
        } catch (error) {
            console.error('Sign out error:', error)
            return { success: false, error: error.message }
        }
    },

    // ========================================
    // GET CURRENT USER
    // ========================================
    async getUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser()

            if (error) throw error

            return user
        } catch (error) {
            console.error('Get user error:', error)
            return null
        }
    },

    // ========================================
    // GET USER PROFILE (from profiles table)
    // ========================================
    async getProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) throw error

            return data
        } catch (error) {
            console.error('Get profile error:', error)
            return null
        }
    },

    // ========================================
    // UPDATE PROFILE
    // ========================================
    async updateProfile(userId, updates) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()
                .single()

            if (error) throw error

            return { success: true, data }
        } catch (error) {
            console.error('Update profile error:', error)
            return { success: false, error: error.message }
        }
    },

    // ========================================
    // PASSWORD RESET
    // ========================================
    async resetPassword(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password.html'
            })

            if (error) throw error

            return { success: true }
        } catch (error) {
            console.error('Password reset error:', error)
            return { success: false, error: error.message }
        }
    },

    // ========================================
    // AUTH STATE LISTENER
    // ========================================
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session)
        })
    }
}

export default Auth

// Export for global access
window.Auth = Auth
