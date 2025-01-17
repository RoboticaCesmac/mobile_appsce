import {StyleProp, ViewStyle, Image,  TextStyle, TextProps, TouchableOpacity } from 'react-native';
import Texto from '@/src/components/texto';
import { iconeType, icones } from '@/src/types/icones';

import { styles } from './styles';
import { cores } from '@/src/themes/cores';

interface IBotaoProps extends TextProps {
    iconeEsquerda?: iconeType,
    iconeDireita?: iconeType,
    titulo?: string,
    textColor?: string
}

/**
 * Componente de botao
 */
export function Botao(props: IBotaoProps){
    return(
        <TouchableOpacity disabled={props.disabled} {...props} style={[styles.botao, props.style as StyleProp<ViewStyle>]}>
            {props.iconeEsquerda && <Image style={styles.icone} resizeMode='contain' source={icones[props.iconeEsquerda]} /> }
            {props.titulo && <Texto style={[styles.textoBotao, {color: props.textColor ? props.textColor : cores.texto},  {fontSize: props.style?(props.style as TextStyle).fontSize:styles.textoBotao.fontSize}]}>{props.titulo}</Texto>}
            {props.iconeDireita && <Image style={styles.icone} resizeMode='contain' source={icones[props.iconeDireita]} /> }
        </TouchableOpacity>
    );
}