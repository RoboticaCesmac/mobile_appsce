import { IAvaliacao } from "../interfaces/avaliacao";

export default function newAvaliacao(){
    return {
            justificativa: "",
            nomeAvaliador: "",
            idAvaliador: "",
            proposito: "",
            identificacao: "",
            autores: "",
            data: "",
            tipo: "",
            normaRegulatoria: "",
            linkFonte: "",
            contextualizar: "",
            revisaoPares: false,
            consistenciaLeituraAnterior: "",
            textoAmostra: "",
            usosConhecidos: "",
            implementacao: "",
            possiveisVieses: "",
            conflitosInteresse: "",
            sintese: "",
            compreensao: "",
            relevancia: "",
            cobertura: "",
            forca: "",
            grauDeImportancia: "",
            probabilidadeFalha: "",
            selo: "",
            classificacao: "",
            opcoesSoftware: {
                taxaDefeitos: false,
                coberturaTestes: false,
                AnaliseFatoresHumanosViesCognitivo: false,
                FmeaFmeca: false,
                HistoricoFalasMetricasProducao: false,
                AnaliseArvoresFalha: false,
                ModelosMaturidadeProcesso: false
            } 
        }as IAvaliacao;
}