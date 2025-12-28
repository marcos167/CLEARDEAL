-- ClearDeal - Supabase Schema (Safe Version)
-- Este script pode ser executado mesmo se as tabelas já existirem

-- ============================================
-- 1. DROP EXISTING TABLES (if needed)
-- ============================================
-- Descomente as linhas abaixo se quiser resetar TUDO:
-- DROP TABLE IF EXISTS public.payments CASCADE;
-- DROP TABLE IF EXISTS public.analyses CASCADE;
-- DROP TABLE IF EXISTS public.credit_transactions CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================
-- 2. CREATE TABLES (IF NOT EXISTS)
-- ============================================

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 1,
  total_credits_purchased INTEGER DEFAULT 0,
  total_analyses_done INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREDIT TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'free', 'usage', 'refund', 'bonus')),
  description TEXT,
  mercadopago_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_text TEXT NOT NULL,
  document_context TEXT NOT NULL,
  analysis_result JSONB NOT NULL,
  risk_level TEXT CHECK (risk_level IN ('baixo', 'medio', 'alto')),
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
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

-- ============================================
-- 3. CREATE INDEXES (IF NOT EXISTS)
-- ============================================

-- Credit Transactions Indexes
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_credit_transactions_user_id') THEN
    CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_credit_transactions_created_at') THEN
    CREATE INDEX idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);
  END IF;
END $$;

-- Analyses Indexes
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_analyses_user_id') THEN
    CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_analyses_created_at') THEN
    CREATE INDEX idx_analyses_created_at ON public.analyses(created_at DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_analyses_risk_level') THEN
    CREATE INDEX idx_analyses_risk_level ON public.analyses(risk_level);
  END IF;
END $$;

-- Payments Indexes
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_user_id') THEN
    CREATE INDEX idx_payments_user_id ON public.payments(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_status') THEN
    CREATE INDEX idx_payments_status ON public.payments(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_mp_id') THEN
    CREATE INDEX idx_payments_mp_id ON public.payments(mercadopago_payment_id);
  END IF;
END $$;

-- Profiles Indexes
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_email') THEN
    CREATE INDEX idx_profiles_email ON public.profiles(email);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_created_at') THEN
    CREATE INDEX idx_profiles_created_at ON public.profiles(created_at DESC);
  END IF;
END $$;

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
  CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

  DROP POLICY IF EXISTS "Users can view own transactions" ON public.credit_transactions;
  CREATE POLICY "Users can view own transactions"
    ON public.credit_transactions FOR SELECT
    USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can view own analyses" ON public.analyses;
  CREATE POLICY "Users can view own analyses"
    ON public.analyses FOR SELECT
    USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can insert own analyses" ON public.analyses;
  CREATE POLICY "Users can insert own analyses"
    ON public.analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
  CREATE POLICY "Users can view own payments"
    ON public.payments FOR SELECT
    USING (auth.uid() = user_id);
END $$;

-- ============================================
-- 5. TRIGGER FOR NEW USER
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING; -- Evita erro se já existir
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop e recria o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. FUNCTIONS
-- ============================================

-- Function: Use Credit
CREATE OR REPLACE FUNCTION public.use_credit(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT credits INTO current_credits
  FROM public.profiles
  WHERE id = user_uuid
  FOR UPDATE;
  
  IF current_credits < 1 THEN
    RETURN FALSE;
  END IF;
  
  UPDATE public.profiles
  SET 
    credits = credits - 1,
    total_analyses_done = total_analyses_done + 1,
    updated_at = NOW()
  WHERE id = user_uuid;
  
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
  UPDATE public.profiles
  SET 
    credits = credits + credit_amount,
    total_credits_purchased = total_credits_purchased + credit_amount,
    updated_at = NOW()
  WHERE id = user_uuid;
  
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
-- SUCCESS!
-- ============================================
SELECT 'Schema atualizado com sucesso! ✅' as status;
