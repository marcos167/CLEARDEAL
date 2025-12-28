// ClearDeal - Pricing Page Interactions

document.addEventListener('DOMContentLoaded', () => {
    initPricingToggle();
    initFAQ();
});

// Pricing plan toggle
function initPricingToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const plans = document.querySelectorAll('.pricing-plans');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const planType = btn.dataset.plan;

            // Update active states
            toggleBtns.forEach(b => b.classList.remove('active'));
            plans.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(planType)?.classList.add('active');
        });
    });
}

// FAQ accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Purchase functions (placeholder for payment integration)
function buyPlan(type, price) {
    // TODO: Integrate with Mercado Pago
    console.log(`Buying ${type} plan for R$ ${price}`);

    // For now, redirect to app
    if (confirm(`Comprar análise ${type} por R$ ${price}?\n\n(Em breve: integração com Mercado Pago)`)) {
        // Store purchase intent
        localStorage.setItem('cleardeal_purchase', JSON.stringify({
            type: 'single',
            plan: type,
            price: price
        }));

        // Redirect to payment (placeholder)
        window.location.href = 'app.html';
    }
}

function buyPackage(name, price, credits) {
    console.log(`Buying ${name} package for R$ ${price} (${credits} credits)`);

    if (confirm(`Comprar pacote ${name} por R$ ${price}?\n${credits} análises detalhadas\n\n(Em breve: integração com Mercado Pago)`)) {
        localStorage.setItem('cleardeal_purchase', JSON.stringify({
            type: 'package',
            name: name,
            price: price,
            credits: credits
        }));

        window.location.href = 'app.html';
    }
}

function subscribe(plan, price) {
    console.log(`Subscribing to ${plan} for R$ ${price}/month`);

    if (confirm(`Assinar plano ${plan} por R$ ${price}/mês?\n\n(Em breve: integração com Mercado Pago)`)) {
        localStorage.setItem('cleardeal_purchase', JSON.stringify({
            type: 'subscription',
            plan: plan,
            price: price
        }));

        window.location.href = 'app.html';
    }
}

// Export for HTML onclick handlers
window.buyPlan = buyPlan;
window.buyPackage = buyPackage;
window.subscribe = subscribe;
