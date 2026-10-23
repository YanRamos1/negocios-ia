const DIA_MS = 86_400_000;

export const paraData = (iso: string): Date => {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Date(Date.UTC(ano, (mes ?? 1) - 1, dia ?? 1));
};

export const adicionarDias = (data: Date, dias: number): Date =>
  new Date(data.getTime() + dias * DIA_MS);

export const adicionarAnos = (data: Date, anos: number): Date =>
  new Date(Date.UTC(data.getUTCFullYear() + anos, data.getUTCMonth(), data.getUTCDate()));

/** Anos completos entre admissão e desligamento. */
export function anosCompletos(admissao: Date, desligamento: Date): number {
  let anos = 0;
  while (adicionarAnos(admissao, anos + 1) <= desligamento) anos += 1;
  return anos;
}

/**
 * Meses com pelo menos 15 dias trabalhados dentro do intervalo.
 * É a regra usada para 13º e férias proporcionais.
 */
export function mesesProporcionais(inicio: Date, fim: Date): number {
  if (fim <= inicio) return 0;

  let total = 0;
  let cursor = new Date(Date.UTC(inicio.getUTCFullYear(), inicio.getUTCMonth(), 1));

  while (cursor <= fim) {
    const inicioMes = cursor;
    const fimMes = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0));
    const de = inicio > inicioMes ? inicio : inicioMes;
    const ate = fim < fimMes ? fim : fimMes;
    const dias = Math.floor((ate.getTime() - de.getTime()) / DIA_MS) + 1;
    if (dias >= 15) total += 1;
    cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
  }

  return total;
}

/** Início do período aquisitivo de férias em curso. */
export function inicioPeriodoAquisitivo(admissao: Date, referencia: Date): Date {
  let inicio = admissao;
  while (adicionarAnos(inicio, 1) <= referencia) {
    inicio = adicionarAnos(inicio, 1);
  }
  return inicio;
}

/** Aviso prévio proporcional: 30 dias + 3 por ano completo, teto de 90. */
export function diasAviso(anos: number): number {
  return Math.min(90, 30 + 3 * anos);
}

export function inicioDoAno(data: Date): Date {
  return new Date(Date.UTC(data.getUTCFullYear(), 0, 1));
}

export function formatarData(data: Date): string {
  return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}
