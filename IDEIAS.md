# Negócios digitais com IA — backlog

## Restrições
- Tudo **digital** (sem produto físico, sem POD, sem frete).
- Público principal: Brasil (PT-BR), com opção de vender em USD depois.
- Máquina: Windows/PowerShell, RTX 2060 SUPER 8 GB, 48 GB RAM.
- Ferramentas: `agy`, `cmdc`, `cursor-agent` (não-interativos), Python, chaves de API grátis.

## Trilhas
1. **Ferramentas web / micro-SaaS com SEO** — calculadoras e geradores. Tráfego orgânico, monetização por afiliado, ads ou plano pago.
2. **Produtos digitais empacotados** — PDF, planilhas, templates, asset packs, planners.
3. **Serviços de automação** — caixa rápido, ticket alto, menos escala.
4. **Conteúdo/audiência** — último na fila, mais lento.

## Projetos
### [ ] Calculadora de impostos (anotado 2026-10-23)
- Escopo a definir: CLT x PJ, Simples Nacional/MEI (DAS), IRPF, rescisão, precificação.
- Formato: web app estático + páginas SEO por caso de uso.
- Monetização: afiliado de contabilidade/banco PJ, ads, versão pro (salvar simulações, PDF).
- Vantagem: cálculo determinístico em código (não é "chute de IA") + páginas em PT-BR.

### [ ] Pipeline de livros/PDFs ilustrados (digital)
- Saída: PDF 300 DPI, margens e sangria corretas, fonte real (nunca texto gerado por imagem).
- Distribuição: Kiwify/Hotmart/Gumroad.
- Nichos: bilíngue PT-EN, alfabetização, TDAH/autismo, folclore BR, colorir adulto.

## A. Ferramentas web com SEO (calculadoras/geradores)
Modelo: cálculo determinístico em código → página indexável → afiliado/lead/versão pro.
1. CLT x PJ (comparativo anual com INSS, IRRF, FGTS, férias, 13º)
2. Salário líquido + custo do funcionário para a empresa
3. Rescisão trabalhista completa (aviso, férias, 13º, FGTS + 40%)
4. Simples Nacional / MEI: DAS, limite, desenquadramento, fator R
5. Custo de importação (Remessa Conforme, II, ICMS) — volume altíssimo
6. Taxa de marketplace: quanto sobra em Shopee / Mercado Livre / Amazon
7. Precificação para MEI/artesão (custo + margem + taxa + frete)
8. Financiamento imobiliário SAC x Price + ITBI/cartório
9. Ganho de capital na venda de imóvel
10. Juros compostos / CDB x LCI x Tesouro (afiliado corretora)
11. Simulador de aposentadoria INSS
12. Multa de rescisão de aluguel (proporcional)
13. Payback de energia solar (lead caro para integrador)
14. Custo de obra por m² (lead para engenheiro/arquiteto)
15. Custo de receita para confeitaria (rendimento + margem)
16. Hora extra / adicional noturno
17. Gerador de currículo ATS + carta de apresentação
18. Gerador de orçamento/proposta em PDF para freelancer
19. Gerador de plano de aula BNCC (professores) — assinatura
20. Gerador de prova/questões a partir de PDF — SaaS

## B. Planilhas / templates
Modelo: versão grátis como isca → completa R$27–47 → bundle R$97 → atualização anual.
1. Financeiro MEI (separação PF/PJ, DAS, limite de faturamento)
2. Fluxo de caixa 12 meses + DRE simplificado
3. Controle de estoque (curva ABC, ponto de pedido, giro)
4. Precificação para marketplace (Shopee/ML) com taxas reais
5. Precificação de confeitaria (custo por receita, rendimento, margem)
6. Caderneta/fiado digital
7. Gestão de aluguel/Airbnb (ocupação, receita por imóvel)
8. Gestão de freelancer (horas, projetos, imposto)
9. Finanças pessoais 50/30/20 + quitação de dívidas
10. Carteira de investimentos (aportes, preço médio, IR)
11. Controle de obra/reforma por etapa
12. Gestão de consultório/clínica (agenda, faturamento, repasse)
13. Diário de classe e notas para professor
14. Controle de combustível/frota para motorista de app
15. Dashboard de e-commerce (CMV, margem por SKU, ads)
16. Calendário editorial / planejamento de conteúdo
17. Templates Notion: CRM simples, gestão de projetos, segundo cérebro
18. Templates de slides para propostas comerciais

## Notas técnicas
- Flux.1 **dev** = licença NÃO comercial (não pode vender). Flux.1 **schnell** = Apache 2.0.
- SDXL roda local em 8 GB; Flux em 8 GB só via GGUF quantizado (lento).
- Etsy/KDP exigem declarar uso de IA.
