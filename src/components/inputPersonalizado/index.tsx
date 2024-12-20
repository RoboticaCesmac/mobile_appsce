import { Image, StyleProp, TextInput, TextInputProps, TextStyle, View, Text, Modal, FlatList, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import { useState, forwardRef, LegacyRef, useEffect, useRef } from 'react';

import Texto from '@/src/components/texto';
import { Botao } from '@/src/components/botao';
import { Label } from '@/src/components/label';
import ModalPersonalizado from '@/src/components/modalPersonalizado';
import CheckboxPersonalizado from '@/src/components/checkboxPersonalizado';

import { iconeType, icones } from '@/src/types/icones';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { cores } from '../../themes/cores';
import { styles } from './styles';
import { Mascara, usarMascara } from '@/src/util/mascaras';
import Tooltip from '../tooltip';

export interface IItemSelect {
    valor: string
    descricao: string
}

interface IPropsInput extends TextInputProps{
    style?: StyleProp<TextStyle>,
    titulo?: string,
    mascara?: Mascara,
    tooltipTexto?: string,
    
    // Itens do Select
    itensSelect?: IItemSelect[],
    valoresSelecionadosSelect?: string[],
    multiplasSelecoes?: boolean,
    onValueChange?: (itensSelecionados: string[]) => void,
    onSalvarSelect?: (itensSelecionados: string[]) => void,
}

/**
 * Componente de input personalizado
 */
const InputPersonalizado = forwardRef<TextInput, IPropsInput>((props: IPropsInput, ref) => {
    const [modalVisivel, setModalVisivel] = useState<boolean>(false);
    const [tooltipVisivel, setTooltipVisivel] = useState<boolean>(false);
    const [valorItensSelecionados, setValorItensSelecionados] = useState<string[]>(props.valoresSelecionadosSelect || []);
    const [labelItensSelecionados, setLabelItensSelecionados] = useState<string>("");

    // Exibe o label correspondente a descrição do item no select quando o valor é alterado
    useEffect(()=>{
        let listaItensSelecionados:string[] = [];
        valorItensSelecionados.forEach((valor:string) => {
            props.itensSelect?.forEach((item: any)=>{
                if(item.valor === valor){
                    listaItensSelecionados.push(item.descricao);
                }
            })
        });
        setLabelItensSelecionados(listaItensSelecionados.join(", "));
    }, [valorItensSelecionados]);

    useEffect(()=>{
        if(props.valoresSelecionadosSelect)
            setValorItensSelecionados(props.valoresSelecionadosSelect);
    }, [props.valoresSelecionadosSelect])

    /**
     * Abre o modal com os itens do select
     */
    const onPressSelect= () => {
        setModalVisivel(true);
    }

    /**
     * Seleciona ou remove o item do array de itensSelecionados e retorna o array
     * para a função definida pela propriedade onValueChange.
     * @param itemPressionado 
     */
    const atualizarSelect = (valorItemPressionado: string) => {
        let valorItensMarcados: string[] = valorItensSelecionados;

        // Remove o item se ele já estava selecionado
        const indexItem = valorItensMarcados.findIndex((item) => item == valorItemPressionado);
        if(indexItem > -1){
            valorItensMarcados.splice(indexItem, 1);
        }else{
            // Se for múltiplas seleções e já tiver algum item selecionado, então zera o array antes de adicionar o novo.
            if(props.multiplasSelecoes === undefined || props.multiplasSelecoes === false && valorItensMarcados.length > 1){
                valorItensMarcados = [];
            }

            valorItensMarcados.push(valorItemPressionado);
        }

        setValorItensSelecionados([...valorItensMarcados]);
        // Retorna os itens selecionados para o onValueChange passado por parâmetro do componente
        if(props.onValueChange !== undefined){
            props.onValueChange(valorItensMarcados);
        }
    }

    /**
     * Checa se o item foi selecionado. Marca true se o item existir e false se não existir
     * @param id 
     * @returns 
     */
    const checarSeItemSelecionado = (valor: string): boolean => {
        // console.log(valorItensSelecionados);
        return valorItensSelecionados.findIndex((valorItem) => valorItem == valor) > -1;
    }


    /**
     * Retorna os itens salvos do select
     */
    const salvarItens = () => {
        setModalVisivel(false);

        // Retorna os itens selecionados para o onSalvar passado por parâmetro do componente
        if(props.onSalvarSelect !== undefined){
            props.onSalvarSelect(valorItensSelecionados);
        }
    }

    return(
        <>
            {/* Label */}
            <Label texto={props.titulo} tooltipTexto={props.tooltipTexto} />
            
            {/* Input */}
            <View style={styles.containerInput}>
                {props.itensSelect && props.itensSelect.length > 0 &&
                    <Pressable style={styles.pressableSelect} onPress={() => onPressSelect()} />
                }

                <TextInput {...props} ref={ref} allowFontScaling={false} 
                    value={props.itensSelect === undefined ? props.mascara ? usarMascara(props.mascara, props.value!) : props.value : labelItensSelecionados} onChangeText={props.onChangeText} style={[styles.input, props.style, props.multiline?{textAlignVertical: 'top'}:{textAlignVertical: 'center'}]} 
                    editable={props.itensSelect === undefined} />

                {props.itensSelect && props.itensSelect.length > 0 &&
                    <Image style={styles.icone} resizeMode='contain' source={icones['expandir']} />
                }
            </View>

            {/* Modal do select - aberto ao clicar no input */}
            <ModalPersonalizado modalVisivel={modalVisivel} tituloModal={props.titulo} tituloBotao='Salvar' descricaoModal='Selecione os itens' onClose={()=>setModalVisivel(false)} onPressBotao={() => salvarItens()} posicao='inferior'>
                <FlatList data={props.itensSelect} renderItem={({item, index}) => 
                    <CheckboxPersonalizado key={index} label={item.descricao} value={checarSeItemSelecionado(item.valor)} onValueChange={() => atualizarSelect(item.valor)} style={styles.checkbox} />
                } />
            </ModalPersonalizado>
        </>
    )

    
});

export default InputPersonalizado;