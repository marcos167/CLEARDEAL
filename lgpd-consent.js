/**
 * LGPD Cookie Consent Banner
 * © ClearDeal 2025
 * Conforme LGPD Art. 8º e Marco Civil da Internet
 */

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initCookieConsent();
});

function initCookieConsent() {
    // Check if user already accepted
    const hasConsent = localStorage.getItem('lgpd_consent');
    const consentDate = localStorage.getItem('lgpd_consent_date');

    // Show banner if no consent or consent older than 1 year
    const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
    if (!hasConsent || (consentDate && parseInt(consentDate) < oneYearAgo)) {
        showCookieBanner();
    }
}

function showCookieBanner() {
    // Create banner HTML
    const banner = document.createElement('div');
    banner.id = 'lgpd-cookie-banner';
    banner.className = 'lgpd-banner';
    banner.innerHTML = `
        <div class="lgpd-banner-container">
            <div class="lgpd-banner-content">
                <div class="lgpd-icon">🍪</div>
                <div class="lgpd-text">
                    <h4>Privacidade e Cookies</h4>
                    <p>
                        Usamos cookies e tecnologias semelhantes para melhorar sua experiência, 
                        analisar nosso tráfego e personalizar conteúdos. 
                        Ao continuar navegando, você concorda com nossa 
                        <a href="privacidade.html" target="_blank">Política de Privacidade</a>.
                    </p>
                </div>
            </div>
            <div class="lgpd-actions">
                <button onclick="rejectCookies()" class="btn-reject">
                    Apenas Essenciais
                </button>
                <button onclick="acceptCookies()" class="btn-accept">
                    Aceitar Todos
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(banner);

    // Add styles
    addLGPDStyles();

    // Animate in
    setTimeout(() => {
        banner.classList.add('show');
    }, 100);
}

function acceptCookies() {
    // Save consent
    localStorage.setItem('lgpd_consent', 'all');
    localStorage.setItem('lgpd_consent_date', Date.now().toString());

    // Hide banner
    hideCookieBanner();

    // Enable analytics (if you use)
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });
    }

    console.log('✅ Cookies accepted - Full consent');
}

function rejectCookies() {
    // Save essential-only consent
    localStorage.setItem('lgpd_consent', 'essential');
    localStorage.setItem('lgpd_consent_date', Date.now().toString());

    // Hide banner
    hideCookieBanner();

    // Disable analytics
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'denied'
        });
    }

    console.log('⚠️ Only essential cookies enabled');
}

function hideCookieBanner() {
    const banner = document.getElementById('lgpd-cookie-banner');
    if (banner) {
        banner.classList.remove('show');
        setTimeout(() => {
            banner.remove();
        }, 300);
    }
}

function addLGPDStyles() {
    if (document.getElementById('lgpd-styles')) return;

    const style = document.createElement('style');
    style.id = 'lgpd-styles';
    style.textContent = `
        .lgpd-banner {
            position: fixed;
            bottom: -300px;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, rgba(20, 20, 30, 0.98), rgba(30, 30, 45, 0.98));
            backdrop-filter: blur(10px);
            border-top: 2px solid rgba(155, 81, 224, 0.5);
            box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.5);
            z-index: 999999;
            transition: bottom 0.3s ease;
            padding: 1.5rem;
        }

        .lgpd-banner.show {
            bottom: 0;
        }

        .lgpd-banner-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2rem;
            flex-wrap: wrap;
        }

        .lgpd-banner-content {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            flex: 1;
            min-width: 300px;
        }

        .lgpd-icon {
            font-size: 2rem;
            line-height: 1;
        }

        .lgpd-text h4 {
            margin: 0 0 0.5rem 0;
            color: #fff;
            font-size: 1.125rem;
        }

        .lgpd-text p {
            margin: 0;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.875rem;
            line-height: 1.5;
        }

        .lgpd-text a {
            color: #9B51E0;
            text-decoration: underline;
            font-weight: 500;
        }

        .lgpd-text a:hover {
            color: #B371F5;
        }

        .lgpd-actions {
            display: flex;
            gap: 1rem;
            flex-shrink: 0;
        }

        .lgpd-actions button {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
        }

        .btn-reject {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-reject:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .btn-accept {
            background: linear-gradient(135deg, #9B51E0, #00A8FF);
            color: #fff;
        }

        .btn-accept:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(155, 81, 224, 0.4);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
            .lgpd-banner {
                padding: 1rem;
            }

            .lgpd-banner-container {
                flex-direction: column;
                align-items: stretch;
                gap: 1.5rem;
            }

            .lgpd-banner-content {
                flex-direction: column;
                text-align: center;
            }

            .lgpd-icon {
                display: none;
            }

            .lgpd-actions {
                flex-direction: column;
                width: 100%;
            }

            .lgpd-actions button {
                width: 100%;
            }
        }
    `;

    document.head.appendChild(style);
}

// Expose functions globally
window.acceptCookies = acceptCookies;
window.rejectCookies = rejectCookies;
