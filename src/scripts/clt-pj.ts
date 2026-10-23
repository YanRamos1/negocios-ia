import { comparar, formatBRL, formatPercent } from '../../ferramentas/clt-pj/src/index';

const el = <T extends HTMLElement>(id: string): T => {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Elemento #${id} não encontrado`);
  return node as T;
};

const parseNumero = (valor: string): number => {
  const limpo = valor.replace(/[^\d,.-]/g, '').trim();
  if (!limpo) return 0;
  const ultimaVirgula = limpo.lastIndexOf(',');
  const ultimoPonto = limpo.lastIndexOf('.');
  const normalizado =
    ultimaVirgula > ultimoPonto
      ? limpo.replace(/\./g, '').replace(',', '.')
      : limpo.replace(/,/g, '');
  const numero = Number(normalizado);
  return Number.isFinite(numero) ? numero : 0;
};

const reais = (valor: string): number => Math.round(parseNumero(valor) * 100);

const form = el<HTMLFormElement>('form-calc');
const salario = el<HTMLInputElement>('salario');
const faturamento = el<HTMLInputElement>('faturamento');
const despesas = el<HTMLInputElement>('despesas');
const beneficios = el<HTMLInputElement>('beneficios');
const dependentes = el<HTMLInputElement>('dependentes');
const encargos = el<HTMLInputElement>('encargos');
const prolabore = el<HTMLInputElement>('prolabore');
const modoProlabore = el<HTMLInputElement>('modo-prolabore');
const resultado = el<HTMLElement>('resultado');

const sincronizarProlabore = (): void => {
  if (modoProlabore.checked) {
    const calculado = Math.round(reais(faturamento.value) * 0.28);
    prolabore.value = (calculado / 100).toFixed(2).replace('.', ',');
    prolabore.disabled = true;
  } else {
    prolabore.disabled = false;
  }
};

const renderizar = (): void => {
  sincronizarProlabore();

  const modoPercentual = modoProlabore.checked;
  const dependentesNum = Math.max(0, Math.round(parseNumero(dependentes.value)));
  const pjInput = {
    faturamentoMensalCents: reais(faturamento.value),
    despesasMensaisCents: reais(despesas.value),
    dependentes: dependentesNum,
    ...(modoPercentual
      ? { prolaborePercentualFaturamento: 0.28 }
      : { prolaboreCents: reais(prolabore.value) }),
  };

  const res = comparar(
    {
      salarioBrutoCents: reais(salario.value),
      dependentes: dependentesNum,
      beneficiosCents: reais(beneficios.value),
      encargosPatronais: parseNumero(encargos.value) / 100,
    },
    pjInput,
  );

  const textoVeredito =
    res.veredito === 'PJ'
      ? 'Neste cenário, PJ entrega mais líquido'
      : res.veredito === 'CLT'
        ? 'Neste cenário, CLT entrega mais líquido'
        : 'Empate técnico entre CLT e PJ';

  const equivalente = res.faturamentoEquivalenteCents
    ? formatBRL(res.faturamentoEquivalenteCents)
    : 'acima de R$ 1 milhão/mês';

  resultado.hidden = false;
  resultado.innerHTML = `
    <p class="veredito">${textoVeredito}</p>
    <div class="grid-resultado">
      <div class="bloco${res.veredito === 'CLT' ? ' destaque' : ''}">
        <h3>CLT</h3>
        <div class="valor">${formatBRL(res.clt.liquidoMensalCents)}<small> /mês</small></div>
        <div class="linhas">
          <div><span>Salário bruto</span><span>${formatBRL(res.clt.salarioBrutoCents)}</span></div>
          <div><span>INSS</span><span>- ${formatBRL(res.clt.inssCents)}</span></div>
          <div><span>IRRF</span><span>- ${formatBRL(res.clt.irrfCents)}</span></div>
          <div><span>Benefícios</span><span>+ ${formatBRL(res.clt.beneficiosCents)}</span></div>
          <div><span>Custo para a empresa</span><span>${formatBRL(res.clt.custoEmpregadorMensalCents)}</span></div>
        </div>
      </div>
      <div class="bloco${res.veredito === 'PJ' ? ' destaque' : ''}">
        <h3>PJ (Simples Nacional)</h3>
        <div class="valor">${formatBRL(res.pj.liquidoMensalCents)}<small> /mês</small></div>
        <div class="linhas">
          <div><span>Faturamento</span><span>${formatBRL(res.pj.faturamentoMensalCents)}</span></div>
          <div><span>DAS (${formatPercent(res.pj.aliquotaEfetiva)})</span><span>- ${formatBRL(res.pj.dasCents)}</span></div>
          <div><span>Anexo</span><span>${res.pj.anexo} (fator R ${formatPercent(res.pj.fatorR, 1)})</span></div>
          <div><span>INSS do pró-labore</span><span>- ${formatBRL(res.pj.inssProlaboreCents)}</span></div>
          <div><span>IRRF do pró-labore</span><span>- ${formatBRL(res.pj.irrfProlaboreCents)}</span></div>
          <div><span>Despesas</span><span>- ${formatBRL(res.pj.despesasMensaisCents)}</span></div>
        </div>
      </div>
    </div>
    <table class="tabela">
      <thead>
        <tr><th>Comparação</th><th>CLT</th><th>PJ</th></tr>
      </thead>
      <tbody>
        <tr><td>Líquido mensal</td><td>${formatBRL(res.clt.liquidoMensalCents)}</td><td>${formatBRL(res.pj.liquidoMensalCents)}</td></tr>
        <tr><td>Líquido anual</td><td>${formatBRL(res.clt.liquidoAnualCents)}</td><td>${formatBRL(res.pj.liquidoAnualCents)}</td></tr>
        <tr><td>Diferença mensal</td><td colspan="2">${formatBRL(Math.abs(res.diferencaMensalCents))} a favor do ${res.veredito === 'empate' ? 'empate' : res.veredito}</td></tr>
        <tr><td>Faturamento PJ para empatar</td><td colspan="2">${equivalente}</td></tr>
      </tbody>
    </table>
  `;
};

const aplicarQuery = (): void => {
  const params = new URLSearchParams(location.search);
  const mapa: Record<string, HTMLInputElement> = {
    s: salario,
    f: faturamento,
    d: despesas,
    b: beneficios,
    dep: dependentes,
  };
  for (const [chave, campo] of Object.entries(mapa)) {
    const valor = params.get(chave);
    if (valor) campo.value = valor;
  }
  const modo = params.get('modo');
  if (modo === 'fixo') modoProlabore.checked = false;
};

const compartilhar = async (): Promise<void> => {
  const params = new URLSearchParams({
    s: salario.value,
    f: faturamento.value,
    d: despesas.value,
    dep: dependentes.value,
    modo: modoProlabore.checked ? '28' : 'fixo',
  });
  const url = `${location.origin}${location.pathname}?${params.toString()}`;
  try {
    await navigator.clipboard.writeText(url);
    el<HTMLButtonElement>('compartilhar').textContent = 'Link copiado';
  } catch {
    el<HTMLButtonElement>('compartilhar').textContent = url;
  }
};

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  renderizar();
});

form.addEventListener('input', renderizar);
el<HTMLButtonElement>('compartilhar').addEventListener('click', compartilhar);

aplicarQuery();
renderizar();
