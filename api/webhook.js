// Vercel Serverless Function - Mercado Pago Webhook
const mercadopago = require('mercadopago');
const { createClient } = require('@supabase/supabase-js');

// Configure Mercado Pago
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN || 'TEST-8667353344043628-122816-b564a268cf1d6dc611e6682a998a9308-3031760943'
});

// Configure Supabase with service role (bypasses RLS)
const supabaseUrl = 'https://gjpmhgqdqnqgjwwaljkx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqcG1oZ3FkcW5xZ2p3d2Fsamt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk0MzkxMSwiZXhwIjoyMDgyNTE5OTExfQ.-YyYznaU_WIbprQ3EoSUHyLiBy65-Q4WgT7VJmVErSE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { type, data } = req.body;

        console.log('📥 Webhook recebido:', { type, data });

        if (type === 'payment') {
            const paymentId = data.id;

            // Get payment details from Mercado Pago
            const payment = await mercadopago.payment.get(paymentId);

            console.log('💳 Payment status:', payment.body.status);

            if (payment.body.status === 'approved') {
                const metadata = payment.body.metadata;
                const userId = metadata.user_id;
                const credits = metadata.credits || 1;
                const planType = metadata.plan_type || 'pay-per-use';

                if (userId) {
                    // User is logged in - add credits via Supabase
                    console.log(`✅ Adding ${credits} credits to user ${userId}`);

                    const { error } = await supabase.rpc('add_credits', {
                        user_uuid: userId,
                        credit_amount: credits,
                        transaction_type: 'purchase',
                        payment_id: paymentId
                    });

                    if (error) {
                        console.error('❌ Error adding credits:', error);
                        throw error;
                    }

                    // Register payment
                    await supabase.from('payments').insert({
                        user_id: userId,
                        mercadopago_payment_id: paymentId,
                        status: 'approved',
                        amount: payment.body.transaction_amount,
                        credits_granted: credits,
                        plan_type: planType,
                        metadata: metadata
                    });

                    console.log(`✅ Payment approved! ${credits} credits added to user ${userId}`);
                } else {
                    // Anonymous user - would need different handling
                    console.log('⚠️ Anonymous payment - user_id not found in metadata');
                }
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('❌ Webhook error:', error);
        res.status(200).json({ received: true, error: error.message });
    }
};
