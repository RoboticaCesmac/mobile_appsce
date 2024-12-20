import { ReactNode } from "react";
import { Text, TextProps, View, Image, TouchableOpacity } from "react-native";

interface ITexto extends TextProps {
    children?: ReactNode,
}

/**
 * Componente de texto com configuração padrão
 */
export default function Texto(props: ITexto){
    return(
        <Text {...props} numberOfLines={props.numberOfLines ? props.numberOfLines : 1} allowFontScaling={false}>{props.children}</Text>
    )
}