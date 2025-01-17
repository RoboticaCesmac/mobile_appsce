import { Image,  View, ToastAndroid, ScrollView } from 'react-native';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { auth, db } from '@/src/config/firebase';
import { useEffect, useState } from 'react';
import Checkbox from 'expo-checkbox';

import { INavigationCadastroEvidencia, RootStackParamList } from '@/src/navigations';
import { useNavigation } from 'expo-router';

import InputPersonalizado from '@/src/components/inputPersonalizado';
import BotaoVoltar from '@/src/components/botaoVoltar';
import gerarMedalha from '@/src/util/gerarMedalha';
import { Botao } from '@/src/components/botao';
import { Label } from '@/src/components/label';
import Loader from '@/src/components/loader';
import Texto from '@/src/components/texto';
import { cores } from '../../themes/cores';
import { styles } from './styles';

import validarCamposEvidencia, { IErroEvidencia } from '@/src/util/validarCamposEvidencia';
import { IEvidencia, tipoEvidencia } from '@/src/interfaces/evidencia';
import { IClassificacao } from '@/src/interfaces/classificacao';
import { IAvaliacao } from '@/src/interfaces/avaliacao';
import newEvidencia from '@/src/template/newEvidencia';
import newAvaliacao from '@/src/template/newAvaliacao';
import { IProjeto } from '@/src/interfaces/projeto';
import { IUsuario } from '@/src/interfaces/usuario';
import { medalhaType } from '@/src/types/icones';
import Tooltip from '@/src/components/tooltip';
import { TouchableOpacity } from 'react-native';


export default function TelaCadastroEvidencia(){
    const bronze = require('./../../assets/icones/medalha-bronze.png');
    const cobre = require('./../../assets/icones/medalha-cobre.png');
    const prata = require('./../../assets/icones/medalha-prata.png');
    const ouro = require('./../../assets/icones/medalha-ouro.png');

    const navigation = useNavigation<RootStackParamList>();
    
    const projetoRecebido: IProjeto = (useRoute().params as INavigationCadastroEvidencia).projeto;
    const evidenciaAEditar: IEvidencia | undefined = (useRoute().params as INavigationCadastroEvidencia).evidencia;
    
    const [tooltipMedalhaVisivel, setTooltipMedalhaVisivel] = useState<boolean>(false);
    const [avaliacao, setAvaliacao] = useState<IAvaliacao>(newAvaliacao());
    const [evidencia, setEvidencia] = useState<IEvidencia>(newEvidencia());
    const [estadoLoading, setEstadoLoading] = useState<string>("");
    const [campoComErro, setCampoComErro] = useState<string>("");
    const [avaliador, setAvaliador] = useState<number>(NaN);
    const [modo, setModo] = useState<string>("cadastrar");
    const [pagina, setPagina] = useState<number>(-1);

    useEffect(()=>{
        buscarUsuario();
    },[]);

    const buscarUsuario = async()=>{
        setEstadoLoading("Carregando...");
        try{
            const dadosUsuario = doc(db, "usuarios", auth.currentUser!.uid);
            let usuario:IUsuario = (await getDoc(dadosUsuario)).data() as IUsuario;
            if(usuario.tipoAvaliador!=="" && projetoRecebido.uid !== auth.currentUser?.uid){
                setPagina(1);
            }else{
                setPagina(0);
            }
        }catch(e){
            alert(e);
        }finally{
            setEstadoLoading("");
        }
    }
    
    // Remove os erros sempre que alterar um campo com erro
    useEffect(()=>{
        setCampoComErro("");
    },[avaliacao]);
    
    // Gera os valores que dependem de condicionais
    useEffect(()=>{
        if(pagina === 7){
            let classificacao:IClassificacao = gerarMedalha((evidencia[('avaliador'+avaliador) as keyof typeof evidencia]! as IAvaliacao).grauDeImportancia, (evidencia[('avaliador'+avaliador) as keyof typeof evidencia]! as IAvaliacao).probabilidadeFalha, (evidencia[('avaliador'+avaliador) as keyof typeof evidencia]! as IAvaliacao).relevancia, (evidencia[('avaliador'+avaliador) as keyof typeof evidencia]! as IAvaliacao).cobertura, (evidencia[('avaliador'+avaliador) as keyof typeof evidencia]! as IAvaliacao).forca);
            setEvidencia({
                ...evidencia, 
                [`avaliador${avaliador}`]: {
                    ...(evidencia[(`avaliador${avaliador}`) as keyof typeof evidencia] as IAvaliacao),
                    classificacao: classificacao.evidencia,
                    selo: classificacao.selo.toLowerCase() as medalhaType
                }
            })   
        }   
    },[pagina]);
    
    // Carrega os dados do registro para edição, caso seja uma edição
    useEffect(()=>{
        if(evidenciaAEditar){
            setEvidencia(evidenciaAEditar);
            if(avaliador === 1){
                setAvaliacao(evidenciaAEditar!.avaliador1!);
            }else if(avaliador === 2){
                setAvaliacao(evidenciaAEditar!.avaliador2!);
            }else if(avaliador === 3){
                setAvaliacao(evidenciaAEditar!.avaliador3!);
            }
            setModo("editar");
        }
    },[avaliador]);

    /**
     * Salva os dados do registro no banco de dados Cloud Firestore
     */
    const salvarEvidencia = async () => {
        try{
            setEstadoLoading("Salvando...");

            let erro:IErroEvidencia|boolean|undefined = validarCamposEvidencia(evidencia, evidencia);

            if(erro){
                erro = erro as IErroEvidencia;
                setCampoComErro(erro.campo);
                throw new Error(erro.mensagem);
            }

            // Verifica se o usuário está autenticado
            const idUsuario = auth.currentUser?.uid;
            if(idUsuario === undefined){
                throw new Error("Usuário não autenticado. Por favor, autentique-se novamente.");
            }

            let idRegistro = evidencia?.id;

            // Se o usuário estiver autenticado e for um novo cadastro
            if(idRegistro === ""){
                idRegistro = doc(collection(db, "evidências")).id;
            }

            const dadosUsuario = doc(db, "usuarios", auth.currentUser!.uid);
            let usuario:IUsuario = (await getDoc(dadosUsuario)).data() as IUsuario;

            let evidenciaASalvar:IEvidencia = evidencia;

            // Salva a evidência final quando as avaliações 1 e 2, 1 e 3, ou 2 e 3 são próximas
            if(avaliador < 3){
                if(evidencia.avaliador1?.idAvaliador !== ""){
                    let pontosEvidencia1 = 0;
                    let pontosEvidencia2 = 0;
                    if(evidencia.avaliador1?.classificacao === "INCONTESTÁVEL"){
                        pontosEvidencia1 = 4;
                    }else if(evidencia.avaliador1?.classificacao === "IMPORTANTE"){
                        pontosEvidencia1 = 3;
                    }else if(evidencia.avaliador1?.classificacao === "MEDIANA"){
                        pontosEvidencia1 = 2;
                    }else if(evidencia.avaliador1?.classificacao === "FRACA"){
                        pontosEvidencia1 = 1;
                    }
    
                    if(evidencia.avaliador2?.classificacao === "INCONTESTÁVEL"){
                        pontosEvidencia2 = 4;
                    }else if(evidencia.avaliador2?.classificacao === "IMPORTANTE"){
                        pontosEvidencia2 = 3;
                    }else if(evidencia.avaliador2?.classificacao === "MEDIANA"){
                        pontosEvidencia2 = 2;
                    }else if(evidencia.avaliador2?.classificacao === "FRACA"){
                        pontosEvidencia2 = 1;
                    }
    
                    if(Math.abs(pontosEvidencia2 - pontosEvidencia1) < 2){
                        if(Math.abs(pontosEvidencia2 - pontosEvidencia1) === 0){
                            evidenciaASalvar.final = {...evidencia.avaliador1, idAvaliador: evidencia.avaliador1?.idAvaliador!} as IAvaliacao;
                        }else if(pontosEvidencia1 > pontosEvidencia2){
                            evidenciaASalvar.final = {...evidencia.avaliador2, idAvaliador: evidencia.avaliador2?.idAvaliador!} as IAvaliacao;
                        }else if(pontosEvidencia1 < pontosEvidencia2){
                            evidenciaASalvar.final = {...evidencia.avaliador1, idAvaliador: evidencia.avaliador1?.idAvaliador!} as IAvaliacao;
                        }
                    }
                }
            }else{
                let pontosEvidencia1 = 0;
                let pontosEvidencia2 = 0;
                let pontosEvidencia3 = 0;
                if(evidencia.avaliador1?.classificacao === "INCONTESTÁVEL"){
                    pontosEvidencia1 = 4;
                }else if(evidencia.avaliador1?.classificacao === "IMPORTANTE"){
                    pontosEvidencia1 = 3;
                }else if(evidencia.avaliador1?.classificacao === "MEDIANA"){
                    pontosEvidencia1 = 2;
                }else if(evidencia.avaliador1?.classificacao === "FRACA"){
                    pontosEvidencia1 = 1;
                }

                if(evidencia.avaliador2?.classificacao === "INCONTESTÁVEL"){
                    pontosEvidencia2 = 4;
                }else if(evidencia.avaliador2?.classificacao === "IMPORTANTE"){
                    pontosEvidencia2 = 3;
                }else if(evidencia.avaliador2?.classificacao === "MEDIANA"){
                    pontosEvidencia2 = 2;
                }else if(evidencia.avaliador2?.classificacao === "FRACA"){
                    pontosEvidencia2 = 1;
                }

                if(evidencia.avaliador3?.classificacao === "INCONTESTÁVEL"){
                    pontosEvidencia3 = 4;
                }else if(evidencia.avaliador3?.classificacao === "IMPORTANTE"){
                    pontosEvidencia3 = 3;
                }else if(evidencia.avaliador3?.classificacao === "MEDIANA"){
                    pontosEvidencia3 = 2;
                }else if(evidencia.avaliador3?.classificacao === "FRACA"){
                    pontosEvidencia3 = 1;
                }

                if(Math.abs(pontosEvidencia3 - pontosEvidencia1) < 2){
                    
                    if(Math.abs(pontosEvidencia3 - pontosEvidencia1) === 0){
                        evidenciaASalvar.final = {...evidencia.avaliador3, idAvaliador: auth.currentUser?.uid, nomeAvaliador: usuario.nome} as IAvaliacao;
                    }else if(pontosEvidencia1 > pontosEvidencia3){
                        evidenciaASalvar.final = {...evidencia.avaliador3, idAvaliador: evidencia.avaliador3?.idAvaliador!} as IAvaliacao;
                    }else if(pontosEvidencia1 < pontosEvidencia3){
                        evidenciaASalvar.final = {...evidencia.avaliador1, idAvaliador: evidencia.avaliador1?.idAvaliador!} as IAvaliacao;
                    }
                }else if(Math.abs(pontosEvidencia3 - pontosEvidencia2) < 2){
                    
                    if(Math.abs(pontosEvidencia3 - pontosEvidencia2) === 0){
                        evidenciaASalvar.final = {...evidencia.avaliador3, idAvaliador: auth.currentUser?.uid, nomeAvaliador: usuario.nome} as IAvaliacao;
                    }else if(pontosEvidencia2 > pontosEvidencia3){
                        evidenciaASalvar.final = {...evidencia.avaliador2, idAvaliador: evidencia.avaliador2?.idAvaliador!} as IAvaliacao;
                    }else if(pontosEvidencia2 < pontosEvidencia3){
                        evidenciaASalvar.final = {...evidencia.avaliador3, idAvaliador: evidencia.avaliador3?.idAvaliador!} as IAvaliacao;
                    }
                }
            }

            // Salva no banco de dados, reinicia a página e redireciona para a página de historico
            await setDoc(doc(db, "evidencias", idRegistro!), {...evidenciaASalvar, id: idRegistro, projetoId: projetoRecebido.id, [`avaliador${avaliador}`]: {...(evidenciaASalvar[('avaliador'+avaliador||1) as keyof typeof evidenciaASalvar]! as IAvaliacao), nomeAvaliador: usuario.nome, idAvaliador: auth.currentUser?.uid}});

            navigation.goBack();

        }catch(erro:any){
            console.error(erro);
            ToastAndroid.show(erro.message, ToastAndroid.LONG);
        }finally{
            setEstadoLoading("");
        }
    }

    /**
     * Cadastra os dados do registro no banco de dados Cloud Firestore
     */
    const cadastrarEvidencia = async () => {
        try{
            setEstadoLoading("Salvando...");

            let erro:IErroEvidencia|boolean|undefined = validarCamposEvidencia(evidencia, evidencia, true);

            if(erro){
                erro = erro as IErroEvidencia;
                setCampoComErro(erro.campo);
                throw new Error(erro.mensagem);
            }

            // Verifica se o usuário está autenticado
            const idUsuario = auth.currentUser?.uid;
            if(idUsuario === undefined){
                throw new Error("Usuário não autenticado. Por favor, autentique-se novamente.");
            }

            let idRegistro = evidencia?.id;

            // Se o usuário estiver autenticado e for um novo cadastro
            if(idRegistro === ""){
                idRegistro = doc(collection(db, "evidências")).id;
            }


            let evidenciaASalvar:IEvidencia = evidencia;


            // Salva no banco de dados, reinicia a página e redireciona para a página de historico
            await setDoc(doc(db, "evidencias", idRegistro!), {...evidenciaASalvar, id: idRegistro, projetoId: projetoRecebido.id});

            navigation.goBack();

        }catch(erro:any){
            console.error(erro);
            ToastAndroid.show(erro.message, ToastAndroid.LONG);
        }finally{
            setEstadoLoading("");
        }
    }

    //Passa para a próxima página
    const avancarPagina = ()=>{
        try{
            let erro:IErroEvidencia|boolean|undefined = validarCamposEvidencia(evidencia[("avaliador"+avaliador)as keyof typeof evidencia] as IAvaliacao, evidencia);
            if(erro){
                erro = erro as IErroEvidencia;
                if(erro.pagina === pagina){
                    setCampoComErro(erro.campo);
                    throw new Error(erro.mensagem);
                }
            }

            if(pagina === 5 && evidencia.categoria === "hardware"){
                setPagina(pagina + 2);
            }else{
                setPagina(pagina + 1);
            }
            
      
        }catch(erro:any){
            ToastAndroid.show(erro.message, ToastAndroid.LONG);
        }finally{
            setEstadoLoading("");
        }
    }

    return(
        <ScrollView style={{minHeight: '100%', backgroundColor: cores.fundoGradiente1}}>
            <LinearGradient colors={[cores.fundoGradiente1, cores.fundoGradiente2]} style={styles.pagina}>
                
                <View style={styles.container}>
                    {pagina === 0 && 
                        <>
                            <Texto style={styles.titulo2}>{modo==="cadastrar"?"CADASTRO":"EDIÇÃO"} DE EVIDÊNCIA</Texto>
                            <View style={styles.containerScroll}>
                            <ScrollView contentContainerStyle={[styles.cardScroll, {height: 450}]}>
                                <InputPersonalizado style={campoComErro === "categoria" ? styles.inputErro : {}} onValueChange={(itensSelecionados)=>setEvidencia({...evidencia, categoria: itensSelecionados[0] as tipoEvidencia})}  titulo='Qual o tipo da sua evidência?' placeholder='Selecione' itensSelect={[{valor: "hardware", descricao: "Hardware"}, {valor: "software", descricao: "Software"}]} valoresSelecionadosSelect={[evidencia.categoria]} tooltipTexto='Descreva o tipo da sua evidência (hardware ou software).'/>

                                <InputPersonalizado style={campoComErro === "nome" ? styles.inputErro : {}} value={evidencia.nome} onChangeText={(valor)=>setEvidencia({...evidencia, nome: valor})}  titulo='Nome' placeholder='Nome da evidência' tooltipTexto='Nome da evidência deve transmitir a essência da evidência, de forma sucinta.'/>

                                <InputPersonalizado returnKeyType="go" onSubmitEditing={()=>cadastrarEvidencia()} style={campoComErro === "palavrasChave" ? styles.inputErro : {}} value={evidencia.palavrasChave} onChangeText={(valor)=>setEvidencia({...evidencia, palavrasChave: valor})}  titulo='Palavras chave' placeholder='Separadas por vírgula. Ex: teste, palavra' tooltipTexto={'Descrever brevemente o tópico em questão e a importância da evidência na discussão. \n\nAjudará a entender a descrição mais abstrata da evidência a seguir.'}/>

                                <InputPersonalizado  multiline={true} style={[{height: 130}, campoComErro === "contextualizacao" ? styles.inputErro : {}]} value={evidencia.contextualizacao} onChangeText={(valor)=>setEvidencia({...evidencia, contextualizacao: valor})}  titulo='Contextualização' placeholder='Contextualização breve' tooltipTexto={'Descrever brevemente o tópico em questão e a importância da evidência na discussão. \n\nAjudará a entender a descrição mais abstrata da evidência a seguir.'}/>

                                <Botao titulo="Salvar" style={styles.botao} onPress={()=>cadastrarEvidencia()}/>
                            </ScrollView>
                            </View>
                        </>
                    }
                    {pagina === 1 && 
                        <>
                        
                            <Texto style={styles.titulo2}>{modo==="cadastrar"?"CADASTRO":"EDIÇÃO"} DE EVIDÊNCIA</Texto>

                            <View style={styles.containerScroll}>
                                <ScrollView contentContainerStyle={styles.cardScroll}>
                                    <TouchableOpacity onPressIn={()=>setTooltipMedalhaVisivel(true)} onPressOut={()=>setTooltipMedalhaVisivel(false)} style={{top: 20, right: 20, zIndex: 999, position: "absolute"}}>
                                        <Image style={{ width: 20, height: 20}} source={require("./../../assets/icones/dica.png")}/>
                                        <Tooltip visivel={tooltipMedalhaVisivel} texto='Esta evidência foi classificada automaticamente com base na decisão predominante entre os avaliadores mencionados.'/>
                                    </TouchableOpacity>
                                    {evidencia.final.idAvaliador !== "" ?
                                        <View style={styles.containerMedalha}>
                                            
                                            {evidencia.final.selo === 'ouro' && <Image resizeMode='contain' style={styles.iconeMedalha} source={require("./../../assets/icones/medalha-ouro.png")}/>}
                                            {evidencia.final.selo === 'prata' && <Image resizeMode='contain' style={styles.iconeMedalha} source={require("./../../assets/icones/medalha-prata.png")}/>}
                                            {evidencia.final.selo === 'bronze' && <Image resizeMode='contain' style={styles.iconeMedalha} source={require("./../../assets/icones/medalha-bronze.png")}/>}
                                            {evidencia.final.selo === 'cobre' && <Image resizeMode='contain' style={styles.iconeMedalha} source={require("./../../assets/icones/medalha-cobre.png")}/>}
                                            <View style={{width: 160}}>
                                                <Texto style={{fontSize: 15}}>Evidência {String(evidencia.final.selo).charAt(0).toUpperCase() + String(evidencia.final.selo).slice(1)}</Texto>
                                                <Texto style={{fontWeight: 'bold', fontSize: 20}}>{evidencia.final.classificacao}</Texto>
                                            </View>
                                        </View>
                                        :
                                        <View style={styles.containerMedalha}>
                                            <Texto style={{fontSize: 45, marginRight: 15}}>?</Texto>
                                            <View style={{width: 160}}>
                                                <Texto style={{fontSize: 15}}>Evidência</Texto>
                                                <Texto style={{fontWeight: 'bold', fontSize: 20}}>INCONCLUSIVA</Texto>
                                            </View>
                                        </View>
                                    }
                                    <Texto style={{fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}>{evidencia.nome}</Texto>
                                    <View style={styles.containerAvaliador}>
                                        <Texto style={styles.tituloAvaliador}>Avaliador 1</Texto>
                                        {evidencia.avaliador1?.idAvaliador==="" && <Texto>Aguardando avaliador</Texto>}
                                        {evidencia.avaliador1?.idAvaliador!=="" && <Texto>Avaliado por {evidencia.avaliador1?.idAvaliador === auth.currentUser?.uid ? "Você" : evidencia.avaliador1?.nomeAvaliador}</Texto>}
                                        {evidencia.avaliador1?.idAvaliador !== "" ?
                                            <Botao disabled={true} titulo='Já avaliado' textColor={cores.desativado} style={styles.botaoDesativado}/>
                                            :
                                            <Botao titulo='Avaliar agora' onPress={()=>{setAvaliador(1);setPagina(pagina+1)}} style={{marginTop: 10}}/>
                                        }
                                        
                                    </View>

                                    <View style={styles.containerAvaliador}>
                                        <Texto style={styles.tituloAvaliador}>Avaliador 2</Texto>
                                        {evidencia.avaliador2?.idAvaliador==="" && <Texto>Aguardando avaliador</Texto>}
                                        {evidencia.avaliador2?.idAvaliador!=="" && <Texto>Avaliado por {evidencia.avaliador2?.idAvaliador === auth.currentUser?.uid ? "Você" : evidencia.avaliador2?.nomeAvaliador}</Texto>}
                                        
                                        {evidencia.avaliador2?.idAvaliador !== "" ?
                                            <Botao disabled={true} titulo='Já avaliado' textColor={cores.desativado} style={styles.botaoDesativado}/>
                                            :
                                            <>
                                                {evidencia.avaliador1?.idAvaliador === auth.currentUser?.uid || evidencia.avaliador1?.idAvaliador === "" ?
                                                    <Botao disabled={true} titulo='Bloqueado' textColor={cores.desativado} style={styles.botaoDesativado}/>
                                                :
                                                    <Botao titulo='Avaliar agora' onPress={()=>{
                                                        setAvaliador(2);
                                                        setPagina(pagina+1);
                                                    }} style={{marginTop: 10}}/>
                                                }
                                            </>
                                        }
                                        
                                        
                                    </View>

                                    <View style={styles.containerAvaliador}>
                                        <Texto style={styles.tituloAvaliador}>Avaliador 3</Texto>
                                        {(evidencia.avaliador1?.idAvaliador === "" || evidencia.avaliador2?.idAvaliador === "") ?
                                            <>
                                                <Texto numberOfLines={2} style={{textAlign: 'center'}}>Não é possível fazer uma 3º avaliação para esta evidência no momento.</Texto>
                                                <Botao disabled={true} titulo='Bloqueado' textColor={cores.desativado} style={styles.botaoDesativado}/>
                                            </>
                                            :
                                            <>
                                                {evidencia.avaliador1?.idAvaliador === auth.currentUser?.uid || evidencia.avaliador2?.idAvaliador === auth.currentUser?.uid ?
                                                    <>
                                                        <Texto numberOfLines={2} style={{textAlign: 'center'}}>Você não pode avaliar mais de uma evidência.</Texto>
                                                        <Botao disabled={true} titulo='Bloqueado' textColor={cores.desativado} style={styles.botaoDesativado}/>
                                                    </>
                                                    
                                                :
                                                    <>
                                                        {evidencia.avaliador3?.idAvaliador === "" ?
                                                            <>
                                                                <Texto numberOfLines={2} style={{textAlign: 'center'}}>Aguardando avaliador.</Texto>
                                                                <Botao titulo='Avaliar agora' onPress={()=>{
                                                                    setAvaliador(3);
                                                                    setPagina(pagina+1);
                                                                }} style={{marginTop: 10}}/>
                                                            </>
                                                            :
                                                            <>
                                                                <Texto numberOfLines={2} style={{textAlign: 'center'}}>Avaliado por {evidencia.avaliador3?.idAvaliador === auth.currentUser?.uid ? "Você" : evidencia.avaliador3?.nomeAvaliador}</Texto>
                                                                <Botao disabled={true} titulo='Já avaliado' textColor={cores.desativado} style={styles.botaoDesativado}/>
                                                            </>
                                                        }
                                                        
                                                    </>
                                                }
                                            </>
                                        }

                                    </View>
                                </ScrollView>
                            </View>
                        </>
                    }
                    {pagina === 2 &&
                        <>
                            <Texto style={styles.titulo2}>INTRODUÇÃO</Texto>

                            {evidencia !== undefined &&
                                <View style={styles.containerScroll}>
                                    <ScrollView style={styles.cardScroll} contentContainerStyle={styles.cardScrollContent}>
                                        <InputPersonalizado style={campoComErro === "nome" ? styles.inputErro : {}} value={evidencia.nome} onChangeText={(valor)=>setEvidencia({...evidencia, nome: valor})}  titulo='Nome' placeholder='Nome da evidência' tooltipTexto='Nome da evidência deve transmitir a essência da evidência, de forma sucinta.'/>

                                        <InputPersonalizado style={campoComErro === "palavrasChave" ? styles.inputErro : {}} value={evidencia.palavrasChave} onChangeText={(valor)=>setEvidencia({...evidencia, palavrasChave: valor})}  titulo='Palavras chave' placeholder='Separadas por vírgula. Ex: teste, palavra' tooltipTexto={'Descrever brevemente o tópico em questão e a importância da evidência na discussão. \n\nAjudará a entender a descrição mais abstrata da evidência a seguir.'}/>

                                        <InputPersonalizado returnKeyType="go" onSubmitEditing={()=>avancarPagina()}  multiline={true} style={[{height: 130}, campoComErro === "contextualizacao" ? styles.inputErro : {}]} value={evidencia.contextualizacao} onChangeText={(valor)=>setEvidencia({...evidencia, contextualizacao: valor})}  titulo='Contextualização' placeholder='Contextualização breve' tooltipTexto={'Descrever brevemente o tópico em questão e a importância da evidência na discussão. \n\nAjudará a entender a descrição mais abstrata da evidência a seguir.'}/>

                                        <InputPersonalizado 
                                            multiline={true} 
                                            style={[{height: 60}, campoComErro === "proposito" ? styles.inputErro : {}]} 
                                            value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).proposito} 
                                            onChangeText={(valor) => setEvidencia({
                                                ...evidencia, 
                                                [`avaliador${avaliador}`]: {
                                                    ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                    proposito: valor
                                                }
                                            })}  
                                            titulo='Propósito' 
                                            placeholder='Para que serve?' 
                                            tooltipTexto={'Qual é a intenção da evidência? \n\n- O que a evidência faz/ representa?\n- Qual a razão e a intenção?\n-Que problema/ requisito/ processo de segurança ele aborda?'}
                                        />

                                        <InputPersonalizado 
                                            multiline={true} 
                                            style={[{height: 60}, campoComErro === "identificacao" ? styles.inputErro : {}]} 
                                            value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).identificacao} 
                                            onChangeText={(valor) => setEvidencia({
                                                ...evidencia, 
                                                [`avaliador${avaliador}`]: {
                                                    ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                    identificacao: valor
                                                }
                                            })}  
                                            titulo='Identificação' 
                                            placeholder='Insira a identificação' 
                                            tooltipTexto={"Descreva o artefato que será utilizado na evidência de forma objetiva e clara."}/>

                                        <Botao titulo="Avançar" style={styles.botao} onPress={()=>avancarPagina()}/>
                                    </ScrollView>
                                </View>
                            }
                        </>
                    }
                    {pagina === 3 &&
                        <>
                            <Texto style={styles.titulo2}>APRESENTAÇÃO</Texto>
                            <View style={styles.containerScroll}>
                                <ScrollView style={styles.cardScroll} contentContainerStyle={styles.cardScrollContent}>
                                    <InputPersonalizado 
                                        titulo='Autores' 
                                        placeholder='Separados por vírgula, ex: Ana, João, José' 
                                        style={campoComErro === "autores" ? styles.inputErro : {}} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).autores} 
                                        onChangeText={(valor) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                autores: valor
                                            }
                                        })} 
                                        tooltipTexto='Quem é o autor ? ele é a pessoa/empresa indicada para propor a evidência?' 
                                    />

                                    <InputPersonalizado 
                                        titulo='Data' 
                                        placeholder='DD/MM/AAAA' 
                                        mascara='DATA' 
                                        keyboardType='phone-pad' 
                                        maxLength={10} 
                                        style={campoComErro === "data" ? styles.inputErro : {}} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).data} 
                                        onChangeText={(valor) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                data: valor
                                            }
                                        })} 
                                    />

                                    <InputPersonalizado 
                                        titulo='Tipo' 
                                        placeholder='Qual o tipo da evidência?' 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).tipo} 
                                        onChangeText={(valor) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                tipo: valor
                                            }
                                        })} 
                                        multiline={true} 
                                        style={campoComErro === "tipo" ? styles.inputErro : {}} 
                                    />

                                    <InputPersonalizado 
                                        titulo='Norma regulatória' 
                                        placeholder='Qual a norma regulatória?' 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).normaRegulatoria} 
                                        onChangeText={(valor) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                normaRegulatoria: valor
                                            }
                                        })} 
                                        multiline={true} style={[{height: 80}, campoComErro === "normaRegulatoria" ? styles.inputErro : {}]}
                                        tooltipTexto='Existe algum, padrão ou norma que regulamente a evidência? se sim qual?'
                                    />

                                    <InputPersonalizado 
                                        returnKeyType="go" onSubmitEditing={()=>avancarPagina()}
                                        autoCapitalize='none'
                                        titulo='Link da fonte' 
                                        placeholder='https://exemplo.com' 
                                        style={campoComErro === "linkFonte" ? styles.inputErro : {}} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).linkFonte} 
                                        onChangeText={(valor) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                linkFonte: valor
                                            }
                                        })} 
                                        tooltipTexto='Local onde está o estudo, documentação do artefato que será utilizado na evidência.'
                                    />
                                    
                                    <InputPersonalizado 
                                        titulo='Contextualizar' 
                                        placeholder='Relação com outras pesquisas existentes' 
                                        style={[{height: 80}, campoComErro === "contextualizar" ? styles.inputErro : {}]} 
                                        multiline={true} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).contextualizar} 
                                        onChangeText={(valor) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                contextualizar: valor
                                            }
                                        })} 
                                        tooltipTexto='Relacione a evidência com outras pesquisas existentes na área, se houver.'
                                    />

                                    <View style={styles.checkboxContainer}>
                                        <Checkbox 
                                            value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).revisaoPares} 
                                            onValueChange={(valor) => setEvidencia({
                                                ...evidencia, 
                                                [`avaliador${avaliador}`]: {
                                                    ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                    revisaoPares: valor
                                                }
                                            })} 
                                            style={{marginRight: 10}}
                                        />

                                        <Label texto="Revisão por pares" tooltipTexto='Indica um processo mais rigoroso de avaliação. Evitando que apenas um engenheiro, seja o unico responsável em reconhecer o potencial de algum artefato que será utilizado na evidência.' />
                                    </View>

                                    <InputPersonalizado 
                                        titulo='Consistência com a leitura anterior' 
                                        placeholder='Insira a consistência' 
                                        style={[{height: 80}, campoComErro === "consistenciaLeituraAnterior" ? styles.inputErro : {}]} 
                                        multiline={true} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).consistenciaLeituraAnterior} 
                                        onChangeText={(valor) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                consistenciaLeituraAnterior: valor
                                            }
                                        })} 
                                        tooltipTexto={"Avalie se os resultados são consistentes com estudos prévios ou se apresentam novas perspectivas."}
                                    />
                                    
                                    <Botao titulo="Avançar" style={[styles.botao, {marginBottom: 50}]} onPress={()=>avancarPagina()}/>
                                </ScrollView>
                            </View>
                        </>
                    }
                    {pagina === 4 &&
                        <>
                            <Texto style={styles.titulo2}>ANÁLISE CRÍTICA</Texto>
                            <View style={styles.containerScroll}>
                                <ScrollView style={styles.cardScroll} contentContainerStyle={styles.cardScrollContent}>
                                    <InputPersonalizado 
                                        titulo='Texto de amostra' 
                                        placeholder='Digite um texto de amostra' 
                                        multiline={true} 
                                        style={[{height: 70}, campoComErro === "textoAmostra" ? styles.inputErro : {}]} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).textoAmostra} 
                                        onChangeText={(valor) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                textoAmostra: valor
                                            }
                                        })} 
                                        tooltipTexto='Fragmentos de texto que ilustram como você pode descrever a evidência no caso de segurança/plano de segurança final.' 
                                    />

                                    <InputPersonalizado 
                                        titulo='Usos conhecidos' 
                                        placeholder='Cite exemplos de aplicação' 
                                        multiline={true} 
                                        style={[{height: 60}, campoComErro === "usosConhecidos" ? styles.inputErro : {}]} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).usosConhecidos} 
                                        onChangeText={(valor) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                usosConhecidos: valor
                                            }
                                        })} 
                                        tooltipTexto='Devem ser citados exemplos de aplicação de evidências em documentação de segurança existente. Se possível, devem ser mostrados exemplos de no minimo duas aplicações diferentes.' 
                                    />

                                    <InputPersonalizado 
                                        titulo='Implementação' 
                                        placeholder='O que deve ser notado ao usar' 
                                        multiline={true} 
                                        style={[{height: 70}, campoComErro === "implementacao" ? styles.inputErro : {}]} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).implementacao} 
                                        onChangeText={(valor) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                implementacao: valor
                                            }
                                        })} 
                                        tooltipTexto='Com quais armadilhas, dicas ou técnicas você deve tomar cuidado ao usar a evidencia? Que graus de flexibilidade existem para utilizar a evidência?' 
                                    />

                                    <InputPersonalizado 
                                        titulo='Possíveis viéses' 
                                        placeholder='Cite possíveis viéses' 
                                        style={[{height: 60}, campoComErro === "possiveisVieses" ? styles.inputErro : {}]} 
                                        multiline={true} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).possiveisVieses} 
                                        onChangeText={(valor) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                possiveisVieses: valor
                                            }
                                        })} 
                                        tooltipTexto='Identifique possíveis viéses ou limitações que não foram explicitamente mencionadas, mas que podem afetar a validade dos resultados' 
                                    />

                                    <InputPersonalizado 
                                        titulo='Conflitos de interesse' 
                                        placeholder='Existem conflitos de interesse?' 
                                        style={campoComErro === "conflitosInteresse" ? styles.inputErro : {}} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).conflitosInteresse} 
                                        onChangeText={(valor) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                conflitosInteresse: valor
                                            }
                                        })} 
                                        returnKeyType="go" 
                                        onSubmitEditing={()=>avancarPagina()}
                                        tooltipTexto='Verifique se há possíveis conflitos de interesse que possam influenciar a objetividade dos resultados.' 
                                    />

                                    <Botao titulo="Avançar" style={styles.botao} onPress={()=>avancarPagina()}/>
                                </ScrollView>
                            </View>
                        </>
                    }
                    {pagina === 5 &&
                        <>
                            <Texto style={styles.titulo2}>CLASSIFICAÇÃO</Texto>
                            <View style={styles.containerScroll}>
                                <ScrollView style={styles.cardScroll} contentContainerStyle={styles.cardScrollContent}>
                                    <InputPersonalizado 
                                        titulo='Síntese da análise' 
                                        placeholder='Digite a síntese' 
                                        multiline={true} 
                                        style={[{height: 70}, campoComErro === "sintese" ? styles.inputErro : {}]} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).sintese} 
                                        onChangeText={(valor) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                sintese: valor
                                            }
                                        })} 
                                        tooltipTexto='Resuma as principais conclusões da análise crítica' 
                                    />

                                    <Label texto={"A evidência..."} style={campoComErro === "compreensao" ? styles.textoErro : {}}
                                        tooltipTexto='Assinale com Sim ou Não (Escolher uma única opção)' />

                                    <View style={styles.checkboxContainer}>
                                        <Checkbox 
                                            value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).compreensao === 'fortalece'}   
                                            onValueChange={() => setEvidencia({
                                                ...evidencia, 
                                                [`avaliador${avaliador}`]: {
                                                    ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                    compreensao: 'fortalece'
                                                }
                                            })} 
                                            style={{marginRight: 10}}
                                        />
                                        <Label>Fortalece a compreensão</Label>
                                    </View>

                                    <View style={styles.checkboxContainer}>
                                        <Checkbox 
                                            value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).compreensao === 'não altera'} 
                                            onValueChange={() => setEvidencia({
                                                ...evidencia, 
                                                [`avaliador${avaliador}`]: {
                                                    ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                    compreensao: 'não altera'
                                                }
                                            })} 
                                            style={{marginRight: 10}}
                                        />
                                        <Label>Não altera a compreensão</Label>
                                    </View>

                                    <View style={styles.checkboxContainer}>
                                        <Checkbox 
                                            value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).compreensao === 'enfraquece'} 
                                            onValueChange={() => setEvidencia({
                                                ...evidencia, 
                                                [`avaliador${avaliador}`]: {
                                                    ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                    compreensao: 'enfraquece'
                                                }
                                            })} 
                                            style={{marginRight: 10}}
                                        />
                                        <Label>Enfraquece a compreensão</Label>
                                    </View>

                                    <InputPersonalizado 
                                        titulo='Verificar relevância' 
                                        placeholder='Selecione' 
                                        style={campoComErro === "relevancia" ? styles.inputErro : {}} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).relevancia} 
                                        onValueChange={(itensSelecionados) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                relevancia: itensSelecionados[0]
                                            }
                                        })} 
                                        itensSelect={[{valor: "1", descricao: "1"}, {valor: "2", descricao: "2"}, {valor: "3", descricao: "3"}, {valor: "4", descricao: "4"}, {valor: "5", descricao: "5"}]} 
                                        valoresSelecionadosSelect={[(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).relevancia]} 
                                        tooltipTexto='Defina um valor de 1 à 5' 
                                    />

                                    <InputPersonalizado 
                                        titulo='Verificar cobertura' 
                                        placeholder='Selecione' 
                                        style={campoComErro === "cobertura" ? styles.inputErro : {}} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).cobertura} 
                                        onValueChange={(itensSelecionados) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                cobertura: itensSelecionados[0]
                                            }
                                        })} 
                                        itensSelect={[{valor: "1", descricao: "1"}, {valor: "2", descricao: "2"}, {valor: "3", descricao: "3"}, {valor: "4", descricao: "4"}, {valor: "5", descricao: "5"}]} 
                                        valoresSelecionadosSelect={[(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).cobertura]}
                                        tooltipTexto='Defina um valor de 1 à 5' 
                                    />

                                    <InputPersonalizado 
                                        titulo='Verificar força' 
                                        placeholder='Selecione' 
                                        style={campoComErro === "forca" ? styles.inputErro : {}} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).forca} 
                                        onValueChange={(itensSelecionados) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                forca: itensSelecionados[0]
                                            }
                                        })} 
                                        itensSelect={[{valor: "1", descricao: "1"}, {valor: "2", descricao: "2"}, {valor: "3", descricao: "3"}, {valor: "4", descricao: "4"}, {valor: "5", descricao: "5"}]} 
                                        valoresSelecionadosSelect={[(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).forca]}
                                        tooltipTexto='Defina um valor de 1 à 5' 
                                    />

                                    <InputPersonalizado 
                                        titulo='Determinar grau de perigo' 
                                        placeholder='Selecione' 
                                        style={campoComErro === "grauDeImportancia" ? styles.inputErro : {}} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).grauDeImportancia} 
                                        onValueChange={(itensSelecionados) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                grauDeImportancia: itensSelecionados[0]
                                            }
                                        })} 
                                        itensSelect={[{valor: "1", descricao: "1"}, {valor: "2", descricao: "2"}, {valor: "3", descricao: "3"}, {valor: "4", descricao: "4"}, {valor: "5", descricao: "5"}, {valor: "6", descricao: "6"}, {valor: "7", descricao: "7"}, {valor: "8", descricao: "8"}, {valor: "9", descricao: "9"}, {valor: "10", descricao: "10"}]} 
                                        valoresSelecionadosSelect={[(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).grauDeImportancia]}
                                        tooltipTexto='Defina um valor de 1 à 10, onde 1 não tem perigo caso a falha ocorra e 10 é extremamente perigoso' 
                                    />

                                    {evidencia.categoria==="hardware" && 
                                        <InputPersonalizado 
                                            titulo='Probabilidade de falha' 
                                            placeholder='Selecione' 
                                            style={campoComErro === "probabilidadeFalha" ? styles.inputErro : {}} 
                                            value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).probabilidadeFalha} 
                                            onValueChange={(itensSelecionados) => setEvidencia({
                                                ...evidencia, 
                                                [`avaliador${avaliador}`]: {
                                                    ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                    probabilidadeFalha: itensSelecionados[0]
                                                }
                                            })} 
                                            itensSelect={[{valor: "1", descricao: "1 - Frequente "}, {valor: "2", descricao: "2 - Provável"}, {valor: "3", descricao: "3 - Ocasional"}, {valor: "4", descricao: "4 - Remoto"}, {valor: "5", descricao: "5 - Improvável"}, {valor: "6", descricao: "6 - Eliminado"}]} 
                                            valoresSelecionadosSelect={[(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).probabilidadeFalha]}
                                            tooltipTexto='Defina um valor de 1 à 6' 
                                            returnKeyType="go" onSubmitEditing={()=>avancarPagina()}
                                        />
                                    }
                                    <InputPersonalizado 
                                        titulo='Justificativa' 
                                        placeholder='Justifique a análise' 
                                        multiline={true} 
                                        style={[{height: 70}, campoComErro === "justificativa" ? styles.inputErro : {}]} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).justificativa} 
                                        onChangeText={(valor) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                justificativa: valor
                                            }
                                        })} 
                                        tooltipTexto='Justifique os motivos que te levou a escolher essa avaliação.' 
                                    />
                                
                                    <Botao titulo="Avançar" style={[styles.botao, {marginBottom: 60}]} onPress={()=>avancarPagina()}/>
                                </ScrollView>
                            </View>
                        </>
                    }
                    {pagina === 6 &&
                        <>
                            <Texto style={styles.titulo2}>PROBABILIDADE DE FALHAS</Texto>
                            <View style={styles.containerScroll}>
                                <ScrollView style={styles.cardScroll} contentContainerStyle={styles.cardScrollContent}>
                                    
                                    <View style={styles.checkboxContainer}>
                                        <Checkbox 
                                            value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).opcoesSoftware?.taxaDefeitos} 
                                            onValueChange={() => setEvidencia({
                                                ...evidencia, 
                                                [`avaliador${avaliador}`]: {
                                                    ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                    opcoesSoftware: {...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao).opcoesSoftware, taxaDefeitos: !(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao).opcoesSoftware?.taxaDefeitos}
                                                }
                                            })} 
                                            style={{marginRight: 10}}
                                        />
                                        <Label texto="Taxa de Defeitos" tooltipTexto={"calcula o número de bugs detectados por mil linhas de código (KLOC).\n• Como medir: Contabilizam-se os defeitos encontrados por KLOC durante o desenvolvimento e os testes, oferecendo uma visão quantitativa da probabilidade de falhas com base no histórico de erros e correções"}/>
                                    </View>

                                    <View style={styles.checkboxContainer}>
                                        <Checkbox 
                                            value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).opcoesSoftware?.coberturaTestes} 
                                            onValueChange={() => setEvidencia({
                                                ...evidencia, 
                                                [`avaliador${avaliador}`]: {
                                                    ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                    opcoesSoftware: {...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao).opcoesSoftware, coberturaTestes: !(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao).opcoesSoftware?.coberturaTestes}
                                                }
                                            })} 
                                            style={{marginRight: 10}}
                                        />
                                        <Label texto="Cobertura de Testes" tooltipTexto={"É uma métrica essencial para identificar possíveis áreas de falha no software. Cobrir o maior número possível de cenários e casos de teste diminui a incerteza e a propensão a falhas"}/>
                                    </View>

                                    <View style={styles.checkboxContainer}>
                                        <Checkbox 
                                            value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).opcoesSoftware?.AnaliseFatoresHumanosViesCognitivo} 
                                            onValueChange={() => setEvidencia({
                                                ...evidencia, 
                                                [`avaliador${avaliador}`]: {
                                                    ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                    opcoesSoftware: {...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao).opcoesSoftware, AnaliseFatoresHumanosViesCognitivo: !(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao).opcoesSoftware?.AnaliseFatoresHumanosViesCognitivo}
                                                }
                                            })} 
                                        />
                                        <Label texto='Análise de Fatores Humanos e Viés Cognitivo' tooltipTexto='Revisões de código e sessões de feedback podem ajudar a identificar padrões de comportamento que indiquem vieses. A aplicação de metodologias colaborativas, como programação em par, pode atenuar a influência desses vieses no desenvolvimento'/>
                                    </View>

                                    <View style={styles.checkboxContainer}>
                                        <Checkbox 
                                            value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).opcoesSoftware?.FmeaFmeca} 
                                            onValueChange={() => setEvidencia({
                                                ...evidencia, 
                                                [`avaliador${avaliador}`]: {
                                                    ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                    opcoesSoftware: {...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao).opcoesSoftware, FmeaFmeca: !(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao).opcoesSoftware?.FmeaFmeca}
                                                }
                                            })} 
                                            style={{marginRight: 10}}
                                        />
                                        <Label texto="FMEA / FMECA" tooltipTexto={"A Análise de Modos de Falha e Efeitos (FMEA) e a Análise de Modos de Falha, Efeitos e Análise Crítica (FMECA) são métodos usados para avaliar a criticidade e a probabilidade de diferentes modos de falha.\n• Como medir: No contexto de software, identifica-se os principais modos de falha para cada componente e avalia-se a probabilidade e a severidade de cada um, permitindo intervenções preventivas em áreas de maior risco"}/>
                                    </View>

                                    <View style={styles.checkboxContainer}>
                                        <Checkbox 
                                            value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).opcoesSoftware?.HistoricoFalasMetricasProducao} 
                                            onValueChange={() => setEvidencia({
                                                ...evidencia, 
                                                [`avaliador${avaliador}`]: {
                                                    ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                    opcoesSoftware: {...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao).opcoesSoftware, HistoricoFalasMetricasProducao: !(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao).opcoesSoftware?.HistoricoFalasMetricasProducao}
                                                }
                                            })} 
                                            style={{marginRight: 10}}
                                        />

                                        <Label texto="Histórico de Falhas e Métricas em produção" tooltipTexto={"Análise de falhas registradas em ambiente de produção oferece informações valiosas para avaliar a probabilidade de falhas. Esta análise pode identificar padrões que indiquem áreas ou componentes mais propensos a falhas.\n\n• Como medir: Monitora-se e registra-se as falhas reportadas por usuários e eventos de falha em tempo real, gerando métricas como o Tempo Médio Entre Falhas (MTBF) para fornecer uma visão contínua da confiabilidade do software"}></Label>
                                    </View>

                                    <View style={styles.checkboxContainer}>
                                        <Checkbox 
                                            value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).opcoesSoftware!.AnaliseArvoresFalha} 
                                            onValueChange={() => setEvidencia({
                                                ...evidencia, 
                                                [`avaliador${avaliador}`]: {
                                                    ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                    opcoesSoftware: {...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao).opcoesSoftware, AnaliseArvoresFalha: !(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao).opcoesSoftware?.AnaliseArvoresFalha}
                                                }
                                            })} 
                                            style={{marginRight: 10}}
                                        />
                                        <Label texto='Análise de Árvores de falha' tooltipTexto={'É uma técnica gráfica que utiliza diagramas lógicos para modelar as relações de causa e efeito entre possíveis falhas de componentes e suas causas. Este método é frequentemente aplicado em sistemas críticos para prever a probabilidade de falhas complexas.\n\nCria-se um diagrama que representa as interações entre diferentes componentes do sistema que podem levar a falhas. Cada falha básica recebe uma probabilidade, que é combinada para calcular a probabilidade global de falha do sistema'}/>
                                    </View>

                                    <View style={styles.checkboxContainer}>
                                        <Checkbox 
                                            value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).opcoesSoftware!.ModelosMaturidadeProcesso} 
                                            onValueChange={() => setEvidencia({
                                                ...evidencia, 
                                                [`avaliador${avaliador}`]: {
                                                    ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                    opcoesSoftware: {...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao).opcoesSoftware, ModelosMaturidadeProcesso: !(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao).opcoesSoftware?.ModelosMaturidadeProcesso}
                                                }
                                            })} 
                                            style={{marginRight: 10}}
                                        />
                                        <Label texto='Modelos de Maturidade de Processo' tooltipTexto={'o CMMI e a norma ISO 9126, são amplamente aplicados para avaliar o grau de conformidade com padrões de qualidade e processos bem definidos, os quais estão associados a uma menor probabilidade de falhas no software.\n• Como medir: Realizam-se auditorias e revisões de conformidade com as práticas de desenvolvimento, identificando-se fraquezas no processo que possam elevar a probabilidade de falhas'}/>
                                    </View>

                                    

                                    <InputPersonalizado 
                                        titulo='Probabilidade de falha' 
                                        placeholder='Selecione' 
                                        style={campoComErro === "probabilidadeFalha" ? styles.inputErro : {}} 
                                        value={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).probabilidadeFalha} 
                                        onValueChange={(itensSelecionados) => setEvidencia({
                                            ...evidencia, 
                                            [`avaliador${avaliador}`]: {
                                                ...(evidencia[`avaliador${avaliador}` as keyof typeof evidencia] as IAvaliacao),
                                                probabilidadeFalha: itensSelecionados[0]
                                            }
                                        })} 
                                        itensSelect={[{valor: "1", descricao: "1 - Frequente "}, {valor: "2", descricao: "2 - Provável"}, {valor: "3", descricao: "3 - Ocasional"}, {valor: "4", descricao: "4 - Remoto"}, {valor: "5", descricao: "5 - Improvável"}, {valor: "6", descricao: "6 - Eliminado"}]} 
                                        valoresSelecionadosSelect={[(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).probabilidadeFalha]}
                                        tooltipTexto='Defina um valor de 1 à 6' 
                                        returnKeyType="go" 
                                        onSubmitEditing={()=>avancarPagina()}
                                    />

                                    <Botao titulo="Avançar" style={styles.botao} onPress={()=>avancarPagina()}/>
                                </ScrollView>
                            </View>
                        </>
                    }
                    {pagina === 7 &&
                        <View style={[styles.containerScroll]}>
                            <Texto style={[styles.tituloSelo, {textAlign:'center'}]}>RELEVÂNCIA</Texto>

                            <Image style={styles.medalha} source={(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).selo === "bronze" ? bronze : (evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).selo === "prata" ? prata : (evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).selo === "ouro" ? ouro : cobre}/>

                            <Texto style={[styles.tituloSelo, {textAlign:'center'}]}>SELO {(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).selo?.toUpperCase()}</Texto>

                            <View style={[styles.card, {padding: 15}]}>
                                <Texto style={{fontWeight: 'bold'}}>A EVIDÊNCIA É</Texto>

                                <Texto style={{fontSize: 30, fontWeight: '900', marginBottom: 30}}>{(evidencia[("avaliador"+avaliador) as keyof typeof evidencia]! as IAvaliacao).classificacao}</Texto>

                                <Botao titulo={modo==="cadastrar"?'Concluir':"Atualizar dados"} onPress={()=>salvarEvidencia()}/>
                                
                                <Botao style={styles.botaoCancelar} titulo="Cancelar" onPress={() => navigation.goBack()} />
                            </View>
                        </View>
                    }
  
                </View>
            </LinearGradient>

            <BotaoVoltar onPress={()=>(pagina===1||pagina===0)?navigation.goBack():setPagina(pagina-(pagina === 7 && evidencia.categoria === "hardware"?2:1))}/>
            <Loader texto={estadoLoading}/>
        </ScrollView>
    )
}
