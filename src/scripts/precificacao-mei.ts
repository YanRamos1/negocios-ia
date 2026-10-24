import { calcularPreco, formatBRL, formatPercent } from '../../ferramentas/precificacao-mei/src/index';

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

const form = el<HTMLFormElement>('form-preco');
const material = el<HTMLInputElement>('material');
const horas = el<HTMLInputElement>('horas');
const valorHora = el<HTMLInputElement>('valor-hora');
const embalagem = el<HTMLInputElement>('embalagem');
const fixos = el<HTMLInputElement>('fixos');
const das = el<HTMLInputElement>('das');
const pecas = el<HTMLInputElement>('pecas');
const taxa = el<HTMLInputElement>('taxa');
const margem = el<HTMLInputElement>('margem');
const resultado = el<HTMLElement>('resultado');

const renderizar = (): void => {
  const margemValor = parseNumero(margem.value) / 100;
  const taxaValor = parseNumero(taxa.value) / 100;

  if (margemValor + taxaValor >= 1) {
    resultado.hidden = false;
    resultado.innerHTML =
      '<p class="aviso-legal" style="color:#b91c1c">Margem + taxa de venda precisa ser menor que 100%.</p>';
    return;
  }

  const r = calcularPreco({
    materialCents: centavos(material.value),
    horasPorPeca: parseNumero(horas.value),
    valorHoraCents: centavos(valorHora.value),
    embalagemCents: centavos(embalagem.value),
    custosFixosCents: centavos(fixos.value),
    dasCents: centavos(das.value),
    pecasMes: parseNumero(pecas.value),
    taxaVenda: taxaValor,
    margemDesejada: margemValor,
  });

  resultado.hidden = false;
  resultado.innerHTML = `
    <p class="veredito">Preço que entrega ${formatPercent(margemValor, 0)} de margem</p>
    <div class="grid-resultado">
      <div class="bloco destaque">
        <h3>Preço de venda</h3>
        <div class="valor">${formatBRL(r.precoSugeridoCents)}</div>
        <div class="linhas">
          <div><span>Custo total por peça</span><span>${formatBRL(r.custoTotalCents)}</span></div>
          <div><span>Taxa do canal</span><span>- ${formatBRL(r.taxaVendaCents)}</span></div>
          <div><span>Lucro por peça</span><span>${formatBRL(r.lucroCents)}</span></div>
          <div><span>Margem efetiva</span><span>${formatPercent(r.margemEfetiva, 1)}</span></div>
          <div><span>Markup sobre o custo</span><span>${r.markup.toFixed(2)}x</span></div>
        </div>
      </div>
      <div class="bloco">
        <h3>De onde vem o custo</h3>
        <div class="linhas">
          <div><span>Material</span><span>${formatBRL(r.custoMaterialCents)}</span></div>
          <div><span>Mão de obra</span><span>${formatBRL(r.custoMaoObraCents)}</span></div>
          <div><span>Embalagem/frete</span><span>${formatBRL(r.custoEmbalagemCents)}</span></div>
          <div><span>Custo fixo rateado</span><span>${formatBRL(r.custoFixoRateadoCents)}</span></div>
          <div><span>Peças para empatar</span><span>${r.pontoEquilibrioPecas}/mês</span></div>
        </div>
      </div>
    </div>
    <p class="aviso-legal">
      O ponto de equilíbrio mostra quantas peças por mês pagam os custos fixos e o DAS.
      Abaixo disso, o negócio opera no prejuízo.
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
  const mapa: Record<string, HTMLInputElement> = {
    m: material,
    h: horas,
    vh: valorHora,
    e: embalagem,
    f: fixos,
    d: das,
    p: pecas,
    t: taxa,
    mg: margem,
  };
  for (const [chave, campo] of Object.entries(mapa)) {
    const valor = params.get(chave);
    if (valor) campo.value = valor;
  }
};

aplicarQuery();
renderizar();
