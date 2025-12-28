-- ClearDeal - Supabase Database Schema
-- Execute este script no SQL Editor do Supabase

-- ============================================
-- 1. PROFILES TABLE (User data extension)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 1, -- 1 crédito grátis inicial
  total_credits_purchased INTEGER DEFAULT 0,
  total_analyses_done INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para criar profile automaticamente quando user é criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. CREDIT TRANSACTIONS TABLE
-- ============================================
CREATE TABLE public.credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL, -- Positivo = compra, Negativo = uso
  type TEXT NOT NULL CHECK (type IN ('purchase', 'free', 'usage', 'refund', 'bonus')),
  description TEXT,
  mercadopago_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);

-- ============================================
-- 3. ANALYSES TABLE (History)
-- ============================================
CREATE TABLE public.analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_text TEXT NOT NULL,
  document_context TEXT NOT NULL,
  analysis_result JSONB NOT NULL,
  risk_level TEXT CHECK (risk_level IN ('baixo', 'medio', 'alto')),
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX idx_analyses_risk_level ON public.analyses(risk_level);

-- ============================================
-- 4. PAYMENTS TABLE
-- ============================================
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mercadopago_payment_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'refunded')),
  amount DECIMAL(10,2) NOT NULL,
  credits_granted INTEGER NOT NULL,
  plan_type TEXT CHECK (plan_type IN ('pay-per-use', 'package', 'subscription')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_mp_id ON public.payments(mercadopago_payment_id);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Credit Transactions Policies
CREATE POLICY "Users can view own transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Analyses Policies
CREATE POLICY "Users can view own analyses"
  ON public.analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON public.analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Payments Policies
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 6. FUNCTIONS
-- ============================================

-- Function: Use Credit
CREATE OR REPLACE FUNCTION public.use_credit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Get current credits with row lock
  SELECT credits INTO current_credits
  FROM public.profiles
  WHERE id = user_uuid
  FOR UPDATE;
  
  -- Check if has credit
  IF current_credits < 1 THEN
    RETURN FALSE;
  END IF;
  
  -- Decrement credit
  UPDATE public.profiles
  SET 
    credits = credits - 1,
    total_analyses_done = total_analyses_done + 1,
    updated_at = NOW()
  WHERE id = user_uuid;
  
  -- Register transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (user_uuid, -1, 'usage', 'Análise de documento');
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Add Credits
CREATE OR REPLACE FUNCTION public.add_credits(
  user_uuid UUID,
  credit_amount INTEGER,
  transaction_type TEXT,
  payment_id TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Add credits
  UPDATE public.profiles
  SET 
    credits = credits + credit_amount,
    total_credits_purchased = total_credits_purchased + credit_amount,
    updated_at = NOW()
  WHERE id = user_uuid;
  
  -- Register transaction
  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    type,
    description,
    mercadopago_payment_id
  )
  VALUES (
    user_uuid,
    credit_amount,
    transaction_type,
    CASE 
      WHEN transaction_type = 'purchase' THEN 'Compra de créditos'
      WHEN transaction_type = 'bonus' THEN 'Bônus promocional'
      WHEN transaction_type = 'refund' THEN 'Estorno de pagamento'
      ELSE 'Adição de créditos'
    END,
    payment_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get User Stats
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS TABLE (
  total_analyses BIGINT,
  credits_available INTEGER,
  credits_purchased INTEGER,
  last_analysis_date TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.total_analyses_done,
    p.credits,
    p.total_credits_purchased,
    (SELECT MAX(created_at) FROM public.analyses WHERE user_id = user_uuid)
  FROM public.profiles p
  WHERE p.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at DESC);

-- ============================================
-- DONE! Schema criado com sucesso.
-- ============================================

-- Para testar:
-- SELECT * FROM public.profiles;
-- SELECT * FROM public.credit_transactions;
-- SELECT * FROM public.analyses;
