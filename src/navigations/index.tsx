import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StackNavigationProp, createStackNavigator } from "@react-navigation/stack";
import { IProjeto } from '@/src/interfaces/projeto';

import TelaAutenticacao from "../pages/autenticacao";
import TelaCadastroUsuario from "../pages/cadastro-usuario";
import TelaProjeto from "../pages/projetos"
import TelaEvidencias from "../pages/evidencias"
import TelaCadastroEvidencia from "../pages/cadastro-evidencia"
import { IEvidencia } from "../interfaces/evidencia";

const Stack = createStackNavigator();

export type RootStackParamList = StackNavigationProp<{
  autenticacao: undefined,
  cadastroUsuario: undefined,
  projetos: undefined,
  cadastroProjeto: undefined,
  evidencias: IProjeto,
  cadastroEvidencia: INavigationCadastroEvidencia
}>;

export interface INavigationCadastroEvidencia{
  evidencia: IEvidencia | undefined,
  projeto: IProjeto
}

export const NavegacaoPrincipal = () => (
    <Stack.Navigator initialRouteName="autenticacao" screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}>
        <Stack.Screen name="autenticacao" component={TelaAutenticacao} />
        <Stack.Screen name="cadastroUsuario" component={TelaCadastroUsuario} />
        <Stack.Screen name="projetos" component={TelaProjeto} />
        <Stack.Screen name="evidencias" component={TelaEvidencias} />
        <Stack.Screen name="cadastroEvidencia" component={TelaCadastroEvidencia} />
    </Stack.Navigator>
);