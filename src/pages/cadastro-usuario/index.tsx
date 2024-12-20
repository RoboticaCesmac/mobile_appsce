import { Pressable, Image,  View, ToastAndroid, ScrollView } from 'react-native';
import { useState } from 'react';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import Checkbox from 'expo-checkbox';

import InputPersonalizado from '@/src/components/inputPersonalizado';
import { Botao } from '@/src/components/botao';
import Texto from '@/src/components/texto';
import Loader from '@/src/components/loader';

import { IUsuario } from '@/src/interfaces/usuario';
import { useNavigation } from 'expo-router';
import { RootStackParamList } from '@/src/navigations';
import { auth, db } from '@/src/config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import traduzirErro from '@/src/util/firebasePTBR';

import { LinearGradient } from 'expo-linear-gradient';
import { cores } from '../../themes/cores';
import { styles } from './styles';

export default function TelaCadastroUsuario(){
    const navigation = useNavigation<RootStackParamList>();
    const [estadoLoading, setEstadoLoading] = useState<string>("");
    
    const [usuario, setUsuario] = useState<IUsuario>({nome: "", email: "", senha: "", confirmarSenha: "", avaliador: false, admin: false, tipoAvaliador: ""});

    /**
     * Salva o cadastro do usuário no banco de dados Cloud Firestore
     */
    const salvarCadastro = async () => {
        try{
            setEstadoLoading("Cadastrando...");
            
            if(usuario.confirmarSenha === "" || usuario.confirmarSenha !== usuario.senha){
                throw new Error("As senhas não conferem!");
            }else if(usuario.nome === ""){
                throw new Error("Insira seu nome!");
            }

            const credencial = await createUserWithEmailAndPassword(auth, usuario.email, usuario.senha || "");
            usuario.id = credencial.user.uid;

            // Atualiza no banco de dados
            await setDoc(doc(db, "usuarios", usuario.id!), {nome: usuario.nome, id: usuario.id, email: usuario.email, admin: usuario.admin, avaliador: usuario.avaliador, tipoAvaliador: usuario.tipoAvaliador});

            ToastAndroid.show("Seja bem-vindo(a), " + usuario.nome + "!", ToastAndroid.LONG);

            // Redireciona para o menu
            navigation.navigate("projetos");
        }catch(erro:any){
            ToastAndroid.show(erro.name==="Error"?erro.message:traduzirErro(erro.message), ToastAndroid.LONG);
        }finally{
            setEstadoLoading("");
        }
    }

    return(
        <ScrollView style={{minHeight: '100%', backgroundColor: cores.fundoGradiente1}}>
            <LinearGradient colors={[cores.fundoGradiente1, cores.fundoGradiente2]} style={styles.pagina}>
                <View style={styles.container}>

                    <Image style={styles.logo} resizeMode='contain' source={require('../../assets/imagens/logo.png')}/> 
                    <Texto style={styles.titulo}>CADASTRO</Texto>

                    <View style={styles.card}>
                        <InputPersonalizado autoCapitalize='none' value={usuario.email} onChangeText={(valor)=>setUsuario({...usuario, email: valor})} keyboardType='email-address' titulo='E-mail' placeholder='nome@email.com'/>
                        
                        <InputPersonalizado value={usuario.nome} onChangeText={(valor)=>setUsuario({...usuario, nome: valor})}  keyboardType='default' titulo='Nome' placeholder='Nome'/>
                        
                        <InputPersonalizado value={usuario.senha} onChangeText={(valor)=>setUsuario({...usuario, senha: valor})}  secureTextEntry={true} titulo='Senha' placeholder='*******'/>
                        
                        <InputPersonalizado value={usuario.confirmarSenha} onChangeText={(valor)=>setUsuario({...usuario, confirmarSenha: valor})}  style={{marginBottom: 18}} secureTextEntry={true} titulo='Confirmar senha' placeholder='*******'/>

                        <Botao titulo="Cadastrar" style={styles.botao} onPress={()=>salvarCadastro()}/>

                        <Texto style={styles.textos}>Já tem cadastrado? <Texto style={styles.links} onPress={()=>navigation.navigate('autenticacao')}>Entre</Texto></Texto>
                    </View>
                    
                </View>
                <Loader texto={estadoLoading}/>
            </LinearGradient>
        </ScrollView>
    )
}
