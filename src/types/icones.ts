import { ImageSourcePropType } from 'react-native';

export type iconeType = 'logomarca' | "editar" | "apagar" | "visualizar" | "voltar" | "imprimir" | "adicionar" | "pesquisar" | "expandir" | "config";

/**
 * Mapeia os nomes do ícones para o caminho dos arquivos
*/
export const icones: Record<iconeType, ImageSourcePropType> = {
    logomarca: require('../assets/imagens/logo.png'),
    editar: require('../assets/icones/editar.png'),
    apagar: require('../assets/icones/apagar.png'),
    visualizar: require('../assets/icones/visualizar.png'),
    voltar: require('../assets/icones/voltar.png'),
    imprimir: require('../assets/icones/imprimir.png'),
    adicionar: require('../assets/icones/adicionar.png'),
    pesquisar: require('../assets/icones/pesquisar.png'),
    expandir: require('../assets/icones/expandir.png'),
    config: require('../assets/icones/config.png')
};

export type medalhaType = "ouro" | "prata" | "bronze" | "cobre";

/**
 * Mapeia os nomes das medalhas para o caminho dos arquivos
*/
export const medalhas: Record<medalhaType, ImageSourcePropType> = {
    ouro: require('../assets/icones/medalha-ouro.png'),
    prata: require('../assets/icones/medalha-prata.png'),
    bronze: require('../assets/icones/medalha-bronze.png'),
    cobre: require('../assets/icones/medalha-cobre.png')
}