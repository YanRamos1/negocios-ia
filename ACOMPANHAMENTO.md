# Acompanhamento

Atualizado em: 2026-10-23

Roadmap vigente: [ROADMAP.md](./ROADMAP.md)

Legenda de status: `planejado` → `spec` → `em andamento` → `publicado` → `pausado`

## Board

| # | Projeto | Pasta | Status | Prioridade | Monetização | Próximo passo |
|---|---|---|---|---|---|---|
| 1 | CLT x PJ | `ferramentas/clt-pj` | publicado | P0 | afiliado contabilidade + planilha PF/PJ | ligar programa de afiliado |
| 2 | Financeiro PF/PJ (planilha) | `produtos/planilhas/financeiro-mei` | em andamento | P0 | venda R$27–47 | versão gratuita no ar; falta checkout |
| 3 | Custo de importação | `ferramentas/custo-importacao` | publicado | P1 | afiliado redirecionador | páginas por produto/faixa |
| 4 | Taxa de marketplace | `ferramentas/taxa-marketplace` | publicado | P1 | afiliado ERP/frete | presets por canal com fonte oficial |
| 5 | Precificação MEI/artesão | `ferramentas/precificacao-mei` | publicado | P1 | funil p/ planilha | páginas por nicho (confeitaria, artesanato) |
| 6 | Precificação confeitaria (planilha) | `produtos/planilhas/precificacao-confeitaria` | em andamento | P1 | venda R$27–47 | versão gratuita no ar; falta checkout |
| 7 | Rescisão trabalhista | `ferramentas/rescisao` | publicado | P2 | afiliado advocacia/contab. | medir e divulgar |
| 8 | Fluxo de caixa + DRE | `produtos/planilhas/fluxo-caixa-dre` | planejado | P2 | venda R$37–57 | modelo de categorias |
| 9 | Estoque ABC | `produtos/planilhas/estoque-abc` | planejado | P2 | venda R$47–97 | regras de ponto de pedido |
| 10 | Currículo ATS | `ferramentas/curriculo-ats` | planejado | P2 | versão pro / PDF | formato compatível com ATS |
| 11 | Dashboard e-commerce | `produtos/planilhas/dashboard-ecommerce` | planejado | P2 | venda R$97+ | métricas CMV e margem/SKU |
| 12 | Plano de aula BNCC | `ferramentas/plano-aula-bncc` | planejado | P3 | assinatura | validar campos BNCC |
| 13 | Payback energia solar | `ferramentas/solar-payback` | planejado | P3 | lead para integrador | modelo de tarifa e geração |
| 14 | Templates Notion | `produtos/notion-templates` | planejado | P3 | venda R$19–39 | escolher 2 primeiros |
| 15 | Livros ilustrados | `livros-ilustrados` | planejado | P3 | venda PDF R$19–37 | pipeline de layout 300 DPI |
| 16 | Infra compartilhada | `_infra` | em andamento | P0 | — | sitemap e segunda ferramenta |
| 17 | Kit Financeiro (isca) | `produtos/printables` | publicado | P1 | isca/download | divulgar nas redes |

## Log

| Data | Projeto | O que foi feito | Commit |
|---|---|---|---|
| 2026-10-23 | workspace | criação da estrutura, docs e git | ee2315e |
| 2026-10-23 | workspace | linhas de produto com Stable Diffusion no backlog | 4900333 |
| 2026-10-23 | clt-pj | auditoria de saída e roadmap por fases | 6488473 |
| 2026-10-23 | clt-pj | motor de cálculo, 27 testes verdes e site estático | ec44a3a |
| 2026-10-23 | clt-pj | deploy no GitHub Pages e smoke test no navegador | 7a157c3 |
| 2026-10-23 | clt-pj | correção do link do índice (base sem barra) | 7d5b8f8 |
| 2026-10-23 | clt-pj | F2: 5 páginas por faixa, sitemap e robots dinâmicos | 539aae4 |
| 2026-10-23 | financeiro-pf-pj | F4: gerador da planilha + 7 testes com fórmulas avaliadas | 6ac200a |
| 2026-10-23 | custo-importacao | calculadora com regras de 12/05/2026, 14 testes e smoke test | cc0cdde |
| 2026-10-23 | custo-importacao | 6 simulações por valor (US$ 30 a 1.000) no sitemap | 07538fa |
| 2026-10-23 | rescisao | calculadora com 4 tipos de desligamento e 11 testes | 8559bcf |
| 2026-10-23 | precificacao-mei | preço com custo, taxa e margem + ponto de equilíbrio, 8 testes | dc4f9c9 |
| 2026-10-23 | taxa-marketplace | comparação de 3 canais com preço mínimo, 7 testes | f3611e3 |
| 2026-10-23 | planilha | landing com download da versão gratuita gerada no CI | 691dd5e |
| 2026-10-23 | workspace | suíte e2e Playwright (17 testes) rodando no CI | f0c043a |
| 2026-10-23 | workspace | typecheck no CI, página 404 e acessibilidade básica | 9551a58 |
| 2026-10-23 | kit | F5: kit imprimível em PDF, landing e isca nas calculadoras | este commit |
| 2026-10-23 | workspace | imagens de compartilhamento (OG 1200x630) por página | a768cec |
| 2026-10-23 | rescisao | 4 páginas por tipo + calculadora pré-preenchida | a5cf605 |
| 2026-10-23 | confeitaria | gerador com 10 testes de fórmula, landing e download gratuito | este commit |

## Decisões

- **Monetização por afiliado/lead, não por anúncio.** Detalhes e métricas em `MONETIZACAO.md`.
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
| CLT x PJ | https://yanramos1.github.io/negocios-ia/clt-pj/ | 0 | — | — |
