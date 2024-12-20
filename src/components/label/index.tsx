import { ReactNode, useState } from "react";
import { Text, TextProps, View, Image, TouchableOpacity } from "react-native";

import Texto from '@/src/components/texto';
import Tooltip from '../tooltip';

import { styles } from './styles';

interface ITexto extends TextProps {
    children?: ReactNode,
    texto?: string,
    tooltipTexto?: string,
}

/**
 * Componente label
 */
export function Label(props: ITexto){
    const [tooltipVisivel, setTooltipVisivel] = useState<boolean>(false);

    return(
        <View style={styles.containerLabel}>
            {(props.texto || props.children) && <Texto style={[styles.label]}>{props.texto || props.children}</Texto>}

            {props.tooltipTexto !== undefined &&
                <TouchableOpacity onPressIn={()=>setTooltipVisivel(true)} onPressOut={()=>setTooltipVisivel(false)} style={styles.containerIcone}>
                    <Image source={require("./../../assets/icones/dica.png")} style={styles.iconeTooltip}/>
                </TouchableOpacity>
            }

            <Tooltip visivel={tooltipVisivel} texto={props.tooltipTexto || ""}/>
        </View>
    )
}