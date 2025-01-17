import { Image,  View, ToastAndroid, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import InputPersonalizado from '@/src/components/inputPersonalizado';
import { Botao } from '@/src/components/botao';
import Texto from '@/src/components/texto';
import Checkbox from 'expo-checkbox';
import Loader from '@/src/components/loader';
import ModalPersonalizado from '@/src/components/modalPersonalizado';

import { useNavigation } from 'expo-router';
import { RootStackParamList } from '@/src/navigations';

import { ILogin } from '@/src/interfaces/dados';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/src/config/firebase';
import traduzirErro from '@/src/util/firebasePTBR';

import { LinearGradient } from 'expo-linear-gradient';
import { cores } from '../../themes/cores';
import { styles } from './styles';

export default function TelaAutenticacao(){
    const navigation = useNavigation<RootStackParamList>();
    const [modalVisivel, setModalVisivel] = useState<boolean>(false);
    const [estadoLoading, setEstadoLoading] = useState<string>("");
    
    const [dados, setDados] = useState<ILogin>({email: "", senha: "", lembrar: false});

    /**
     * Ao iniciar a página, adiciona um listener para checar a autenticação do usuário
     */
    useEffect(() => {
        carregarEmailLembrado();
        // Listener chamado quando a autenticação do firebase é alterada
        const desinscreverListener = onAuthStateChanged(auth, (user) => {
            // Se o usuário estiver autenticado, redireciona o usuário para o menu
            if(user !== null){
                navigation.navigate("projetos");
            }
        });

        return desinscreverListener;
    }, []);

    const carregarEmailLembrado = async()=>{
        let emailLembrado = await AsyncStorage.getItem('emailLembrado');
        if(emailLembrado !== null){
            setDados({...dados, email: emailLembrado, lembrar: true});
        }
    }

    /**
     * Autentica usuário com o authentication do firebase
     */
    const autenticar = async () => {
        try{
            setEstadoLoading("Autenticando...");
            const credencial = await signInWithEmailAndPassword(auth, dados.email, dados.senha);
            if(dados.lembrar === true){
                await AsyncStorage.setItem('emailLembrado', dados.email);
            }else{
                await AsyncStorage.removeItem('emailLembrado');
            }
        }catch(erro:any){
            console.log("Erro " + erro)
            ToastAndroid.show(erro.name==="Error"?erro.message:traduzirErro(erro.message), ToastAndroid.LONG);
        }finally{
            setEstadoLoading("");
        }
    }

    /**
     * Envia um e-mail para a redefinição de senha do firebase auth
     */
    const redefinirSenha = async () => {
        try{
            setEstadoLoading("Enviando e-mail...");

            // Verifica se existe conta com o e-mail informado
            const consulta = query(collection(db, "usuarios"), where("email", "==", dados.email));
            const resultadoConsulta = await getDocs(consulta);
            if(resultadoConsulta.size === 0){
                throw new Error("Não existe uma conta cadastrada com o e-mail informado");
            }

            // Envia um e-mail de redefinição de senha
            await sendPasswordResetEmail(auth, dados.email);
            
            // Fecha o modal de redefinição e abre o de conclusão
            setModalVisivel(false);
            ToastAndroid.show("Verifique seu e-mail e siga as instruções para redefinir a senha!", 5000);
        }catch(erro:any){
            // Traduz se for um erro do firebase e apenas imprime o erro se não for.
            ToastAndroid.show(erro.name==="Error" ? erro.message : traduzirErro(erro.message), ToastAndroid.LONG);
        }finally{
            setEstadoLoading("");
        }
    }

    return(
        <ScrollView style={{minHeight: '100%', backgroundColor: cores.fundoGradiente1}}>
            <LinearGradient colors={[cores.fundoGradiente1, cores.fundoGradiente2]} style={styles.pagina}>
                <View style={styles.container}>
                    <Image style={styles.logo} resizeMode='contain' source={require('../../assets/imagens/logo.png')}/> 
                    <Texto style={styles.titulo}>LOGIN</Texto>

                    <View style={styles.card}>
                        <InputPersonalizado returnKeyType="next" autoCapitalize='none' value={dados.email} onChangeText={(valor)=>setDados({...dados, email: valor})} keyboardType='email-address' titulo='E-mail' placeholder='exemplo@email.com'/>
                        
                        <InputPersonalizado returnKeyType="go" onSubmitEditing={()=>autenticar()} autoCapitalize='none' value={dados.senha} onChangeText={(valor)=>setDados({...dados, senha: valor})} secureTextEntry={true} titulo='Senha' placeholder='*******'/>

                        <View style={styles.checkboxContainer}>
                            <Checkbox  onValueChange={()=>setDados({...dados, lembrar: !dados.lembrar})} value={dados.lembrar} style={styles.checkbox} color={dados.lembrar ? cores.botaoPrimario : cores.bordaContainer}/>
                            <Texto style={styles.textos}>Lembrar e-mail</Texto>
                        </View>
                        
                        <Botao titulo="Entrar" style={styles.botao} onPress={()=>autenticar()}/>

                        <Texto style={styles.textos}>Não tem conta? <Texto style={styles.links} onPress={()=>navigation.navigate('cadastroUsuario')}>Cadastre-se</Texto></Texto>
                        
                        <Texto style={[styles.textos, {marginTop: 7}]}>Esqueceu sua senha? <Texto onPress={()=>setModalVisivel(true)} style={styles.links}>Recuperar</Texto></Texto>
                    </View>
                </View>

                <Loader texto={estadoLoading}/>
            </LinearGradient>

            <ModalPersonalizado tituloModal='Recuperar Senha' descricaoModal='Insira seu e-mail para receber um link com istruções para alterar a sua senha.' modalVisivel={modalVisivel} posicao='inferior' tituloBotao='Enviar' onPressBotao={()=>redefinirSenha()} onClose={()=>setModalVisivel(false)}>
                <InputPersonalizado value={dados.email} onChangeText={(valor)=>setDados({...dados, email: valor})} titulo='E-mail'/>
            </ModalPersonalizado>
        </ScrollView>
    )
}
