# Oferta — Segurança de IA e aplicações

**Preço:** R$ 18.000–45.000 · **Prazo:** 2–4 semanas · **Formato:** relatório + correção assistida.

## Para quem

Empresa que já usa LLM em produto ou processo, ou que vai assinar contrato/auditoria e
precisa provar controle.

## Escopo padrão

1. **Revisão de aplicação** — autenticação, autorização, segredo, upload, SSRF, injeção.
2. **Revisão específica de LLM**
   - prompt injection direta e indireta (documento envenenado);
   - ferramentas com permissão demais e exfiltração por saída;
   - PII e segredo em prompt, log e retenção do provedor;
   - ausência de limite de custo, timeout e rate limit;
   - dependência de modelo sem fallback.
3. **Teste de abuso** — 20 a 30 cenários executados, com evidência.
4. **Relatório em duas camadas** — executivo (risco e prioridade) e técnico (reprodução e correção).
5. **Sessão de correção** — 2 horas com o time para priorizar o backlog.

## Critério de aceite

- Cada achado tem severidade, impacto, evidência e correção sugerida.
- Nenhum falso positivo sem marcação explícita.
- Relatório aceito como evidência por auditoria ou cliente corporativo.

## Não inclui

- Teste de intrusão em infraestrutura de terceiros sem autorização escrita.
- Engenharia social e teste físico.
- Correção implementada (pode ser fase 2, com escopo próprio).
- Certificação formal (ISO/SOC).

## Limite legal e ético

Só executamos teste com autorização assinada e escopo delimitado. Nada de varredura fora do
ambiente acordado. Achado crítico é comunicado em 24h, antes do relatório.
