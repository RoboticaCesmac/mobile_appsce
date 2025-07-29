import { Image,  View, Alert, ToastAndroid, FlatList, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import { Botao } from '@/src/components/botao';
import { ItemLista } from '@/src/components/itemLista';
import Texto from '@/src/components/texto';
import Loader from '@/src/components/loader';
import BotaoVoltar from '@/src/components/botaoVoltar';

import { RootStackParamList } from '@/src/navigations';
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useNavigation } from 'expo-router';

import { IProjeto } from '@/src/interfaces/projeto';
import { auth, db } from '@/src/config/firebase';
import * as Print from 'expo-print';
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";

import { medalhaType } from '@/src/types/icones';
import { LinearGradient } from 'expo-linear-gradient';
import { cores } from '../../themes/cores';
import { styles } from './styles';
import BarraDePesquisa from '@/src/components/barraDePesquisa';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import traduzirErro from '@/src/util/firebasePTBR';
import { IEvidencia } from '@/src/interfaces/evidencia';
import getTemplate from '@/src/template/documento';
import {  gerarPdfEAbrirComTodas, verificarEvidencia } from '@/src/util/pdf';
import { IUsuario } from '@/src/interfaces/usuario';

export default function TelaEvidencias(){
    const navigation = useNavigation<RootStackParamList>();
    const [palavraPesquisa, setPalavraPesquisa] = useState<string>("");
    const alterarVisibilidadeRef = useRef<(visibilidade: boolean) => void>();
    const [textoLoader, setTextoLoader] = useState<string>("");
    const projetoRecebido: IProjeto = useRoute().params as IProjeto;
    const isFocused = useIsFocused();

    const [evidencias, setEvidencias] = useState<IEvidencia[]>([]);
    const [evidenciasOriginais, setEvidenciasOriginais] = useState<IEvidencia[]>([]);

    useEffect(() => {
        if(isFocused){ 
            buscarEvidencias();
        }
    }, [isFocused]);

    
    /**
     * Função para pesquisar evidencias
     */
    useEffect(()=>{
        setEvidencias(evidenciasOriginais.filter(evidencia => evidencia.nome.toLowerCase().includes(palavraPesquisa.toLowerCase())))
    }, [palavraPesquisa]);

    /**
     * Busca os projetos do usuário logado no banco de dados Cloud Firestore
     */
    const buscarEvidencias= async () =>{
        try{
            setTextoLoader("Listando...");
            const dadosUsuario = doc(db, "usuarios", auth.currentUser!.uid);
            let usuario:IUsuario = (await getDoc(dadosUsuario)).data() as IUsuario;

            let listaEvidencias:IEvidencia[] = [];
            const consulta = query(collection(db, "evidencias"), where("projetoId", "==", projetoRecebido.id));
            const docsRegistros = await getDocs(consulta);
            docsRegistros.forEach((documento) => {
                // Mostra todas as suas evidências
                if(projetoRecebido.uid === auth.currentUser?.uid || ((documento.data() as IEvidencia).categoria === "hardware" && usuario.tipoAvaliador?.includes("hardware")) || (documento.data() as IEvidencia).categoria === "software" && usuario.tipoAvaliador?.includes("software")){
                    listaEvidencias.push(documento.data() as IEvidencia);
                }
            });
            setEvidencias(listaEvidencias);
            setEvidenciasOriginais(listaEvidencias);
        }catch(erro:any){
            if(Platform.OS === "android"){
                ToastAndroid.show(erro.name==="Error"?erro.message:traduzirErro(erro.message), ToastAndroid.LONG);
            }else{
                Alert.alert(
                    'Erro',
                    erro.name==="Error"?erro.message:traduzirErro(erro.message),
                    [{
                        text: 'OK',
                    }]
                );
            }
        }finally{
            setTextoLoader("");
        }
    }

    /**
     * Exclui evidências do banco de dados
     */
    const excluirEvidencia = (evidenciaAExcluir: IEvidencia)=>{
        Alert.alert(
            'Alerta',
            'Tem certeza que deseja excluir ' + evidenciaAExcluir.nome+"?",
            [{
                text: 'CANCELAR',
            },
            {
                text: 'Excluir',
                onPress: async () => {
                    setTextoLoader("Excluindo "+evidenciaAExcluir.nome+"...");
                    await deleteDoc(doc(db, "evidencias", evidenciaAExcluir.id!));
                    buscarEvidencias();
                },
            },],
            {
                cancelable: true,
            }
        );
    }


    /**Altera a visibilidade da barra de pesquisa */
    const alternarVisibilidade = ()=> alterarVisibilidadeRef.current!(false);

    return(
        <LinearGradient colors={[cores.fundoGradiente1, cores.fundoGradiente2]} style={styles.pagina}>
            <View style={styles.container}>             
                <HideWithKeyboard>
                    <Image style={styles.logo} resizeMode='contain' source={require('../../assets/imagens/logo.png')}/> 
                </HideWithKeyboard>
                <Texto style={styles.textoBemVindo}>PROJETO 01</Texto>

                <View style={styles.card}>
                    <View style={styles.cabecalhoCard}>
                        <BarraDePesquisa onChangeText={(valor)=>setPalavraPesquisa(valor)} value={palavraPesquisa} titulo='Evidências cadastradas' placeholder='🔍 Pesquisar...' onAlterarVisibilidade={(callback) => (alterarVisibilidadeRef.current = callback)} />
                        <Botao iconeEsquerda={'pesquisar'} style={styles.botaoPesquisar} onPress={()=>alternarVisibilidade()}/>
                        {projetoRecebido.uid === auth.currentUser?.uid && // Libera cadastrar somente no próprio projeto
                            <Botao iconeEsquerda={'adicionar'} style={styles.botaoAdicionar} onPress={()=>navigation.navigate('cadastroEvidencia', {evidencia: undefined, projeto: projetoRecebido})}/>
                        }
                    </View>

                    <View style={styles.containerLista}>

                        {evidencias !== undefined && evidencias?.length > 0
                        ?
                            <FlatList
                                style={{width: '100%'}}
                                data={evidencias}
                                renderItem={({item, index}) => <ItemLista key={item.id} medalha={item.final.selo as medalhaType} titulo={item.nome} onPressImprimir={() => verificarEvidencia(item, setTextoLoader)} onPressApagar={()=>excluirEvidencia(item)} onPressEditar={()=>navigation.navigate('cadastroEvidencia', {evidencia: item, projeto: projetoRecebido})}/>}
                                keyExtractor={item => item.id!}

                            />
                        :
                        <>
                            <View style={styles.containerListaVazia}>
                                
                                <View style={styles.flexCenter}>
                                    <HideWithKeyboard>
                                        <Image style={{width: 140, height: 90}} resizeMode='contain' source={require('../../assets/imagens/oops.png')}/> 
                                    </HideWithKeyboard>
                                    <HideWithKeyboard>
                                        <Texto style={styles.textos}>Nenhuma evidência encontrada.</Texto><Texto style={styles.textos}>As evidências cadastradas aparecerão aqui.</Texto>
                                    </HideWithKeyboard>
                                </View>
                                <HideWithKeyboard>
                                    <Botao titulo="Cadastrar evidência" onPress={()=>navigation.navigate('cadastroEvidencia', {evidencia: undefined, projeto: projetoRecebido})} />
                                </HideWithKeyboard>
                            </View>
                        </>
                        }

                    </View>
                    {evidencias !== undefined && evidencias?.length > 1 && <Botao style={styles.botaoImprimir} onPress={()=>gerarPdfEAbrirComTodas(evidencias, setTextoLoader)} titulo='Imprimir todas'/>}
                </View>
            </View>

            <Loader texto={textoLoader}/>
            <BotaoVoltar/>
        </LinearGradient>
    )
}
