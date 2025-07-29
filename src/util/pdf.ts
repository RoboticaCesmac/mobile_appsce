import { IEvidencia } from "../interfaces/evidencia";
import * as Print from 'expo-print';
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import getTemplate from "../template/documento";
import { Dispatch, SetStateAction } from "react";
import { Alert, ToastAndroid } from "react-native";
import {  analisarEvidencia } from "../services/openaiService";

/**Gera um pdf de evidência */
export async function verificarEvidencia(evidencia: IEvidencia, setTextoLoader: Dispatch<SetStateAction<string>>) {
    console.log("!")
    await Alert.alert(
        '✨ I.A SCE✨',
        'Deseja utilizar a I.A SCE para realizar uma análise no documento?',
        [
            {
                text: 'Sim',
                onPress: async ()=>{
                    try{
                        setTextoLoader("✨ Analisando ✨");
                        evidencia.final.AnaliseSceAI = await analisarEvidencia(evidencia.final);
                        gerarPdfEAbrir(evidencia, setTextoLoader);
                    }catch(e){
                        console.error(e);
                        alert(e);
                        setTextoLoader("");
                    }
                    
                }
            },
            {
                text: 'Não',
                style: 'cancel',
                onPress: ()=>{gerarPdfEAbrir(evidencia, setTextoLoader)}
            },
        ],
        
    )
   
};

async function gerarPdfEAbrir(evidencia: IEvidencia, setTextoLoader: Dispatch<SetStateAction<string>>) {
    try {
        setTextoLoader("Gerando PDF...");
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('A operação demorou demais e foi interrompida.')), 5000)
        );
        const file = await Promise.race([Print.printToFileAsync({html: getTemplate(evidencia)}), timeoutPromise]);
        await FileSystem.moveAsync({from: (file as {uri: string}).uri , to: `${FileSystem.documentDirectory}evidencia.pdf`});
        const contentUri = await FileSystem.getContentUriAsync(`${FileSystem.documentDirectory}evidencia.pdf`);
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {data: contentUri, flags: 1, type: "application/pdf"});
    } catch (error) {
        ToastAndroid.show("Ocorreu um erro ao gerar o PDF, tente novamente!", 1000);
    }finally{
        setTextoLoader("");
    }
};

/**Gera um pdf com todas as evidências */
export async function gerarPdfEAbrirComTodas(evidencias: IEvidencia[], setTextoLoader: Dispatch<SetStateAction<string>>) {
    let html = "";
    for(let i = 0; i<evidencias.length; i++){
        html = html + getTemplate(evidencias[i]);
        if(i !== evidencias.length-1){
            html = html + '<div style="page-break-before: always"/>';
        }
    }
    try {
        setTextoLoader("Gerando PDF...");

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('A operação demorou demais e foi interrompida.')), 5000)
        );

        const file = await Promise.race([Print.printToFileAsync({html: html}), timeoutPromise]);
    
        await FileSystem.moveAsync({from: (file as {uri: string}).uri , to: `${FileSystem.documentDirectory}evidencia.pdf`});
    
        const contentUri = await FileSystem.getContentUriAsync(`${FileSystem.documentDirectory}evidencia.pdf`);

        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {data: contentUri, flags: 1, type: "application/pdf"});

    } catch (error) {
        ToastAndroid.show("Ocorreu um erro ao gerar o PDF, tente novamente!", 1000);
    }finally{
        setTextoLoader("");
    }
};