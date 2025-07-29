import { Image,  View, Alert, ToastAndroid, FlatList, Dimensions, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

import { RootStackParamList } from '@/src/navigations';
import { useNavigation } from 'expo-router';

import InputPersonalizado from '@/src/components/inputPersonalizado';
import { Botao } from '@/src/components/botao';
import { ItemLista } from '@/src/components/itemLista';
import Texto from '@/src/components/texto';
import Loader from '@/src/components/loader';
import ModalPersonalizado from '@/src/components/modalPersonalizado';

import { IProjeto } from '@/src/interfaces/projeto';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/src/config/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import traduzirErro from '@/src/util/firebasePTBR';

import { LinearGradient } from 'expo-linear-gradient';
import { cores } from '../../themes/cores';
import { styles } from './styles';
import BarraDePesquisa from '@/src/components/barraDePesquisa';
import { IEvidencia } from '@/src/interfaces/evidencia';
import { IUsuario, TipoAvaliador } from '@/src/interfaces/usuario';
import { TouchableOpacity } from 'react-native';

export default function TelaProjetos(){
    const navigation = useNavigation<RootStackParamList>();
    const isFocused = useIsFocused();
    const [textoLoader, setTextoLoader] = useState<string>("");
    const alterarVisibilidadeRef = useRef<(visibilidade: boolean) => void>();

    const [projeto, setProjeto] = useState<IProjeto|undefined>(undefined);
    const [projetosOriginal, setProjetosOriginal] = useState<IProjeto[]>([]);
    const [projetos, setProjetos] = useState<IProjeto[]>([]);
    const [palavraPesquisa, setPalavraPesquisa] = useState<string>("");
    const [palavraPesquisaUsuarios, setPalavraPesquisaUsuarios] = useState<string>("");
    const [usuario, setUsuario] = useState<IUsuario>();
    const [usuarioAEditar, setUsuarioAEditar] = useState<IUsuario | undefined>(undefined);
    const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
    const [usuariosOriginal, setUsuariosOriginal] = useState<IUsuario[]>([]);
    const [modalAdminVisivel, setModalAdminVisivel] = useState<boolean>(false);

    useEffect(() => {
        if(isFocused){ 
            buscarProjetos();
        }
    }, [isFocused]);

    useEffect(() => {
        if(usuario && usuario?.admin){ 
            buscarUsuarios();
        }
    }, [usuario]);

    /**
     * Busca os projetos do usuário logado no banco de dados Cloud Firestore
     */
    const buscarProjetos = async () =>{
        try{
            setTextoLoader("Listando...");
            let listaProjetosAdmin:IProjeto[] = [];
            const dadosUsuario = doc(db, "usuarios", auth.currentUser!.uid);
            let usuario:IUsuario = (await getDoc(dadosUsuario)).data() as IUsuario;
            setUsuario(usuario);
            let consulta;
            // Lista todos os projetos caso seja avaliador
            if(usuario.tipoAvaliador !== ""){
                consulta = query(collection(db, "projetos"));
                const docsRegistros = await getDocs(consulta);
                docsRegistros.forEach((documento) => {
                    listaProjetosAdmin.push(documento.data() as IProjeto);
                });
            }

            let listaProjetos:IProjeto[] = [];

            // Lista apenas os próprios projetos
            consulta = query(collection(db, "projetos"), where("uid", "==", auth.currentUser?.uid));
            const docsRegistros = await getDocs(consulta);
            docsRegistros.forEach((documento) => {
                listaProjetos.push(documento.data() as IProjeto);
            });

            
            setProjetos([...listaProjetos, ...listaProjetosAdmin.filter(item2 => !listaProjetos.some(item1 => item1.id === item2.id))]);
            setProjetosOriginal([...listaProjetos, ...listaProjetosAdmin.filter(item2 => !listaProjetos.some(item1 => item1.id === item2.id))]);
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
     * Busca os usuários
     */
    const buscarUsuarios = async () =>{
        try{
            let listaUsuarios:IUsuario[] = [];
        
            const consulta = query(collection(db, "usuarios"));
           
            const docsRegistros = await getDocs(consulta);
            docsRegistros.forEach((documento) => {
                listaUsuarios.push(documento.data() as IUsuario);
            });
            setUsuarios(listaUsuarios);
            setUsuariosOriginal(listaUsuarios);
        }catch(erro:any){
            ToastAndroid.show(traduzirErro(erro), ToastAndroid.SHORT);
        }
    }

    /**
     * Função para pesquisar 
     */
    useEffect(()=>{
        setProjetos(projetosOriginal.filter(projeto => projeto.nome.toLowerCase().includes(palavraPesquisa.toLowerCase())));
        setUsuarios(usuariosOriginal.filter(usuario => usuario.nome.toLowerCase().includes(palavraPesquisaUsuarios.toLowerCase())));
    }, [palavraPesquisa, palavraPesquisaUsuarios]);


    /**
     * Função para sair da conta e voltar para a tela de login
     */
    const sair = () =>{
        Alert.alert(
            'Alerta',
            'Tem certeza que deseja sair da sua conta e voltar para a tela de login?',
            [{text: 'CANCELAR'},
            {
                text: 'SAIR',
                onPress: async () => {
                    await signOut(auth);
                    navigation.navigate("autenticacao");
                    ToastAndroid.show("Deslogado!", ToastAndroid.SHORT);
                },
            },],
            {cancelable: true}
        );
    }

    /**
     * Salva os dados do registro no banco de dados Cloud Firestore
     */
    const salvarProjeto = async () => {
        try{
            setTextoLoader("Salvando...");

            if(projeto?.nome === ""){
                throw new Error("Digite um nome para o seu projeto");
            }
            
            // Verifica se o usuário está autenticado
            const idUsuario = auth.currentUser?.uid;
            if(idUsuario === undefined){
                throw new Error("Usuário não autenticado. Por favor, autentique-se novamente.");
            }

            let idRegistro = projeto?.id;

            // Se o usuário estiver autenticado e for um novo cadastro
            if(idRegistro === ""){
                idRegistro = doc(collection(db, "projetos")).id;
            }

            // Salva no banco de dados, reinicia a página e redireciona para a página de historico
            await setDoc(doc(db, "projetos", idRegistro!), {nome: projeto?.nome, id: idRegistro!, uid: auth.currentUser?.uid});

            setProjeto(undefined);
            buscarProjetos();
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
     * Altera os dados do usuário, removendo ou dando previlégios
     * @param operacao 
     */
    const alterarUsuario = async (operacao: "adicionar-avaliador-hardware" | "adicionar-admin" | "remover-admin" | "adicionar-avaliador-software" | "remover-avaliador-hardware" | "remover-avaliador-software")  => {
        try{
            setTextoLoader("Salvando...");

            let tipoAvaliador:TipoAvaliador = usuarioAEditar?.tipoAvaliador;

            if(operacao.includes("avaliador")){
                if(usuarioAEditar?.tipoAvaliador?.includes("hardware") && usuarioAEditar?.tipoAvaliador?.includes("software")){
                    if(operacao.includes("remover-avaliador-hardware")){
                        tipoAvaliador = "software";
                    }else if(operacao.includes("remover-avaliador-software")){
                        tipoAvaliador = "hardware";
                    }
                }else if(usuarioAEditar?.tipoAvaliador?.includes("hardware")){
                    if(operacao.includes("remover-avaliador-hardware")){
                        tipoAvaliador = "";
                    }else if(operacao.includes("adicionar-avaliador-software")){
                        tipoAvaliador = "software/hardware";
                    }
                }else if(usuarioAEditar?.tipoAvaliador?.includes("software")){
                    if(operacao.includes("remover-avaliador-software")){
                        tipoAvaliador = "";
                    }else if(operacao.includes("adicionar-avaliador-hardware")){
                        tipoAvaliador = "software/hardware";
                    }
                }else{
                    if(operacao.includes("adicionar-avaliador-software")){
                        tipoAvaliador = "software";
                    }else if(operacao.includes("adicionar-avaliador-hardware")){
                        tipoAvaliador = "hardware";
                    }
                }
            }
            
           

            let administrador:boolean = usuarioAEditar!.admin;

            if(operacao.includes("admin")){
                if(operacao.includes("remover")){
                    administrador = false;
                }else{
                    administrador = true;
                }
            }

            if(operacao.includes("remover") && usuarioAEditar?.id === auth.currentUser?.uid){
                throw new Error("Você não pode remover os previlégios da sua própria conta.");
            }

            setUsuarioAEditar({...usuarioAEditar!, tipoAvaliador: tipoAvaliador as TipoAvaliador, admin: administrador});

            await updateDoc(doc(db, "usuarios", usuarioAEditar!.id||""), {admin: administrador, tipoAvaliador: tipoAvaliador});

            buscarUsuarios();
            
            setProjeto(undefined);
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
     * Exclui o projeto e suas evidências do banco de dados
     */
    const excluirProjeto = (projetoAExcluir: IProjeto)=>{
        Alert.alert(
            'Alerta',
            'Tem certeza que deseja excluir o projeto "' + projetoAExcluir.nome+'" e todas as evidências atreladas a ele?',
            [{
                text: 'CANCELAR',
            },
            {
                text: 'Excluir',
                onPress: async () => {
                    setTextoLoader("Excluindo "+projetoAExcluir.nome+"...");
                    // Exclui as evidências
                    const consulta = query(collection(db, "evidencias"), where("projetoId", "==", projetoAExcluir.id));
                    const docsRegistros = await getDocs(consulta);
                    docsRegistros.forEach(async (documento) => {
                        await deleteDoc(doc(db, "evidencias", (documento.data() as IEvidencia).id!));
                    });
                    // Exclui o projeto
                    await deleteDoc(doc(db, "projetos", projetoAExcluir.id!));
                    buscarProjetos();
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
            {usuario && usuario.admin &&
                <>
                    <TouchableOpacity onPress={()=>setModalAdminVisivel(true)} style={styles.containerBotaoMenu}>
                        <Image style={{width: '100%', height: '100%'}} source={require("../../assets/icones/menu.png")}></Image>
                    </TouchableOpacity>

                    <ModalPersonalizado modalVisivel={modalAdminVisivel} posicao='inferior' onClose={()=>setModalAdminVisivel(false)} onPressBotao={()=>{setModalAdminVisivel(false)}} tituloBotao='Fechar' tituloModal={"GERENCIAR USUÁRIOS"} descricaoModal='Use essa lista para definir administradores ou especialistas.'>
                        {usuarioAEditar &&

                            <ModalPersonalizado modalVisivel={usuarioAEditar!=undefined} posicao='central' onClose={()=>setUsuarioAEditar(undefined)} onPressBotao={()=>{setUsuarioAEditar(undefined)}} tituloBotao='Fechar' tituloModal={usuarioAEditar?.nome} descricaoModal='O que deseja alterar nesse usuário?'>
                                {usuarioAEditar!.tipoAvaliador?.includes("software") === true ? 
                                    <Botao  style={styles.acaoUsuarioPerigo} titulo='Remover Especialidade (Software)' onPress={()=>alterarUsuario("remover-avaliador-software")}/> 
                                    : 
                                    <Botao style={styles.acaoUsuario} titulo='Definir como Especialista (Software)' onPress={()=>alterarUsuario("adicionar-avaliador-software")}/>
                                }

                                {usuarioAEditar!.tipoAvaliador?.includes("hardware") === true ? <Botao  style={styles.acaoUsuarioPerigo} titulo='Remover Especialidade (Hardware)' onPress={()=>alterarUsuario("remover-avaliador-hardware")}/> : <Botao  style={styles.acaoUsuario} titulo='Definir como Especialista (Hardware)' onPress={()=>alterarUsuario("adicionar-avaliador-hardware")}/> }

                                {usuarioAEditar!.admin === false ? <Botao style={styles.acaoUsuario} titulo='Definir como Administrador' onPress={()=>alterarUsuario("adicionar-admin")}/> : <Botao style={styles.acaoUsuarioPerigo} titulo='Remover Administrador' onPress={()=>alterarUsuario("remover-admin")}/>}
                            </ModalPersonalizado>

                        }

                        <InputPersonalizado placeholder='🔍 Pesquisar usuário...' value={palavraPesquisaUsuarios} onChangeText={(valor)=>setPalavraPesquisaUsuarios(valor)}/>

                        <View style={styles.cardUsuarios}>
                            <FlatList
                                style={styles.listaUsuarios}
                                data={usuarios}
                                renderItem={({item, index}) => 
                                <View key={item.id} style={[styles.containerItemUsuarios, { borderBottomWidth: index===usuarios.length-1?0:1}]}>
                                    <Texto style={{flex: 1}}>{item.nome}</Texto>
                                    
                                    {item.admin && <Image resizeMode='contain' source={require('./../../assets/icones/admin.png')} style={styles.iconeUsuario}/>}
                                    {item.tipoAvaliador?.includes("software") && <Image resizeMode='contain' source={require('./../../assets/icones/software.png')} style={styles.iconeUsuario}/>}
                                    {item.tipoAvaliador?.includes("hardware") && <Image resizeMode='contain' source={require('./../../assets/icones/hardware.png')} style={styles.iconeUsuario}/>}

                                    <Botao onPress={()=>setUsuarioAEditar(item)} style={styles.botaoConfig} iconeEsquerda='config' />
                                </View>
                            }
                                keyExtractor={item => item.id!}
                            />
                        </View>
                    </ModalPersonalizado>
                </>
            }
            <View style={styles.container}>
                <HideWithKeyboard>
                    <Image style={styles.logo} resizeMode='contain' source={require('../../assets/imagens/logo.png')}/> 
                </HideWithKeyboard>
                <Texto style={styles.textoBemVindo}>Seja bem-vindo ao AppSCE!</Texto>

                <View style={styles.card}>
                    <View style={styles.cabecalhoCard}>
                        <BarraDePesquisa onChangeText={(valor)=>setPalavraPesquisa(valor)} value={palavraPesquisa} titulo='Projetos cadastrados' placeholder='🔍 Pesquisar...' onAlterarVisibilidade={(callback) => (alterarVisibilidadeRef.current = callback)} />
                        <Botao iconeEsquerda={'pesquisar'} style={styles.botaoPesquisar} onPress={()=>alternarVisibilidade()}/>
                        <Botao iconeEsquerda={'adicionar'} style={styles.botaoAdicionar} onPress={()=>setProjeto({id: "", nome: "", uid: ""})}/>
                    </View>

                    <View style={styles.containerLista}>

                        {projetos.length > 0
                        ?
                            <FlatList
                                style={{width: '100%'}}
                                data={projetos}
                                renderItem={({item, index}) => <ItemLista key={item.id} titulo={item.nome} onPressVisualizar={() => navigation.navigate('evidencias', item)} style={index % 2 !== 0 && styles.itemListaCor} onPressEditar={()=>setProjeto(item)} onPressApagar={()=>excluirProjeto(item)}/>}
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
                                        <Texto style={styles.textos}>Nenhum projeto encontrado.</Texto><Texto style={styles.textos}>Os projetos cadastrados aparecerão aqui.</Texto>
                                    </HideWithKeyboard>
                                </View>
                                <HideWithKeyboard>
                                    <Botao titulo="Cadastrar projeto" onPress={()=>setProjeto({id: "", nome: "", uid: ""})} />
                                </HideWithKeyboard>
                            </View>
                        </>
                        }

                    </View>
                </View>

            </View>

            <ModalPersonalizado modalVisivel={projeto !== undefined} onClose={()=>setProjeto(undefined)} onPressBotao={()=>salvarProjeto()} posicao='inferior' tituloBotao={projeto?.id!=""?'Salvar':"Cadastrar"} tituloModal={(projeto?.id!=""?'Editar':"Cadastrar")+' projeto'} descricaoModal='Descreva um nome para o seu projeto.'>
                <InputPersonalizado placeholder='Nome do projeto' titulo='Nome do projeto' value={projeto?.nome} onChangeText={(valor)=>setProjeto({...projeto!, nome: valor})} />
            </ModalPersonalizado>

            <HideWithKeyboard>
                <Botao titulo="Sair" style={styles.botaoSair} onPress={()=>sair()}/>
            </HideWithKeyboard>

            <Loader texto={textoLoader}/>
        </LinearGradient>
    )
}
