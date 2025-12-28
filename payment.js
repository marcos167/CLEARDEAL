// ClearDeal - Payment Handler (Mercado Pago)
// Integração com Mercado Pago para pagamentos

const MP_PUBLIC_KEY = 'TEST-3c5169a9-7031-4d86-b0c3-0103261ff5b0'; // Sandbox
const mp = new MercadoPago(MP_PUBLIC_KEY);

const PaymentHandler = {
    // Definir planos disponíveis
    plans: {
        // Pay-per-use
        basic: {
            title: 'Análise Básica',
            description: 'Uma análise básica do seu documento',
            price: 9,
            credits: 1,
            type: 'pay-per-use'
        },
        detailed: {
            title: 'Análise Detalhada',
            description: 'Análise completa com riscos e custos',
            price: 19,
            credits: 1,
            type: 'pay-per-use'
        },
        juridica: {
            title: 'Análise Jurídica',
            description: 'Análise jurídica profunda com leis aplicáveis',
            price: 29,
            credits: 1,
            type: 'pay-per-use'
        },

        // Packages
        starter: {
            title: 'Pacote Starter',
            description: '5 análises detalhadas',
            price: 35,
            credits: 5,
            type: 'package'
        },
        professional: {
            title: 'Pacote Professional',
            description: '10 análises detalhadas + 1 jurídica grátis',
            price: 60,
            credits: 10,
            type: 'package'
        },
        business: {
            title: 'Pacote Business',
            description: '20 análises detalhadas + 3 jurídicas grátis',
            price: 100,
            credits: 20,
            type: 'package'
        },

        // Subscriptions (placeholder)
        mensal: {
            title: 'Plano Mensal',
            description: '15 análises detalhadas por mês',
            price: 49,
            credits: 15,
            type: 'subscription'
        },
        ilimitado: {
            title: 'Plano Ilimitado',
            description: 'Análises ilimitadas por mês',
            price: 99,
            credits: 999,
            type: 'subscription'
        }
    },

    // Criar preferência de pagamento
    async createPreference(planId) {
        const plan = this.plans[planId];

        if (!plan) {
            throw new Error('Plano não encontrado');
        }

        const preferenceData = {
            items: [{
                id: planId,
                title: plan.title,
                description: plan.description,
                quantity: 1,
                unit_price: plan.price,
                currency_id: 'BRL'
            }],
            metadata: {
                plan_id: planId,
                plan_type: plan.type,
                credits: plan.credits
            }
        };

        try {
            // Chamar API para criar preferência
            const response = await fetch('/api/create-preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferenceData)
            });

            if (!response.ok) {
                throw new Error('Erro ao criar preferência de pagamento');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao criar preferência:', error);
            throw error;
        }
    },

    // Iniciar checkout
    async checkout(planId) {
        try {
            // Mostrar loading
            this.showLoading();

            // Criar preferência
            const preference = await this.createPreference(planId);

            // Redirecionar para checkout do Mercado Pago
            window.location.href = preference.init_point;

        } catch (error) {
            this.hideLoading();
            console.error('Erro no checkout:', error);
            alert('Erro ao processar pagamento. Tente novamente.');
        }
    },

    // UI Helpers
    showLoading() {
        const loadingHTML = `
      <div id="paymentLoading" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      ">
        <div style="
          background: white;
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
        ">
          <div class="loading-spinner"></div>
          <p>Preparando pagamento...</p>
        </div>
      </div>
    `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    },

    hideLoading() {
        const loading = document.getElementById('paymentLoading');
        if (loading) {
            loading.remove();
        }
    }
};

// Funções globais para os botões (compatibilidade com pricing.html)
function buyPlan(planType, price) {
    PaymentHandler.checkout(planType);
}

function buyPackage(packageType, price, credits) {
    PaymentHandler.checkout(packageType);
}

function subscribe(planType, price) {
    // Por enquanto, subscriptions usam o mesmo fluxo
    PaymentHandler.checkout(planType);
}

// Exportar para uso global
window.PaymentHandler = PaymentHandler;
window.buyPlan = buyPlan;
window.buyPackage = buyPackage;
window.subscribe = subscribe;
