# Prompt de auditoria (referência)

Use este arquivo como contrato de execução. Troque `<PROJETO>` e `<CAMINHO>` antes de rodar.

---

Revisa este código atrás de cinco falhas de segurança. Antes de começar, detecte a stack do
projeto (linguagem, framework, ORM/query builder, mecanismo de auth, frontend, arquivos de
deploy como Docker/CI/Helm/Terraform) e adapte cada categoria ao equivalente dessa stack:

1. **BANCO SEM TRANCA (isolamento de inquilino/dono)** — em Supabase é RLS ausente; em APIs
   próprias são queries de listagem/busca/agregação/relatório/exportação que não filtram pelo
   usuário autenticado ou pela organização/workspace/tenant. Identifique primeiro QUAL é o
   mecanismo de isolamento do projeto (RLS, middleware de tenant, filtro manual por user_id)
   e aponte onde ele está ausente ou furado.

2. **PERMISSÃO DEFINIDA NO NAVEGADOR** — operações privilegiadas (admin, configurações,
   gestão de usuários, escrita) em que o frontend esconde a UI por papel (isAdmin, canEdit,
   role) mas o servidor NÃO faz a verificação equivalente. Cruze cada gate de papel do
   frontend com o endpoint correspondente e confirme se o backend valida o privilégio em toda
   rota sensível.

3. **IDOR** — rotas que buscam, alteram ou deletam um objeto por ID (path, query ou body) sem
   verificar se o objeto pertence ao usuário/tenant do chamador. Percorra sistematicamente
   TODOS os handlers de rota do backend, não amostras.

4. **CHAVES EXPOSTAS (hardcode)** — API keys, tokens, senhas, segredos de assinatura (JWT,
   webhooks), chaves privadas e credenciais padrão embutidos no código-fonte, configs,
   docker-compose, charts, CI, scripts e documentação. Atenção a defaults públicos que viram
   segredo real se não forem sobrescritos (ex.: `${VAR:-valor-default}`) e à ausência de
   validação de startup que rejeite esses defaults. Verifique também o histórico git e o
   bundle do frontend por chaves embutidas.

5. **INPUTS SEM TRATAMENTO (XSS)** — no frontend: innerHTML/dangerouslySetInnerHTML/
   equivalentes (v-html, [innerHTML], dangerouslySet...), renderização de markdown/HTML sem
   sanitização, URLs controladas por usuário em href/src (javascript:), eval/new Function.
   No backend: input do usuário entrando em HTML de e-mails, templates ou respostas sem
   escape. Verifique se existe lib de sanitização e se é aplicada nos pontos encontrados.

## Regras

- Reportar apenas achados verificados no código real. Nada de especulação.
- Para cada achado: caminho do arquivo, linha(s) exata(s), trecho, por que é explorável e
  severidade (crítica/alta/média/baixa/informativa).
- Listar arquivo por arquivo, linha por linha.
- Registrar o que foi verificado e está CORRETO (seção de pontos fortes).
- Quando a categoria não se aplicar à stack, dizer explicitamente.
- Notar condições de explorabilidade (feature flags, config insegura necessária).

## Saída

1. Relatório em PDF, pt-BR, em `docs/security-audit/relatorio-auditoria-seguranca.pdf`:
   capa, resumo executivo com gráficos (rosca por severidade, barras por categoria), pontos
   fortes e fracos, tabela de achados com chip de severidade, recomendações priorizadas e, ao
   final, a seção "ISSUES PARA O GITHUB" com o markdown completo de cada issue entre
   `--- ISSUE n ---` e `--- FIM ISSUE n ---`.
2. Lista de achados no chat, arquivo por arquivo.
3. Caminho de todos os arquivos gerados.

## Regras técnicas do PDF

- Ambiente isolado (venv com reportlab + matplotlib) ou HTML→PDF.
- Script gerador versionado em `docs/security-audit/`.
- Verificar páginas, gráficos e legibilidade; rasterizar e corrigir defeitos.
- A4, margens ~2 cm, cabeçalho/rodapé com nome do relatório e número de página.
