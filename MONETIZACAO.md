# Monetização — afiliado e lead

Modelo escolhido: **afiliado/lead**, não anúncio. Anúncio em site sem audiência rende
centavos e exige aprovação; afiliado paga por intenção.

## Dois blocos, um por objetivo

| Bloco | Papel | Onde aparece |
|---|---|---|
| `afiliadoPrincipal` | receita por clique/lead qualificado | abaixo do resultado da calculadora |
| `capturaLead` | captura de e-mail ou conversa | abaixo do resultado, secundário |

Ambos vivem em `src/config/monetizacao.ts` e ficam **desligados** (`null`) até existir URL real.
O componente `Oferta.astro` não renderiza nada vazio — nada de link inventado ou placeholder no ar.

## O que preencher, na ordem

1. **Programa de afiliado de contabilidade ou banco PJ.**
   Cadastrar em redes self-service (Hotmart, AfilioPay, Eduzz) em ofertas de "abrir CNPJ" /
   "conta PJ", ou no programa de parceiros do próprio escritório.
   Preencher `afiliadoPrincipal` com título, texto, CTA e URL com identificador.
2. **Isca/lead.**
   Pode ser uma landing do parceiro, um formulário próprio ou um link de WhatsApp com
   mensagem pronta. Preencher `capturaLead`.
3. **Medir.**
   Sem medição não há otimização: usar parâmetros UTM na URL e conferir no painel do parceiro.

## Regras que evitam problema

- Todo link de afiliado com `rel="sponsored noopener"` e `target="_blank"` (já no componente).
- Aviso de transparência visível quando houver link (já no componente).
- Nunca prometer economia ou resultado garantido — o resultado da calculadora é estimativa.
- Oferta nunca acima do resultado: o número primeiro, a oferta depois.

## Métricas que decidem o próximo passo

| Métrica | Alvo inicial | Se abaixo |
|---|---|---|
| CTR do bloco de afiliado | 3% dos que calculam | ajustar texto e posição |
| Conversão do lead | 5% dos cliques | revisar oferta e página do parceiro |
| Receita por 1.000 visitas | > R$ 10 | trocar de programa antes de trocar de ferramenta |
