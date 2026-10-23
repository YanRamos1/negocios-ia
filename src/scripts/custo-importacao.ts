import {
  calcularImportacao,
  formatBRL,
  formatPercent,
  formatUSD,
} from '../../ferramentas/custo-importacao/src/index';

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

const centavos = (valor: string): number => Math.round(parseNumero(valor) * 100);

const form = el<HTMLFormElement>('form-importacao');
const produto = el<HTMLInputElement>('produto');
const frete = el<HTMLInputElement>('frete');
const seguro = el<HTMLInputElement>('seguro');
const cotacao = el<HTMLInputElement>('cotacao');
const uf = el<HTMLSelectElement>('uf');
const prc = el<HTMLInputElement>('prc');
const iof = el<HTMLInputElement>('iof');
const taxas = el<HTMLInputElement>('taxas');
const resultado = el<HTMLElement>('resultado');

const rotuloFaixa = (faixa: string): string => {
  if (faixa === 'isento') return 'Remessa Conforme — II zero';
  if (faixa === 'fora-do-regime') return 'Acima de US$ 3.000 — regime fora do simulador';
  return 'Tributado em 60%';
};

const renderizar = (): void => {
  const res = calcularImportacao({
    produtoUsdCents: centavos(produto.value),
    freteUsdCents: centavos(frete.value),
    seguroUsdCents: centavos(seguro.value),
    cotacaoCents: centavos(cotacao.value) || 500,
    uf: uf.value,
    remessaConforme: prc.checked,
    iofPercentual: parseNumero(iof.value) / 100,
    outrasTaxasCents: centavos(taxas.value),
  });

  resultado.hidden = false;
  resultado.innerHTML = `
    <p class="veredito">${rotuloFaixa(res.faixa)}</p>
    <div class="grid-resultado">
      <div class="bloco destaque">
        <h3>Custo final</h3>
        <div class="valor">${formatBRL(res.custoFinalCents)}</div>
        <div class="linhas">
          <div><span>Valor aduaneiro</span><span>${formatBRL(res.valorAduaneiroCents)}</span></div>
          <div><span>Impostos</span><span>${formatBRL(res.totalImpostosCents)}</span></div>
          <div><span>Peso dos impostos</span><span>${formatPercent(res.percentualEfetivo, 1)}</span></div>
          <div><span>Valor em dólar</span><span>${formatUSD(res.valorAduaneiroUsdCents)}</span></div>
        </div>
      </div>
      <div class="bloco">
        <h3>Composição</h3>
        <div class="linhas">
          <div><span>Imposto de importação (${formatPercent(res.aliquotaII, 0)})</span><span>${formatBRL(res.iiCents)}</span></div>
          <div><span>ICMS ${uf.value} (${formatPercent(res.aliquotaIcms, 0)})</span><span>${formatBRL(res.icmsCents)}</span></div>
          <div><span>IOF do cartão</span><span>${formatBRL(res.iofCents)}</span></div>
          <div><span>Outras taxas</span><span>${formatBRL(res.outrasTaxasCents)}</span></div>
          <div><span>Base do ICMS</span><span>${formatBRL(res.baseIcmsCents)}</span></div>
          <div><span>Total</span><span>${formatBRL(res.totalImpostosCents)}</span></div>
        </div>
      </div>
    </div>
    <p class="aviso-legal">
      ${
        res.acimaDoLimite
          ? 'Acima de US$ 3.000 a importação não usa o regime simplificado. Procure um despachante.'
          : res.faixa === 'isento'
            ? 'Compra de até US$ 50 em site certificado no Remessa Conforme: imposto de importação zero. O ICMS continua sendo cobrado.'
            : res.descontoUsdCents > 0
              ? `Aplicado o desconto fixo de ${formatUSD(res.descontoUsdCents)} no imposto de importação.`
              : 'Site não certificado no Remessa Conforme: 60% de imposto de importação, sem desconto.'
      }
    </p>
  `;
};

const aplicarQuery = (): void => {
  const params = new URLSearchParams(location.search);
  const mapa: Record<string, HTMLInputElement | HTMLSelectElement> = {
    p: produto,
    f: frete,
    c: cotacao,
    uf,
  };
  for (const [chave, campo] of Object.entries(mapa)) {
    const valor = params.get(chave);
    if (valor) campo.value = valor;
  }
  if (params.get('prc') === '0') prc.checked = false;
};

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  renderizar();
});
form.addEventListener('input', renderizar);

aplicarQuery();
renderizar();
