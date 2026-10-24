"""Testes do gerador de relatório de auditoria."""

from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import gerar_relatorio  # noqa: E402
from pypdf import PdfReader  # noqa: E402


class RelatorioTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.tmp = tempfile.TemporaryDirectory()
        dados = json.loads((Path(__file__).parent / "exemplo.json").read_text(encoding="utf-8"))
        cls.arquivo = gerar_relatorio.gerar(dados, Path(cls.tmp.name) / "relatorio.pdf")
        cls.reader = PdfReader(str(cls.arquivo))
        cls.texto = "\n".join(pagina.extract_text() or "" for pagina in cls.reader.pages)

    @classmethod
    def tearDownClass(cls) -> None:
        cls.tmp.cleanup()

    def test_tem_paginas_suficientes(self) -> None:
        self.assertGreaterEqual(len(self.reader.pages), 6)

    def test_capa_tem_projeto_e_data(self) -> None:
        self.assertIn("Relatório de Auditoria de Segurança", self.texto)
        self.assertIn("App Exemplo", self.texto)
        self.assertIn("23/10/2026", self.texto)

    def test_resumo_e_secoes_obrigatorias(self) -> None:
        for secao in [
            "Resumo executivo",
            "Pontos fortes e fracos",
            "Achados detalhados",
            "Recomendações priorizadas",
            "ISSUES PARA O GITHUB",
            "--- ISSUE 1 ---",
            "--- FIM ISSUE 1 ---",
        ]:
            with self.subTest(secao=secao):
                self.assertIn(secao, self.texto)

    def test_issues_tem_titulo_e_criterios(self) -> None:
        self.assertIn("[Segurança]", self.texto)
        self.assertIn("Critérios de aceite", self.texto)

    def test_arquivo_tem_tamanho_razoavel(self) -> None:
        tamanho = self.arquivo.stat().st_size
        self.assertGreater(tamanho, 8_000)
        self.assertLess(tamanho, 4_000_000)


if __name__ == "__main__":
    unittest.main()
