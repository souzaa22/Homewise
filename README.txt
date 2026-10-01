# HomeWise — Site em HTML, CSS e JavaScript

## Como abrir no VS Code
1. Extraia a pasta.
2. Abra a pasta `HomeWise_Site` no VS Code.
3. Abra `index.html` com Live Server (recomendado) ou diretamente no navegador.

## Telas
- index.html — Início
- como-funciona.html — Como funciona
- depoimentos.html — Depoimentos
- sobre.html — Sobre Nós
- precos.html — Preços
- faq.html — Perguntas frequentes

## Funcionalidades
- Navegação entre várias páginas.
- FAQ com abertura/fechamento em JavaScript.
- Botões de escolha de plano que abrem o checkout.
- Checkout com validação de formato dos dados e opções Pix/cartão via provedor.
- Botões de download com aviso.
- Botão de suporte com modal.
- Layout responsivo para celular e desktop.
- Visual escuro com azul/verde inspirado nos mockups enviados.

## Pagamentos reais
O checkout envia os dados para `POST /api/checkout` e espera receber `{ "checkoutUrl": "https://..." }`.
Esse endpoint ainda precisa ser implementado no servidor com um provedor de pagamentos. Ele deve validar os dados do cliente, buscar o preço pelo identificador do plano no servidor e criar a cobrança/sessão no provedor. Nunca coloque credenciais do provedor no HTML ou JavaScript do navegador. Sem essa API, nenhuma cobrança é realizada.
