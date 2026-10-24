"""Gera a planilha de Precificação de Confeitaria.

Uso:
    python gerar_planilha_confeitaria.py                 # completa
    python gerar_planilha_confeitaria.py --versao gratis # isca
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
NUMERO = '#,##0.000'
PERCENTUAL = '0.00%'

INGREDIENTES = [
    ("Farinha de trigo", "kg", 5.00, 1),
    ("Açúcar refinado", "kg", 4.50, 1),
    ("Manteiga", "kg", 45.00, 1),
    ("Ovos", "un", 12.00, 12),
    ("Leite condensado", "un", 6.50, 1),
    ("Chocolate em pó", "kg", 30.00, 1),
    ("Creme de leite", "un", 4.20, 1),
    ("Fermento em pó", "kg", 18.00, 1),
    ("Sal", "kg", 3.00, 1),
    ("Essência de baunilha", "ml", 9.00, 30),
]

RECEITAS = [
    ("Brigadeiro gourmet", 30, 1.5, 0.50),
    ("Bolo de cenoura", 12, 2.0, 1.20),
    ("Cookie de chocolate", 24, 1.2, 0.40),
]

ITENS = [
    ("Brigadeiro gourmet", "Leite condensado", 2, "un"),
    ("Brigadeiro gourmet", "Chocolate em pó", 0.2, "kg"),
    ("Brigadeiro gourmet", "Manteiga", 0.05, "kg"),
    ("Bolo de cenoura", "Farinha de trigo", 0.3, "kg"),
    ("Bolo de cenoura", "Açúcar refinado", 0.3, "kg"),
    ("Bolo de cenoura", "Ovos", 3, "un"),
    ("Bolo de cenoura", "Fermento em pó", 0.02, "kg"),
    ("Bolo de cenoura", "Manteiga", 0.1, "kg"),
    ("Cookie de chocolate", "Farinha de trigo", 0.25, "kg"),
    ("Cookie de chocolate", "Manteiga", 0.15, "kg"),
    ("Cookie de chocolate", "Açúcar refinado", 0.15, "kg"),
    ("Cookie de chocolate", "Chocolate em pó", 0.1, "kg"),
    ("Cookie de chocolate", "Ovos", 1, "un"),
]

CFG_VALOR_HORA = "Config!$B$4"
CFG_FIXOS = "Config!$B$5"
CFG_DAS = "Config!$B$6"
CFG_HORAS_MES = "Config!$B$7"
CFG_TAXA = "Config!$B$8"
CFG_MARGEM = "Config!$B$9"

ING_NOMES = f"Ingredientes!$A$4:$A$23"
ING_TABELA = "Ingredientes!$A$4:$E$23"

ITENS_RECEITA = "Itens!$A$4:$A$63"
ITENS_CUSTO = "Itens!$D$4:$D$63"


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
    ws["A1"] = "Precificação de Confeitaria — 2026"
    ws["A1"].font = TITULO
    ws["A2"] = "Custo por ingrediente, ficha técnica por receita e preço com margem real."
    ws["A2"].font = SUBTITULO

    linhas = [
        "",
        "Como usar",
        "1. Config: valor da sua hora, custos fixos, DAS, horas produtivas, taxa do canal e margem.",
        "2. Ingredientes: preço da embalagem e quantidade que ela rende (ex.: 1 kg, 12 un).",
        "3. Itens: para cada receita, diga o ingrediente e a quantidade usada.",
        "4. Receitas: rendimento, horas de trabalho e embalagem por porção.",
        "5. Resumo: custo médio, preço médio e margem agregada.",
        "",
        "Premissas",
        "• O custo fixo é rateado por hora de trabalho, não por receita.",
        "• A taxa do canal incide sobre o preço, por isso entra no denominador.",
        "• Preço = custo por porção ÷ (1 − taxa − margem desejada).",
        "",
        "Aviso",
        "Estimativa. Ajuste as perdas, a embalagem e o tempo real de produção.",
        "",
        "Versão: 1.0 (outubro de 2026)",
    ]
    for indice, texto in enumerate(linhas, start=4):
        ws.cell(row=indice, column=1, value=texto)
        if texto in {"Como usar", "Premissas", "Aviso"}:
            ws.cell(row=indice, column=1).font = Font(bold=True, size=12, color=VERDE)

    if not completa:
        ws["A23"] = "Versão gratuita: inclui Config e Ingredientes (custo unitário)."
        ws["A24"] = "A completa adiciona Itens, Receitas e Resumo com o preço sugerido."
        for linha in (23, 24):
            ws.cell(row=linha, column=1).font = Font(italic=True, color=CINZA)

    ws.column_dimensions["A"].width = 100


def aba_config(wb: Workbook) -> None:
    ws = wb.create_sheet("Config")
    ws["A1"] = "Configuração"
    ws["A1"].font = TITULO

    campos = [
        ("Valor da sua hora (R$)", 30.00, MOEDA),
        ("Custos fixos mensais (R$)", 800.00, MOEDA),
        ("DAS e impostos mensais (R$)", 82.00, MOEDA),
        ("Horas produtivas por mês", 120, '0'),
        ("Taxa do canal (%)", 0.10, PERCENTUAL),
        ("Margem desejada (%)", 0.30, PERCENTUAL),
    ]
    ws.cell(row=3, column=1, value="Parâmetro").font = CABECALHO
    ws.cell(row=3, column=2, value="Valor").font = CABECALHO
    estilizar_cabecalho(ws, 3, 2)

    for indice, (rotulo, valor, formato) in enumerate(campos, start=4):
        ws.cell(row=indice, column=1, value=rotulo).font = ENTRADA
        celula = ws.cell(row=indice, column=2, value=valor)
        celula.fill = FILL_ENTRADA
        celula.border = BORDA
        celula.number_format = formato

    ws["A11"] = "Campos em verde-claro são editáveis."
    ws["A11"].font = Font(italic=True, color=CINZA)
    larguras(ws, {"A": 36, "B": 18})


def aba_ingredientes(wb: Workbook, linhas: int = 20) -> None:
    ws = wb.create_sheet("Ingredientes")
    cabecalhos = ["Ingrediente", "Unidade", "Preço da embalagem (R$)", "Qtd. na embalagem", "Custo por unidade (R$)"]
    for coluna, texto in enumerate(cabecalhos, start=1):
        ws.cell(row=3, column=coluna, value=texto)
    estilizar_cabecalho(ws, 3, len(cabecalhos))

    for indice in range(linhas):
        linha = 4 + indice
        if indice < len(INGREDIENTES):
            nome, unidade, preco, quantidade = INGREDIENTES[indice]
            ws.cell(row=linha, column=1, value=nome)
            ws.cell(row=linha, column=2, value=unidade)
            ws.cell(row=linha, column=3, value=preco).number_format = MOEDA
            ws.cell(row=linha, column=4, value=quantidade).number_format = NUMERO
        ws.cell(row=linha, column=5, value=f"=IFERROR(C{linha}/D{linha},0)").number_format = MOEDA

    dv_unidade = DataValidation(type="list", formula1='"kg,g,ml,l,un"', allow_blank=True)
    ws.add_data_validation(dv_unidade)
    dv_unidade.add("B4:B23")

    ws.freeze_panes = "A4"
    larguras(ws, {"A": 26, "B": 11, "C": 22, "D": 18, "E": 22})


def aba_itens(wb: Workbook, linhas: int = 60) -> None:
    ws = wb.create_sheet("Itens")
    cabecalhos = ["Receita", "Ingrediente", "Quantidade usada", "Custo (R$)"]
    for coluna, texto in enumerate(cabecalhos, start=1):
        ws.cell(row=3, column=coluna, value=texto)
    estilizar_cabecalho(ws, 3, len(cabecalhos))

    for indice in range(linhas):
        linha = 4 + indice
        if indice < len(ITENS):
            receita, ingrediente, quantidade, _ = ITENS[indice]
            ws.cell(row=linha, column=1, value=receita)
            ws.cell(row=linha, column=2, value=ingrediente)
            ws.cell(row=linha, column=3, value=quantidade).number_format = NUMERO
        ws.cell(row=linha, column=4, value=(
            f"=IFERROR(C{linha}*VLOOKUP($B{linha},{ING_TABELA},5,FALSE),0)"
        )).number_format = MOEDA

    receitas = [nome for nome, *_ in RECEITAS]
    dv_receita = DataValidation(
        type="list",
        formula1='"' + ",".join(receitas) + '"',
        allow_blank=True,
    )
    dv_ingrediente = DataValidation(
        type="list",
        formula1=f"={ING_NOMES}",
        allow_blank=True,
    )
    ws.add_data_validation(dv_receita)
    ws.add_data_validation(dv_ingrediente)
    dv_receita.add("A4:A63")
    dv_ingrediente.add("B4:B63")

    ws.freeze_panes = "A4"
    larguras(ws, {"A": 24, "B": 26, "C": 18, "D": 16})


def aba_receitas(wb: Workbook, linhas: int = 12) -> None:
    ws = wb.create_sheet("Receitas")
    cabecalhos = [
        "Receita", "Rendimento (porções)", "Horas de trabalho", "Custo ingredientes (R$)",
        "Mão de obra (R$)", "Embalagem por porção (R$)", "Custo fixo rateado (R$)",
        "Custo total (R$)", "Custo por porção (R$)", "Preço sugerido (R$)", "Lucro por porção (R$)",
    ]
    for coluna, texto in enumerate(cabecalhos, start=1):
        ws.cell(row=3, column=coluna, value=texto)
    estilizar_cabecalho(ws, 3, len(cabecalhos))

    for indice in range(linhas):
        linha = 4 + indice
        if indice < len(RECEITAS):
            nome, rendimento, horas, embalagem = RECEITAS[indice]
            ws.cell(row=linha, column=1, value=nome)
            ws.cell(row=linha, column=2, value=rendimento)
            ws.cell(row=linha, column=3, value=horas).number_format = NUMERO
            ws.cell(row=linha, column=6, value=embalagem).number_format = MOEDA

        ws.cell(row=linha, column=4, value=(
            f'=SUMIFS({ITENS_CUSTO},{ITENS_RECEITA},$A{linha})'
        )).number_format = MOEDA
        ws.cell(row=linha, column=5, value=(
            f"=C{linha}*{CFG_VALOR_HORA}"
        )).number_format = MOEDA
        ws.cell(row=linha, column=7, value=(
            f"=({CFG_FIXOS}+{CFG_DAS})/{CFG_HORAS_MES}*C{linha}"
        )).number_format = MOEDA
        ws.cell(row=linha, column=8, value=(
            f"=D{linha}+E{linha}+F{linha}*B{linha}+G{linha}"
        )).number_format = MOEDA
        ws.cell(row=linha, column=9, value=(
            f"=IFERROR(H{linha}/B{linha},0)"
        )).number_format = MOEDA
        ws.cell(row=linha, column=10, value=(
            f"=IFERROR(I{linha}/(1-{CFG_TAXA}-{CFG_MARGEM}),0)"
        )).number_format = MOEDA
        ws.cell(row=linha, column=11, value=(
            f"=J{linha}-I{linha}-J{linha}*{CFG_TAXA}"
        )).number_format = MOEDA

    for linha in range(4, 16):
        for coluna in range(2, 4):
            ws.cell(row=linha, column=coluna).number_format = '0.00'

    ws.freeze_panes = "B4"
    larguras(ws, {
        "A": 26, "B": 14, "C": 14, "D": 18, "E": 16, "F": 18, "G": 18,
        "H": 16, "I": 18, "J": 18, "K": 18,
    })


def aba_resumo(wb: Workbook) -> None:
    ws = wb.create_sheet("Resumo")
    ws["A1"] = "Resumo"
    ws["A1"].font = TITULO
    ws["A2"] = "Calculado a partir das receitas cadastradas."
    ws["A2"].font = SUBTITULO

    linhas = [
        ("Receitas cadastradas", '=COUNTA(Receitas!$A$4:$A$15)', '0'),
        (
            "Custo médio por porção (R$)",
            "=IFERROR(SUMPRODUCT(Receitas!$H$4:$H$15,Receitas!$B$4:$B$15)/SUMPRODUCT(Receitas!$B$4:$B$15),0)",
            MOEDA,
        ),
        (
            "Preço médio por porção (R$)",
            "=IFERROR(SUMPRODUCT(Receitas!$J$4:$J$15,Receitas!$B$4:$B$15)/SUMPRODUCT(Receitas!$B$4:$B$15),0)",
            MOEDA,
        ),
        (
            "Margem agregada",
            "=IFERROR(SUMPRODUCT(Receitas!$K$4:$K$15,Receitas!$B$4:$B$15)/SUMPRODUCT(Receitas!$J$4:$J$15,Receitas!$B$4:$B$15),0)",
            PERCENTUAL,
        ),
    ]
    for indice, (rotulo, formula, formato) in enumerate(linhas, start=4):
        ws.cell(row=indice, column=1, value=rotulo).font = ENTRADA
        celula = ws.cell(row=indice, column=2, value=formula)
        celula.number_format = formato
        celula.border = BORDA

    ws["A10"] = "A margem agregada é ponderada pelo rendimento de cada receita."
    ws["A10"].font = Font(italic=True, color=CINZA)
    larguras(ws, {"A": 32, "B": 20})


def gerar(caminho: Path, completa: bool = True) -> Path:
    wb = Workbook()
    aba_leia_me(wb, completa)
    aba_config(wb)
    aba_ingredientes(wb)
    if completa:
        aba_itens(wb)
        aba_receitas(wb)
        aba_resumo(wb)
    caminho.parent.mkdir(parents=True, exist_ok=True)
    wb.save(caminho)
    return caminho


def main() -> None:
    parser = argparse.ArgumentParser(description="Gera a planilha de precificação de confeitaria")
    parser.add_argument("--versao", choices=["completa", "gratis"], default="completa")
    parser.add_argument("--saida", type=Path, default=Path(__file__).parent / "saida")
    args = parser.parse_args()

    completa = args.versao == "completa"
    nome = "precificacao-confeitaria-2026.xlsx" if completa else "precificacao-confeitaria-2026-gratis.xlsx"
    destino = gerar(args.saida / nome, completa)
    print(f"Gerado: {destino}")


if __name__ == "__main__":
    main()
