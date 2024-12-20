import { Dimensions, StyleSheet } from 'react-native';
import { cores } from './cores';

export const globalStyles = StyleSheet.create({
    pagina: {
        flex: 1,
        minHeight: '100%'
    },
    
    logo: {
        width: Dimensions.get('window').width * 0.6, height: Dimensions.get('screen').width * 0.35
    }
});