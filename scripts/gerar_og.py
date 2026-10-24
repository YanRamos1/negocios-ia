"""Gera as imagens de compartilhamento (1200x630) em public/og.

Uso:
    python scripts/gerar_og.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

LARGURA, ALTURA = 1200, 630
VERDE = (15, 118, 110)
VERDE_ESCURO = (11, 95, 88)
BRANCO = (255, 255, 255)
VERDE_CLARO = (236, 253, 245)

ITENS: dict[str, tuple[str, str]] = {
    "default": ("Calculadoras de impostos e trabalho", "Regras de 2026, cálculo testado"),
    "clt-pj": ("CLT x PJ", "Quanto sobra em cada regime"),
    "custo-importacao": ("Custo de importação", "Imposto, ICMS por estado e IOF"),
    "rescisao": ("Rescisão trabalhista", "Aviso, 13º, férias e multa do FGTS"),
    "precificacao-mei": ("Precificação para MEI", "Preço com margem real"),
    "taxa-marketplace": ("Taxa de marketplace", "Quanto sobra em cada canal"),
    "planilha-financeiro": ("Planilha Financeiro PF x PJ", "Controle e comparativo de 2026"),
    "kit-financeiro": ("Kit Financeiro imprimível", "Seis folhas A4, download grátis"),
    "sobre": ("Sobre as calculadoras", "Parâmetros versionados e testados"),
    "privacidade": ("Privacidade", "Cálculo no navegador, sem cadastro"),
}

FONTES_NEGRITO = [
    r"C:\Windows\Fonts\segoeuib.ttf",
    r"C:\Windows\Fonts\arialbd.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]
FONTES_REGULAR = [
    r"C:\Windows\Fonts\segoeui.ttf",
    r"C:\Windows\Fonts\arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]


def carregar(caminhos: list[str], tamanho: int) -> ImageFont.FreeTypeFont:
    for caminho in caminhos:
        if Path(caminho).exists():
            return ImageFont.truetype(caminho, tamanho)
    return ImageFont.load_default(size=tamanho)


def quebrar(texto: str, fonte: ImageFont.FreeTypeFont, largura: int) -> list[str]:
    palavras = texto.split()
    linhas: list[str] = []
    atual = ""
    for palavra in palavras:
        teste = f"{atual} {palavra}".strip()
        if fonte.getlength(teste) <= largura:
            atual = teste
        else:
            if atual:
                linhas.append(atual)
            atual = palavra
    if atual:
        linhas.append(atual)
    return linhas


def gerar(slug: str, titulo: str, subtitulo: str, destino: Path) -> Path:
    imagem = Image.new("RGB", (LARGURA, ALTURA), VERDE)
    desenho = ImageDraw.Draw(imagem)

    desenho.rectangle([0, ALTURA - 12, LARGURA, ALTURA], fill=VERDE_ESCURO)
    desenho.ellipse([LARGURA - 240, -120, LARGURA + 120, 240], fill=VERDE_ESCURO)

    fonte_titulo = carregar(FONTES_NEGRITO, 78)
    fonte_sub = carregar(FONTES_REGULAR, 36)
    fonte_rodape = carregar(FONTES_NEGRITO, 30)

    margem = 80
    largura_texto = LARGURA - margem * 2 - 80
    linhas = quebrar(titulo, fonte_titulo, largura_texto)

    altura_bloco = len(linhas) * 92
    y = (ALTURA - altura_bloco) // 2 - 40

    for linha in linhas:
        desenho.text((margem, y), linha, font=fonte_titulo, fill=BRANCO)
        y += 92

    y += 12
    for linha in quebrar(subtitulo, fonte_sub, largura_texto):
        desenho.text((margem, y), linha, font=fonte_sub, fill=VERDE_CLARO)
        y += 48

    desenho.text((margem, ALTURA - 78), "calculadoras", font=fonte_rodape, fill=BRANCO)

    destino.parent.mkdir(parents=True, exist_ok=True)
    imagem.save(destino, "PNG", optimize=True)
    return destino


def main() -> None:
    raiz = Path(__file__).resolve().parent.parent
    pasta = raiz / "public" / "og"
    for slug, (titulo, subtitulo) in ITENS.items():
        gerar(slug, titulo, subtitulo, pasta / f"{slug}.png")
    print(f"Geradas {len(ITENS)} imagens em {pasta}")


if __name__ == "__main__":
    main()
