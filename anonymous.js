// Anonymous User System
// Gerencia ID único para usuários anônimos

const Anonymous = {
    // Gerar ou recuperar ID anônimo persistente
    getId() {
        let anonId = localStorage.getItem('cleardeal_anonymous_id')

        if (!anonId) {
            // Gerar ID único: anon_timestamp_random
            anonId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
            localStorage.setItem('cleardeal_anonymous_id', anonId)

            console.log('✅ ID anônimo criado:', anonId)
        }

        return anonId
    },

    // Obter todos os dados do usuário anônimo
    getData() {
        return {
            anonymous_id: this.getId(),
            credits: parseInt(localStorage.getItem('cleardeal_credits') || '0'),
            used_free: localStorage.getItem('cleardeal_used_free') === 'true',
            purchased_credits: parseInt(localStorage.getItem('cleardeal_purchased_credits') || '0'),
            total_analyses: parseInt(localStorage.getItem('cleardeal_total_analyses') || '0')
        }
    },

    // Resetar (apenas para testes)
    reset() {
        localStorage.removeItem('cleardeal_anonymous_id')
        localStorage.removeItem('cleardeal_credits')
        localStorage.removeItem('cleardeal_used_free')
        localStorage.removeItem('cleardeal_purchased_credits')
        localStorage.removeItem('cleardeal_total_analyses')

        console.log('🔄 Dados anônimos resetados')
    }
}

// Exportar para uso global
window.Anonymous = Anonymous

export default Anonymous
