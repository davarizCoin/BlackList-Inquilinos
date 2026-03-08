# Black Lista Home 🕵️‍♂️🏠

O **Black Lista Home** é um sistema B2B (Mínimo Produto Viável) projetado para **proteger o patrimônio de imobiliárias e proprietários** através da análise de crédito, comportamento e dados antifraude de potenciais inquilinos.

## 🚀 Funcionalidades (Features)

*   🔍 **Dashboard Multi-Fonte (KYC & Background Check):**
    *   **Base de Imobiliárias:** Consulta uma base de dados colaborativa (simulada) de maus inquilinos.
    *   **Busca Extra-Judicial:** Varredura em processos (ex: Ações de Despejo) nos diários oficiais dos Tribunais (TJSP, TJPR, etc).
    *   **Birôs de Crédito:** Verificação de nome sujo e dívidas ativadas (Simulação de SPC/Serasa/BoaVista).
    *   **Biometria & KYC:** Validação antifraude mostrando Alertas Telefônicos (muitos números em pouco tempo) e Alertas de Domicílio, além de checagem de filiação.
*   🚦 **Motor de Risco:** Algoritmo visual que classifica o prospecto automaticamente como "ALTO RISCO" ou "NADA CONSTA" baseado na gravidade dos apontamentos encontrados.
*   📝 **Canal de Denúncias:** Formulário passo-a-passo para imobiliárias e proprietários enviarem relatos detalhados de danos ou inadimplência, permitindo anexo de provas e links de vídeo.
*   🔐 **Cofre Administrativo:** Painel de moderação para administradores avaliarem ("Aprovar" ou "Rejeitar") as denúncias recebidas antes que elas se tornem públicas na plataforma colaborativa.

## 💻 Tecnologias Utilizadas

*   **Frontend:** React (Vite)
*   **Estilização:** Tailwind CSS
*   **Roteamento:** React Router DOM
*   **Ícones:** Lucide React
*   **Dados:** Simulação Local (Mocks robustos com `setTimeout` para emular chamadas assíncronas de API)

*Nota de Produto: O sistema foi projetado inicialmente para integração com Supabase (Banco de Dados em Nuvem) e Telegram Bots para notificações em tempo real. No formato atual de MVP de demonstração local, as integrações externas foram desacopladas para garantir que a aplicação rode 100% no navegador (Localhost) sem telas de erro.*

## 🛠️ Como Executar na sua Máquina Local (Localhost)

Pré-requisito: Node.js instalado na máquina.

1.  Clone o repositório ou baixe a pasta.
2.  Abra o terminal na pasta do projeto e instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4.  Abra o navegador no endereço indicado (geralmente `http://localhost:5173`).

## 🧪 Casos de Teste Sugeridos (Mock Data)

Para visualizar as funcionalidades em ação, sugerimos as seguintes simulações:

*   **Busca - Inquilino de Alto Risco (Fraude + Despejo):** Digite o CPF **`123.123.123-89`** (ou apenas `12312312389`) na busca. Aparecerão processos no TJSP, dívidas altas e alertas vermelhos de KYC (troca suspeita de telefones).
*   **Busca - Inquilino de Score Prejudicado:** Digite o CPF **`456.456.456-00`** na busca. Aparecerão processos no TJPR (condomínio em atraso) e alertas laranjas de mudança de domicílio.
*   **Área de Logins Administrativa:**
    *   Rota: `/admin`
    *   **Usuário:** `davariz`
    *   **Senha Master:** `garanhao77`

## ⚖️ Conformidade LGPD
O projeto Black Lista Home opera estritamente focando na análise de Risco de Crédito e Proteção ao Crédito em Operações Imobiliárias, sendo estas hipóteses válidas de tratamento de dados sob a LGPD no Brasil para entidades imobiliárias sob termo de uso.
