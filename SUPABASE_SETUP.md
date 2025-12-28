# ✅ Fase 1 - Setup do Supabase (AÇÕES NECESSÁRIAS)

## 🎯 O Que Foi Feito

✅ Schema SQL completo criado (`supabase-schema.sql`)  
✅ @supabase/supabase-js instalado  
✅ Módulos de autenticação criados (auth.js, supabase-client.js)  
✅ Páginas de login e signup com Google OAuth  

---

## 📋 PRÓXIMOS PASSOS (VOCÊ PRECISA FAZER)

### 1. Executar SQL no Supabase (https://app.supabase.com)

1. Acesse: https://app.supabase.com
2. Login com sua conta
3. Selecione o projeto `gjpmhgqdqnqgjwwaljkx`
4. Vá em **SQL Editor** (no menu lateral)
5. Clique em **"+ New query"**
6. Cole TODO o conteúdo do arquivo: `supabase-schema.sql`
7. Clique em **"Run"**
8. Verifique se não há erros

**Resultado esperado:** "Success. No rows returned"

---

### 2. Configurar Google OAuth no Supabase

1. No Supabase, vá em **Authentication** → **Providers**
2. Encontre **Google** na lista
3. Clique em **"Enable"**
4. Você precisará criar um projeto no Google Cloud Console:

#### 2.1 Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Criar novo projeto (ou usar existente)
3. Vá em **APIs & Services** → **Credentials**
4. Clique em **"+ CREATE CREDENTIALS"** → **OAuth client ID**
5. Application type: **Web application**
6. Name: **ClearDeal**
7. Authorized JavaScript origins:
   ```
   https://gjpmhgqdqnqgjwwaljkx.supabase.co
   http://localhost:3000 (para desenvolvimento)
   ```
8. Authorized redirect URIs:
   ```
   https://gjpmhgqdqnqgjwwaljkx.supabase.co/auth/v1/callback
   ```
9. Clique em **CREATE**
10. Copie o **Client ID** e **Client secret**

#### 2.2 Voltar ao Supabase

1. Cole o **Client ID** no campo correspondente
2. Cole o **Client secret**
3. Clique em **Save**
4. **IMPORTANT:** Em "Site URL", coloque: `https://cleardeal-chi.vercel.app`
5. Em "Redirect URLs", adicione todas as URLs permitidas:
   ```
   https://cleardeal-chi.vercel.app/app.html
   https://cleardeal-chi.vercel.app/**
   http://localhost:3000/**
   ```

---

### 3. Testar Localmente ANTES de Deploy

```bash
# Na pasta do projeto
npx serve . -p 3000
```

1. Abra: http://localhost:3000/signup.html
2. Tente criar uma conta com email/senha
3. Verifique se recebe email de confirmação
4. Teste login com Google
5. Verifique se redireciona para /app.html

---

### 4. Após Testes, Fazer Deploy

```bash
git add -A
git commit -m "feat: Add Supabase authentication setup"
git push
```

Vercel vai fazer deploy automático em ~1-2 minutos.

---

## 🎯 Próxima Etapa (DEPOIS do setup acima)

Vou atualizar o `app.js` para:
1. ✅ Verificar se usuário está logado
2. ✅ Usar créditos do Supabase (não localStorage)
3. ✅ Salvar análises no histórico
4. ✅ Conectar webhook do Mercado Pago ao Supabase

---

## ❓ Problemas Comuns

### "Email confirmation required"
- Supabase envia email de confirmação automaticamente
- Para desenvolvimento, desabilite em: Auth → Email Auth → "Confirm email" (OFF)

### "Google OAuth not working"
- Verifique se o Client ID está correto
- Verifique se a redirect URL está configurada no Google Console
- Limpe cache do navegador

### "User already registered"
- Va no Supabase → Authentication → Users
- Delete o usuário de teste e tente novamente

---

**Status:** ⏸️ Aguardando setup do Supabase para continuar  
**Quando estiver pronto, me avise!** 🚀
