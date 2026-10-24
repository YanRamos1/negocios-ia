export interface Nicho {
  slug: string;
  nome: string;
  descricao: string;
  detalhe: string;
  materialCents: number;
  horasPorPeca: number;
  valorHoraCents: number;
  embalagemCents: number;
  custosFixosCents: number;
  dasCents: number;
  pecasMes: number;
  taxaVenda: number;
  margemDesejada: number;
}

export const nichos: Nicho[] = [
  {
    slug: 'confeitaria',
    nome: 'Confeitaria',
    descricao: 'Doces, bolos e salgados vendidos por encomenda ou em feiras.',
    detalhe:
      'O erro mais comum é cobrar só o ingrediente. Massa, recheio e embalagem individual costumam pesar menos que o tempo de produção.',
    materialCents: 2000,
    horasPorPeca: 1.5,
    valorHoraCents: 3000,
    embalagemCents: 500,
    custosFixosCents: 50000,
    dasCents: 8200,
    pecasMes: 50,
    taxaVenda: 0.1,
    margemDesejada: 0.3,
  },
  {
    slug: 'artesanato',
    nome: 'Artesanato',
    descricao: 'Crochê, macramê, bordado e peças feitas à mão.',
    detalhe:
      'Peças artesanais têm tempo alto e material barato: se você não cobra a hora, o preço parece ótimo e o lucro é inexistente.',
    materialCents: 1500,
    horasPorPeca: 3,
    valorHoraCents: 2500,
    embalagemCents: 300,
    custosFixosCents: 40000,
    dasCents: 8200,
    pecasMes: 40,
    taxaVenda: 0.14,
    margemDesejada: 0.3,
  },
  {
    slug: 'costura-criativa',
    nome: 'Costura criativa',
    descricao: 'Bolsas, necessaires, almofadas e peças sob medida.',
    detalhe:
      'Tecido, aviamento e forro somam rápido. Some as sobras e as peças de teste ao custo do material — elas existem em toda produção.',
    materialCents: 3500,
    horasPorPeca: 2.5,
    valorHoraCents: 2800,
    embalagemCents: 400,
    custosFixosCents: 60000,
    dasCents: 8200,
    pecasMes: 30,
    taxaVenda: 0.16,
    margemDesejada: 0.25,
  },
  {
    slug: 'velas-artesanais',
    nome: 'Velas artesanais',
    descricao: 'Velas de soja, aromatizadores e kits para presente.',
    detalhe:
      'Produção em lote reduz o custo por unidade, mas o rateio de custo fixo por peça cai junto — o que muda é o tempo total, não o preço unitário.',
    materialCents: 1200,
    horasPorPeca: 0.8,
    valorHoraCents: 3000,
    embalagemCents: 400,
    custosFixosCents: 45000,
    dasCents: 8200,
    pecasMes: 80,
    taxaVenda: 0.1,
    margemDesejada: 0.35,
  },
];

export const reais = (cents: number): string => (cents / 100).toFixed(2).replace('.', ',');
