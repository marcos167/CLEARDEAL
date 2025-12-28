// Supabase Client (CDN Version)
// Usando biblioteca via CDN global

(function () {
    // Aguardar o Supabase CDN carregar
    if (typeof supabase === 'undefined') {
        console.error('❌ Supabase CDN não carregado! Adicione o script CDN antes deste arquivo.');
        return;
    }

    const { createClient } = supabase;

    const supabaseUrl = 'https://gjpmhgqdqnqgjwwaljkx.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcG1oZ3FkcW5xZ2p3d2Fsamt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDM5MTEsImV4cCI6MjA4MjUxOTkxMX0.p1-FND-PRllv9zzvsB06YCBDfbk2P2yJ2CG9te8UmAY';

    try {
        const client = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        });

        // Exportar globalmente
        window.supabaseClient = client;

        console.log('✅ Supabase client inicializado com sucesso');
    } catch (error) {
        console.error('❌ Erro ao criar cliente Supabase:', error);
    }
})();
