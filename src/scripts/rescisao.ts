import {
  calcularRescisao,
  formatBRL,
  type ModoAviso,
  type TipoRescisao,
} from '../../ferramentas/rescisao/src/index';

const el = <T extends HTMLElement>(id: string): T => {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Elemento #${id} não encontrado`);
  return node as T;
};

const apenasDigitos = (valor: string): string => valor.replace(/\D/g, '');

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

const centavos = (valor: string): number => Math.round(parseNumero(valor) * 100);

const form = el<HTMLFormElement>('form-rescisao');
const salario = el<HTMLInputElement>('salario');
const admissao = el<HTMLInputElement>('admissao');
const desligamento = el<HTMLInputElement>('desligamento');
const tipo = el<HTMLSelectElement>('tipo');
const aviso = el<HTMLSelectElement>('aviso');
const fgts = el<HTMLInputElement>('fgts');
const feriasVencidas = el<HTMLSelectElement>('ferias-vencidas');
const dependentes = el<HTMLInputElement>('dependentes');
const resultado = el<HTMLElement>('resultado');

const dataBr = (iso: string): string => {
  if (!iso) return '—';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
};

const renderizar = (): void => {
  if (!admissao.value || !desligamento.value) {
    resultado.hidden = true;
    return;
  }

  if (desligamento.value < admissao.value) {
    resultado.hidden = false;
    resultado.innerHTML =
      '<p class="aviso-legal" style="color:#b91c1c">A data de desligamento é anterior à admissão.</p>';
    return;
  }

  const res = calcularRescisao({
    salarioCents: centavos(salario.value),
    admissao: admissao.value,
    desligamento: desligamento.value,
    tipo: tipo.value as TipoRescisao,
    aviso: aviso.value as ModoAviso,
    fgtsCents: centavos(fgts.value),
    feriasVencidasPeriodos: Number(apenasDigitos(feriasVencidas.value) || '0'),
    dependentes: Number(apenasDigitos(dependentes.value) || '0'),
  });

  const linhas = res.verbas
    .map(
      (verba) => `
        <tr>
          <td>${verba.rotulo}${verba.detalhe ? ` <small>(${verba.detalhe})</small>` : ''}</td>
          <td>${formatBRL(verba.valorCents)}</td>
        </tr>`,
    )
    .join('');

  resultado.hidden = false;
  resultado.innerHTML = `
    <p class="veredito">${res.rotuloTipo}</p>
    <div class="grid-resultado">
      <div class="bloco destaque">
        <h3>Líquido a receber</h3>
        <div class="valor">${formatBRL(res.liquidoCents)}</div>
        <div class="linhas">
          <div><span>Total bruto</span><span>${formatBRL(res.totalBrutoCents)}</span></div>
          <div><span>INSS</span><span>- ${formatBRL(res.inssCents)}</span></div>
          <div><span>IRRF</span><span>- ${formatBRL(res.irrfCents)}</span></div>
          <div><span>Aviso não cumprido</span><span>- ${formatBRL(res.descontoAvisoCents)}</span></div>
          <div><span>Total de descontos</span><span>${formatBRL(res.totalDescontosCents)}</span></div>
        </div>
      </div>
      <div class="bloco">
        <h3>Tempo e aviso</h3>
        <div class="linhas">
          <div><span>Tempo de casa</span><span>${res.anosCompletos} ano(s)</span></div>
          <div><span>Dias de aviso</span><span>${res.diasAviso}</span></div>
          <div><span>Projeção do contrato</span><span>${dataBr(res.dataProjetada)}</span></div>
          <div><span>Meses de férias</span><span>${res.mesesFerias}/12</span></div>
          <div><span>Meses de 13º</span><span>${res.mesesDecimoTerceiro}/12</span></div>
          <div><span>Multa do FGTS</span><span>${formatBRL(res.multaFgtsCents)}</span></div>
        </div>
      </div>
    </div>
    <table class="tabela">
      <thead><tr><th>Verba</th><th>Valor</th></tr></thead>
      <tbody>${linhas}</tbody>
    </table>
    <p class="aviso-legal">
      Não inclui horas extras, comissões, adicionais, férias gozadas no mês, plano de saúde
      ou descontos de pensão. O valor da multa do FGTS usa o saldo que você informou.
    </p>
  `;
};

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  renderizar();
});
form.addEventListener('input', renderizar);

const aplicarQuery = (): void => {
  const params = new URLSearchParams(location.search);
  const mapa: Record<string, HTMLInputElement | HTMLSelectElement> = {
    s: salario,
    adm: admissao,
    des: desligamento,
    fgts,
    tipo,
    aviso,
  };
  for (const [chave, campo] of Object.entries(mapa)) {
    const valor = params.get(chave);
    if (valor) campo.value = valor;
  }
};

aplicarQuery();
renderizar();
