# Acompanhamento

Atualizado em: 2026-10-23

Roadmap vigente: [ROADMAP.md](./ROADMAP.md)

Legenda de status: `planejado` → `spec` → `em andamento` → `publicado` → `pausado`

## Board

| # | Projeto | Pasta | Status | Prioridade | Monetização | Próximo passo |
|---|---|---|---|---|---|---|
| 1 | CLT x PJ | `ferramentas/clt-pj` | spec | P0 | afiliado contabilidade + planilha PF/PJ | F0: montar infra e template |
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
| 2026-10-23 | workspace | criação da estrutura, docs e git | ee2315e |
| 2026-10-23 | workspace | linhas de produto com Stable Diffusion no backlog | 4900333 |
| 2026-10-23 | clt-pj | auditoria de saída e roadmap por fases | este commit |

## Decisões

- **Primeira saída: CLT x PJ.** Score 34/40 na matriz do ROADMAP; planilha PF/PJ é a monetização e custo de importação é a segunda ferramenta.
- **SD é isca, não produto.** Pack gratuito de printables para captura de e-mail; venda só depois de haver lista.
- **Serviço só como caixa de emergência.** Retrato pet e automação PME ficam congelados até decisão em contrário.
- **Monorepo.** Um repositório só; se algum projeto crescer, sai como repo próprio depois.
- **Digital only.** Nada de POD, estoque ou frete.
- **Cálculo em código, nunca em LLM.** Teste unitário é pré-requisito para publicar.
- **Imagem gerada por IA:** registrar prompt/modelo em `NOTAS.md` do projeto; preferir modelos de licença comercial (SDXL, FLUX schnell).
- **Sem segredo no repo.** Chaves em `.env` local.

## Métricas (preencher quando publicar)

| Projeto | URL | Acessos/mês | Conversão | Receita/mês |
|---|---|---|---|---|
| — | — | — | — | — |
