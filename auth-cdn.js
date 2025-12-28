// Authentication Module (CDN Version)
// Usa window.supabaseClient criado pelo supabase-client-cdn.js

(function () {
    const Auth = {
        // ========================================
        // SIGN UP
        // ========================================
        async signUp(email, password, fullName) {
            try {
                const { data, error } = await window.supabaseClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName
                        },
                        emailRedirectTo: window.location.origin + '/app.html'
                    }
                });

                if (error) throw error;

                return { success: true, data };
            } catch (error) {
                console.error('Sign up error:', error);
                return { success: false, error: error.message };
            }
        },

        // ========================================
        // SIGN IN (Email/Password)
        // ========================================
        async signIn(email, password) {
            try {
                const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                return { success: true, data };
            } catch (error) {
                console.error('Sign in error:', error);
                return { success: false, error: error.message };
            }
        },

        // ========================================
        // SIGN IN WITH GOOGLE
        // ========================================
        async signInWithGoogle() {
            try {
                const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin + '/app.html',
                        queryParams: {
                            access_type: 'offline',
                            prompt: 'consent'
                        }
                    }
                });

                if (error) throw error;

                return { success: true, data };
            } catch (error) {
                console.error('Google sign in error:', error);
                return { success: false, error: error.message };
            }
        },

        // ========================================
        // SIGN OUT
        // ========================================
        async signOut() {
            try {
                const { error } = await window.supabaseClient.auth.signOut();
                if (error) throw error;

                window.location.href = '/index.html';
                return { success: true };
            } catch (error) {
                console.error('Sign out error:', error);
                return { success: false, error: error.message };
            }
        },

        // ========================================
        // GET CURRENT USER
        // ========================================
        async getUser() {
            try {
                const { data: { user }, error } = await window.supabaseClient.auth.getUser();
                if (error) throw error;
                return user;
            } catch (error) {
                console.error('Get user error:', error);
                return null;
            }
        },

        // ========================================
        // GET USER PROFILE
        // ========================================
        async getProfile(userId) {
            try {
                const { data, error } = await window.supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Get profile error:', error);
                return null;
            }
        },

        // ========================================
        // UPDATE PROFILE
        // ========================================
        async updateProfile(userId, updates) {
            try {
                const { data, error } = await window.supabaseClient
                    .from('profiles')
                    .update({
                        ...updates,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', userId)
                    .select()
                    .single();

                if (error) throw error;
                return { success: true, data };
            } catch (error) {
                console.error('Update profile error:', error);
                return { success: false, error: error.message };
            }
        }
    };

    // Exportar globalmente
    window.Auth = Auth;
    console.log('✅ Auth module carregado');
})();
