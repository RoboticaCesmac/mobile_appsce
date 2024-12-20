import { StyleSheet, Dimensions } from 'react-native';
import { cores } from '../../themes/cores';
import { globalStyles } from '../../themes/global';

export const styles = StyleSheet.create({
    ...globalStyles,

    itemProjeto: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingEnd: 8,
    },
    
    iconeMedalha: {
        width: 30,
        height: 30
    },

    scrollItemLista: {
        height: '100%'
    },

    tituloProjeto: {
        flex: 1,
        fontSize: 17,
        fontWeight: '500',
        textAlignVertical: 'center'
    },

    botaoIcone: {
        marginHorizontal: 1,
        width: 40,
        height: 40,
        borderWidth: 1,
        margin: 8
    },

    botaoAmarelo: {
        backgroundColor: cores.alerta,
        borderColor: cores.alertaBorda
    },

    botaoVermelho: {
        backgroundColor: cores.perigo,
        borderColor: cores.perigoBorda
    }
});