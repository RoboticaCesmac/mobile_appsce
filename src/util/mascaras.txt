/**
 * aplica uma máscara nos inputs - CPF - CEP -TELEFONE
 * 
*/
export type Mascara = "CPF" | "CEP" | "TELEFONE" | "DATA" | "HORA";

export function usarMascara(tipo: Mascara, valor: string): string {
    
    let valorFormatado = valor;
    let ultimoDigito = valorFormatado[valorFormatado.length - 1]
    
    if(tipo==="CPF"){
         // Impede a escrita de letras
        if(ultimoDigito !== "1" && ultimoDigito !== "2" && ultimoDigito !== "3" && ultimoDigito !== "4" && ultimoDigito !== "5" && ultimoDigito !== "6" && ultimoDigito !== "7" && ultimoDigito !== "8" && ultimoDigito !== "9" && ultimoDigito !== "0"){
            valorFormatado = valorFormatado.slice(0, valorFormatado.length - 1);
        }

        let parte1 = "";
        let parte2 = "";
        let parte3 = "";
        let parte4 = "";

        //Separa a string de acordo com a presença de . e -
        parte1 = valorFormatado.substring(0, 3);

        if(valorFormatado.split(".").length < 2){
            parte2 = valorFormatado.substring(3, 6);
        }else{
            parte2 = valorFormatado.substring(4, 7);
        }
        if(valorFormatado.split(".").length < 3){
            parte3 = valorFormatado.substring(7, 10);
        }else{
            parte3 = valorFormatado.substring(8, 11);
        }
        if(valorFormatado.split("-").length < 2){
            parte4 = valorFormatado.substring(11, 13);
        }else{
            parte4 = valorFormatado.substring(12, 14);
        }

        if(parte1!=="" && parte2==="" && parte3==="" && parte4===""){
            valorFormatado = parte1
        }
        if(parte1!=="" && parte2!=="" && parte3==="" && parte4===""){
            valorFormatado = parte1+"."+parte2
        }
        if(parte1!=="" && parte2!=="" && parte3!=="" && parte4===""){
            valorFormatado = parte1+"."+parte2+"."+parte3
        }
        if(parte1!=="" && parte2!=="" && parte3!=="" && parte4!==""){
            valorFormatado = parte1+"."+parte2+"."+parte3+"-"+parte4
        }            
    }
    if(tipo === "CEP"){
        // Impede a escrita de letras
        
        if("0123456789".includes(ultimoDigito) === false){
            valorFormatado = valorFormatado.slice(0, valorFormatado.length - 1);
        }

        let parte1 = "";
        let parte2 = "";

        //Separa a string de acordo com a presença de -
        parte1 = valorFormatado.substring(0, 5);

        if(valorFormatado.split("-").length < 2){
            parte2 = valorFormatado.substring(5, 8);
        }else{
            parte2 = valorFormatado.substring(6, 9);
        }
        
        if(parte2 !== ""){
            valorFormatado = parte1+"-"+parte2
        }else{
            valorFormatado = parte1
        }
    }
    if(tipo === "TELEFONE"){
         // Impede a escrita de letras
        if(ultimoDigito !== "1" && ultimoDigito !== "2" && ultimoDigito !== "3" && ultimoDigito !== "4" && ultimoDigito !== "5" && ultimoDigito !== "6" && ultimoDigito !== "7" && ultimoDigito !== "8" && ultimoDigito !== "9" && ultimoDigito !== "0"){
            valorFormatado = valorFormatado.slice(0, valorFormatado.length - 1);
        }


        let stringProcessada = "";
        if(valorFormatado.includes("(") === false){
            if(valorFormatado.substring(0, 1)!==""){
                if(stringProcessada.length < 3){
                    stringProcessada = "("+valorFormatado.substring(0, 3);  
                }
            }
        }else{
            stringProcessada = valorFormatado;
            if(valorFormatado.length === 5 && valorFormatado.substring(4, 5)!==" "){
                stringProcessada = valorFormatado.substring(0, 3)+") "+valorFormatado.substring(3, 4)+" "+valorFormatado.substring(4, 5);  
            };
            if(valorFormatado.length === 7){
                stringProcessada = valorFormatado.substring(0, 6)+" "+ valorFormatado.substring(7, 8);
            }
            if(valorFormatado.length === 12 && valorFormatado.substring(11, 12)!=="-"){
                stringProcessada = valorFormatado.substring(0, 11)+"-"+ valorFormatado.substring(11, 12);
            }
        }
        valorFormatado = stringProcessada;
    }
    if(tipo === "DATA"){
        if(ultimoDigito !== "1" && ultimoDigito !== "2" && ultimoDigito !== "3" && ultimoDigito !== "4" && ultimoDigito !== "5" && ultimoDigito !== "6" && ultimoDigito !== "7" && ultimoDigito !== "8" && ultimoDigito !== "9" && ultimoDigito !== "0"){
            valorFormatado = valorFormatado.slice(0, valorFormatado.length - 1);
        }
        if(valorFormatado.length === 3 && valorFormatado.split("/").length === 1){
            valorFormatado = valorFormatado.slice(0, valorFormatado.length - 1);
            valorFormatado = valorFormatado + "/" + ultimoDigito;
        }
        if(valorFormatado.length === 6 && valorFormatado.split("/").length === 2){
            valorFormatado = valorFormatado.slice(0, valorFormatado.length - 1);
            valorFormatado = valorFormatado + "/" + ultimoDigito;
        }
        // validações extraas de  mês maior que 12, etc
        if(valorFormatado.length === 2 && parseInt(valorFormatado)>31){
            valorFormatado = "31";
        }
        if(valorFormatado.length === 5 && valorFormatado.split("/").length === 2){
            if(parseInt(valorFormatado.split("/")[1]) > 12){
                valorFormatado = valorFormatado[0] + valorFormatado[1] + "/12";
            }
        }
        if(valorFormatado.length === 10 && valorFormatado.split("/").length === 3){
            if(parseInt(valorFormatado.split("/")[2]) < 1900){
                valorFormatado = valorFormatado[0] + valorFormatado[1] + "/" +valorFormatado[3] + valorFormatado[4] + "/1900";
            }
            if(parseInt(valorFormatado.split("/")[2]) > 2200){
                valorFormatado = valorFormatado[0] + valorFormatado[1] + "/" +valorFormatado[3] + valorFormatado[4] + "/2200";
            }
        }

        // essa validação é executada no final caso o usuário digite muito rápido a ponto de não dar tempo de formatar
        if(valorFormatado.length >= 8 && valorFormatado.split("/").length === 1){
            valorFormatado = valorFormatado[0] + valorFormatado[1] + "/" +valorFormatado[2] + valorFormatado[3] + "/" + valorFormatado[4] + valorFormatado[5] + valorFormatado[6] + valorFormatado[7];
            
            if(valorFormatado.length === 10 && valorFormatado.split("/").length === 3){
                if(parseInt(valorFormatado.split("/")[1]) > 12){
                    valorFormatado = valorFormatado.split("/")[0] + "/12/"+ valorFormatado.split("/")[2];
                }
                if(parseInt(valorFormatado.split("/")[0]) > 31){
                    valorFormatado = "31/" + valorFormatado.split("/")[1] + "/" + valorFormatado.split("/")[2];
                }
                if(parseInt(valorFormatado.split("/")[2]) < 1900){
                    valorFormatado = valorFormatado.split("/")[0] + "/" + valorFormatado.split("/")[1] + "/1900";
                }
                if(parseInt(valorFormatado.split("/")[2]) > 2200){
                    valorFormatado = valorFormatado.split("/")[0] + "/" + valorFormatado.split("/")[1] + "/2200";
                }
            }
        }

        //valida meses que acabam no dia 30
        const meses30 = ["04", "06", "09", "11"]
        if(parseInt(valorFormatado.split("/")[0]) > 30 && meses30.includes(valorFormatado.split("/")[1])){
            if(valorFormatado.split("/")[2] !== undefined){
                valorFormatado = "30/" + valorFormatado.split("/")[1] + "/" + valorFormatado.split("/")[2];
            }else{
                valorFormatado = "30/" + valorFormatado.split("/")[1] + "/";
            }
        }
        //valida fevereiro
        if(parseInt(valorFormatado.split("/")[0]) > 29 && valorFormatado.split("/")[1] === "02"){
            if(valorFormatado.split("/")[2] != undefined){
                valorFormatado = "29/" + valorFormatado.split("/")[1] + "/" + valorFormatado.split("/")[2];     
            } else{
                valorFormatado = "29/" + valorFormatado.split("/")[1] + "/";
            }
        }
        //valida fevereiro em ano bissexto
        if(valorFormatado.split("/")[2] !== undefined){
            if(valorFormatado.split("/")[2].length === 4){
                let ano = parseInt(valorFormatado.split("/")[2]);
                if ((ano % 4 === 0) && ((ano % 100 !== 0) || (ano % 400 === 0))){
                    if(parseInt(valorFormatado.split("/")[0]) > 28 && valorFormatado.split("/")[1] === "02"){
                        valorFormatado = "28/" + valorFormatado.split("/")[1] + "/" + valorFormatado.split("/")[2];            
                    }
                }
            }
        } 
    }
    if(tipo === "HORA"){
        if(ultimoDigito !== "1" && ultimoDigito !== "2" && ultimoDigito !== "3" && ultimoDigito !== "4" && ultimoDigito !== "5" && ultimoDigito !== "6" && ultimoDigito !== "7" && ultimoDigito !== "8" && ultimoDigito !== "9" && ultimoDigito !== "0"){
            valorFormatado = valorFormatado.slice(0, valorFormatado.length - 1);
        }
        if(valorFormatado.length === 3 && ultimoDigito !== ":"){
            valorFormatado = valorFormatado[0]+valorFormatado[1]+":"+ultimoDigito;
        }
        if(valorFormatado.length === 5){
            if(parseInt(valorFormatado.split(":")[1]) > 59){
                valorFormatado = valorFormatado.split(":")[0]+":59"
            }
        }
        if(valorFormatado.split(":").length === 1){
            if(parseInt(valorFormatado) > 59){
                valorFormatado = "59:"
            }
        }
    }
    return valorFormatado;
};