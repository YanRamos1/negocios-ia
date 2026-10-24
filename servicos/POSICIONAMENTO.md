# Posicionamento — engenharia com IA e segurança

## Tese

Não vender "consultoria de IA". Vender **sistema funcionando com prova**, em duas frentes:

1. **Engenharia de IA**: colocar agente/automação em produção com avaliação, observabilidade
   e handover — o oposto do protótipo que morre no notebook.
2. **Segurança de IA e de aplicações**: revisar o que já existe e blindar o que usa LLM.

O que sustenta o preço não é o modelo: é **eval, guardrail, trilha de auditoria e
documentação**. Qualquer um gera um chatbot; poucos entregam um sistema que sobrevive ao
terceiro mês.

## Por que vende em 2026–2027

- Empresas já testaram IA e têm PoCs paradas. O orçamento migrou de "explorar" para
  "colocar em produção e não vazar dado".
- Segurança de aplicações com LLM virou item de auditoria: prompt injection, exfiltração via
  ferramentas, PII em log e custo descontrolado de token. Quase ninguém no mercado brasileiro
  entrega isso com método.
- Regulação (LGPD + pressão do AI Act para quem exporta) transforma "governança de IA" em
  exigência contratual, não em discurso.

## Cliente ideal

| Critério | Ideal | Evitar |
|---|---|---|
| Porte | 30–500 funcionários | MEI e microempresa |
| Time | tem dev interno, mas sem prática de IA/segurança | empresa sem ninguém técnico |
| Dor | processo caro e repetitivo, ou auditoria/incidente | "queremos usar IA porque sim" |
| Decisor | sócio, CTO, head de operações | estagiário pesquisando preço |
| Setor | jurídico, contábil, saúde, fintech, indústria, software house | varejo de balcão |

## Onde a IA atua de verdade (e onde não)

**Funciona**
- Backoffice com documento: contratos, laudos, notas, licitações. RAG com eval e citação.
- Atendimento e qualificação com handoff humano e limite de custo por conversa.
- Engenharia de software: migração, teste, documentação e revisão em escala.
- Triagem de alerta de segurança e redação de relatório a partir de evidência.

**Não vender assim**
- "Consultoria de IA" sem entregável verificável.
- Chatbot sem avaliação, sem fallback e sem dono.
- Prompt engineering avulso.
- Automação de scraping frágil que quebra em duas semanas.
- Substituir decisão humana em crédito, saúde ou jurídico.

## Ofertas

| Oferta | Duração | Preço | Papel no funil |
|---|---|---|---|
| Diagnóstico de IA | 1–2 semanas | R$ 6.000–12.000 | porta de entrada, creditável no projeto |
| Agente em produção | 4–8 semanas | R$ 35.000–90.000 | projeto principal |
| Segurança de IA e aplicações | 2–4 semanas | R$ 18.000–45.000 | projeto principal, ciclo mais curto |
| Retainer de evolução | mensal | R$ 8.000–20.000 | recorrência |
| Workshop para time | 2 dias | R$ 12.000–25.000 | relacionamento e upsell |

Preço âncora em **hora técnica de R$ 400–600**. Abaixo de R$ 250/h o projeto não paga o
tempo de venda, suporte e retrabalho.

## Funil

```
isca técnica gratuita (checklist/CLI de diagnóstico)
  → diagnóstico pago (1–2 semanas)
    → projeto (agente ou segurança)
      → retainer
```

A isca não é ebook: é **ferramenta que roda no repositório do cliente** e devolve um relatório.
Isso qualifica melhor que qualquer formulário.

## Provas a construir

1. **CLI de segurança para aplicações com LLM** — varre o repo e aponta segredo em prompt,
   ferramenta sem allowlist, endpoint sem auth, ausência de limite de token. É a isca e a prova.
2. **Kit de avaliação de agente** — conjunto de casos, métrica e relatório antes/depois.
3. **Estudo de caso anonimizado** — custo por atendimento, latência, taxa de acerto, incidentes.

## Métricas comerciais

| Métrica | Meta inicial |
|---|---|
| Propostas por mês | 4 |
| Taxa de fechamento | 25% |
| Ticket médio | R$ 30.000 |
| Tempo de diagnóstico → proposta | 3 dias úteis |
| Receita recorrente após 2 projetos | 1 retainer |

## O que não fazer

- Aceitar escopo aberto ("vamos evoluindo") sem contrato de fase.
- Cobrar por hora sem teto.
- Prometer redução de custo sem medir a linha de base.
- Assinar NDA que impede portfólio sem contrapartida.
