import { StyleSheet } from 'react-native';
import { cores } from '../../themes/cores';
import { globalStyles } from '../../themes/global';

export const styles = StyleSheet.create({
    ...globalStyles,
   botao: {flexDirection: 'row', width: 80, justifyContent: 'space-between', alignItems: 'center', position: 'absolute', bottom: 20, left: 20},
   textoBotao: {color: cores.texto, fontSize: 20},
   
});