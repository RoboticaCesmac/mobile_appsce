import { Dimensions, StyleSheet } from 'react-native';
import { cores } from '../../themes/cores';
import { globalStyles } from '../../themes/global';

export const styles = StyleSheet.create({
    ...globalStyles,
    container:{
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    
    textoBemVindo:{
        color: cores.texto,
        fontFamily: 'inter',
        fontWeight: '700',
        fontSize: 16,
        marginTop: 30
    },

    titulo:{
        color: cores.textoEscuro,
        fontSize: 20,
        flex: 1,
        fontWeight: '500'
    },

    cabecalhoCard: {
        // backgroundColor: "blue",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },

    card:{
        padding: 15,
        paddingTop: 10,
        width: '85%', 
        backgroundColor: cores.backgroundCard, 
        borderRadius: 10, 
        marginTop: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        elevation: 5,
        height: Dimensions.get('window').height * 0.47
    },

    botaoPesquisar: {
        width: 40,
        height: 40,
        borderWidth: 1,
        marginRight: 2,
        backgroundColor: cores.fundoGradiente2,
        borderColor: cores.bordaContainer
    },

    textos:{
        textAlign: 'center',
        color: cores.textoEscuro,
        fontSize: 12,
    },
    
    links:{
        color: cores.bordaBotaoPrimario,
        fontWeight: 'bold'
    },

    containerLista: {
        backgroundColor: cores.backgroundInput, 
        borderStyle: 'solid', 
        borderWidth: 1, 
        borderRadius: 8, 
        borderColor: cores.textoEscuro, 
        flex: 1,
        width: '100%', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 8,
    },

    botaoAdicionar: {
        width: 40,
        height: 40,
        borderWidth: 1
    },

    containerListaVazia: {
        padding: 20,
        width: '100%',
        flex: 1
    },

    flexCenter: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    botaoSair: {
        width: '25%',
        borderColor: cores.texto,
        backgroundColor: 'transparent',
        alignSelf: 'center',
        marginBottom: 30
    },
    botaoImprimir: {
        width: 'auto',
        height: 'auto',
        fontSize: 15,
        paddingVertical: 1,
        marginTop: 12,
        paddingHorizontal: 20,
    }

});