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

// Purchase functions with CPF/CNPJ validation
function buyPlan(type, price) {
    console.log(`Buying ${type} plan for R$ ${price}`);

    // Show CPF/CNPJ modal
    showDocumentModal({
        type: 'single',
        plan: type,
        price: price,
        title: `Análise ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        description: `R$ ${price.toFixed(2)}`
    });
}

function buyPackage(name, price, credits) {
    console.log(`Buying ${name} package for R$ ${price} (${credits} credits)`);

    showDocumentModal({
        type: 'package',
        name: name,
        price: price,
        credits: credits,
        title: `Pacote ${name.charAt(0).toUpperCase() + name.slice(1)}`,
        description: `${credits} análises - R$ ${price.toFixed(2)}`
    });
}

function subscribe(plan, price) {
    console.log(`Subscribing to ${plan} for R$ ${price}/month`);

    showDocumentModal({
        type: 'subscription',
        plan: plan,
        price: price,
        title: `Plano ${plan.charAt(0).toUpperCase() + plan.slice(1)}`,
        description: `R$ ${price.toFixed(2)}/mês`
    });
}

// CPF/CNPJ Modal for Brazilian payments
function showDocumentModal(purchaseData) {
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'document-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeDocumentModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeDocumentModal()">×</button>
                
                <h3>Informações para Pagamento</h3>
                <p class="modal-subtitle">${purchaseData.title} - ${purchaseData.description}</p>
                
                <div class="form-group">
                    <label for="document-input">CPF ou CNPJ *</label>
                    <input 
                        type="text" 
                        id="document-input" 
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        autocomplete="off"
                        required
                    />
                    <div id="document-error" class="document-error"></div>
                    <small class="document-help">Necessário para emissão de nota fiscal</small>
                </div>
                
                <div class="modal-actions">
                    <button onclick="closeDocumentModal()" class="btn btn-secondary">
                        Cancelar
                    </button>
                    <button onclick="submitPayment()" class="btn btn-primary">
                        Continuar para Pagamento →
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add styles
    if (!document.getElementById('document-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'document-modal-styles';
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 1rem;
            }
            
            .modal-content {
                background: var(--bg-dark, #1a1a2e);
                border-radius: 12px;
                padding: 2rem;
                max-width: 500px;
                width: 100%;
                position: relative;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
            }
            
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 2rem;
                color: var(--text-muted, #999);
                cursor: pointer;
                line-height: 1;
                padding: 0;
                width: 32px;
                height: 32px;
            }
            
            .modal-close:hover {
                color: var(--text-primary, #fff);
            }
            
            .modal-content h3 {
                margin: 0 0 0.5rem 0;
                color: var(--primary, #9B51E0);
            }
            
            .modal-subtitle {
                color: var(--text-muted, #999);
                margin: 0 0 1.5rem 0;
            }
            
            .form-group {
                margin-bottom: 1.5rem;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
                color: var(--text-primary, #fff);
            }
            
            .form-group input {
                width: 100%;
                padding: 0.75rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                color: var(--text-primary, #fff);
                font-size: 1rem;
            }
            
            .form-group input:focus {
                outline: none;
                border-color: var(--primary, #9B51E0);
                background: rgba(255, 255, 255, 0.08);
            }
            
            .modal-actions {
                display: flex;
                gap: 1rem;
                margin-top: 2rem;
            }
            
            .modal-actions button {
                flex: 1;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(modal);

    // Store purchase data
    window._pendingPurchase = purchaseData;

    // Setup validation
    setTimeout(() => {
        if (window.DocumentValidator) {
            window.DocumentValidator.setup('document-input', 'document-error');
        }
        document.getElementById('document-input')?.focus();
    }, 100);
}

function closeDocumentModal() {
    const modal = document.getElementById('document-modal');
    if (modal) {
        modal.remove();
    }
    window._pendingPurchase = null;
}

function submitPayment() {
    const documentInput = document.getElementById('document-input');
    const document = documentInput?.value.replace(/\D/g, '');

    // Validate
    if (!document) {
        alert('❌ Por favor, informe seu CPF ou CNPJ');
        documentInput?.focus();
        return;
    }

    if (window.DocumentValidator && !window.DocumentValidator.validate(document)) {
        alert('❌ CPF/CNPJ inválido. Verifique os dígitos.');
        documentInput?.focus();
        return;
    }

    // Get purchase data
    const purchaseData = window._pendingPurchase;
    if (!purchaseData) return;

    // Store everything including document
    const fullData = {
        ...purchaseData,
        document: document,
        documentType: document.length === 11 ? 'CPF' : 'CNPJ'
    };

    localStorage.setItem('cleardeal_purchase', JSON.stringify(fullData));

    // Close modal
    closeDocumentModal();

    // TODO: Integrate with Mercado Pago SDK here
    console.log('✅ Payment data ready:', fullData);

    // For now, redirect to app (will be payment page)
    alert(`✅ CPF/CNPJ validado!\n\nEm breve: Integração com Mercado Pago\n\nRedirecionando para página de pagamento...`);
    window.location.href = 'app.html';
}

// Export for HTML onclick handlers
window.buyPlan = buyPlan;
window.buyPackage = buyPackage;
window.subscribe = subscribe;
window.closeDocumentModal = closeDocumentModal;
window.submitPayment = submitPayment;
