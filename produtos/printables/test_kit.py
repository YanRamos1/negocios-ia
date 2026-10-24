"""Testes do Kit Financeiro em PDF.

Rodar com:
    python -m unittest discover -s produtos/printables -p "test_*.py"
"""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import gerar_kit  # noqa: E402
from pypdf import PdfReader  # noqa: E402

TITULOS = [
    "Orçamento mensal",
    "Controle de dívidas",
    "Metas de economia",
    "Registro de despesas",
    "Checklist do mês",
]


class KitTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.tmp = tempfile.TemporaryDirectory()
        cls.arquivo = gerar_kit.gerar(Path(cls.tmp.name) / "kit.pdf")
        cls.reader = PdfReader(str(cls.arquivo))
        cls.texto = "\n".join(pagina.extract_text() or "" for pagina in cls.reader.pages)

    @classmethod
    def tearDownClass(cls) -> None:
        cls.tmp.cleanup()

    def test_tem_seis_paginas(self) -> None:
        self.assertEqual(len(self.reader.pages), 6)

    def test_capa_tem_titulo(self) -> None:
        self.assertIn("Kit Financeiro", self.texto)

    def test_todas_as_secoes_aparecem(self) -> None:
        for titulo in TITULOS:
            with self.subTest(titulo=titulo):
                self.assertIn(titulo, self.texto)

    def test_arquivo_tem_tamanho_razoavel(self) -> None:
        tamanho = self.arquivo.stat().st_size
        self.assertGreater(tamanho, 3_000)
        self.assertLess(tamanho, 2_000_000)


if __name__ == "__main__":
    unittest.main()
