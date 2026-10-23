# Rescisão trabalhista

Calcula verbas rescisórias para dispensa sem justa causa, pedido de demissão,
justa causa e acordo (art. 484-A).

- **Público:** trabalhador demitido conferindo o valor a receber.
- **Monetização:** afiliado de advocacia trabalhista e contabilidade.
- **Status:** publicado em `/rescisao/`.

## Regras implementadas

- Aviso prévio proporcional: 30 dias + 3 por ano completo, teto de 90 (Lei 12.506/2011).
- Aviso indenizado projeta o contrato para férias e 13º (Súmula 441 do TST).
- Acordo 484-A: metade do aviso e multa de 20% do FGTS.
- Pedido de demissão com aviso não cumprido: desconto de um salário.
- Justa causa: apenas saldo de salário e férias vencidas com terço.
- Mês só conta para 13º e férias se tiver 15 dias ou mais trabalhados.
- INSS e IRRF de 2026 apenas sobre verbas tributáveis (saldo, 13º e aviso trabalhado).

## Dependência deliberada

Importa `inss`/`irrf` de `ferramentas/clt-pj/src`, que já têm suíte própria.
Na terceira ferramenta que precisar do mesmo motor, extrair para `_infra/impostos`.

## Não incluído

Horas extras, comissões, adicionais, férias gozadas no mês, plano de saúde e
descontos de pensão. A multa usa o saldo de FGTS informado pelo usuário.
