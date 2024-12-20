import { IAvaliacao } from './avaliacao';
import { medalhaType } from '@/src/types/icones';

/**
 * Interface que representa uma evidência
 */
export interface IEvidencia {
    id?: string,
    categoria: tipoEvidencia,
    nome: string,
    palavrasChave: string,
    contextualizacao: string,
    avaliador1?: IAvaliacao,
    avaliador2?: IAvaliacao,
    avaliador3?: IAvaliacao,
    final: IAvaliacao,
    projetoId?: string,
}

export type tipoEvidencia = "software" | "hardware" | "";
export type tipoCompreensao = "enfraquece" | "não altera" | "fortalece" | "";