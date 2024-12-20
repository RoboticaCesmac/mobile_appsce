import { StatusBar } from 'react-native';
import { NavegacaoPrincipal } from "../src/navigations";
import { cores } from '../src/themes/cores';

export default function App() {
  return(
    <>
      <StatusBar backgroundColor={cores.statusbar} barStyle={'light-content'} />
      <NavegacaoPrincipal />
    </>
  )
}
