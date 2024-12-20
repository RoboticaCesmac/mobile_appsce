import { IEvidencia } from "../interfaces/evidencia";
import { IAvaliacao } from "../interfaces/avaliacao";

export interface IErroEvidencia{
    mensagem: string,
    campo: string,
    pagina: number
}

export default function validarCamposEvidencia(evidencia: IEvidencia | IAvaliacao, validacaoParcial: boolean = false):IErroEvidencia | undefined | boolean{
    
    if(validacaoParcial){
        evidencia = evidencia as IEvidencia;
        /**
         * Validação dos dados iniciais
         */
        if(evidencia.categoria === ""){
            return {pagina: 1, mensagem: "Selecione a categoria!", campo: 'categoria'};
        }else if(evidencia.nome === ""){
            return {pagina: 2, mensagem: "Informe um nome para a evidência!", campo: 'nome'};
        }else if(evidencia.palavrasChave === ""){
            return {pagina: 2, mensagem: "Informe ao menos uma palavra chave!", campo: 'palavrasChave'};
        }else if(evidencia.contextualizacao === ""){
            return {pagina: 2, mensagem: "Informe a contextualização!", campo: 'contextualizacao'};
        }
        if(validacaoParcial){
            return false;
        }
    } else {
        let avaliacao = evidencia as IAvaliacao;
        /**
         * Validação da avaliação
         */
        if(avaliacao.proposito === ""){
            return {pagina: 2, mensagem: "Informe o propósito!", campo: 'proposito'};
        }
        else if(avaliacao.identificacao === ""){
            return {pagina: 2, mensagem: "Informe um a identificação!", campo: 'identificacao'};
        }
        else if(avaliacao.autores === ""){
            return {pagina: 3, mensagem: "Informe um ao menos um autor!", campo: 'autores'};
        }
        else if(avaliacao.data === ""){
            return {pagina: 3, mensagem: "Informe a data!", campo: 'data'};
        }
        else if(avaliacao.data!== undefined && avaliacao.data.length < 10){
            return {pagina: 3, mensagem: "Informe uma data válida!", campo: 'data'};
        }
        else if(avaliacao.tipo === ""){
            return {pagina: 3, mensagem: "Informe um tipo!", campo: 'tipo'};
        }
        else if(avaliacao.normaRegulatoria === ""){
            return {pagina: 3, mensagem: "Informe a norma regulatória!", campo: 'normaRegulatoria'};
        }
        else if(avaliacao.linkFonte === ""){
            return {pagina: 3, mensagem: "Informe um link da fonte!", campo: 'linkFonte'};
        }
        else if(avaliacao.consistenciaLeituraAnterior === ""){
            return {pagina: 3, mensagem: "Informe a consistência!", campo: 'consistenciaLeituraAnterior'};
        }
        else if(avaliacao.textoAmostra === ""){
            return {pagina: 4, mensagem: "Informe o texto de amostra!", campo: 'textoAmostra'};
        }
        else if(avaliacao.usosConhecidos === ""){
            return {pagina: 4, mensagem: "Informe os usos conhecidos!", campo: 'usosConhecidos'};
        }
        else if(avaliacao.implementacao === ""){
            return {pagina: 4, mensagem: "Informe a implementação!", campo: 'implementacao'};
        }
        else if(avaliacao.possiveisVieses === ""){
            return {pagina: 4, mensagem: "Informe os possíveis viéses!", campo: 'possiveisVieses'};
        }
        else if(avaliacao.sintese === ""){
            return {pagina: 5, mensagem: "Informe a síntese da análise!", campo: 'sintese'};
        }else if(avaliacao.compreensao === ""){
            return {pagina: 5, mensagem: "Selecione uma compreensão!", campo: 'compreensao'};
        }
        else if(avaliacao.relevancia === ""){
            return {pagina: 5, mensagem: "Selecione uma relevância!", campo: 'relevancia'};
        }
        else if(avaliacao.cobertura === ""){
            return {pagina: 5, mensagem: "Selecione uma cobertura!", campo: 'cobertura'};
        }
        else if(avaliacao.forca === ""){
            return {pagina: 5, mensagem: "Selecione uma força!", campo: 'forca'};
        }
        else if(avaliacao.grauDeImportancia === ""){
            return {pagina: 5, mensagem: "Determine o grau de importância!", campo: 'grauDeImportancia'};
        }
        else if(avaliacao.probabilidadeFalha === ""){
            return {pagina: 5, mensagem: "Determine a probabilidade de falha!", campo: 'probabilidadeFalha'};
        }
        
        else if(avaliacao.justificativa === ""){
            return {pagina: 5, mensagem: "Justifique sua avaliação!", campo: 'justificativa'};
        }
    }
    

    
    return false;
}