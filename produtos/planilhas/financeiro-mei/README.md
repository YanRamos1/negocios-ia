# Financeiro PF x PJ

Planilha gerada por código. O arquivo entregue não é editado à mão: sai do
`gerar_planilha.py`, então a versão gratuita e a completa nunca divergem.

## Gerar

```
python gerar_planilha.py                  # completa
python gerar_planilha.py --versao gratis  # isca
```

Saída em `saida/financeiro-pf-pj-2026.xlsx` (não versionada).

## Abas

| Aba | Conteúdo |
|---|---|
| Leia-me | instruções, premissas e aviso |
| Config | entradas editáveis (salário, faturamento, pró-labore, despesas) |
| Lançamentos | 200 linhas com listas de tipo, categoria, conta e mês |
| Resumo | totais mensais por `SUMIFS`, reserva de imposto e saldo |
| Tabelas | INSS, IRRF, Simples III/V e constantes de 2026 |
| Comparativo | CLT x PJ com fórmulas, veredito e custo do empregador |

## Decisão de modelagem

As tabelas usam **limite inferior** na primeira coluna. O `VLOOKUP` aproximado
do Excel devolve o maior valor menor ou igual à busca; como o INSS e o Simples
são publicados por limite superior, usar a tabela original deslocaria a faixa
em um degrau.

## Testes

```
python -m unittest discover -s produtos/planilhas/financeiro-mei -p "test_*.py"
```

Os testes conferem estrutura, validam as fórmulas com a biblioteca `formulas`
e comparam o resultado com o motor TypeScript do site (CLT R$ 5.000 →
R$ 4.498,49; PJ R$ 6.500 → R$ 5.609,80).

## Pendente

Landing page e checkout (Kiwify) para a versão paga.
