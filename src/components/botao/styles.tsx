import { StyleSheet, Dimensions } from 'react-native';
import { cores } from '../../themes/cores';
import { globalStyles } from '../../themes/global';

export const styles = StyleSheet.create({
    ...globalStyles,

    botao: {
        elevation: 9999,
        zIndex: 9999,
        width: '100%',
        height: 40,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: cores.bordaBotaoPrimario,
        backgroundColor: cores.botaoPrimario,
        alignItems: 'center',
        justifyContent: 'center'
    },
    
    textoBotao: {
        textAlign: 'center',
        color: cores.texto,
        fontSize: 20,
        fontWeight: 'bold'
    },

    icone: {
        height: "60%",
        width: "60%"
    }
});