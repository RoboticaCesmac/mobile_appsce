import { tipoEvidencia } from "./evidencia";
import { tipoCompreensao } from "./evidencia";
import { medalhaType } from '@/src/types/icones';

/**
 * Interface de avaliação da evidência
 */
export interface IAvaliacao{
    justificativa: string,
    nomeAvaliador: string,
    idAvaliador: string,
    proposito: string,
    identificacao: string,
    autores: string,
    data: string,
    tipo: string,
    normaRegulatoria: string,
    linkFonte: string,
    contextualizar: string,
    revisaoPares: boolean,
    consistenciaLeituraAnterior: string,
    textoAmostra: string,
    usosConhecidos: string,
    implementacao: string,
    possiveisVieses: string,
    conflitosInteresse: string,
    sintese: string,
    compreensao: tipoCompreensao,
    relevancia: string,
    cobertura: string,
    forca: string,
    grauDeImportancia: string,
    probabilidadeFalha: string,
    selo: medalhaType | "",
    classificacao: string,
    opcoesSoftware?: IOpcSoftware,
}

export interface IOpcSoftware{
    taxaDefeitos: boolean,
    coberturaTestes: boolean,
    AnaliseFatoresHumanosViesCognitivo: boolean,
    FmeaFmeca: boolean,
    HistoricoFalasMetricasProducao: boolean,
    AnaliseArvoresFalha: boolean,
    ModelosMaturidadeProcesso: boolean
}

export type TipoAvaliador = "software" | "hardware" | "software/hardware" | undefined | "";