-- ClearDeal - Schema Simplificado para Usuários Anônimos
-- Execute este script no SQL Editor do Supabase

-- Tabela única para créditos anônimos
CREATE TABLE public.anonymous_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anonymous_id TEXT NOT NULL,
  credits INTEGER NOT NULL,
  payment_id TEXT UNIQUE,
  plan_type TEXT,
  amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca rápida por anonymous_id
CREATE INDEX idx_anonymous_id ON public.anonymous_credits(anonymous_id);
CREATE INDEX idx_payment_id ON public.anonymous_credits(payment_id);

-- Função: Obter total de créditos comprados por usuário anônimo
CREATE OR REPLACE FUNCTION public.get_anonymous_credits(anon_id TEXT)
RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(credits), 0)::INTEGER
  FROM public.anonymous_credits
  WHERE anonymous_id = anon_id;
$$ LANGUAGE SQL;

-- Função: Registrar compra de créditos
CREATE OR REPLACE FUNCTION public.add_anonymous_credits(
  anon_id TEXT,
  credit_amount INTEGER,
  pay_id TEXT,
  plan_t TEXT DEFAULT NULL,
  amt DECIMAL DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.anonymous_credits (
    anonymous_id,
    credits,
    payment_id,
    plan_type,
    amount
  )
  VALUES (
    anon_id,
    credit_amount,
    pay_id,
    plan_t,
    amt
  );
END;
$$ LANGUAGE plpgsql;

-- OPCIONAL: Tabela para usuários que decidirem criar conta
-- (pode adicionar depois se necessário)
/*
CREATE TABLE public.users_optional (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  anonymous_id TEXT, -- Para migrar créditos
  created_at TIMESTAMPTZ DEFAULT NOW()
);
*/

-- Teste
-- SELECT * FROM public.anonymous_credits;
-- SELECT get_anonymous_credits('anon_test_123');
