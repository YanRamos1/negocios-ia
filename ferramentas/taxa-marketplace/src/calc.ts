export interface Canal {
  nome: string;
  comissao: number;
  taxaFixaCents: number;
}

export interface CenarioInput {
  precoCents: number;
  custoCents: number;
  freteCents?: number;
  impostoPercentual?: number;
  margemAlvo?: number;
  canais: Canal[];
}

export interface CanalResultado {
  nome: string;
  comissao: number;
  comissaoCents: number;
  taxaFixaCents: number;
  impostoCents: number;
  custoTotalCents: number;
  sobraCents: number;
  margem: number;
  precoMinimoCents: number;
  viavel: boolean;
}

export interface CenarioResultado {
  precoCents: number;
  custoCents: number;
  freteCents: number;
  impostoPercentual: number;
  margemAlvo: number;
  canais: CanalResultado[];
  melhor: string | null;
}

const seguro = (valor: number | undefined): number =>
  Number.isFinite(valor) && (valor ?? 0) > 0 ? (valor as number) : 0;

export function calcularCenario(input: CenarioInput): CenarioResultado {
  const preco = Math.max(0, Math.round(seguro(input.precoCents)));
  const custo = Math.max(0, Math.round(seguro(input.custoCents)));
  const frete = Math.max(0, Math.round(seguro(input.freteCents)));
  const imposto = Math.min(0.99, seguro(input.impostoPercentual));
  const margemAlvo = Math.min(0.99, seguro(input.margemAlvo));

  const canais = input.canais.map((canal) => {
    const comissao = Math.min(0.99, seguro(canal.comissao));
    const taxaFixa = Math.max(0, Math.round(seguro(canal.taxaFixaCents)));

    const comissaoCents = Math.round(preco * comissao);
    const impostoCents = Math.round(preco * imposto);
    const custoTotal = custo + frete + comissaoCents + taxaFixa + impostoCents;
    const sobra = preco - custoTotal;

    const denominador = 1 - comissao - imposto - margemAlvo;
    const precoMinimo =
      denominador > 0 ? Math.ceil((custo + frete + taxaFixa) / denominador) : 0;

    return {
      nome: canal.nome,
      comissao,
      comissaoCents,
      taxaFixaCents: taxaFixa,
      impostoCents,
      custoTotalCents: custoTotal,
      sobraCents: sobra,
      margem: preco > 0 ? sobra / preco : 0,
      precoMinimoCents: precoMinimo,
      viavel: preco === 0 || preco >= precoMinimo,
    };
  });

  const viaveis = canais.filter((canal) => canal.viavel);
  const melhor =
    viaveis.length > 0
      ? viaveis.reduce((a, b) => (b.sobraCents > a.sobraCents ? b : a)).nome
      : null;

  return {
    precoCents: preco,
    custoCents: custo,
    freteCents: frete,
    impostoPercentual: imposto,
    margemAlvo,
    canais,
    melhor,
  };
}
