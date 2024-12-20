import { StyleSheet, Dimensions } from 'react-native';
import { cores } from '../../themes/cores';
import { globalStyles } from '../../themes/global';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
    ...globalStyles,

    containerInput: {
        width: '100%',
    },

    input: {
        height: 40,
        backgroundColor: cores.backgroundInput,
        borderStyle: 'solid',
        borderRadius: 6,
        borderWidth: 2,
        borderColor: cores.bordaContainer,
        paddingHorizontal: 10,
        paddingBottom: 9,
        marginBottom: 5
    },
    
    icone: {
        position: 'absolute',
        right: 15,
        top: 10,
        height: 23,
        width: 23
    },

    pressableSelect: {
        zIndex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
    },

    // Modal do Select
    checkbox: {
        marginVertical: 5
    },
});