# Oferta — Agente em produção

**Preço:** R$ 35.000–90.000 · **Prazo:** 4–8 semanas · **Formato:** escopo fechado por fase.

## Para quem

Empresa com processo caro e repetitivo (documento, atendimento, triagem) que quer sistema
rodando, com dono e métrica — não demo.

## Entregáveis

1. **Especificação de comportamento** — o que o agente faz, o que recusa, o que escala para
   humano, com exemplos.
2. **Pipeline** — ingestão, recuperação, ferramentas com allowlist, limites de custo e timeout.
3. **Suíte de avaliação** — conjunto de casos versionado, métrica (acerto, citação correta,
   recusa segura) e relatório antes/depois.
4. **Observabilidade** — log estruturado, custo por execução, alerta de erro e de deriva.
5. **Deploy e handover** — infra como código, runbook e sessão de transferência gravada.
6. **Documentação** — arquitetura, decisões e como trocar de modelo sem reescrever.

## Critério de aceite

- A suíte de avaliação atinge o número combinado no contrato, medido no ambiente do cliente.
- Custo por execução dentro do teto definido.
- O time do cliente roda o sistema sem você por 30 dias.
- Nenhum dado sensível em log ou prompt de terceiro sem controle.

## Não inclui

- Modelo treinado do zero (salvo fase separada).
- Suporte 24/7.
- Substituição do time do cliente.
- Garantia de resultado de negócio (receita), só de comportamento medido.

## Fases

| Fase | Entrega | % do valor |
|---|---|---|
| 1. Especificação + eval | casos e critério congelados | 25% |
| 2. Build | pipeline e ferramentas | 40% |
| 3. Endurecimento | segurança, custo, observabilidade | 20% |
| 4. Handover | runbook, treinamento, 30 dias de garantia | 15% |
