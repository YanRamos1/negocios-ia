# Precificação de Confeitaria

Planilha gerada por código. A versão entregue sai do script, então gratuita e completa
nunca divergem.

## Gerar

```
python gerar_planilha_confeitaria.py                  # completa
python gerar_planilha_confeitaria.py --versao gratis  # isca
```

## Modelo

- **Ingredientes:** preço da embalagem ÷ quantidade que ela rende = custo por unidade.
- **Itens:** quantidade usada por receita × custo unitário (VLOOKUP exato).
- **Receitas:** custo de ingredientes (SUMIFS), mão de obra (horas × valor da hora),
  embalagem por porção e custo fixo rateado **por hora** — `(fixos + DAS) ÷ horas produtivas × horas da receita`.
- **Preço:** custo por porção ÷ (1 − taxa do canal − margem desejada).
- **Resumo:** receitas cadastradas, custo médio, preço médio e margem agregada ponderada.

## Por que ratear por hora

Ratear custo fixo por receita distorce quando as receitas têm tempos diferentes. A hora
de trabalho é a medida comum entre um brigadeiro e um bolo.

## Testes

```
python -m unittest discover -s produtos/planilhas/precificacao-confeitaria -p "test_*.py"
```

Os testes avaliam as fórmulas com a biblioteca `formulas` e conferem os valores do exemplo
padrão: brigadeiro com custo total de R$ 92,28, custo por porção de R$ 3,08 e preço de
R$ 5,13.

## Pendente

Landing publicada com download gratuito; checkout da versão completa ainda não configurado.
