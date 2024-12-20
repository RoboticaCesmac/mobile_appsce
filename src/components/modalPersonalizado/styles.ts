import { StyleSheet } from 'react-native';
import { cores } from '../../themes/cores';

export const styles = StyleSheet.create({
    fundo: {
        width: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderBottomEndRadius: 0,
        borderBottomLeftRadius: 0,
    },
    
    modal: {
        backgroundColor: cores.backgroundInput,
        width: '80%',
        padding: 25,
        borderRadius: 10,
        borderBottomEndRadius: 0,
        borderBottomLeftRadius: 0,
    },

    cabecalho: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    titulo: {
        textAlign: 'center',
        fontWeight: "600",
        flex: 1
    },

    iconeFechar: {
        position: 'absolute',
        top: -10,
        right: "0%",
        color: cores.textoEscuro,
        fontSize: 26
    },

    descricao: {
        width: "100%",
        alignSelf:  "center",
        marginVertical: 10,
        textAlign: "justify"
    },

    botao: {
        marginVertical: 10,
        paddingHorizontal: 20,
        alignSelf: "center",
        height: 40,
        borderRadius: 5,
        backgroundColor: cores.botaoPrimario,
        borderWidth: 1,
        borderColor: cores.bordaBotaoPrimario,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: "center"
    },
    textoBotao: {
        color: cores.texto,
        fontWeight: "600"
    },
    iconeBotao: {
        color: cores.texto,
        fontSize: 20,
        marginRight: 10
    }
});