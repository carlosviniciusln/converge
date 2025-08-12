
export interface Login {
    accessToken: string;
    expiresIn: number;
    coMatricula: string;
    noUsuario: string;
    nuUsuario: number;
    noPerfil: string;
    claims: Claim[];
}

export interface Claim {
    type: string;
    value: string;
}
