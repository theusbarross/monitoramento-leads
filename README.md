# 📊 Monitoramento de Clientes (Leads)

![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-success)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-5-yellow)

## 📌 Descrição do Projeto

Este projeto é um painel de **Monitoramento de Clientes (Leads)** desenvolvido para oferecer uma interface moderna, rápida e responsiva na análise de dados. Ele se integra de forma transparente a uma planilha do **Google Sheets** via API, buscando informações de leads em tempo real para exibi-los em um dashboard de forma organizada. 

## 🚀 Como foi feito? (Tecnologias Utilizadas)

O projeto foi construído utilizando tecnologias modernas voltadas a uma excelente experiência de usuário e desenvolvimento:

- **React:** Biblioteca para a construção de interfaces interativas e componetizadas.
- **TypeScript:** Adição de tipagem estática ao JavaScript para maior robustez do código e autocompletar na IDE.
- **Vite:** Ferramenta de build extremamente rápida que agiliza o desenvolvimento.
- **CSS Modules:** Utilizado para estilização limpa, escopada, sem conflitos entre classes.
- **Google Sheets API:** Integração leve para alimentar a plataforma diretamente com os dados estruturados pelo cliente.

O desenvolvimento focou em componentização inteligente (como `MetricCard`), uso de *hooks* customizados (como `useLeadsData`) para gerenciar as requisições, e boas práticas em UI/UX com CSS vanilla voltado a micro-interações, cores harmônicas e *glassmorphism*.

## 📂 Apresentação

- **Dashboard Integrado:** Visualize facilmente todos os novos leads atualizados diretamente do seu Google Sheets.
- **Interface Premium:** Design fluido com animações e estado de carregamento elegantes.
- **Separação de Responsabilidades:** O projeto separa a chamada de serviço (`sheetsService.ts`) e o controle de estado e repetição de chamadas (`useLeadsData.ts`).
- **Seguro:** Sem chaves fixas no código, operando inteiramente via variáveis de ambiente (`.env`).

## 🛠️ Como clonar e rodar o projeto localmente?

### 1. Pré-requisitos
- Node.js (versão 18+ recomendada)
- NPM, Yarn ou PNPM instalados
- Uma planilha do Google Sheets com aba chamada "Leads" e suas credenciais de API do Google Cloud

### 2. Clonando o Repositório

No seu terminal, digite o seguinte comando:

```bash
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
```

Navegue até a pasta do projeto:

```bash
cd NOME_DO_REPOSITORIO
```

### 3. Instalando as Dependências

```bash
npm install
# ou
yarn install
```

### 4. Configurando Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto contendo as seguintes chaves da sua planilha do Google Sheets:

```env
VITE_GOOGLE_SHEETS_API_KEY=sua_chave_api_aqui
VITE_SPREADSHEET_ID=seu_id_da_planilha_aqui
```

### 5. Executando o Projeto

```bash
npm run dev
# ou
yarn dev
```

O servidor local iniciará (normalmente em `http://localhost:5173`). Abra o link no seu navegador para ver o dashboard em ação!
