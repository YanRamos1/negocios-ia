# Roadmap — primeira saída

## Status em 2026-10-23

| Fase | Situação | Observação |
|---|---|---|
| F0 Fundação | concluída | Astro, testes, deploy no GitHub Pages |
| F1 Motor CLT x PJ | concluída | 27 testes; parâmetros 2026 com fonte |
| F2 Publicação | concluída | 11 páginas de cauda longa, sitemap, robots |
| F3 Monetização | parcial | camada pronta e desligada; falta link de afiliado e provedor de e-mail |
| F4 Produto pago | parcial | duas planilhas geradas e versões gratuitas no ar; falta checkout |
| F5 Isca | concluída | kit em PDF por código (sem SD), ligado nas calculadoras e com OG images |
| F6 Decisão | bloqueada | depende de tráfego e vendas reais |

Extras entregues fora do roadmap original: rescisão, precificação MEI, taxa de marketplace,
páginas por tipo de desligamento e por nicho, typecheck e 32 testes e2e no CI.

## Nova trilha — serviços (a partir de 2026-10-23)

O produto digital (calculadoras, planilhas, kit) passa a ser **portfólio e isca**, não o
centro da receita. A receita principal migra para projeto e prestação de serviço em
**engenharia com IA** e **segurança de IA/aplicações**.

- Posicionamento, ICP e preços: `servicos/POSICIONAMENTO.md`
- Ofertas: `servicos/ofertas/`
- Comercial: `servicos/comercial/PLAYBOOK.md`

Próximo entregável técnico da trilha: **CLI de segurança para aplicações com LLM**, usada
como isca gratuita e prova de competência antes do diagnóstico pago.


## Veredito

**Começar pela calculadora CLT x PJ**, monetizada por afiliado de contabilidade +
planilha "Financeiro PF/PJ". Segunda ferramenta: custo de importação (mesma infra).
Stable Diffusion entra como **isca gratuita** (printable), não como produto principal.

## Matriz de decisão (1–5, soma máx. 40)

| Candidato | Custo baixo | 1ª receita rápida | Demanda | Receita/visita | Defensível | Baixo risco de plataforma | Escala | Alavanca o que já temos | Total |
|---|---|---|---|---|---|---|---|---|---|
| CLT x PJ | 5 | 4 | 5 | 4 | 3 | 4 | 4 | 5 | **34** |
| Custo de importação | 5 | 4 | 5 | 3 | 3 | 4 | 4 | 4 | **32** |
| Automação p/ PME (serviço) | 5 | 3 | 3 | 5 | 4 | 5 | 1 | 5 | **31** |
| Planilha financeiro | 5 | 3 | 3 | 5 | 2 | 5 | 3 | 4 | **30** |
| Stickers/line art (SD) | 4 | 3 | 4 | 2 | 2 | 3 | 5 | 4 | **27** |
| Retrato pet (sob encomenda) | 4 | 4 | 3 | 5 | 2 | 4 | 1 | 3 | **26** |

## Por que

- Produto digital sem audiência não vende; **ferramenta grátis é a forma mais barata de comprar atenção**.
- CLT x PJ tem busca alta e intenção de compra (a pessoa está decidindo abrir CNPJ) — o afiliado de
  contabilidade é self-service, sem parceria B2B.
- Custo marginal ~0: página estática, cálculo determinístico, sem servidor.
- A planilha é a monetização natural do mesmo público, com margem ~100%.
- Serviço (automação/retrato) só se precisarmos de caixa imediato: não escala e não compõe.
- SD produz imagem fácil; distribuir é o difícil. Como isca, ele resolve captação de e-mail —
  e depois o mesmo motor vira produto pago.

## Funil

```
busca no Google
  → calculadora (resultado sem login)
    → e-mail ("PDF com o comparativo completo")
      → oferta da planilha Financeiro PF/PJ
        → afiliado de contabilidade no bloco secundário
```

## Fases

### F0 — Fundação (`_infra`)
- Stack: página estática + módulo de cálculo isolado + Vitest.
- Template da página de calculadora (form, resultado, compartilhar, aviso legal).
- Deploy em Cloudflare Pages, domínio próprio, analytics sem cookie.
- **DoD:** template publicado com uma calculadora de exemplo e CI rodando testes.

### F1 — Motor CLT x PJ (`ferramentas/clt-pj`)
- Parâmetros vigentes em arquivo de dados versionado (não hardcoded no componente).
- Cálculo: INSS, IRRF, FGTS, férias + 1/3, 13º, custo do empregador, Simples com fator R, pró-labore.
- **DoD:** suíte de testes cobrindo faixas, salários de borda e casos de referência; 100% verde.

### F2 — Publicação
- Página principal + páginas de cauda longa (por faixa salarial/situação).
- Metatags, schema FAQ, sitemap, textos explicando a conta (não só o número).
- **DoD:** indexação solicitada, Lighthouse ≥ 90, disclaimer visível.

### F3 — Monetização
- Captura de e-mail (Brevo free) com entrega de PDF gerado por código.
- Blocos de afiliado só abaixo do resultado.
- **DoD:** captura medida, link de afiliado com UTM, e-mail automático entregando o PDF.

### F4 — Produto pago (`produtos/planilhas/financeiro-mei` → versão PF/PJ)
- Planilha gerada por script (openpyxl), não mantida à mão.
- Landing + checkout (Kiwify) + versão gratuita reduzida.
- **DoD:** primeira venda real; entrega automática; nenhum suporte manual necessário.

### F5 — Isca com SD (`produtos/assets-ia`)
- ComfyUI + pipeline de lote, curadoria, recorte e PDF.
- Pack de printables gratuito ligado à captura de e-mail.
- **DoD:** pack publicado, taxa de captura comparada com a do PDF.

### F6 — Decisão
- Ler métricas e escolher: dobrar em ferramentas, em produto pago ou em SD.
- **DoD:** decisão registrada no ACOMPANHAMENTO com os números que a sustentam.

## Gates (por métrica, não por data)

| Gate | Critério | Se falhar |
|---|---|---|
| G1 (fim F1) | testes verdes, zero cálculo hardcoded | não publica |
| G2 (fim F3) | captura ≥ 3% e página indexada | revisar oferta antes de construir F4 |
| G3 (F4) | ≥ 1 venda/semana | não criar bundle; ajustar preço/oferta |
| G4 (60 dias pós-F3) | ≥ 500 visitas orgânicas/mês | não construir ferramenta 3; testar distribuição manual |

## Orçamento

| Item | Custo |
|---|---|
| Domínio .com.br | ~R$40–60/ano |
| Hosting (Cloudflare Pages) | R$0 |
| Analytics + e-mail (free tier) | R$0 |
| Checkout | taxa por venda |
| GPU / modelos | já adquirido |

## Fora de escopo agora

Game assets, mockups, texturas PBR, retrato pet, automação para PME, YouTube/audiência.
Ficam registrados em `IDEIAS.md` e `ACOMPANHAMENTO.md` sem execução.
