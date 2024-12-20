import { ActivityIndicator, Modal, Text, View } from 'react-native';
import { cores } from '../../themes/cores';
import Texto from '../texto';
import { LinearGradient } from 'expo-linear-gradient';

interface ILoader{
    texto: string
}

/**
 * Animação de carregamento de tela
 */
export default function Loader(props: ILoader){
    return(
        <>
            <Modal transparent animationType='fade' visible={props.texto !== ""}>
                <LinearGradient colors={['#00000000', '#000000dd']} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <View style = {
                        {padding: 20, 
                        paddingHorizontal: 30, 
                        backgroundColor: cores.texto, 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        borderRadius: 20,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,

                        elevation: 5,
                        }}>
                        <ActivityIndicator color={cores.textoEscuro} size={100}/>
                        <Texto style={{color: cores.textoEscuro}}>{props.texto}</Texto>
                    </View>
                </LinearGradient>
            </Modal>
        </>
    )
}
