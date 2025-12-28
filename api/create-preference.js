// Vercel Serverless Function - Create Mercado Pago Preference
const mercadopago = require('mercadopago');

// Configurar Mercado Pago com Access Token
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN || 'TEST-8667353344043628-122816-b564a268cf1d6dc611e6682a998a9308-3031760943'
});

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { items, metadata } = req.body;

        // Base URL para redirecionamento
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'https://cleardeal-chi.vercel.app';

        // Criar preferência de pagamento
        const preference = {
            items: items.map(item => ({
                ...item,
                currency_id: 'BRL'
            })),
            back_urls: {
                success: `${baseUrl}/success.html`,
                failure: `${baseUrl}/failure.html`,
                pending: `${baseUrl}/pending.html`
            },
            auto_return: 'approved',
            metadata: metadata || {},
            statement_descriptor: 'CLEARDEAL',
            external_reference: `cleardeal_${Date.now()}`,
            notification_url: `${baseUrl}/api/webhook`,
            expires: false,
            payment_methods: {
                excluded_payment_types: [],
                installments: 12
            }
        };

        console.log('Creating preference:', JSON.stringify(preference, null, 2));

        const response = await mercadopago.preferences.create(preference);

        console.log('Preference created:', response.body.id);

        res.status(200).json({
            id: response.body.id,
            init_point: response.body.init_point,
            sandbox_init_point: response.body.sandbox_init_point
        });

    } catch (error) {
        console.error('Error creating preference:', error);
        res.status(500).json({
            error: 'Failed to create payment preference',
            details: error.message
        });
    }
};
