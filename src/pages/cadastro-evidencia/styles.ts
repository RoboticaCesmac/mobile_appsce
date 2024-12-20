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

    containerMedalha:{
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: "center"
    },

    containerAvaliador:{
        width: "100%", 
        borderWidth: 2, 
        borderColor: cores.bordaContainer, 
        backgroundColor: cores.backgroundInput, 
        justifyContent: 'center', 
        alignItems: "center", 
        padding: 10, 
        borderRadius: 5, 
        marginBottom: 10
    },

    tituloAvaliador: {
        fontWeight: 'bold', 
        fontSize: 20, 
        textAlign: 'center'
    },

    iconeMedalha:{
        width: 50, 
        height: 60
    },

    botaoDesativado: {
        marginTop: 10, 
        backgroundColor:cores.desativadoBorda, 
        borderColor: cores.desativado, 
        color: cores.desativado
    },

    
    titulo1:{
        color: cores.texto,
        fontFamily: 'inter',
        fontWeight: '700',
        fontSize: 21,
        marginTop: 30,
        marginBottom: 60
    },

    titulo2:{
        textAlign: 'center',
        color: cores.texto,
        fontFamily: 'inter',
        fontWeight: '700',
        fontSize: 21,
        marginTop: -40,
    },

    tituloSelo:{
        color: cores.texto,
        fontFamily: 'inter',
        fontWeight: '700',
        fontSize: 21,
    },

    inputErro:{
        borderColor: "#f00"
    },

    textoErro:{
        color: "#f00"
    },

    card:{
        backgroundColor: cores.backgroundCard, 
        borderRadius: 10, 
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        elevation: 5,
        maxHeight: Dimensions.get('window').height * 0.8,
    },

    containerScroll:{ width: "85%", justifyContent: "center"},

    cardScroll:{
        padding: 25,
        width: '100%', 
        backgroundColor: cores.backgroundCard, 
        borderRadius: 10, 
        // marginTop: 10,
        // justifyContent: 'center',
        // alignItems: 'center',
        shadowColor: "#000",
        // elevation: 5,
        maxHeight: Dimensions.get('window').height * 0.8,
        // overflowY:'scroll',
    },

    cardScrollContent:{
        // marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    textos:{
        color: cores.textoEscuro,
        fontSize: 12,
    },

    checkboxContainer:{
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 15,
        // overflow: 'hidden'
    },
    
    links:{
        color: cores.bordaBotaoPrimario,
        fontWeight: 'bold'
    },

    botao: {
        marginTop: 10,
        marginBottom: 10,
    },

    medalha: {
        alignSelf: 'center',
        width: Dimensions.get('window').width * 0.3,
        height: Dimensions.get('window').width * 0.43
    },

    tituloEvidencia: {
        
    },

    botaoCancelar: {
        backgroundColor: cores.perigo,
        borderColor: cores.perigoBorda,
        marginTop: 10,
    }

});