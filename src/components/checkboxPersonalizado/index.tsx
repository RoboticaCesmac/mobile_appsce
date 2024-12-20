import { View, Text } from 'react-native';
import Checkbox, { CheckboxProps } from 'expo-checkbox';

import { cores } from '../../themes/cores';
import { styles } from './styles';

interface ICheckBoxPersonalizado extends CheckboxProps {
    label?: string,
    corLabel?: string
}

export default function CheckboxPersonalizado(props: ICheckBoxPersonalizado){
    return(
        <View style={[styles.containerCheckbox, props.style]}>
            <Checkbox {...props} color={props.value !== undefined ? cores.bordaContainer : undefined} style={styles.checkbox} />
            {props.label !== undefined && <Text style={[styles.descricaoItem, { color: props.corLabel }]} onPress={() => {props.onValueChange !== undefined && props.onValueChange(true)}}>{props.label}</Text>}
        </View>
    );
}