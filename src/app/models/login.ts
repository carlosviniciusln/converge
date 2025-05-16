
export interface Login {
    accessToken: string;
    expiresIn: number;
    coMatricula: string;
    noUsuario: string;
    nuUsuario: number;
    claims: Claim[];
}

export interface Claim {
    type: string;
    value: string;
}
