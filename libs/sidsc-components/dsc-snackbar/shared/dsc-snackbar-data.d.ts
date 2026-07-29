export type DscSnackbarVariant = 'success' | 'danger' | 'warning' | 'info';
export type DscSnackbarActionButton = {
    label: string;
    actionFunction: Function;
};
export interface DscSnackbarData {
    message: string;
    showIcon?: boolean;
    variant: DscSnackbarVariant;
    button?: DscSnackbarActionButton;
}
