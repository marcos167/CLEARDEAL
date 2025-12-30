/**
 * Floating WhatsApp Button
 * © ClearDeal 2025
 * Brasileiro AMA WhatsApp! Maximize conversão com suporte direto
 */

// Add WhatsApp floating button to page
function addWhatsAppButton() {
    // Configuration - REAL NUMBER
    const config = {
        phoneNumber: '5511915000125', // Marco's WhatsApp
        message: 'Olá! Vim do site ClearDeal e preciso de ajuda 🔍',
        position: 'right' // 'right' or 'left'
    };

    // Create button HTML
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = `https://wa.me/${config.phoneNumber}?text=${encodeURIComponent(config.message)}`;
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener noreferrer';
    whatsappBtn.className = 'whatsapp-float';
    whatsappBtn.innerHTML = `
        <svg viewBox="0 0 32 32" fill="white" width="28" height="28">
            <path d="M16 0C7.164 0 0 7.163 0 16c0 2.826.736 5.589 2.133 8L.073 31.349l7.563-1.955A15.923 15.923 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333c-2.547 0-5.045-.723-7.2-2.088l-.517-.328-5.365 1.387 1.44-5.249-.36-.536a13.277 13.277 0 01-2.109-7.186C1.889 8.605 8.272 2.222 16 2.222s14.111 6.383 14.111 14.111S23.728 29.333 16 29.333z"/>
            <path d="M23.547 19.427c-.397-.199-2.349-1.159-2.713-1.291-.364-.133-.629-.199-.893.199-.265.397-1.026 1.291-1.258 1.556-.232.265-.464.298-.861.1-.397-.199-1.677-.618-3.194-1.972-1.181-1.053-1.979-2.354-2.211-2.751-.232-.397-.025-.612.174-.81.179-.178.397-.464.595-.695.199-.232.265-.397.397-.662.133-.265.066-.497-.033-.695-.1-.199-.893-2.151-1.225-2.945-.323-.773-.651-.668-.893-.681-.232-.012-.497-.015-.762-.015s-.695.1-.961.497c-.265.397-1.013.99-1.013 2.413s1.038 2.799 1.183 2.991c.146.193 2.048 3.128 4.965 4.387.694.3 1.236.479 1.657.613.696.221 1.329.19 1.829.115.558-.083 1.719-.703 1.961-1.381.243-.679.243-1.259.17-1.381-.073-.123-.338-.193-.735-.392z"/>
        </svg>
        <span class="whatsapp-pulse"></span>
    `;

    // Add styles
    addWhatsAppStyles(config.position);

    // Append to body
    document.body.appendChild(whatsappBtn);

    // Analytics (optional)
    whatsappBtn.addEventListener('click', () => {
        console.log('WhatsApp button clicked');
        // TODO: Send analytics event
    });
}

function addWhatsAppStyles(position = 'right') {
    if (document.getElementById('whatsapp-styles')) return;

    const style = document.createElement('style');
    style.id = 'whatsapp-styles';
    style.textContent = `
        .whatsapp-float {
            position: fixed;
            bottom: 20px;
            ${position}: 20px;
            background: #25D366;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
            z-index: 999;
            transition: all 0.3s ease;
            text-decoration: none;
            cursor: pointer;
        }
        
        .whatsapp-float:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
        }
        
        .whatsapp-pulse {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: rgba(37, 211, 102, 0.5);
            animation: whatsapp-pulse 2s infinite;
        }
        
        @keyframes whatsapp-pulse {
            0% {
                transform: scale(0.95);
                opacity: 1;
            }
            50% {
                transform: scale(1.1);
                opacity: 0.7;
            }
            100% {
                transform: scale(0.95);
                opacity: 1;
            }
        }
        
        /* Mobile adjustments */
        @media (max-width: 768px) {
            .whatsapp-float {
                width: 56px;
                height: 56px;
                bottom: 16px;
                ${position}: 16px;
            }
        }
    `;

    document.head.appendChild(style);
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addWhatsAppButton);
} else {
    addWhatsAppButton();
}

// Export for manual initialization
window.addWhatsAppButton = addWhatsAppButton;
