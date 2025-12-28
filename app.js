// ClearDeal - Core Application Logic
// "Entenda exatamente o que você está aceitando"

// ============================================
// STATE MANAGEMENT
// ============================================

const AppState = {
    credits: 1, // 1 free analysis
    currentContext: 'contrato',
    currentInputType: 'text',
    documentContent: '',
    lastAnalysis: null,

    // Payment tracking
    usedFreeAnalysis: localStorage.getItem('cleardeal_used_free') === 'true',
    purchasedCredits: parseInt(localStorage.getItem('cleardeal_credits') || '0'),

    init() {
        if (this.usedFreeAnalysis) {
            this.credits = this.purchasedCredits;
        }
        this.updateCreditsDisplay();
    },

    updateCreditsDisplay() {
        const creditsCount = document.getElementById('creditsCount');
        if (creditsCount) {
            if (this.credits === 1 && !this.usedFreeAnalysis) {
                creditsCount.textContent = '1 grátis';
            } else if (this.credits === 0) {
                creditsCount.textContent = '0 (comprar)';
                creditsCount.style.color = 'var(--color-danger)';
            } else {
                creditsCount.textContent = this.credits;
            }
        }
    },

    useCredit() {
        if (this.credits > 0) {
            this.credits--;
            if (!this.usedFreeAnalysis) {
                this.usedFreeAnalysis = true;
                localStorage.setItem('cleardeal_used_free', 'true');
            } else {
                this.purchasedCredits--;
                localStorage.setItem('cleardeal_credits', this.purchasedCredits.toString());
            }
            this.updateCreditsDisplay();
            return true;
        }
        return false;
    },

    addCredits(amount) {
        this.purchasedCredits += amount;
        this.credits += amount;
        localStorage.setItem('cleardeal_credits', this.purchasedCredits.toString());
        this.updateCreditsDisplay();
    }
};

// ============================================
// AI ANALYSIS ENGINE
// ============================================

const AnalysisEngine = {
    // FIXED STRUCTURED PROMPT - Garante saída consistente
    buildPrompt(documentText, context) {
        const contextMap = {
            'contrato': 'contrato de serviço ou produto',
            'cobranca': 'cobrança ou fatura',
            'assinatura': 'assinatura recorrente',
            'trabalho': 'proposta de trabalho ou contrato PJ',
            'termo': 'termo de uso ou política',
            'outro': 'documento jurídico'
        };

        return `Você é um especialista em análise de documentos legais para pessoas comuns no Brasil. Sua missão é traduzir juridiquês para português claro.

DOCUMENTO TIPO: ${contextMap[context] || 'documento'}

DOCUMENTO:
"""
${documentText}
"""

IMPORTANTE: Responda EXATAMENTE neste formato JSON estruturado:

{
  "risco": "baixo|medio|alto",
  "risco_mensagem": "Uma frase curta explicando o nível de risco",
  "resumo": "Parágrafo explicando em português MUITO simples o que o documento significa. Como se explicasse para alguém sem formação jurídica. Use exemplos práticos.",
  "pontos_atencao": [
    "Ponto de risco 1 (específico, direto, sem juridiquês)",
    "Ponto de risco 2",
    "Ponto de risco 3"
  ],
  "pode_fazer": [
    "Ação prática 1 que a pessoa pode tomar",
    "Ação prática 2",
    "Ação prática 3"
  ],
  "nao_fazer": [
    "Erro comum 1 que gera prejuízo",
    "Erro comum 2",
    "Erro comum 3"
  ],
  "custo_real": "Análise de quanto a pessoa vai pagar DE VERDADE, incluindo taxas ocultas, juros, multas potenciais. Se não for aplicável, explique as implicações financeiras gerais."
}

REGRAS OBRIGATÓRIAS:
1. Use APENAS português claro, sem termos jurídicos complexos
2. Seja específico sobre NÚMEROS e VALORES quando houver
3. Identifique RENOVAÇÃO AUTOMÁTICA, MULTAS, TAXAS OCULTAS
4. Dê exemplos concretos de quanto a pessoa pode perder
5. Seja direto e prático
6. Não prometa consultoria jurídica - use linguagem probabilística ("geralmente", "pode", "tende a")
7. Cite artigos do CDC quando aplicável mas explique em português claro

Responda APENAS com o JSON, sem texto adicional.`;
    },

    async analyze(documentText, context) {
        // PLACEHOLDER: Aqui você colocará a integração com Gemini API
        // Por enquanto, retorna exemplo estruturado

        try {
            // Simulação de API call (remova quando integrar Gemini de verdade)
            await this.simulateAPIDelay();

            // EXEMPLO de resposta estruturada
            const mockResponse = this.getMockAnalysis(context);

            // TODO: Substituir por chamada real à Gemini API:
            /*
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  parts: [{ text: this.buildPrompt(documentText, context) }]
                }]
              })
            });
            
            const data = await response.json();
            const jsonText = data.candidates[0].content.parts[0].text;
            const analysis = JSON.parse(jsonText);
            */

            return mockResponse;

        } catch (error) {
            console.error('Erro na análise:', error);
            throw new Error('Não foi possível analisar o documento. Tente novamente.');
        }
    },

    async simulateAPIDelay() {
        // Simula tempo de processamento da IA
        return new Promise(resolve => setTimeout(resolve, 3000));
    },

    getMockAnalysis(context) {
        // MOCK para demonstração - remover quando integrar API real
        const mocks = {
            'contrato': {
                risco: 'alto',
                risco_mensagem: 'Este contrato tem cláusulas que podem te prender por muito tempo',
                resumo: 'Você está aceitando um contrato de 12 meses com renovação automática. Se você não cancelar com 30 dias de antecedência, vai pagar mais 12 meses automaticamente. Tem multa de 40% do valor restante se cancelar antes.',
                pontos_atencao: [
                    '🚨 Renovação automática: Se você não cancelar 30 dias ANTES do fim, continua pagando por mais 12 meses',
                    '💰 Multa de cancelamento: 40% de todo o período restante (pode dar R$ 500-2.000)',
                    '⚠️ Reajuste não especificado: O contrato não fala como vai ser o aumento de preço',
                    '📅 Prazo de arrependimento: Você só tem 7 dias para cancelar sem custos (CDC Art. 49)'
                ],
                pode_fazer: [
                    '✅ Aceitar se você TEM CERTEZA que vai usar por pelo menos 12 meses',
                    '✅ Negociar um período menor (6 meses) ou sem multa de cancelamento',
                    '✅ Pedir por escrito como funciona o reajuste de preço',
                    '📸 Guardar o contrato completo e prints das conversas como prova',
                    '⏰ Colocar ALARME para 11 meses depois para decidir se cancela ou não'
                ],
                nao_fazer: [
                    '❌ NÃO assine achando que pode cancelar quando quiser sem custo',
                    '❌ NÃO ignore a data de renovação - pode custar muito caro',
                    '❌ NÃO aceite reajustes abusivos sem questionar (CDC protege você)',
                    '❌ NÃO cancele apenas por telefone - sempre peça protocolo por escrito'
                ],
                custo_real: 'Valor mensal aparente: R$ 99/mês. Custo REAL mínimo: R$ 1.188 (12 meses). Se cancelar no 6º mês: R$ 594 (6 meses pagos) + R$ 237,60 (multa de 40% sobre 6 meses restantes) = R$ 831,60 total. Com renovação automática esquecida: mais R$ 1.188. Total de risco: até R$ 2.419,60.'
            },
            'cobranca': {
                risco: 'medio',
                risco_mensagem: 'Cobrança com valores que precisam ser verificados',
                resumo: 'É uma cobrança de R$ 149,90 por um serviço que você pode não ter contratado. Tem "taxa de manutenção" e "multa por atraso" que podem ser abusivas.',
                pontos_atencao: [
                    '🔍 Verifique se você realmente contratou este serviço',
                    '💸 "Taxa de manutenção" de R$ 29,90 - pode ser abusiva se não estava no contrato original',
                    '⚠️ Juros de 2% ao mês (24% ao ano) - acima do CDC recomendado'
                ],
                pode_fazer: [
                    '✅ Pedir detalhamento completo da cobrança por escrito',
                    '✅ Verificar seus emails e contratos se você realmente aceitou isso',
                    '✅ Se for indevida, contestar por escrito no prazo de 30 dias',
                    '✅ Registrar reclamação no Procon ou Consumidor.gov.br'
                ],
                nao_fazer: [
                    '❌ NÃO pague sem verificar se é legítima',
                    '❌ NÃO ignore - pode virar dívida ou negativação',
                    '❌ NÃO aceite parcelamento sem negociar desconto'
                ],
                custo_real: 'Valor base: R$ 149,90. Se atrasar 1 mês: +R$ 3,00 (juros) + até R$ 29,90 (multa) = R$ 182,80. Se continuar pagando sem questionar: R$ 1.798,80/ano.'
            },
            'assinatura': {
                risco: 'alto',
                risco_mensagem: 'Assinatura com renovação automática e difícil cancelamento',
                resumo: 'Você está aceitando pagar R$ 49,90 todo mês automaticamente no seu cartão. Para cancelar, precisa avisar com 10 dias de antecedência, senão cobra mais um mês.',
                pontos_atencao: [
                    '💳 Débito automático: Vai sair do seu cartão TODO MÊS até você cancelar',
                    '⏰ Cancelamento: Precisa pedir 10 dias ANTES da data de cobrança',
                    '🚫 Difícil cancelar: Não tem botão, precisa falar com atendente'
                ],
                pode_fazer: [
                    '✅ Configurar alerta mensal para revisar se ainda quer',
                    '✅ Cancelar pelo SAC (guardar protocolo)',
                    '✅ Se negarem, cancelar pelo banco/cartão diretamente'
                ],
                nao_fazer: [
                    '❌ NÃO deixe cobrando se não está usando',
                    '❌ NÃO confie só no cancelamento verbal - peça email/protocolo'
                ],
                custo_real: 'R$ 49,90/mês = R$ 598,80/ano. Se esquecer cancelando: pode pagar por meses/anos sem usar.'
            }
        };

        return mocks[context] || mocks['contrato'];
    }
};

// ============================================
// UI INTERACTIONS
// ============================================

const UI = {
    init() {
        this.setupTabs();
        this.setupContextButtons();
        this.setupFileUpload();
        this.setupTextInput();
        this.setupAnalyzeButton();
        this.setupResultActions();
    },

    setupTabs() {
        const tabs = document.querySelectorAll('.input-tab');
        const panels = document.querySelectorAll('.input-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active states
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                const panelId = tab.dataset.tab + 'Panel';
                document.getElementById(panelId)?.classList.add('active');

                AppState.currentInputType = tab.dataset.tab;
            });
        });
    },

    setupContextButtons() {
        const buttons = document.querySelectorAll('.context-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                AppState.currentContext = btn.dataset.context;
            });
        });
    },

    setupFileUpload() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        const filePreview = document.getElementById('filePreview');

        // Click to upload
        uploadZone.addEventListener('click', () => fileInput.click());

        // Drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragging');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragging');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragging');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    },

    setupTextInput() {
        const textarea = document.getElementById('documentText');
        const charCount = document.getElementById('charCount');

        textarea.addEventListener('input', (e) => {
            const count = e.target.value.length;
            charCount.textContent = count.toLocaleString('pt-BR');
            AppState.documentContent = e.target.value;
        });
    },

    setupAnalyzeButton() {
        const btn = document.getElementById('analyzeBtn');

        btn.addEventListener('click', async () => {
            await this.analyzeDocument();
        });
    },

    setupResultActions() {
        const newAnalysisBtn = document.getElementById('newAnalysisBtn');
        const saveBtn = document.getElementById('saveBtn');
        const shareBtn = document.getElementById('shareBtn');
        const buyOneBtn = document.getElementById('buyOneBtn');

        newAnalysisBtn?.addEventListener('click', () => {
            this.showUploadSection();
        });

        saveBtn?.addEventListener('click', () => {
            this.saveAnalysis();
        });

        shareBtn?.addEventListener('click', () => {
            this.shareAnalysis();
        });

        buyOneBtn?.addEventListener('click', () => {
            window.location.href = 'pricing.html';
        });
    },

    async handleFile(file) {
        const fileName = file.name;
        const fileSize = (file.size / 1024).toFixed(2) + ' KB';

        const preview = document.getElementById('filePreview');
        preview.innerHTML = `
      <div class="file-preview-item">
        <div class="file-icon">📄</div>
        <div class="file-info">
          <div class="file-name">${fileName}</div>
          <div class="file-size">${fileSize}</div>
        </div>
        <button class="file-remove" onclick="UI.removeFile()">×</button>
      </div>
    `;
        preview.classList.add('active');

        // Read file content
        const reader = new FileReader();
        reader.onload = (e) => {
            AppState.documentContent = e.target.result;
        };
        reader.readAsText(file);
    },

    removeFile() {
        document.getElementById('filePreview').classList.remove('active');
        document.getElementById('fileInput').value = '';
        AppState.documentContent = '';
    },

    async analyzeDocument() {
        // Validations
        if (!AppState.documentContent || AppState.documentContent.trim().length < 50) {
            alert('Por favor, insira um documento com pelo menos 50 caracteres.');
            return;
        }

        if (AppState.credits === 0) {
            if (confirm('Você não tem análises disponíveis. Deseja comprar mais?')) {
                window.location.href = 'pricing.html';
            }
            return;
        }

        // Show loading
        this.showLoading();

        try {
            // Analyze with AI
            const analysis = await AnalysisEngine.analyze(
                AppState.documentContent,
                AppState.currentContext
            );

            // Use credit
            AppState.useCredit();

            // Store analysis
            AppState.lastAnalysis = analysis;

            // Display results
            this.displayResults(analysis);

            // Hide loading
            this.hideLoading();

            // Show result section
            this.showResultSection();

        } catch (error) {
            this.hideLoading();
            alert('Erro ao analisar documento: ' + error.message);
        }
    },

    displayResults(analysis) {
        // Risk banner
        const riskBanner = document.getElementById('riskBanner');
        const riskLevel = document.getElementById('riskLevel');
        const riskMessage = document.getElementById('riskMessage');

        riskBanner.className = 'risk-banner ' + analysis.risco;
        riskLevel.textContent = analysis.risco.charAt(0).toUpperCase() + analysis.risco.slice(1);
        riskMessage.textContent = analysis.risco_mensagem;

        // 1. Resumo
        document.getElementById('resumoContent').innerHTML = `<p>${analysis.resumo}</p>`;

        // 2. Pontos de Atenção
        const atencaoList = document.getElementById('atencaoList');
        atencaoList.innerHTML = analysis.pontos_atencao
            .map(item => `<li>${item}</li>`)
            .join('');

        // 3. O que pode fazer
        const acoesListPode = document.getElementById('acoesListpode');
        acoesListPode.innerHTML = analysis.pode_fazer
            .map(item => `<li>${item}</li>`)
            .join('');

        // 4. O que NÃO fazer
        const acoesListNao = document.getElementById('acoesListnao');
        acoesListNao.innerHTML = analysis.nao_fazer
            .map(item => `<li>${item}</li>`)
            .join('');

        // 5. Custo Real
        document.getElementById('custoContent').innerHTML = `<p>${analysis.custo_real}</p>`;

        // Show/hide more CTA based on credits
        const moreCTA = document.getElementById('moreCTA');
        if (AppState.credits === 0) {
            moreCTA.style.display = 'block';
        } else {
            moreCTA.style.display = 'none';
        }
    },

    showLoading() {
        document.getElementById('loadingModal').classList.remove('hidden');
    },

    hideLoading() {
        document.getElementById('loadingModal').classList.add('hidden');
    },

    showResultSection() {
        document.getElementById('uploadSection').classList.add('hidden');
        document.getElementById('resultSection').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    showUploadSection() {
        document.getElementById('resultSection').classList.add('hidden');
        document.getElementById('uploadSection').classList.remove('hidden');

        // Clear inputs
        document.getElementById('documentText').value = '';
        AppState.documentContent = '';
        this.removeFile();
    },

    saveAnalysis() {
        if (!AppState.lastAnalysis) return;

        // Save to localStorage (future: save to backend)
        const saved = JSON.parse(localStorage.getItem('cleardeal_history') || '[]');
        saved.unshift({
            date: new Date().toISOString(),
            context: AppState.currentContext,
            analysis: AppState.lastAnalysis
        });

        // Keep last 10
        if (saved.length > 10) saved.pop();

        localStorage.setItem('cleardeal_history', JSON.stringify(saved));

        alert('✅ Análise salva com sucesso!');
    },

    shareAnalysis() {
        // Simple share - copy summary to clipboard
        if (!AppState.lastAnalysis) return;

        const text = `ClearDeal - Análise\n\n${AppState.lastAnalysis.resumo}\n\nRisco: ${AppState.lastAnalysis.risco}\n\nAnalise seus documentos em: [URL]`;

        navigator.clipboard.writeText(text).then(() => {
            alert('📋 Resumo copiado para área de transferência!');
        }).catch(() => {
            alert('Não foi possível copiar. Tente novamente.');
        });
    }
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    AppState.init();
    UI.init();

    console.log('🔍 ClearDeal initialized');
    console.log('Credits available:', AppState.credits);
});

// Export for external use
window.AppState = AppState;
window.UI = UI;
