import { DscSnackbarData } from './dsc-snackbar-data';
export type DscSnackbarVerticalPosition = 'top' | 'bottom';
export type DscSnackbarHorizontalPosition = 'start' | 'center' | 'end' | 'left' | 'right';
export interface DscSnackbarConfig {
    verticalPosition?: DscSnackbarVerticalPosition;
    horizontalPosition?: DscSnackbarHorizontalPosition;
    duration?: number;
    data: DscSnackbarData;
}
