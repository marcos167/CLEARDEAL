// Vercel Serverless Function - Mercado Pago Webhook
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN || 'TEST-8667353344043628-122816-b564a268cf1d6dc611e6682a998a9308-3031760943'
});

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { type, data, action } = req.body;

        console.log('Webhook received:', JSON.stringify(req.body, null, 2));

        // Mercado Pago envia notificação de pagamento
        if (type === 'payment' || action === 'payment.created') {
            const paymentId = data.id;

            console.log('Processing payment:', paymentId);

            // Buscar detalhes do pagamento
            const payment = await mercadopago.payment.get(paymentId);

            console.log('Payment status:', payment.body.status);
            console.log('Payment metadata:', payment.body.metadata);

            if (payment.body.status === 'approved') {
                // PAGAMENTO APROVADO!
                const metadata = payment.body.metadata;
                const credits = metadata.credits || 1;
                const planId = metadata.plan_id;
                const planType = metadata.plan_type;

                console.log(`✅ Payment approved! ${credits} credits for plan ${planId}`);

                // TODO: Adicionar créditos ao usuário
                // Por enquanto, apenas log
                // Futuramente: salvar no banco de dados
                // await addCreditsToUser(userEmail, credits);
            }
        }

        // Responder OK para o Mercado Pago
        res.status(200).json({ received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        // Mesmo com erro, responder 200 para não reenviar
        res.status(200).json({ error: 'Webhook processing failed' });
    }
};
