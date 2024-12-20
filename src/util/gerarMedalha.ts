import { IClassificacao } from "../interfaces/classificacao";

/**
 * 
 * @param GP -> Grau de perigo/importãncia
 * @param PF -> Probabilidade de falhas
 * @param R -> Relevância
 * @param C -> Cobertura
 * @param F -> Força
 */
export default function gerarMedalha(GP: string | number, PF: string | number, R: string | number, C: string | number, F: string | number):IClassificacao{
    GP = parseInt(GP as string);
    PF = parseInt(PF as string);
    R = parseInt(R as string);
    C = parseInt(C as string);
    F = parseInt(F as string);
    let selo:"BRONZE" | "PRATA" | "OURO" | "COBRE";
    let evidencia:"INCONTESTÁVEL" | "IMPORTANTE" | "MEDIANA" | "FRACA";
    
    // o selo será OURO, PRATA, BRONZE E COBRE e será calculado com os valores obtidos GP e PF
    if(GP > 8 && GP <= 10){
        if(PF === 6){
            selo = "BRONZE";
        }else if(PF > 3){
            selo = "PRATA";
        }else{
            selo = "OURO";
        }
    }else if(GP > 6 && GP <= 8){
        if(PF >= 5){
            selo = "BRONZE";
        }else  if(PF >= 3){
            selo = "PRATA";
        }else{
            selo = "OURO";
        }
    }else if(GP > 4 && GP <= 6){
        if(PF <= 3){
            selo = "PRATA";
        }else if(PF <= 5){
            selo = "BRONZE";
        }else{
            selo ="COBRE";
        }
    }else{
        if(PF <= 4){
            selo = "BRONZE";
        }else{
            selo = "COBRE";
        }
    }

    if(selo === "OURO"){
        if(R >= 3 && F >= 3 && F>=3){
            evidencia = "INCONTESTÁVEL";
        }else if(R>=3 && C<3 && F>=3){
            evidencia = "IMPORTANTE";
        }else if((R<3 && C<3  && F>=3) || (R<3 && C>=3 && F>=3) || (R>=3 && C<3 && F<3) || (R>=3 && C<3 && F<3)){
            evidencia = "MEDIANA";
        }else{
            evidencia = 'FRACA';
        }
    }else if(selo === 'PRATA'){
        if(R>=3 && C<3 && F>=3){
            evidencia = 'IMPORTANTE';
        }else if((R<3 && C<3 && F>=3) || (R<3 && C>=3 && F>=3) || (R>=3 && C<3 && F<3) || (R>=3 && C<3 && F<3)){
            evidencia = 'MEDIANA';
        }else{
            evidencia = 'FRACA';
        }
    }else if(selo === "BRONZE"){
        if((R<3 && C<3 && F<3) || (R<3 && C>=3 && F<3)){
            evidencia = "FRACA"
        }else{
            evidencia = 'MEDIANA';
        }
    }else{
        evidencia = "FRACA";
    }


    return ({selo: selo, evidencia: evidencia} as IClassificacao);
}