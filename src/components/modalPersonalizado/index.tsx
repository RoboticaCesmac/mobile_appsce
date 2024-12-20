import { ReactNode } from 'react';
import { Modal, View, Text, Pressable, Button, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { cores } from '../../themes/cores';
import { styles } from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import { Botao } from '../botao';

interface IModalPersonalizado{
    modalVisivel: boolean,
    posicao: "inferior" | "central",
    tituloModal?: string,
    descricaoModal?: string,
    iconeBotao?: keyof typeof MaterialIcons.glyphMap
    tituloBotao: string,
    onPressBotao: VoidFunction,
    children?: ReactNode,
    onClose: VoidFunction
}

/**
 * Modal personalizado
 * @returns 
 */
export default function ModalPersonalizado(props: IModalPersonalizado){
    const estiloPosicao:any = {
        justifyContent: "flex-end",
        borderBottomEndRadius: 10,
        borderBottomLeftRadius: 10,

    }

    return(
        <Modal animationType="slide" transparent={true}  visible={props.modalVisivel} onRequestClose={() => {}}>
            <LinearGradient style={[styles.fundo, props.posicao==="inferior"?estiloPosicao:{}]} colors={["#00000000", "#000000aa"]}>
                <View style={[styles.modal, props.posicao!=="inferior"?estiloPosicao:{}]}>
                        <View style={styles.cabecalho}>
                            {props.tituloModal &&
                                <Text allowFontScaling={false} style={styles.titulo}>{props.tituloModal}</Text>
                            }
                            <MaterialIcons name={'close'} style={styles.iconeFechar} onPress={props.onClose} />
                        </View>

                    <Text allowFontScaling={false} style={styles.descricao}>{props.descricaoModal}</Text>
                    
                    {props.children}

                    {props.tituloBotao &&
                        <TouchableOpacity style={[styles.botao, props.posicao==="inferior"?{width: "100%"}:{}]} onPress={props.onPressBotao}>
                            {props.iconeBotao !== undefined &&
                                <MaterialIcons style={styles.iconeBotao} name={props.iconeBotao}/>
                            }
                            <Text allowFontScaling={false} style={styles.textoBotao}>{props.tituloBotao}</Text>
                        </TouchableOpacity>
                    }
                </View>
            </LinearGradient>
        </Modal>
    );
}