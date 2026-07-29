export interface Option {
    label: string;
    value?: any;
    options?: Option[];
    icon?: string;
    disabled?: boolean;
}
