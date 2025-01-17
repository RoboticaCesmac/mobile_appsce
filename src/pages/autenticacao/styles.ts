import { StyleSheet } from 'react-native';
import { cores } from '../../themes/cores';
import { globalStyles } from '../../themes/global';

export const styles = StyleSheet.create({
    ...globalStyles,
    container:{
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    
    titulo:{
        color: cores.texto,
        fontFamily: 'inter',
        fontWeight: '700',
        fontSize: 25,
        marginTop: 30
    },

    card:{
        padding: 25,
        width: '85%', 
        backgroundColor: cores.backgroundCard, 
        borderRadius: 10, 
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        elevation: 5,
    },

    checkboxContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },

    checkbox: {
        margin: 8
    },
    
    botao: {
        minWidth: '100%',
        marginTop: 5,
        marginBottom: 10,
    },

    textos:{
        color: cores.textoEscuro,
        fontSize: 12,
    },
    
    links:{
        color: cores.bordaBotaoPrimario,
        fontWeight: 'bold'
    }

});