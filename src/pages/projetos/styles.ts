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
        fontWeight: '500',
        textAlignVertical: 'center',
        alignSelf: 'flex-start',
        position: 'absolute',
        height: 40
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

    textos:{
        color: cores.textoEscuro,
        fontSize: 12,
    },
    
    links:{
        color: cores.bordaBotaoPrimario,
        fontWeight: 'bold'
    },

    containerLista: {
        overflow: 'hidden',
        backgroundColor: cores.backgroundInput, 
        borderStyle: 'solid', 
        borderWidth: 1, 
        borderRadius: 8, 
        borderColor: cores.textoEscuro, 
        flex: 1,
        width: '100%', 
        alignItems: 'center', 
        marginTop: 8,
    },

    botaoAdicionar: {
        width: 40,
        height: 40,
        borderWidth: 1
    },

    botaoPesquisar: {
        width: 40,
        height: 40,
        borderWidth: 1,
        marginRight: 2,
        backgroundColor: cores.fundoGradiente2,
        borderColor: cores.bordaContainer
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

    botaoConfig: {
        width: 40, 
        height: 40
    },

    itemListaCor: {
        backgroundColor: cores.backgroundInputSecundario
    },

    iconeUsuario:{
        width: 20, 
        height: 20, 
        marginHorizontal: 5
    },

    barraDePesquisa:{
        marginRight: 2,
        marginTop: 4
    },

    cardUsuarios: {
        borderWidth: 1, 
        borderRadius: 5, 
        overflow: 'hidden'
    },

    listaUsuarios:{
        width: '100%', 
        maxHeight: Dimensions.get('window').height * 0.6
    },

    containerItemUsuarios:{
        flexDirection: 'row', 
        padding: 10, 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },

    acaoUsuario:{
        fontSize: 12,
        marginVertical: 5
    },

    acaoUsuarioPerigo:{
        fontSize: 12, 
        backgroundColor: cores.perigo, 
        borderColor: cores.perigoBorda,
        marginVertical: 5
    },
    containerBotaoMenu:{
        width: 30, 
        height: 30, 
        position: 'absolute', 
        right: 20, 
        top: 20
    }

});