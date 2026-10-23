"""Gera a planilha Financeiro PF x PJ 2026.

Uso:
    python gerar_planilha.py                 # versão completa
    python gerar_planilha.py --versao gratis  # versão isca
"""

from __future__ import annotations

import argparse
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

VERDE = "0F766E"
VERDE_CLARO = "ECFDF5"
CINZA = "6B7280"
BORDA = Border(*(Side(style="thin", color="E5E7EB"),) * 4)

TITULO = Font(bold=True, size=16, color=VERDE)
SUBTITULO = Font(bold=True, size=11, color=CINZA)
CABECALHO = Font(bold=True, color="FFFFFF")
ENTRADA = Font(bold=True, size=11)
FILL_CABECALHO = PatternFill("solid", fgColor=VERDE)
FILL_ENTRADA = PatternFill("solid", fgColor=VERDE_CLARO)

MOEDA = 'R$ #,##0.00'
PERCENTUAL = '0.00%'
DATA = 'DD/MM/YYYY'

# --- Tabelas de 2026 -------------------------------------------------------
# Formato: (de, até, alíquota, deduzir). A coluna "De" existe porque o
# VLOOKUP aproximado do Excel pega o maior valor menor ou igual à busca.
INSS = [
    (0.00, 1621.00, 0.075, 0.00),
    (1621.01, 2902.84, 0.090, 24.32),
    (2902.85, 4354.27, 0.120, 111.40),
    (4354.28, 8475.55, 0.140, 198.49),
]
IRRF = [
    (0.00, 2428.80, 0.000, 0.00),
    (2428.81, 2826.65, 0.075, 182.16),
    (2826.66, 3751.05, 0.150, 394.16),
    (3751.06, 4664.68, 0.225, 675.49),
    (4664.69, 999999999.00, 0.275, 908.73),
]
SIMPLES_III = [
    (0.00, 180000.00, 0.060, 0.00),
    (180000.01, 360000.00, 0.112, 9360.00),
    (360000.01, 720000.00, 0.135, 17640.00),
    (720000.01, 1800000.00, 0.160, 35640.00),
    (1800000.01, 3600000.00, 0.210, 125640.00),
    (3600000.01, 4800000.00, 0.330, 648000.00),
]
SIMPLES_V = [
    (0.00, 180000.00, 0.155, 0.00),
    (180000.01, 360000.00, 0.180, 4500.00),
    (360000.01, 720000.00, 0.195, 9900.00),
    (720000.01, 1800000.00, 0.205, 17100.00),
    (1800000.01, 3600000.00, 0.230, 62100.00),
    (3600000.01, 4800000.00, 0.305, 540000.00),
]
CONSTANTES = [
    ("Salário mínimo", 1621.00, MOEDA),
    ("Teto do INSS", 8475.55, MOEDA),
    ("INSS máximo do empregado", 988.09, MOEDA),
    ("Desconto simplificado", 607.20, MOEDA),
    ("Dedução por dependente", 189.59, MOEDA),
    ("Redutor: base", 978.62, MOEDA),
    ("Redutor: coeficiente", 0.133145, '0.000000'),
    ("Redutor: limite isento", 5000.00, MOEDA),
    ("Redutor: limite final", 7350.00, MOEDA),
    ("FGTS", 0.08, PERCENTUAL),
    ("Encargos patronais", 0.268, PERCENTUAL),
    ("INSS do pró-labore", 0.11, PERCENTUAL),
]

# Referências fixas usadas nas fórmulas (evita nome definido, mais compatível).
T_INSS = "Tabelas!$A$5:$D$8"
T_IRRF = "Tabelas!$A$11:$D$15"
T_III = "Tabelas!$A$18:$D$23"
T_V = "Tabelas!$A$26:$D$31"
C = "Tabelas!$B${}"  # constantes: 33..44

SAL_MIN, TETO, INSS_MAX = C.format(33), C.format(34), C.format(35)
DESC, DEP = C.format(36), C.format(37)
RED_BASE, RED_COEF, RED_L1, RED_L2 = C.format(38), C.format(39), C.format(40), C.format(41)
FGTS, PATRONAL, INSS_PRO = C.format(42), C.format(43), C.format(44)

CFG_SALARIO = "Config!$B$4"
CFG_FATURAMENTO = "Config!$B$5"
CFG_PROLALORE_PCT = "Config!$B$6"
CFG_DESPESAS = "Config!$B$7"
CFG_DEPENDENTES = "Config!$B$8"
CFG_ANEXO = "Config!$B$9"
CFG_RESERVA = "Config!$B$10"


def estilizar_cabecalho(ws, linha: int, colunas: int) -> None:
    for col in range(1, colunas + 1):
        celula = ws.cell(row=linha, column=col)
        celula.font = CABECALHO
        celula.fill = FILL_CABECALHO
        celula.alignment = Alignment(horizontal="center", vertical="center")
        celula.border = BORDA


def larguras(ws, valores: dict[str, int]) -> None:
    for coluna, largura in valores.items():
        ws.column_dimensions[coluna].width = largura


def aba_leia_me(wb: Workbook, completa: bool) -> None:
    ws = wb.active
    ws.title = "Leia-me"
    ws["A1"] = "Financeiro PF x PJ — 2026"
    ws["A1"].font = TITULO
    ws["A2"] = "Planilha de controle e comparação entre receber como CLT e como PJ."
    ws["A2"].font = SUBTITULO

    linhas = [
        "",
        "Como usar",
        "1. Abra a aba Config e preencha os campos em verde-claro.",
        "2. Lance entradas e saídas na aba Lançamentos. O mês é uma lista de 1 a 12.",
        "3. O Resumo soma tudo por mês automaticamente (SUMIFS).",
        "4. A aba Comparativo recalcula CLT x PJ sempre que a Config mudar.",
        "",
        "Premissas",
        "• Tributos na fonte: tabela de 2026, incluindo o redutor da Lei 15.270/2025.",
        "• PJ no Simples Nacional, Anexos III ou V, com fator R de 28%.",
        "• O comparativo usa o mesmo valor bruto dos dois lados.",
        "• Não modela PLR, vale-transporte, plano de saúde empresarial ou outros regimes.",
        "",
        "Aviso",
        "Estimativa para orientar decisão. Não substitui contador nem o cálculo oficial da folha.",
        "",
        "Versão: 1.0 (outubro de 2026)",
    ]
    for indice, texto in enumerate(linhas, start=4):
        ws.cell(row=indice, column=1, value=texto)
        if texto in {"Como usar", "Premissas", "Aviso"}:
            ws.cell(row=indice, column=1).font = Font(bold=True, size=12, color=VERDE)

    if not completa:
        ws["A21"] = "Versão gratuita: inclui Config, Lançamentos e Resumo."
        ws["A22"] = "A versão completa adiciona o Comparativo CLT x PJ e as tabelas de cálculo."
        for linha in (21, 22):
            ws.cell(row=linha, column=1).font = Font(italic=True, color=CINZA)

    ws.column_dimensions["A"].width = 100


def aba_config(wb: Workbook) -> None:
    ws = wb.create_sheet("Config")
    ws["A1"] = "Configuração"
    ws["A1"].font = TITULO

    campos = [
        ("Nome", "Seu nome", None),
        ("Salário CLT bruto (R$/mês)", 5000.00, MOEDA),
        ("Faturamento PJ (R$/mês)", 6500.00, MOEDA),
        ("Pró-labore (% do faturamento)", 0.28, PERCENTUAL),
        ("Despesas da PJ (R$/mês)", 300.00, MOEDA),
        ("Dependentes", 0, '0'),
        ("Anexo do Simples", "auto", None),
        ("Reserva de imposto (% do faturamento)", 0.20, PERCENTUAL),
    ]

    for indice, (rotulo, valor, formato) in enumerate(campos, start=3):
        ws.cell(row=indice, column=1, value=rotulo).font = ENTRADA
        celula = ws.cell(row=indice, column=2, value=valor)
        celula.fill = FILL_ENTRADA
        celula.border = BORDA
        if formato:
            celula.number_format = formato

    dv = DataValidation(type="list", formula1='"auto,III,V"', allow_blank=False)
    ws.add_data_validation(dv)
    dv.add(ws["B9"])

    ws["A12"] = "Campos em verde-claro são editáveis. O restante é calculado."
    ws["A12"].font = Font(italic=True, color=CINZA)
    larguras(ws, {"A": 38, "B": 20})


def _tabela(ws, linha_inicial: int, titulo: str, dados: list[tuple[float, float, float, float]]) -> None:
    ws.cell(row=linha_inicial - 1, column=1, value=titulo).font = Font(bold=True, color=VERDE)
    cabecalhos = ["De (R$)", "Até (R$)", "Alíquota", "Deduzir (R$)"]
    for coluna, texto in enumerate(cabecalhos, start=1):
        ws.cell(row=linha_inicial, column=coluna, value=texto)
    estilizar_cabecalho(ws, linha_inicial, len(cabecalhos))
    for deslocamento, (de, ate, aliquota, deduzir) in enumerate(dados, start=1):
        linha = linha_inicial + deslocamento
        ws.cell(row=linha, column=1, value=de).number_format = MOEDA
        ws.cell(row=linha, column=2, value=ate).number_format = MOEDA
        ws.cell(row=linha, column=3, value=aliquota).number_format = PERCENTUAL
        ws.cell(row=linha, column=4, value=deduzir).number_format = MOEDA


def aba_tabelas(wb: Workbook) -> None:
    ws = wb.create_sheet("Tabelas")
    ws["A1"] = "Tabelas de 2026"
    ws["A1"].font = TITULO
    ws["A2"] = "Fonte: INSS, Receita Federal e LC 123/2006. Não edite sem conferir a norma."
    ws["A2"].font = Font(italic=True, color=CINZA)

    _tabela(ws, 4, "INSS — empregado (2026)", INSS)
    _tabela(ws, 10, "IRRF — mensal (2026)", IRRF)
    _tabela(ws, 17, "Simples Nacional — Anexo III", SIMPLES_III)
    _tabela(ws, 25, "Simples Nacional — Anexo V", SIMPLES_V)

    ws.cell(row=32, column=1, value="Constante").font = CABECALHO
    ws.cell(row=32, column=1).fill = FILL_CABECALHO
    ws.cell(row=32, column=2, value="Valor").font = CABECALHO
    ws.cell(row=32, column=2).fill = FILL_CABECALHO
    for deslocamento, (rotulo, valor, formato) in enumerate(CONSTANTES, start=1):
        linha = 32 + deslocamento
        ws.cell(row=linha, column=1, value=rotulo)
        celula = ws.cell(row=linha, column=2, value=valor)
        celula.number_format = formato

    larguras(ws, {"A": 22, "B": 18, "C": 12, "D": 16})


def aba_lancamentos(wb: Workbook, linhas: int = 200) -> None:
    ws = wb.create_sheet("Lançamentos")
    cabecalhos = ["Data", "Descrição", "Tipo", "Categoria", "Conta", "Valor (R$)", "Mês", "Observação"]
    for coluna, texto in enumerate(cabecalhos, start=1):
        ws.cell(row=1, column=coluna, value=texto)
    estilizar_cabecalho(ws, 1, len(cabecalhos))

    ws.cell(row=2, column=1, value="01/01/2026")
    ws.cell(row=2, column=1).number_format = DATA
    ws.cell(row=2, column=2, value="Exemplo — salário")
    ws.cell(row=2, column=3, value="Entrada")
    ws.cell(row=2, column=4, value="Salário")
    ws.cell(row=2, column=5, value="PF")
    ws.cell(row=2, column=6, value=5000.00).number_format = MOEDA
    ws.cell(row=2, column=7, value=1)

    categorias = "Salário,Pró-labore,Distribuição de lucros,Nota fiscal,Alimentação,Moradia,Transporte,Impostos,Contador,Marketing,Equipamentos,Outros"
    tipos = '"Entrada,Saída"'
    contas = '"PF,PJ"'
    meses = '"' + ",".join(str(m) for m in range(1, 13)) + '"'

    validacoes = [
        DataValidation(type="list", formula1=tipos, allow_blank=True),
        DataValidation(type="list", formula1=f'"{categorias}"', allow_blank=True),
        DataValidation(type="list", formula1=contas, allow_blank=True),
        DataValidation(type="list", formula1=meses, allow_blank=True),
    ]
    for dv in validacoes:
        ws.add_data_validation(dv)
    validacoes[0].add(f"C2:C{linhas + 1}")
    validacoes[1].add(f"D2:D{linhas + 1}")
    validacoes[2].add(f"E2:E{linhas + 1}")
    validacoes[3].add(f"G2:G{linhas + 1}")

    for linha in range(2, linhas + 2):
        ws.cell(row=linha, column=1).number_format = DATA
        ws.cell(row=linha, column=6).number_format = MOEDA

    ws.freeze_panes = "A2"
    larguras(ws, {"A": 12, "B": 34, "C": 12, "D": 22, "E": 9, "F": 14, "G": 8, "H": 28})


def aba_resumo(wb: Workbook, linhas: int = 200) -> None:
    ws = wb.create_sheet("Resumo")
    ws["A1"] = "Resumo mensal"
    ws["A1"].font = TITULO

    cabecalhos = ["Mês", "Entradas", "Saídas", "Saldo", "Entradas PJ", "Reserva sugerida", "Saldo após reserva"]
    for coluna, texto in enumerate(cabecalhos, start=1):
        ws.cell(row=3, column=coluna, value=texto)
    estilizar_cabecalho(ws, 3, len(cabecalhos))

    intervalo_tipo = f"Lançamentos!$C$2:$C${linhas + 1}"
    intervalo_conta = f"Lançamentos!$E$2:$E${linhas + 1}"
    intervalo_valor = f"Lançamentos!$F$2:$F${linhas + 1}"
    intervalo_mes = f"Lançamentos!$G$2:$G${linhas + 1}"

    for indice, mes in enumerate(range(1, 13), start=4):
        ws.cell(row=indice, column=1, value=mes)
        ws.cell(row=indice, column=2,
                value=f'=SUMIFS({intervalo_valor},{intervalo_tipo},"Entrada",{intervalo_mes},$A{indice})')
        ws.cell(row=indice, column=3,
                value=f'=SUMIFS({intervalo_valor},{intervalo_tipo},"Saída",{intervalo_mes},$A{indice})')
        ws.cell(row=indice, column=4, value=f"=B{indice}-C{indice}")
        ws.cell(row=indice, column=5,
                value=f'=SUMIFS({intervalo_valor},{intervalo_tipo},"Entrada",{intervalo_conta},"PJ",{intervalo_mes},$A{indice})')
        ws.cell(row=indice, column=6, value=f"=E{indice}*{CFG_RESERVA}")
        ws.cell(row=indice, column=7, value=f"=D{indice}-F{indice}")
        for coluna in range(2, 8):
            ws.cell(row=indice, column=coluna).number_format = MOEDA

    ws.cell(row=16, column=1, value="Total").font = ENTRADA
    for coluna in range(2, 8):
        letra = get_column_letter(coluna)
        ws.cell(row=16, column=coluna, value=f"=SUM({letra}4:{letra}15)").number_format = MOEDA
        ws.cell(row=16, column=coluna).font = ENTRADA

    ws.cell(row=18, column=1,
            value="A reserva sugerida usa o percentual definido na aba Config.")
    ws.cell(row=18, column=1).font = Font(italic=True, color=CINZA)

    larguras(ws, {"A": 8, "B": 14, "C": 14, "D": 14, "E": 14, "F": 18, "G": 20})


def aba_comparativo(wb: Workbook) -> None:
    ws = wb.create_sheet("Comparativo")
    ws["A1"] = "Comparativo CLT x PJ (mês corrente)"
    ws["A1"].font = TITULO
    ws["A2"] = "Calculado a partir da aba Config e das tabelas de 2026."
    ws["A2"].font = SUBTITULO

    linhas = [
        (4, "Salário bruto / faturamento", f"={CFG_SALARIO}", f"={CFG_FATURAMENTO}"),
        (5, "Pró-labore", None, f"=ROUND({CFG_FATURAMENTO}*{CFG_PROLALORE_PCT},2)"),
    ]
    for linha, rotulo, clt, pj in linhas:
        ws.cell(row=linha, column=1, value=rotulo)
        if clt:
            ws.cell(row=linha, column=2, value=clt)
        if pj:
            ws.cell(row=linha, column=3, value=pj)

    # --- IRRF do CLT (helpers em F2:F7) ---
    ws["E2"] = "Base IRRF CLT"
    ws["F2"] = f"=MAX(0,MIN(B4-B6-{CFG_DEPENDENTES}*{DEP},B4-{DESC}))"
    ws["E3"] = "IRRF tabela CLT"
    ws["F3"] = f"=MAX(0,ROUND(F2*IFERROR(VLOOKUP(F2,{T_IRRF},3,TRUE),0),2)-IFERROR(VLOOKUP(F2,{T_IRRF},4,TRUE),0))"
    ws["E4"] = "Redutor CLT"
    ws["F4"] = f"=IF(B4<={RED_L1},F3,IF(B4>{RED_L2},0,MAX(0,{RED_BASE}-{RED_COEF}*B4)))"
    ws["E5"] = "IRRF CLT final"
    ws["F5"] = "=MAX(0,F3-F4)"
    ws["E6"] = "INSS CLT"
    ws["F6"] = (
        f"=IFERROR(MIN(ROUND(B4*VLOOKUP(B4,{T_INSS},3,TRUE),2)-VLOOKUP(B4,{T_INSS},4,TRUE),{INSS_MAX}),ROUND(B4*0.075,2))"
    )
    ws["E7"] = "INSS CLT (piso zero)"
    ws["F7"] = "=MAX(0,F6)"

    ws["B6"] = "=F7"
    ws["B7"] = "=F5"
    ws["B10"] = "=B4-B6-B7"
    ws["B11"] = "=B10*12+F9+F12"

    # 13º e terço de férias líquidos
    ws["E9"] = "13º líquido"
    ws["F9"] = "=B4-B6-B7"
    ws["E12"] = "Terço de férias líquido"
    ws["F12"] = "=IF(B4=0,0,(B4/3)*((B4-B6-B7)/B4))"

    # Custo do empregador
    ws["E14"] = "Custo do empregador"
    ws["F14"] = f"=B4+(B4/12)+(B4*4/3/12)+{FGTS}*(B4+(B4/12)+(B4*4/3/12))+B4*{PATRONAL}"
    ws["B14"] = "=F14"

    # --- PJ ---
    ws["E16"] = "Fator R"
    ws["F16"] = f"=IF({CFG_FATURAMENTO}<=0,0,(C5*12)/({CFG_FATURAMENTO}*12))"
    ws["E17"] = "Anexo aplicável"
    ws["F17"] = f'=IF({CFG_ANEXO}="auto",IF(F16>=0.28,"III","V"),{CFG_ANEXO})'
    ws["E18"] = "Alíquota nominal"
    ws["F18"] = f'=IF(F17="III",VLOOKUP({CFG_FATURAMENTO}*12,{T_III},3,TRUE),VLOOKUP({CFG_FATURAMENTO}*12,{T_V},3,TRUE))'
    ws["E19"] = "Parcela a deduzir"
    ws["F19"] = f'=IF(F17="III",VLOOKUP({CFG_FATURAMENTO}*12,{T_III},4,TRUE),VLOOKUP({CFG_FATURAMENTO}*12,{T_V},4,TRUE))'
    ws["E20"] = "Alíquota efetiva"
    ws["F20"] = f"=IF({CFG_FATURAMENTO}*12<=0,0,({CFG_FATURAMENTO}*12*F18-F19)/({CFG_FATURAMENTO}*12))"
    ws["E21"] = "DAS"
    ws["F21"] = f"=ROUND({CFG_FATURAMENTO}*F20,2)"
    ws["E22"] = "INSS do pró-labore"
    ws["F22"] = f"=IF(C5<=0,0,ROUND(MIN(MAX(C5,{SAL_MIN}),{TETO})*{INSS_PRO},2))"

    ws["E23"] = "Base IRRF pró-labore"
    ws["F23"] = f"=MAX(0,MIN(C5-F22-{CFG_DEPENDENTES}*{DEP},C5-{DESC}))"
    ws["E24"] = "IRRF tabela pró-labore"
    ws["F24"] = f"=MAX(0,ROUND(F23*IFERROR(VLOOKUP(F23,{T_IRRF},3,TRUE),0),2)-IFERROR(VLOOKUP(F23,{T_IRRF},4,TRUE),0))"
    ws["E25"] = "IRRF pró-labore final"
    ws["F25"] = f"=MAX(0,F24-IF(C5<={RED_L1},F24,IF(C5>{RED_L2},0,MAX(0,{RED_BASE}-{RED_COEF}*C5))))"

    ws["C6"] = "=F22"
    ws["C7"] = "=F25"
    ws["C8"] = "=F21"
    ws["C10"] = f"=C4-C8-C6-C7-{CFG_DESPESAS}"
    ws["C11"] = "=C10*12"

    ws["A10"] = "Líquido mensal"
    ws["A11"] = "Líquido anual"
    ws["A6"] = "INSS"
    ws["A7"] = "IRRF"
    ws["A8"] = "DAS / impostos da PJ"
    ws["A14"] = "Custo para a empresa"

    ws["A13"] = "Veredito"
    ws["B13"] = '=IF(C10>B10+0.5,"PJ rende mais","CLT rende mais")'
    ws["B13"].font = Font(bold=True, color=VERDE)

    for linha in range(4, 15):
        for coluna in (2, 3):
            ws.cell(row=linha, column=coluna).number_format = MOEDA
            ws.cell(row=linha, column=coluna).border = BORDA
    for linha in (5, 10, 11):
        for coluna in (2, 3):
            ws.cell(row=linha, column=coluna).font = ENTRADA

    ws["B3"] = "CLT"
    ws["C3"] = "PJ"
    estilizar_cabecalho(ws, 3, 3)
    ws["A3"] = "Indicador"
    ws["A3"].font = CABECALHO
    ws["A3"].fill = FILL_CABECALHO

    for linha in range(2, 26):
        ws.cell(row=linha, column=5).font = Font(italic=True, color=CINZA)

    larguras(ws, {"A": 30, "B": 18, "C": 18, "D": 3, "E": 26, "F": 18})
    ws.freeze_panes = "A4"


def gerar(caminho: Path, completa: bool = True) -> Path:
    wb = Workbook()
    aba_leia_me(wb, completa)
    aba_config(wb)
    aba_lancamentos(wb)
    aba_resumo(wb)
    if completa:
        aba_tabelas(wb)
        aba_comparativo(wb)
    caminho.parent.mkdir(parents=True, exist_ok=True)
    wb.save(caminho)
    return caminho


def main() -> None:
    parser = argparse.ArgumentParser(description="Gera a planilha Financeiro PF x PJ")
    parser.add_argument("--versao", choices=["completa", "gratis"], default="completa")
    parser.add_argument("--saida", type=Path, default=Path(__file__).parent / "saida")
    args = parser.parse_args()

    completa = args.versao == "completa"
    nome = "financeiro-pf-pj-2026.xlsx" if completa else "financeiro-pf-pj-2026-gratis.xlsx"
    destino = gerar(args.saida / nome, completa)
    print(f"Gerado: {destino}")


if __name__ == "__main__":
    main()
