import { LinearGradient } from 'expo-linear-gradient';
import { cores } from '../../themes/cores';
import { styles } from './styles';
import { Animated, Dimensions, Image, StyleProp, TextInput, TextInputProps, TextStyle, View } from 'react-native';
import Texto from '@/src/components/texto';
import { useEffect, useRef, useState } from 'react';
import InputPersonalizado from '../inputPersonalizado';

interface IPropsInput extends TextInputProps{
    titulo?: string,
}

export default function BarraDePesquisa({
    onAlterarVisibilidade,
    ...props
}: IPropsInput & { onAlterarVisibilidade?: (callback: () => void) => void }) {
    const animatedWidth = useRef(new Animated.Value(0)).current;
    const [visibilidadePesquisa, setVisibilidadePesquisa] = useState(false);
    const inputRef = useRef<TextInput>(null);



    useEffect(() => {
        if (onAlterarVisibilidade) {
            // Exponha uma função que alterna visibilidade
            onAlterarVisibilidade(() => {
                if (!visibilidadePesquisa) {
                    setVisibilidadePesquisa(true);
                    if(inputRef.current){
                        inputRef.current.focus();
                    }
                    Animated.timing(animatedWidth, {
                        toValue: Dimensions.get('window').width * 0.573, // Largura total
                        duration: 300,
                        useNativeDriver: false,
                    }).start();
                } else {
                    setVisibilidadePesquisa(false);
                    Animated.timing(animatedWidth, {
                        toValue: 0, // Oculta o campo
                        duration: 300,
                        useNativeDriver: false,
                    }).start();
                }
            });
        }
    }, [onAlterarVisibilidade, visibilidadePesquisa, animatedWidth]);

    return (
        <View style={{ flex: 1, alignItems: 'flex-end', height: 40, marginRight: 2 }}>
            <Texto style={styles.titulo}>{props.titulo}</Texto>
            <Animated.View style={{ width: animatedWidth, overflow: 'hidden' }}>
                <InputPersonalizado ref={inputRef} onChangeText={props.onChangeText} value={props.value} placeholder={props.placeholder}/>
            </Animated.View>
        </View>
    );
}
