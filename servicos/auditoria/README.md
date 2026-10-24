# Auditoria de segurança — kit

- `PROMPT-AUDITORIA.md` — contrato de execução (cinco categorias, regras, saída).
- `gerar_relatorio.py` — gera o PDF a partir de um JSON de achados.
- `exemplo.json` — dados **fictícios** que alimentam o relatório de demonstração.
- `requirements.txt` — reportlab + pypdf, para ambiente isolado.

## Regerar

```
python -m venv .venv-audit
.venv-audit/bin/pip install -r servicos/auditoria/requirements.txt   # Windows: .venv-audit\Scripts\pip
.venv-audit/bin/python servicos/auditoria/gerar_relatorio.py \
  --dados servicos/auditoria/exemplo.json \
  --saida public/auditoria/relatorio-exemplo.pdf
```

No Windows, use `.venv-audit\Scripts\python.exe` e caminhos com `\`.

## Uso em cliente

1. Rodar o prompt de `PROMPT-AUDITORIA.md` sobre o repositório real.
2. Preencher um JSON no formato de `exemplo.json` com os achados verificados.
3. Gerar o PDF e revisar a renderização (rasterizar as páginas).
4. Entregar PDF + issues.

## Verificação

```
.venv-audit/bin/python -m unittest discover -s servicos/auditoria -p "test_*.py"
```

Os testes abrem o PDF gerado e conferem páginas, seções obrigatórias, presença dos blocos
de issue e tamanho do arquivo.
