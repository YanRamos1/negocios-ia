# Acompanhamento

Atualizado em: 2026-10-23

Legenda de status: `planejado` → `spec` → `em andamento` → `publicado` → `pausado`

## Board

| # | Projeto | Pasta | Status | Prioridade | Monetização | Próximo passo |
|---|---|---|---|---|---|---|
| 1 | CLT x PJ | `ferramentas/clt-pj` | planejado | P0 | afiliado contabilidade / banco PJ | levantar parâmetros 2026 + testes |
| 2 | Financeiro MEI (planilha) | `produtos/planilhas/financeiro-mei` | planejado | P0 | venda R$27–47 | definir abas e travas |
| 3 | Custo de importação | `ferramentas/custo-importacao` | planejado | P1 | afiliado redirecionador | mapear alíquotas e faixas |
| 4 | Taxa de marketplace | `ferramentas/taxa-marketplace` | planejado | P1 | afiliado ERP/frete | tabela de comissões por categoria |
| 5 | Precificação MEI/artesão | `ferramentas/precificacao-mei` | planejado | P1 | funil p/ planilha | definir modelo de custo |
| 6 | Precificação confeitaria (planilha) | `produtos/planilhas/precificacao-confeitaria` | planejado | P1 | venda R$27–47 | ficha técnica por receita |
| 7 | Rescisão trabalhista | `ferramentas/rescisao` | planejado | P2 | afiliado advocacia/contab. | regras por tipo de desligamento |
| 8 | Fluxo de caixa + DRE | `produtos/planilhas/fluxo-caixa-dre` | planejado | P2 | venda R$37–57 | modelo de categorias |
| 9 | Estoque ABC | `produtos/planilhas/estoque-abc` | planejado | P2 | venda R$47–97 | regras de ponto de pedido |
| 10 | Currículo ATS | `ferramentas/curriculo-ats` | planejado | P2 | versão pro / PDF | formato compatível com ATS |
| 11 | Dashboard e-commerce | `produtos/planilhas/dashboard-ecommerce` | planejado | P2 | venda R$97+ | métricas CMV e margem/SKU |
| 12 | Plano de aula BNCC | `ferramentas/plano-aula-bncc` | planejado | P3 | assinatura | validar campos BNCC |
| 13 | Payback energia solar | `ferramentas/solar-payback` | planejado | P3 | lead para integrador | modelo de tarifa e geração |
| 14 | Templates Notion | `produtos/notion-templates` | planejado | P3 | venda R$19–39 | escolher 2 primeiros |
| 15 | Livros ilustrados | `livros-ilustrados` | planejado | P3 | venda PDF R$19–37 | pipeline de layout 300 DPI |
| 16 | Infra compartilhada | `_infra` | planejado | P0 | — | escolher stack e deploy |

## Log

| Data | Projeto | O que foi feito | Commit |
|---|---|---|---|
| 2026-10-23 | workspace | criação da estrutura, docs e git | inicial |

## Decisões

- **Monorepo.** Um repositório só; se algum projeto crescer, sai como repo próprio depois.
- **Digital only.** Nada de POD, estoque ou frete.
- **Cálculo em código, nunca em LLM.** Teste unitário é pré-requisito para publicar.
- **Imagem gerada por IA:** registrar prompt/modelo em `NOTAS.md` do projeto; preferir modelos de licença comercial (SDXL, FLUX schnell).
- **Sem segredo no repo.** Chaves em `.env` local.

## Métricas (preencher quando publicar)

| Projeto | URL | Acessos/mês | Conversão | Receita/mês |
|---|---|---|---|---|
| — | — | — | — | — |
