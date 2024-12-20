import { StyleSheet } from 'react-native';
import { cores } from '../../themes/cores';

export const styles = StyleSheet.create({
    containerCheckbox: {
        flexDirection: "row",
        alignItems: "center"
    },

    checkbox: {
        borderWidth: 3,
        borderColor: cores.bordaContainer
    },

    descricaoItem: {
        marginLeft: 10
    }
});