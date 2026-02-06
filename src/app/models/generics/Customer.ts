export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Customer {
    id?: number;
    name?: string;
    country?: Country;
    company?: string;
    date?: Date | string;
    status?: string;
    representative?: Representative;
    verified?: boolean;
    activity?: number;
    balance?: number;
}
