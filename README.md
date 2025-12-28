# ClearDeal 🔍

**Entenda exatamente o que você está aceitando — antes que vire problema.**

ClearDeal é um tradutor de contratos, cobranças e documentos legais que converte juridiquês em português claro, identificando riscos, pegadinhas e custos ocultos em menos de 60 segundos.

## 🎯 Problema que Resolvemos

Todos os dias, pessoas:
- ✍️ Assinam contratos sem entender multas e renovações automáticas
- 💳 Recebem cobranças indevidas e não sabem se são legais
- 💼 Aceitam propostas de trabalho sem clareza sobre direitos
- 🚫 Não sabem o que podem ou não cancelar
- 😰 Têm medo de questionar por não entender

**Resultado:** Prejuízo silencioso de centenas ou milhares de reais.

## ✨ Solução

Uma plataforma web que analisa qualquer documento legal e responde em **5 seções estruturadas**:

1. **📝 Resumo Humano** - O que isso REALMENTE significa
2. **⚠️ Pontos de Atenção** - Riscos, pegadinhas e armadilhas
3. **🎯 O Que Fazer** - Ações práticas que você pode tomar
4. **🚫 O Que NÃO Fazer** - Erros comuns que geram prejuízo
5. **💰 Custo Real** - Quanto você vai pagar DE VERDADE

## 🚀 Características

- ⚡ **Resultado em < 60 segundos**
- 📱 **Interface simples e intuitiva**
- 🔒 **100% privado e criptografado**
- 🆓 **Primeira análise grátis**
- 💳 **Pay-per-use** - Pague só quando precisar
- 📦 **Pacotes e assinaturas** disponíveis
- 🇧🇷 **Focado no Brasil** (CDC, CLT, leis brasileiras)

## 🛠️ Stack Tecnológica

### Frontend
- HTML5, CSS3, JavaScript Vanilla
- Design system premium com CSS Variables
- Responsive & Mobile-first
- PWA-ready

### Backend (Futuro)
- FastAPI (Python)
- PostgreSQL
- Redis (cache)

### IA
- Google Gemini API (análise de documentos)
- Prompts estruturados para consistência

### Pagamentos
- Mercado Pago (Brasil)
- Stripe (internacional)

## 📂 Estrutura do Projeto

```
cleardeal/
├── index.html          # Landing page
├── app.html           # Aplicação de análise
├── pricing.html       # Página de preços
├── styles.css         # Design system
├── landing.css        # Estilos da landing
├── app.css            # Estilos da aplicação
├── pricing.css        # Estilos de pricing
├── app.js             # Lógica principal
├── landing.js         # Interações da landing
├── pricing.js         # Lógica de pricing
└── README.md          # Este arquivo
```

## 🏃 Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/marcos167/CLEARDEAL.git
cd CLEARDEAL

# Opção 1: Serve simples
npx serve . -p 3000

# Opção 2: Python
python -m http.server 3000

# Opção 3: PHP
php -S localhost:3000

# Acesse: http://localhost:3000
```

## 🌐 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Ou conecte o repositório GitHub diretamente no painel da Vercel.

### Outras opções
- Netlify
- GitHub Pages
- Firebase Hosting
- Cloudflare Pages

## 🔑 Configuração de API

Para integrar a análise com IA real:

1. Obtenha uma API key do Google AI Studio: https://makersuite.google.com/app/apikey

2. Adicione ao `app.js` (linha ~98):
```javascript
const GEMINI_API_KEY = 'SUA_API_KEY_AQUI';
```

3. Descomente o bloco de código da API real (linhas 92-103)

## 💰 Modelo de Monetização

### Pay-Per-Use
- Análise Básica: R$ 9
- Análise Detalhada: R$ 19
- Análise Jurídica: R$ 29

### Pacotes
- 5 análises: R$ 35 (30% off)
- 10 análises: R$ 60 (68% off)
- 20 análises: R$ 100 (74% off)

### Assinaturas
- Mensal: R$ 49/mês (15 análises)
- Ilimitado: R$ 99/mês (uso ilimitado)

## 📊 Roadmap

- [x] Landing page premium
- [x] Interface de análise
- [x] Sistema de créditos
- [x] Página de pricing
- [ ] Integração Gemini API
- [ ] Integração Mercado Pago
- [ ] Sistema de autenticação
- [ ] Dashboard de histórico
- [ ] Backend FastAPI
- [ ] OCR para imagens/PDFs
- [ ] Exportação PDF
- [ ] API pública
- [ ] App mobile (PWA)

## ⚖️ Disclaimer Legal

**IMPORTANTE:** ClearDeal é uma ferramenta educacional que traduz documentos legais para linguagem simples. 

❌ **NÃO é consultoria jurídica**  
❌ **NÃO substitui um advogado**  
✅ **É um intérprete de risco cotidiano**

Para questões complexas ou processos legais, sempre consulte um advogado registrado na OAB.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📧 Contato

- Email: contato@cleardeal.com
- Website: [cleardeal.com](https://cleardeal.com)
- GitHub: [@marcos167](https://github.com/marcos167)

---

**Feito com ❤️ para proteger pessoas de contratos abusivos**
