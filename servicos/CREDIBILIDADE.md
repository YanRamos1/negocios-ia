# Formulário de credibilidade

Página: `/interno/credenciais/` (noindex, fora do sitemap e do menu).

Ela gera os três arquivos de configuração prontos para colar e valida o que falta — sem
salvar nada em servidor.

## O que preencher e como obter

### Identidade → `src/config/autor.ts`

| Campo | Como obter |
|---|---|
| Nome | O mesmo que aparece no contrato e no LinkedIn. |
| Cargo | Uma linha com área real. Evite "especialista" sem área. |
| Bio (280) | Responda: o que faz, em que tipo de sistema, qual resultado entrega. |
| GitHub | github.com → seu perfil → copie a URL da barra. |
| LinkedIn | Perfil → "Mais" → "Copiar link do perfil"; remova o `?` e o que vem depois. |

### Contato → `src/config/contato.ts`

| Campo | Como obter |
|---|---|
| E-mail | Sem domínio: alias no Gmail (Configurações → Contas → "Enviar como"). Com domínio: Registro.br (~R$ 40/ano) + Cloudflare Email Routing (grátis) encaminhando ao Gmail. |
| WhatsApp | WhatsApp Business → Configurações → toque no nome → telefone. Use `55` + DDD + número, só dígitos. |

### Prova → `src/config/prova.ts`

| Campo | Como obter |
|---|---|
| Cliente/setor | Só com autorização por escrito. Sem ela, use setor e porte ("fintech de 80 pessoas"). |
| Setor e contexto | Uma linha: setor, tipo de sistema, tamanho. |
| Resultado | Número que você prova: achados, prazo de correção, cobertura. |
| Autorização | `sim`, `anonimo` ou `nao`. Só `sim` com e-mail/contrato que permita citar. |

## Depois de gerar

1. Colar os três blocos nos arquivos indicados.
2. Enviar um e-mail de teste para o endereço informado.
3. Abrir o link do WhatsApp e conferir a mensagem pronta.
4. Rodar `npm run typecheck && npm test`.
5. Publicar.

Sem prova autorizada, a seção "Resultado em cliente" não aparece — o que é melhor do que
citar cliente sem permissão.
