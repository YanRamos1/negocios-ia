"""Gera o Kit Financeiro imprimível em PDF (isca gratuita).

Uso:
    python gerar_kit.py --saida public/kit
"""

from __future__ import annotations

import argparse
from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

VERDE = HexColor("#0F766E")
VERDE_CLARO = HexColor("#ECFDF5")
TEXTO = HexColor("#111827")
CINZA = HexColor("#6B7280")
LINHA = HexColor("#D1D5DB")

LARGURA, ALTURA = A4
MARGEM = 18 * mm
TOTAL_PAGINAS = 6


def cabecalho(c: canvas.Canvas, titulo: str, pagina: int) -> float:
    c.setFillColor(VERDE)
    c.rect(0, ALTURA - 14 * mm, LARGURA, 14 * mm, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(MARGEM, ALTURA - 9 * mm, "Kit Financeiro 2026")
    c.setFont("Helvetica", 9)
    c.drawRightString(LARGURA - MARGEM, ALTURA - 9 * mm, f"{pagina} de {TOTAL_PAGINAS}")
    c.setFillColor(TEXTO)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(MARGEM, ALTURA - 26 * mm, titulo)
    c.setStrokeColor(LINHA)
    c.setLineWidth(0.6)
    c.line(MARGEM, ALTURA - 30 * mm, LARGURA - MARGEM, ALTURA - 30 * mm)
    return ALTURA - 40 * mm


def rodape(c: canvas.Canvas, pagina: int) -> None:
    c.setFillColor(CINZA)
    c.setFont("Helvetica", 8)
    c.drawString(MARGEM, 12 * mm, "calculadoras — materiais gratuitos para organizar o dinheiro")
    c.drawRightString(LARGURA - MARGEM, 12 * mm, f"pagina {pagina}")


def subtitulo(c: canvas.Canvas, texto: str, y: float) -> float:
    c.setFillColor(CINZA)
    c.setFont("Helvetica", 9)
    c.drawString(MARGEM, y, texto)
    return y - 7 * mm


def tabela(
    c: canvas.Canvas,
    y: float,
    colunas: list[tuple[str, float]],
    linhas: int,
    altura_linha: float = 8.5 * mm,
    rotulos: list[str] | None = None,
) -> float:
    x = MARGEM
    largura_total = sum(largura for _, largura in colunas)

    c.setFillColor(VERDE_CLARO)
    c.rect(x, y - altura_linha, largura_total, altura_linha, stroke=0, fill=1)
    c.setFillColor(VERDE)
    c.setFont("Helvetica-Bold", 8)
    cursor = x
    for rotulo, largura in colunas:
        c.drawString(cursor + 2 * mm, y - altura_linha + 3 * mm, rotulo.upper())
        cursor += largura

    c.setStrokeColor(LINHA)
    c.setLineWidth(0.5)
    for indice in range(linhas + 1):
        linha_y = y - altura_linha * (indice + 1)
        c.line(x, linha_y, x + largura_total, linha_y)
    cursor = x
    for _, largura in colunas:
        c.line(cursor, y, cursor, y - altura_linha * (linhas + 1))
        cursor += largura
    c.line(cursor, y, cursor, y - altura_linha * (linhas + 1))

    if rotulos:
        c.setFillColor(TEXTO)
        c.setFont("Helvetica", 9)
        for indice, rotulo in enumerate(rotulos[:linhas]):
            c.drawString(x + 2 * mm, y - altura_linha * (indice + 2) + 3 * mm, rotulo)

    return y - altura_linha * (linhas + 1) - 6 * mm


def capa(c: canvas.Canvas) -> None:
    c.setFillColor(VERDE)
    c.rect(0, 0, LARGURA, ALTURA, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 30)
    c.drawString(MARGEM, ALTURA - 80 * mm, "Kit Financeiro")
    c.setFont("Helvetica", 22)
    c.drawString(MARGEM, ALTURA - 94 * mm, "2026")
    c.setFont("Helvetica", 12)
    c.drawString(MARGEM, ALTURA - 112 * mm, "Orçamento, dívidas, metas e despesas em seis folhas A4.")
    c.setFont("Helvetica", 10)
    c.drawString(MARGEM, ALTURA - 122 * mm, "Imprima em preto e branco ou colorido. Funciona em A4.")

    caixa_y = 90 * mm
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(MARGEM, caixa_y + 30 * mm, "Como usar")
    c.setFont("Helvetica", 10)
    linhas = [
        "1. Comece pelo orçamento mensal: previsto x realizado.",
        "2. Liste as dívidas com saldo e juros antes de negociar.",
        "3. Escolha três metas e acompanhe os quadradinhos.",
        "4. Registre as despesas do dia a dia por categoria.",
        "5. Feche o mês conferindo o checklist da última página.",
    ]
    for indice, texto in enumerate(linhas):
        c.drawString(MARGEM, caixa_y + 22 * mm - indice * 7 * mm, texto)

    c.setFont("Helvetica", 9)
    c.drawString(MARGEM, 22 * mm, "calculadoras — material gratuito, sem cadastro")
    c.showPage()


def orcamento(c: canvas.Canvas) -> None:
    y = cabecalho(c, "Orçamento mensal", 2)
    y = subtitulo(c, "Mês de referência: ____________     Renda prevista: R$ ______________", y)
    categorias = [
        "Moradia", "Alimentação", "Transporte", "Saúde", "Educação",
        "Lazer", "Dívidas", "Impostos", "Investimentos", "Outros",
    ]
    y = tabela(
        c,
        y,
        [("Categoria", 62 * mm), ("Previsto", 40 * mm), ("Realizado", 40 * mm), ("Diferença", 37 * mm)],
        len(categorias),
        altura_linha=11 * mm,
        rotulos=categorias,
    )
    y = subtitulo(c, "Total previsto: R$ ______________     Total realizado: R$ ______________", y)
    subtitulo(c, "Diferença do mês: R$ ______________", y)
    rodape(c, 2)
    c.showPage()


def dividas(c: canvas.Canvas) -> None:
    y = cabecalho(c, "Controle de dívidas", 3)
    y = subtitulo(c, "Liste do maior juro para o menor. Negocie a mais cara primeiro.", y)
    y = tabela(
        c,
        y,
        [("Credor", 52 * mm), ("Saldo", 30 * mm), ("Juros", 24 * mm), ("Parcela", 28 * mm), ("Quitação", 27 * mm)],
        10,
        altura_linha=10 * mm,
    )
    y = subtitulo(c, "Total das dívidas: R$ ______________     Total das parcelas: R$ ______________", y)
    y = subtitulo(c, "Data prevista para quitar a última: ____ / ____ / ________", y)
    rodape(c, 3)
    c.showPage()


def metas(c: canvas.Canvas) -> None:
    y = cabecalho(c, "Metas de economia", 4)
    y = subtitulo(c, "Cada quadradinho vale 1/30 da meta. Pinte conforme avança.", y)

    for indice in range(3):
        caixa_y = y - indice * 58 * mm
        c.setStrokeColor(LINHA)
        c.setLineWidth(0.7)
        c.roundRect(MARGEM, caixa_y - 50 * mm, LARGURA - 2 * MARGEM, 50 * mm, 4 * mm, stroke=1, fill=0)

        c.setFillColor(TEXTO)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(MARGEM + 4 * mm, caixa_y - 8 * mm, f"Meta {indice + 1}")
        c.setFont("Helvetica", 9)
        c.setFillColor(CINZA)
        c.drawString(MARGEM + 4 * mm, caixa_y - 15 * mm, "Objetivo: ______________________________")
        c.drawString(MARGEM + 4 * mm, caixa_y - 21 * mm, "Valor: R$ ______________    Prazo: ____ / ____ / ________")

        c.setStrokeColor(LINHA)
        c.setFillColor(white)
        for quadrado in range(30):
            coluna = quadrado % 15
            linha = quadrado // 15
            x = MARGEM + 4 * mm + coluna * 10.2 * mm
            topo = caixa_y - 31 * mm - linha * 9 * mm
            c.rect(x, topo, 7 * mm, 7 * mm, stroke=1, fill=0)

    rodape(c, 4)
    c.showPage()


def despesas(c: canvas.Canvas) -> None:
    y = cabecalho(c, "Registro de despesas", 5)
    y = subtitulo(c, "Anote no dia. Categoria ajuda a comparar com o orçamento.", y)
    tabela(
        c,
        y,
        [("Data", 26 * mm), ("Descrição", 78 * mm), ("Categoria", 42 * mm), ("Valor", 33 * mm)],
        24,
        altura_linha=8 * mm,
    )
    rodape(c, 5)
    c.showPage()


def checklist(c: canvas.Canvas) -> None:
    y = cabecalho(c, "Checklist do mês", 6)
    y = subtitulo(c, "Marque o que já está resolvido. Repita todo mês.", y)

    itens = [
        "Conferi todas as entradas do mês",
        "Registrei as despesas fixas",
        "Paguei as parcelas das dívidas em dia",
        "Separei a reserva de imposto (se for PJ/MEI)",
        "Guardei o valor das metas de economia",
        "Revisei as assinaturas e serviços recorrentes",
        "Conferi o saldo do FGTS ou da reserva de emergência",
        "Emiti as notas fiscais pendentes",
        "Atualizei a planilha de controle",
        "Planejei o orçamento do próximo mês",
        "Defini uma meta de economia para o próximo mês",
        "Revisitei os juros das dívidas e negociei uma delas",
    ]

    c.setStrokeColor(TEXTO)
    c.setLineWidth(0.8)
    for indice, item in enumerate(itens):
        topo = y - indice * 13 * mm
        c.rect(MARGEM, topo - 4 * mm, 5 * mm, 5 * mm, stroke=1, fill=0)
        c.setFillColor(TEXTO)
        c.setFont("Helvetica", 11)
        c.drawString(MARGEM + 9 * mm, topo - 1.5 * mm, item)

    c.setFillColor(CINZA)
    c.setFont("Helvetica", 9)
    c.drawString(MARGEM, y - 12 * 13 * mm - 8 * mm, "Quer o controle automático? Use a planilha Financeiro PF x PJ.")
    rodape(c, 6)
    c.showPage()


def gerar(caminho: Path) -> Path:
    caminho.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(caminho), pagesize=A4)
    c.setTitle("Kit Financeiro 2026")
    c.setAuthor("calculadoras")
    c.setSubject("Orçamento, dívidas, metas e despesas")
    capa(c)
    orcamento(c)
    dividas(c)
    metas(c)
    despesas(c)
    checklist(c)
    c.save()
    return caminho


def main() -> None:
    parser = argparse.ArgumentParser(description="Gera o Kit Financeiro em PDF")
    parser.add_argument("--saida", type=Path, default=Path("public/kit"))
    args = parser.parse_args()

    destino = gerar(args.saida / "kit-financeiro-2026.pdf")
    print(f"Gerado: {destino}")


if __name__ == "__main__":
    main()
