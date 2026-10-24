"""Gera o relatório de auditoria de segurança em PDF a partir de um JSON de achados.

Uso:
    python gerar_relatorio.py --dados exemplo.json --saida ../../public/auditoria/relatorio-exemplo.pdf

O JSON precisa conter: projeto, data, escopo, stack, notaMetodologica, achados[],
pontosFortes[], naoAplicavel[] e, opcionalmente, aviso.
"""

from __future__ import annotations

import argparse
import json
import textwrap
from datetime import date
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors  # noqa: E402
from reportlab.lib.enums import TA_LEFT  # noqa: E402
from reportlab.lib.pagesizes import A4  # noqa: E402
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet  # noqa: E402
from reportlab.lib.units import cm, mm  # noqa: E402
from reportlab.platypus import (  # noqa: E402
    BaseDocTemplate,
    Flowable,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
    Table,
    TableStyle,
)

SEVERIDADES = ["crítica", "alta", "média", "baixa", "informativa"]
CORES = {
    "crítica": "#B91C1C",
    "alta": "#EA580C",
    "média": "#D97706",
    "baixa": "#2563EB",
    "informativa": "#6B7280",
    "forte": "#059669",
}
VERDE = "#0F766E"
CINZA = "#6B7280"
LINHA = "#E5E7EB"

MARGEM = 2 * cm
LARGURA_UTIL = A4[0] - 2 * MARGEM

ESTILOS = getSampleStyleSheet()
ESTILO_TITULO = ParagraphStyle(
    "Titulo", parent=ESTILOS["Title"], fontName="Helvetica-Bold", fontSize=26,
    leading=31, textColor=colors.HexColor("#111827"), alignment=TA_LEFT, spaceAfter=6,
)
ESTILO_SUB = ParagraphStyle(
    "Sub", parent=ESTILOS["Normal"], fontSize=11, leading=16, textColor=colors.HexColor(CINZA),
)
ESTILO_H2 = ParagraphStyle(
    "H2", parent=ESTILOS["Heading2"], fontName="Helvetica-Bold", fontSize=15,
    leading=19, textColor=colors.HexColor(VERDE), spaceBefore=8, spaceAfter=8,
)
ESTILO_H3 = ParagraphStyle(
    "H3", parent=ESTILOS["Heading3"], fontName="Helvetica-Bold", fontSize=11,
    leading=15, textColor=colors.HexColor("#111827"), spaceBefore=6, spaceAfter=4,
)
ESTILO_CORPO = ParagraphStyle(
    "Corpo", parent=ESTILOS["Normal"], fontSize=9.5, leading=14, textColor=colors.HexColor("#374151"),
)
ESTILO_PEQUENO = ParagraphStyle(
    "Pequeno", parent=ESTILO_CORPO, fontSize=8, leading=11, textColor=colors.HexColor(CINZA),
)
ESTILO_CODIGO = ParagraphStyle(
    "Codigo", parent=ESTILOS["Code"], fontName="Courier", fontSize=8, leading=10.5,
    textColor=colors.HexColor("#111827"),
)


def p(texto: str, estilo=ESTILO_CORPO) -> Paragraph:
    return Paragraph(escape(texto), estilo)


def chip(severidade: str) -> Table:
    rotulo = severidade.upper()
    celula = Paragraph(
        f'<font color="white"><b>{escape(rotulo)}</b></font>',
        ParagraphStyle("chip", fontName="Helvetica-Bold", fontSize=7, leading=9, alignment=1),
    )
    tabela = Table([[celula]], colWidths=[2.4 * cm], rowHeights=[0.48 * cm])
    tabela.hAlign = "LEFT"
    tabela.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(CORES.get(severidade, CINZA))),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    return tabela


def quebrar(texto: str, largura: int = 96) -> str:
    linhas: list[str] = []
    for bruta in str(texto).splitlines() or [""]:
        pedacos = textwrap.wrap(bruta, width=largura, replace_whitespace=False) or [""]
        linhas.extend(pedacos)
    return "\n".join(linhas)


def caixa_codigo(texto: str) -> Table:
    tabela = Table([[Preformatted(quebrar(texto), ESTILO_CODIGO)]], colWidths=[LARGURA_UTIL])
    tabela.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F3F4F6")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor(LINHA)),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return tabela


class Rosca(Flowable):
    """Gráfico de rosca desenhado direto no PDF, sem dependência externa."""

    def __init__(self, contagem: dict[str, int], largura: float, altura: float = 6.6 * cm):
        super().__init__()
        self.contagem = contagem
        self.width = largura
        self.height = altura

    def draw(self) -> None:
        canvas = self.canv
        dados = [(sev, self.contagem[sev]) for sev in SEVERIDADES if self.contagem.get(sev)]
        total = sum(qtd for _, qtd in dados) or 1

        raio = min(self.width, self.height) / 2 - 0.9 * cm
        centro_x = self.width / 2
        centro_y = self.height / 2 - 0.2 * cm
        angulo = 90.0

        for severidade, quantidade in dados:
            extensao = 360.0 * quantidade / total
            canvas.setFillColor(colors.HexColor(CORES.get(severidade, CINZA)))
            canvas.setStrokeColor(colors.white)
            canvas.setLineWidth(1)
            canvas.wedge(
                centro_x - raio, centro_y - raio, centro_x + raio, centro_y + raio,
                angulo, extensao, stroke=1, fill=1,
            )
            angulo += extensao

        canvas.setFillColor(colors.white)
        canvas.setStrokeColor(colors.white)
        canvas.circle(centro_x, centro_y, raio * 0.58, stroke=0, fill=1)

        canvas.setFillColor(colors.HexColor("#111827"))
        canvas.setFont("Helvetica-Bold", 18)
        canvas.drawCentredString(centro_x, centro_y + 0.1 * cm, str(total))
        canvas.setFont("Helvetica", 7)
        canvas.setFillColor(colors.HexColor(CINZA))
        canvas.drawCentredString(centro_x, centro_y - 0.35 * cm, "achados")

        canvas.setFont("Helvetica-Bold", 8)
        canvas.setFillColor(colors.HexColor("#111827"))
        canvas.drawString(0, self.height - 0.35 * cm, "Achados por severidade")

        x = 0.2 * cm
        y = 0.25 * cm
        for severidade, quantidade in dados:
            canvas.setFillColor(colors.HexColor(CORES.get(severidade, CINZA)))
            canvas.rect(x, y, 0.28 * cm, 0.28 * cm, stroke=0, fill=1)
            canvas.setFillColor(colors.HexColor("#374151"))
            canvas.setFont("Helvetica", 7.5)
            texto = f"{severidade} {quantidade}"
            canvas.drawString(x + 0.4 * cm, y + 0.05 * cm, texto)
            x += 0.4 * cm + canvas.stringWidth(texto, "Helvetica", 7.5) + 0.5 * cm


class Barras(Flowable):
    """Barras horizontais por categoria, desenhadas no próprio PDF."""

    def __init__(self, contagem: dict[str, int], largura: float):
        super().__init__()
        self.itens = list(contagem.items()) or [("sem achados", 0)]
        self.width = largura
        self.altura_linha = 0.62 * cm
        self.height = len(self.itens) * self.altura_linha + 1.1 * cm

    def draw(self) -> None:
        canvas = self.canv
        rotulo_largura = 5.4 * cm
        area = self.width - rotulo_largura - 1.6 * cm
        maximo = max(valor for _, valor in self.itens) or 1
        topo = self.height - 0.4 * cm

        canvas.setFont("Helvetica-Bold", 8)
        canvas.setFillColor(colors.HexColor("#111827"))
        canvas.drawString(0, self.height - 0.35 * cm, "Achados por categoria")

        for indice, (categoria, valor) in enumerate(self.itens):
            y = topo - 0.5 * cm - indice * self.altura_linha
            canvas.setFont("Helvetica", 7.5)
            canvas.setFillColor(colors.HexColor("#374151"))
            canvas.drawRightString(rotulo_largura - 0.2 * cm, y, categoria[:34])
            largura_barra = area * (valor / maximo)
            canvas.setFillColor(colors.HexColor(VERDE))
            canvas.rect(rotulo_largura, y - 0.08 * cm, max(largura_barra, 0.05 * cm), 0.34 * cm, stroke=0, fill=1)
            canvas.setFillColor(colors.HexColor("#111827"))
            canvas.setFont("Helvetica-Bold", 7.5)
            canvas.drawString(rotulo_largura + largura_barra + 0.15 * cm, y, str(valor))


def cabecalho_rodape(titulo: str, data_texto: str):
    def desenhar(canvas, doc):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor(LINHA))
        canvas.setLineWidth(0.5)
        canvas.line(MARGEM, A4[1] - 1.35 * cm, A4[0] - MARGEM, A4[1] - 1.35 * cm)
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(colors.HexColor(CINZA))
        canvas.drawString(MARGEM, A4[1] - 1.2 * cm, f"Relatório de Auditoria de Segurança — {titulo}")
        canvas.drawRightString(A4[0] - MARGEM, A4[1] - 1.2 * cm, data_texto)
        canvas.line(MARGEM, 1.35 * cm, A4[0] - MARGEM, 1.35 * cm)
        canvas.drawString(MARGEM, 1.05 * cm, "Documento confidencial")
        canvas.drawRightString(A4[0] - MARGEM, 1.05 * cm, f"página {doc.page}")
        canvas.restoreState()
    return desenhar


def montar_markdown(achado: dict) -> str:
    criterios = "\n".join(f"- [ ] {item}" for item in achado.get("criterios", []))
    return (
        f"### [Segurança] {achado['titulo']}\n\n"
        f"**Labels:** `security`, `severidade/{achado['severidade']}`\n\n"
        f"**Problema**\n{achado['porque']}\n\n"
        f"**Evidência**\n`{achado['arquivo']}`\n\n"
        f"```\n{achado['trecho']}\n```\n\n"
        f"**Impacto**\n{achado['impacto']}\n\n"
        f"**Correção sugerida**\n{achado['correcao']}\n\n"
        f"**Critérios de aceite**\n{criterios}\n"
    )


def gerar(dados: dict, destino: Path) -> Path:
    destino.parent.mkdir(parents=True, exist_ok=True)
    titulo = dados["projeto"]
    try:
        data_texto = date.fromisoformat(str(dados["data"])).strftime("%d/%m/%Y")
    except ValueError:
        data_texto = str(dados["data"])
    achados = dados.get("achados", [])
    contagem = {sev: 0 for sev in SEVERIDADES}
    for achado in achados:
        contagem[achado["severidade"]] = contagem.get(achado["severidade"], 0) + 1
    total = len(achados)

    por_categoria: dict[str, int] = {}
    for achado in achados:
        por_categoria[achado["categoria"]] = por_categoria.get(achado["categoria"], 0) + 1

    documento = BaseDocTemplate(
        str(destino), pagesize=A4,
        leftMargin=MARGEM, rightMargin=MARGEM, topMargin=2.1 * cm, bottomMargin=1.9 * cm,
        title=f"Relatório de Auditoria de Segurança — {titulo}",
        author="Auditoria de segurança",
    )
    quadro = Frame(MARGEM, 1.9 * cm, LARGURA_UTIL, A4[1] - 2.1 * cm - 1.9 * cm, id="principal")
    documento.addPageTemplates([
        PageTemplate(id="pagina", frames=[quadro], onPage=cabecalho_rodape(titulo, data_texto)),
    ])

    historia: list = []

    # Capa
    historia.append(Spacer(1, 2.6 * cm))
    historia.append(p("SEGURANÇA DA INFORMAÇÃO", ESTILO_SUB))
    historia.append(Paragraph("Relatório de Auditoria de Segurança", ESTILO_TITULO))
    historia.append(Spacer(1, 0.15 * cm))
    historia.append(Paragraph(escape(titulo), ParagraphStyle(
        "Projeto", parent=ESTILO_TITULO, fontSize=15, leading=19,
        textColor=colors.HexColor(VERDE), spaceAfter=4,
    )))
    historia.append(Spacer(1, 0.3 * cm))
    historia.append(p(f"Data: {data_texto}", ESTILO_SUB))
    historia.append(Spacer(1, 1.2 * cm))

    info = [
        [p("Escopo auditado", ESTILO_PEQUENO), p(dados["escopo"], ESTILO_CORPO)],
        [p("Stack detectada", ESTILO_PEQUENO), p(dados["stack"], ESTILO_CORPO)],
        [p("Nota metodológica", ESTILO_PEQUENO), p(dados["notaMetodologica"], ESTILO_CORPO)],
    ]
    tabela_info = Table(info, colWidths=[4.0 * cm, LARGURA_UTIL - 4.0 * cm])
    tabela_info.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F9FAFB")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor(LINHA)),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor(LINHA)),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    historia.append(tabela_info)

    if dados.get("aviso"):
        historia.append(Spacer(1, 0.8 * cm))
        aviso = Table([[p(dados["aviso"], ESTILO_PEQUENO)]], colWidths=[LARGURA_UTIL])
        aviso.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FEF3C7")),
            ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#D97706")),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ]))
        historia.append(aviso)

    # Resumo executivo
    historia.append(PageBreak())
    historia.append(Paragraph("Resumo executivo", ESTILO_H2))

    linhas = [[
        Paragraph("<b>Severidade</b>", ESTILO_PEQUENO),
        Paragraph("<b>Quantidade</b>", ESTILO_PEQUENO),
    ]]
    for severidade in SEVERIDADES:
        if contagem.get(severidade):
            linhas.append([chip(severidade), p(str(contagem[severidade]))])
    linhas.append([p("Total", ESTILO_H3), p(str(total), ESTILO_H3)])

    tabela_resumo = Table(linhas, colWidths=[4.2 * cm, 3.0 * cm])
    tabela_resumo.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor(LINHA)),
        ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.HexColor(LINHA)),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F9FAFB")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    historia.append(tabela_resumo)
    historia.append(Spacer(1, 0.4 * cm))
    historia.append(Rosca(contagem, LARGURA_UTIL))
    historia.append(Spacer(1, 0.3 * cm))
    historia.append(Barras(por_categoria, LARGURA_UTIL))

    historia.append(Paragraph("Pontos fortes e fracos", ESTILO_H2))
    for item in dados.get("pontosFortes", []):
        historia.append(Paragraph(
            f'<font color="{CORES["forte"]}"><b>✓</b></font> {escape(item)}',
            ESTILO_CORPO,
        ))
    historia.append(Spacer(1, 0.2 * cm))
    criticos = [a for a in achados if a["severidade"] in ("crítica", "alta")]
    if criticos:
        historia.append(p("Riscos centrais:", ESTILO_H3))
        for achado in criticos:
            historia.append(Paragraph(f"• {escape(achado['titulo'])} ({achado['arquivo']})", ESTILO_CORPO))

    if dados.get("naoAplicavel"):
        historia.append(Spacer(1, 0.2 * cm))
        historia.append(p("Categorias não aplicáveis:", ESTILO_H3))
        for item in dados["naoAplicavel"]:
            historia.append(p(f"• {item}"))

    # Tabela de achados
    historia.append(Paragraph("Achados detalhados", ESTILO_H2))
    cabecalho = [
        Paragraph("<b>Severidade</b>", ESTILO_PEQUENO),
        Paragraph("<b>Arquivo:linha</b>", ESTILO_PEQUENO),
        Paragraph("<b>Descrição</b>", ESTILO_PEQUENO),
    ]
    corpo = [cabecalho]
    for achado in achados:
        corpo.append([
            chip(achado["severidade"]),
            p(achado["arquivo"], ESTILO_PEQUENO),
            Paragraph(f"<b>{escape(achado['titulo'])}</b><br/>{escape(achado['categoria'])}", ESTILO_PEQUENO),
        ])
    tabela_achados = Table(corpo, colWidths=[2.8 * cm, 4.6 * cm, LARGURA_UTIL - 7.4 * cm], repeatRows=1)
    tabela_achados.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor(LINHA)),
        ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.HexColor(LINHA)),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F9FAFB")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    historia.append(tabela_achados)

    # Detalhes
    historia.append(Paragraph("Detalhamento por achado", ESTILO_H2))
    for achado in achados:
        bloco: list = [
            Paragraph(f"{achado['id']} — {escape(achado['titulo'])}", ESTILO_H3),
            p(f"{achado['categoria']} · {achado['arquivo']}", ESTILO_PEQUENO),
            Spacer(1, 0.12 * cm),
            chip(achado["severidade"]),
            Spacer(1, 0.12 * cm),
            caixa_codigo(achado["trecho"]),
            Spacer(1, 0.1 * cm),
            p(f"Por que é explorável: {achado['porque']}"),
            p(f"Impacto: {achado['impacto']}"),
            p(f"Correção sugerida: {achado['correcao']}"),
        ]
        historia.append(KeepTogether(bloco))

    # Recomendações
    historia.append(Paragraph("Recomendações priorizadas", ESTILO_H2))
    prioridades = [
        ("P1 — imediato", [a for a in achados if a["severidade"] in ("crítica", "alta")]),
        ("P2 — próximo ciclo", [a for a in achados if a["severidade"] == "média"]),
        ("P3 — backlog", [a for a in achados if a["severidade"] in ("baixa", "informativa")]),
    ]
    for rotulo, lista in prioridades:
        if not lista:
            continue
        historia.append(p(rotulo, ESTILO_H3))
        for achado in lista:
            historia.append(p(f"• {achado['titulo']} — {achado['correcao']}"))

    # Issues
    historia.append(Paragraph("ISSUES PARA O GITHUB", ESTILO_H2))
    historia.append(p(
        "Cada bloco abaixo está pronto para copiar e colar como issue. Agrupe apenas quando "
        "os achados forem do mesmo tema, para não gerar spam."
    ))
    acionaveis = [a for a in achados if a.get("acionavel", True)]
    for indice, achado in enumerate(acionaveis, start=1):
        historia.append(Spacer(1, 0.25 * cm))
        historia.append(p(f"--- ISSUE {indice} ---", ESTILO_PEQUENO))
        historia.append(caixa_codigo(montar_markdown(achado)))
        historia.append(p(f"--- FIM ISSUE {indice} ---", ESTILO_PEQUENO))

    documento.build(historia)
    return destino


def main() -> None:
    parser = argparse.ArgumentParser(description="Gera o PDF do relatório de auditoria")
    parser.add_argument("--dados", type=Path, default=Path(__file__).parent / "exemplo.json")
    parser.add_argument("--saida", type=Path, default=Path(__file__).parent / "relatorio.pdf")
    args = parser.parse_args()

    dados = json.loads(args.dados.read_text(encoding="utf-8"))
    destino = gerar(dados, args.saida)
    print(f"Gerado: {destino}")


if __name__ == "__main__":
    main()
