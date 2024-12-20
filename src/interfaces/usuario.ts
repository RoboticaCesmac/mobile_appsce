/**
 * Interface de usuário
 */
export interface IUsuario{
    id?: string,
    email: string,
    admin: boolean,
    avaliador: boolean,
    tipoAvaliador: TipoAvaliador,
    nome: string,
    senha?: string,
    confirmarSenha?: string
}

export type TipoAvaliador = "software" | "hardware" | "software/hardware" | undefined | "";