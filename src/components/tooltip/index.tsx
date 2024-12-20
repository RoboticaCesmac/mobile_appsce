import { Image, StyleProp, TextInput, TextInputProps, TextStyle, View, Text, Modal, FlatList, Pressable, Dimensions } from 'react-native';
import { useState, forwardRef, LegacyRef, useEffect, useRef } from 'react';

import Texto from '@/src/components/texto';
import { Botao } from '@/src/components/botao';
import ModalPersonalizado from '@/src/components/modalPersonalizado';
import CheckboxPersonalizado from '@/src/components/checkboxPersonalizado';

import { iconeType, icones } from '@/src/types/icones';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { cores } from '../../themes/cores';
import { Mascara, usarMascara } from '@/src/util/mascaras';

export interface ITooltip {
    visivel: boolean,
    texto: string
}
/**
 * Componente de input personalizado
 */
const Tooltip = (props: ITooltip) => {

    return(
        <>
        {props.visivel &&
            <View style={{position: 'absolute', zIndex: 999, right: 3, top: 10}}>
                <View style={{
                    position: 'absolute', 
                    elevation: 999,
                    zIndex: 999,
                    top: 10, 
                    right: -5, 
                    width: 0,
                    height: 0,
                    borderLeftWidth: 10, // Metade da base do triângulo
                    borderRightWidth: 10, // Metade da base do triângulo
                    borderBottomWidth: 20, // Altura do triângulo
                    borderLeftColor: "transparent",
                    borderRightColor: "transparent",
                    borderBottomColor: cores.backgroundInput, 
                    
                }}/>
                <View style={{
                    position: 'absolute', 
                    elevation: 997,
                    zIndex: 997,
                    top: 7, 
                    right: -7, 
                    width: 0,
                    height: 0,
                    borderLeftWidth: 12, // Metade da base do triângulo
                    borderRightWidth: 12, // Metade da base do triângulo
                    borderBottomWidth: 25, // Altura do triângulo
                    borderLeftColor: "transparent",
                    borderRightColor: "transparent",
                    borderBottomColor: cores.textoEscuro, 
                    
                }}></View>
                <View style={{
                    position: 'fixed',
                    elevation: 998,
                    zIndex: 998,
                    top: 28, 
                    right: -15, 
                    width: Dimensions.get('window').width * 0.8,
                    backgroundColor: cores.backgroundInput, 
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10
                }}>
                    <Text allowFontScaling={false} style={{textAlign: 'justify'}}>{props.texto}</Text>
                </View>
            </View>
        }
        </>
    )

};

export default Tooltip;