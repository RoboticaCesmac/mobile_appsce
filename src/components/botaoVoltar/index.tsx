import { styles } from './styles';
import { Image, TouchableOpacity, View } from 'react-native';
import Texto from '@/src/components/texto';
import { useNavigation } from 'expo-router';
import { RootStackParamList } from '@/src/navigations';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

interface IBotaoVoltar{
    onPress?: VoidFunction | void
}

export default function BotaoVoltar(props: IBotaoVoltar){
    const navigation = useNavigation<RootStackParamList>();
    return(
        <HideWithKeyboard>
            <TouchableOpacity style={styles.botao} onPress={props.onPress!==undefined?props.onPress:()=>navigation.goBack()}>
                <Image style={{width: 15, height: 20}} source={require('../../assets/icones/voltar.png')}></Image>
                <Texto style={styles.textoBotao}>Voltar</Texto>
            </TouchableOpacity>
        </HideWithKeyboard>
    )
}
