# negocios-ia

Workspace dos produtos digitais. Tudo digital (sem produto físico), público PT-BR,
construído com apoio dos agentes (`agy`, `cmdc`, `cursor-agent`) e Python/Node.

## Documentos

- [ACOMPANHAMENTO.md](./ACOMPANHAMENTO.md) — board de status, log e decisões. **Fonte única de verdade.**
- [IDEIAS.md](./IDEIAS.md) — backlog bruto de ideias e restrições.

## Estrutura

```
ferramentas/      sites com SEO: calculadoras e geradores
produtos/         planilhas, templates e materiais empacotados
livros-ilustrados/ pipeline de PDF ilustrado (digital)
_infra/           base compartilhada: layout, SEO, analytics, deploy
```

## Regras

- Cada projeto é autocontido: roda sozinho, sem dependência cruzada de outro projeto.
- Conteúdo e copy em PT-BR; código e nomes de variáveis em inglês.
- Cálculo é sempre determinístico e coberto por teste. Nunca delegar número a LLM em runtime.
- Uso de IA em imagem/texto: declarar onde a plataforma exigir (Etsy, KDP).
- Nenhum segredo no repositório — `.env` fica fora do git.

## Convenção de commit

```
feat(<projeto>): <o que entrou>
fix(<projeto>): <o que corrigiu>
docs(<projeto>): <documentação>
chore: <infra, deps, config>
```

Toda mudança de status deve atualizar o `ACOMPANHAMENTO.md` no mesmo commit.
