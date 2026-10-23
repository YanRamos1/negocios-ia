export interface PrecificacaoInput {
  materialCents: number;
  horasPorPeca: number;
  valorHoraCents: number;
  embalagemCents?: number;
  custosFixosCents: number;
  dasCents?: number;
  pecasMes: number;
  taxaVenda?: number;
  margemDesejada?: number;
}

export interface PrecificacaoResultado {
  custoMaterialCents: number;
  custoMaoObraCents: number;
  custoEmbalagemCents: number;
  custoFixoRateadoCents: number;
  custoTotalCents: number;
  precoSugeridoCents: number;
  taxaVendaCents: number;
  lucroCents: number;
  margemEfetiva: number;
  markup: number;
  pontoEquilibrioPecas: number;
}

const seguro = (valor: number | undefined): number =>
  Number.isFinite(valor) && (valor ?? 0) > 0 ? valor as number : 0;

export function calcularPreco(input: PrecificacaoInput): PrecificacaoResultado {
  const material = Math.round(seguro(input.materialCents));
  const horas = seguro(input.horasPorPeca);
  const valorHora = seguro(input.valorHoraCents);
  const embalagem = Math.round(seguro(input.embalagemCents));
  const fixos = Math.round(seguro(input.custosFixosCents));
  const das = Math.round(seguro(input.dasCents));
  const pecas = Math.max(1, seguro(input.pecasMes));
  const taxa = Math.min(0.99, seguro(input.taxaVenda));
  const margem = Math.min(0.99, seguro(input.margemDesejada));

  const maoObra = Math.round(horas * valorHora);
  const rateioFixo = Math.round((fixos + das) / pecas);
  const custoTotal = material + maoObra + embalagem + rateioFixo;

  const denominador = 1 - taxa - margem;
  const preco = denominador > 0 ? Math.round(custoTotal / denominador) : 0;
  const taxaCents = Math.round(preco * taxa);
  const lucro = preco - custoTotal - taxaCents;

  const custoDireto = material + maoObra + embalagem;
  const contribuicao = preco - custoDireto - taxaCents;
  const pontoEquilibrio =
    contribuicao > 0 ? Math.ceil((fixos + das) / contribuicao) : 0;

  return {
    custoMaterialCents: material,
    custoMaoObraCents: maoObra,
    custoEmbalagemCents: embalagem,
    custoFixoRateadoCents: rateioFixo,
    custoTotalCents: custoTotal,
    precoSugeridoCents: preco,
    taxaVendaCents: taxaCents,
    lucroCents: lucro,
    margemEfetiva: preco > 0 ? lucro / preco : 0,
    markup: custoTotal > 0 ? preco / custoTotal : 0,
    pontoEquilibrioPecas: pontoEquilibrio,
  };
}
