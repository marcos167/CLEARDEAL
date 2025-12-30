/**
 * CPF/CNPJ Validator for Brazilian Mercado Pago Payments
 * © ClearDeal 2025
 * 
 * Validação conforme Receita Federal do Brasil
 */

// Format CPF: 378.341.098-39
function formatCPF(value) {
    return value
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1'); // Limita em 11 dígitos
}

// Format CNPJ: 12.345.678/0001-90
function formatCNPJ(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1'); // Limita em 14 dígitos
}

// Auto-detect and format CPF or CNPJ
function formatDocument(value) {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 11) {
        return formatCPF(value);
    } else {
        return formatCNPJ(value);
    }
}

// Validate CPF (Receita Federal algorithm)
function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    // Check length
    if (cpf.length !== 11) {
        return false;
    }

    // Check if all digits are the same (invalid CPFs like 111.111.111-11)
    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }

    // Validate first check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let checkDigit = 11 - (sum % 11);
    if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
    if (checkDigit !== parseInt(cpf.charAt(9))) {
        return false;
    }

    // Validate second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    checkDigit = 11 - (sum % 11);
    if (checkDigit === 10 || checkDigit === 11) checkDigit = 0;
    if (checkDigit !== parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
}

// Validate CNPJ (Receita Federal algorithm)
function validateCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');

    // Check length
    if (cnpj.length !== 14) {
        return false;
    }

    // Check if all digits are the same
    if (/^(\d)\1+$/.test(cnpj)) {
        return false;
    }

    // Validate first check digit
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    let digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) {
        return false;
    }

    // Validate second check digit
    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) {
        return false;
    }

    return true;
}

// Validate either CPF or CNPJ
function validateDocument(document) {
    const numbers = document.replace(/\D/g, '');

    if (numbers.length === 11) {
        return validateCPF(numbers);
    } else if (numbers.length === 14) {
        return validateCNPJ(numbers);
    }

    return false;
}

// Get document type
function getDocumentType(document) {
    const numbers = document.replace(/\D/g, '');

    if (numbers.length === 11) {
        return 'CPF';
    } else if (numbers.length === 14) {
        return 'CNPJ';
    }

    return null;
}

// Setup document input with auto-formatting and validation
function setupDocumentInput(inputId, errorElementId) {
    const input = document.getElementById(inputId);
    const errorElement = errorElementId ? document.getElementById(errorElementId) : null;

    if (!input) return;

    // Auto-format on input
    input.addEventListener('input', function (e) {
        e.target.value = formatDocument(e.target.value);
    });

    // Validate on blur
    input.addEventListener('blur', function (e) {
        const value = e.target.value.replace(/\D/g, '');

        if (!value) {
            // Empty - remove error
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
            input.classList.remove('error', 'valid');
            return;
        }

        const isValid = validateDocument(value);
        const docType = getDocumentType(value);

        if (isValid) {
            input.classList.remove('error');
            input.classList.add('valid');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        } else {
            input.classList.add('error');
            input.classList.remove('valid');
            if (errorElement) {
                errorElement.textContent = `❌ ${docType || 'CPF/CNPJ'} inválido. Verifique os dígitos.`;
                errorElement.style.display = 'block';
            }
        }
    });
}

// Add visual feedback styles
function addDocumentInputStyles() {
    if (document.getElementById('document-validator-styles')) return;

    const style = document.createElement('style');
    style.id = 'document-validator-styles';
    style.textContent = `
        input.valid {
            border-color: #10B981 !important;
            background: rgba(16, 185, 129, 0.1);
        }
        
        input.error {
            border-color: #EF4444 !important;
            background: rgba(239, 68, 68, 0.1);
        }
        
        .document-error {
            color: #EF4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: none;
        }
        
        .document-help {
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-top: 0.25rem;
        }
    `;

    document.head.appendChild(style);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function () {
    addDocumentInputStyles();
});

// Export for use in payment forms
window.DocumentValidator = {
    format: formatDocument,
    formatCPF: formatCPF,
    formatCNPJ: formatCNPJ,
    validate: validateDocument,
    validateCPF: validateCPF,
    validateCNPJ: validateCNPJ,
    getType: getDocumentType,
    setup: setupDocumentInput
};
