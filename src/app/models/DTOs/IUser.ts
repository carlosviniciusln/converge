import { Claim } from "../login";

export interface IUser {
    accessToken: string;
    expiresIn: number;
    coMatricula: string;
    noUsuario: string;
    nuUsuario: number;
    noPerfil: string;
    coUnidade : string;
    claims: Claim[];
}
