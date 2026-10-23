import {
  calcularCenario,
  formatBRL,
  formatPercent,
  type Canal,
} from '../../ferramentas/taxa-marketplace/src/index';

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

const form = el<HTMLFormElement>('form-canal');
const preco = el<HTMLInputElement>('preco');
const custo = el<HTMLInputElement>('custo');
const frete = el<HTMLInputElement>('frete');
const imposto = el<HTMLInputElement>('imposto');
const margem = el<HTMLInputElement>('margem');
const resultado = el<HTMLElement>('resultado');

const lerCanais = (): Canal[] => {
  const canais: Canal[] = [];
  for (let i = 1; i <= 3; i += 1) {
    const nome = el<HTMLInputElement>(`canal-${i}-nome`).value.trim() || `Canal ${i}`;
    const comissao = parseNumero(el<HTMLInputElement>(`canal-${i}-comissao`).value) / 100;
    const taxaFixa = centavos(el<HTMLInputElement>(`canal-${i}-fixa`).value);
    canais.push({ nome, comissao, taxaFixaCents: taxaFixa });
  }
  return canais;
};

const renderizar = (): void => {
  const r = calcularCenario({
    precoCents: centavos(preco.value),
    custoCents: centavos(custo.value),
    freteCents: centavos(frete.value),
    impostoPercentual: parseNumero(imposto.value) / 100,
    margemAlvo: parseNumero(margem.value) / 100,
    canais: lerCanais(),
  });

  const linhas = r.canais
    .map((canal) => {
      const destaque = canal.nome === r.melhor ? ' class="melhor"' : '';
      const status = canal.viavel
        ? ''
        : '<span class="alerta">abaixo do mínimo</span>';
      return `
        <tr${destaque}>
          <td>${canal.nome} ${status}</td>
          <td>${formatBRL(canal.comissaoCents)}${canal.taxaFixaCents ? ` + ${formatBRL(canal.taxaFixaCents)}` : ''}</td>
          <td>${formatBRL(canal.impostoCents)}</td>
          <td><strong>${formatBRL(canal.sobraCents)}</strong></td>
          <td>${formatPercent(canal.margem, 1)}</td>
          <td>${canal.precoMinimoCents > 0 ? formatBRL(canal.precoMinimoCents) : '—'}</td>
        </tr>`;
    })
    .join('');

  resultado.hidden = false;
  resultado.innerHTML = `
    <p class="veredito">${
      r.melhor ? `${r.melhor} deixa mais dinheiro no bolso` : 'Nenhum canal fecha a margem alvo neste preço'
    }</p>
    <table class="tabela">
      <thead>
        <tr>
          <th>Canal</th>
          <th>Comissão</th>
          <th>Imposto</th>
          <th>Sobra</th>
          <th>Margem</th>
          <th>Preço mínimo</th>
        </tr>
      </thead>
      <tbody>${linhas}</tbody>
    </table>
    <p class="aviso-legal">
      Preço mínimo é o valor que entrega a margem alvo depois de custo, frete, comissão e
      imposto. Comissão e taxa fixa são as que você informou — confirme no painel do canal.
    </p>
  `;
};

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  renderizar();
});
form.addEventListener('input', renderizar);

renderizar();
