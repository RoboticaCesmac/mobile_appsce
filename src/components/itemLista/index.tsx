import { useState, useEffect } from 'react';
import { Image,  View, ViewProps, ScrollView, Animated, useAnimatedValue, Easing, Pressable } from 'react-native';
import { Botao } from '../botao';
import Texto from '../texto';
import { medalhaType } from '@/src/types/icones';

import { styles } from './styles';

interface IItemProjeto extends ViewProps {
    medalha?: medalhaType,
    titulo: string,
    onPressVisualizar?: () => void,
    onPressImprimir?: () => void,
    onPressEditar?: () => void,
    onPressApagar?: () => void
}

/**
 * Componente ItemLista
 */
export function ItemLista(props: IItemProjeto){

    const [larguraTexto, setLarguraTexto] = useState<number>(0);
    const [larguraScroll, setLarguraScroll] = useState<number>(0);
    const animacaoScroll = useAnimatedValue(0);

    /**
     * Inicia a animação do scroll ao carregar o componente
     */
    useEffect(() => {
        if(larguraTexto > larguraScroll){
            Animated.loop(
                Animated.timing(animacaoScroll,
                    {
                        toValue: -(larguraTexto),
                        easing: Easing.linear,
                        duration: 10000,
                        useNativeDriver: true
                    }
                )
            ).start();
        }
    }, [larguraTexto, larguraScroll]);

    /**
     * Salva a largura do texto
     */
    const onTextLayout = (event: any) => {
        const larguraTexto = event.nativeEvent.layout.width;
        setLarguraTexto(larguraTexto);
    }

    /**
     * Salva a largura do scroll
     */
    const onScrollLayout = (event: any) => {
        const larguraScroll = event.nativeEvent.layout.width;
        setLarguraScroll(larguraScroll);
    }

    return(
        <View {...props} style={[styles.itemProjeto, props.style]}>
            {(props.medalha !== undefined && props.medalha.toString() !== "") &&
                <Image style={styles.iconeMedalha} resizeMode='contain' source={props.medalha === 'bronze' ? require('../../assets/icones/medalha-bronze.png') : props.medalha === 'cobre' ? require('../../assets/icones/medalha-cobre.png') : props.medalha === 'ouro' ? require('../../assets/icones/medalha-ouro.png') : require('../../assets/icones/medalha-prata.png')}/>
            }

                {/* Texto com scroll automático por meio de animação */}
                <ScrollView horizontal={true} scrollEnabled={true} showsHorizontalScrollIndicator={false} onLayout={onScrollLayout} style={styles.scrollItemLista} onTouchEnd={props.onPressVisualizar}>
                    
                    <Animated.View style={{transform: [{translateX: animacaoScroll}]}}>
                        <Texto onLayout={onTextLayout} style={[styles.tituloProjeto, {paddingVertical: 17, minWidth: larguraScroll}, 
                                larguraTexto > larguraScroll ? {paddingLeft: larguraScroll} : {paddingLeft: 10}]}>{props.titulo}</Texto>
                    </Animated.View>

                </ScrollView>

            {props.onPressImprimir !== undefined && <Botao iconeEsquerda='imprimir' style={[styles.botaoIcone, styles.botaoAmarelo]} onPress={props.onPressImprimir} />}
            <Botao iconeEsquerda='editar' style={styles.botaoIcone} onPress={props.onPressEditar} />
            <Botao iconeEsquerda='apagar' style={[styles.botaoIcone, styles.botaoVermelho]} onPress={props.onPressApagar} />
        </View>    
    );
}