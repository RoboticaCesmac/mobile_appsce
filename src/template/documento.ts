import { IEvidencia } from "../interfaces/evidencia";
import { cores } from "../themes/cores";

export default function getTemplate(evidencia: IEvidencia):string{
    return `

    <!DOCTYPE html>

    <style>
        @media print {
            body {
                -webkit-print-color-adjust: exact; /* Preserva as cores na impressão */
            }

            /* Evita cortes no conteúdo */
            * {
                break-inside: avoid; /* Evita quebras dentro de elementos importantes */
            }
        }

        @page{
            margin: 100px;
        }

        .subtitulo-container {
            border-width: 2px; 
            height: 25px; 
            border-color: #000; 
            border-style: solid; 
            border-top-width: 1px;
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            background-color: ${cores.tabela1}
        }
        .item-tabela-esq{
            flex: 1; 
            border-width: 1px 1px 1px 2px;
            border-color: #000; 
            border-style: solid; 
            display: flex; 
            flex-direction: column; 
            justify-content: flex-end; 
            align-items: flex-start; 
            padding: 3px
        }
        .item-tabela-dir{
            flex: 1; 
            border-width: 2px; 
            border-color: #000; 
            border-style: solid; 
            border-width: 1px 2px 1px 1px;
            display: flex; 
            flex-direction: column; 
            padding: 3px
        }
        html{
            display: flex; 
            flex-direction: column; 
            margin: 0;
        }
        body{
            margin: 0;
            display: flex;
            flex-direction: column;
        }
        .item-tabela-escuro-esq{
            flex: 1; 
            border-width: 1px 1px 1px 2px;
            border-style: solid; 
            display: flex; 
            flex-direction: column; 
            justify-content: flex-end; 
            align-items: flex-start; 
            padding: 3px; 
            background-color: ${cores.tabela1}
        }
        .item-tabela-escuro-dir{
            flex: 1; 
            border-width: 1px 2px 1px 1px;
            border-style: solid; 
            display: flex; 
            flex-direction: column; 
            padding: 3px; 
            background-color: ${cores.tabela1}
        }
        .item-tabela-escuro-esq2{
            flex: 1; 
            border-width: 1px 1px 1px 2px;
            border-style: solid; 
            display: flex; 
            flex-direction: column; 
            justify-content: flex-end; 
            align-items: flex-start; 
            padding: 3px; 
            background-color: ${cores.tabela2}
        }
        .item-tabela-escuro-dir2{
            flex: 1; 
            border-width: 1px 2px 1px 1px;
            border-style: solid; 
            display: flex; 
            flex-direction: column; 
            padding: 3px; 
            background-color: ${cores.tabela2}
        }
        .flex{
            display: flex;
        }
    </style>
    
    <html>
        
        <div style="display: flex; margin-bottom: 20px;">
            <img src="${getImagem()}" alt="sce" style="width: 200px; height: 110px; margin-left: 100px"/>
            <div style="display: flex; flex: 1; justify-content: center; align-items: center">
            	<b style="font-family: arial; font-size: 50px">AppSCE</b>
            </div>
        </div>

        <div style="border-width: 2px; height: 50px; border-color: #000; border-style: solid; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: ${cores.tabela1}">
            <b style="font-family: arial">CLASSIFICAÇÃO DA EVIDÊNCIA</b>
        </div>
        
        
        <div  class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Nome</b>
            </div>
            <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.nome}</p>
            </div>
        </div>
        

        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Contextualização</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.contextualizacao}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Propósito</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.proposito}</p>
            </div>
        </div>
    

        <div id="identificacao" class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Identificação</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.identificacao}</p>
            </div>
        </div>
        


        
        
        
        
        <div class="subtitulo-container">
            <b style="font-family: arial">FONTE</b>
        </div>
        
        
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Autores</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.autores}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Data</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.data}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Tipo</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.tipo}</p>
            </div>
        </div>
        
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Link da fonte</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.linkFonte}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Contextualizar</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.contextualizar}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Revisão por pares</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.revisaoPares?"SIM":"NÃO"}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Consistência</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.consistenciaLeituraAnterior}</p>
            </div>
        </div>
        
        
        
        
        <div class="subtitulo-container">
            <b style="font-family: arial">METODOLOGIA</b>
        </div>
        
        
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Texto de amostra</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.textoAmostra}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Usos conhecidos</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.usosConhecidos}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Implementação</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.implementacao}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Possíveis Viéses</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.possiveisVieses}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Conflitos de Interesse</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.conflitosInteresse}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Síntese da Análise</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.sintese}</p>
            </div>
        </div>
        
        
        
        <div class="subtitulo-container">
            <b style="font-family: arial">A EVIDÊNCIA</b>
        </div>
        
        
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Fortalece compreensão</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.compreensao === "fortalece"?"SIM":"NÃO"}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Não altera a compreensão</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.compreensao === "não altera"?"SIM":"NÃO"}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-esq">
                <b style="font-family: arial">Enfraquece compreensão</b>
            </div>
             <div class="item-tabela-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.compreensao === "enfraquece"?"SIM":"NÃO"}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-escuro-esq">
                <b style="font-family: arial">RELEVÂNCIA (R)</b>
            </div>
            <div class="item-tabela-escuro-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.relevancia}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-escuro-esq">
                <b style="font-family: arial">COBERTURA (C)</b>
            </div>
            <div class="item-tabela-escuro-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.cobertura}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-escuro-esq">
                <b style="font-family: arial">FORÇA (F)</b>
            </div>
            <div class="item-tabela-escuro-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.forca}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-escuro-esq">
                <b style="font-family: arial">GRAU DO PERIGO (GP)</b>
            </div>
            <div class="item-tabela-escuro-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.grauDeImportancia}</p>
            </div>
        </div>


        <div class="flex">
            <div class="item-tabela-escuro-esq">
                <b style="font-family: arial">PROBABILIDADE DE FALHA (PF)</b>
            </div>
            <div class="item-tabela-escuro-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.probabilidadeFalha}</p>
            </div>
        </div>


        ${getCamposSoftware(evidencia)}
        
        
        <div class="flex">
            <div class="item-tabela-escuro-esq">
                <b style="font-family: arial">SELO DA EVIDÊNCIA</b>
            </div>
            <div class="item-tabela-escuro-dir">
                <p style="font-family: arial; margin: 0">${evidencia.final.selo?.toUpperCase()}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-escuro-esq2">
                <b style="font-family: arial">CLASSIFICAÇÃO DA EVIDÊNCIA</b>
            </div>
            <div class="item-tabela-escuro-dir2">
                <p style="font-family: arial; margin: 0">${evidencia.final.classificacao}</p>
            </div>
        </div>
    </html>
    
    `
}

const getCamposSoftware = (evidencia: IEvidencia)=>{
    if(evidencia.categoria === "software"){
        return (
        `
        <div class="flex">
            <div class="item-tabela-escuro-esq" style="background-color: ${cores.tabela3}">
                <b style="font-family: arial">&nbsp;&nbsp;&nbsp;&nbsp;Taxa de defeitos</b>
            </div>
            <div class="item-tabela-escuro-dir" style="background-color: ${cores.tabela3}">
                <p style="font-family: arial; margin: 0">${evidencia.final.opcoesSoftware?.taxaDefeitos?"SIM":"NÃO"}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-escuro-esq" style="background-color: ${cores.tabela3}">
                <b style="font-family: arial">&nbsp;&nbsp;&nbsp;&nbsp;Cobertura de testes</b>
            </div>
            <div class="item-tabela-escuro-dir" style="background-color: ${cores.tabela3}">
                <p style="font-family: arial; margin: 0">${evidencia.final.opcoesSoftware?.coberturaTestes?"SIM":"NÃO"}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-escuro-esq" style="background-color: ${cores.tabela3}">
                <b style="font-family: arial">&nbsp;&nbsp;&nbsp;&nbsp;Análise de Fatores Humanos e Viés Cognitivo</b>
            </div>
            <div class="item-tabela-escuro-dir" style="background-color: ${cores.tabela3}">
                <p style="font-family: arial; margin: 0">${evidencia.final.opcoesSoftware?.AnaliseFatoresHumanosViesCognitivo?"SIM":"NÃO"}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-escuro-esq" style="background-color: ${cores.tabela3}">
                <b style="font-family: arial">&nbsp;&nbsp;&nbsp;&nbsp;FMEA/FMECA</b>
            </div>
            <div class="item-tabela-escuro-dir" style="background-color: ${cores.tabela3}">
                <p style="font-family: arial; margin: 0">${evidencia.final.opcoesSoftware?.FmeaFmeca?"SIM":"NÃO"}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-escuro-esq" style="background-color: ${cores.tabela3}">
                <b style="font-family: arial">&nbsp;&nbsp;&nbsp;&nbsp;Histórico de Falhas e Métricas em Produção</b>
            </div>
            <div class="item-tabela-escuro-dir" style="background-color: ${cores.tabela3}">
                <p style="font-family: arial; margin: 0">${evidencia.final.opcoesSoftware?.HistoricoFalasMetricasProducao?"SIM":"NÃO"}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-escuro-esq" style="background-color: ${cores.tabela3}">
                <b style="font-family: arial">&nbsp;&nbsp;&nbsp;&nbsp;Análise de Árvores de Falha</b>
            </div>
            <div class="item-tabela-escuro-dir" style="background-color: ${cores.tabela3}">
                <p style="font-family: arial; margin: 0">${evidencia.final.opcoesSoftware?.AnaliseArvoresFalha?"SIM":"NÃO"}</p>
            </div>
        </div>
        
        
        <div class="flex">
            <div class="item-tabela-escuro-esq" style="background-color: ${cores.tabela3}">
                <b style="font-family: arial">&nbsp;&nbsp;&nbsp;&nbsp;Modelos de Maturidade de Processo</b>
            </div>
            <div class="item-tabela-escuro-dir" style="background-color: ${cores.tabela3}">
                <p style="font-family: arial; margin: 0">${evidencia.final.opcoesSoftware?.ModelosMaturidadeProcesso?"SIM":"NÃO"}</p>
            </div>
        </div>

        ` 
        )
    }else{
        return "";
    }
}




const getImagem = ():string =>{
    return "data:image/png;base64,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" 
}