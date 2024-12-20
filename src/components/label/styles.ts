import { StyleSheet, Dimensions } from 'react-native';
import { cores } from '../../themes/cores';
import { globalStyles } from '../../themes/global';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
    ...globalStyles,

    containerLabel: {
        flexDirection: 'row',
        flex: 1,
        maxHeight: 20
    },

    label: {
        fontWeight: 'bold',
        flex: 1,
        
    },

    containerIcone: {
        width: 15,
        height: 15
    },

    iconeTooltip: {
        width: 15,
        height: 15,
        position: 'absolute',
        right: 0
    },
});